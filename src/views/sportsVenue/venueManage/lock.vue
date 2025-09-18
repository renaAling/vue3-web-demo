<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto;">
			<div class="container mx-auto p-5 overflow-auto" style="height: calc(100% - 150px)">
				<!-- 头部标题和日期 -->
				<el-row class="mb-4">
					<el-col :span="8" class="text-[16px]">
						<span class="text-l font-bold text-gray-800 mr-4">场地使用情况</span>
						<el-date-picker
							v-model="currentDate"
							type="date"
							value-format="YYYY-MM-DD"
							:clearable="false"
							:shortcuts="shortcuts"
							@change="changeDate"
						/>
					</el-col>
					<el-col :span="8" class="text-xl text-center">{{ route.query.name }}</el-col>
					<el-col :span="8" class="text-right">
						<el-button type="primary" @click="handleLock">退出锁场模式</el-button>
					</el-col>
				</el-row>

				<!-- 今日运动类型 -->
				<div class="bg-[#f3f7ff] px-4 mb-4">
					<el-tabs v-model="selectedSport" :before-leave="tabLeave">
						<el-tab-pane :label="item.name" :name="item.code" v-for="(item, index) in sports" :key="index" />
					</el-tabs>
				</div>
				<div class="my-4 text-[#E6A23C] text-center">点击勾选未预定的场次，可进行锁场；勾选已锁定的场次，可进行解锁。</div>
				<!-- 场地预订表格 -->
				<div class="overflow-x-auto mb-4">
					<el-table
						:data="filteredVenues"
						border
						:cell-style="{ textAlign: 'center', padding: '0' }"
						:header-cell-style="{
							background: '#fff',
							color: 'var(--el-text-color-primary)',
						}"
					>
						<el-table-column prop="stadiumConfigSubName" label="场地" width="160" align="center" fixed>
							<template #default="{ row }">
								<div class="flex flex-col items-center">
									<span>{{ row.stadiumConfigSubName }}</span>
									<div>
										<el-checkbox
											v-model="row.selectAllAvailable"
											:indeterminate="row.isIndeterminateAvailable"
											@change="(val: boolean) => handleSelectAllAvailable(row, val)"
											size="small"
										>
											未预定
										</el-checkbox>
										<el-checkbox
											v-model="row.selectAllLocked"
											:indeterminate="row.isIndeterminateLocked"
											@change="(val: boolean) => handleSelectAllLocked(row, val)"
											size="small"
										>
											已锁场
										</el-checkbox>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="时段">
							<template #header>
								<!-- 状态图例 -->
								<div class="flex gap-4 p-3">
									<span>时段</span>
									<div class="flex items-center gap-1">
										<span class="w-6 h-6 bg-white border border-gray-300 rounded-sm"></span>
										<span class="text-sm text-gray-600">未预定</span>
									</div>
									<div class="flex items-center gap-1">
										<span class="w-6 h-6 bg-green-100 border border-green-300 rounded-sm"></span>
										<span class="text-sm text-gray-600">已预定</span>
									</div>
									<div class="flex items-center gap-1">
										<span class="w-6 h-6 bg-red-100 border border-red-300 rounded-sm"></span>
										<span class="text-sm text-gray-600">已锁场</span>
									</div>
									<div class="flex items-center gap-1">
										<span class="w-6 h-6 bg-gray-100 border border-gray-300 rounded-sm"></span>
										<span class="text-sm text-gray-600">已过期</span>
									</div>
								</div>
							</template>
							<el-table-column v-for="(time, index) in formattedTimeSlots" :key="index" :label="time" min-width="70" align="center">
								<template #default="{ row }">
									<div v-for="slot in row.siteDetails" :key="slot.code">
										<template v-if="slot.startTime.substring(0, 5) === time">
											<!-- 已预订时段显示详情 -->
											<div
												v-if="slot.status === 1 || slot.status === 3"
												class="h-full w-full flex items-center justify-center py-8 relative"
												:class="getTimeSlotClass(slot)"
												@click="handleCellClick(row, slot)"
											>
												<el-icon v-if="isSelected(row, slot)" class="!absolute !text-xl">
													<Check color="green" />
												</el-icon>
											</div>
											<!-- 其他状态时段 -->
											<div v-else class="h-full w-full flex items-center justify-center py-8 relative" :class="getTimeSlotClass(slot)">
												<span class="text-xs absolute" v-html="getTimeSlotText(slot)" />
											</div>
										</template>
									</div>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
				</div>

				<!-- 底部详情展示区域 -->
				<div v-if="selectedTimes.length > 0" class="footer p-2">
					<div class="p-4 flex items-center justify-center flex-wrap" style="height: 100px; overflow: auto;">
						<span class="font-bold">{{ currentDate }}</span>
						<span class="font-bold mx-4">{{ selectedSportName }}</span>
						<div class="text-gray-600 mx-1" v-for="(item, index) in selectedTimes" :key="index">
							{{ item.row.stadiumConfigSubName }} - {{ formatTime(item.slot.startTime) }}~{{ formatTime(item.slot.endTime) }}
						</div>
					</div>

					<div class="flex justify-center">
						<el-button @click="clearSelection">清空选择</el-button>
						<template v-if="canBatchLock">
							<el-button type="primary" @click="batchLock">锁定选中时段</el-button>
						</template>
						<template v-else-if="canBatchUnlock">
							<el-button type="danger" @click="batchUnlock">解锁选中时段</el-button>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { ElTable, ElTableColumn, ElButton, ElMessage, ElMessageBox, TabPaneName } from 'element-plus';
import { Check } from '@element-plus/icons-vue';
import { stadiumSiteLabelApi, stadiumSiteDetailApi, siteUpdateStatusApi } from '/@/api/sportsVenue/index';
import type { DateShortcut, SelectedTime } from './types';

const route = useRoute();
const router = useRouter();

// 日期相关
const currentDate = ref<string>(dayjs().format('YYYY-MM-DD'));
const changeDate = (val: any) => {
	currentDate.value = val;
	initData();
};
const shortcuts: DateShortcut[] = [
	{
		text: '今天',
		value: new Date(),
	},
];

// 运动类型
const sports = ref();
const selectedSport = ref();
const selectedSportName = ref();

// 后端数据
const formattedTimeSlots = ref<string[]>([]);
const venues = ref<any[]>([]);

const getStadiumSiteLabel = async () => {
	const res = await stadiumSiteLabelApi(route.query.code as string);
	sports.value = res.data;
	selectedSport.value = sports.value[0].code;
	selectedSportName.value = sports.value[0].name;
};

// 初始化数据
const initData = async () => {
	const params = {
		stadiumCode: route.query.code,
		stadiumConfigCode: selectedSport.value,
		stadiumDate: currentDate.value,
	};
	try {
		const res2 = await stadiumSiteDetailApi(params);
		if (res2?.ok && res2?.data) {
			formattedTimeSlots.value = res2?.data.timeSlots.map((t: string) => t.substring(0, 5));
			venues.value = res2?.data.configSubDetails.map((venue: any) => ({
				...venue,
				popoverVisible: [],
				popoverData: [],
				confirmingAttendance: false,
			}));
		} else {
			ElMessage.error(res2?.msg || '暂无数据');
			formattedTimeSlots.value = [];
			venues.value = [];
		}
	} catch (error: any) {
		ElMessage.error(error?.msg);
	}
};

// 当前选中的时间段数组
const selectedTimes = ref<SelectedTime[]>([]);

// 计算属性
const filteredVenues = computed(() => {
	return venues.value;
});

// 检查是否全部为可锁定状态（全部未预定）
const canBatchLock = computed(() => {
	return (
		selectedTimes.value.length > 0 &&
		selectedTimes.value.every(
			(item) => item.slot.status === 1 // 状态为1表示未预定
		)
	);
});

// 检查是否全部为可解锁状态（全部已锁场）
const canBatchUnlock = computed(() => {
	return (
		selectedTimes.value.length > 0 &&
		selectedTimes.value.every(
			(item) => item.slot.status === 3 // 状态为3表示已锁场
		)
	);
});

// 获取时间段样式
const getTimeSlotClass = (slot: any) => {
	if (slot.status === 1) {
		return 'bg-white border-gray-200';
	} else if (slot.status === 3) {
		return 'bg-red-100 border-red-200';
	} else if (slot.status === 10) {
		return 'bg-gray-100 border-gray-200 cursor-not-allowed';
	} else if (slot.status === 2) {
		return 'bg-green-100 border-green-200 cursor-not-allowed';
		// return {
		// 	'bg-green-100 border-green-200': true,
		// 	'cursor-pointer': !slot.isAttendance,
		// 	'cursor-not-allowed': slot.isAttendance,
		// };
	} else {
		return 'bg-gray-100 border-gray-200 cursor-not-allowed';
	}
};

const getTimeSlotText = (slot: any) => {
	// if (slot.status === 1) return '未预定';
	// if (slot.status === 3) return '已锁场';
	// if (slot.status === 10) return '已过期';
	if (slot.status === 2) return '已预定<br />不可锁场';
	// return '未知';
};

const formatTime = (time: string) => {
	return time.substring(0, 5);
};

// 检查是否选中（通过时间段对象）
const isSelected = (row: any, slot: any) => {
	return selectedTimes.value.some((item) => item.row.stadiumConfigSubCode === row.stadiumConfigSubCode && item.slot.code === slot.code);
};

// 处理单元格点击
const handleCellClick = (row: any, slot: any) => {
	// 已预定或已过期的单元格不处理
	if (slot.status === 2 || slot.status === 10) {
		return;
	}

	const index = selectedTimes.value.findIndex((item) => item.row.stadiumConfigSubCode === row.stadiumConfigSubCode && item.slot.code === slot.code);

	if (index >= 0) {
		selectedTimes.value.splice(index, 1);
	} else {
		selectedTimes.value.push({ row, slot });
	}

	// 更新全选复选框状态
	updateCheckboxStates(row);
};

// 处理选择所有可用时段
const handleSelectAllAvailable = (row: any, val: boolean) => {
	// 清除该行之前的选中状态
	selectedTimes.value = selectedTimes.value.filter((item) => item.row.stadiumConfigSubCode !== row.stadiumConfigSubCode);

	if (val) {
		// 获取该行所有可用的时段（未预定）
		const availableSlots = row.siteDetails.filter((slot: any) => slot.status === 1);

		// 添加到选中列表
		availableSlots.forEach((slot: any) => {
			selectedTimes.value.push({ row, slot });
		});

		row.selectAllAvailable = true;
		row.isIndeterminateAvailable = false;
	} else {
		row.selectAllAvailable = false;
		row.isIndeterminateAvailable = false;
	}

	// 更新锁定复选框状态
	updateCheckboxStates(row);
};

// 处理选择所有已锁定时段
const handleSelectAllLocked = (row: any, val: boolean) => {
	// 清除该行之前的选中状态
	selectedTimes.value = selectedTimes.value.filter((item) => item.row.stadiumConfigSubCode !== row.stadiumConfigSubCode);

	if (val) {
		// 获取该行所有已锁定的时段
		const lockedSlots = row.siteDetails.filter((slot: any) => slot.status === 3);

		// 添加到选中列表
		lockedSlots.forEach((slot: any) => {
			selectedTimes.value.push({ row, slot });
		});

		row.selectAllLocked = true;
		row.isIndeterminateLocked = false;
	} else {
		row.selectAllLocked = false;
		row.isIndeterminateLocked = false;
	}

	// 更新可用复选框状态
	updateCheckboxStates(row);
};

// 更新复选框状态
const updateCheckboxStates = (row: any) => {
	const availableSlots = row.siteDetails.filter((slot: any) => slot.status === 1);
	const lockedSlots = row.siteDetails.filter((slot: any) => slot.status === 3);

	const selectedAvailable = selectedTimes.value.filter(
		(item) => item.row.stadiumConfigSubCode === row.stadiumConfigSubCode && item.slot.status === 1
	).length;

	const selectedLocked = selectedTimes.value.filter(
		(item) => item.row.stadiumConfigSubCode === row.stadiumConfigSubCode && item.slot.status === 3
	).length;

	// 更新可用复选框状态
	if (selectedAvailable === 0) {
		row.selectAllAvailable = false;
		row.isIndeterminateAvailable = false;
	} else if (selectedAvailable === availableSlots.length) {
		row.selectAllAvailable = true;
		row.isIndeterminateAvailable = false;
	} else {
		row.selectAllAvailable = false;
		row.isIndeterminateAvailable = true;
	}

	// 更新锁定复选框状态
	if (selectedLocked === 0) {
		row.selectAllLocked = false;
		row.isIndeterminateLocked = false;
	} else if (selectedLocked === lockedSlots.length) {
		row.selectAllLocked = true;
		row.isIndeterminateLocked = false;
	} else {
		row.selectAllLocked = false;
		row.isIndeterminateLocked = true;
	}
};

// 清空选择
const clearSelection = () => {
	selectedTimes.value = [];
	venues.value.forEach((row) => {
		row.selectAllAvailable = false;
		row.isIndeterminateAvailable = false;
		row.selectAllLocked = false;
		row.isIndeterminateLocked = false;
	});
};

const batchLock = async () => {
	if (selectedTimes.value.length === 0) return;

	try {
		await ElMessageBox.confirm('锁定后该场次不可被预订，确认锁定吗？', '锁定场次', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
		});

		const codes = selectedTimes.value.map((item) => item.slot.code);
		const res = await siteUpdateStatusApi({ codes, status: 3 });
		if (res?.ok) {
			ElMessage.success(`已锁定 ${selectedTimes.value.length} 个时段`);
			clearSelection();
			initData();
		}
	} catch (error: any) {
		ElMessage.error(error?.msg || '已取消选择');
	}
};

// 批量解锁
const batchUnlock = async () => {
	if (selectedTimes.value.length === 0) return;

	try {
		await ElMessageBox.confirm('解锁后场次将开放，可被用户预订', '解锁场次', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
		});

		const codes = selectedTimes.value.map((item) => item.slot.code);
		const res = await siteUpdateStatusApi({ codes, status: 1 });
		if (res?.ok) {
			ElMessage.success(`已解锁 ${selectedTimes.value.length} 个时段`);
			clearSelection();
			initData();
		}
	} catch (error: any) {
		ElMessage.error(error?.msg || '已取消选择');
	}
};

// 选择运动类型
const tabLeave = async (sport: TabPaneName) => {
	selectedSportName.value = sports.value.find((item: any) => item.code === sport)?.name;
	if (selectedTimes.value.length > 0) {
		await ElMessageBox.confirm('已选的场次将被清空', '切换场地', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
		}).then(() => {
			selectedSport.value = sport as string;
			clearSelection();
			initData();
		});
	} else {
		selectedSport.value = sport as string;
		clearSelection();
		initData();
	}
};

const handleLock = () => {
	router.go(-1);
};

onMounted(async () => {
	await getStadiumSiteLabel();
});
</script>

<style scoped lang="scss">
/* 确保固定列在滚动时保持可见 */
:deep(.el-table__fixed) {
	height: 100% !important;
}

:deep(.el-tabs__header) {
	margin-bottom: 0;
}

:deep(.el-tabs__nav-wrap::after) {
	height: 0 !important;
}

:deep(.el-table--default .cell) {
	padding: 0;
}

.time-slot-cell {
	min-height: 80px;
	position: relative;
}

.footer {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	z-index: 9;
}
</style>
