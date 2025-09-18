<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="分组名称" prop="name">
						<el-input placeholder="请输入分组名称" style="width: 220px" maxlength="50" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="创建时间" prop="timeData">
						<el-date-picker
							v-model="timeData"
							type="daterange"
							range-separator="-"
							style="width: 400px"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							clearable
						/>
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
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="分组名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="description" label="说明" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userNum" label="用户数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
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
import { getMemberGroupPage, deleteMemberGroupDel } from '/@/api/member/memberGroup';
import { useRouter } from 'vue-router';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { QueryForm } from './types';

// 引入组件
const AddOrEdit = defineAsyncComponent(() => import('./addOrEdit.vue'));
const router = useRouter();
const addOrEditRef = ref();
const timeData = ref<string[]>([]);
watch(
	() => timeData.value,
	(val: string[] | null) => {
		console.log('val', val);
		if (val && val.length === 2) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

const handleDelApi = async (id: string) => {
	try {
		const { code, msg } = await deleteMemberGroupDel(id);
		if (code === 0) {
			getDataList();
			useMessage().success('删除成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		handleMsg(error.msg);
	}
};
// 删除
const handelDel = async (row: any) => {
	console.log('row', row);
	ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await handleDelApi(row.id);
		})
		.catch(() => {
			return;
		});
};
const handleMsg = async (msg: any) => {
	await ElMessageBox.confirm(msg, '系统提示', {
		confirmButtonText: '确认',
		showClose: false,
		showCancelButton: false,
		type: 'warning',
	})
		.then(async () => {
			return;
		})
		.catch(() => {
			return;
		});
};
const queryRef = ref();
const showSearch = ref(true);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberGroupPage,
	descs: ['create_time'],
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeData.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
// const beforeChangeStatus = async (row: any) => {
// 	const { id, status } = row;
// 	return new Promise((resolve, reject) => {
// 		try {
// 			useMessageBox()
// 				.confirm(`是否${status === 1 ? '禁用' : '启用'}该分组`, `${status === 1 ? '禁用' : '启用'}`)
// 				.then(async () => {
// 					let params = { id: id, status: status === 1 ? 2 : 1 };
// 					try {
// 						const { code, msg } = await pageGroupaUpdate(params);
// 						if (code === 0) {
// 							useMessage().success(`${status === 1 ? '禁用' : '启用'}成功`);
// 							getDataList;
// 							return resolve(true);
// 						} else {
// 							useMessage().error(msg);
// 						}
// 					} catch (err: any) {
// 						useMessage().error(err.msg);
// 					}
// 				})
// 				.catch(() => {
// 					resolve(false);
// 				});
// 		} catch (err) {
// 			reject(false);
// 		}
// 	});
// };
</script>
