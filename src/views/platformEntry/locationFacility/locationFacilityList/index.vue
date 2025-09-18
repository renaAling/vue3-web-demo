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
					<el-form-item label="场所ID" prop="placeCode">
						<el-input placeholder="请输入场所ID" v-model="state.queryForm.placeCode" clearable />
					</el-form-item>
					<el-form-item label="场所名称" prop="placeName">
						<el-input placeholder="请输入场所名称" v-model="state.queryForm.placeName" clearable />
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" default-first-option clearable>
							<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="入库时间" prop="storageTime">
						<el-date-picker v-model="state.queryForm.storageTime" type="date" placeholder="请选择入库时间" value-format="YYYY-MM-DD" />
					</el-form-item>
					<el-form-item label="设备到期时间" prop="expireTime">
						<el-date-picker v-model="state.queryForm.expireTime" type="date" placeholder="请选择设备到期时间" value-format="YYYY-MM-DD" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb20">
				<el-button type="primary" @click="handleEdit()"> 新增设备 </el-button>
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
				<el-table-column label="状态" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.status === 1">正常</span>
						<span v-if="row.status === 2">待报修</span>
						<span v-if="row.status === 3">已报修</span>
					</template>
				</el-table-column>
				<el-table-column prop="storageTime" label="入库时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="expireTime" label="设备到期时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" min-width="90" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" @click="handleEdit(row, 'edit')">编辑</el-button>
						<el-button link type="primary" v-if="row.status !== 3" @click="handleEdit(row, 'repairs')">报修</el-button>
						<el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
import { useMessageBox, useMessage } from '/@/hooks/message';
// import { useMessage, useMessageBox } from '/@/hooks/message';

import { getPlatformDevicePage, getPlatformDeviceDel } from '/@/api/platformEntry/locationFacilityList';
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

const queryRef = ref();
const formDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getPlatformDevicePage, // H
	descs: [],
});
const statusList = ref([
	{ label: '正常', value: 1 },
	{ label: '待报修', value: 2 },
	{ label: '已报修', value: 3 },
]);
const handleEdit = (row?: any, type?: string) => {
	console.log(row, type);
	switch (type) {
		case 'edit':
			// 编辑
			formDialogRef.value.openDialog(type, row);
			break;
		case 'repairs':
			// 保修
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
		await useMessageBox().confirm(`确认要删除该设备吗？`, '删除提示', '确定');
	} catch {
		return;
	}
	try {
		let res = await getPlatformDeviceDel(Number(row.id));
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
