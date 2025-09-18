<template>
	<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="800" :close-on-click-modal="false" :show-close="false">
		<div class="py-2 bg-white rounded">
			<div class="flex flex-row">
				<div class="flex justify-start items-center" style="width: 150px">
					<div class="relative avatar">
						<el-avatar :size="84" :src="dataForm.avatar"> </el-avatar>
						<el-upload
							action="#"
							:show-file-list="false"
							:http-request="handleTableImageUpload"
							accept="image/jpeg,image/png,image/gif,image/jpg"
							:before-upload="beforeUpload"
							:disabled="!!scopeId"
						>
							<div class="upload_icon">
								<el-icon color="#165DFF"><Camera /></el-icon>
							</div>
						</el-upload>
					</div>
				</div>
				<div class="flex-1 px-2">
					<el-form ref="formRef" :disabled="!!scopeId" :model="dataForm" :rules="dataRules" label-width="120px">
						<el-form-item label="用户ID:" prop="unionId" v-if="!isAdd">
							<span class="ml-2 text-slate-700">{{ dataForm.unionId }}</span>
						</el-form-item>
						<el-form-item label="手机号:" prop="mobile">
							<el-input placeholder="请输入手机号" maxlength="11" show-word-limit v-model="dataForm.mobile" clearable class="customWidth"></el-input>
						</el-form-item>
						<el-form-item label="姓名:" prop="name">
							<el-input placeholder="请输入姓名" maxlength="10" show-word-limit v-model="dataForm.name" clearable class="customWidth"></el-input>
						</el-form-item>
						<el-form-item label="登录密码:" prop="password" v-if="isAdd">
							<el-input
								placeholder="请输入登录密码"
								type="text"
								maxlength="20"
								v-model="dataForm.password"
								clearble
								class="customWidth"
								show-word-limit
							>
							</el-input>
						</el-form-item>
						<el-form-item label="授权子系统数:" v-if="!isAdd">
							<span>{{ authorizationList.length }}</span>
						</el-form-item>
						<el-form-item label="授权子系统名称:" v-if="!isAdd">
							<span>{{ authorizationList.join('，') }}</span>
						</el-form-item>
						<el-form-item label="最近登录:" prop="lastLoginTime" v-if="!isAdd">
							<span class="ml-2 text-slate-700">{{ dataForm.lastLoginTime }}</span>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<template #footer>
			<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
			<el-button type="primary" size="default" v-if="!scopeId" @click="onSubmit(formRef)">提交</el-button>
			<el-button type="primary" size="default" v-if="scopeId" @click="cancel(formRef)">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="portal-account-form" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useRouter, useRoute } from 'vue-router';
import { type UploadRequestOptions, type UploadProps, ElMessage } from 'element-plus';
import { uploadImage } from '/@/api/culture/common';
import { ChannelObj, DataForm, permissionType } from './types';
import { addSysPermission, createAccount, delSysPermission, getAccountDetails, sysConfigList, updateAccount } from '/@/api/portal';
import type { FormInstance, FormRules } from 'element-plus';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const scopeId = ref<string | null>('');
const dialogTitle = ref('新增账号');
const formRef = ref();

// 是否是新增
const isAdd = ref<boolean>(true);

const dataFormRef = ref();
const loading = ref(false);
const permissionList = ref<permissionType[]>([]);
const authorizationList = ref([]);
// 页面对应元数据
const dataForm = ref<DataForm>({
	avatar: '',
	mobile: '',
	name: '',
	password: '',
	unionId: '',
	lastLoginTime: '',
	channelCodes: [],
});

const channelArr = ref<ChannelObj[]>([]);
const getChannelList = async (id: string) => {
	const params = {
		unionId: id,
	};
	const res = await sysConfigList(params);
	channelArr.value = res.data;
};
const getDetail = async (unionId: string) => {
	try {
		loading.value = true;
		const res = await getAccountDetails({ unionId });
		const obj = res.data;
		dataForm.value.avatar = obj.avatar;
		dataForm.value.mobile = obj.mobile;
		dataForm.value.name = obj.name;
		dataForm.value.unionId = obj.unionId;
		dataForm.value.lastLoginTime = obj.lastLoginTime;
		permissionList.value = obj?.channelSubSystems.map((item: permissionType) => {
			return {
				...item,
				isEdit: false,
				name: item.isAdmin ? '【管理员】' + item.name : item.name,
			};
		});
		authorizationList.value = obj?.channelSubSystems.map((item: permissionType) => item.name);
		console.log('authorizationList', authorizationList);
	} finally {
		loading.value = false;
	}
};
// 上传图片前检查上传图片大小，最多允许上传1M图片
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
	const imgSize = file.size / 1024 / 1024 < 1;
	if (!imgSize) {
		useMessage().error('头像只允许上传1M以内的照片');
	}
	return imgSize;
};

// 上传图片
const handleTableImageUpload = async (options: UploadRequestOptions) => {
	let formData = new FormData();
	formData.append('file', options.file);
	formData.append('dir', 'unified-sign-on');
	try {
		const { data } = await uploadImage(formData);
		const baseURL = import.meta.env.VITE_DOCUMENT_FILE_URL;
		useMessage().success('图片上传成功');
		dataForm.value.avatar = data.url.includes('http') ? data.url : baseURL + data.url;
	} catch (error: any) {
		useMessage().error(error.msg);
		options.onError(error);
	}
};

const validatLength = (rule: any, value: any, callback: any) => {
	const reg = /^\d{11}$/;
	if (!reg.test(value)) {
		callback(new Error('必须是数字'));
	} else {
		callback();
	}
};

// 定义校验规则
const dataRules = ref<FormRules>({
	mobile: [
		{ required: true, message: '手机号不能为空', trigger: 'change' },
		{ validator: validatLength, trigger: ['blur', 'change'] },
	],
	name: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
	password: [
		{
			required: true,
			min: 12,
			max: 20,
			message: '用户密码长度必须介于 12 和 20 之间',
			trigger: 'blur',
		},
	],
});

const openDialog = async (id?: string) => {
	scopeId.value = id ?? null;
	if (id) {
		dialogTitle.value = '账号详情';
		try {
			isAdd.value = false;
			getDetail(id as string);
		} catch (err: any) {
			useMessage().error(err);
		}
	} else {
		dialogTitle.value = '新增账号';
		getChannelList(id as string);
		isAdd.value = true;
	}
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	dataForm.value = {
		avatar: '',
		mobile: '',
		password: '',
		name: '',
		unionId: '',
		lastLoginTime: '',
		channelCodes: [],
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

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否提交账号信息？`, '提交');
			} catch {
				return false;
			}

			try {
				loading.value = true;
				const params = {
					unionId: dataForm.value.unionId,
					mobile: dataForm.value.mobile,
					password: dataForm.value.password,
					name: dataForm.value.name,
					avatar: dataForm.value.avatar,
				};
				const { code, msg, data } = await createAccount(params);
				if (code === 0) {
					useMessage().success('新增成功');
					dataForm.value.unionId = data;
					getChannelList(data);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			} finally {
				loading.value = false;
			}
		} else {
			return false;
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.layout-form {
	background: #fff;
	padding: 15px 200px;
	// height: calc(100vh - 50px);
}
.permission_content {
	padding: 0 20px;
	.list {
		border: 1px solid #e5e5e5;
		padding: 10px;
		border-radius: 4px;
		background: #f2f4f8;
	}
}
.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;
	&::before {
		content: '';
		width: 8px;
		height: 20px;
		border-radius: 2px;
		background-color: #165dff;
		position: absolute;
		left: 0;
	}
}
.el_edit {
	left: 91%;
}
.avatar {
	margin-left: 25px;
	margin-top: 8px;
	margin-bottom: 25px;
	height: 84px;
	width: 84px;
}
.upload_icon {
	position: absolute;
	width: 24px;
	height: 24px;
	left: 62px;
	top: 62px;
	border-radius: 100px;
	border: 2px solid #ffffff;
	background-color: #e8f3ff;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
.customWidth {
	width: 50%;
}
</style>
