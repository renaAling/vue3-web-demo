<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="手机号" prop="mobile">
						<el-input placeholder="请输入手机号" v-model="state.queryForm.mobile" clearable maxlength="11" style="width: 230px" />
					</el-form-item>
					<el-form-item label="姓名" prop="staffName">
						<el-input placeholder="请输入姓名" v-model="state.queryForm.staffName" clearable maxlength="50" style="width: 230px" />
					</el-form-item>
					<el-form-item label="管理范围" prop="scope">
						<el-select v-model="state.queryForm.scope" clearable placeholder="请选择管理范围" style="width: 230px">
							<el-option v-for="item in scopeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
					<el-button @click="formDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">新建</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="姓名" prop="staffName" show-overflow-tooltip />
				<el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
				<el-table-column label="管理范围" prop="scope">
					<template #default="{ row }">
						<span v-if="row.scope === 1">总部</span>
						<span v-else>门店</span>
					</template>
				</el-table-column>
				<el-table-column label="岗位" prop="roleName" />
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<el-switch v-model="row.status" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="2"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" link @click="handleCommand('delete', row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getStaffList, deleteStaff, switchUser } from '/@/api/goodStore/staff';
import { ElMessageBox, ElMessage } from 'element-plus';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();

// 管理范围枚举
const scopeList = [
	{
		label: '总部',
		value: 1,
	},
	{
		label: '门店',
		value: 2,
	},
];

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getStaffList,
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

// 切换启用/禁用
const beforeChangeStatus = async (row: any) => {
	const { id, status } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${status === 2 ? '启用' : '禁用'}该员工`, `${status === 2 ? '启用' : '禁用'}`)
				.then(async () => {
					try {
						const { code, msg } = await switchUser({ id, status: status === 2 ? 1 : 2 });
						if (code === 0) {
							useMessage().success(`${status === 2 ? '启用' : '禁用'}成功`);
							getDataList();
							return resolve(true);
						} else {
							useMessage().error(msg);
						}
					} catch (err: any) {
						useMessage().error(err);
					}
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};

// 操作
const handleCommand = async (command: Table.Command, row: any) => {
	switch (command) {
		case 'delete':
			try {
				await ElMessageBox.confirm('删除后账号无法找回', '确认删除账号？', {
					confirmButtonText: '确认删除',
					cancelButtonText: '取消',
					type: 'warning',
				});
			} catch {
				return;
			}
			try {
				await deleteStaff(row.id);
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
