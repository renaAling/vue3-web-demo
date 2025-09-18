<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<el-row shadow="hover" class="ml10">
					<el-form :model="queryForm" ref="queryRef" :inline="true" @keyup.enter="getList">
						<el-row>
							<el-form-item label="用户ID" prop="unionId">
								<el-input placeholder="请输入用户ID" maxlength="50" style="width: 220px" v-model="queryForm.unionId" clearable />
							</el-form-item>
							<el-form-item label="日志类型" prop="riskType">
								<el-select v-model="queryForm.riskType" style="width: 220px" placeholder="选择日志类型" clearable>
									<el-option label="全部" value="1" v-show="activeName != '2'" />
									<el-option label="高风险" value="2" />
								</el-select>
							</el-form-item>
							<el-form-item label="时间" prop="userState" v-if="activeName == '1'">
								<el-date-picker
									v-model="timeData"
									type="daterange"
									range-separator="-"
									style="width: 400px"
									start-placeholder="请选择开始时间"
									end-placeholder="请选择结束时间"
									format="YYYY-MM-DD"
									value-format="YYYY-MM-DD"
									clearable
								/>
							</el-form-item>
							<el-form-item>
								<el-button icon="search" type="primary" @click="getList(1)"> 查询 </el-button>
								<el-button icon="Refresh" @click="resetQuery">重置</el-button>
							</el-form-item>
						</el-row>
					</el-form>
				</el-row>
				<el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
					<el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value"> </el-tab-pane>
				</el-tabs>
				<div v-show="activeName == '1'">
					<el-table
						:data="dataList"
						v-loading="loading"
						style="width: 100%"
						row-key="id"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column type="index" width="60" align="center" label="序号" />
						<el-table-column prop="createTime" label="时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="unionId" label="用户ID" show-overflow-tooltip></el-table-column>
						<el-table-column prop="riskTypeName" label="类型" show-overflow-tooltip></el-table-column>
						<el-table-column prop="title" label="操作内容" show-overflow-tooltip></el-table-column>
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
					<!-- <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" /> -->
				</div>
				<div v-if="activeName == '2'">
					<el-table
						:data="logData"
						v-loading="logLoading"
						style="width: 100%"
						row-key="id"
						:cell-style="tableStyle1.cellStyle"
						:header-cell-style="tableStyle1.headerCellStyle"
					>
						<el-table-column type="index" width="60" align="center" label="序号" />
						<el-table-column prop="loginTime" label="时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="unionId" label="用户ID" show-overflow-tooltip></el-table-column>
						<el-table-column prop="loginIp" label="IP" show-overflow-tooltip></el-table-column>
						<el-table-column prop="ipLocation" label="IP归属地" show-overflow-tooltip></el-table-column>
						<el-table-column prop="device" label="设备信息" show-overflow-tooltip></el-table-column>
						<el-table-column label="类型" show-overflow-tooltip>
							<template #default>
								<span>低风险</span>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						background
						layout="total, sizes, prev, pager, next, jumper"
						:page-sizes="[10, 20, 50, 100, 200]"
						:total="logTotal"
						:page-size="logPageSize"
						:current-page="logCurrentPage"
						@size-change="handleLogSizeChange"
						@current-change="handleLogPageChange"
					></el-pagination>
				</div>
				<div v-if="activeName == '3'">
					<el-table
						:data="dealData"
						v-loading="dealLoading"
						style="width: 100%"
						row-key="id"
						:cell-style="tableStyle2.cellStyle"
						:header-cell-style="tableStyle2.headerCellStyle"
					>
						<el-table-column type="index" width="60" align="center" label="序号" />
						<el-table-column prop="tradeTime" label="时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="unionId" label="用户ID" show-overflow-tooltip></el-table-column>
						<el-table-column prop="tradeSystem" label="交易系统" show-overflow-tooltip></el-table-column>
						<el-table-column prop="callbackResult" label="回调结果" show-overflow-tooltip></el-table-column>
						<el-table-column prop="orderNo" label="订单号" show-overflow-tooltip></el-table-column>
						<el-table-column prop="riskTypeName" label="类型" show-overflow-tooltip></el-table-column>
					</el-table>
					<el-pagination
						background
						layout="total, sizes, prev, pager, next, jumper"
						:page-sizes="[10, 20, 50, 100, 200]"
						:total="dealTotal"
						:page-size="dealPageSize"
						:current-page="dealCurrentPage"
						@size-change="handleDealSizeChange"
						@current-change="handleDealPageChange"
					></el-pagination>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberTradeLogPage, getUserLoginLogPage, getMemberSysLogPageApi } from '/@/api/member/memberManagement/accountSafe';
import { useMessage } from '/@/hooks/message';

const activeName = ref('1');
const timeData = ref<string[]>([]);
const tabList = ref([
	{ label: '账号修改日志', value: '1' },
	{ label: '账号登陆日志', value: '2' },
	{ label: '账号交易日志', value: '3' },
]);
const queryRef = ref();
const queryForm = reactive({
	unionId: '',
	riskType: '',
	startTime: '',
	endTime: '',
});
// 修改日志
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
// 登录日志
const logData = ref<any[]>([]);
const logLoading = ref<boolean>(false);
const logTotal = ref(0);
const logCurrentPage = ref<number>(1);
const logPageSize = ref<number>(10);
// 交易日志
const dealData = ref<any[]>([]);
const dealLoading = ref<boolean>(false);
const dealTotal = ref(0);
const dealCurrentPage = ref<number>(1);
const dealPageSize = ref<number>(10);

watch(
	() => timeData.value,
	(val: string[] | null) => {
		console.log('val', val);
		if (val && val.length === 2) {
			queryForm.startTime = val[0] + ' 00:00:00';
			queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			queryForm.startTime = '';
			queryForm.endTime = '';
		}
	}
);

onMounted(() => {
	getList();
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
const state1: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
const state2: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
//  table hook
const { tableStyle } = useTable(state);
const { tableStyle: tableStyle1 } = useTable(state1);
const { tableStyle: tableStyle2 } = useTable(state2);

const getData = async (params: any) => {
	loading.value = true;
	try {
		const { code, data, msg } = await getMemberSysLogPageApi(params);
		if (code === 0) {
			dataList.value = data.records;
			total.value = data.total;
			loading.value = false;
		} else {
			useMessage().error(msg);
			loading.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		loading.value = false;
	}
};

const getLogData = async (params: any) => {
	logLoading.value = true;
	try {
		const { code, data, msg } = await getUserLoginLogPage(params);
		if (code === 0) {
			// 这里后端让前端写死高风险没有数据
			if (queryForm.riskType == '2') {
				logData.value = [];
				logTotal.value = 0;
			} else {
				logData.value = data.records;
				logTotal.value = data.total;
			}
			logLoading.value = false;
		} else {
			useMessage().error(msg);
			logLoading.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		logLoading.value = false;
	}
};
const getDealData = async (params: any) => {
	dealLoading.value = true;
	console.log('params', params);
	try {
		const { code, data, msg } = await getMemberTradeLogPage(params);
		if (code === 0) {
			dealData.value = data.records;
			dealTotal.value = data.total;
			dealLoading.value = false;
		} else {
			useMessage().error(msg);
			dealLoading.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		dealLoading.value = false;
	}
};

const getList = async (search?: number) => {
	let current = 1;
	let size = 10;
	if (activeName.value == '1') {
		size = pageSize.value;
		current = currentPage.value;
	} else if (activeName.value == '2') {
		size = logPageSize.value;
		current = logCurrentPage.value;
	} else {
		size = dealPageSize.value;
		current = dealCurrentPage.value;
	}
	const params = {
		unionId: queryForm.unionId,
		riskType: queryForm.riskType,
		startTime: activeName.value == '1' ? queryForm.startTime : '',
		endTime: activeName.value == '1' ? queryForm.endTime : '',
		current: search ? 1 : current,
		size: search ? 10 : size,
	};
	console.log(params);
	if (activeName.value == '1') {
		await getData(params);
	} else if (activeName.value == '2') {
		await getLogData(params);
	} else {
		await getDealData(params);
	}
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getList();
};
const handleLogPageChange = (page: number) => {
	console.log('handleLogPageChange', page);
	logCurrentPage.value = page;
	getList();
};
const handleDealPageChange = (page: number) => {
	dealCurrentPage.value = page;
	getList();
};
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getList();
};

const handleLogSizeChange = (val: number) => {
	logPageSize.value = val;
	getList();
};

const handleDealSizeChange = (val: number) => {
	dealPageSize.value = val;
	getList();
};
const handleClick = (tab: any, event: Event) => {
	resetQuery();
};
// 清空搜索条件
const resetQuery = () => {
	if (activeName.value == '1') {
		currentPage.value = 1;
		pageSize.value = 10;
	} else if (activeName.value == '2') {
		logCurrentPage.value = 1;
		logPageSize.value = 10;
	} else {
		dealCurrentPage.value = 1;
		dealPageSize.value = 10;
	}
	queryRef.value.resetFields();
	timeData.value = [];
	queryForm.startTime = '';
	queryForm.endTime = '';
	getList();
};
</script>
