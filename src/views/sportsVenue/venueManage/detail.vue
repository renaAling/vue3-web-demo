<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<div class="container mx-auto p-5">
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
						<el-button type="primary" @click="handleLock">锁场模式</el-button>
					</el-col>
				</el-row>

				<!-- 今日运动类型 -->
				<div class="bg-[#f3f7ff] px-4 mb-4">
					<el-tabs v-model="selectedSport" @tab-click="handleClick">
						<el-tab-pane :label="item.name" :name="item.code" v-for="(item, index) in sports" :key="index" />
					</el-tabs>
				</div>

				<!-- 场地预订表格 -->
				<div class="overflow-x-auto">
					<el-table
						:data="filteredVenues"
						border
						:cell-style="{ textAlign: 'center', padding: '0' }"
						:header-cell-style="{
							background: '#fff',
							color: 'var(--el-text-color-primary)',
						}"
					>
						<el-table-column prop="stadiumConfigSubName" label="场地" width="120" align="center" fixed />
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
											<el-popover placement="top" :width="300" trigger="click" :visible="row.popoverVisible?.[index]" v-if="slot.status === 2">
												<template #reference>
													<div
														class="h-full w-full flex items-center justify-center py-8 relative"
														:class="getTimeSlotClass(slot)"
														@click="handleCellClick(row, slot, index)"
													>
														<span class="text-xs absolute" v-if="slot.isAttendance">
															{{ getTimeSlotText(slot) }}
														</span>
													</div>
												</template>
												<div class="p-3" v-if="row.popoverData?.[index]">
													<h3 class="text-lg font-semibold text-gray-800 mb-2">{{ row.stadiumConfigSubName }}</h3>
													<div class="grid grid-cols-2 gap-y-2">
														<div class="text-gray-600">员工姓名：</div>
														<div>{{ row.popoverData?.[index].booking.employeeName }}</div>
														<div class="text-gray-600">员工号：</div>
														<div>{{ row.popoverData?.[index].booking.userJobNum }}</div>
														<div class="text-gray-600">联系电话：</div>
														<div>{{ row.popoverData?.[index].booking.employeeMobile }}</div>
														<div class="text-gray-600">预订时段：</div>
														<div>{{ slot.startTime.substring(0, 5) }} - {{ slot.endTime.substring(0, 5) }}</div>
													</div>
													<div class="flex justify-end gap-2 mt-3">
														<el-button @click="handleClose(row, index)"> 收起 </el-button>
														<el-button
															type="primary"
															@click="confirmAttendance(row, slot, index)"
															:loading="row.confirmingAttendance"
															v-if="!slot.isAttendance"
														>
															确认到场
														</el-button>
													</div>
												</div>
											</el-popover>
											<!-- 其他状态时段 -->
											<div v-else class="h-full w-full flex items-center justify-center py-8 relative" :class="getTimeSlotClass(slot)">
												<span class="text-xs absolute">
													<!-- {{ getTimeSlotText(slot) }} -->
												</span>
											</div>
										</template>
									</div>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
				</div>

				<!-- 员工预订信息表格 -->
				<div>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						row-key="orderCode"
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column prop="employeeName" label="员工姓名" />
						<el-table-column prop="userJobNum" label="员工号" />
						<el-table-column prop="employeeMobile" label="手机号" />
						<el-table-column prop="stadiumName" label="预订场地" />
						<el-table-column prop="stadiumDate" label="预订时间" />
						<el-table-column prop="status" label="状态" width="120">
							<!-- 5-待开始，6-已完成，7-已取消 -->
							<template #default="{ row }">
								<el-tag v-if="row.status === 5">待开始</el-tag>
								<el-tag v-else-if="row.status === 6">已完成</el-tag>
								<el-tag v-else-if="row.status === 7">已取消</el-tag>
								<el-tag v-else-if="row.status === 10">不可用</el-tag>
								<span v-else>-</span>
							</template>
						</el-table-column>
						<el-table-column prop="isAttendance" label="是否到场">
							<template #default="{ row }">
								{{ row.isAttendance ? '已到场' : '-' }}
							</template>
						</el-table-column>
						<el-table-column label="操作" width="190">
							<template #default="{ row }">
								<el-button type="primary" link v-if="row.status < 7 && !row.isAttendance" @click="handleAttendance(row)">确认到场</el-button>
								<el-button type="primary" link v-if="row.status < 6 && !row.isAttendance" @click="cancelBooking(row)">取消订单</el-button>
								<el-button type="primary" link @click="viewDetails(row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
				</div>
				<OrderDetailDialog v-model="dialogVisible" :row="currentRow" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { ElTag, ElTable, ElTableColumn, ElButton, ElMessageBox, ElMessage, ElPopover, TabsPaneContext } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	stadiumSiteLabelApi,
	stadiumSiteDetailApi,
	orderPageApi,
	stadiumSiteDetailCodeApi,
	confirmAttendanceApi,
	cancelOrderApi,
	orderDetailApi,
} from '/@/api/sportsVenue/index';

const OrderDetailDialog = defineAsyncComponent(() => import('../components/orderDetailDialog.vue'));

const route = useRoute();
const router = useRouter();
// 日期相关
const shortcuts = [
	{
		text: '今天',
		value: new Date(),
	},
];

// 运动类型
const sports = ref();
const selectedSport = ref();

// 后端数据
const formattedTimeSlots = ref<string[]>([]);
const venues = ref<any[]>([]);

const currentDate = ref<string>(dayjs().format('YYYY-MM-DD'));
const changeDate = (val: any) => {
	currentDate.value = val;
	state.queryForm.stadiumDate = val;
	initData();
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: orderPageApi,
	queryForm: {
		stadiumCode: route.query.code,
		stadiumConfigCode: selectedSport.value,
		stadiumDate: currentDate.value,
		status: 11, // 只查出已完成和待开始
	},
	dataList: [],
	createdIsNeed: false,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 计算属性
const filteredVenues = computed(() => {
	return venues.value;
});

const getStadiumSiteLabel = async () => {
	const res = await stadiumSiteLabelApi(route.query.code as string);
	sports.value = res.data;
	selectedSport.value = sports.value[0].code;
	state.queryForm.stadiumConfigCode = sports.value[0].code;
	getDataList();
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

// 获取时间段样式
const getTimeSlotClass = (slot: any) => {
	if (slot.status === 1) {
		return 'bg-white border-gray-200 cursor-not-allowed';
	} else if (slot.status === 3) {
		return 'bg-red-100 border-red-200 cursor-not-allowed';
	} else if (slot.status === 10) {
		return 'bg-gray-100 border-gray-200 cursor-not-allowed';
	} else if (slot.status === 2) {
		return {
			'bg-green-100 border-green-200': true,
			'cursor-pointer': !slot.isAttendance,
			'cursor-not-allowed': slot.isAttendance,
		};
	} else {
		return 'bg-gray-100 border-gray-200 cursor-not-allowed';
	}
};

// 获取时间段文本
const getTimeSlotText = (slot: any) => {
	if (slot.status === 1) return '未预定';
	if (slot.status === 3) return '已锁场';
	if (slot.status === 10) return '已过期';
	if (slot.status === 2) return slot.isAttendance ? '已到场' : '已预订';
	return '未知';
};

// 处理单元格点击
const handleCellClick = async (venue: any, slot: any, index: number) => {
	if (!venue.popoverVisible) {
		venue.popoverVisible = [];
	}
	if (!venue.popoverData) {
		venue.popoverData = [];
	}

	venue.popoverVisible[index] = true;

	// 模拟获取预订详情
	if (!venue.popoverData[index]) {
		try {
			const { data } = await stadiumSiteDetailCodeApi(slot.code);
			venue.popoverData[index] = {
				booking: { ...data },
			};
		} catch (error) {
			console.error('获取预订详情失败', error);
			venue.popoverVisible[index] = false;
			ElMessage.error('获取预订详情失败');
		}
	}
};

// 关闭popover
const handleClose = (venue: any, index: number) => {
	venue.popoverVisible[index] = false;
};

// 确认到场
const confirmAttendance = async (venue: any, slot: any, index: number) => {
	try {
		venue.confirmingAttendance = true;

		await ElMessageBox.confirm('确认员工已到场吗？', '确认到场', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
		});

		const orderCode = venue.popoverData[index]?.booking.orderCode;
		await confirmAttendanceApi(orderCode);

		ElMessage.success('已确认到场');
		venue.popoverVisible[index] = false;
		initData();
		getDataList();
	} catch (error: any) {
		ElMessage.error(error?.msg || '取消确认到场');
	} finally {
		venue.confirmingAttendance = false;
	}
};

// 表单里的确认到场
const handleAttendance = (row: any) => {
	ElMessageBox.confirm('确认员工已到场吗？', '确认到场', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	}).then(async () => {
		const res = await confirmAttendanceApi(row.orderCode);
		if (res?.ok) {
			initData();
			getDataList();
		}
	});
};

// 取消预订
const cancelBooking = (row: any) => {
	ElMessageBox.confirm('确定要取消此预订吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			const res = await cancelOrderApi(row.orderCode);
			if (res?.ok) {
				initData();
				getDataList();
			}
		})
		.catch(() => {
			// 取消操作
		});
};

// 查看详情
const dialogVisible = ref(false);
const currentRow = ref();
const viewDetails = async (row: any) => {
	dialogVisible.value = true;
	const { data } = await orderDetailApi(row.orderCode);
	currentRow.value = { ...data };
};

// 选择运动类型
const handleClick = (sport: TabsPaneContext) => {
	selectedSport.value = sport.props.name;
	state.queryForm.stadiumConfigCode = sport.props.name;
	initData();
	getDataList();
};

const handleLock = () => {
	const row = {
		code: route.query.code,
		name: route.query.name,
	};
	router.push({ path: '/sportsVenue/venueManage/lock', query: { code: row.code, name: row.name } });
};

onMounted(async () => {
	await getStadiumSiteLabel();
	initData();
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

/* 气泡框内容样式 */
.el-popover {
	.el-button {
		margin-top: 10px;
	}
}

/* 确保单元格高度一致 */
:deep(.el-table td) {
	height: 60px;
}

/* 时间段单元格样式 */
.time-slot-cell {
	position: relative;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;

	.time-slot-text {
		position: absolute;
		font-size: 12px;
	}
}
</style>
