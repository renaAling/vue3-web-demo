<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="网点名称" prop="name">
						<el-input placeholder="请输入网点名称查询" v-model="state.queryForm.name" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" default-first-option clearable style="width: 230px">
							<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
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
					<el-button @click="formDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">新增</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="ID" prop="id" width="60" />
				<el-table-column label="网点名称" prop="name" show-overflow-tooltip />
				<el-table-column label="联系人" prop="contactName" show-overflow-tooltip />
				<el-table-column label="联系电话" prop="contactTelephone" />
				<el-table-column label="省市区" prop="detailName" />
				<el-table-column label="详细地址" prop="address" show-overflow-tooltip />
				<el-table-column label="营业时间" prop="businessHours" />
				<el-table-column label="取货单数" prop="pickupNum" />
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<span v-if="row.status === 1">启用</span>
						<span v-else>停用</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="340">
					<template #default="{ row }">
						<el-button type="primary" link icon="unlock" @click="handleCommand('unlock', row)" v-if="row.status == 2">启用</el-button>
						<el-button type="primary" link icon="lock" @click="handleCommand('lock', row)" v-if="row.status == 1">停用</el-button>
						<el-button type="primary" link icon="edit" @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" link icon="delete" @click="handleCommand('delete', row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="outletList" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getPickupSiteList, statusUpdate, siteDelete } from '/@/api/culture/pickupSite';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 字典

// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();

const statusList = ref([
	{
		label: '启用',
		value: 1,
	},
	{
		label: '停用',
		value: 2,
	},
]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getPickupSiteList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const handleCommand = async (command: Table.Command, row: any) => {
	switch (command) {
		case 'unlock': // 启用
			try {
				await useMessageBox().confirm('请确认是否启用网点', '启用');
			} catch {
				return;
			}

			try {
				const { id } = row;
				await statusUpdate({ id, status: 1 });
				useMessage().success('已启用');
				row.status = 1;
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'lock': // 停用
			try {
				await useMessageBox().confirm('请确认是否停用网点', '停用');
			} catch {
				return;
			}
			try {
				const { id } = row;
				await statusUpdate({ id, status: 2 });
				useMessage().success('已停用');
				row.status = 2;
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'delete':
			try {
				await useMessageBox().confirm('请确认是否删除网点', '删除网点');
			} catch {
				return;
			}
			try {
				await siteDelete(row.id);
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'edit': // 编辑
			formDialogRef.value.openDialog(row.id);
			break;
	}
};
</script>
