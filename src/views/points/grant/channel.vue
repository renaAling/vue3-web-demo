<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				row-key="unionId"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="发放场景" prop="thirdName" />
				<el-table-column label="调用接口" prop="apiUrl" />
				<el-table-column label="状态" prop="status">
					<template #default="scope">
						<el-switch
							v-model="scope.row.status"
							:active-value="true"
							style="--el-switch-on-color: #13ce66"
							:inactive-value="false"
							:before-change="() => beforeChange(scope.row)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="primary" link @click="toSetRule(row)">积分规则设置</el-button>
						<el-button type="primary" link @click="toSetWhiteList(row)">白名单设置</el-button>
						<el-button type="primary" link @click="toRecord(row.id)">发放记录</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef"></formDialog>
		<whiteFormDialog ref="whiteFormDialogRef"></whiteFormDialog>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { thirdConfigUpdate, thirdConfigList } from '/@/api/points/grant';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';

const formDialog = defineAsyncComponent(() => import('./consume/ruleForm.vue'));
const formDialogRef = ref();
const whiteFormDialog = defineAsyncComponent(() => import('./whiteListForm.vue'));
const whiteFormDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: thirdConfigList,
	queryForm: {},
	dataList: [],
});
const router = useRouter();
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const toSetRule = (row) => {
	formDialogRef.value.openDialog(row, 'channel');
};
const toSetWhiteList = (row) => {
	whiteFormDialogRef.value.openDialog(row);
};
const toRecord = () => {
	router.push({ path: '/points/grant/record', query: { type: 'channel' } });
};

const beforeChange = async (row: any) => {
	const msg = !row.status ? '确定要启用该场景吗?' : '确定要禁用该场景吗?';
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
			id: row.id,
		};
		await thirdConfigUpdate(params);
		useMessage().success('操作成功');
		getDataList();
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
<style lang="scss" scoped></style>
