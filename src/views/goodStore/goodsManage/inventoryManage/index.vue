<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="商家ID" prop="merchantCode">
					<el-input placeholder="请输入商家ID" v-model="state.queryForm.merchantCode" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="商家名称" prop="merchantName">
					<el-input placeholder="请输入商家名称" v-model="state.queryForm.merchantName" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="门店ID" prop="storeCode">
					<el-input placeholder="请输入门店ID" v-model="state.queryForm.storeCode" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="门店名称" prop="storeName">
					<el-input placeholder="请输入门店名称" v-model="state.queryForm.storeName" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
			<el-row class="mb10">
				<el-button type="primary" icon="minus" @click="handleOperation('out')">出库</el-button>
				<el-button type="primary" icon="plus" @click="handleOperation('in')">入库</el-button>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="商家ID" prop="merchantCode" show-overflow-tooltip />
				<el-table-column label="商家名称" prop="merchantName" show-overflow-tooltip />
				<el-table-column label="门店名称" prop="storeName" show-overflow-tooltip />
				<el-table-column label="库存类型" prop="type" width="140">
					<template #default="{ row }">
						<div v-if="row.type == 1">出库</div>
						<div v-else-if="row.type == 2">入库</div>
					</template>
				</el-table-column>
				<el-table-column label="商品数" prop="num" width="200" />
				<el-table-column label="备注" prop="remark" width="200" />
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleOperation('detail', row)">查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 库存明细  -->
		<ConfigDialog @refresh="getDataList()" ref="configDialogRef" />
		<DetailDialog @refresh="getDataList()" ref="detailDialogRef" />
	</div>
</template>

<script lang="ts" name="gs-shop-store" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getInventoryList } from '/@/api/goodStore/inventoryManage';
import type { FormInstance, FormRules } from 'element-plus';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const DetailDialog = defineAsyncComponent(() => import('./detail.vue'));

const queryRef = ref();
const configDialogRef = ref();
const detailDialogRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getInventoryList,
	queryForm: {},
	pagination: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 操作
const handleOperation = async (type: string, row?: any) => {
	if (type === 'in') {
		configDialogRef.value.openDialog(type);
	} else if (type === 'out') {
		configDialogRef.value.openDialog(type);
	} else if (type === 'detail') {
		detailDialogRef.value.openDialog(row);
	}
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
<style lang="scss" scoped>
.page_title {
	font-size: 18rpx;
	font-weight: bold;
}

.text-c-1 {
	color: #67c23a;
}

.text-c-2 {
	color: #f56c6c;
}

.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
