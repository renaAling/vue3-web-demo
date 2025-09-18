<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="flex justify-between items-center">
				<div>
					<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
						<el-form-item label="标签名称" prop="tagName">
							<el-input v-model="state.queryForm.tagName" placeholder="请输入标签名称查找" clearable />
						</el-form-item>
						<el-form-item>
							<el-button icon="Search" type="primary" @click="getDataList">查询</el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<el-row class="mb-3">
				<el-button icon="folder-add" type="primary" @click="entranceDialogRef.openDialog()"> 新增标签 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				row-key="id" border
				class="my-table"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" />
				<el-table-column label="标签名称" prop="tagName" />
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="创建人" prop="createBy" />
				<el-table-column label="操作" width="280">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="entranceDialogRef.openDialog(row)">编辑</el-button>
						<el-button type="danger" link icon="delete" @click="handleDelete(row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			<entrance-form ref="entranceDialogRef" @refresh="getDataList()" />
		</div>
	</div>
</template>

<script lang="ts" name="store-label-index" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import { tagList, delTag } from '/@/api/goodStore/xianwang';
import { BasicTableProps, useTable } from '/@/hooks/table';
// 动态引入组件
const EntranceForm = defineAsyncComponent(() => import('./form.vue'));
const queryRef = ref();
// 定义变量内容
const entranceDialogRef = ref();
interface GroupListItem {
	id?: any;
	tagName: string;
	sequence?: number;
}
const queryForm = ref<GroupListItem>({
	tagName: '',
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: tagList,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// 删除操作
const handleDelete = async (id: string) => {
	try {
		await useMessageBox().confirm('确定要删除吗？');
	} catch {
		return;
	}
	try {
		await delTag(id);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
onMounted(() => {
	getDataList();
});
</script>
