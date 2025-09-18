<template>
	<el-drawer v-model="visible" :title="$t('personal.name')" size="40%">
		<el-form :model="formData" :rules="ruleForm" label-width="100px" class="mt30" ref="formdataRef">
			<el-form-item label="头像" prop="avatar">
				<ImageUpload v-model:imageUrl="formData.avatar" borderRadius="50%">
					<template #empty>
						<el-icon><Avatar /></el-icon>
						<span>请上传头像</span>
					</template>
				</ImageUpload>
			</el-form-item>
			<el-form-item label="账号ID" prop="userId">
				<el-input v-model="formData.userId" clearable disabled></el-input>
			</el-form-item>
			<el-form-item label="昵称" prop="nickname">
				<el-input v-model="formData.nickname" placeholder="请输入昵称" maxlength="10" clearable></el-input>
			</el-form-item>
			<el-form-item label="手机" prop="phone">
				<el-input v-model="formData.phone" placeholder="请输入手机" maxlength="11" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit(formdataRef)"> 更新个人信息 </el-button>
			</el-form-item>
		</el-form>
	</el-drawer>
</template>

<script setup lang="ts" name="cultural-personal">
import { useUserInfo } from '/@/stores/userInfo';
import { editInfo, getObj } from '/@/api/admin/user';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { FormInstance } from 'element-plus';
import { culturalPersonalCheck } from '/@/api/culture/systemMange';
const ImageUpload = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));
const visible = ref(false);

// 定义变量内容
const formData = ref({
	avatar: '',
	userId: '',
	nickname: '',
	name: '',
	phone: '' as string | null,
});

const formdataRef = ref();

const ruleForm = reactive({
	phone: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
	nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
});

const open = () => {
	visible.value = true;
	const data = useUserInfo().userInfos;
	initUserInfo(data.user.userId);
};
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否更新个人信息`, '确认更新');
			} catch {
				return false;
			}
			let phone: string | null = '';
			if (formData.value.phone && formData.value.phone.includes('*')) {
				phone = null;
			} else {
				phone = formData.value.phone;
			}
			const params = {
				nickname: formData.value.nickname,
				phone: phone,
				avatar: formData.value.avatar,
			};
			try {
				const { code, msg } = await culturalPersonalCheck(params);
				if (code === 0) {
					const formDataParams = Object.assign({}, formData.value, { phone });
					const { code, msg } = await editInfo(formDataParams);
					if (code === 0) {
						useMessage().success('更新成功');
						useUserInfo().setUserInfos();
					} else {
						useMessage().error(msg);
					}
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

const loading = ref(false);
const initUserInfo = (userId: any) => {
	loading.value = true;
	getObj(userId)
		.then((res) => {
			formData.value = res.data;
		})
		.catch((err) => {
			useMessage().error(err.msg);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({
	open,
});
</script>
<style lang="scss" scoped>
.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}

.avatar {
	width: 178px;
	height: 100%;
}
</style>
