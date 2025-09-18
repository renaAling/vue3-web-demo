<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="60%" :before-close="resetForm">
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="longitude" label="状态">
					<template #default="{ row }">
						<span v-if="row.status == 1">签约</span>
						<span v-else-if="row.status == 2">解约</span>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="时间" />
				<el-table-column prop="createBy" label="操作人" />
				<el-table-column prop="reason" label="备注" show-overflow-tooltip />
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm">取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { getExpertLogPageApi } from '/@/api/note/noteInfo';
import { ElForm } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('查看日志');
// 定义子组件向父组件传值/事件
const openDialog = (row?: any) => {
	console.log('row', row);
	state.queryForm.userId = row.userId;
	getDataList();
	visible.value = true;
};
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getExpertLogPageApi,
	createdIsNeed: false,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const resetForm = () => {
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
