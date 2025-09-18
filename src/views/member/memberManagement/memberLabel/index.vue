<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="标签ID" prop="code">
						<el-input placeholder="请输入标签ID" style="width: 220px" maxlength="50" v-model="state.queryForm.code" clearable />
					</el-form-item>
					<el-form-item label="标签名称" prop="name">
						<el-input placeholder="请输入标签名称" style="width: 220px" maxlength="50" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" style="width: 220px" placeholder="选择标签状态" clearable>
							<el-option v-for="item in queryForm.stateArr" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button icon="plus" type="primary" @click="addOrEditRef.openDialog()"> 新增 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="code" label="标签ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="标签名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="description" label="说明" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userNum" label="用户数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="状态" show-overflow-tooltip>
					<template #default="{ row }">
						<el-switch v-model="row.status" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="2" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="primary" @click="toDetail(row)">管理用户</el-button>
						<el-button text type="primary" @click="addOrEditRef.openDialog(row)">编辑</el-button>
						<el-button text type="danger" @click="handelDel(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<AddOrEdit ref="addOrEditRef" @refresh="getDataList" />
	</div>
</template>

<script setup lang="ts" name="member-group">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageSignInfoDel, pageSignList, pageSignUpdate } from '../../../../api/member/member';
import { useRouter } from 'vue-router';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { merchantUpdateStatus } from '/@/api/goodStore/merchant';
import { QueryForm } from './types';

// 引入组件
const AddOrEdit = defineAsyncComponent(() => import('./addOrEdit.vue'));
const router = useRouter();
const addOrEditRef = ref();

// 组织可选列表
const queryForm = reactive<QueryForm>({
	stateArr: [
		{
			value: '1',
			label: '启用',
		},
		{
			value: '2',
			label: '停用',
		},
	],
	levelArr: [],
});

const toDetail = (row: any) => {
	console.log('row', row);
	router.push({ path: '/member/memberManagement/memberLabel/userList', query: { code: row.code, status: row.status, name: row.name } });
};
const handelDel = (row: any) => {
	if (row.userNum) {
		useMessage().error('该标签有员工，不能删除');
		return;
	}
	useMessageBox()
		.confirm('是否删除该标签', '删除')
		.then(async () => {
			try {
				const { code } = await pageSignInfoDel(Number(row.id));
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		});
};
const queryRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		code: '',
		name: '',
		status: null,
		level: '',
	},
	pageList: pageSignList,
	descs: ['create_time'],
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const beforeChangeStatus = async (row: any) => {
	const { id, status } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${status === 1 ? '禁用' : '启用'}该标签`, `${status === 1 ? '禁用' : '启用'}`)
				.then(async () => {
					let params = { id: id, status: status === 1 ? 2 : 1 };
					try {
						const { code } = await pageSignUpdate(params);
						if (code === 0) {
							useMessage().success(`${status === 1 ? '禁用' : '启用'}成功`);
							getDataList();
							return resolve(true);
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
