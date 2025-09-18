<template>
	<el-dialog :close-on-click-modal="false" title="关联商品" draggable v-model="visible" width="60%">
		<div class="dialog-content">
			<div class="search-box">
				<el-form ref="formRef" :model="searchForm" label-width="80px" :inline="true">
					<el-form-item label="商品名称" prop="spuName">
						<el-input v-model="searchForm.spuName" />
					</el-form-item>
					<el-form-item label="商家名称" prop="merchantName">
						<el-input v-model="searchForm.merchantName" />
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary" @click="handleSearch()">搜索</el-button>
						<el-button @click="resetForm()">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>

		<div class="table-box">
			<el-table border ref="tableRef" rowKey="skuCode" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column label="序号" type="index" width="55" />
				<el-table-column prop="" label="图片" width="100">
					<template #default="{ row }">
						<img :src="row.imageUrl" style="width: 60px; height: 60px" alt="" />
					</template>
				</el-table-column>
				<el-table-column prop="spuName" label="商品名称" width="160" />
				<el-table-column prop="merchantName" label="所属商家" />
			</el-table>

			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="page.page"
				:page-sizes="[10, 20, 30, 50]"
				:page-size="page.size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="page.total"
				style="margin-top: 10px"
			/>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeDialog()">取消</el-button>
				<el-button type="primary" @click="handleOk()">添加</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue';
import { FormInstance } from 'element-plus';
import { loadProductPageApi } from '/@/api/goodStore/mall';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits(['handleOk']);

let storeCode: string = '';
let defaultSeleted: Array<any> = [];

const visible = ref(false);
const formRef = ref<FormInstance>();
const tableRef = ref();
const searchForm = reactive({
	spuName: '',
	merchantName: '',
});
const page = ref({
	page: 1,
	size: 10,
	total: 0,
});
const tableData = ref([]);
const seletedRows = ref([]);

const openDialog = (opt: any) => {
	console.log('打开弹框', opt);
	visible.value = true;
	storeCode = opt.storeCode;
	defaultSeleted = opt.defaultSeleted || [];
	loadData();
};

const closeDialog = () => {
	visible.value = false;
};

const handleSearch = () => {
	loadData();
};
// 重置表单
const resetForm = () => {
	formRef.value?.resetFields();
	loadData();
};

// 加载表格数据
const loadData = async () => {
	let params = {
		storeCode: storeCode,
		current: page.value.page,
		size: page.value.size,
		...searchForm,
	};
	let res = await loadProductPageApi(params);
	if (res.code === 0) {
		tableData.value = res.data.records;
		page.value.total = res.data.total;
		// 默认选中
		seletedRows.value = [];
		// tableRef.value.clearSelection();
		defaultSeleted.forEach((skuCode) => {
			const findObj = tableData.value.find((item: any) => item.skuCode == skuCode);
			if (findObj) {
				seletedRows.value.push(findObj);
				nextTick(() => {
					tableRef.value?.toggleRowSelection(findObj, true);
				});
			}
		});
		console.log('默认选中', seletedRows.value);
	} else {
		useMessage().error(res.msg || '加载失败');
	}
};
// 表格勾选
const handleSelectionChange = (val: []) => {
	// console.log('表格勾选', val);
	seletedRows.value = val;
};

const handleCurrentChange = (val: number) => {
	page.value.page = val;
	loadData();
};
const handleSizeChange = (val: number) => {
	page.value.size = val;
	page.value.page = 1;
	loadData();
};

const handleOk = () => {
	console.log('handleOk', seletedRows.value);
	const data = {
		selectedRows: seletedRows.value,
	};
	emit('handleOk', data);
	closeDialog();
};

// 暴露属性和方法
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.dialog-content {
	padding: 10px;
}
</style>
