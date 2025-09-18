<template>
	<div>
		<el-dialog title="发布商品" ref="myDialog" v-model="visible" width="60%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-card>
					<el-form-item label="选择商家" prop="merchantCode">
						<el-select v-model="model.merchantCode" filterable placeholder="请选择商家" clearable @change="merchantCodeChange">
							<el-option v-for="item in allMerchantList" :key="item.merchantCode" :label="item.merchantName" :value="item.merchantCode">
								<span>{{ item.merchantName }}</span>
								<span style="color: #8492a6; font-size: 14px">（ID:{{ item.merchantCode }}）</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择商品" prop="productCode" v-if="model.merchantCode">
						<el-select v-model="model.productCode" filterable placeholder="请选择商品" clearable @change="productCodeChange">
							<el-option v-for="item in currentMerchantProducts" :key="item.spuCode" :label="item.spuName" :value="item.spuCode">
								<span>{{ item.spuName }}</span>
								<span style="color: #8492a6; font-size: 14px">（ID:{{ item.spuCode }}）</span>
							</el-option>
						</el-select>
					</el-form-item>
					<!-- 库存列表 -->
					<el-form-item>
						<el-table
							border
							v-if="model.productCode"
							:data="inventoryList"
							:cell-style="tableStyle?.cellStyle"
							:header-cell-style="tableStyle?.headerCellStyle"
						>
							<el-table-column label="商品ID" prop="productCode" show-overflow-tooltip width="140" />
							<el-table-column label="商品名称" prop="productName" width="120" />
							<el-table-column label="规格" prop="skuName" width="120" />
							<el-table-column label="初始库存" prop="inventory">
								<template #default="{ row }">
									<el-input v-model.number="row.inventory" placeholder="请输入初始库存数量"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="120">
								<template #default="{ row }">
									<el-button type="primary" link @click="handleDeleteRow(row.skuCode)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
					<el-form-item label="发布门店" prop="type">
						<el-radio-group v-model="model.type">
							<el-radio :label="1">全部门店</el-radio>
							<el-radio :label="2">指定门店</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="model.type === 2">
						<div class="scope-list">
							<div class="add-btn" @click="openMerchantDialog">
								<el-icon>
									<Plus />
								</el-icon>
								<div>选择门店</div>
							</div>
							<div class="list" v-for="(item, index) in storeList" :key="item.storeCode">
								<span>{{ item.storeName }}</span>
								<el-icon @click="handleDelete(index)">
									<Close />
								</el-icon>
							</div>
						</div>
					</el-form-item>
				</el-card>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)" :loading="loading">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)" :loading="loading">发布</el-button>
			</template>

			<!-- 发布门店弹窗 -->
			<el-dialog title="发布门店" v-model="storeListVisible" :close-on-click-modal="false" width="40%">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item label="门店名称" prop="storeName" style="width: 260px">
						<el-input placeholder="请输入门店名称" v-model="state.queryForm.storeName" clearable maxlength="50" />
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
					<el-table-column label="门店名称" prop="storeName" />
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />

				<template #footer>
					<div class="dialog-footer">
						<el-button @click="storeListVisible = false">取消</el-button>
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
import { getStoreList } from '/@/api/goodStore/staff';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getMerchantList } from '/@/api/goodStore/devices';
import { getProductByMerchantCode, getCurrentProductInfoList, publishProducts } from '/@/api/goodStore/salesManage';
const emit = defineEmits(['refresh']);
const visible = ref(false);
const storeListVisible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const loading = ref(false);
const inventoryList = ref([]);

// 商家interface
interface Merchant {
	merchantName: string;
	merchantCode: string;
}
// 商品interface
interface Products {
	spuName: string;
	spuCode: string;
}
// 全量商家列表
const allMerchantList = ref<Merchant[]>([]);
// 获取当前商家对应的商品列表
const currentMerchantProducts = ref<Products[]>([]);

// 从门店弹窗里面选择出来的去重后的数据列表
const storeList = ref([]) as any;
const queryRef = ref();

const scopeId = ref<string | null>('');
const model = ref({
	merchantCode: '',
	productCode: '',
	type: 1,
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getStoreList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

//   表单校验规则
const formRules = reactive<FormRules>({
	merchantCode: [{ required: true, message: '请选择商家' }],
	productCode: [{ required: true, message: '请选择商品' }],
	type: [{ required: true, message: '请选择发布门店' }],
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

// 获取当前商家对应的商品列表
const merchantCodeChange = (val: string) => {
	model.value.productCode = '';
	if (val) {
		getProductByMerchantCode(val)
			.then((res) => {
				if (res.code === 0) {
					currentMerchantProducts.value = res.data;
				}
			})
			.catch((err) => {});
	}
};

const productCodeChange = (val: string) => {
	if (val) {
		getCurrentProductInfoList(val)
			.then((res) => {
				if (res.code === 0) {
					inventoryList.value = res.data;
				}
			})
			.catch((err) => {});
	}
};

const handleDeleteRow = (skuCode: string) => {
	if (inventoryList.value && inventoryList.value.length > 1) {
		inventoryList.value = inventoryList.value.filter((item: any) => item.skuCode !== skuCode);
	} else {
		useMessage().warning('至少需要保留一条商品数据，无法删除！');
	}
};

const openDialog = async (merchantCode: string, spuCode: string) => {
	await merchantList();
	if (merchantCode && spuCode) {
		model.value.merchantCode = merchantCode;
		model.value.productCode = spuCode;
		getProductByMerchantCode(merchantCode)
			.then((res) => {
				if (res.code === 0) {
					currentMerchantProducts.value = res.data;
				}
			})
			.catch((err) => {});
		getCurrentProductInfoList(spuCode)
			.then((res) => {
				if (res.code === 0) {
					inventoryList.value = res.data;
				}
			})
			.catch((err) => {});
	}
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			let params = {
				merchantCode: model.value.merchantCode,
				productCode: model.value.productCode,
				saleManageDetails:
					inventoryList.value.length > 0
						? inventoryList.value.map((item: any) => {
								return {
									skuCode: item.skuCode,
									inventory: item.inventory,
								};
						  })
						: null,
				type: model.value.type,
				storeCodes: model.value.type === 1 ? null : selectionList.map((item: any) => item.storeCode),
			};
			console.log('params', params);
			loading.value = true;
			try {
				const { code, msg } = await publishProducts(params);
				loading.value = false;
				if (code === 0) {
					useMessage().success('发布商品成功');
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
			loading.value = false;
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
	closeMyDialog();
};

// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		resetForm(formEl);
	} catch {}
};
let selectionList: any = [];

const openMerchantDialog = async () => {
	state.queryForm.merchantCode = model.value.merchantCode;
	storeListVisible.value = true;
	selectionList = [];
	storeList.value = [];
	await getDataList();
};
// 删除选中的门店项
const handleDelete = (index: number) => {
	storeList.value.splice(index, 1);
};

// 多选事件
const handleSelectionChange = (selection: any) => {
	if (selection.length > 0) {
		selectionList = selectionList.concat(selection);
	}
};

// 对重复勾选过的门店通过storeCode参数去重
const handleSaveSelection = () => {
	storeList.value = deduplicateByProperty(selectionList, 'storeCode');
	storeListVisible.value = false;
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
