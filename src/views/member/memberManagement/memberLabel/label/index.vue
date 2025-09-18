<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-row>
						<el-form-item label="标签分类" prop="categoryCode">
							<el-select v-model="state.queryForm.categoryCode" placeholder="请选择标签分类" clearable>
								<el-option v-for="item in categoryCodeList" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode" />
							</el-select>
						</el-form-item>
						<el-form-item label="标签名称" prop="name">
							<el-input placeholder="请输入标签名称" maxlength="50" style="width: 220px" v-model="state.queryForm.name" clearable />
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
						<el-form-item label="标签类型" prop="type">
							<el-select v-model="state.queryForm.type" style="width: 220px" placeholder="选择标签分类" clearable>
								<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-row class="ml10 mb10">
				<el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" width="80" align="center" label="序号" />
				<el-table-column prop="categoryName" label="标签分类" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="标签名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userNum" label="用户数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="description" label="标签说明" show-overflow-tooltip></el-table-column>
				<el-table-column prop="type" label="标签类型" show-overflow-tooltip>
					<template #default="scope">
						<span v-if="scope.row.type == 1">系统标签</span>
						<span v-if="scope.row.type == 2">用户标签</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button v-if="!scope.row.isSystem" text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
						<el-button v-if="!scope.row.isSystem" text type="primary" @click="handleDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberSignPage, deleteMemberSignDel, getMemberSignCategoryList } from '/@/api/member/memberLabel/label';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const timeData = ref<string[]>([]);
const categoryCodeList = ref<any[]>([]);
const typeList = ref([
	{
		value: 1,
		label: '系统标签',
	},
	{
		value: 2,
		label: '用户标签',
	},
]);

watch(
	() => timeData.value,
	(val: string[]) => {
		console.log('val', val);
		if (val.length === 2) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

onMounted(() => {
	getMemberSignCategory();
});

const getMemberSignCategory = async () => {
	try {
		const { code, data, msg } = await getMemberSignCategoryList();
		if (code === 0) {
			console.log('data', data);
			categoryCodeList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleAdd = () => {
	formDialogRef.value.openDialog();
};
const handleEdit = (row: any) => {
	formDialogRef.value.openDialog(row);
};
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberSignPage,
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeData.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
const handleDel = async (row: any) => {
	await ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await deleteApi(row.id);
		})
		.catch(() => {
			return;
		});
	// try {
	// 	await ElMessageBox.confirm(`此操作将永久删除？`, '系统提示', {
	// 		confirmButtonText: '确定',
	// 		cancelButtonText: '取消',
	// 		type: 'warning',
	// 	});
	// } catch {
	// 	return;
	// }
};

const deleteApi = async (id: string) => {
	try {
		const { code, msg } = await deleteMemberSignDel(id);
		if (code === 0) {
			await getDataList();
			useMessage().success('删除成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		handleMsg(error.msg);
	}
};

const handleMsg = async (msg: string) => {
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
</script>
