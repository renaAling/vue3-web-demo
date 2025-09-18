<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="昵称" prop="nickName">
						<el-input placeholder="请输入昵称查询" v-model="state.queryForm.nickName" clearable />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input placeholder="请输入手机查询" v-model="state.queryForm.mobile" maxlength="11" clearable />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="configDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">新建</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" fixed="left" />
				<el-table-column label="ID" prop="id" />
				<el-table-column label="昵称" prop="nickName" />
				<el-table-column label="手机号" prop="mobile" show-overflow-tooltip />
				<el-table-column label="身份" prop="isSupplier">
					<template #default="{ row }">
						{{ row.isSupplier === 1 ? '供应商' : '管理员' }}
					</template>
				</el-table-column>
				<el-table-column label="角色" prop="roleInfos">
					<template #default="{ row }">
						<el-tag v-for="(item, index) in row.roleInfos" :key="index" class="mr10">{{ item.roleName }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="状态(启用/禁用)" prop="status">
					<template #default="{ row }">
						<el-switch
							v-model="row.status"
							:before-change="() => beforeChangeStatus(row)"
							:active-value="1"
							:inactive-value="2"
							:disabled="row.userId === currentUserId"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="configDialogRef.openDialog(row.id)" :disabled="row.userId === currentUserId"
							>编辑</el-button
						>
						<el-button type="primary" link icon="delete" @click="handleDel(row.id)" :disabled="row.userId === currentUserId">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 账户配置  -->
		<config-dialog @refresh="getDataList()" ref="configDialogRef" />
	</div>
</template>

<script lang="ts" name="culture-account-list" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { culturalBackUserDel, culturalBackUserIsEnable, culturalBackUserList } from '/@/api/culture/systemMange';
import { useUserInfo } from '/@/stores/userInfo';
import { onMounted, reactive, ref } from 'vue';
// 页面加载时
onMounted(() => {
	console.log('useUserInfo()', useUserInfo());
});
// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const queryRef = ref();

// 定义变量内容
const currentUserId = useUserInfo().userInfos.user.userId;
const configDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: culturalBackUserList,
	queryForm: {},
	dataList: [],
	descs: ['create_time'],
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const handleDel = async (id: number) => {
	try {
		await useMessageBox().confirm('是否删除该账户', '删除');
	} catch {
		return;
	}
	try {
		const { code, msg } = await culturalBackUserDel({ id });
		if (code === 0) {
			useMessage().success('删除成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const beforeChangeStatus = async (row: any) => {
	const { id, status } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${status === 1 ? '禁用' : '启用'}该账户`, `${status === 1 ? '禁用' : '启用'}`)
				.then(async () => {
					let params = { id: id, status: status === 1 ? 2 : 1 };
					try {
						const { code, msg } = await culturalBackUserIsEnable(params);
						if (code === 0) {
							useMessage().success(`${status === 1 ? '禁用' : '启用'}成功`);
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
