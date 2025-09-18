<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="用户ID" prop="unionId">
						<el-input placeholder="请输入UID" maxlength="50" v-model="state.queryForm.unionId" clearable style="width: 220px" />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input placeholder="请输入手机号" maxlength="11" v-model="state.queryForm.mobile" clearable style="width: 220px" />
					</el-form-item>
					<el-form-item label="姓名" prop="name">
						<el-input placeholder="请输入姓名" maxlength="10" v-model="state.queryForm.name" clearable style="width: 220px" />
					</el-form-item>
					<el-form-item label="子系统" prop="code">
						<el-select placeholder="请选择子系统" v-model="state.queryForm.code" clearable style="width: 220px">
							<el-option v-for="item in queryForm.channelArr" :key="item.code" :label="item.name" :value="item.code" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb10" style="width: 100%">
					<el-button icon="folder-add" type="primary" @click="handleCommand('add')"> 新增 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="unionId" label="用户ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="subSystemNum" label="授权子系统数" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="userState" label="启用/禁用" show-overflow-tooltip>
					<template #default="{ row }">
						<el-switch v-model="row.userState" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="2" />
					</template>
				</el-table-column>
				<el-table-column prop="authTime" label="授权时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button text type="primary" @click="handleCommand('detail', scope.row.unionId)">详情</el-button>
						<el-button text type="primary" @click="handleCommand('authorize', scope.row.unionId)">授权</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 新增/详情 -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
		<authorize-dialog @refresh="getDataList()" ref="authorizeDialogRef" />
	</div>
</template>

<script setup lang="ts" name="portal-account-index">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { systemList } from '/@/api/authority';
import { useRouter } from 'vue-router';
import { QueryForm } from './types';
import { getAccountPage, updateAccountStatus } from '/@/api/portal';
const router = useRouter();

const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const AuthorizeDialog = defineAsyncComponent(() => import('./authorize.vue'));
const formDialogRef = ref();
const authorizeDialogRef = ref();

// 组织可选列表
const queryForm = reactive<QueryForm>({
	deptArr: [],
	channelArr: [],
});

const handleCommand = (type: string, id?: string) => {
	switch (type) {
		case 'add':
			formDialogRef.value.openDialog();
			break;
		case 'detail':
			formDialogRef.value.openDialog(id);
			break;
		case 'authorize':
			authorizeDialogRef.value.openDialog(id);
			break;
	}
};

const getChannelList = async () => {
	const res = await systemList();
	queryForm.channelArr = res.data;
};
getChannelList();
// 定义变量内容
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		unionId: '',
		mobile: '',
		name: '',
		code: '',
	},
	pageList: getAccountPage, // H
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const beforeChangeStatus = async (row: any) => {
	const { unionId, userState } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${userState === 2 ? '启用' : '禁用'}该账号？`, `${userState === 2 ? '启用' : '禁用'}`)
				.then(async () => {
					let params = { unionId, userState: userState === 2 ? 1 : 2 };
					try {
						const { code, msg } = await updateAccountStatus(params);
						if (code === 0) {
							useMessage().success(`${userState === 2 ? '启用' : '禁用'}成功`);
							return resolve(true);
						} else {
							useMessage().error(msg);
						}
					} catch (err: any) {
						useMessage().error(err.msg);
					}
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};
</script>
