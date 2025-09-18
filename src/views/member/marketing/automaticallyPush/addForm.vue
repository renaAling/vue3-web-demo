<template>
	<el-dialog :close-on-click-modal="false" title="新增" width="800" draggable v-model="visible">
		<div>
			<el-form :model="form" label-width="100px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
				<el-form-item label="规则文档" prop="file">
					<el-upload
						v-model:file-list="contractUrls"
						class="upload-box"
						drag
						:headers="headers"
						:action="baseURL + other.adaptationUrl('/admin/sys-file/uploadC')"
						:before-upload="beforeUploadContract"
						:on-exceed="handleExceed"
						:on-progress="handleProgress"
						:on-success="handleSuccess"
						:limit="1"
						style="width: 100%"
					>
						<div class="uploader-text">
							<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
							<span>点击或拖拽文件上传规则文档</span>
						</div>
						<template #tip>
							<!-- <div class="el-upload__tip">支持PDF档案，大小不超过50M，最多上传1个文件</div> -->
							<div class="el-upload__tip">温习提示:请上传规则文档，提交后由平台运营配置</div>
						</template>
					</el-upload>
				</el-form-item>
				<!-- <div>温习提示:请上传规则文档，提交后由平台运营配置</div> -->
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { postMemberMarketingPushLogAdd } from '/@/api/member/marketing/marketing';
import { Session } from '/@/utils/storage';
import type { UploadProps } from 'element-plus';
import { ElNotification } from 'element-plus';
import other from '/@/utils/other';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref<any>();
const visible = ref(false);
const loading = ref(false);
const isAdd = ref(true);
const contractUrls = ref<any[]>([]);
// 提交表单数据
const form = reactive({
	file: '',
});

// 定义校验规则
const dataRules = ref({
	file: [{ required: true, message: '规则文档不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row?: any) => {
	console.log('row', row);
	visible.value = true;
	isAdd.value = true;
	// form.unionId = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		if (row) {
			isAdd.value = false;
			Object.assign(form, row);
		}
	});
};
// 关闭弹窗
const resetForm = () => {
	dataFormRef.value.resetFields();
	form.file = '';
	contractUrls.value = [];
	visible.value = false;
	// useMessage().error('充值失败');
};

// 提交
const onSubmit = async () => {
	console.log('contractUrls.value', contractUrls.value);
	if (contractUrls.value[0].response.code == 0) {
		form.file = contractUrls.value[0].response.data.url;
	}
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	useMessage().success('添加成功');
	resetForm();
	// try {
	// 	loading.value = true;
	// 	const { code, data, msg } = await postMemberMarketingPushLogAdd(form);
	// 	if (code === 0) {
	// 		console.log('aaa', data);
	// 		useMessage().success('添加成功');
	// 		dataFormRef.value.resetFields();
	// 		visible.value = false;
	// 		emit('refresh');
	// 	} else {
	// 		useMessage().error(msg);
	// 	}
	// } catch (err: any) {
	// 	useMessage().error(err.msg);
	// } finally {
	// 	loading.value = false;
	// }
};

// 请求头处理
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});
const handleExceed: UploadProps['onExceed'] = (uploadFile) => {
	console.log('uploadFile', uploadFile);
	useMessage().error('上传规则文档最多1个文件！');
	loading.value = false;
};
const beforeUploadContract: UploadProps['beforeUpload'] = (file) => {
	// console.log('beforeUpload', file);
	// const fileType = ['application/pdf'];
	// const imgSize = file.size / 1024 / 1024 < 50;
	// const imgType = fileType.includes(file.type);
	// if (!imgType) {
	// 	setTimeout(() => {
	// 		ElNotification({
	// 			title: '温馨提示',
	// 			message: '上传文件不符合所需的格式！',
	// 			type: 'warning',
	// 		});
	// 	}, 0);
	// }
	// if (!imgSize) {
	// 	useMessage().error('上传附件大小不能超过50M！');
	// }
	// loading.value = false;
	// return imgType && imgSize;
	const imgSize = file.size / 1024 / 1024 < 50;
	if (!imgSize) {
		useMessage().error('上传附件大小不能超过50M！');
	}
	loading.value = false;
	return imgSize;
};
const handleProgress = (event: any, file: any) => {
	loading.value = true;
};
const handleSuccess = (res: any, file: any) => {
	loading.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
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
