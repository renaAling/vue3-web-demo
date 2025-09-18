<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="选择月份">
						<el-date-picker v-model="state.queryForm.billMonth" format="YYYY-MM" value-format="YYYY-MM-01" type="month" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
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
				<el-table-column type="index" label="序号" min-width="50" />
				<el-table-column prop="distributionName" label="分销商名称" />
				<el-table-column prop="billMonth" label="月份">
					<template #default="scope">
						<span>{{ dayjs(scope.row.billMonth).format('YYYY-MM') }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="spreadOrderNum" label="推广订单总数(单)" />
				<el-table-column prop="orderTotalPrice" label="成交总金额(元)" />
				<el-table-column prop="brokerageTotalAmount" label="综合佣金比例">
					<template #default="scope">
						<span>
							{{
								Number(scope.row.orderTotalPrice) === 0
									? '0%'
									: (((scope.row.firstBrokerageAmount + scope.row.secondBrokerageAmount) / Number(scope.row.orderTotalPrice)) * 100).toFixed(2) + '%'
							}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="firstBrokerageAmount" label="应发佣金">
					<template #default="scope">
						<span>{{ (scope.row.firstBrokerageAmount + scope.row.secondBrokerageAmount).toFixed(2) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" width="240">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleExport(row.excelUrl)">下载对账明细表</el-button>
						<el-button text type="primary" @click="handleExport(row.csvUrl)">下载CSV对账单</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="distributeReconciliation">
import dayjs from 'dayjs';
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { distributionMonthBillApi } from '/@/api/culture/finance';

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: distributionMonthBillApi,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleExport = (url: string) => {
	if (url) {
		const link = document.createElement('a');
		link.href = url;
		document.body.appendChild(link);
		link.click();
		window.setTimeout(() => {
			document.body.removeChild(link);
		}, 0);
	} else {
		useMessage().error('暂无数据');
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.billMonth = '';
	getDataList();
};
</script>

<style scoped lang="scss"></style>
