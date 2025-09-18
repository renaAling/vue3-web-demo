<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="分组名称">
						<el-input placeholder="请输入分组名称" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker
							v-model="daterangeTime"
							@change="changeTime"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8">
					<el-button type="primary" icon="Plus" class="mr10" @click="handleAdd">新增</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" align="center" />
				<el-table-column label="分组名称" prop="name" />
				<el-table-column label="分组说明" prop="description" show-overflow-tooltip />
				<el-table-column label="用户数" prop="userCount" />
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="操作" width="220">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="primary" link @click="handleDel(row)">删除</el-button>
						<el-button type="primary" link @click="handleDetail(row)">查看用户列表</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<FormDialog v-model="formDialogVisible" :row="currentRow" :type="type" @ok="getDataList" />
	</div>
</template>

<script lang="ts" setup name="userGroup">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getUserGroupPage, deleteUserGroup, userGroupDetail } from '/@/api/culture/userManage';

const FormDialog = defineAsyncComponent(() => import('./userGroupForm.vue'));

const router = useRouter();
const type = ref<'add' | 'edit'>('add');
const formDialogVisible = ref(false);
const currentRow = ref();
const handleAdd = () => {
	formDialogVisible.value = true;
	currentRow.value = {};
	type.value = 'add';
};

const handleEdit = async (row: any) => {
	const res = await userGroupDetail(row.id);
	currentRow.value = { ...res.data };
	formDialogVisible.value = true;
	type.value = 'edit';
};

// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getUserGroupPage,
	queryForm: {},
	dataList: [],
});

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.createTimeStart = `${val[0]} 00:00:00`;
	state.queryForm.createTimeEnd = `${val[1]} 23:59:59`;
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
  state.queryForm = {};
  daterangeTime.value = [];
	getDataList();
};

const handleDetail = (row: any) => {
	router.push({
		path: `/culture/userManage/userGroup/userGroupList`,
		query: {
			name: row.name,
			code: row.code,
		},
	});
};

const handleDel = async (row: any) => {
	try {
		await useMessageBox().confirm('此操作将永久删除，并自动解除该分组下的所有关联');
		let res = await deleteUserGroup(row.id);
		if (!res.ok) {
			return useMessage().error(res.msg);
		}
		getDataList();
		return true;
	} catch (err: any) {
		return false;
	}
};
</script>
