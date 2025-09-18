<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-tabs v-model="activeName" class="demo-tabs">
					<el-tab-pane label="基本信息" name="Base">
						<el-form-item label="LOGO" prop="logo">
							<upload-img v-model:image-url="model.logo" />
						</el-form-item>
						<el-form-item label="商家类型" prop="type" v-if="!isMerchant">
							<el-select v-model="model.type" clearable style="width: 200px">
								<el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="商家名称" prop="merchantName">
							<el-input
								v-model="model.merchantName"
								type="text"
								placeholder="请输入商家名称"
								maxlength="50"
								show-word-limit
								clearable
								@keyup.enter="handleKeyUp(true)"
							/>
						</el-form-item>
						<el-form-item label="押金(元)" prop="depositMoneyLabel">
							<div class="flex items-center">
								<el-input-number
									:min="0"
									:max="999999.99"
									:precision="2"
									controls-position="right"
									placeholder="请输入押金金额"
									v-model="model.depositMoney"
								/>
							</div>
						</el-form-item>
						<el-form-item label="管理员账号" prop="supperMobile">
							<el-input
								v-model="model.supperMobile"
								type="text"
								maxlength="11"
								show-word-limit
								placeholder="请输入管理员账号信息"
								clearable
								@keyup.enter="handleKeyUp(true)"
							/>
						</el-form-item>
						<el-form-item label="" prop="mobileCode">
							<div class="flex justify-between items-center">
								<el-input
									v-model="model.mobileCode"
									type="text"
									maxlength="6"
									show-word-limit
									placeholder="请输入验证码"
									clearable
									@keyup.enter="handleKeyUp(true)"
									class="mr-3"
								/>
								<el-button type="primary" size="small" @click="getmobileCode"> {{ isCounting ? `剩余时间: ${timeLeft}秒` : '获取验证码' }}</el-button>
							</div>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商家信息" name="Desc">
						<el-form-item label="商家信息" prop="description">
							<editor v-model:get-html="model.description" height="500" width="600" />
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
				<div class="mt-5 flex justify-center">
					<el-button type="info" size="default" @click="cancel(formRef)" v-if="!isMerchant">取消</el-button>
					<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Business } from './types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import router from '/@/router';
import { getSmsCode, merchantConfig, merchantDetail } from '/@/api/goodStore/merchant';
import { LocationQueryValue, useRoute } from 'vue-router';
import { Session } from '/@/utils/storage';

let route = useRoute(); // 生成组件唯一id
const emit = defineEmits(['refresh']);
const formRef = ref();
const activeName = ref('Base');

const timeLeft = ref(60);
const isCounting = ref(false);
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
// 判断是否为好店-杀郭嘉
const isMerchant = computed(() => (Session.getTenant() === '1817759704625901569' ? true : false));
const model = ref<Business>({
	logo: '',
	merchantName: '',
	type: '',
	supperMobile: '',
	description: '',
	mobileCode: '',
	depositMoney: 0,
});
const typeList = ref<{ label: string; value: number }[]>([
	{ label: '单店', value: 1 },
	{ label: '连锁', value: 2 },
	{ label: '大众点评', value: 3 },
]);
//   表单校验规则
const formRules = reactive<FormRules>({
	merchantName: [{ required: true, message: '商家名称不能为空' }],
	type: [{ required: true, message: '商家类型不能为空' }],
});
let countdownInterval: any = null;
const getmobileCode = async () => {
	if (!model.value.supperMobile) {
		return useMessageBox().error('请输入管理员账号');
	}
	if (isCounting.value && model.value.supperMobile) return; // 如果正在倒计时，直接返回
	isCounting.value = true;
	const { msg, code } = await getSmsCode(model.value.supperMobile);
	if (code !== 0) {
		useMessageBox().error(msg);
		isCounting.value = false;
		return;
	}
	countdownInterval = setInterval(() => {
		timeLeft.value--;
		if (timeLeft.value <= 0) {
			clearInterval(countdownInterval);
			isCounting.value = false;
			timeLeft.value = 60; // 重置时间
		}
	}, 1000);
};
const getBack = () => {
	!isMerchant.value && router.push('/goodStore/merchantManage/platformMerchants/index');
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否配置商家`, '商家配置');
			} catch {
				return false;
			}
			try {
				const { code, msg } = await merchantConfig(model.value);
				if (code === 0) {
					useMessage().success(`配置成功`);
					!isMerchant.value && resetForm(formEl);
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
	Object.keys(model.value).forEach((key) => (model.value[key] = ''));
	getBack();
};
const hasValues = (obj: Business) => {
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && obj[key] !== '') {
			return true;
		}
	}
	return false;
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	const { id } = route.query;
	const isEmptyForm = !hasValues(model.value);
	if (isEmptyForm || id) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		resetForm(formEl);
	} catch {
		return false;
	}
};
const getConfigDetail = (id: LocationQueryValue[] | any) => {
	merchantDetail(id).then((res) => {
		model.value = res.data;
	});
};
onMounted(() => {
	const { id } = route.query;
	const merchantId = id || Session.get('merchantId');
	merchantId && getConfigDetail(merchantId);
});
</script>

<style scoped lang="scss"></style>
