<template>
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="用户ID" prop="unionId" maxlength="5">
							<el-input placeholder="请输入用户ID" clearable style="width: 180px" v-model="state.queryForm.unionId" />
						</el-form-item>
						<el-form-item label="联系电话" prop="mobile">
							<el-input placeholder="请输入联系电话" clearable style="width: 180px" v-model="state.queryForm.mobile" maxlength="11" />
						</el-form-item>
						<el-form-item label="状态" prop="userState" placeholder="请选择状态">
							<el-select v-model="state.queryForm.userState" clearable style="width: 180px">
								<el-option label="正常" :value="1">正常</el-option>
								<el-option label="冻结" :value="2">冻结</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
				<el-row class="mb8 flex justify-between items-center">
					<div>
						<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 充值 </el-button>
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
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="用户ID" prop="unionId" />
					<el-table-column label="用户昵称" prop="userName" />
					<el-table-column label="联系电话" prop="mobile" />
					<el-table-column label="账户余额" prop="amountCurrent" />
					<el-table-column label="状态" prop="userState">
						<template #default="scope">
							<el-tag v-if="scope.row.userState == 1">正常</el-tag>
							<el-tag v-if="scope.row.userState == 2">冻结</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toDetail(row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="changeType"></listDetail>
	</div>
	<formDialog ref="formDialogRef" @refresh="getDataList" @addToDetail="toDetail"></formDialog>
</template>

<script lang="ts" setup name="manage-list">
import { getMemberUserStoredLogUserPage } from '/@/api/member/priceAccount/storedValueAccount';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
import listDetail from './details.vue';

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const listDetailRef = ref();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getMemberUserStoredLogUserPage,
	queryForm: {},
	dataList: [],
});
let type = ref('list');

onMounted(() => {
	// getChannelConfig();
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const changeType = () => {
	type.value = 'list';
	getDataList();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const toDetail = (row: any) => {
	listDetailRef.value.show(row);
	type.value = 'detail';
};

// const getChannelConfig = async () => {
// 	try {
// 		const { code, data, msg } = await getChannelConfigList();
// 		if (code === 0) {
// 			systemList.value = data;
// 		} else {
// 			useMessage().error(msg);
// 		}
// 	} catch (err: any) {
// 		useMessage().error(err.msg);
// 	}
// };

// 下载业务报表
// const exportExcel = async () => {
// 	try {
// 		await useMessageBox().confirm('导出完成后请到下载中心查看，是否继续导出？');
// 	} catch {
// 		return;
// 	}
// 	// if (multipleSelection.value.length) {
// 	// 	const selectIds = multipleSelection.value.map((item: any) => item.id);
// 	// 	exportAccountPageFilter({ ...state.queryForm, selectedIds: selectIds.join(',') }).then(() => {
// 	// 		router.push({ path: '/downloadCenter' });
// 	// 	});
// 	// } else {
// 	// 	exportAccountPage(state.queryForm).then(() => {
// 	// 		router.push({ path: '/downloadCenter' });
// 	// 	});
// 	// }
// };
// const beforeChange = async (row: any) => {
// 	const msg = row.status == 2 ? '确定要启用该员工吗?' : '确定要禁用该员工吗?';
// 	try {
// 		await useMessageBox().confirm(msg);
// 	} catch {
// 		return;
// 	}
// 	try {
// 		let changeStatus: any;
// 		if (row.status == 1) changeStatus = 2;
// 		if (row.status == 2) changeStatus = 1;
// 		const params = {
// 			status: changeStatus,
// 			unionId: row.unionId,
// 		};
// 		await accountUpdateStatus(params);
// 		useMessage().success('操作成功');
// 		getDataList();
// 		return true;
// 	} catch (err: any) {
// 		useMessage().error(err.msg);
// 	}
// };
</script>
<style lang="scss" scoped></style>
