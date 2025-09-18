<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="title" draggable v-model="visible">
			<el-form :model="dataForm" :rules="dataRules" label-width="120px" ref="dataFormRef" v-loading="loading">
				<el-form-item label="采购单名称" prop="purchaseName">
					<el-input placeholder="请输入采购单名称" maxlength="20" v-model="dataForm.purchaseName" clearable></el-input>
				</el-form-item>
				<el-form-item label="采购门店" prop="storeCode">
					<el-select
						v-model="dataForm.storeCode"
						:remote-method="remoteMethod"
						filterable
						remote
						reserve-keyword
						:loading="storeLoading"
						placeholder="请选择"
						style="width: 100%"
						@change="changeRemoteMethod"
					>
						<el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="供应商" prop="supplierCode">
					<el-select v-model="dataForm.supplierCode" placeholder="请选择" style="width: 100%">
						<el-option v-for="item in supplierList" :key="item.supplierCode" :label="item.supplierName" :value="item.supplierCode" />
					</el-select>
				</el-form-item>
				<el-form-item label="关联商品">
					<div><el-button type="primary" size="small" @click="openRelateDialog()">关联采购商品</el-button></div>
					<div class="table-box">
						<el-table border :data="tableDataProduct" show-summary :summary-method="getSummaries" stripe style="width: 100%">
							<el-table-column label="商品名称" prop="productName" />
							<el-table-column label="数量" prop="productCount">
								<template #default="scope">
									<el-input-number v-model="scope.row.productCount" size="small" :min="0" :precision="0" :controls="false" />
								</template>
							</el-table-column>
							<el-table-column label="单价" prop="productPrice">
								<template #default="scope">
									<span>￥</span>
									<el-input-number v-model="scope.row.productPrice" style="width: 70%" size="small" :min="0" :precision="2" :controls="false" />
								</template>
							</el-table-column>
							<el-table-column label="小计" prop="productTotal">
								<template #default="scope">
									<div>￥{{ calculatePrice(scope.row.productCount, scope.row.productPrice) }}</div>
								</template>
							</el-table-column>
							<el-table-column label="操作">
								<template #default="{ row }">
									<el-icon color="#e04343" @click="deleteRow(row)">
										<Delete />
									</el-icon>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialog()">取消</el-button>
					<el-button @click="onSubmit" type="primary" :disabled="loading">确认</el-button>
				</span>
			</template>
		</el-dialog>

		<ChooseProductDialog ref="chooseProductRef" @handleOk="confirmChooseProduct" />
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
import { useMessage } from '/@/hooks/message';
import { loadStoreListApi, loadSupplierListApi, addPurchaseApi, updatePurchaseApi, getPurchaseDetailApi } from '/@/api/goodStore/mall';
import { TableColumnCtx } from 'element-plus';
import { VNode } from 'vue';
import ChooseProductDialog from './chooseProductDialog.vue';

interface Product {
	productName: string;
	productCode: string;
	productSkuCode: string; // 商品sku code
	productCount: number; // 商品数量
	productPrice: number; // 单价
	productTotal: string; // 小计(这个由前端计算所得)
}

interface SummaryMethodProps<T = Product> {
	columns: TableColumnCtx<T>[];
	data: T[];
}

let relatedId: string = '';
let approvalStatus: number = 0;
let purchaseCode: string = '';
let resubmit: boolean = false; // 是否重新提交-重新提交在保存时走单独逻辑

// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const chooseProductRef = ref();
const visible = ref(false);
const loading = ref(false);
const storeLoading = ref(false);
const tableDataProduct = ref<Array<Product>>([]);
const title = ref('');

const dataForm = ref({
	purchaseName: '',
	storeCode: '',
	supplierCode: '',
});
const storeList = ref([]);
const supplierList = ref([]);

const dataRules = ref({
	purchaseName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	storeCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	supplierCode: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (opt: any) => {
	console.log('打开编辑弹框', opt);
	visible.value = true;
	relatedId = '';
	title.value = '';
	if (opt) {
		relatedId = opt.id;
		title.value = '编辑采购单';
		approvalStatus = opt.approvalStatus;
		purchaseCode = opt.purchaseCode;
		resubmit = opt.resubmit;
		getInfo();
	} else {
		title.value = '新增采购单';
	}
};
const closeDialog = () => {
	Object.assign(dataForm.value, {
		purchaseName: '',
		storeCode: '',
		supplierCode: '',
	});
	tableDataProduct.value = [];
	visible.value = false;
};

// 获取详情
const getInfo = async () => {
	let params = {
		id: relatedId,
	};
	let res = await getPurchaseDetailApi(params);
	if (res.code == 0) {
		const { data } = res;
		dataForm.value = data;
		tableDataProduct.value = data.productList;
	} else {
		useMessage().error(res.msg || '获取失败');
	}
};

// 获取门店下拉列表
const getStoreList = async (name?: string) => {
	let params = {
		storeName: name,
	};
	storeLoading.value = true;
	let res = await loadStoreListApi(params);
	storeLoading.value = false;
	if (res.code === 0) {
		setTimeout(() => {
			storeList.value = res.data;
		}, 300);
	}
};
// 获取供应商下拉列表
const getSupplierList = async () => {
	let res = await loadSupplierListApi();
	if (res.code === 0) {
		supplierList.value = res.data;
	}
};

const remoteMethod = (query: string) => {
	if (query) {
		getStoreList(query);
	} else {
		storeList.value = [];
	}
};

// 关联商品选择完毕确认
const confirmChooseProduct = (data: any) => {
	console.log('当前选择完毕', data);
	if (data?.selectedRows.length < 1) {
		return;
	}

	data.selectedRows.forEach((item: any) => {
		// 判断当前列表没有数据，则添加到列表
		if (!tableDataProduct.value.find((v: any) => v.productSkuCode == item.skuCode)) {
			tableDataProduct.value.push({
				productName: item.spuName,
				productCode: item.spuCode,
				productSkuCode: item.skuCode,
				productCount: 0,
				productPrice: 0,
				productTotal: '0',
			});
		}
	});
};
// 删除列表行
const deleteRow = (record: Product) => {
	tableDataProduct.value = tableDataProduct.value.filter((item) => item.productSkuCode !== record.productSkuCode);
};

// 提交
const onSubmit = async () => {
	// console.log('表单提交数据', dataForm.value, tableDataProduct.value);
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		let isEdit = relatedId ? true : false;
		if (resubmit) {
			isEdit = false;
		}

		let params = {
			id: isEdit ? relatedId : undefined,
			approvalStatus: isEdit ? approvalStatus : undefined,
			purchaseCode: isEdit ? purchaseCode : undefined,
			purchaseName: dataForm.value.purchaseName,
			supplierCode: dataForm.value.supplierCode,
			storeCode: dataForm.value.storeCode,
			productList: tableDataProduct.value.map((v) => {
				v.productTotal = calculatePrice(v.productCount, v.productPrice);
				return v;
			}),
		};

		const requestMethod = isEdit ? updatePurchaseApi : addPurchaseApi;
		const { code, msg } = await requestMethod(params);
		if (code == 0) {
			useMessage().success(isEdit ? '编辑成功' : '创建成功');
			closeDialog();
			emit('refresh');
		} else {
			useMessage().error(msg || '操作失败');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};
// 计算表格小计
const calculatePrice = (num1: number, num2: number) => {
	const n1 = num1 || 0;
	const n2 = num2 || 0;
	return (n1 * n2).toFixed(2);
};

// 计算表格合计
const getSummaries = (param: SummaryMethodProps) => {
	const { columns, data } = param;
	const sums: (string | VNode)[] = [];
	columns.forEach((column, index) => {
		if (index === 0) {
			sums[index] = h('div', { style: { fontWeight: 'bold' } }, ['总计']);
			return;
		}

		const values = data.map((item) => {
			if (['productCount'].includes(column.property)) {
				return item[column.property];
			} else if (column.property == 'productTotal') {
				return calculatePrice(item.productCount, item.productPrice);
			} else {
				return NaN;
			}
		});
		if (!values.every((value) => isNaN(value))) {
			if (column.property == 'productTotal') {
				sums[index] = '￥' + values.reduce((prev, cur) => Number(prev) + Number(cur), 0).toFixed(2);
			} else sums[index] = values.reduce((prev, cur) => Number(prev) + Number(cur), 0);
		} else {
			sums[index] = '';
		}
	});

	return sums;
};

// 打开关联商品弹框
const openRelateDialog = () => {
	if (!dataForm.value.storeCode) {
		useMessage().error('请选择采购门店');
		return;
	}
	// console.log('已选表格数据', tableDataProduct.value);
	const obj = {
		storeCode: dataForm.value.storeCode,
		defaultSeleted: tableDataProduct.value.map((v) => v.productSkuCode),
	};
	chooseProductRef.value.openDialog(obj);
};
const changeRemoteMethod = (val: string) => {
	console.log('val', val);
	tableDataProduct.value = [];
};

onMounted(() => {
	getStoreList();
	getSupplierList();
});

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
.table-box {
	width: 100%;
}
</style>
