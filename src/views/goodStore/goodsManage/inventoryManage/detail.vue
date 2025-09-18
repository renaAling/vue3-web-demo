<template>
	<el-dialog :title="dialogTitle" v-model="visible" width="60%">
		<el-form :model="form" style="margin-bottom: 10px" label-width="auto">
			<el-form-item label="选择商家">
				<el-input v-model="form.merchantName" disabled></el-input>
			</el-form-item>
			<el-form-item label="选择门店">
				<el-input v-model="form.storeName" disabled></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="form.remark" type="textarea" disabled></el-input>
			</el-form-item>
		</el-form>
		<el-table border :data="inventoryList" :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
			<el-table-column label="商品ID" prop="productCode" show-overflow-tooltip width="140" />
			<el-table-column label="商品名称" prop="productName" />
			<el-table-column label="规格" prop="skuName" width="140" />
			<el-table-column label="库存" prop="operateNum" width="140" />
		</el-table>
		<template #footer>
			<el-button type="primary" size="default" @click="visible = false">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getInventoryDetail } from '/@/api/goodStore/inventoryManage';
import { BasicTableProps, useTable } from '/@/hooks/table';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const dialogTitle = ref('');
const inventoryList = ref([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});

const form = ref({
	merchantName: '',
	storeName: '',
	remark: '',
});

//  table hook
const { tableStyle } = useTable(state);

const openDialog = async (row: any) => {
	if (row.type === 1) {
		dialogTitle.value = '出库详情';
	} else {
		dialogTitle.value = '入库详情';
	}
	getInventoryDetail(row.logCode).then((res) => {
		if (res.code === 0) {
			form.value = { ...res.data };
			inventoryList.value = res.data.logDetails;
			visible.value = true;
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
