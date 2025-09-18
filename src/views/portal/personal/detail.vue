<template>
	<div class="portal-personal">
		<el-form :model="formData" label-width="100px" ref="formdataRef">
			<el-form-item>
				<ImageUpload v-model:imageUrl="formData.avatar" borderRadius="50%" class="avatar" disabled>
					<template #empty>
						<el-icon>
							<Avatar />
						</el-icon>
						<span>请上传头像</span>
					</template>
				</ImageUpload>
			</el-form-item>
			<el-form-item label="用户ID" prop="unionId">
				<el-input v-model="formData.unionId" disabled></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="formData.name" disabled></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="phone">
				<el-input v-model="formData.phone" disabled></el-input>
			</el-form-item>
		</el-form>
		<div class="btn">
			<el-button type="primary" @click="toEdit">去修改</el-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="portal-personal">
import { getUserInfo } from '/@/api/login/index';
import { useMessage } from '/@/hooks/message';
import router from '/@/router';
const ImageUpload = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));

// 定义变量内容
const formData = ref({
	avatar: '',
	unionId: '',
	name: '',
	phone: '',
});

const formdataRef = ref();

const loading = ref(false);
const initUserInfo = () => {
	loading.value = true;
	getUserInfo()
		.then((res) => {
			formData.value.avatar = res.data.sysUser.avatar ?? 'https://gdsh-oss.duomixing.com:9086/rls/b/portal/default_avatar.png';
			formData.value.unionId = res.data.unionId;
			formData.value.phone = res.data.sysUser.phone;
			formData.value.name = res.data.sysUser.name;
			console.log('formData', formData.value);
		})
		.catch((err) => {
			useMessage().error(err.msg);
		})
		.finally(() => {
			loading.value = false;
		});
};

const toEdit = () => {
	router.push('/portal/personal/edit');
};

onMounted(async () => {
	await initUserInfo();
});
</script>
<style lang="scss" scoped>
.portal-personal {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 90vh;
	padding: 16px;
	background: #fff;
	.btn {
		margin-top: 32px;
		margin-left: 70px;
	}
}
:deep(.avatar) {
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 200px;
}
</style>
