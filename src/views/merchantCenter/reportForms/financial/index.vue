<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="商家名称" prop="merchantName">
						<el-input placeholder="请输入商家名称查询" v-model="state.queryForm.merchantName" clearable />
					</el-form-item>
					<el-form-item label="查询月份" prop="month">
						<el-date-picker
							v-model="state.queryForm.month"
							@change="changeSearchTime"
							type="month"
							placeholder="请选择月份"
							value-format="YYYY-MM-DD"
							style="width: 200px"
						/>
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
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="80" />
				<el-table-column label="商家名称" prop="merchantName" />
				<el-table-column label="月份" prop="billMonth" />
				<el-table-column label="支付方式" prop="payTypeStr" />
				<el-table-column label="支付笔数" prop="paymentCount" />
				<el-table-column label="支付金额（元）" prop="paymentAmount" />
				<el-table-column label="退款笔数" prop="refundCount" />
				<el-table-column label="退款金额（元）" prop="refundAmount" />
				<el-table-column label="实收金额（元）" prop="actualAmount" />
				<!-- <el-table-column label="预估结算金额（元）" prop="estimateAmount" /> -->
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleExport(row)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="good-store-reportForms-financial">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { merchantFinanceReport } from '/@/api/goodStore/reportForm';

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: merchantFinanceReport,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.month = '';
	getDataList();
};
const changeSearchTime = (val: any) => {
	if (!val) {
		state.queryForm.dateStart = '';
		state.queryForm.dateEnd = '';
	}
	getDataList();
};

// 下载财务报表
const handleExport = async (row: any) => {
	if (row.fileUrl) {
		const link = document.createElement('a');
		link.href = row.fileUrl;
		document.body.appendChild(link);
		link.click();
		window.setTimeout(() => {
			document.body.removeChild(link);
		}, 0);
	}
};
</script>
<style lang="scss" scoped></style>
