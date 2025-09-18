<template>
	<div class="layout-padding" style="width: 100%">
		<div class="my-2 flex justify-start cursor-pointer back-icon" @click="toForward">
			<div class="flex icon">
				<el-icon :size="22"><ArrowLeftBold /></el-icon>
			</div>
			<div class="ml-2">返回</div>
		</div>
		<el-scrollbar>
			<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
				<div class="content-title">用户信息</div>
				<div class="flex flex-row">
					<div class="flex justify-start items-center" style="width: 150px">
						<div class="relative avatar">
							<el-avatar :size="84" :src="dataForm.avatar"> </el-avatar>
						</div>
					</div>
					<div class="flex-1 px-2">
						<el-form ref="dataFormRef" :model="dataForm" label-width="86" @keydown.enter.prevent>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">姓名:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.name }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">联系电话:</div>
										<span class="ml-2 text-slate-700">{{ maskedMobile(dataForm.mobile) }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">工号:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.workNumber }}</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">所属机构:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.organizationName }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">所属部门:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.department }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">员工类型:</div>
										<span class="ml-2 text-slate-700" v-if="dataForm.employeeType == 1">内部员工</span>
										<span class="ml-2 text-slate-700" v-if="dataForm.employeeType == 2">委外员工</span>
										<span class="ml-2 text-slate-700" v-if="dataForm.employeeType == 3">见习员工</span>
										<span class="ml-2 text-slate-700" v-if="dataForm.employeeType == 4">充值无管理费人员</span>
										<span class="ml-2 text-slate-700" v-if="dataForm.employeeType == 5">委外单位</span>
										<span class="ml-2 text-slate-700" v-if="dataForm.employeeType == 6">食堂员工</span>
										<span class="ml-2 text-slate-700" v-if="dataForm.employeeType == 7">其他</span>
										<span class="ml-2 text-slate-700" v-if="dataForm.employeeType == 8">外部员工</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">用户ID:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.systemId }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">微信平台openid:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.wechatOpenid || '-' }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">状态:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.status == 1 ? '启用' : '禁用' }}</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20" v-if="dataForm.isExternal == 0">
								<el-col :span="24" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 74px">员工卡余额:</div>
										<div class="flex justify-between ml-2 text-slate-700">
											<div>{{ dataForm.balance ? `${dataForm.balance}元` : '0元' }}</div>
											<span class="ml-2 cursor-pointer text-[#4785ea]" @click="clickDialogVisible()">明细</span>
										</div>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<div class="mr-5" v-if="dataForm.isExternal == 1">
						<el-icon color="#409efc" class="cursor-pointer absolute el_edit" @click="edit(dataForm)">
							<Edit />
						</el-icon>
					</div>
				</div>
			</div>
			<div class="py-2 mt-2 bg-white rounded border-inherit border border-solid boxSizing">
				<div class="content-title mb-2">
					<div>操作日志</div>
				</div>
				<div class="px-4">
					<el-row>
						<el-form :inline="true" :model="queryForm" @keyup.enter="getStaffLogPage(dataForm.isExternal)" ref="queryRef">
							<el-form-item label="操作类型" prop="riskType">
								<el-select v-model="queryForm.riskType" clearable style="width: 180px">
									<el-option v-for="(item, key) in searchFieldType" :key="key" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="时间" prop="userId">
								<el-date-picker
									v-model="searchTime"
									type="daterange"
									range-separator="-"
									start-placeholder="开始时间"
									end-placeholder="结束时间"
									value-format="YYYY-MM-DD"
									style="width: 270px"
									:disabled-date="disabledDate"
								/>
							</el-form-item>
							<el-form-item>
								<el-button @click="getStaffLogPage(dataForm.isExternal)" icon="search" type="primary">查询</el-button>
								<el-button @click="resetQuery" icon="Refresh">重置</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-table
						:data="dataList"
						v-loading="loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column type="index" label="序号" width="60" align="center" />
						<el-table-column label="时间" prop="createTime" />
						<el-table-column label="操作类型" prop="riskTypeName">
							<template #default="{ row }">
								<div v-if="row.riskTypeName">
									<el-tag>{{ row.riskTypeName }}</el-tag>
								</div>
								<div v-else>-</div>
							</template>
						</el-table-column>
						<el-table-column label="登陆ID" prop="unionId" />
						<el-table-column label="操作内容" prop="title" />
					</el-table>
					<el-pagination
						background
						layout="total, sizes, prev, pager, next, jumper"
						:page-sizes="[10, 20, 50, 100, 200]"
						:total="total"
						:page-size="pageSize"
						:current-page="currentPage"
						@size-change="handleSizeChange"
						@current-change="handlePageChange"
					></el-pagination>
					<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
				</div>
			</div>
		</el-scrollbar>
		<formDialog ref="formDialogRef" @refresh="getUserInfoByUidMobileData(dataForm.id)"></formDialog>
		<balanceDialog ref="balanceDialogRef" @refresh="getUserInfoByUidMobileData(dataForm.id)"></balanceDialog>
		<el-dialog v-model="dialogMoneyVisible" title="员工卡余额明细" width="900" @close="closeDialogVisible()">
			<el-scrollbar height="400px">
				<el-table
					border
					:data="dialogDataList"
					v-loading="dialogLoading"
					:cell-style="tableStyle.cellStyle"
					height="400"
					:header-cell-style="tableStyle.headerCellStyle"
				>
					<el-table-column prop="tradeTime" label="时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="类型" show-overflow-tooltip>
						<template #default="{ row }">
							<div v-if="row.tradeType == 1">增加</div>
							<div v-if="row.tradeType == 2">扣减</div>
						</template>
					</el-table-column>
					<el-table-column label="金额" show-overflow-tooltip>
						<template #default="scope">
							<div v-if="scope.row.amount">{{ `${scope.row.amount}元` }}</div>
						</template>
					</el-table-column>
				</el-table>
			</el-scrollbar>
			<el-pagination
				background
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="[20, 50, 100, 200]"
				:total="dialogTotal"
				:page-size="dialogPageSize"
				:current-page="dialogCurrentPage"
				@size-change="handleSizeDialogChange"
				@current-change="handlePageDialogChange"
			></el-pagination>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import {
	getUserInfoByUidMobile,
	getStaffLogPageApi,
	getMemberStaffInfoByMobilApi,
	getWalletFlowForMemberApi,
} from '/@/api/member/staffCenter/staffCenter';
import { useMessageBox, useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';

const emit = defineEmits(['changeType']);
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const balanceDialog = defineAsyncComponent(() => import('./balanceDetail.vue'));
const balanceDialogRef = ref();
const queryRef = ref();
const searchTime = ref([]);
const dialogMoneyVisible = ref(false);
const dialogLoading = ref(false);
// const dataList = ref<any[]>([]);
// const loading = ref<boolean>(false);
// const total = ref(0);
// const currentPage = ref<number>(1);
// const pageSize = ref<number>(10);
const searchFieldType = ref([
	{ value: '2', label: '操作' },
	{ value: '1', label: '登陆' },
]);
// 页面对应元数据
const dataForm = reactive<any>({
	avatar: '',
	mobile: '',
	nickName: '',
	unionId: '',
	isStaff: '',
	lastLoginTime: '',
	growthValue: '',
	levelName: '',
	score: '',
	card: '',
});
const queryForm = reactive<any>({
	riskType: '',
	startTime: '',
	endTime: '',
});
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const mobile = ref<string>('');
const userGuid = ref('');
const dialogDataList = ref<any[]>([]);
const dialogTotal = ref(0);
const dialogCurrentPage = ref<number>(1);
const dialogPageSize = ref<number>(20);
const isExternal = ref<number>(0);
const state: BasicTableProps = reactive<BasicTableProps>({
	// pageList: getStaffLogPageApi,
	queryForm: {},
	dataList: [],
});

const show = (row: any) => {
	userGuid.value = '';
	isExternal.value = row.isExternal;
	dataList.value = [];
	total.value = 0;
	if (row.isExternal) {
		// 外部员工
		getUserInfoByUidMobileData(row.id);
	} else {
		// 内部员工
		Object.assign(dataForm, row);
		if (row.mobile) {
			getMemberStaffInfoByMobil(row.mobile);
		}
	}
	state.queryForm.id = row.id;
	if (row.isExternal) {
		mobile.value = row.mobile;
		getStaffLogPage(row.isExternal);
	}
};

// 根据id获取详情
const getUserInfoByUidMobileData = async (id: string) => {
	try {
		const { code, data, msg } = await getUserInfoByUidMobile(id);
		if (code === 0) {
			Object.assign(dataForm, data);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 获取员工卡余额
const getMemberStaffInfoByMobil = async (mobile: string) => {
	try {
		const { code, data, msg } = await getMemberStaffInfoByMobilApi(mobile);
		if (code === 0) {
			dataForm.balance = data.balance;
			userGuid.value = data.guid;
			// Object.assign(dataForm, data);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 获取员工卡余额明细
const getWalletFlowForMember = async () => {
	const params = {
		userGuid: userGuid.value,
		current: dialogCurrentPage.value,
		size: dialogPageSize.value,
	};
	try {
		const { code, data, msg } = await getWalletFlowForMemberApi(params);
		if (code === 0) {
			// dataForm.balance = data.balance;
			dialogDataList.value = data.records;
			dialogTotal.value = data.total;
			// Object.assign(dataForm, data);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const clickDialogVisible = () => {
	dialogMoneyVisible.value = true;
	getWalletFlowForMember();
};

// 关闭明细弹窗
const closeDialogVisible = () => {
	dialogMoneyVisible.value = false;
	dialogDataList.value = [];
	dialogTotal.value = 0;
	dialogCurrentPage.value = 1;
	dialogPageSize.value = 20;
};
//
// //
// // 根据id获取详情
const getStaffLogPage = async (isExternal: number) => {
	loading.value = true;
	if (isExternal) {
		const params = {
			mobile: mobile.value,
			size: pageSize.value,
			current: currentPage.value,
			riskType: queryForm.riskType,
			startTime: queryForm.startTime,
			endTime: queryForm.endTime,
		};
		try {
			const { code, data, msg } = await getStaffLogPageApi(params);
			if (code === 0) {
				if (data) {
					dataList.value = data.records;
					total.value = data.total;
				} else {
					dataList.value = [];
					total.value = 0;
				}
				loading.value = false;
			} else {
				useMessage().error(msg);
				loading.value = false;
			}
		} catch (err: any) {
			useMessage().error(err.msg);
			loading.value = false;
		}
	} else {
		dataList.value = [];
		total.value = 0;
		loading.value = false;
	}
};

//  table hook
const { tableStyle } = useTable(state);

const toForward = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	queryForm.startTime = '';
	queryForm.endTime = '';
	emit('changeType');
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	queryForm.startTime = '';
	queryForm.endTime = '';

	getStaffLogPage(dataForm.isExternal);
};

const edit = (row: any) => {
	formDialogRef.value.openDialog(row);
};
const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};

watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			queryForm.startTime = val[0] + ' 00:00:00';
			queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			queryForm.startTime = '';
			queryForm.endTime = '';
		}
	}
);

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getStaffLogPage(isExternal.value);
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getStaffLogPage(isExternal.value);
};
const handleSizeDialogChange = (val: number) => {
	dialogPageSize.value = val;
	getWalletFlowForMember();
};
const handlePageDialogChange = (page: number) => {
	dialogCurrentPage.value = page;
	getWalletFlowForMember();
};

const maskedMobile = (mobile: any) => {
	console.log('mobile', mobile);
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
defineExpose({
	show,
});
</script>
<style lang="scss" scoped>
.layout-padding {
	height: 100%;
	.boxSizing {
		box-sizing: border-box;
	}
}
.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;
	&::before {
		content: '';
		width: 8px;
		height: 20px;
		border-radius: 2px;
		background-color: #165dff;
		position: absolute;
		left: 0;
	}
}

.back-icon {
	font-size: 22px;
	.icon {
		align-items: flex-end;
	}
	.el-icon {
		height: 100%;
	}
}
.el_edit {
	margin-left: 16px;
}
.avatar {
	margin-left: 25px;
	height: 84px;
	width: 84px;
}
</style>
