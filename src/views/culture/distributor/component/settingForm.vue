<template>
	<el-dialog
		:model-value="modelValue"
		title="返佣设置"
		destroy-on-close
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		:show-close="false"
		append-to-body
		align-center
		width="600px"
		class="common-dialog"
	>
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" class="common-form common-submit-form">
			<el-form-item prop="brokerageFirstRatio">
				<template #label>
					<div class="flex items-center">
						<span>一级返佣比例</span>
						<el-tooltip class="item" effect="dark" content="订单交易成功后给上级返佣" placement="top-start">
							<el-icon>
								<Warning />
							</el-icon>
						</el-tooltip>
					</div>
				</template>
				<el-input-number v-model.trim="formData.brokerageFirstRatio" placeholder="请输入" :min="0">
					<template #suffix>
						<span>%</span>
					</template>
				</el-input-number>
			</el-form-item>
			<el-form-item prop="brokerageSecondRatio">
				<template #label>
					<div class="flex items-center">
						<span>二级返佣比例</span>
						<el-tooltip class="item" effect="dark" content="订单交易成功后给上级返佣" placement="top-start">
							<el-icon>
								<Warning />
							</el-icon>
						</el-tooltip>
					</div>
				</template>
				<el-input-number v-model.trim="formData.brokerageSecondRatio" placeholder="请输入" :min="0">
					<template #suffix>
						<span>%</span>
					</template>
				</el-input-number>
			</el-form-item>
			<el-form-item prop="specialBrokerageType">
				<template #label>
					<div class="flex items-center">
						<span>特殊返佣</span>
						<el-tooltip class="item" effect="dark" content="特殊返佣" placement="top-start">
							<el-icon>
								<Warning />
							</el-icon>
						</el-tooltip>
					</div>
				</template>
				<el-radio-group v-model="formData.specialBrokerageType" @change="handleChangeRadio">
					<el-radio :label="1">商品</el-radio>
					<el-radio :label="2">品类</el-radio>
					<el-radio :label="0">无</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="specialBrokerageRatio" v-if="formData.specialBrokerageType === 1">
				<div class="flex items-center">
					<el-select class="!w-[240px]" v-model="formData.relateIds" multiple filterable clearable placeholder="请选择">
						<el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
					<span class="mx-[10px]">返佣: </span>
					<el-input class="!w-[100px]" type="number" v-model.trim="formData.specialBrokerageRatio" placeholder="请输入" :min="0">
						<template #suffix> % </template>
					</el-input>
				</div>
			</el-form-item>
			<el-form-item prop="specialBrokerageRatio" v-if="formData.specialBrokerageType === 2">
				<div class="flex items-center">
					<el-cascader
						class="!w-[240px]"
						v-model="formData.relateIds"
						:options="productClassify"
						:props="propsProductClassify"
						filterable
						clearable
					/>
					<span class="mx-[10px]">返佣: </span>
					<el-input class="!w-[100px]" type="number" v-model.trim="formData.specialBrokerageRatio" placeholder="请输入" :min="0">
						<template #suffix> % </template>
					</el-input>
				</div>
			</el-form-item>
			<el-form-item label="促销规则">
				<el-radio-group v-model="formData.promotionRuleType">
					<el-row>
						<el-col>
							<el-radio :label="1">买赠</el-radio>
							<span v-if="formData.promotionRuleType === 1">
								<el-input v-model="formData.conditionValue" class="!w-[140px] mr-[20px]" type="number">
									<template #prepend> 满 </template>
									<template #suffix> 件 </template>
								</el-input>
								<el-input v-model="formData.rewardValue" class="!w-[140px]" type="number">
									<template #prepend> 赠 </template>
									<template #suffix> 件 </template>
								</el-input>
							</span>
						</el-col>
						<el-col>
							<el-radio :label="2">折扣</el-radio>
							<span v-if="formData.promotionRuleType === 2">
								<el-input v-model="formData.conditionValue" class="!w-[140px] mr-[20px]" type="number">
									<template #prepend> 满 </template>
									<template #suffix> 件 </template>
								</el-input>
								<el-input v-model="formData.rewardValue" class="!w-[140px]" type="number">
									<template #prepend> 折 </template>
									<template #suffix> % </template>
								</el-input>
							</span>
						</el-col>
						<el-col>
							<el-radio :label="3">满减</el-radio>
							<span v-if="formData.promotionRuleType === 3">
								<el-input v-model="formData.conditionValue" class="!w-[140px] mr-[20px]" type="number">
									<template #prepend> 满 </template>
									<template #suffix> 元 </template>
								</el-input>
								<el-input v-model="formData.rewardValue" class="!w-[140px]" type="number">
									<template #prepend> 减 </template>
									<template #suffix> % </template>
								</el-input>
							</span>
						</el-col>
						<el-col>
							<el-radio :label="0">无</el-radio>
						</el-col>
					</el-row>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeDialog">取消</el-button>
				<el-button type="primary" @click="handleSubmit"> 确定 </el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { productCategoryApi, productLstApi } from '/@/api/culture/commodity/commodityList';
import { updateBrokerage } from '/@/api/member/distributionManage';

const props = defineProps<{
	modelValue: boolean;
	row?: any;
}>();

const formData = ref({
	levelCode: '',
	brokerageFirstRatio: '', // 一级返俑比例
	brokerageSecondRatio: '', // 二级返俑比例
	specialBrokerageType: 1, // 1：商品(关联商品的sku) 2:品类
	specialBrokerageRatio: '', // 特殊返俑比例
	promotionRuleType: 0, // 0：无，1：买赠，2：折扣，3：满减
	conditionValue: '', // 条件值(件数或金额)
	rewardValue: '', // 奖励值(赠送件数或折扣比例)
	relateIds: [], // 关联商品id
});

// Cascader 配置
const propsProductClassify = {
	value: 'id',
	label: 'name',
	children: 'childList',
	expandTrigger: 'hover',
	checkStrictly: false,
	multiple: true,
	emitPath: false,
};

const formRules = reactive({
	brokerageFirstRatio: [{ required: true, message: '请输入一级返佣比例', trigger: 'blur' }],
	brokerageSecondRatio: [{ required: true, message: '请输入二级返佣比例', trigger: 'blur' }],
});

const emits = defineEmits<{
	(event: 'update:modelValue', val: boolean): void;
	(event: 'ok', params?: any): void;
}>();

const productClassify = ref<any>([]);
const getAdminProductClassify = async () => {
	try {
		const { code, data, msg } = await productCategoryApi();
		if (code === 0) {
			if (data.length > 0) {
				data.map((item: any) => {
					if (item.childList?.length < 1) {
						item.disabled = true;
					}
				});
				productClassify.value = data;
			}
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const productList = ref<any>([]);
const getProductListApi = async () => {
	const res = await productLstApi({ current: 1, size: 1000 });
	res?.ok && (productList.value = res.data.records);
};

const handleChangeRadio = () => {
	formData.value.relateIds = [];
	formData.value.specialBrokerageRatio = '';
};

const formRef = ref();
const loading = ref(false);
const handleSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			loading.value = true;
			updateBrokerage(formData.value).then((res: any) => {
				loading.value = false;
				if (res?.ok) {
					useMessage().success('添加成功');
					emits('update:modelValue', false);
					emits('ok', formData.value);
				} else {
					useMessage().error(res?.msg);
				}
			});
		}
	});
};

const closeDialog = () => {
	try {
		useMessageBox()
			.confirm('该操作会关闭弹窗且将丢失编辑内容，是否确认取消')
			.then(() => {
				emits('update:modelValue', false);
			});
	} catch {
		return;
	}
};

watch(
	() => props.modelValue,
	(newUid) => {
		if (newUid) {
			try {
				loading.value = true;
				formData.value = props.row;
				formData.value.relateIds = props.row.distributionLevelProducts?.map((item: any) => item.relateId) || [];
			} catch (err) {
				loading.value = false;
			} finally {
				loading.value = false;
			}
		}
	},
	{ immediate: true }
);

onMounted(() => {
	getAdminProductClassify();
	getProductListApi();
});
</script>
