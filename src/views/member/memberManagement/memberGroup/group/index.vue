<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-row>
						<el-form-item label="分组名称" prop="type">
							<el-input placeholder="请输入分组名称" maxlength="50" style="width: 220px" v-model="state.queryForm.unionId" clearable />
						</el-form-item>
						<el-form-item label="创建时间" prop="time">
							<el-date-picker
								placeholder="请选择创建时间"
								type="date"
								v-model="state.queryForm.time"
								value-format="YYYY-MM-DD"
								style="width: 220px"
							></el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-row class="ml10 mb10">
				<el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" width="60" align="center" label="序号" />
				<el-table-column prop="unionId" label="分组名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="unionId" label="分组说明" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="用户数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="growthValue" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
						<el-button text type="primary" @click="handleDel(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageMemberList } from '/@/api/member/member';
import { useMessage, useMessageBox } from '/@/hooks/message';
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
onMounted(async () => {
	// const res = await getLevelList();
	// queryForm.levelArr = res.data;
});
const handleAdd = () => {
	formDialogRef.value.openDialog();
};
const handleEdit = (row: any) => {
	formDialogRef.value.openDialog(row);
};
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		unionId: '',
		mobile: '',
		userState: '',
		level: '',
	},
	pageList: pageMemberList,
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const handleDel = async (ids: string) => {
	try {
		await useMessageBox().confirm('是否删除当前分组？');
	} catch {
		return;
	}
	try {
		// await detAgreement(ids);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
