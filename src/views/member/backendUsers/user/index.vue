<template>
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="所属系统" prop="channelCode">
							<el-select v-model="state.queryForm.channelCode" clearable style="width: 180px" placeholder="请选择系统">
								<el-option v-for="item in systemList" :key="item.channelCode" :label="item.platformName" :value="item.channelCode"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="用户名" prop="userName" maxlength="30">
							<el-input placeholder="请输入用户名" clearable style="width: 180px" v-model="state.queryForm.userName" />
						</el-form-item>
						<el-form-item label="姓名" prop="name" maxlength="5">
							<el-input placeholder="请输入姓名" clearable style="width: 180px" v-model="state.queryForm.name" />
						</el-form-item>
						<el-form-item label="联系电话" prop="mobile">
							<el-input placeholder="请输入联系电话" clearable style="width: 180px" v-model="state.queryForm.mobile" maxlength="11" />
						</el-form-item>
						<el-form-item label="状态" prop="userState" placeholder="请选择状态">
							<el-select v-model="state.queryForm.userState" clearable style="width: 180px">
								<el-option label="正常" value="1">正常</el-option>
								<el-option label="冻结" value="2">冻结</el-option>
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
						<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 新增 </el-button>
					</div>
					<div>
						<el-button type="primary" icon="download" @click="exportExcel"> 导出表格 </el-button>
					</div>
				</el-row>
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					row-key="id"
					border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="55" />
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="用户名" prop="userName" />
					<el-table-column label="姓名" prop="name" />
					<el-table-column label="联系电话" prop="mobile" />
					<el-table-column label="创建时间" prop="createTime" />
					<el-table-column label="状态" prop="userState">
						<template #default="scope">
							<el-tag v-if="scope.row.userState == 1">正常</el-tag>
							<el-tag v-if="scope.row.userState == 2">冻结</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toDetail(row.unionId)">查看</el-button>
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
import { getBackendUsersForMember, getChannelConfigList } from '/@/api/member/backendUsers/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
import listDetail from './details.vue';

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const listDetailRef = ref();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getBackendUsersForMember,
	queryForm: {},
	dataList: [],
});
const systemList = ref<any[]>([]);
let type = ref('list');

onMounted(() => {
	getChannelConfig();
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle, downBlobFile } = useTable(state);

const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
	multipleSelection.value = val;
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const changeType = () => {
	type.value = 'list';
	getDataList();
};
const toDetail = (unionId: string) => {
	listDetailRef.value.show(unionId);
	type.value = 'detail';
};

const getChannelConfig = async () => {
	try {
		const { code, data, msg } = await getChannelConfigList();
		if (code === 0) {
			systemList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 下载业务报表
const exportExcel = async () => {
	let ids = '';
	if (multipleSelection.value?.length > 0) {
		console.log('multipleSelection.value', multipleSelection.value);
		ids = multipleSelection.value.map((item: any) => item.id).join(',');
	}
	const params = { ...state.queryForm, ids };
	downBlobFile('/uac/userCenter/exportBackendUsersForMember', params, '用户管理分页数据.xlsx');
};
</script>
<style lang="scss" scoped></style>
