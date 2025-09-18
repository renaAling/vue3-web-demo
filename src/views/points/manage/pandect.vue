<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="版本号" prop="version">
						<el-input placeholder="请输入版本号" style="width: 180px" v-model="state.queryForm.version" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8 flex items-center">
				<div>
					<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 新增用户协议 </el-button>
				</div>
			</el-row>
			<el-table :data="state.dataList" v-loading="state.loading" row-key="id" border 
				:cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column label="版本号" prop="version" />
				<el-table-column label="版本说明" prop="remark" />
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="最后修改时间" prop="updateTime" />
				<el-table-column label="操作人" prop="updateBy" />
				<el-table-column label="版本状态" prop="status">
					<template #default="scope">
						<el-switch v-model="scope.row.status" :active-value="1" style="--el-switch-on-color: #13ce66"
							:inactive-value="2" :before-change="() => beforeChange(scope.row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" prop="createTime">
					<template #default="scope">
						<el-button text type="primary" @click="formDialogRef.openDialog(scope.row)"> 编辑
						</el-button>
						<el-button text type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
				v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getPageByGroupCodeByScore, detAgreement, updateProtocolByScore } from '/@/api/points/agreement';
// import {accountList } from '/@/api/points/manage';
// 表单
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getPageByGroupCodeByScore,
	queryForm: { groupCode: 'score_agreement' },
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const queryRef = ref();
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const handleDelete = async (ids: string) => {
	try {
		await useMessageBox().confirm('是否删除当前用户积分协议？');
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
const beforeChange = async (row: any) => {
	const msg = row.status == 2 ? '确定要启用该版本吗?' : '确定要禁用该版本吗?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		let changeStatus: any;
		if (row.status == 1) changeStatus = 2;
		if (row.status == 2) changeStatus = 1;
		const params = {
			status: changeStatus,
			id: row.id,
		};
		await updateProtocolByScore(params);
		useMessage().success('操作成功');
		getDataList();
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
<style lang="scss" scoped></style>
