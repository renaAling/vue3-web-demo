<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" v-loading="loading" ref="formRef" label-width="100px" :rules="formRules">
				<el-card>
					<el-form-item label="选择商家" prop="merchantCode">
						<el-select v-model="model.merchantCode" clearable :disabled="scopeId" filterable>
							<el-option v-for="(item, key) in merchantList" :key="key" :label="item.merchantName" :value="item.merchantCode"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品图" prop="imageUrl">
						<upload-img v-model:image-url="model.imageUrl" />
					</el-form-item>
					<el-form-item label="商品名称" prop="spuName">
						<el-input v-model="model.spuName" type="text" placeholder="请输入商品名称" maxlength="50" show-word-limit clearable />
					</el-form-item>
					<el-form-item label="商品描述" prop="sellingPoint">
						<el-input v-model="model.sellingPoint" type="text" placeholder="请输入商品描述" maxlength="50" show-word-limit clearable />
					</el-form-item>
					<el-form-item label="商品条码" prop="barCode">
						<el-input v-model="model.barCode" type="text" placeholder="请输入商品条码" maxlength="50" show-word-limit clearable />
					</el-form-item>
					<el-form-item label="商品分组" prop="groupCodes">
						<el-select v-model="model.groupCodes" clearable filterable multiple style="width: 240px" @change="changehasGroup">
							<el-option
								v-for="(item, key) in commodityList"
								:key="key"
								:label="item.groupName"
								:value="item.groupCode"
								:disabled="item.groupCode == '0' ? true : false"
							>
							</el-option>
						</el-select>
						<el-button class="ml-[10px]" type="primary" icon="plus" size="default" @click="openAddCommodity">新增分组</el-button>
					</el-form-item>
					<el-form-item label="供应时间" prop="supplyWeek ">
						<el-checkbox-group v-model="model.supplyWeek">
							<el-checkbox :label="e.value" v-for="(e, index) in weekDays" :key="index">{{ e.label }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="标签" prop="tagCode">
						<el-select v-model="model.tagCode" clearable filterable multiple style="width: 80%" @change="changeList">
							<el-option v-for="(item, key) in labelList" :key="key" :label="item.tagName" :value="item.tagCode"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品规格" prop="dataList">
						<el-button type="primary" icon="plus" size="default" @click="addSpecie">{{
							state.dataList?.length ? '修改规格项' : '添加规格项'
						}}</el-button>
					</el-form-item>
					<el-form-item label="加料">
						<el-switch v-model="model.hasMaterial" />
					</el-form-item>
					<el-form-item v-if="model.hasMaterial">
						<el-tag
							v-for="(e, indexn) in model.materials"
							:key="indexn"
							size="large"
							:disable-transitions="false"
							class="mb-1 mr-2 cursor-pointer"
							closable
							@close="handleIngredientClose(e, indexn)"
						>
							{{ e.materialName + '，' + e.materialPrice + '元/份' }}
						</el-tag>
						<el-button class="ml-[10px]" type="primary" icon="plus" size="default" @click="openAddIngredient">添加小料</el-button>
					</el-form-item>
					<el-form-item label="商品售价" prop="price" v-if="!priceRange">
						<div class="flex" style="width: 100%">
							<el-input-number
								v-model="model.price"
								@change="handlePrice"
								:step="0.01"
								:min="0"
								:max="999999.99"
								:precision="2"
								controls-position="right"
							/>
							<span class="ml-[10px]">元</span>
						</div>
						<!-- 多规格，区间价格 -->
					</el-form-item>
					<el-form-item label="商品售价" v-else>
						<div class="text-center w-full">{{ priceRange }}</div>
					</el-form-item>
					<el-form-item label="划线价" prop="otPrice">
						<div class="flex" style="width: 100%" v-if="!otPriceRange">
							<el-input-number
								v-model="model.otPrice"
								@change="handleOtPrice"
								:step="0.01"
								:min="0"
								:max="999999.99"
								:precision="2"
								controls-position="right"
							/>
							<span class="ml-[10px]">元</span>
						</div>
						<!-- 多规格，区间价格 -->
						<div v-else class="text-center w-full">{{ otPriceRange }}</div>
					</el-form-item>
					<el-form-item label="商品详情" prop="details">
						<div class="upload-item">
							<upload-img v-for="(item, index) in model.details" :key="index" v-model:imageUrl="model.details[index]" dir="culture"> </upload-img>
							<el-button v-if="!disabledBannerUpload" @click="handleCreateUploadComponent" type="primary"> 添加上传图片 </el-button>
						</div>
					</el-form-item>
				</el-card>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit">提交</el-button>
			</template>
		</el-dialog>
		<el-dialog :close-on-click-modal="false" title="规格设置" width="800" draggable v-model="visibleSpecie">
			<el-form @submit.prevent class="rules_form_box" :model="formRuleValue" v-loading="loading" ref="formRef">
				<el-form-item label="商品规格">
					<div v-for="(item, index) in formDynamic.ruleValue" :key="index" class="mb-2">
						<el-form-item>
							<div class="flex items-center">
								<div class="mr-1 line-heightOne">{{ item.value }}</div>
								<el-icon :size="16" class="cursor-pointer" @click="handleRemove(index)">
									<CircleClose />
								</el-icon>
							</div>
							<div class="mt-2 flex">
								<el-tag
									v-for="(j, indexn) in item.detail"
									:key="indexn"
									closable
									size="large"
									:disable-transitions="false"
									class="mb-1 mr-2 cursor-pointer"
									@click="handleClick(j, index, indexn)"
									@close="handleClose(item.detail, indexn)"
								>
									{{ j }}
								</el-tag>
								<el-input
									v-if="item.inputVisible"
									ref="saveTagInput"
									style="width: 100px"
									v-model.trim="item.detail.attrsVal"
									@blur="createAttr(item.detail.attrsVal, index)"
								/>
								<el-button v-else size="Large" @click="showInput(item, index)">+ 添加</el-button>
							</div>
						</el-form-item>
					</div>
					<div v-if="isBtn" class="flex">
						<el-form-item label="规格：">
							<el-input v-model.trim="formRuleValue.attrsName" placeholder="请输入规格" />
						</el-form-item>
						<el-form-item label="规格值：" class="ml-4">
							<el-input v-model.trim="formRuleValue.attrsVal" placeholder="请输入规格值" />
						</el-form-item>
						<el-button type="primary" class="ml-6" @click="createAttrName">确定</el-button>
						<el-button @click="offAttrName">取消</el-button>
					</div>
					<div v-if="!isBtn">
						<el-button type="primary" @click="addBtn">添加新规格</el-button>
					</div>
				</el-form-item>
			</el-form>
			<el-table
				border
				class="mt-4"
				:data="state.dataList"
				:row-key="getRowKey"
				v-if="state.dataList?.length"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="80" />
				<el-table-column label="规格" prop="specie" />
				<el-table-column label="售价" prop="price">
					<template #default="{ row }">
						<el-input-number
							v-model="row.cost"
							@change="updateCost(row)"
							:step="0.01"
							:min="0"
							:max="999999.99"
							:precision="2"
							controls-position="right"
						/>
					</template>
				</el-table-column>
				<el-table-column label="划线价" prop="price">
					<template #default="{ row }">
						<el-input-number
							v-model="row.otPrice"
							@change="updateotPrice(row)"
							:step="0.01"
							:min="0"
							:max="999999.99"
							:precision="2"
							controls-position="right"
						/>
					</template>
				</el-table-column>
			</el-table>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelRules">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button @click="onSubmitRules" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog title="修改规格值" ref="dynamicDig" v-model="dynamicVisible" draggable :close-on-click-modal="false" :show-close="false">
			<el-form
				@submit.prevent
				:model="dynamicForm"
				label-position="top"
				v-loading="dynamicLoading"
				ref="dynamicFormRef"
				label-width="100px"
				:rules="dynamicRules"
			>
				<el-form-item label="请输入规格值" prop="spuName">
					<el-input v-model="dynamicForm.spuName" type="text" placeholder="请输入规格值" maxlength="50" show-word-limit clearable />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="dynamicVisible = false">取消</el-button>
				<el-button type="primary" size="default" @click="onDynamicSubmit">提交</el-button>
			</template>
		</el-dialog>
		<el-dialog :close-on-click-modal="false" title="添加小料" width="800" draggable v-model="visibleIngredient">
			<el-form @submit.prevent class="rules_form_box" :model="formIngredientValue" v-loading="loading" ref="formRef">
				<el-form-item>
					<!-- <div class="flex flex-wrap">
						<el-tag
							v-for="(e, indexn) in ingredientData.tagList"
							:key="indexn"
							closable
							size="large"
							:disable-transitions="false"
							class="mb-1 mr-2 cursor-pointer"
							@close="handleIngredientClose(ingredientData.tagList, indexn)"
						>
							{{ e.materialName + '，' + e.materialPrice + '元/份' }}
						</el-tag>
					</div> -->
					<div class="flex">
						<el-form-item label="名称：">
							<el-input v-model.trim="formIngredientValue.materialName" placeholder="请输入名称" maxlength="8" />
						</el-form-item>
						<el-form-item label="价格：" class="ml-4 flex">
							<el-input
								v-model.trim="formIngredientValue.materialPrice"
								placeholder="请输入价格"
								@input.native="handleIntegerInput"
								@blur.native="blurIntegerInput(formIngredientValue.materialPrice)"
								step="0.01"
							>
								<template #append>元/份</template>
							</el-input>
						</el-form-item>
						<!-- <el-button type="primary" class="ml-6" @click="createIngredientName">确定</el-button> -->
						<!-- <el-button @click="offIngredientName">取消</el-button> -->
					</div>
					<!-- <div v-if="!isBtn">
						<el-button type="primary" @click="addisIngredientValueBtn()">添加小料</el-button>
					</div> -->
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelIngredient">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button @click="onSubmitIngredient" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog :close-on-click-modal="false" title="新增分组" width="800" draggable v-model="visibleCommodity">
			<el-form @submit.prevent class="rules_form_box" :model="formGroupingValue" v-loading="loading" ref="formGroupingRef" :rules="formGroupingRules">
				<el-form-item label="选择商家" prop="merchantCode" label-width="80">
					<el-select v-model="formGroupingValue.merchantCode" clearable :disabled="scopeId" filterable>
						<el-option v-for="(item, key) in merchantList" :key="key" :label="item.merchantName" :value="item.merchantCode"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分组图标" prop="imageUrl" label-width="80">
					<upload-img v-model:image-url="formGroupingValue.imageUrl" />
				</el-form-item>
				<el-form-item label="分组名称" prop="groupName" label-width="80">
					<el-input v-model="formGroupingValue.groupName" type="text" placeholder="请输入分组名称" maxlength="50" show-word-limit clearable />
				</el-form-item>
				<el-form-item label="分组描述" prop="remark" label-width="80">
					<el-input
						v-model="formGroupingValue.remark"
						type="textarea"
						:rows="2"
						placeholder="请输入分组描述"
						maxlength="200"
						show-word-limit
						clearable
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelCommodity">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button @click="onSubmitCommodity" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useTable, BasicTableProps } from '/@/hooks/table';
import {
	wdProductAdd,
	merchantgetList,
	commoditygetList,
	wdProductGet,
	wdProductUpdate,
	wdGroupAdd,
	tagManageSelect,
} from '/@/api/goodStore/platformGoods';

// 假设值
// const emptyText = ref('请先选择商家');
// const ingredientData = reactive({ tagList: [], hasAddMaterial: false, hasDelMaterial: false, materialCodes: [] });
const isEdit = ref(false);

const emit = defineEmits(['refresh']);
const visible = ref(false);
const visibleSpecie = ref(false);
const visibleIngredient = ref(false);
const visibleCommodity = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('新增商品');
const isBtn = ref(false);
// 售价区间值
const priceRange = ref('');
const otPriceRange = ref('');
const formRuleValue = reactive({
	attrsVal: '',
	attrsName: '',
});
const weekDays = ref([
	{ label: '周一', value: '1' },
	{ label: '周二', value: '2' },
	{ label: '周三', value: '3' },
	{ label: '周四', value: '4' },
	{ label: '周五', value: '5' },
	{ label: '周六', value: '6' },
	{ label: '周日', value: '7' },
]);
const formIngredientValue = reactive({
	materialName: '',
	materialPrice: '',
});
const formGroupingValue = reactive({
	merchantCode: '',
	imageUrl: '',
	groupName: '',
	remark: '',
});
//  修改规格值
const dynamicVisible = ref(false);
const dynamicForm = reactive({
	spuName: '',
});
const dynamicLoading = ref(false);
const dynamicRules = reactive<FormRules>({
	spuName: [{ required: true, message: '规格值不能为空', trigger: 'blur' }],
});
const dynamicFormRef = ref();
const skuNameIndex = ref(0);
const skuNameIndexn = ref(0);
let modifiedData = reactive({}) as any; // 存储修改后的价格
const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});
const { tableStyle } = useTable(state);
const formDynamic = reactive({
	ruleValue: [] as any,
});
const formRef = ref();
const formGroupingRef = ref();
const scopeId = ref<string | null>('');
const loading = ref(false);
const merchantList = ref([] as any);
const commodityList = ref([] as any);
const labelList = ref([] as any);
const model = ref<any>({
	merchantCode: '',
	spuName: '',
	sellingPoint: '',
	imageUrl: '',
	barCode: '',
	details: [],
	spuCode: '',
	price: null,
	otPrice: null,
	hasMaterial: false,
	materials: [],
	hasGroup: false,
	hasDelMaterial: false,
	delMaterialCodes: [],
	hasAddMaterial: false,
});
const addMaterialData = ref([]);
const groupCodesList = ref([]);
const hasGroup = ref(false);
//   表单校验规则
const formRules = reactive<FormRules>({
	spuName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
	dataList: [{ required: true, message: '商品规格不能为空', trigger: 'blur' }],
	imageUrl: [{ required: true, message: '商品图不能为空', trigger: 'blur' }],
	merchantCode: [{ required: true, message: '商家不能为空', trigger: 'blur' }],
	price: [{ required: true, message: '商品售价不能为空', trigger: 'blur' }],
});
const formGroupingRules = reactive<FormRules>({
	groupName: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }],
	merchantCode: [{ required: true, message: '商家不能为空', trigger: 'blur' }],
});

// 添加详情上传按钮
const handleCreateUploadComponent = () => {
	model.value.details.push('');
};
const disabledBannerUpload = ref(false);
watch(
	() => model.value.details,
	(val) => {
		if (val.length >= 6) {
			disabledBannerUpload.value = true;
		} else {
			disabledBannerUpload.value = false;
		}
	},
	{
		immediate: true,
		deep: true,
	}
);
watch(
	() => model.value.merchantCode,
	async (val) => {
		if (val) {
			formGroupingValue.merchantCode = val;
			getCommoditygetList(val);
		}
	},
	{
		immediate: true,
		deep: true,
	}
);
const getCommoditygetList = async (val: string) => {
	const res = await commoditygetList(val);
	if (res.code != 0) {
		return useMessage().error(res.msg);
	} else {
		commodityList.value = res.data;
	}
};
const getLabelList = async () => {
	const res = await tagManageSelect();
	if (res.code != 0) {
		return useMessage().error(res.msg);
	} else {
		labelList.value = res.data;
	}
};
const changeList = () => {
	// 只能选择5个
	if (model.value.tagCode.length > 5) {
		model.value.tagCode.pop();
	}
};
const openDialog = async (id: string | null) => {
	scopeId.value = id;
	commodityList.value = [{ groupCode: '0', groupName: '请先选择商家' }];
	// commodityList.value.push();
	if (id) {
		dialogTitle.value = '编辑商品';
		isEdit.value = true;
		try {
			const { code, data } = await wdProductGet({ productCode: id });
			if (code === 0) {
				const detail = Object.assign(data);
				model.value = detail;
				model.value.supplyWeek = detail.supplyWeek ? detail.supplyWeek.split(',') : [];
				// model.value.tagCode = detail.tagCode ? detail.tagCode.split(',') : [];
				// model.value.tagCode = detail.tagCode ? [detail.tagCode] : [];
				
				model.value.groupCodes = [];
				model.value.delMaterialCodes = [];
				const groupCodes = data.groupInfos.map((item: any) => {
					return item.groupCode;
				});
				model.value.groupCodes = JSON.parse(JSON.stringify(groupCodes));
				groupCodesList.value = JSON.parse(JSON.stringify(groupCodes));
				model.value.groupInfos = [];
				// ingredientData.tagList = detail.materials ? detail.materials : [];
				if (model.value.skus[0].skuName === '默认' && model.value.skus.length == 1) {
					model.value.price = data.skus[0].price;
					model.value.otPrice = data.skus[0].otPrice;
				}
				model.value.tagCode = detail.tagCode ? detail.tagCode.split(',') : [];
				// model.value.tagCode = detail.tagCode ? [detail.tagCode] : [];
				console.log('model.value.tagCode', model.value.tagCode)
				formDynamic.ruleValue = model.value.specs.map((item: any) => {
					return { value: item.name, detail: item.skuValues.split(',') };
				});
				nextTick(() => {
					// 是否没有子规格
					if (model.value.skus[0].skuName === '默认' && model.value.skus.length == 1) {
						formDynamic.ruleValue = [];
						state.dataList = [];
						return;
					} else {
						state.dataList = model.value.skus.map((item: any) => {
							return { otPrice: item.otPrice, cost: item.price, specie: item.skuName.split(','), skuCode: item.skuCode };
						});
					}
					if (state.dataList?.length == 1) {
						model.value.price = state.dataList[0].cost;
						model.value.otPrice = state.dataList[0].otPrice;
					}
					if ((state.dataList ?? []).length > 1) {
						priceRange.value =
							state.dataList?.reduce((a, b) => Math.min(a, b.cost), Infinity) +
							'-' +
							state.dataList?.reduce((a, b) => Math.max(a, b.cost), -Infinity);
						otPriceRange.value =
							state.dataList?.reduce((a, b) => Math.min(a, b.otPrice), Infinity) +
							'-' +
							state.dataList?.reduce((a, b) => Math.max(a, b.otPrice), -Infinity);
					}
					state.dataList?.forEach((item) => {
						getRowKey(item);
						updateotPrice(item);
						updateCost(item);
						updateCode(item);
					});
				});
				console.log('model.value', model.value);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		isEdit.value = false;
		dialogTitle.value = '新增商品';
	}
	getLabelList();
	visible.value = true;
	getLabelList();
	nextTick(() => {
		// formRef.value.resetFields();
	});
};
// const getLabelList = async () => {
// 	const res = await tagManageSelect();
// 	if (res.code != 0) {
// 		return useMessage().error(res.msg);
// 	} else {
// 		labelList.value = res.data;
// 	}
// };
// const changeList = () => {
// 	// 只能选择5个
// 	if (model.value.tagCode.length > 5) {
// 		model.value.tagCode.pop();
// 	}
// };
const changehasGroup = () => {
	console.log('aaaaa');
	hasGroup.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};

merchantgetList().then((res) => {
	merchantList.value = res.data;
});

const onSubmit = async () => {
	let params = {};
	if (state.dataList?.length == 0) {
		return useMessage().error('请添加商品规格');
	}
	// if (state.dataList?.length != 0) {
	//

	const specsList = formDynamic.ruleValue.map((item: any) => {
		return { name: item.value, skuValues: item.detail.join(',') };
	});
	model.value.dataList = specsList;
	const skusObj = state.dataList?.map((item) => {
		return {
			otPrice: item.otPrice,
			price: item.cost,
			skuName: item.specie.join(','),
			attrValue: JSON.stringify(item.attrValue),
			skuCode: item.skuCode,
		};
	});
	if (!isEdit.value) {
		console.log('!isEdit.value');
		hasGroup.value = model.value.groupCodes?.length > 0 ? true : false;
	}
	// if (isEdit.value) {
	// 	if (groupCodesList.value?.length != 0 && model.value.groupCodes?.length == 0) {
	// 		// 编辑清空的情况
	// 		hasGroup = true;
	// 	} else {
	// 		if (groupCodesList.value?.length != 0) {
	// 			const allData = [...new Set([...groupCodesList.value, ...model.value.groupCodes])];
	// 			console.log('allData', allData);
	// 			// 编辑但未改动
	// 			const result = allData.filter((value) => !model.value.groupCodes.includes(value));
	// 			console.log('result', result);
	// 			if (result.length == 0) {
	// 				hasGroup = false;
	// 			} else {
	// 				hasGroup = true;
	// 			}
	// 		}
	// 	}
	// }

	// if (isEdit.value && model.value.groupCodes?.length == 0 && groupCodesList.value?.length == 0) {
	// 	// console.log('bbbbbbbbb');
	// 	hasGroup = false
	// }else{

	// }
	params = {
		specs: specsList,
		skus: skusObj,
		// hasGroup: model.value.groupCodes?.length > 0 ? true : false,
		hasGroup: hasGroup.value,
		hasDelMaterial: model.value.hasDelMaterial,
		hasAddMaterial: model.value.hasAddMaterial,
		delMaterialCodes: model.value.delMaterialCodes,
	};
	// if(!isEdit.value){

	// }
	// } else {
	// 	// 没有子规格
	// 	console.log(model.value);
	// 	params = {
	// 		specs: [{ name: '默认', skuValues: '默认' }],
	// 		skus: [{ skuName: '默认', price: model.value.price, otPrice: model.value.otPrice }],
	// 		hasGroup: model.value.groupCodes?.length >= 0 ? true : false,
	// 		hasDelMaterial: model.value.hasDelMaterial,
	// 		hasAddMaterial: model.value.hasAddMaterial,
	// 		delMaterialCodes: model.value.delMaterialCodes,
	// 	};
	// }
	if (model.value.groupCodes?.length == 0) {
		model.value.groupCodes = null;
	}
	console.log(params, 'params');
	console.log('{ ...model.value, ...params }', { ...model.value, ...params });
	// 判断是否需要提示添加小料
	if (model.value.hasMaterial) {
		if (model.value.materials?.length == 0) {
			useMessage().error('已打开加料功能，请添加小料');
			return;
		}
	}
	// 后端需要编辑时，只返回新增的对象
	if (isEdit.value) {
		model.value.materials = addMaterialData.value;
	}

	const valid = await formRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		Object.assign(model.value, { supplyWeek: model.value.supplyWeek?.join(',') }, { tagCode: model.value.tagCode?.join(',') });
		const res = !model.value.spuCode ? await wdProductAdd({ ...model.value, ...params }) : await wdProductUpdate({ ...model.value, ...params });
		if (res.code != 0) {
			return useMessage().error(res.msg);
		}
		useMessage().success('操作成功');
		addMaterialData.value = [];
		// 重置
		state.dataList = [];
		formDynamic.ruleValue = [];
		model.value.groupCodes = [];
		visible.value = false;
		resetForm(formRef.value);
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		merchantCode: '',
		spuName: '',
		dataList: [],
		sellingPoint: '',
		imageUrl: '',
		barCode: '',
		details: [],
		spuCode: '',
		price: 0.01,
		otPrice: 0.01,
		hasAddMaterial: false,
		hasDelMaterial: false,
		delMaterialCodes: [],
		hasMaterial: false,
		materials: [],
		hasGroup: false,
	};
	priceRange.value = '';
	otPriceRange.value = '';
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) {
		state.dataList = [];
		formDynamic.ruleValue = [];
		resetForm(formEl);
		return;
	}
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		state.dataList = [];
		formDynamic.ruleValue = [];
		resetForm(formEl);
	} catch {
		return false;
	}
};
const getSpecieKey = (specie: any) => specie.join('|');

watch(
	() => formDynamic.ruleValue,
	(val) => {
		let dataList = getResult(formDynamic.ruleValue).map((item) => {
			return { attrValue: item, cost: 0.01, otPrice: 0.01, specie: item.map((obj) => Object.values(obj)[0]) };
		});
		if (!dataList.length) {
			modifiedData = {};
		}
		dataList = dataList.map((item) => {
			const key = getSpecieKey(item.specie);
			const modifiedItem = modifiedData[key] || {};
			return {
				...item,
				...modifiedItem,
			};
		});
		state.dataList = dataList;
	},
	{
		deep: true,
	}
);

const handleClick = (item: string, index: number, indexn: number) => {
	dynamicForm.spuName = item;
	skuNameIndexn.value = indexn;
	skuNameIndex.value = index;
	dynamicVisible.value = true;
};

const handleOtPrice = (val) => {
	if (state.dataList?.length == 1) {
		state.dataList[0].otPrice = val;
		updateotPrice(state.dataList[0]);
	}
};

const handlePrice = (val) => {
	if (state.dataList?.length == 1) {
		state.dataList[0].cost = val;
		updateCost(state.dataList[0]);
	}
};

// 更新 cost 的值
const updateCost = (row) => {
	const key = getSpecieKey(row.specie);
	if (!modifiedData[key]) {
		modifiedData[key] = {}; // 确保键存在
	}
	modifiedData[key].cost = row.cost;
};

// 更新 otPrice 的值
const updateotPrice = (row) => {
	const key = getSpecieKey(row.specie);
	if (!modifiedData[key]) {
		modifiedData[key] = {}; // 确保键存在
	}
	modifiedData[key].otPrice = row.otPrice;
};

// 更新 skuCode 的值
const updateCode = (row) => {
	const key = getSpecieKey(row.specie);
	if (!modifiedData[key]) {
		modifiedData[key] = {}; // 确保键存在
	}
	modifiedData[key].skuCode = row.skuCode;
};

const getRowKey = (row) => getSpecieKey(row.specie);
// 弹窗添加按钮
const addBtn = () => {
	isBtn.value = true;
};
// const addisIngredientValueBtn = () => {
// 	isBtn.value = true;
// };
// 添加规格
const createAttrName = () => {
	if (formRuleValue.attrsName && formRuleValue.attrsVal) {
		const data = {
			value: formRuleValue.attrsName,
			detail: [formRuleValue.attrsVal],
		};
		formDynamic.ruleValue.push(data);
		var hash: any = {};
		formDynamic.ruleValue = formDynamic.ruleValue.reduce((item: any, next: any) => {
			hash[next.value] ? '' : (hash[next.value] = true && item.push(next));
			return item;
		}, []);
		formRuleValue.attrsName = '';
		formRuleValue.attrsVal = '';
		isBtn.value = false;
	} else {
		useMessage().warning('请添加规格名称');
	}
};
const offAttrName = () => {
	isBtn.value = false;
};
const handleIntegerInput = (value: any) => {
	let num = value.replace(/[^\d.]/g, '');
	if (num.split('.').length > 2) {
		console.log('formIngredientValue.materialPrice', formIngredientValue.materialPrice);
		useMessage().warning('请输入正确的价格');
	} else {
		let res = '';
		if (num.split('.').length > 1 && num.split('.')[1].length > 2) {
			res = parseFloat(num).toFixed(2);
		} else {
			res = num;
		}
		if (Number(res) >= 100) {
			res = '99.99';
		}
		if (Number(res) < 0) {
			res = '0.00';
		}
		formIngredientValue.materialPrice = res;
	}
};
const blurIntegerInput = (val: any) => {
	let res = '';
	if (Number(val) == 0) {
		res = Number(val).toString();
		formIngredientValue.materialPrice = res;
	}
};
// 新增小料
// const createIngredientName = () => {};
// const offIngredientName = () => {
// 	isBtn.value = false;
// 	formIngredientValue.materialName = '';
// 	formIngredientValue.materialPrice = '';
// };
const createAttr = (num, idx) => {
	if (num) {
		formDynamic.ruleValue[idx].detail.push(num);
		var hash = {} as any;
		formDynamic.ruleValue[idx].detail = formDynamic.ruleValue[idx].detail.reduce(function (item: any, next: any) {
			/* eslint-disable */
			hash[next] ? '' : (hash[next] = true && item.push(next));
			return item;
		}, []);
		formDynamic.ruleValue[idx].inputVisible = false;
	} else {
		useMessage().warning('请添加属性');
	}
};
const showInput = (item: any, index: number) => {
	formDynamic.ruleValue[index].inputVisible = true;
};
const handleClose = (item: any, index: number) => {
	item.splice(index, 1);
};
// 删除小料
const handleIngredientClose = (item: any, index: number) => {
	if (isEdit.value && item.materialCode) {
		model.value.hasDelMaterial = true;
		model.value.delMaterialCodes.push(item.materialCode);
	}
	model.value.materials.splice(index, 1);
	if (isEdit.value) {
		addMaterialData.value = model.value.materials.filter((item: any) => !item.materialCode);
		console.log('addMaterialData', addMaterialData.value);
	}
	console.log('model.value', model.value);
};

const addSpecie = () => {
	visibleSpecie.value = true;
	if (state.dataList?.length == 1) {
		model.value.price = state.dataList[0].cost;
		model.value.otPrice = state.dataList[0].otPrice;
	}
};

const openAddCommodity = () => {
	visibleCommodity.value = true;
};
// 删除
const handleRemove = (index: number) => {
	formDynamic.ruleValue.splice(index, 1);
};
const cancelRules = () => {
	visibleSpecie.value = false;
	if (model.value.spuCode && model.value.skus[0].skuName !== '默认') {
		formDynamic.ruleValue = model.value.specs.map((item: any) => {
			return { value: item.name, detail: item.skuValues.split(',') };
		});
		state.dataList = model.value.skus.map((item: any) => {
			return { otPrice: item.otPrice, cost: item.price, specie: item.skuName.split(',') };
		});
	} else {
		formDynamic.ruleValue = [];
		state.dataList = [];
	}
};
const onSubmitRules = () => {
	visibleSpecie.value = false;
	if (state.dataList?.length > 1) {
		priceRange.value =
			state.dataList?.reduce((a, b) => Math.min(a, b.cost), Infinity) + '-' + state.dataList?.reduce((a, b) => Math.max(a, b.cost), -Infinity);
		otPriceRange.value =
			state.dataList?.reduce((a, b) => Math.min(a, b.otPrice), Infinity) + '-' + state.dataList?.reduce((a, b) => Math.max(a, b.otPrice), -Infinity);
		model.value.price = priceRange.value;
	}
	if (state.dataList?.length == 1) {
		model.value.price = state.dataList[0].cost;
		model.value.otPrice = state.dataList[0].otPrice;
		otPriceRange.value = '';
		priceRange.value = '';
	}
	if (!state.dataList?.length) {
		priceRange.value = '';
		otPriceRange.value = '';
		model.value.price = 0.01;
		model.value.otPrice = 0.01;
	}
};
const openAddIngredient = () => {
	if (model.value.materials.length >= 6) {
		useMessage().warning('最多只能添加6个小料');
	} else {
		visibleIngredient.value = true;
	}
};
// 关闭添加小料弹窗
const cancelIngredient = () => {
	// ingredientData.tagList = [];
	formIngredientValue.materialName = '';
	formIngredientValue.materialPrice = '';
	// isBtn.value = false;
	visibleIngredient.value = false;
	// 清理数据
};
// 添加小料确认弹窗
const onSubmitIngredient = () => {
	// isBtn.value = false;
	if (Number(formIngredientValue.materialPrice) === 0) {
		useMessage().warning('小料价格不能为0');
		return;
	}
	if (formIngredientValue.materialName && formIngredientValue.materialPrice) {
		const data = {
			materialName: formIngredientValue.materialName,
			materialPrice: Number(formIngredientValue.materialPrice),
		};
		console.log('data', data);
		// console.log('ingredientData', ingredientData);
		// Object.assign(ingredientData,data)
		model.value.materials.push(data);
		// model.value.materials = ingredientData.tagList;
		// ingredientData.tagList = model.value.materials ? JSON.parse(JSON.stringify(model.value.materials)) : [];
		console.log('model.value.materials', model.value.materials);
		formIngredientValue.materialName = '';
		formIngredientValue.materialPrice = '';
	} else {
		if (!formIngredientValue.materialName) useMessage().warning('请添加小料名称');
		if (!formIngredientValue.materialPrice) useMessage().warning('请添加小料价格');
	}
	if (isEdit.value) {
		addMaterialData.value = model.value.materials.filter((item: any) => !item.materialCode);
		console.log('addMaterialData', addMaterialData.value);
	}
	// 判断编辑时是否新增
	model.value.hasAddMaterial = model.value.materials.some((item: any) => isEdit.value && !item?.materialCode);
	console.log('添加小料确认弹窗', model.value);
	visibleIngredient.value = false;
};

const cancelCommodity = () => {
	console.log();
	visibleCommodity.value = false;
	formGroupingValue.merchantCode = '';
	formGroupingValue.imageUrl = '';
	formGroupingValue.groupName = '';
	formGroupingValue.remark = '';
};
// 新增分组
const onSubmitCommodity = async () => {
	// console.log("提交新增分组",formGroupingValue)
	const valid = await formGroupingRef.value.validate().catch(() => {});
	if (!valid) return false;
	const res = await wdGroupAdd(formGroupingValue);
	console.log('res', res);
	getCommoditygetList(model.value.merchantCode);
	console.log('提交新增分组', formGroupingValue);
	visibleCommodity.value = false;
	formGroupingValue.merchantCode = '';
	formGroupingValue.imageUrl = '';
	formGroupingValue.groupName = '';
	formGroupingValue.remark = '';
};
const getResult = (arr) => {
	let result = [];
	let stack = [...arr];
	while (stack.length) {
		const curr = stack.shift();
		result = result.length
			? [...result.reduce((res, item) => [...res, ...curr.detail.map((d) => [...item, { [curr.value]: d }])], [])]
			: curr.detail.map((d) => [{ [curr.value]: d }]);
	}
	return result;
};
const onDynamicSubmit = async () => {
	const valid = await dynamicFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	const oldSpuName = formDynamic.ruleValue[skuNameIndex.value].detail[skuNameIndexn.value];
	state.dataList?.forEach((item) => {
		const oldKey = getRowKey(item); // 获取旧key值
		if (oldKey.includes(oldSpuName)) {
			const obj = modifiedData[oldKey]; // 缓存之前的数据
			const newKey = oldKey.replace(oldSpuName, dynamicForm.spuName); // 替换新key
			modifiedData[newKey] = obj; // 存入新数据
			delete modifiedData[oldKey];
		}
	});
	formDynamic.ruleValue[skuNameIndex.value].detail[skuNameIndexn.value] = dynamicForm.spuName;
	dynamicVisible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.map-input {
	height: 456px;
}

.map {
	width: 715px;
	height: 366px;
}

.add-img {
	width: 150px;
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-color: transparent;
	border: 1px dashed #cdd0d6;
	border-radius: 8px;
	cursor: pointer;
	margin-left: 10px;

	.icon-plus {
		width: 24px;
		height: 24px;
	}
}

.box {
	position: relative;

	.del {
		position: absolute;
		width: 1em;
		height: 1em;
		top: 0;
		right: 0;
	}
}

.rules_form_box {
	::v-deep {
		.el-form-item__content {
			flex-direction: column;
			align-items: normal;
		}
	}
}

::v-deep {
	.el-tag--large .el-tag__close {
		margin-left: 12px;
	}
}
</style>
<style>
.popper-select {
	:is(li)[aria-haspopup='true'] {
		.el-checkbox {
			display: none;
		}
	}
}
</style>
