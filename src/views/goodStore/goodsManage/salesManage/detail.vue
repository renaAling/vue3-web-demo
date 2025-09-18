<template>
	<div>
		<el-dialog title="库存明细" v-model="visible" width="60%">
			<el-table :data="inventoryList" border :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column label="商品ID" prop="productCode" show-overflow-tooltip width="140" />
				<el-table-column label="商品名称" prop="productName" />
				<el-table-column label="规格" prop="skuName" width="140" />
				<el-table-column label="库存" prop="inventory" width="140">
					<!-- <template #default="{ row }">
						<el-input v-model.number="row.inventory" placeholder="请输入初始库存数量"></el-input>
					</template> -->
				</el-table-column>
			</el-table>
			<template #footer>
				<el-button type="primary" size="default" @click="visible = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getInventoryDetails } from '/@/api/goodStore/salesManage';
import { BasicTableProps, useTable } from '/@/hooks/table';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const inventoryList = ref([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});

//  table hook
const { tableStyle } = useTable(state);

const openDialog = async (saleCode: string) => {
	visible.value = true;
	getInventoryDetails(saleCode).then((res) => {
		if (res.code === 0) {
			inventoryList.value = res.data;
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.scope-list {
	display: flex;
	flex-direction: column;
	width: 314px;
	flex-wrap: nowrap;

	border: 2px solid #efefef;
	padding: 10px;

	.add-btn {
		display: flex;
		align-items: center;
		color: #165dff;
		cursor: pointer;
	}

	.list {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.el-icon {
			cursor: pointer;
		}

		&:hover {
			color: #165dff;
		}
	}
}
</style>
