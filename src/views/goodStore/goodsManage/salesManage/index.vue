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
				<el-form-item label="商品ID" prop="productCode">
					<el-input placeholder="请输入商品ID" v-model="state.queryForm.productCode" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="商品名称" prop="productName">
					<el-input placeholder="请输入商品名称" v-model="state.queryForm.productName" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="门店ID" prop="storeCode">
					<el-input placeholder="请输入门店ID" v-model="state.queryForm.storeCode" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="门店名称" prop="storeName">
					<el-input placeholder="请输入门店名称" v-model="state.queryForm.storeName" clearable style="width: 230px" />
				</el-form-item>
				<el-form-item label="上架状态" prop="status">
					<el-select placeholder="请选择上架状态" v-model="state.queryForm.status" clearable>
						<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
			<el-row class="mb10">
				<el-button type="primary" icon="plus" @click="configDialogRef.openDialog()">发布商品</el-button>
				<el-button type="primary" :disabled="selectedArr.length == 0" @click="batchOperation('relist')">批量上架</el-button>
				<el-button type="primary" :disabled="selectedArr.length == 0" @click="batchOperation('unlist')">批量下架</el-button>
				<el-button type="danger" :disabled="selectedArr.length == 0" icon="delete" @click="batchOperation('delete')">批量删除</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="50" />
				<el-table-column label="商家名称" prop="merchantName" show-overflow-tooltip />
				<el-table-column label="商品图片" prop="imageUrl" >
					<template #default="{ row }">
						<img :src="row.imageUrl" class="img-center" />
					</template>
				</el-table-column>
				<el-table-column label="商品ID" prop="productCode" />
				<el-table-column label="商品名称" prop="productName" />
				<el-table-column label="门店名称" prop="storeName" />
				<el-table-column label="售价" prop="priceRange" />
				<el-table-column label="划线价" prop="otPriceRange" />
				<el-table-column label="库存" prop="inventory" />
				<el-table-column label="是否售磬" prop="isSellout">
					<template #default="{ row }">
						<el-switch
							v-model="row.isSellout"
							:active-value="true"
							:inactive-value="false"
							:before-change="() => beforeChangeSellout(row)"
						></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="上架状态" prop="status" >
					<template #default="{ row }">
						<el-switch v-model="row.status" :active-value="2" :inactive-value="1" :before-change="() => beforeChangeStatus(row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleOperation(row, 'stockDetail')">库存明细</el-button>
						<el-button type="primary" link @click="handleOperation(row, 'del')">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 发布商品 -->
		<ConfigDialog @refresh="getDataList()" ref="configDialogRef" />
		<!-- 库存明细  -->
		<DetailDialog @refresh="getDataList()" ref="detailDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getSalesList, delProduct, updateStatus, batchUpdateStatus, batchDelete, selloutUpdate } from '/@/api/goodStore/salesManage';
import type { FormInstance, FormRules } from 'element-plus';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const DetailDialog = defineAsyncComponent(() => import('./detail.vue'));

const queryRef = ref();
const configDialogRef = ref();
const detailDialogRef = ref();
const selectedArr = ref<any>([]);
const statusList = [
	{
		label: '下架',
		value: 1,
	},
	{
		label: '上架',
		value: 2,
	},
];

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getSalesList,
	queryForm: {},
	pagination: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 多选事件
const handleSelectionChange = (objs: { saleCode: string }[]) => {
	selectedArr.value = objs.map(({ saleCode }) => saleCode);
	// multiple.value = !objs.length;
};

// 切换上/下架状态
const beforeChangeStatus = async (row: any) => {
	const { saleCode, status } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${status === 2 ? '下架' : '上架'}该商品？`, `${status === 2 ? '下架' : '上架'}`)
				.then(async () => {
					try {
						const { code, msg } = await updateStatus({ saleCode, status: status === 2 ? 1 : 2 });
						if (code === 0) {
							useMessage().success(`${status === 2 ? '下架' : '上架'}成功`);
							getDataList();
							return resolve(true);
						} else {
							useMessage().error(msg);
						}
					} catch (err: any) {
						useMessage().error(err.msg);
					}
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};

// 切换售磬状态
const beforeChangeSellout = async (row: any) => {
	const { saleCode, isSellout } = row;
	return new Promise((resolve, reject) => {
		try {
			selloutUpdate({ saleCode, isSellout: isSellout ? false : true })
				.then((res) => {
					return resolve(true);
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		} catch (err) {
			return reject(false);
		}
	});
};

// 操作
const handleOperation = async (row: any, type: string) => {
	if (type === 'del') {
		try {
			await useMessageBox().confirm(`确定要将选中商品删除吗？`, '提示');
		} catch (err: any) {
			return false;
		}
		try {
			let res = await delProduct(row.saleCode);
			if (res.code === 0) {
				useMessage().success('已删除');
				getDataList();
			} else {
				useMessage().error(res.msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else if (type === 'stockDetail') {
		detailDialogRef.value.openDialog(row.saleCode);
	}
};

// 批量操作
const batchOperation = async (type: string) => {
	if (type === 'relist') {
		try {
			await useMessageBox().confirm(`确定要将选中的商品批量上架吗？`, '提示');
			const { code, msg } = await batchUpdateStatus({ saleCodes: selectedArr.value, status: 2 });
			if (code === 0) {
				useMessage().success('批量上架成功');
				getDataList();
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else if (type === 'unlist') {
		try {
			await useMessageBox().confirm(`确定要将选中的商品批量下架吗？`, '提示');
			const { code, msg } = await batchUpdateStatus({ saleCodes: selectedArr.value, status: 1 });
			if (code === 0) {
				useMessage().success('批量下架成功');
				getDataList();
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else if (type === 'delete') {
		try {
			await useMessageBox().confirm(`确定要将选中的商品批量删除吗？`, '提示');
			const { code, msg } = await batchDelete({ saleCodes: selectedArr.value });
			if (code === 0) {
				useMessage().success('批量删除成功');
				getDataList();
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
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
