<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" width="40%" :close-on-click-modal="false">
			<el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm">
				<el-form-item label="场所名称" prop="name" placeholder="请输入场所名称">
					<el-input v-model="ruleForm.name" maxlength="20" show-word-limit />
				</el-form-item>
				<el-form-item label="附近站点" prop="siteCodes">
					<el-select v-model="ruleForm.siteCodes" placeholder="请选择附近站点" multiple>
						<el-option v-for="item in siteCodesArr" :key="'siteCodes' + item.subwayCode" :label="item.subwayName" :value="item.subwayCode" />
					</el-select>
				</el-form-item>
				<el-form-item label="地图图标" prop="mapIcon">
					<template #default="{ row, $index }">
						<el-upload
							class="upload-box"
							list-type="picture-card"
							action="#"
							:show-file-list="false"
							:http-request="handleTableImageUpload.bind(null, 'mapIcon', row, $index)"
							:on-success="productUploadSuccess"
							accept="image/jpeg,image/png,image/gif,image/jpg"
						>
							<!-- :before-upload="beforeUpload" -->
							<img v-if="ruleForm.mapIcon" :src="ruleForm.mapIcon" class="avatar" />
							<div v-else class="uploader-text">
								<el-icon class="avatar-uploader-icon"><Plus /></el-icon>
								<span>点击上传地图图标</span>
							</div>
						</el-upload>
						<!-- <div v-if="row.mapIcon" class="mt-2 text-sm cursor-pointer text-blue-500" @click="handlePictureCardPreview(row.mapIcon)">查看大图</div> -->
					</template>
				</el-form-item>
				<el-form-item label="地址" prop="address" placeholder="请输入地址">
					<el-input v-model="ruleForm.address" maxlength="20" show-word-limit />
				</el-form-item>
				<el-form-item label="站点主题标签" prop="labelCode">
					<el-select v-if="!isLabelCodeEdit" v-model="labelCode" placeholder="请选择站点主题标签">
						<el-option v-for="item in labelCodeArr" :key="'labelCode' + item.code" :label="item.name" :value="item.code" />
					</el-select>
					<el-select v-if="isLabelCodeEdit" v-model="labelCode" placeholder="请选择站点主题标签">
						<el-option v-for="item in labelCodeArrAll" :key="'labelCode' + item.code" :label="item.name" :value="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item label="主题内容" prop="content">
					<el-input v-model="content" disabled placeholder="请选择站点主题标签" />
				</el-form-item>
				<el-form-item label="已对接数字化系统" prop="systemCodes">
					<el-select v-model="ruleForm.systemCodes" placeholder="请选择已对接数字化系统" multiple>
						<el-option v-for="e in digitalSystemArr" :key="'systemCodes' + e.code" :label="e.name" :value="e.code" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">提交 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { orderDetail } from '/@/api/goodStore/order';
import type { FormInstance, FormRules, UploadRequestOptions } from 'element-plus';
import { ElNotification } from 'element-plus';
import { uploadImage } from '/@/api/culture/common';
import {
	getSubwayLike,
	getList,
	getPlatformDigitalSystemList,
	postPlatformPlaceAdd,
	postPlatformPlaceUpdate,
	getplatformPlaceDetail,
	getUpdateList,
} from '/@/api/platformEntry/locationInformationList';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const ruleFormRef = ref<FormInstance>();
const isEdit = ref(false);
const siteCodesArr = ref([]) as any;
const digitalSystemArr = ref([]) as any;
const labelCodeArr = ref([]) as any;
const labelCodeArrAll = ref([]) as any;
const title = ref('');
const labelCode = ref('');
const content = ref('');
const isAdd = ref(false);
const isLabelCodeEdit = ref(false); //编辑时-站点主题标签被删除的情况
const ruleForm = ref<any>({
	name: '',
	siteCodes: [],
	mapIcon: '',
	systemCodes: [],
	labelCode: '',
	address: '',
	auditStatus: 2,
});
watch(
	() => labelCode.value,
	(val: any) => {
		console.log('val', val);
		if (val) {
			ruleForm.value.labelCode = val;
			const obj = isLabelCodeEdit.value
				? labelCodeArrAll.value.find((item: any) => item.code === val)
				: labelCodeArr.value.find((item: any) => item.code === val);
			content.value = obj?.content;
		} else {
			ruleForm.value.labelCode = '';
			content.value = '';
			// ruleForm.ztnr = '';
		}
	},
	{ immediate: true }
);
const openDialog = (row?: any, flag?: boolean) => {
	if (flag) isAdd.value = true;
	else isAdd.value = false;
	Object.assign(ruleForm.value, {
		name: '',
		siteCodes: [],
		mapIcon: '',
		systemCodes: [],
		labelCode: '',
		address: '',
		auditStatus: 2,
	});
	labelCode.value = '';
	content.value = '';
	getSiteCodesArr();
	getDigitalSystemArrArr();
	getLabelCodeArr();
	getLabelCodeArrAll();
	isEdit.value = false;
	console.log('row', row);
	if (row) {
		title.value = '编辑场所信息';
		isEdit.value = true;
		getDetail(Number(row.id));
	} else title.value = '新增场所信息';
	visible.value = true;
};
const getDetail = async (id: number) => {
	try {
		let res = await getplatformPlaceDetail(id);
		if (res.code === 0) {
			// Object.assign(ruleForm.value, res.data);
			// console.log('ruleForm.value', ruleForm.value);
			// const { name, mapIcon, address } = res.data;
			ruleForm.value.id = Number(res.data.id);
			ruleForm.value.name = res.data.name;
			ruleForm.value.mapIcon = res.data.mapIcon;
			ruleForm.value.address = res.data.address;
			if (res.data.labelCode.includes(labelCodeArr.value)) {
				isLabelCodeEdit.value = false;
				labelCodeArr.value.find((item: any) => {
					if (item.code === res.data.labelCode) {
						labelCode.value = item.code;
					}
				});
			} else {
				labelCodeArrAll.value.find((item: any) => {
					isLabelCodeEdit.value = true;
					if (item.code === res.data.labelCode) {
						labelCode.value = item.code;
					}
				});
			}
			//

			ruleForm.value.systemCodes = res.data.platformPlaceSystemCodes;
			ruleForm.value.siteCodes = res.data.platformPlaceSiteCodes;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getLabelCodeArr = async () => {
	try {
		let res = await getList();
		if (res.code === 0) {
			console.log('res', res);
			labelCodeArr.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getLabelCodeArrAll = async () => {
	try {
		let res = await getUpdateList();
		if (res.code === 0) {
			console.log('res', res);
			labelCodeArrAll.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getSiteCodesArr = async () => {
	try {
		let res = await getSubwayLike();
		if (res.code === 0) {
			console.log('res', res);
			siteCodesArr.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getDigitalSystemArrArr = async () => {
	try {
		let res = await getPlatformDigitalSystemList();
		if (res.code === 0) {
			digitalSystemArr.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// const uploadImageConfig = {
// 	fileSize: 20,
// 	fileType: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
// };
// const beforeUpload: UploadProps['beforeUpload'] = (file) => {
// 	const imgSize = file.size / 1024 / 1024 < uploadImageConfig.fileSize;
// 	const imgType = uploadImageConfig.fileType.includes(file.type);
// 	if (!imgType)
// 		({
// 			title: '温馨提示',
// 			message: '上传图片不符合所需的格式！',
// 			type: 'warning',
// 		});
// 	if (!imgSize)
// 		setTimeout(() => {
// 			ElNotification({
// 				title: '温馨提示',
// 				message: `上传图片大小不能超过 ${uploadImageConfig.fileSize}M！`,
// 				type: 'warning',
// 			});
// 		}, 0);
// 	return imgType && imgSize;
// };
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
		ruleForm.value.mapIcon = data.url;
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
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入场所名称', trigger: ['blur', 'change'] }],
	siteCodes: [{ required: true, message: '请选择附近站点', trigger: ['blur', 'change'] }],
	mapIcon: [{ required: true, message: '请上传地图图标', trigger: ['blur', 'change'] }],
	address: [{ required: true, message: '请输入地址', trigger: ['blur', 'change'] }],
	labelCode: [{ required: true, message: '请选择站点主题标签', trigger: ['blur', 'change'] }],
	systemCodes: [{ required: true, message: '请选择是否已对接数字化系统', trigger: ['blur', 'change'] }],
});
const submitForm = async (formEl: FormInstance | undefined) => {
	console.log('ruleForm.value', ruleForm.value);
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', ruleForm.value);
			try {
				let res: any = null;
				if (isAdd.value) {
					res = await postPlatformPlaceAdd(ruleForm.value);
				} else if (isEdit.value) res = await postPlatformPlaceUpdate(ruleForm.value);
				else res = await postPlatformPlaceAdd(ruleForm.value);
				if (res.code === 0) {
					visible.value = false;
					useMessage().success('提交成功，请前往列表查看');
					emit('refresh');
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	labelCode.value = '';
	content.value = '';
	// Object.assign(ruleForm, { name: '', siteCodes: '', mapIcon: '', systemCodes: '', labelCode: '', ztnr: '', address: '' });
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
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
