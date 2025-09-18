<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<div class="my-5 flex align-center justify-start cursor-pointer" @click="toForward">
				<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
			</div>
			<div class="font-bold">{{ sysUserName }}</div>
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="角色名称" prop="roleName">
						<el-input placeholder="请输入角色名称" style="width: 180px" v-model="state.queryForm.roleName" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8 flex justify-between items-center">
				<el-button type="primary" icon="plus" @click="handleAdd"> 新增 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column label="角色名称" prop="roleName" />
				<el-table-column label="角色标识" prop="roleCode" />
				<el-table-column label="角色描述" prop="roleDesc" />
				<!-- <el-table-column label="数据权限" prop="data_authority" /> -->
				<el-table-column prop="data_authority" label="数据权限" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="dictType" :value="scope.row.dsType"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleDetail(row)">查看权限</el-button>
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="primary" link @click="handleAuthorize(row)">授权</el-button>
						<el-button type="primary" link @click="handleDelete(row.roleId)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 角色编辑、新增  -->
		<role-dialog ref="roleDialogRef" @refresh="getDataList()" />
		<!-- 授权 -->
		<permession ref="permessionRef" />
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { pageList } from '/@/api/member/backendUsers/role';
import { delObj,delObjTenantId } from '/@/api/admin/role';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
// import { detAgreement } from '/@/api/points/agreement';

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('./form.vue'));
const Permession = defineAsyncComponent(() => import('./permession.vue'));
const roleDialogRef = ref();
const permessionRef = ref();

// 搜索变量
// const { query } = route;
const queryRef = ref();
let sysUserName = ref('');
const dictType = ref([
	{
		label: '全部',
		value: '0',
	},
	{
		label: '自定义',
		value: '1',
	},
	{
		label: '本级及子级',
		value: '2',
	},
	{
		label: '本级',
		value: '3',
	},
	{
		label: '本人',
		value: '4',
	},
]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList,
	queryForm: {},
	dataList: [],
});
const tenantId = ref('');
const show = (row: any) => {
	tenantId.value = '';
	// state.queryForm.unionId = id;
	if (row) {
		sysUserName.value = row.sysUserName;
		console.log('row.tenantId', row.tenantId);
		tenantId.value = row.tenantId;
		state.queryForm.tenantId = row.tenantId;
	}
	getDataList();
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const emit = defineEmits(['changeType']);
const toForward = () => {
	queryRef.value.resetFields();
	emit('changeType');
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const handleAdd = () => {
	roleDialogRef.value.openDialog(tenantId.value);
};

const handleEdit = (row: any) => {
	roleDialogRef.value.openDialog(tenantId.value, row);
};
const handleDelete = async (ids: string) => {
	try {
		await useMessageBox().confirm('此操作将永久删除');
	} catch {
		return;
	}
	try {
		await delObjTenantId([ids], tenantId.value);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const handleAuthorize = (row: any) => {
	permessionRef.value.openDialog(row, 'auth', tenantId.value);
};
const handleDetail = (row: any) => {
	permessionRef.value.openDialog(row, 'detail', tenantId.value);
};

defineExpose({
	show,
});
</script>
<style lang="scss" scoped>
.back-icon {
	font-size: 20px;
	.el-icon {
		height: 100%;
	}
}
.font-bold {
	font-weight: 700;
	font-size: 24px;
	margin: 0 0 10px 0;
}
</style>
