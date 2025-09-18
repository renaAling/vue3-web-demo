<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="查询类型" prop="searchType">
						<el-select v-model="searchType" @change="changeTypeSearch" style="width: 160px">
							<el-option v-for="(item, key) in searchFieldType" :key="key" :label="item.label" :value="item.type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="查询时间" prop="queryDate">
						<el-date-picker
							v-model="state.queryForm.queryDate"
							@change="changequeryDate"
							:type="searchType"
							:clearable="false"
							placeholder="请选择"
							:value-format="searchType == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM'"
							style="width: 160px"
						/>
					</el-form-item>
					<el-form-item label="业务类型" prop="orderType">
						<el-select v-model="state.queryForm.orderType" clearable placeholder="请选择业务类型" style="width: 160px" @change="changeOrderType">
							<el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleExport()" icon="download" type="primary">下载报表</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="80" />
				<el-table-column label="消费日期" prop="consumptionDate" />
				<el-table-column label="商家" prop="merchantName" />
				<el-table-column label="商家门店" prop="storeName" />
				<el-table-column label="业务类型" prop="businessTypeName" />
				<el-table-column label="支付方式" prop="typeName" />
				<el-table-column label="支付用户" prop="payerUser" />
				<el-table-column label="退款用户" prop="refundUser" />
				<el-table-column label="支付笔数" prop="paymentCount" />
				<el-table-column label="订单金额（元）" prop="orderAmount" />
				<el-table-column label="优惠金额（元）" prop="discountAmount" />
				<el-table-column label="支付金额（元）" prop="paymentAmount" />
				<el-table-column label="退款笔数" prop="refundCount" />
				<el-table-column label="退款金额（元）" prop="refundAmount" />
				<el-table-column label="实收金额（元）" prop="actualReceipts" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="good-store-reportForms-business">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { downFileAddTask } from '/@/utils/other';
import { useMessageBox } from '/@/hooks/message';
import { getBusinessStatistics } from '/@/api/goodStore/reportForm';
import { formatDate } from '/@/utils/formatTime';

// 搜索变量
const queryRef = ref();
const searchFieldType = ref([
	{ type: 'date', label: '日', code: 1 },
	{ type: 'month', label: '月', code: 2 },
]);
const searchType = ref('date');
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getBusinessStatistics,
	queryForm: {
		queryType: searchType.value === 'date' ? 1 : 2,
		queryDate: formatDate(new Date(), 'YYYY-mm-dd'),
	},
	dataList: [],
});

const orderTypeList = [
	{
		label: '网订店取',
		value: 2,
	},
	{
		label: '到店支付',
		value: 1,
	},
];

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchType.value = 'date';
	state.queryForm.queryDate = formatDate(new Date(), 'YYYY-mm-dd');
	state.queryForm.queryType = 1;
	getDataList();
};
const changeTypeSearch = (val: any) => {
	state.queryForm.queryType = val === 'date' ? 1 : 2;
	if (val === 'date') {
		state.queryForm.queryType = 1;
		state.queryForm.queryDate = formatDate(new Date(), 'YYYY-mm-dd');
	} else {
		state.queryForm.queryType = 2;
		state.queryForm.queryDate = formatDate(new Date(), 'YYYY-mm');
	}
	getDataList();
};
const changequeryDate = (val: any) => {
	if (!val) {
		state.queryForm.queryDate = '';
	}
	getDataList();
};

const changeOrderType = (val: any) => {
	if (!val) {
		state.queryForm.orderType = '';
	}
	getDataList();
};

// 下载财务报表
const handleExport = async () => {
	const { code } = await downFileAddTask('/business/goodShopStatistics/businessStatistics/exportExcels/management', state.queryForm);
	if (code === 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
	}
};
</script>
<style lang="scss" scoped></style>
