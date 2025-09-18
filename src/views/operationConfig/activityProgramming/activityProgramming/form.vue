<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" draggable width="50%" :close-on-click-modal="false" :show-close="false">
			<el-scrollbar height="400px">
				<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
					<el-form-item label="活动名称" prop="schemeName">
						<el-input v-model="model.schemeName" placeholder="请输入活动名称" maxlength="100" :disabled="isDisabled" />
					</el-form-item>
					<el-form-item label="活动时间" prop="searchTime">
						<el-date-picker
							v-model="model.searchTime"
							@change="changeSearchTime"
							type="datetimerange"
							:disabled="isDisabled"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD HH:mm:ss"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item label="方案说明" prop="schemeDescription">
						<el-input
							v-model="model.schemeDescription"
							type="textarea"
							:rows="3"
							:disabled="isDisabled"
							placeholder="请输入方案说明"
							maxlength="2000"
						/>
					</el-form-item>
					<el-form-item label="附件上传">
						<el-upload
							v-model:file-list="activitySchemeAttachmentList"
							class="upload-demo"
							:action="baseURL + other.adaptationUrl('/admin/sys-file/upload')"
							multiple
							:headers="headers"
							:on-success="handleUploadSuccess"
							:before-upload="beforeUpload"
							:on-remove="handleRemove"
							:disabled="isDisabled"
							:on-exceed="handleExceed"
							:on-change="handleChange"
							:limit="10"
						>
							<!-- 							:remove-when-upload-fail="false" -->
							<el-button type="primary" :disabled="isDisabled">选择文件</el-button>
							<template #tip>
								<div class="el-upload__tip">支持格式：PDF、Word、PPT等，单个文件不超过10MB</div>
							</template>
						</el-upload>
					</el-form-item>
				</el-form>
			</el-scrollbar>
			<template #footer>
				<el-button v-if="!isDisabled" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button v-if="isDisabled" size="default" @click="visible = false">关闭</el-button>
				<el-button v-if="!isDisabled" size="default" @click="submitForm(formRef, 'submit')">保存</el-button>
				<el-button v-if="!isDisabled" type="primary" size="default" @click="submitForm(formRef, 'audit')">保存并提交审核</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { UploadProps, UploadUserFile, FormInstance, FormRules } from 'element-plus';
// import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';
import { getActivitySchemePlanAdd, getActivitySchemePlanUpdate, getBySchemeCode } from '/@/api/operationConfig/activityProgramming';
const emit = defineEmits(['refresh']);
const isDisabled = ref<boolean>(false);
const visible = ref(false);
const myDialog = ref(null);
const title = ref('');
const dialogType = ref('');
const activitySchemeAttachmentList = ref<UploadUserFile[]>([]);
const isEditChangeFileList = ref(false);
const isErr = ref(false);
onMounted(() => {
	// console.log('baseURL', baseURL);
});
const formRef = ref<FormInstance>();
const model = ref<any>({
	id: '',
	schemeName: '',
	searchTime: [],
	startTime: '',
	endTime: '',
	schemeDescription: '',
	activitySchemeAttachmentList: [],
});
const formRules = reactive<FormRules>({
	schemeName: [{ required: true, message: '请输入活动名称' }],
	searchTime: [{ required: true, message: '请选择活动时间' }],
	schemeDescription: [{ required: true, message: '请输入方案说明' }],
});
const openDialog = async (row: any, type: string) => {
	console.log('type', type, 'row', row);
	dialogType.value = type;
	isDisabled.value = false;
	activitySchemeAttachmentList.value = [];
	Object.assign(model.value, {
		id: '',
		schemeName: '',
		searchTime: [],
		startTime: '',
		endTime: '',
		schemeDescription: '',
		activitySchemeAttachmentList: [],
		saveOrAudit: 1, //审核状态：1.待审核2.审核中
	});
	switch (type) {
		case 'add':
			title.value = '新建活动方案';
			break;
		case 'edit':
			title.value = '编辑活动方案';
			Object.assign(model.value, row);
			await getUpdateList(row.code);
			// model.value.activitySchemeAttachmentList = activitySchemeAttachmentList.value;
			activitySchemeAttachmentList.value.forEach((item: any) => {
				model.value.activitySchemeAttachmentList.push({
					schemeCode: model.value.code,
					attachmentName: item.name,
					attachmentDownloadUrl: item.url,
				});
			});
			model.value.searchTime = [model.value.startTime, model.value.endTime];
			break;
		case 'see':
			title.value = '查看活动方案';
			isDisabled.value = true;
			Object.assign(model.value, row);
			getUpdateList(row.code);
			activitySchemeAttachmentList.value.forEach((item: any) => {
				model.value.activitySchemeAttachmentList.push({
					schemeCode: model.value.code,
					attachmentName: item.name,
					attachmentDownloadUrl: item.url,
				});
			});
			// model.value.activitySchemeAttachmentList = activitySchemeAttachmentList.value;
			model.value.searchTime = [model.value.startTime, model.value.endTime];
			break;
	}
	console.log('model.value', model.value);
	console.log('activitySchemeAttachmentList.value', activitySchemeAttachmentList.value);

	visible.value = true;
};

const getUpdateList = async (schemeCode: string) => {
	try {
		const { code, data } = await getBySchemeCode(schemeCode);
		if (code === 0) {
			console.log('data', data);
			// Object.assign(model.value, data);
			// model.value.searchTime = [model.value.startTime, model.value.endTime];
			data.forEach((item: any) => {
				activitySchemeAttachmentList.value.push({
					name: item.attachmentName,
					url: item.attachmentDownloadUrl,
				});
			});
		}
	} catch (err) {
		console.log('err', err);
	}
};
// 提交保存
const submitForm = async (formEl: FormInstance | undefined, type: string) => {
	console.log('isEditChangeFileList.value', isEditChangeFileList.value);
	console.log('model.value.activitySchemeAttachmentList', model.value.activitySchemeAttachmentList);
	if (dialogType.value === 'edit' && !isEditChangeFileList.value) {
		model.value.activitySchemeAttachmentList = null;
	}
	if (dialogType.value === 'edit' && isEditChangeFileList.value && model.value.activitySchemeAttachmentList.length === 0) {
		model.value.activitySchemeAttachmentList = [];
	}
	console.log('model.value', model.value);
	console.log('activitySchemeAttachmentList.value', activitySchemeAttachmentList.value);
	if (type === 'submit') model.value.saveOrAudit = 1;
	else model.value.saveOrAudit = 2;
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(
					`是否${type === 'submit' ? '保存' : '保存并提交审核'}活动方案`,
					`${type === 'submit' ? '保存' : '保存并提交审核'}活动方案`
				);
			} catch {
				return false;
			}
			try {
				const request = model.value.id ? getActivitySchemePlanUpdate : getActivitySchemePlanAdd;
				const { code } = await request(model.value);
				if (code === 0) {
					useMessage().success(`${type === 'submit' ? '保存' : '保存并提交审核'}活动方案成功`);
					resetForm(formEl);
					emit('refresh');
					visible.value = false;
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});

	// 	try {
	// 	let res = await getWinningList();
	// 	state.dataList = res.data;
	// } catch (err) {
	// 	console.log('err', err);
	// }
};
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	isEditChangeFileList.value = false;
	activitySchemeAttachmentList.value = [];
	model.value = {
		id: '',
		schemeName: '',
		searchTime: [],
		startTime: '',
		endTime: '',
		schemeDescription: '',
		activitySchemeAttachmentList: [],
	};
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		if (!formEl) return;
		formEl.resetFields();
		activitySchemeAttachmentList.value = [];
		isEditChangeFileList.value = false;
		visible.value = false;
	} catch {
		return false;
	}
};
const handleChange: UploadProps['onChange'] = () => {
	if (dialogType.value === 'edit') isEditChangeFileList.value = true;
	// if (isErr.value) {
	// 	activitySchemeAttachmentList.value.splice(activitySchemeAttachmentList.value.length - 1, 1);
	// 	model.value.activitySchemeAttachmentList.splice(model.value.activitySchemeAttachmentList.length - 1, 1);
	// 	isErr.value = false;
	// }
};
const changeSearchTime = (val: any) => {
	console.log('val', val);
	if (!val) {
		model.value.startTime = '';
		model.value.endTime = '';
	} else {
		model.value.startTime = val[0];
		model.value.endTime = val[1];
	}
	// getDataList();
};

// 删除事件
const handleRemove: UploadProps['beforeRemove'] = (uploadFile: any, uploadFiles) => {
	if (dialogType.value === 'edit') isEditChangeFileList.value = true;
	console.log('uploadFile', uploadFile);
	let url = '';
	if (uploadFile.url) {
		url = uploadFile.url;
	}
	if (uploadFile?.response?.data?.url) {
		url = uploadFile?.response?.data?.url;
	}
	if (url) {
		activitySchemeAttachmentList.value = activitySchemeAttachmentList.value.filter((f) => !(f.url === url));
		model.value.activitySchemeAttachmentList = model.value.activitySchemeAttachmentList.filter((e: any) => !(e.attachmentDownloadUrl === url));
	}
	console.log('activitySchemeAttachmentList.value', activitySchemeAttachmentList.value);
	console.log('model.value.activitySchemeAttachmentList', model.value.activitySchemeAttachmentList);
	return true;
};
const handleUploadSuccess = (res: any, file: any) => {
	// if (isErr.value) {
	// 	handleRemove(file);
	// 	isErr.value = false;
	// }
	console.log('res', res);
	if (res.code === 0) {
		model.value.activitySchemeAttachmentList.push({
			schemeCode: model.value.code,
			attachmentName: res.data.fileName,
			attachmentDownloadUrl: res.data.url,
		});
		console.log('model.value.activitySchemeAttachmentList', model.value.activitySchemeAttachmentList);
	} else {
		// handleRemove();
	}
};
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
	const imgSize = file.size / 1024 / 1024 < 10;
	if (!imgSize) {
		useMessage().error('上传附件大小不能超过10M！');
		return false;
	}
	return true;
};
const handleExceed: UploadProps['onExceed'] = (uploadFile, uploadFiles) => {
	console.log('uploadFile', uploadFile);
	useMessage().error('上传附件最多10个文件！');
};
// 请求头处理
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});
// 暴露变量
defineExpose({
	openDialog,
});
</script>
