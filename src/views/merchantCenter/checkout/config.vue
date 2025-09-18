<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="40%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item label="关联商户" prop="merchantCode" v-if="!isMerchant">
					<el-select
						v-if="!scopeId"
						style="width: 58%"
						v-model="model.merchantCode"
						@keyup.enter="handleKeyUp(true)"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键字查询搜索"
						:remote-method="(val: string) => getMerchantsList(val)"
						:loading="loading"
					>
						<el-option v-for="item in merchantsList" :key="item.value" :label="`${item.label} (${item.value})`" :value="item.value" />
					</el-select>
					<span v-else>{{ model.merchantName }}</span>
				</el-form-item>
				<el-form-item label="结账方式" prop="type">
					<span v-if="scopeId">{{ model.name || '员工卡支付' }}</span>
					<el-select
						v-else
						style="width: 58%"
						v-model="model.type"
						@keyup.enter="handleKeyUp(true)"
						filterable
						remote
						reserve-keyword
						placeholder="请选择结账方式"
						:loading="loading"
					>
						<el-option v-for="item in checkoutTypeList" :key="item.value" :label="`${item.label}`" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="支付优惠" prop="paymentType">
					<el-radio-group v-model="model.paymentType" v-if="!isMerchant" @change="changePayType(model.paymentType, 'paymentDiscount')">
						<el-radio :label="1">无优惠</el-radio>
						<el-radio :label="2"
							>折扣<el-input
								v-if="model.paymentType === 2"
								type="text"
								v-model="model.paymentDiscount"
								placeholder="请输入折扣比例"
								maxlength="5"
								style="width: 200px"
								class="ml-2"
								@input="changeValue('paymentDiscount')"
								clearable
								@keyup.enter="handleKeyUp(true)"
							>
								<template #append>%</template></el-input
							></el-radio
						>
					</el-radio-group>
					<span v-if="isMerchant">{{ model.paymentType == 2 ? (Number(model.paymentDiscount) / 10).toFixed(1) + '折' : '全额' }}</span>
				</el-form-item>
				<el-form-item label="结算折扣" prop="settlementType">
					<el-radio-group v-model="model.settlementType" v-if="!isMerchant" @change="changePayType(model.settlementType, 'settlementDiscount')">
						<el-radio :label="1">无折扣</el-radio>
						<el-radio :label="2"
							>折扣
							<el-input
								v-if="model.settlementType === 2"
								v-model="model.settlementDiscount"
								@input="changeValue('settlementDiscount')"
								type="text"
								style="width: 200px"
								class="ml-2"
								placeholder="请输入折扣比例"
								maxlength="5"
								clearable
								@keyup.enter="handleKeyUp(true)"
							>
								<template #append>%</template></el-input
							></el-radio
						>
					</el-radio-group>
					<span v-if="isMerchant">{{ model.settlementType == 2 ? (Number(model.settlementDiscount) / 10).toFixed(1) + '折' : '全额' }}</span>
				</el-form-item>
				<el-form-item label="支付规则" prop="isLimit">
					<el-checkbox v-model="model.isLimit" label="限制员工卡支付" size="large" />
					<el-radio-group v-model="model.ruleType" @change="changePayRule(model.ruleType)" v-if="model.isLimit">
						<el-radio :label="1" size="large"
							>每人每天最多可用<el-input
								v-model="model.availableTimes"
								type="number"
								placeholder="请输入次数"
								style="width: 200px"
								class="ml-2"
								maxlength="5"
								@input="model.availableTimes = String(model.availableTimes)?.replace(/^(0+)|[^\d]+/g, '')"
								clearable
								@keyup.enter="handleKeyUp(true)"
							>
								<template #append>次</template></el-input
							></el-radio
						>
						<el-radio :label="2" size="large"
							>每人每天最多支付<el-input
								v-model="model.availableAmount"
								type="number"
								placeholder="请输入金额"
								style="width: 200px"
								class="ml-2"
								maxlength="5"
								@input="model.availableAmount = String(model.availableAmount)?.replace(/^(0+)|[^\d]+/g, '')"
								clearable
								@keyup.enter="handleKeyUp(true)"
							>
								<template #append>元</template></el-input
							></el-radio
						>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Checkout } from './types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { checkoutAdd, checkoutDetail, checkoutUpdate, merchantList } from '/@/api/goodStore/merchant';
import { Merchant } from '../store/shopStore/types';
import { Session } from '/@/utils/storage';
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
// 判断是否为好店
const isMerchant = computed(() => (Session.getTenant() === '1817759704625901569' ? true : false));
const dialogTitle = ref('新建结账方式');

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const scopeId = ref<string | null>('');
const merchantsList = ref<Merchant[]>([]);
const loading = ref(false);
const checkoutTypeList = [
	// { label: '微信支付', value: 1 },
	{ label: '员工卡支付', value: 6 },
];
const model = ref<Checkout>({
	merchantCode: '',
	isLimit: false,
	paymentType: 2,
	paymentDiscount: null,
	settlementType: 2,
	settlementDiscount: null,
	ruleType: 1,
	availableTimes: null,
	availableAmount: null,
});
const formRules = reactive<FormRules>({
	merchantCode: [{ required: true, message: '关联商户不能为空' }],
	paymentType: [{ required: true, message: '请选择支付优惠' }],
	settlementType: [{ required: true, message: '请选择结算折扣' }],
	// ruleType: [{ required: true, message: '请选择支付规则' }],
	// type: [{ required: true, message: '请选择结账方式' }],
});
const openDialog = async (id: string | null) => {
	scopeId.value = id;
	if (id) {
		dialogTitle.value = '编辑结账方式';
		try {
			const { code, data } = await checkoutDetail(id);
			if (code === 0) {
				model.value = data;
				merchantsList.value = [{ label: data.merchantName, value: data.merchantCode, type: data.type }];
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = '新建结账方式';
	}
	visible.value = true;
};
const closeMyDialog = () => {
	visible.value = false;
};
const changePayType = (type: any, val: string) => {
	type === 1 && (model.value[val] = 100);
	type === 2 && (model.value[val] = null);
};
const changePayRule = (type: any) => {
	type === 1 ? (model.value.availableAmount = null) : (model.value.availableTimes = null);
};
const changeValue = (val: string) => {
	const reg = /^[\d\.]*$/;
	if (val === 'paymentDiscount') {
		const paymentDiscount = String(model.value.paymentDiscount);
		!reg.test(paymentDiscount) && (model.value.paymentDiscount = null);

		if (Number(model.value?.paymentDiscount) > 99.99) {
			model.value.paymentDiscount = 99.99;
		}
		if (Number(model.value?.paymentDiscount) < 1) {
			model.value.paymentDiscount = null;
		}
	} else if (val === 'settlementDiscount') {
		const settlementDiscount = String(model.value.settlementDiscount);
		!reg.test(settlementDiscount) && (model.value.settlementDiscount = null);
		if (Number(model.value?.settlementDiscount) > 99.99) {
			model.value.settlementDiscount = 99.99;
		}
		if (Number(model.value?.settlementDiscount) < 1) {
			model.value.settlementDiscount = null;
		}
	}
};
const getMerchantsList = async (query: string | undefined) => {
	if (query) {
		loading.value = true;
		try {
			const { data, code, msg } = await merchantList({ merchantName: query });
			loading.value = false;
			if (code === 0) {
				const list = data?.map((item: any) => {
					return {
						label: item.merchantName,
						value: item.merchantCode,
						type: item.type,
					};
				});
				merchantsList.value = list;
			} else {
				useMessage().error(msg);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		merchantsList.value = [];
	}
};
const validateData = () => {
	const { paymentType, paymentDiscount, settlementType, settlementDiscount, isLimit, ruleType, availableTimes, availableAmount } = model.value;
	let validate = true;
	if (paymentType == 2 && !paymentDiscount) {
		validate = false;
		return useMessage().error('请输入支付折扣');
	}
	if (settlementType == 2 && !settlementDiscount) {
		validate = false;
		return useMessage().error('请输入结算折扣');
	}
	if (isLimit && ruleType == 1 && !availableTimes) {
		validate = false;
		return useMessage().error('请输入可用次数');
	}
	if (isLimit && ruleType == 2 && !availableAmount) {
		validate = false;
		return useMessage().error('请输入支付金额');
	}
	return validate;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	const validate = validateData();
	if (!formEl || !validate) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}结账方式`, `${scopeId.value ? '修改' : '新建'}结账方式`);
			} catch {
				return false;
			}
			try {
				const request = scopeId.value ? checkoutUpdate : checkoutAdd;
				const paymentDiscount = model.value.paymentDiscount ? Number(model.value.paymentDiscount) / 100 : 0;
				const settlementDiscount = model.value.settlementDiscount ? Number(model.value.settlementDiscount) / 100 : 0;
				const isLimit = model.value.isLimit ? true : false;
				const params = {
					...model.value,
					isLimit,
					paymentDiscount,
					settlementDiscount,
				};
				const { code, msg } = await request(params);
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改' : '新建'}成功`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};
// 输入框回车事件
const handleKeyUp = (enterable: Boolean) => {
	if (!enterable) return;
	onSubmit(formRef.value);
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		merchantCode: '',
		paymentType: 2,
		paymentDiscount: null,
		settlementType: 2,
		settlementDiscount: null,
		ruleType: 1,
		availableTimes: null,
		availableAmount: null,
	};
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm(formEl);
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
