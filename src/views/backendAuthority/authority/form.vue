<template>
	<div class="layout-padding" v-loading="loading">
		<div class="py-2 bg-white rounded border-inherit border border-solid">
			<div class="content-title">
				账号信息
				<el-icon color="#409efc" class="cursor-pointer absolute el_edit" v-if="!isAdd" @click="edit('base')">
					<EditPen />
				</el-icon>
			</div>
			<div class="flex flex-row">
				<div class="flex justify-start items-center" style="width: 150px">
					<div class="relative avatar">
						<el-avatar :size="84" :src="dataForm.avatar"> </el-avatar>
						<el-upload
							action="#"
							v-if="typeEdit.isBase || isAdd"
							:show-file-list="false"
							:http-request="handleTableImageUpload"
							accept="image/jpeg,image/png,image/gif,image/jpg"
							:before-upload="beforeUpload"
						>
							<div class="upload_icon">
								<el-icon color="#165DFF"><Camera /></el-icon>
							</div>
						</el-upload>
					</div>
				</div>
				<div class="flex-1 px-2">
					<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="86">
						<el-row :gutter="20" v-if="isAdd">
							<el-col :span="10" class="mb20">
								<el-form-item label="手机号:" prop="mobile">
									<el-input placeholder="请输入手机号" maxlength="11" v-model="dataForm.mobile" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<div class="text-primary text-sm cursor-pointer block pt-2" @click="checkPhone">检查账号</div>
							</el-col>
							<el-col :span="10" class="mb20">
								<el-form-item label="姓名:" prop="name">
									<el-input placeholder="请输入姓名" maxlength="10" v-model="dataForm.name" clearable></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<template v-else>
							<el-row :gutter="20">
								<el-col :span="12" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">UID:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.unionId }}</span>
									</div>
								</el-col>
								<el-col :span="12" class="mb20">
									<template v-if="typeEdit.isBase">
										<el-form-item label="手机号:" prop="mobile">
											<el-input placeholder="请输入手机号" maxlength="11" v-model="dataForm.mobile" clearable></el-input>
										</el-form-item>
									</template>
									<template v-else>
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">手机号:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.mobile }}</span>
										</div>
									</template>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12" class="mb20">
									<template v-if="typeEdit.isBase">
										<el-form-item label="姓名:" prop="name">
											<el-input placeholder="请输入姓名" maxlength="10" v-model="dataForm.name" clearable></el-input>
										</el-form-item>
									</template>
									<template v-else>
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">姓名:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.name }}</span>
										</div>
									</template>
								</el-col>
								<el-col :span="12" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">最近登录:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.lastLoginTime }}</span>
									</div>
								</el-col>
							</el-row>
						</template>
					</el-form>
				</div>
			</div>
		</div>
		<div class="py-2 bg-white mt-2 rounded border-inherit border border-solid">
			<div class="content-title">
				系统权限
				<el-icon color="#409efc" class="cursor-pointer absolute el_edit" v-if="!isAdd" @click="edit('authority')">
					<EditPen />
				</el-icon>
			</div>
			<div class="mt-2 flex flex-row py-2 px-4">
				<el-checkbox-group v-model="dataForm.channelCodes" v-if="typeEdit.isAuthority">
					<el-checkbox class="basis-1/5" v-for="item in queryForm.channelArr" :key="item.channelCode" :label="item.channelCode">
						{{ item.platformName }}
					</el-checkbox>
				</el-checkbox-group>
				<template v-else>
					<div class="basis-1/6 py-2" v-for="item in channelArr" :key="item.channelCode">
						{{ item.platformName }}
					</div>
				</template>
			</div>
		</div>
		<div class="mt-4 content-center w-full text-center" v-if="typeEdit.isBase || typeEdit.isAuthority">
			<el-button type="primary" @click="onSubmit">保存</el-button>
			<el-button @click="cancel">取消</el-button>
		</div>
	</div>
</template>

<script lang="ts" name="backendAuthority" setup>
import { userChannelList, createAuthorty, pageList, getAuthortyDetail, putAuthorty } from '/@/api/authority';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import type { UploadRequestOptions, UploadProps } from 'element-plus';
import { uploadImage } from '/@/api/culture/common';
const router = useRouter();
const route = useRoute();
// 编辑
interface TypeEdit {
	isBase: boolean; // 基础信息是否编辑
	isAuthority: boolean; // 权限信息是否编辑
}
const typeEdit = reactive<TypeEdit>({
	isBase: true,
	isAuthority: true,
});

// 是否是新增
const isAdd = ref<boolean>(true);

const dataFormRef = ref();
const loading = ref(false);
interface DeptObj {
	deptCode: string;
	deptName: string;
	childNode: any[];
}
interface ChannelObj {
	channelCode: string;
	platformName: string;
}
interface QueryForm {
	deptArr: DeptObj[];
	channelArr: ChannelObj[];
}
interface DataForm {
	avatar: string;
	mobile: string;
	name: string;
	unionId?: string;
	lastLoginTime?: string;
	channelCodes: string[];
}
// 页面对应元数据
const dataForm = reactive<DataForm>({
	avatar: '',
	mobile: '',
	name: '',
	unionId: '',
	lastLoginTime: '',
	// deptCode: '',
	channelCodes: [],
});

// 组织可选列表
const queryForm = reactive<QueryForm>({
	deptArr: [],
	channelArr: [],
});

const channelArr = ref<ChannelObj[]>([]);
const getChannelList = async (id: string) => {
	const params = {
		unionId: id,
	};
	const res = await userChannelList(params);
	queryForm.channelArr = res.data;
};
const getDetail = async (id: string) => {
	try {
		loading.value = true;
		const res = await getAuthortyDetail(id);
		// eslint-disable-next-line no-console
		const obj = res.data;
		dataForm.avatar = obj.avatar;
		dataForm.mobile = obj.mobile;
		dataForm.name = obj.name;
		dataForm.unionId = obj.unionId;
		dataForm.lastLoginTime = obj.lastLoginTime;
		for (let item of obj.channelSubSystems) {
			dataForm.channelCodes.push(item.channelCode as string);
		}
		channelArr.value = obj.channelSubSystems;
	} finally {
		loading.value = false;
	}
};
if (route.query.id) {
	isAdd.value = false;
	typeEdit.isBase = false;
	typeEdit.isAuthority = false;
	getDetail(route.query.id as string);
	getChannelList(route.query.id as string);
} else {
	isAdd.value = true;
	typeEdit.isBase = true;
	typeEdit.isAuthority = true;
}
const edit = (type: string) => {
	if (type === 'base') {
		typeEdit.isBase = true;
	}
	if (type === 'authority') {
		typeEdit.isAuthority = true;
	}
};
dataFormRef.value?.resetFields();

const { t } = useI18n();

// const getDeptList =  async () => {
// 	const res = await deptList();
// 	queryForm.deptArr = res.data
// }
// getDeptList()

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
		useMessage().success(t('图片上传成功'));
		dataForm.avatar = data.url.includes('http') ? data.url : baseURL + data.url;
	} catch (error: any) {
		useMessage().error(error.msg);
		options.onError(error);
	}
};

// 检查手机号是否已存在
const checkPhone = async () => {
	const reg = /^\d{11}$/;
	if (!reg.test(dataForm.mobile)) {
		useMessage().error('请先输入11位正确的手机号');
		return false;
	}
	const params = {
		current: 1,
		size: 10,
		descs: 'create_time',
		mobile: dataForm.mobile,
		unionId: '',
		name: '',
		deptCode: '',
		channelCode: '',
	};
	try {
		loading.value = true;
		const res = await pageList(params);
		if (res.data.total > 0) {
			useMessage().error('该账号权限已存在，不可重复添加');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const validatLength = (rule: any, value: any, callback: any) => {
	const reg = /^\d{11}$/;
	if (value.length !== 11) {
		callback(new Error('长度11个字符'));
	} else if (!reg.test(value)) {
		callback(new Error('必须是数字'));
	} else {
		callback();
	}
};

// 定义校验规则
const dataRules = ref({
	mobile: [
		{ required: true, message: '手机号不能为空', trigger: 'change' },
		{ validator: validatLength, trigger: ['blur', 'change'] },
	],
	name: [
		{ required: true, message: '姓名不能为空', trigger: 'change' },
		{ max: 10, message: '长度在 10 个字符内', trigger: 'change' },
	],
	// deptCode: [{ required: true, message: '组织不能为空', trigger: 'change' }]
});
// 返回
const toBack = () => {
	router.push({ path: '/backendAuthority/authority/index' });
};
// 点击取消
const cancel = () => {
	dataFormRef.value?.resetFields();
	toBack();
};

//提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		if (isAdd.value) {
			dataForm.unionId = undefined;
			dataForm.lastLoginTime = undefined;
			createAuthorty(dataForm)
				.then((res) => {
					if (res.ok) {
						useMessage().success(t('common.addSuccessText'));
						toBack();
					} else {
						useMessage().error(res.msg);
					}
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		} else {
			dataForm.lastLoginTime = undefined;
			putAuthorty(dataForm)
				.then((res) => {
					if (res.ok) {
						useMessage().success(t('common.editSuccessText'));
						toBack();
					} else {
						useMessage().error(res.msg);
					}
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>
<style lang="scss" scoped>
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
</style>
