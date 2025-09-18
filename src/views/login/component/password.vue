<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="state.ruleForm" @keyup.enter="handleVerify">
		<el-form-item class="login-animation1" prop="username">
			<el-input text :placeholder="$t('password.accountPlaceholder1')" v-model="state.ruleForm.username" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-User />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="password">
			<el-input
				:type="state.isShowPassword ? 'text' : 'password'"
				:placeholder="$t('password.accountPlaceholder2')"
				v-model="state.ruleForm.password"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-Unlock />
					</el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="code" v-if="verifyImageEnable">
			<el-col :span="15">
				<el-input text maxlength="4" :placeholder="$t('mobile.placeholder2')" v-model="state.ruleForm.code" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<img :src="imgSrc" @click="getVerifyImageCode" />
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation4 mt-4">
			<el-button type="primary" class="login-content-submit rounded-lg" v-waves @click="handleVerify" :loading="loading">
				<span class="tracking-wide font-semibold">{{ $t('password.accountBtnText') }}</span>
			</el-button>
		</el-form-item>

		<div class="relative flex items-center justify-between">
			<div class="text-sm ml-auto">
				<!-- <a href="#" class="text-primary hover:text-blue-600" @click="emit('change',LoginTypeEnum.MOBILE)">
          验证码登录
        </a> -->
				<a href="#" v-if="autoRegisterEnable" class="ml-2 text-primary hover:text-blue-600" @click="emit('change', LoginTypeEnum.REGISTER)">
					注册账号
				</a>
			</div>
		</div>
		<el-button class="login-content-submit rounded-lg" v-waves @click="handleAccessDeveloper" v-if="currentTenantId == 1857000132515905537">
			<span class="tracking-wide font-semibold">还不是开发者？立即接入</span>
		</el-button>
		<div class="font12 mt30 login-animation4 login-msg">{{ $t('browserMsgText') }}</div>
	</el-form>
	<Verify
		@success="verifySuccess"
		:mode="'pop'"
		:captchaType="'blockPuzzle'"
		v-if="verifyEnable"
		:imgSize="{ width: '330px', height: '155px' }"
		ref="verifyref"
	/>
	<el-dialog v-model="dialogVisible" title="请留下您的联系方式" width="500" :before-close="handleClose">
		<el-form
			class="login-content-form"
			ref="accessDeveloperFormRef"
			:rules="accessDeveloperFormRules"
			:model="accessDeveloperForm"
			label-width="auto"
		>
			<el-form-item label="姓名：" prop="name">
				<el-input v-model="accessDeveloperForm.name" style="width: 240px" placeholder="请输入您的姓名" clearable />
			</el-form-item>
			<el-form-item label="联系电话：" prop="contactPhone">
				<el-input v-model="accessDeveloperForm.contactPhone" style="width: 240px" placeholder="请输入您的联系电话" clearable />
			</el-form-item>
			<el-form-item label="企业名称：" prop="enterpriseName">
				<el-input v-model="accessDeveloperForm.enterpriseName" style="width: 240px" placeholder="请输入您的企业名称" clearable />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="submitForm(accessDeveloperFormRef)">提交</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="password">
import { defineAsyncComponent, reactive, ref } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import { useI18n } from 'vue-i18n';
import { generateUUID } from '/@/utils/other';
import { LoginErrorEnum, LoginTypeEnum } from '/@/api/login';
import { accessDeveloperInfo } from '/@/api/openPlatform/contact';
import type { FormInstance } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
// 使用国际化插件
const { t } = useI18n();

// 动态加载滑块验证码组件
const Verify = defineAsyncComponent(() => import('/@/components/Verifition/Verify.vue'));

// 获取当前租户
const currentTenantId = import.meta.env.VITE_TENANT_ID;

// 定义变量内容
const autoRegisterEnable = ref(import.meta.env.VITE_REGISTER_ENABLE === 'true');
const emit = defineEmits(['signInSuccess', 'change']); // 声明事件名称
const loginFormRef = ref(); // 定义LoginForm表单引用
const loading = ref(false); // 定义是否正在登录中
const state = reactive({
	isShowPassword: false, // 是否显示密码
	ruleForm: {
		// 表单数据
		username: '', // 用户名
		password: '', // 密码
		code: '', // 验证码
		randomStr: 'blockPuzzle', // 验证码随机数
	},
});

const loginRules = reactive({
	username: [{ required: true, trigger: 'blur', message: t('password.accountPlaceholder1') }], // 用户名校验规则
	password: [{ required: true, trigger: 'blur', message: t('password.accountPlaceholder2') }], // 密码校验规则
});

const verifyref = ref<InstanceType<typeof Verify>>(null); // 定义verify组件引用
// 是否开启验证码
const verifyEnable = ref(import.meta.env.VITE_VERIFY_ENABLE === 'true');
const verifyImageEnable = ref(import.meta.env.VITE_VERIFY_IMAGE_ENABLE === 'true');
const imgSrc = ref('');

const accessDeveloperFormRef = ref();
const dialogVisible = ref(false);
const accessDeveloperForm = reactive({
	name: '',
	contactPhone: '',
	enterpriseName: '',
});
const accessDeveloperFormRules = reactive({
	name: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
	contactPhone: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
	enterpriseName: [{ required: true, trigger: 'blur', message: '请输入企业名称' }],
});

// 调用图形证码进行校验
const getVerifyImageCode = () => {
	state.ruleForm.randomStr = generateUUID();
	imgSrc.value = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : '/auth'}/code/image?randomStr=${
		state.ruleForm.randomStr
	}`;
};

// 调用滑块验证码进行校验
const handleVerify = async () => {
	const valid = await loginFormRef.value.validate().catch(() => {}); // 表单校验

	if (valid && verifyEnable.value) {
		verifyref.value.show(); // 显示验证组件
	} else if (valid) {
		onSignIn(); // 调用登录方法
	}
};

// 滑块验证码校验成功调用后台登录接口
const verifySuccess = (params: any) => {
	state.ruleForm.code = params.captchaVerification; // 获取验证码
	onSignIn(); // 调用登录方法
};

// 申请接入开发者
const handleAccessDeveloper = () => {
	dialogVisible.value = true;
};

const handleClose = () => {
	accessDeveloperFormRef.value.resetFields();
	dialogVisible.value = false;
};

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			accessDeveloperInfo(accessDeveloperForm)
				.then((res) => {
					if (res.code === 0) {
						ElMessageBox.confirm(
							'<div> <div style="font-size:16px;font-weight:600;margin-bottom: 10px;">尊敬的用户，您好！</div> <div style="font-size:16px;margin-bottom: 10px;">您的接入需求我们已经收到，我们会安排专属顾问与您联系，请保持电话畅通。</div> <div style="font-size:16px;">感谢您的支持！</div> </div>',
							'恭喜您已提交成功',
							{
								confirmButtonText: '确定',
								dangerouslyUseHTMLString: true,
								showCancelButton: false,
							}
						).then(() => {
							handleClose();
						});
					} else {
						ElMessage({
							type: 'error',
							message: res.msg,
						});
					}
				})
				.catch((err) => {
					console.log('err', err);
				});
		} else {
			console.log('error submit!', fields);
		}
	});
};

// 账号密码登录
const onSignIn = async () => {
	loading.value = true; // 正在登录中
	try {
		await useUserInfo().login(state.ruleForm); // 调用登录方法
		emit('signInSuccess'); // 触发事件
	} catch (err: any) {
		if (err?.data === LoginErrorEnum.CREDENTIALS_EXPIRED) {
			emit('change', LoginTypeEnum.EXPIRE, state.ruleForm.username); // 触发修改密码
		}
	} finally {
		loading.value = false; // 登录结束
		if (verifyImageEnable.value) {
			getVerifyImageCode();
		}
	}
};

onMounted(() => {
	// console.log('currentTenantId', currentTenantId);
	if (verifyImageEnable.value) {
		getVerifyImageCode();
	}
});
</script>
<style lang="scss">
.access-developer {
	font-size: 18px;
	font-weight: bold;
	color: #165dff;
	span {
		cursor: pointer;
	}
}
</style>
