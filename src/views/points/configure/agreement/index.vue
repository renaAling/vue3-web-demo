<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb8 flex items-center">
				<div>
					<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 新增用户协议 </el-button>
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
				<el-table-column label="用户协议名称" prop="name" />
				<el-table-column label="版本号" prop="version" />
				<el-table-column label="上传时间" prop="updateTime" />
				<el-table-column label="操作人" prop="updateBy" />
				<el-table-column label="操作" prop="createTime">
					<template #default="scope">
						<el-button text type="primary" @click="formDialogRef.openDialog(scope.row.protocolId)"> 编辑 </el-button>
						<el-button text type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                v-bind="state.pagination" /> -->
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getListByGroupCode, detAgreement } from '/@/api/points/agreement';

// 表单
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getListByGroupCode,
	queryForm: {
		groupCode: 'score_agreement',
	},
	isPage: false,
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleDelete = async (ids: string) => {
	try {
		await useMessageBox().confirm('确认删除该条数据？');
	} catch {
		return;
	}

	try {
		await detAgreement(ids);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
<style lang="scss" scoped></style>
