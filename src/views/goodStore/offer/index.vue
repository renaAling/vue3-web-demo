<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="flex justify-between items-center">
				<div>
					<el-form ref="formRef" :inline="true" :model="queryForm">
						<el-form-item label="供应商名称" prop="supplierName">
							<el-input v-model="queryForm.supplierName" placeholder="请输入供应商名称" />
						</el-form-item>
						<el-form-item>
							<el-button icon="Search" type="primary" @click="getDataList">查询</el-button>
							<el-button icon="Refresh" @click="onReset()">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<el-row>
				<div class="tool-box">
					<el-button icon="folder-add" type="primary" @click="entranceDialogRef.openDialog()"> 新增 </el-button>
				</div>
			</el-row>
			<el-table
				:data="dataList"
				row-key="id" border
				class="my-table"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" />
				<el-table-column label="供应商名称" prop="supplierName" />
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="创建人" prop="createBy" />
				<el-table-column label="操作" width="280">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" link icon="delete" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="page" />
			<EditDialog ref="entranceDialogRef" @refresh="getDataList()" />
		</div>
	</div>
</template>

<script lang="ts" name="store-label-index" setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import pagination from '/@/components/Pagination/index.vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { supplierPageApi, delSupplierApi } from '/@/api/goodStore/offer';
import { BasicTableProps, useTable } from '/@/hooks/table';
// 动态引入组件
const EditDialog = defineAsyncComponent(() => import('./components/editDialog.vue'));

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: supplierPageApi,
	queryForm: {},
	dataList: [],
});
const { tableStyle } = useTable(state);

// 定义变量内容
const entranceDialogRef = ref();
const formRef = ref();
const page = ref({
	total: 0,
	size: 10,
	current: 1,
});

const queryForm = reactive({
	supplierName: null,
});
const sizeChangeHandle = (val: number) => {
	page.value.size = val;
	getDataList();
};
const currentChangeHandle = (val: number) => {
	page.value.current = val;
	getDataList();
};
// 清空搜索条件
const onReset = () => {
	formRef.value?.resetFields();
	getDataList();
};
const dataList = ref([]);
const getDataList = async () => {
	let params = {
		current: page.value.current,
		size: page.value.size,
		...queryForm,
	};

	const { code, data } = await supplierPageApi(params);
	if (code === 0) {
		dataList.value = data.records;
		page.value.total = data.total;
	}
};

const handleEdit = (record: any) => {
	entranceDialogRef.value.openDialog(record);
};
// 删除操作
const handleDelete = async (record: any) => {
	try {
		await useMessageBox().confirm('确定要删除吗？');
	} catch {
		return;
	}

	try {
		let params = {
			id: record.id,
		};
		await delSupplierApi(params);
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

<style lang="scss" scoped>
.tool-box {
	margin-bottom: 10px;
}
</style>
