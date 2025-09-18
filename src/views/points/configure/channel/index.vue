<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb8 flex items-center">
				<div>
					<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 新增发放渠道 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column label="发放渠道名称" prop="name" />
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="状态" prop="createTime">
					<template #default="scope">
						<el-switch
							v-model="scope.row.status"
							style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
							:before-change="() => beforeChange(scope.row)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作人" prop="createBy" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList()"></formDialog>
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { pageList, channelUpdateStatus } from '/@/api/points/config';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 表单
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const beforeChange = async (row: any) => {
	const msg = row.status ? '确定要禁用该渠道吗?' : '确定要启用该渠道吗?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		let changeStatus: any;
		if (row.status) changeStatus = false;
		if (!row.status) changeStatus = true;
		const params = {
			status: changeStatus,
			channelCode: row.channelCode,
		};
		await channelUpdateStatus(params);
		useMessage().success('操作成功');
		getDataList();
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
<style lang="scss" scoped></style>
