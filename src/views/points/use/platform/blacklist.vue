<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="用户id" prop="unionId">
						<el-input placeholder="请输入用户id" style="width: 180px" v-model="state.queryForm.unionId" />
					</el-form-item>
					<el-form-item label="用户名称" prop="userName">
						<el-input placeholder="请输入用户名称" style="width: 180px" v-model="state.queryForm.userName" />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input placeholder="请输入手机号" style="width: 180px" v-model="state.queryForm.mobile" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8 flex items-center">
				<div>
					<el-button type="primary" icon="plus" @click="addData"> 新增 </el-button>
					<el-button type="default" @click="exportExcel"> 导出 </el-button>
				</div>
			</el-row>
			<el-table border :data="state.dataList" v-loading="state.loading" row-key="unionId" 
				:cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" width="60" align="center" label="序号" />
				<el-table-column label="用户id" prop="unionId" />
				<el-table-column label="用户名称" prop="userName" />
				<el-table-column label="手机号" prop="mobile" />
				<el-table-column label="加入黑名单时间" prop="createTime" />
				<el-table-column label="加入黑名单原因" prop="reason" />
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button text type="danger" @click="handleDelete(row.id)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
				v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { getBlacklist, blackDel, blackExport, blackExportFilter } from '/@/api/points/grant';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
const formDialog = defineAsyncComponent(() => import('./blacklistForm.vue'));
const router = useRouter();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getBlacklist,
	queryForm: { type: 3 },
	dataList: [],
});
const formDialogRef = ref();
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const multipleSelection = ref([])
const handleSelectionChange = (val: any) => {
	multipleSelection.value = val
}

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const addData = () => {
	formDialogRef.value.openDialog();
};


// 下载业务报表
const exportExcel = async () => {
	try {
		await useMessageBox().confirm('导出完成后请到下载中心查看，是否继续导出？');
	} catch {
		return;
	}
	if (multipleSelection.value.length) {
		const selectIds = multipleSelection.value.map((item: any) => item.id);
		blackExportFilter({ ...state.queryForm, selectedIds: selectIds.join(',') }).then(() => {
			router.push({ path: '/downloadCenter' });
		});
	} else {
		blackExport(state.queryForm).then(() => {
			router.push({ path: '/downloadCenter' });
		});
	}

};
const handleDelete = async (id: string) => {
	try {
		await useMessageBox().confirm('是否删除当前黑名单用户？');
	} catch {
		return;
	}
	try {
		await blackDel(id);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
<style lang="scss" scoped></style>
