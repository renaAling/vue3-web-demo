<template>
	<div class="layout-padding">
		<div class="container">
			<div class="nav">
				<div class="m-4 nav-title">个人资料</div>
				<el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
					<el-menu-item index="1">
						<el-icon><icon-menu /></el-icon>
						<span>基本信息</span>
					</el-menu-item>
					<el-menu-item index="2">
						<el-icon><icon-menu /></el-icon>
						<span>修改密码</span>
					</el-menu-item>
				</el-menu>
			</div>
			<div class="content">
				<div v-if="isEdit" class="tab">
					<el-form :model="formData" :rules="ruleForm" label-width="100px" class="mt30" ref="formdataRef1">
						<el-row :gutter="20">
							<el-col :span="24" class="mb20">
								<el-form-item prop="avatar">
									<div class="avatar_box">
										<ImageUpload v-model:imageUrl="formData.avatar" borderRadius="50%" class="avatar">
											<template #empty>
												<el-icon>
													<Avatar />
												</el-icon>
												<span>请上传头像</span>
											</template>
										</ImageUpload>
										<el-button type="primary" link @click="setDefaultAvatar"> 恢复默认头像</el-button>
									</div>
								</el-form-item>
							</el-col>
							<el-col :span="24" class="mb20">
								<el-form-item label="用户ID" prop="unionId">
									<el-input v-model="formData.unionId" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24" class="mb20">
								<el-form-item label="姓名" prop="name">
									<el-input v-model="formData.name" placeholder="请输入姓名" clearable disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24" class="mb20">
								<el-form-item label="个人简介" prop="personalProfile">
									<el-input v-model="formData.personalProfile" :rows="2" type="textarea" placeholder="请输入个人简介" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24" class="mb20">
								<el-form-item label="联系电话" prop="phone">
									<el-input v-model="formData.phone" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24" class="mb20">
								<el-form-item label="住址" prop="address">
									<el-input v-model="formData.address" clearable placeholder="请输入住址"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div class="flex justify-center">
						<el-button type="info" @click="cancel(formdataRef1)">取消</el-button>
						<el-button type="primary" @click="updateInfo(formdataRef1)">保存修改</el-button>
					</div>
				</div>
				<div v-if="!isEdit" class="tab">
					<el-form :model="formData" :rules="passwordRuleForm" label-width="100px" class="mt30" ref="formdataRef2">
						<el-row :gutter="20">
							<el-col :span="24" class="mb20">
								<el-form-item label="原密码" prop="password">
									<el-input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" clearable>
										<template #suffix>
											<i
												class="iconfont el-input__icon login-content-password"
												:class="showPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
												@click="showPassword = !showPassword"
											>
											</i>
										</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24" class="mb20">
								<el-form-item label="新密码" prop="newpassword1">
									<strength-meter
										v-model="formData.newpassword1"
										:minlength="8"
										placeholder="请输入新密码，密码必须至少8位，包含大小写字母、数字和特殊字符"
										@score="passwordScore"
									></strength-meter>
								</el-form-item>
							</el-col>
							<el-col :span="24" class="mb20">
								<el-form-item label="确认密码" prop="newpassword2">
									<strength-meter v-model="formData.newpassword2" :minlength="8" placeholder="请重复密码"></strength-meter>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<div class="flex justify-center">
						<el-button type="info" @click="cancel(formdataRef2)">取消</el-button>
						<el-button type="primary" @click="updatePassword(formdataRef2)">确认</el-button>
					</div>
				</div>
				<!-- <edit v-if="isEdit" ref="editRef" />
				<detail v-if="!isEdit" ref="detailRef" /> -->
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" name="personal-index">
import { useUserInfo } from '/@/stores/userInfo';
import { editInfo, password } from '/@/api/admin/user';
import { getUserInfo } from '/@/api/login/index';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { FormInstance } from 'element-plus';
import router from '/@/router';
import { Session } from '/@/utils/storage';
import { validatePassword } from '/@/utils/toolsValidate';

const edit = defineAsyncComponent(() => import('./edit.vue'));
const detail = defineAsyncComponent(() => import('./detail.vue'));
const editRef = ref<any>();
const detailRef = ref<any>();
const isEdit = ref(true);

const ImageUpload = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

const isFromLogin = ref(false);

const activeName = ref('first');
// 定义变量内容
const formData = ref({
	avatar: '',
	unionId: '',
	name: '',
	username: '',
	phone: '',
	userId: '',
	newpassword2: '',
	newpassword1: '',
	password: '',
	address: '',
	personalProfile: '',
});

const showPassword = ref(false);

const formdataRef1 = ref();
const formdataRef2 = ref();

const ruleForm = reactive({
	name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
});
const validatorPassword2 = (rule: any, value: any, callback: any) => {
	if (value !== formData.value.newpassword1) {
		callback(new Error('两次输入密码不一致'));
	} else {
		callback();
	}
};
const validatorPassword1 = (rule: any, value: any, callback: any) => {
	if (!value) {
		callback(new Error('请输入密码'));
	} else if (value === formData.value.password) {
		callback(new Error('新旧密码不能一致'));
	} else {
		callback();
	}
};
const passwordRuleForm = reactive({
	password: [[{ required: true, message: '原密码不能为空', trigger: 'blur' }]],
	newpassword1: [
		{ validator: validatePassword, trigger: 'blur' },
		{ validator: validatorPassword1, trigger: 'blur' },
	],
	newpassword2: [{ validator: validatorPassword2, trigger: 'blur' }],
});

const score = ref(0);

const setDefaultAvatar = () => {
	formData.value.avatar = 'https://gdsh-oss.duomixing.com:9086/rls/b/portal/default_avatar.png';
};
const passwordScore = (e: any) => {
	score.value = e;
};
const cancel = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	router.go(-1);
};
const updateInfo = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid: any) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否更新个人信息`, '确认更新');
			} catch {
				return false;
			}
			try {
				const { name, avatar, username, personalProfile, address } = formData.value;
				const params = {
					name,
					avatar,
					username,
					personalProfile,
					address,
				};
				const { code, msg } = await editInfo(params);
				if (code === 0) {
					useMessage().success('更新成功');
					useUserInfo().setUserInfos();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		}
	});
};
const updatePassword = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid: any) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否修改密码`, '修改密码');
			} catch {
				return false;
			}
			try {
				const { newpassword1 } = formData.value;
				const params = {
					password: formData.value.password,
					newpassword1,
				};
				const { code, msg } = await password(params);
				if (code === 0) {
					useMessage().success('修改成功');
					Session.clear();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		}
	});
};
const loading = ref(false);
const initUserInfo = () => {
	loading.value = true;
	getUserInfo()
		.then((res) => {
			formData.value.avatar = res.data.sysUser.avatar ?? 'https://gdsh-oss.duomixing.com:9086/rls/b/portal/default_avatar.png';
			formData.value.unionId = res.data.unionId;
			formData.value.phone = res.data.sysUser.phone;
			formData.value.name = res.data.sysUser.name;
			formData.value.username = res.data.sysUser.username;
			formData.value.password = '';
			formData.value.personalProfile = res.data.sysUser.personalProfile;
			formData.value.address = res.data.sysUser.address;
		})
		.catch((err) => {
			useMessage().error(err.msg);
		})
		.finally(() => {
			loading.value = false;
		});
};
onMounted(async () => {
	const navigationState = router.options.history.state as any;
	if (navigationState.back?.includes('/login')) {
		isFromLogin.value = true;
		activeName.value = 'second';
	}
	initUserInfo();
});

const handleSelect = (key: string, keyPath: string[]) => {
	console.log('handleSelect', key, keyPath);
	if (key == '1') {
		isEdit.value = true;
	} else {
		isEdit.value = false;
	}
};
</script>
<style lang="scss" scoped>
.container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px;
	height: 100%;
}
.nav {
	width: 20%;
	background-color: #fff;
	border-radius: 16px;
	height: 100%;
	margin-right: 10px;
	box-sizing: border-box;
}
.content {
	width: 80%;
	background-color: #fff;
	border-radius: 16px;
	height: 100%;
}
.nav-title {
	font-size: 28px;
	color: #333;
}
.tab {
	width: 60%;
	margin: auto;
	// margin-right: 30px;
}
::v-deep.el-menu-item,
.el-sub-menu__title {
	color: #666 !important;
}

::v-deep.el-menu-hover-bg-color,
.el-menu-item.is-active,
.el-sub-menu.is-active .el-sub-menu__title,
.el-sub-menu:not(.is-opened):hover .el-sub-menu__title,
.el-menu-item:hover {
	background-color: #ecf5ff !important;
	margin: 0 20px !important;
}
::v-deep.el-menu-hover-color,
.el-menu-item:hover,
.el-menu-item.is-active,
.el-sub-menu.is-active {
	color: #409eff !important;
	font-weight: 500 !important;
}

.portal-personal {
	padding: 16px;
	.personal-content {
		margin: 32px auto;
		width: 800px;
		height: 700px;
		background: #ffffff;
		box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
		border-radius: 12px 12px 12px 12px;
		.center-header {
			padding: 24px 24px 16px;
			font-size: 24px;
			color: #333333;
		}
		.tabs {
			margin: 0 24px 24px;
		}
	}
}
.avatar_box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	.el-button {
		margin-left: -46px;
	}
}
:deep(.avatar) {
	height: 200px;
	width: 200px;
}
</style>
