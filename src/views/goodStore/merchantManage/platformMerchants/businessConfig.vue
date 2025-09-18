<template>
	<el-dialog :close-on-click-modal="false" title="业务配置" width="600" draggable v-model="visible">
		<div class="flex justify-between items-center">
			<div class="text-[18px]">到店支付</div>
			<el-switch v-model="storeEmployCardConfigIsShow" :before-change="() => handleSwitch(storeEmployCardConfigIsShow, true)" />
		</div>
		<el-card style="width: 100%" class="mt-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<el-switch v-model="storeWechatConfig.isOpen" disabled />
					<div class="ml-4">微信支付</div>
				</div>
				<el-button @click="onSubmit('storeWechatPay')" type="primary" disabled>提交</el-button>
			</div>
		</el-card>
		<el-card style="width: 100%" class="mt-2">
			<div class="flex items-center">
				<el-switch v-model="storeEmployCardConfig.isOpen" />
				<div class="ml-4">员工卡支付</div>
			</div>
			<el-form :model="storeEmployCardConfig" label-width="auto" :rules="storeRule" ref="storeDataFormRef" class="mt-4">
				<el-form-item label="支付优惠" prop="paymentType">
					<el-radio-group v-model="storeEmployCardConfig.paymentType">
						<el-radio :label="1">无优惠</el-radio>
						<el-radio :label="2">折扣</el-radio>
						<el-form-item prop="paymentDiscount" v-if="storeEmployCardConfig.paymentType == 2">
							<el-input v-model="storeEmployCardConfig.paymentDiscount" style="width: 180px" placeholder="请输入">
								<template #append>%</template>
							</el-input>
						</el-form-item>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="结算折扣" prop="settlementType">
					<el-radio-group v-model="storeEmployCardConfig.settlementType">
						<el-radio :label="1">无优惠</el-radio>
						<el-radio :label="2">折扣</el-radio>
						<el-form-item prop="settlementDiscount" v-if="storeEmployCardConfig.settlementType == 2">
							<el-input v-model="storeEmployCardConfig.settlementDiscount" style="width: 180px" placeholder="请输入">
								<template #append>%</template>
							</el-input>
						</el-form-item>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="支付规则">
					<el-checkbox v-model="storeEmployCardConfig.isLimit"> 限制员工卡支付 </el-checkbox>
					<el-radio-group v-if="storeEmployCardConfig.isLimit" v-model="storeEmployCardConfig.ruleType">
						<el-radio :label="1" class="custom-radio">
							<span>每人每天最多可用</span>
							<el-form-item prop="availableTimes" v-if="storeEmployCardConfig.ruleType == 1">
								<el-input v-model="storeEmployCardConfig.availableTimes" style="width: 180px" placeholder="请输入最多可用">
									<template #append>次</template>
								</el-input>
							</el-form-item>
						</el-radio>
						<el-radio :label="2" class="custom-radio">
							<span>每人每天最多支付</span>
							<el-form-item prop="availableAmount" v-if="storeEmployCardConfig.ruleType == 2">
								<el-input v-model="storeEmployCardConfig.availableAmount" style="width: 180px" placeholder="请输入最多支付金额">
									<template #append>元</template>
								</el-input>
							</el-form-item>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<div class="w-full justify-end flex">
						<el-button @click="onSubmit('storeEmployeePay')" type="primary" :disabled="loading">提交</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- 网定店取 -->
		<div class="flex justify-between items-center mt-4">
			<div class="text-[18px]">网订店取</div>
			<el-switch v-model="wddqEmployeeCardConfigIsShow" :before-change="() => handleSwitch(wddqEmployeeCardConfigIsShow, false)" />
		</div>
		<el-card style="width: 100%" class="mt-2">
			<div class="flex justify-between items-center">
				<div class="flex items-center justify-between w-full">
					<div class="flex items-center">
						<el-switch v-model="wddqWechatConfig.isOpen" />
						<div class="ml-4">微信支付</div>
					</div>
					<div class="flex items-center">
						<div v-if="wddqEmployeeCardConfig.merId" class="mr-4">商户号: {{ wddqEmployeeCardConfig.merId }}</div>
						<el-button @click="onSubmit('wddqWechatPay')" type="primary">提交</el-button>
					</div>
				</div>
			</div>
		</el-card>
		<el-card style="width: 100%" class="mt-2">
			<div class="flex items-center">
				<el-switch v-model="wddqEmployeeCardConfig.isOpen" />
				<div class="ml-4">员工卡支付</div>
			</div>
			<el-form :model="wddqEmployeeCardConfig" label-width="auto" :rules="wddqRule" ref="wddqDataFormRef" class="mt-4">
				<el-form-item label="支付优惠" prop="paymentType">
					<el-radio-group v-model="wddqEmployeeCardConfig.paymentType">
						<el-radio :label="1">无优惠</el-radio>
						<el-radio :label="2">折扣</el-radio>
						<el-form-item prop="paymentDiscount" v-if="wddqEmployeeCardConfig.paymentType == 2">
							<el-input v-model="wddqEmployeeCardConfig.paymentDiscount" style="width: 180px" placeholder="请输入">
								<template #append>%</template>
							</el-input>
						</el-form-item>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="结算折扣" prop="settlementType">
					<el-radio-group v-model="wddqEmployeeCardConfig.settlementType">
						<el-radio :label="1">无优惠</el-radio>
						<el-radio :label="2">折扣</el-radio>
						<el-form-item prop="settlementDiscount" v-if="wddqEmployeeCardConfig.settlementType == 2">
							<el-input v-model="wddqEmployeeCardConfig.settlementDiscount" style="width: 180px" placeholder="请输入">
								<template #append>%</template>
							</el-input>
						</el-form-item>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="支付规则">
					<el-checkbox v-model="wddqEmployeeCardConfig.isLimit"> 限制员工卡支付 </el-checkbox>
					<el-radio-group v-if="wddqEmployeeCardConfig.isLimit" v-model="wddqEmployeeCardConfig.ruleType">
						<el-radio :label="1" class="custom-radio">
							<span>每人每天最多可用</span>
							<el-form-item prop="availableTimes" v-if="wddqEmployeeCardConfig.ruleType == 1">
								<el-input v-model="wddqEmployeeCardConfig.availableTimes" style="width: 180px" placeholder="请输入最多可用">
									<template #append>次</template>
								</el-input>
							</el-form-item>
						</el-radio>
						<el-radio :label="2" class="custom-radio">
							<span>每人每天最多支付</span>
							<el-form-item prop="availableAmount" v-if="wddqEmployeeCardConfig.ruleType == 2">
								<el-input v-model="wddqEmployeeCardConfig.availableAmount" style="width: 180px" placeholder="请输入最多支付金额">
									<template #append>元</template>
								</el-input>
							</el-form-item>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<div class="w-full justify-end flex">
						<el-button @click="onSubmit('wddqEmployeePay')" type="primary" :disabled="loading">提交</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-card>
	</el-dialog>
</template>

<script lang="ts" name="businessConfig" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import type { FormInstance, FormRules } from 'element-plus';
import { checkOutList, checkOutAdd, updateIsReminder, checkOutUpdate, checkOutUpdateStatus } from '/@/api/goodStore/merchant';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();
const visible = ref(false);
const loading = ref(false);

// 定义两个formRef
const storeDataFormRef = ref();
const wddqDataFormRef = ref();

// 到店支付大开关状态
const storeEmployCardConfigIsShow = ref(false);
// 网订店取大开关状态
const wddqEmployeeCardConfigIsShow = ref(false);

// 到店支付配置数据初始化
let storeWechatConfig = ref({
	id: '',
	isOpen: false,
	merchantCode: '',
	isLimit: false,
	settlementType: 1,
	type: 2,
	businessType: 1,
	paymentType: 1,
	ruleType: 1,
});
let storeEmployCardConfig = ref({
	merchantCode: '',
	type: 1,
	businessType: 1,
	paymentDiscount: null,
	paymentType: 1,
	settlementDiscount: null,
	settlementType: 1,
	isLimit: false,
	id: '',
	isOpen: true,
	ruleType: 1,
	availableAmount: null,
	availableTimes: null,
});
// 网订店取配置数据初始化
let wddqWechatConfig = ref({
	id: '',
	isOpen: false,
	merchantCode: '',
	isLimit: false,
	settlementType: 1,
	type: 2,
	businessType: 2,
	paymentType: 1,
	ruleType: 1,
});
let wddqEmployeeCardConfig = ref({
	merchantCode: '',
	type: 1,
	businessType: 2,
	paymentDiscount: null,
	paymentType: 1,
	settlementDiscount: null,
	settlementType: 1,
	isLimit: false,
	id: '',
	merId: '',
	isOpen: true,
	ruleType: 1,
	availableAmount: null,
	availableTimes: null,
});

// 到店支付rules
const storeRule = reactive<FormRules>({
	settlementDiscount: [
		{ required: true, message: '结算折扣不能为空' },
		{
			// 使用validator进行自定义校验
			validator: (rule, value, callback) => {
				// 确保值是数字类型
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('结算折扣必须大于0'));
				}
				if (value > 1) {
					callback(new Error('结算折扣不能大于1'));
				}
				// 确保保留两位小数
				if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
					callback(new Error('请输入最多两位小数的数字'));
				}
				// 校验通过
				callback();
			},
			trigger: 'blur',
		},
	],
	paymentDiscount: [
		{ required: true, message: '支付折扣不能为空' },
		{
			// 使用validator进行自定义校验
			validator: (rule, value, callback) => {
				// 确保值是数字类型
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('支付折扣必须大于0'));
				}
				if (value > 1) {
					callback(new Error('支付折扣不能大于1'));
				}
				// 确保保留两位小数
				if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
					callback(new Error('请输入最多两位小数的数字'));
				}
				// 校验通过
				callback();
			},
			trigger: 'blur',
		},
	],
	availableTimes: [
		{ required: false, message: '最多可用次数不能为空' },
		{
			// 使用validator进行自定义校验
			validator: (rule, value, callback) => {
				// 确保值是数字类型
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('最多可用次数必须大于0'));
				}
				// 校验通过
				callback();
			},
			trigger: 'blur',
		},
	],
	availableAmount: [
		{ required: false, message: '最多支付金额不能为空' },
		{
			// 使用validator进行自定义校验
			validator: (rule, value, callback) => {
				// 确保值是数字类型
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('最多支付金额必须大于0'));
				}
				// 确保保留两位小数
				if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
					callback(new Error('请输入最多两位小数的数字'));
				}
				// 校验通过
				callback();
			},
			trigger: 'blur',
		},
	],
	settlementType: [{ required: true, message: '结算类型不能为空' }],
	paymentType: [{ required: true, message: '支付类型不能为空' }],
});

// 网订店取rules
const wddqRule = reactive<FormRules>({
	settlementDiscount: [
		{ required: true, message: '结算折扣不能为空' },
		{
			// 使用validator进行自定义校验
			validator: (rule, value, callback) => {
				// 确保值是数字类型
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('结算折扣必须大于0'));
				}
				if (value > 1) {
					callback(new Error('结算折扣不能大于1'));
				}
				// 确保保留两位小数
				if (value && !/^\d+(\.\d{1,2})?$/.test(value.toString())) {
					callback(new Error('请输入最多两位小数的数字'));
				}
				// 校验通过
				callback();
			},
			trigger: 'blur',
		},
	],
	paymentDiscount: [
		{ required: true, message: '支付折扣不能为空' },
		{
			// 使用validator进行自定义校验
			validator: (rule, value, callback) => {
				// 确保值是数字类型
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('支付折扣必须大于0'));
				}
				if (value > 1) {
					callback(new Error('支付折扣不能大于1'));
				}
				// 确保保留两位小数
				if (value && !/^\d+(\.\d{1,2})?$/.test(value.toString())) {
					callback(new Error('请输入最多两位小数的数字'));
				}
				// 校验通过
				callback();
			},
			trigger: 'blur',
		},
	],
	availableTimes: [
		{ required: false, message: '最多可用次数不能为空' },
		{
			// 使用validator进行自定义校验
			validator: (rule, value, callback) => {
				// 确保值是数字类型
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('最多可用次数必须大于0'));
				}
				// 校验通过
				callback();
			},
			trigger: 'blur',
		},
	],
	availableAmount: [
		{ required: false, message: '最多支付金额不能为空' },
		{
			// 使用validator进行自定义校验
			validator: (rule, value, callback) => {
				// 确保值是数字类型
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('最多支付金额必须大于0'));
				}
				// 确保保留两位小数
				if (value && !/^\d+(\.\d{1,2})?$/.test(value.toString())) {
					callback(new Error('请输入最多两位小数的数字'));
				}
				// 校验通过
				callback();
			},
			trigger: 'blur',
		},
	],
	settlementType: [{ required: true, message: '结算类型不能为空' }],
	paymentType: [{ required: true, message: '支付类型不能为空' }],
});

watch(
	() => storeEmployCardConfig.value.isLimit,
	(val) => {
		if (!val) {
			storeEmployCardConfig.value.availableAmount = null;
			storeEmployCardConfig.value.availableTimes = null;
			storeEmployCardConfig.value.ruleType = 1;
		}
	}
);

watch(
	() => wddqEmployeeCardConfig.value.isLimit,
	(val) => {
		if (!val) {
			wddqEmployeeCardConfig.value.availableAmount = null;
			wddqEmployeeCardConfig.value.availableTimes = null;
			wddqEmployeeCardConfig.value.ruleType = 1;
		}
	}
);

const congfigInfo = ref();

// 打开弹窗
const openDialog = (row: any) => {
	congfigInfo.value = row;
	nextTick(() => {
		reset();
		storeEmployCardConfigIsShow.value = row.isReminder;
		wddqEmployeeCardConfigIsShow.value = row.onlineIsReminder;
		checkOutList({ merchantCode: row.merchantCode }).then((res) => {
			visible.value = true;
			const { data } = res;
			data.forEach((item: any) => {
				if (item.businessType == 1) {
					item.pages.forEach((item: any) => {
						if (item.type === 1) {
							Object.assign(storeEmployCardConfig.value, item);
						} else if (item.type === 2) {
							Object.assign(storeWechatConfig.value, item);
						}
					});
				}
				if (item.businessType == 2) {
					item.pages.forEach((item: any) => {
						if (item.type === 1) {
							Object.assign(wddqEmployeeCardConfig.value, item);
						} else if (item.type === 2) {
							Object.assign(wddqWechatConfig.value, item);
						}
					});
				}
			});
		});
	});
};

// 重置
const reset = () => {
	storeWechatConfig.value = {
		id: '',
		isOpen: false,
		merchantCode: '',
		isLimit: false,
		settlementType: 1,
		type: 2,
		businessType: 1,
		paymentType: 1,
		ruleType: 1,
	};
	storeEmployCardConfig.value = {
		merchantCode: '',
		type: 1,
		businessType: 1,
		paymentDiscount: null,
		paymentType: 1,
		settlementDiscount: null,
		settlementType: 1,
		isLimit: false,
		id: '',
		isOpen: true,
		ruleType: 1,
		availableAmount: null,
		availableTimes: null,
	};
	wddqWechatConfig.value = {
		id: '',
		isOpen: false,
		merchantCode: '',
		isLimit: false,
		settlementType: 1,
		type: 2,
		businessType: 2,
		paymentType: 1,
		ruleType: 1,
	};
	wddqEmployeeCardConfig.value = {
		merchantCode: '',
		type: 1,
		businessType: 2,
		paymentDiscount: null,
		paymentType: 1,
		settlementDiscount: null,
		settlementType: 1,
		isLimit: false,
		id: '',
		merId: '',
		isOpen: true,
		ruleType: 1,
		availableAmount: null,
		availableTimes: null,
	};
};

// 大开关
const handleSwitch = async (show: boolean, typeOrder: boolean) => {
	const params = {
		id: congfigInfo.value.id,
		isReminder: typeOrder ? !storeEmployCardConfigIsShow.value : storeEmployCardConfigIsShow.value,
		onlineIsReminder: typeOrder ? wddqEmployeeCardConfigIsShow.value : !wddqEmployeeCardConfigIsShow.value,
	};
	const msg = show ? '确定要禁用该业务吗?' : '确定要启用该业务吗?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		const res = await updateIsReminder(params);
		if (res.code != 0) {
			return useMessage().error(res.msg);
		}
		useMessage().success('操作成功');
		visible.value = false;
		emit('refresh');
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 员工卡支付方式 提交逻辑
const onSubmit = async (type: string) => {
	if (type === 'storeWechatPay') {
		return;
	} else if (type === 'storeEmployeePay') {
		const valid = await storeDataFormRef.value.validate().catch(() => {});
		if (!valid) return false;
		const msg = storeEmployCardConfig.value.isOpen ? '确定要启用该业务吗？' : '确定要禁用该业务吗？';
		try {
			await useMessageBox().confirm(msg);
		} catch {
			return;
		}
		try {
			loading.value = true;
			storeEmployCardConfig.value.merchantCode = congfigInfo.value.merchantCode;
			const res = storeEmployCardConfig.value.id ? await checkOutUpdate(storeEmployCardConfig.value) : await checkOutAdd(storeEmployCardConfig.value);
			if (res.code != 0) {
				return useMessage().error(res.msg);
			}
			visible.value = false;
			emit('refresh');
		} catch (err: any) {
			useMessage().error(err.msg);
		} finally {
			loading.value = false;
		}
	} else if (type === 'wddqWechatPay') {
		const msg = wddqWechatConfig.value.isOpen ? '确定要启用该业务吗？' : '确定要禁用该业务吗？';
		try {
			await useMessageBox().confirm(msg);
		} catch {
			return;
		}
		try {
			wddqWechatConfig.value.merchantCode = congfigInfo.value.merchantCode;
			const res = wddqWechatConfig.value.id ? await checkOutUpdate(wddqWechatConfig.value) : await checkOutAdd(wddqWechatConfig.value);
			if (res.code != 0) {
				return useMessage().error(res.msg);
			}
			useMessage().success('操作成功');
			visible.value = false;
			emit('refresh');
			return true;
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else if (type === 'wddqEmployeePay') {
		const valid = await wddqDataFormRef.value.validate().catch(() => {});
		if (!valid) return false;
		const msg = wddqEmployeeCardConfig.value.isOpen ? '确定要启用该业务吗？' : '确定要禁用该业务吗？';
		try {
			await useMessageBox().confirm(msg);
		} catch {
			return;
		}
		try {
			loading.value = true;
			wddqEmployeeCardConfig.value.merchantCode = congfigInfo.value.merchantCode;
			const res = wddqEmployeeCardConfig.value.id
				? await checkOutUpdate(wddqEmployeeCardConfig.value)
				: await checkOutAdd(wddqEmployeeCardConfig.value);
			if (res.code != 0) {
				return useMessage().error(res.msg);
			}
			visible.value = false;
			emit('refresh');
		} catch (err: any) {
			useMessage().error(err.msg);
		} finally {
			loading.value = false;
		}
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
:deep(.custom-radio) {
	.el-radio__label {
		display: flex;
		> span {
			margin-right: 32px;
		}
	}
}
</style>
