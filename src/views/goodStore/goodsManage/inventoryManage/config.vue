<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="60%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-card>
					<el-form-item label="选择商家" prop="merchantCode">
						<el-select v-model="model.merchantCode" placeholder="请选择商家" clearable filterable @change="merchantCodeChange">
							<el-option v-for="(item, index) in allMerchantList" :key="index" :label="item.merchantName" :value="item.merchantCode"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择门店" v-if="model.merchantCode" prop="storeCode">
						<el-select v-model="model.storeCode" placeholder="请选择门店" clearable filterable>
							<el-option v-for="(item, index) in currentStoreList" :key="index" :label="item.storeName" :value="item.storeCode"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注">
						<el-input type="textarea" placeholder="请输入备注" v-model="model.remark" maxlength="200"></el-input>
					</el-form-item>
					<el-form-item v-if="model.storeCode">
						<el-button icon="plus" type="primary" @click="openAddProductsDialog">添加商品</el-button>
					</el-form-item>
					<!-- 库存列表 -->
					<el-form-item v-if="model.storeCode">
						<el-table border :data="inventoryList" :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
							<el-table-column label="商品ID" prop="productCode" show-overflow-tooltip width="140" />
							<el-table-column label="商品名称" prop="productName" width="140" />
							<el-table-column label="规格" prop="skuName" width="140" />
							<el-table-column label="库存" prop="inventory" width="80" />
							<el-table-column label="修改数量" prop="editNum" width="180">
								<template #default="{ row }">
									<el-input-number v-model="row.editNum" :min="0" :max="pageType === 'out' ? row.inventory : Infinity" />
								</template>
							</el-table-column>
							<el-table-column label="操作">
								<template #default="{ row }">
									<el-button type="primary" link @click="handleDeleteRow(row.skuCode)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
				</el-card>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)" :loading="loading">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)" :loading="loading">保存</el-button>
			</template>

			<el-dialog title="添加商品" v-model="productListVisible" :close-on-click-modal="false" width="50%">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item label="商品ID" prop="productCode" style="width: 230px">
						<el-input placeholder="请输入商品ID" v-model="state.queryForm.productCode" clearable />
					</el-form-item>
					<el-form-item label="商品名称" prop="productName" style="width: 230px">
						<el-input placeholder="请输入商品名称" v-model="state.queryForm.productName" clearable />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
				<el-table
					border
					:data="state.dataList"
					v-loading="state.loading"
					row-key="storeCode"
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="40" align="center" />
					<el-table-column label="主图" prop="imageUrl">
						<template #default="{ row }">
							<img :src="row.imageUrl" class="img-center" />
						</template>
					</el-table-column>
					<el-table-column label="商品名称" prop="productName" />
					<el-table-column label="商品规格" prop="skuName" />
					<el-table-column label="库存数量" prop="inventory" />
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
				<template #footer>
					<div class="dialog-footer">
						<el-button @click="productListVisible = false">取消</el-button>
						<el-button type="primary" @click="handleSaveSelection">保存 </el-button>
					</div>
				</template>
			</el-dialog>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getMerchantList, getStoreListByMerchantCode } from '/@/api/goodStore/devices';
import { getCurrentMerchantProducts, saveInOrOutInventoryRecords } from '/@/api/goodStore/inventoryManage';
const emit = defineEmits(['refresh']);
const visible = ref(false);
const productListVisible = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('出库');
const formRef = ref();
const loading = ref(false);

interface Merchant {
	merchantName: string;
	merchantCode: string;
}
interface Store {
	storeName: string;
	storeCode: string;
}
const allMerchantList = ref<Merchant[]>([]);
const currentStoreList = ref<Store[]>([]);
// 从门店弹窗里面选择出来的去重后的数据列表
const productsList = ref([]) as any;
const queryRef = ref();
const pageType = ref('');
const inventoryList = ref([]);

const model = ref({
	merchantCode: '',
	storeCode: '',
	remark: '',
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getCurrentMerchantProducts,
	queryForm: {},
	dataList: [],
	createdIsNeed: false,
});

// 获取全量商家列表
const merchantList = async () => {
	try {
		let res = await getMerchantList();
		if (res.code === 0) {
			allMerchantList.value = res.data;
		}
	} catch (err) {
		console.log('err', err);
	}
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

//   表单校验规则
const formRules = reactive<FormRules>({
	merchantCode: [{ required: true, message: '请选择商家' }],
	storeCode: [{ required: true, message: '请选择门店' }],
});

// 处理商家选择时才能查询对应门店的逻辑
const merchantCodeChange = (val: string) => {
	if (val) {
		getStoreListByMerchantCode({
			current: 1,
			size: 99,
			merchantCode: val,
		}).then((res) => {
			if (res.code === 0) {
				currentStoreList.value = res.data.records;
			}
		});
	}
};

const openDialog = async (type: string) => {
	await merchantList();
	if (type === 'in') {
		dialogTitle.value = '入库';
	} else if (type === 'out') {
		dialogTitle.value = '出库';
	}
	pageType.value = type;
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			loading.value = true;
			let params = {
				merchantCode: model.value.merchantCode,
				storeCode: model.value.storeCode,
				remark: model.value.remark,
				type: pageType.value === 'in' ? 2 : 1,
				logDetails: inventoryList.value.map((item: any) => {
					return {
						productCode: item.productCode,
						productName: item.productName,
						skuCode: item.skuCode,
						operateNum: item.editNum,
					};
				}),
			};
			try {
				const { code, msg } = await saveInOrOutInventoryRecords(params);
				loading.value = false;
				if (code === 0) {
					useMessage().success(`${pageType.value === 'in' ? '入库成功' : '出库成功'}`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				loading.value = false;
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	Object.keys(model.value).forEach((key) => ((model as any).value[key] = ''));
	inventoryList.value = [];
	visible.value = false;
	// closeMyDialog();
};

// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		resetForm(formEl);
	} catch {}
};
let selectionList: any = [];

const openAddProductsDialog = async () => {
	state.queryForm.storeCode = model.value.storeCode;
	productListVisible.value = true;
	selectionList = [];
	productsList.value = [];
	await getDataList();
};
const handleDeleteRow = (skuCode: string) => {
	if (inventoryList.value && inventoryList.value.length > 1) {
		inventoryList.value = inventoryList.value.filter((item: any) => item.skuCode !== skuCode);
	} else {
		useMessage().warning('至少需要保留一条商品数据，无法删除！');
	}
};

// 多选事件
const handleSelectionChange = (selection: any) => {
	if (selection.length > 0) {
		selectionList = selectionList.concat(selection);
	}
};

// 对重复勾选过的商品通过skuCode参数去重
const handleSaveSelection = () => {
	productsList.value = deduplicateByProperty(selectionList, 'skuCode');
	productListVisible.value = false;
	inventoryList.value = productsList.value.map((item: any) => {
		item.editNum = 0;
		return item;
	});
};

// 去重函数
function deduplicateByProperty(array: any, property: string) {
	const seen = new Map();
	return array.filter((item: any) => {
		if (!seen.has(item[property])) {
			seen.set(item[property], true);
			return true;
		}
		return false;
	});
}

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
