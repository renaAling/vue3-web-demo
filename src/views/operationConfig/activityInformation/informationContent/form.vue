<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" draggable width="50%" :close-on-click-modal="false" :show-close="false">
			<el-form :model="form" ref="queryRef" :rules="rules" @keyup.enter="submit(queryRef)">
				<el-form-item label="活动标题" prop="activityTitle" label-width="80">
					<el-input placeholder="请输入活动标题" maxlength="100" v-model="form.activityTitle" clearable />
				</el-form-item>
				<el-form-item label="活动分组" prop="groupCode" label-width="80">
					<el-select v-model="form.groupCode" clearable placeholder="请选择活动分组">
						<el-option v-for="item in groupCodeOptionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="活动类型" prop="type" label-width="80">
					<el-radio-group v-model="form.type">
						<el-radio :label="1" size="large">线上活动</el-radio>
						<el-radio :label="2" size="large">线下活动</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.type == '1'" label="活动链接" prop="activityUrl" label-width="80">
					<el-input placeholder="请输入活动链接" v-model="form.activityUrl" clearable />
				</el-form-item>
				<el-form-item label="活动主图" prop="activityImg" label-width="80">
					<template #default="{ row, $index }">
						<el-upload
							class="upload-box"
							list-type="picture-card"
							action="#"
							:show-file-list="false"
							:http-request="handleTableImageUpload.bind(null, 'activityImg', row, $index)"
							:on-success="productUploadSuccess"
							accept="image/jpeg,image/png,image/gif,image/jpg"
							:before-upload="beforeUpload"
						>
							<img v-if="form.activityImg" :src="form.activityImg" class="avatar" />
							<div v-else class="uploader-text">
								<el-icon class="avatar-uploader-icon"><Plus /></el-icon>
								<span>点击上传活动主图</span>
								<span>建议尺寸1920*1080px</span>
							</div>
						</el-upload>
						<!-- <div v-if="row.activityImg" class="mt-2 text-sm cursor-pointer text-blue-500" @click="handlePictureCardPreview(row.activityImg)">查看大图</div> -->
					</template>
				</el-form-item>
				<el-form-item label="活动内容" prop="activityContent" label-width="80">
					<editor v-model:get-html="form.activityContent" height="500" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="cancel(queryRef)">取消</el-button>
				<el-button type="primary" @click="submit(queryRef)"> 保存 </el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="form-config">
import { ref } from 'vue';
import type { FormInstance, FormRules, UploadRequestOptions, UploadProps } from 'element-plus';
import { ElNotification } from 'element-plus';
import { uploadImage } from '/@/api/culture/common';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getGroupListForAddInfo, getActivityInfoAdd, getActivityInfoUpdate } from '/@/api/operationConfig/activityInformation';
// import { useMessage, useMessageBox } from '/@/hooks/message';
// import { getWinningList } from '/@/api/operationConfig/firstPage';
const emit = defineEmits(['refresh']);

const visible = ref(false);
const myDialog = ref(null);
const title = ref('');
const dialogType = ref('');
const queryRef = ref<FormInstance>();
const groupCodeOptionList = ref();
const form = ref<any>({
	groupStatus: 0,
	activityTitle: '',
	groupCode: '',
	type: 2,
	activityImg: '',
	activityContent: '',
});
const rules = reactive<FormRules<any>>({
	activityTitle: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
	groupCode: [{ required: true, message: '请选择活动分组', trigger: 'blur' }],
	type: [{ required: true, message: '请选择活动类型', trigger: 'blur' }],
	activityImg: [{ required: true, message: '请选择活动主图', trigger: 'blur' }],
	activityContent: [{ required: true, message: '请选择活动内容', trigger: 'blur' }],
});

const openDialog = async (row: any, type: string) => {
	try {
		console.log('row', row);
		if (type === 'add') {
			title.value = '新建内容';
		} else {
			title.value = '编辑内容';
			// Object.assign(form.value, row);
			// form.value = row;
			// form.value.activityContent = '';
		}
		await getGroupCodeOptionList();
		// 重置表单数据
		nextTick(() => {
			if (type !== 'add') {
				Object.assign(form.value, row);
				const obj = groupCodeOptionList.value.find((item: any) => row.groupCode === item.code);
				console.log('obj', obj);
				if (!obj) {
					form.value.groupCode = '';
				}
			}
			dialogType.value = type;
			visible.value = true;
		});
	} catch (err: any) {
		useMessage().error('打开对话框时发生错误');
	}
};
const getGroupCodeOptionList = async () => {
	try {
		const { code, data } = await getGroupListForAddInfo();
		if (code === 0) {
			groupCodeOptionList.value = [];
			data.forEach((item: any) => {
				groupCodeOptionList.value.push({
					label: item.groupName,
					value: item.code,
				});
			});
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const submit = async (formEl: FormInstance | undefined) => {
	console.log('form', form.value);
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			try {
				await useMessageBox().confirm('请确认是否保存活动内容？', '保存活动内容');
			} catch {
				return;
			}
			try {
				const { code } = dialogType.value === 'add' ? await getActivityInfoAdd(form.value) : await getActivityInfoUpdate(form.value);
				if (code === 0) {
					useMessage().success('已保存');
					cancel(queryRef.value);
					emit('refresh');
					visible.value = false;
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
const cancel = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	Object.assign(form.value, {
		activityTitle: '',
		groupCode: '',
		type: 2,
		activityImg: '',
		activityContent: '',
	});
	visible.value = false;
	location.reload();
};

// 上传图片
// 多文件上传组件配置;
const uploadImageConfig = {
	fileSize: 20,
	fileType: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
};
/**
 * @description 文件上传之前判断
 * @param file 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
	const imgSize = file.size / 1024 / 1024 < uploadImageConfig.fileSize;
	const imgType = uploadImageConfig.fileType.includes(file.type);
	if (!imgType)
		({
			title: '温馨提示',
			message: '上传图片不符合所需的格式！',
			type: 'warning',
		});
	if (!imgSize)
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传图片大小不能超过 ${uploadImageConfig.fileSize}M！`,
				type: 'warning',
			});
		}, 0);
	return imgType && imgSize;
};

const handleTableImageUpload = async (key: string, row: any, index: number, options: UploadRequestOptions) => {
	console.log('row', row);
	console.log('index', index);
	console.log('options', options);
	console.log('key', key);
	let formData = new FormData();
	formData.append('file', options.file);
	formData.append('dir', 'culture');
	try {
		const { data } = await uploadImage(formData);
		console.log('上传成功', data.url);
		form.value.activityImg = data.url;
		// // row.imageUrl = data.url;
		// // ruleForm.iconUrl = data.url;
		// console.log('state.dataList', state.dataList);
		// console.log('isAllEdit', isAllEdit);
		// if (state.dataList && isAllEdit.value) state.dataList[index][key] = data.url;
		// if (!isAllEdit.value) detailList.value[0][key] = data.url;
		// console.log('detailList', detailList.value[0]);
		// console.log('state.dataList', state.dataList);
	} catch (error) {
		options.onError(error as any);
	}
};
const productUploadSuccess = () => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传成功！',
		type: 'success',
	});
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.form-btn {
	display: flex;
	justify-content: flex-end;
}
.uploader-text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #999;
	font-size: 14px;
	.avatar-uploader-icon {
		margin-bottom: 5px;
		font-size: 32px;
	}
}
</style>
