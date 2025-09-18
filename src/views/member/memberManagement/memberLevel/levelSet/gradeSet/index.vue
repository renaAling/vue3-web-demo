<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10 mb10">
				<el-button type="primary" icon="plus" @click="handleAdd(dataList)">新增</el-button>
			</el-row>
			<el-table
				:data="dataList"
				v-loading="loading"
				style="width: 100%"
				row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" width="60" align="center" label="序号" />
				<el-table-column prop="level" label="等级" show-overflow-tooltip>
					<template #default="{ row }">
						<span>LV{{ row.level }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="levelName" label="等级名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="threshold" label="升级所需成长值" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="{ row, $index }">
						<el-button text type="primary" @click="handleEdit(dataList, $index, row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<formDialog ref="formDialogRef" @refresh="getList"></formDialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberLevelPage } from '/@/api/member/memberLevel/gradeSet';
import { useMessage } from '/@/hooks/message';

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const handleAdd = (list: any) => {
	formDialogRef.value.openDialog(list, list.length);
};
const handleEdit = (list: any, index: number, row: any) => {
	formDialogRef.value.openDialog(list, index, row);
};
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
//  table hook
const { tableStyle } = useTable(state);

onMounted(() => {
	getList();
});

const getList = async () => {
	loading.value = true;
	try {
		const { code, data, msg } = await getMemberLevelPage();
		if (code === 0) {
			dataList.value = data;
			loading.value = false;
		} else {
			useMessage().error(msg);
			loading.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		loading.value = false;
	}
};

// const handleSizeChange = (val: number) => {
// 	pageSize.value = val;
// 	getList();
// };

// const handlePageChange = (page: number) => {
// 	currentPage.value = page;
// 	getList();
// };
</script>
