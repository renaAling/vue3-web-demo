<template>
	<div>
		<el-dialog title="查看日志" ref="myDialog" v-model="visible" width="60%" :close-on-click-modal="false" :before-close="resetForm">
			<el-table
				:data="dataList"
				v-loading="loading"
				row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				height="200"
			>
				<el-table-column type="index" label="序号" width="60" show-overflow-tooltip></el-table-column>
				<el-table-column prop="interfaceUrl" label="接口地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="configTime" label="配置时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="configUser" label="配置人员" show-overflow-tooltip></el-table-column>
			</el-table>
			<el-pagination
				background
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="[10, 20, 50, 100, 200]"
				:total="total"
				:page-size="pageSize"
				:current-page="currentPage"
				@size-change="handleSizeChange"
				@current-change="handlePageChange"
			></el-pagination>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getInterfaceConfigGetLogPageApi } from '/@/api/travel/subwayInformation';
const emit = defineEmits(['refresh']);
const visible = ref(false);
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const queryForm = ref<any>({
	type: '',
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
});

const { tableStyle } = useTable(state);

const openDialog = (row?: any) => {
	if (row?.type) {
		queryForm.value.type = Number(row.type);
	}
	getDataList();
	visible.value = true;
};

const resetForm = () => {
	emit('refresh');
	visible.value = false;
};

const getDataList = async () => {
	const params = {
		...queryForm.value,
		pageNum: currentPage.value,
		pageSize: pageSize.value,
	};
	const res = await getInterfaceConfigGetLogPageApi(params);
	dataList.value = res.data.records;
	total.value = res.data.total;
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getDataList();
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getDataList();
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
