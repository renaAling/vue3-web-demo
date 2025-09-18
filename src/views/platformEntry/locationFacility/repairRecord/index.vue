<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="设备ID" prop="code">
						<el-input placeholder="请输入设备ID" v-model="state.queryForm.code" clearable />
					</el-form-item>
					<el-form-item label="设备名称" prop="name">
						<el-input placeholder="请输入设备名称" v-model="state.queryForm.name" clearable />
					</el-form-item>

					<el-form-item label="报修时间" prop="repairTime">
						<el-date-picker v-model="state.queryForm.repairTime" type="date" placeholder="请选择报修时间" value-format="YYYY-MM-DD" />
					</el-form-item>
					<el-form-item label="状态" prop="repairStatus">
						<el-select v-model="state.queryForm.repairStatus" default-first-option clearable>
							<el-option v-for="(item, index) in repairStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
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
				<el-table-column prop="code" label="设备ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="设备名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="placeCode" label="场所ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="placeName" label="场所名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="faultTime" label="发现故障时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="repairTime" label="报修时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="repairReason" label="报修原因" show-overflow-tooltip></el-table-column>
				<el-table-column label="处理结果" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.processResult ? row.processResult : '--' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="repairStatus" label="状态" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.repairStatus">已修复</span>
						<span v-if="!row.repairStatus">待修复</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="60" fixed="right">
					<template #default="{ row }">
						<el-button link disabled v-if="row.repairStatus">处理</el-button>
						<el-button link type="primary" @click="handleEdit(row)" v-if="!row.repairStatus">处理</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';

// import { useMessage, useMessageBox } from '/@/hooks/message';

import { getPlatformDeviceRepairPage } from '/@/api/platformEntry/repairRecord';
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const queryRef = ref();
const formDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: 3,
	},
	pageList: getPlatformDeviceRepairPage, // H
	descs: [],
});
const repairStatusList = ref([
	{ label: '已修复', value: true },
	{ label: '待修复', value: false },
]);
const handleEdit = (row?: any) => {
	console.log(row);
	formDialogRef.value.openDialog(row);
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
