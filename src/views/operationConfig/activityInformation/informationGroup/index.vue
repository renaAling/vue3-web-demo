<template>
	<div class="layout-padding">
		<div class="flex justify-between align-center mb-4">
			<p class="title">活动分组管理</p>
			<el-button icon="plus" @click="handleCommand('add')" type="primary">新建分组</el-button>
		</div>

		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="分组名称" prop="name">
						<el-input placeholder="请输入分组名称" maxlength="50" style="width: 220px" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="创建时间" prop="searchTime">
						<el-date-picker
							v-model="searchTime"
							@change="changeSearchTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" clearable @change="getDataList">
							<el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				ref="tableRef"
			>
				<el-table-column label="分组名称" prop="groupName" show-overflow-tooltip />
				<el-table-column label="分组描述" prop="groupDescription" show-overflow-tooltip />
				<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip />
				<el-table-column label="活动数量" prop="activityCount" show-overflow-tooltip />
				<el-table-column label="状态" prop="status">
					<template #default="{ row }">
						<el-switch v-model="row.status" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="0" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="80">
					<template #default="{ row }">
						<div class="flex justify-around">
							<el-icon @click="handleCommand('edit', row)">
								<Edit />
							</el-icon>
							<el-icon @click="handleCommand('delete', row)">
								<Delete />
							</el-icon>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	getActivityInfoGroupDelJudge,
	getActivityInfoGroupPage,
	getActivityInfoGroupUpdate,
	getActivityInfoGroupDel,
} from '/@/api/operationConfig/activityInformation';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

// 定义变量内容
const formDialogRef = ref();
const tableRef = ref();
const queryRef = ref();
// const router = useRouter();
const searchTime = ref([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getActivityInfoGroupPage,
	dataList: [],
	loading: false,
});
const optionList = [
	{ label: '启用', value: 1 },
	{ label: '禁用', value: 0 },
];
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
watch(
	() => searchTime.value,
	(val) => {
		if (val) {
			if (val[0] && val[1]) {
				state.queryForm.startTime = val[0] + ' 00:00:00';
				state.queryForm.endTime = val[1] + ' 23:59:59';
			} else {
				state.queryForm.startTime = '';
				state.queryForm.endTime = '';
			}
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);
const changeSearchTime = (val: any) => {
	if (!val) {
		state.queryForm.startTime = '';
		state.queryForm.endTime = '';
	}
	getDataList();
};
const beforeChangeStatus = (row: any) => {
	console.log('row', row);
	try {
		useMessageBox()
			.confirm(`是否${row.status === 0 ? '启用' : '禁用'}该分组？`, `${row.status === 2 ? '启用' : '禁用'}`)
			.then(async () => {
				try {
					const { code, msg } = await getActivityInfoGroupUpdate({ id: row.id, status: row.status === 0 ? 1 : 0 });
					if (code === 0) {
						useMessage().success(`${row.status === 0 ? '启用' : '禁用'}成功`);
						getDataList();
					} else {
						useMessage().error(msg);
					}
				} catch (err: any) {
					useMessage().error(err.msg);
				}
			})
			.catch(() => {});
	} catch (err) {}
};
// // 操作项
const handleCommand = async (type: string, row?: any) => {
	switch (type) {
		case 'add':
			formDialogRef.value.openDialog(row, type);
			break;
		case 'edit': // 编辑
			formDialogRef.value.openDialog(row, type);
			break;
		case 'delete':
			//
			try {
				await getActivityInfoGroupDelJudge(Number(row.id));
			} catch (err: any) {
				useMessage().error(err.msg);
				return;
			}
			try {
				await useMessageBox().confirm(`请确认是否删除当前活动分组？`, '删除活动分组');
			} catch {
				return;
			}
			try {
				await getActivityInfoGroupDel(Number(row.id));
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
	}
};
// 清空搜索条件;
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.name = '';
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
</script>
<style lang="scss" scoped>
.title {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: #1d2129;
	// margin-bottom: 16px;
}
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
