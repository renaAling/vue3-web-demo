<template>
	<div class="layout-padding">
		<!-- 基础信息 -->
		<section>
			<el-card>
				<el-form ref="formRef" :model="model" :rules="formRules" label-width="auto">
					<el-form-item label="SDK名称：" prop="sdkName" class="custom-width">
						<el-input placeholder="请输入SDK名称" v-model="model.sdkName" clearable style="width: 230px" maxlength="30" show-word-limit />
					</el-form-item>
					<el-form-item label="SDK版本：" prop="sdkVersion" class="custom-width">
						<el-input placeholder="请输入SDK版本号" v-model="model.sdkVersion" clearable style="width: 230px" maxlength="30" show-word-limit />
					</el-form-item>
					<el-form-item label="上传文件：" class="custom-width" prop="uploadFiles">
						<custom-upload
							v-model="model.uploadFiles"
							:limit="1"
							:fileSize="20"
							:fileType="['png', 'jpg', 'jpeg', 'doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'xlsx', 'pptx', 'zip', '7z', 'rar']"
							dir="sdk"
							@change="handleChange"
						/>
					</el-form-item>
					<el-form-item label="文件名称：" class="custom-width">
						<span>{{ model.sdkFileName }}</span>
					</el-form-item>
					<el-form-item label="文件大小：" class="custom-width">
						<span>{{ model.sdkFileSize }}</span>
					</el-form-item>
					<el-form-item label="SDK介绍：" class="custom-width">
						<el-input
							placeholder="请输入SDK介绍"
							v-model="model.sdkRemark"
							clearable
							style="width: 230px"
							maxlength="300"
							show-word-limit
							type="textarea"
						/>
					</el-form-item>
				</el-form>
				<footer class="footer">
					<el-button type="primary" @click="submitForm(formRef)" :loading="loading">保存</el-button>
					<el-button @click="handleCancel">取消</el-button>
				</footer>
			</el-card>
		</section>
	</div>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { reactive, ref, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElNotification, ElMessageBox } from 'element-plus';
import { getSdkDetailInfo, updateSdk } from '/@/api/openPlatform/sdkInfo';
import { useRoute } from 'vue-router';
import type { UploadProps, UploadUserFile } from 'element-plus';

const customUpload = defineAsyncComponent(() => import('../../components/customUpload.vue'));

const formRef = ref<FormInstance>();
const loading = ref(false);
const router = useRouter();
const route = useRoute(); // 生成组件唯一id
console.log('route', route);

const model = ref({
	id: null,
	sdkName: '',
	sdkVersion: '',
	sdkFileName: '',
	uploadFiles: [] as UploadUserFile[],
	sdkFileSize: '',
	sdkFileType: '',
	sdkFileUrl: '',
	sdkRemark: '',
});

// 表单校验规则
const formRules = reactive({
	sdkName: [{ required: true, message: 'SDK名称不能为空', trigger: 'blur' }],
	sdkVersion: [{ required: true, message: 'SDK版本不能为空', trigger: 'blur' }],
	uploadFiles: [{ required: true, message: 'SDK文件不能为空', trigger: 'change' }],
});

const handleChange = (files: any) => {
	model.value.uploadFiles = files;
	if (files.length > 0) {
		const file = files[0];
		console.log('file', file);
		model.value.sdkFileName = file.name;
		// 计算文件大小并格式化为 KB 或 MB
		model.value.sdkFileSize = file.fileSize;
		model.value.sdkFileType = file.fileType;
		model.value.sdkFileUrl = file.url;
	} else {
		model.value.sdkFileName = '';
		model.value.sdkFileSize = '';
		model.value.sdkFileType = '';
		model.value.sdkFileUrl = '';
	}
	// console.log('fileUrl', fileUrl);
	// console.log('fileInfo', fileInfo);
	// if (fileInfo) {
	// 	uploadFileInfo.value = fileInfo[0];
	// 	modle.value.uploadFiles = fileInfo[0].fileName;
	// 	console.log('uploadFileInfo', uploadFileInfo.value?.fileSize);
	// }
};

// 自动定位到表单报错项
const moveToErr = () => {
	nextTick(() => {
		let isError = document.getElementsByClassName('is-error');
		if (isError.length) {
			isError[0].scrollIntoView({
				block: 'center',
				behavior: 'smooth',
			});
			// 这个当滑动到报错项之后自动获取输入框的焦点，方便用户直接进行输入，延迟 800ms 是因为需要都能到定位成功后在进行获取焦点体验更好一些
			setTimeout(() => {
				if (isError[0].previousElementSibling?.querySelector('input')) {
					isError[0].previousElementSibling.querySelector('input')?.focus();
				}
			}, 800);
		}
	});
};

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			console.log('model.value', model.value);
			loading.value = true;
			updateSdk(model.value).then((res) => {
				loading.value = false;
				console.log('res', res);
				if (res.code === 0) {
					ElNotification({
						title: '保存成功',
						type: 'success',
						duration: 2000,
					});
					router.push('/openPlatform/sdkManage/sdkList/index');
				}
			});
		} else {
			loading.value = false;
			moveToErr();
			console.log('error submit!', fields);
		}
	});
};

// 取消（关闭当前 tag）
const handleCancel = () => {
	if (route.query.type !== 'detail') {
		ElMessageBox.confirm(`退出当前页面将丢失编辑内容，是否确认退出?`, '取消保存', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'info',
		})
			.then(() => {
				router.push('/openPlatform/sdkManage/sdkList/index');
			})
			.catch(() => {
				// console.log('err', err);
			});
	} else {
		router.push('/openPlatform/sdkManage/sdkList/index');
	}
};

const getDetail = () => {
	const id = route.query.id;
	if (id) {
		const sdkId = Array.isArray(id) ? id[0] : id;
		if (typeof sdkId === 'string') {
			getSdkDetailInfo(sdkId)
				.then((res) => {
					model.value = res.data;
					if (res.data.sdkFileName && res.data.sdkFileUrl && res.data.sdkFileSize) {
						model.value.uploadFiles = [
							{
								name: res.data.sdkFileName,
								url: res.data.sdkFileUrl,
								fileSize: res.data.sdkFileSize,
							},
						] as any;
					} else {
						model.value.uploadFiles = [];
					}

					console.log('model.value', model.value);
					// model.value.
				})
				.catch((err) => {
					console.error('Failed to fetch SDK detail:', err);
				});
		} else {
			console.error('Invalid SDK ID type:', typeof sdkId);
		}
	} else {
		console.error('SDK ID is missing in the route query');
	}
};

onMounted(() => {
	getDetail();
});
</script>
<style lang="scss">
.layout-padding {
	overflow-y: scroll;
}
section {
	margin-bottom: 28px;
}

.custom-width {
	width: 330px;
}

.title {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: #1d2129;
	margin-bottom: 20px;
}

.footer {
	text-align: center;

	.el-button {
		width: 68px;
	}
}
</style>
