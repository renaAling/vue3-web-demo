<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane :label="a.label" :name="a.name" v-for="(a, i) of tabList" :key="i">
					<el-row class="justify-between">
						<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item label="选择日期">
								<el-date-picker
									v-model="timeVal"
									:clearable="false"
									format="YYYY-MM-DD"
									value-format="YYYY-MM-DD"
									unlink-panels
									type="daterange"
									@change="onchangeTime"
								/>
							</el-form-item>
							<el-form-item label="商户号">
								<el-input v-model.trim="state.queryForm.merchantNo" placeholder="请输入商户号" clearable></el-input>
							</el-form-item>
							<el-form-item label="特邀商户号">
								<el-input v-model.trim="state.queryForm.specialMerchantNo" placeholder="请输入特邀商户号" clearable></el-input>
							</el-form-item>
							<el-form-item>
								<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
								<el-button @click="resetQuery" icon="Refresh">重置</el-button>
							</el-form-item>
							<el-form-item>
								<el-button @click="handleExportExcel">导出为Excel</el-button>
								<el-button @click="handleExportCSV">导出为CSV</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column type="index" label="序号" min-width="60" />
						<el-table-column prop="transactionTime" label="交易时间" width="100" />
						<el-table-column prop="merchantId" label="商户号" />
						<el-table-column prop="subMerchantId" label="特约商户号" width="120" />
						<el-table-column prop="paymentInstitutionFlowNo" label="支付机构支付流水号" width="160" />
						<el-table-column prop="platformTradeFlowNo" label="平台交易流水号" width="140" />
						<el-table-column prop="platformOrderNo" label="平台业务订单号" width="140">
							<template #default="scope">
								<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.platformOrderNo)">{{ scope.row.platformOrderNo }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="paymentAmount" label="支付金额" width="100" />
						<el-table-column prop="refundSingleFlowNo" label="支付机构退款单流水号" width="170" />
						<el-table-column prop="platformRefundFlowNo" label="平台退款流水号" width="140" />
						<el-table-column prop="refundAmount" label="退款金额" width="100" />
						<el-table-column prop="transactionStatus" label="交易状态" width="100" />
						<el-table-column prop="rate" label="费率" />
						<el-table-column prop="settlementAmount" label="应结金额" width="100" />
					</el-table>
					<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>
<script lang="ts" setup name="payReconciliation">
import type { TabsPaneContext } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getPaymentTransactionApi } from '/@/api/culture/finance';

// 支付渠道：1-微信支付 ,8-员工卡余额,3-账户余额
// const statusMap: Record<number, string> = {
// 	1: '微信支付',
// 	3: '账户余额',
// 	8: '员工卡余额',
// };
const router = useRouter();
const activeName = ref('1');
const tabList = [
	{
		name: '1',
		label: '微信支付',
	},
	{
		name: '8',
		label: '员工卡支付',
	},
	{
		name: '3',
		label: '储值账户',
	},
	{
		name: '4',
		label: '授信账户',
	},
	{
		name: '5',
		label: '银联云闪付',
	},
	{
		name: '6',
		label: '支付宝',
	}
];
const handleClick = (tab: TabsPaneContext) => {
	state.queryForm.payChannel = tab.props.name;
	getDataList();
};
// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getPaymentTransactionApi,
	queryForm: {
		payChannel: '1', // 支付渠道：1-微信支付 ,8-员工卡余额
	},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

const timeVal = ref();
const onchangeTime = (val: any) => {
	if (val) {
		timeVal.value = val;
		state.queryForm.startTime = val[0];
		state.queryForm.endTime = val[1];
	}
};
const handleGoDetail = (orderNo: string) => {
	router.push({
		path: '/culture/orderManage/orderList/orderDetail',
		query: {
			orderNo,
		},
	});
};
const handleExportExcel = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/pay/trade/exportExcel', params, '支付渠道.xlsx');
};
const handleExportCSV = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/pay/trade/exportCSV', params, '支付渠道.csv');
};
// 清空搜索条件
const resetQuery = () => {
	state.queryForm.merchantNo = '';
	state.queryForm.specialMerchantNo = '';
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	timeVal.value = [];
	getDataList();
};
</script>

<style scoped lang="scss"></style>
