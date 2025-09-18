<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="商家ID" prop="merchantCode">
						<el-input placeholder="请输入商家ID" v-model="state.queryForm.merchantCode" clearable />
					</el-form-item>
					<el-form-item label="商家名称" prop="merchantName">
						<el-input placeholder="请输入商家名称" v-model="state.queryForm.merchantName" clearable />
					</el-form-item>
					<el-form-item label="费用类型" prop="feeType">
						<el-select v-model="state.queryForm.feeType" default-first-option clearable>
							<el-option v-for="(item, index) in feeTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账单时间" prop="billingDate">
						<el-date-picker v-model="state.queryForm.billingDate" value-format="YYYY-MM-DD" type="month" placeholder="请选择账单时间" />
					</el-form-item>
					<el-form-item label="收款状态" prop="paymentStatus">
						<el-select v-model="state.queryForm.paymentStatus" default-first-option clearable placeholder="请选择收款状态">
							<el-option v-for="(item, index) in paymentStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="开票状态" prop="invoiceStatus">
						<el-select v-model="state.queryForm.invoiceStatus" default-first-option clearable placeholder="请选择开票状态">
							<el-option v-for="(item, index) in invoiceStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb20">
				<el-button type="primary" @click="handleEdit()"> 数据录入 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
				<el-table-column prop="merchantCode" label="商家ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="merchantName" label="商家名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="feeType" label="费用类型" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.feeType === 1"> 租金 </span>
						<span v-if="row.feeType === 2"> 水费 </span>
						<span v-if="row.feeType === 3"> 电费 </span>
						<span v-if="row.feeType === 4"> 燃气费 </span>
						<span v-if="row.feeType === 5"> 维修费 </span>
					</template>
				</el-table-column>
				<el-table-column prop="receivableAmount" label="应收金额(元)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="billingDate" label="账单时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="paymentStatus" label="收款状态" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="!row.paymentStatus">已收款</span>
						<span v-if="row.paymentStatus">未收款</span>
					</template>
				</el-table-column>
				<el-table-column prop="invoiceAmount" label="开票金额(元)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="invoiceStatus" label="开票状态" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="!row.invoiceStatus">已开票</span>
						<span v-if="row.invoiceStatus">未开票</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="60" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" @click="handleEdit(row, 'edit')">编辑</el-button>
						<el-button link type="danger" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
// import { useMessage, useMessageBox } from '/@/hooks/message';
import { getPlatformSettlementPage, getPlatformSettlementDel } from '/@/api/platformEntry/settlementList';
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

const queryRef = ref();
const formDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getPlatformSettlementPage, // H
	descs: [],
});
const feeTypeList = ref([
	{ label: '租金', value: 1 },
	{ label: '水费', value: 2 },
	{ label: '电费', value: 3 },
	{ label: '燃气费', value: 4 },
	{ label: '维修费', value: 5 },
]);
const paymentStatusList = ref([
	{ label: '已收款', value: 0 },
	{ label: '未收款', value: 1 },
]);
const invoiceStatusList = ref([
	{ label: '已开票', value: 0 },
	{ label: '未开票', value: 1 },
]);
const handleEdit = (row?: any, type?: string) => {
	console.log(row, type);
	switch (type) {
		case 'edit':
			// 编辑
			formDialogRef.value.openDialog(type, row);
			break;
		default:
			// 新增
			formDialogRef.value.openDialog('add');
			break;
	}
};

const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm('确认要删除该条数据吗？', '删除提示', '确定');
	} catch {
		return;
	}
	try {
		let res = await getPlatformSettlementDel(Number(row.id));
		if (res.code === 0) {
			useMessage().success('删除成功');
			getDataList();
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
<style scoped>
.dialog-content {
	text-align: center;
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 10px;
}
</style>
