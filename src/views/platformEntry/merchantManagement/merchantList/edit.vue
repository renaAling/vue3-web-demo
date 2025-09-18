<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<div class="demo-container">
					<div class="text-blue-500 title">{{ type === 'add' ? '新增商家' : '编辑商家' }}</div>
					<el-form
						ref="ruleFormRef"
						:model="ruleForm"
						:rules="rules"
						label-position="left"
						label-width="140px"
						class="demo-ruleForm"
						:size="formSize"
						status-icon
					>
						<div class="form-title">
							商家基本信息
							<div></div>
						</div>
						<el-form-item label="商家名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入企业名称" clearable maxlength="30" show-word-limit />
						</el-form-item>
						<el-form-item label="统一社会信用代码" prop="creditCode">
							<el-input v-model="ruleForm.creditCode" placeholder="请输入统一社会信用代码" clearable maxlength="18" show-word-limit />
						</el-form-item>
						<el-form-item label="法定代表人" prop="legalRepresentative">
							<el-input v-model="ruleForm.legalRepresentative" placeholder="请输入法定代表人姓名" clearable />
						</el-form-item>
						<el-form-item label="注册时间" prop="registrationTime">
							<el-date-picker
								v-model="ruleForm.registrationTime"
								type="date"
								placeholder="请选择注册时间"
								value-format="YYYY-MM-DD"
								style="width: 100%"
							/>
						</el-form-item>
						<el-form-item label="注册资本" prop="registeredCapital">
							<div style="position: relative; width: 100%">
								<el-input-number v-model="ruleForm.registeredCapital" :precision="2" :step="0.01" controls-position="right" style="width: 100%">
								</el-input-number>
								<span style="width: 40px; position: absolute; top: 0; right: 0; color: #999">万元</span>
							</div>
						</el-form-item>
						<el-form-item label="经营地址" prop="businessAddress">
							<el-input v-model="ruleForm.businessAddress" placeholder="请输入详细经营地址" clearable maxlength="50" show-word-limit />
						</el-form-item>
						<div class="form-title">
							营业执照信息
							<div></div>
						</div>
						<el-form-item label="营业执照" prop="businessLicense">
							<el-upload
								class="upload-demo"
								action="#"
								drag
								:show-file-list="false"
								:http-request="handleTableImageUpload.bind(null, 'businessLicense', row, $index)"
								:on-success="productUploadSuccess"
								accept="image/jpeg,image/png,image/gif,image/jpg"
								:before-upload="beforebusinessLicenseUpload"
							>
								<img v-if="ruleForm.businessLicense" :src="ruleForm.businessLicense" class="avatar" />
								<div v-else class="uploader-text">
									<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
									<span>点击或拖拽文件上传</span>
									<span>支持jpg、png格式,大小不超过5M</span>
								</div>
							</el-upload>
						</el-form-item>
						<el-form-item label="经营范围" prop="businessScope">
							<el-input
								v-model="ruleForm.businessScope"
								:rows="3"
								type="textarea"
								placeholder="请输入经营范围"
								maxlength="500"
								clearable
								show-word-limit
							/>
						</el-form-item>
						<div class="form-title">
							经营信息
							<div></div>
						</div>
						<el-form-item label="门店名称" prop="storeName">
							<el-input v-model="ruleForm.storeName" placeholder="请输入门店名称" maxlength="30" show-word-limit clearable />
						</el-form-item>
						<el-form-item label="门店品类" prop="storeCategoryCode">
							<el-select v-model="ruleForm.storeCategoryCode" placeholder="请选择门店品类">
								<el-option
									v-for="item in storeCategoryCodeArr"
									:key="'storeCategoryCode' + item.categoryCode"
									:label="item.categoryName"
									:value="item.categoryCode"
								/>
							</el-select>
						</el-form-item>
						<el-form-item label="经营年限" prop="duration">
							<el-input-number
								v-model="ruleForm.duration"
								:precision="0"
								:step="1"
								:min="0"
								:max="9999"
								step-strictly
								controls-position="right"
								style="width: 100%"
							>
							</el-input-number>
							<span style="width: 20px; position: absolute; top: 0; right: 0; color: #999">年</span>
						</el-form-item>
						<el-form-item label="场所照片" prop="premiseImgUrls">
							<template #default="{ row, $index }">
								<div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
									<el-upload
										class="upload-box"
										list-type="picture-card"
										action="#"
										:show-file-list="false"
										:http-request="handleTableImageUpload.bind(null, 'premiseImgUrls', row, 0)"
										:on-success="productUploadSuccess"
										accept="image/jpeg,image/png,image/gif,image/jpg"
										:before-upload="beforebusinessLicenseUpload"
									>
										<img v-if="ruleForm.premiseImgUrls[0]" :src="ruleForm.premiseImgUrls[0]" class="avatar" />
										<div v-else class="uploader-text">
											<el-icon class="avatar-uploader-icon"><CameraFilled /></el-icon>
											<span>上传门头照</span>
										</div>
									</el-upload>
									<el-upload
										class="upload-box"
										list-type="picture-card"
										action="#"
										:show-file-list="false"
										:http-request="handleTableImageUpload.bind(null, 'premiseImgUrls', row, 1)"
										:on-success="productUploadSuccess"
										accept="image/jpeg,image/png,image/gif,image/jpg"
										:before-upload="beforebusinessLicenseUpload"
									>
										<img v-if="ruleForm.premiseImgUrls[1]" :src="ruleForm.premiseImgUrls[1]" class="avatar" />
										<div v-else class="uploader-text">
											<el-icon class="avatar-uploader-icon"><CameraFilled /></el-icon>
											<span>上传图环境照</span>
										</div>
									</el-upload>
									<el-upload
										class="upload-box"
										list-type="picture-card"
										action="#"
										:show-file-list="false"
										:http-request="handleTableImageUpload.bind(null, 'premiseImgUrls', row, 2)"
										:on-success="productUploadSuccess"
										accept="image/jpeg,image/png,image/gif,image/jpg"
										:before-upload="beforebusinessLicenseUpload"
									>
										<img v-if="ruleForm.premiseImgUrls[2]" :src="ruleForm.premiseImgUrls[2]" class="avatar" />
										<div v-else class="uploader-text">
											<el-icon class="avatar-uploader-icon"><CameraFilled /></el-icon>
											<span>上传收银台</span>
										</div>
									</el-upload>
									<el-upload
										class="upload-box"
										list-type="picture-card"
										action="#"
										:show-file-list="false"
										:http-request="handleTableImageUpload.bind(null, 'premiseImgUrls', row, 3)"
										:on-success="productUploadSuccess"
										accept="image/jpeg,image/png,image/gif,image/jpg"
										:before-upload="beforebusinessLicenseUpload"
									>
										<img v-if="ruleForm.premiseImgUrls[3]" :src="ruleForm.premiseImgUrls[3]" class="avatar" />
										<div v-else class="uploader-text">
											<el-icon class="avatar-uploader-icon"><CameraFilled /></el-icon>
											<span>上传仓储照</span>
										</div>
									</el-upload>
								</div>
								<div class="el-upload__tip">支持jpg、png档案，单张大小不超过5M</div>
							</template>
						</el-form-item>
						<div class="form-title">
							账户信息
							<div></div>
						</div>
						<el-form-item label="账户联系人" prop="accountContact">
							<el-input v-model="ruleForm.accountContact" placeholder="请输入账户联系人" clearable maxlength="10" show-word-limit />
						</el-form-item>
						<el-form-item label="手机号码" prop="mobile">
							<el-input v-model="ruleForm.mobile" placeholder="请输入手机号码" clearable maxlength="11" show-word-limit />
						</el-form-item>
						<el-form-item label="合约" prop="contractUrls">
							<el-upload
								v-model:file-list="contractList"
								class="upload-box"
								drag
								:headers="headers"
								:action="baseURL + other.adaptationUrl('/admin/sys-file/upload')"
								:before-upload="beforeUploadContract"
								:on-exceed="handleExceed"
								:on-change="handleChange"
								:on-success="handleSuccess"
								:limit="3"
								style="width: 100%"
							>
								<!-- 			:on-progress="handleFileUploadProgress" -->
								<div class="uploader-text">
									<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
									<span>点击或拖拽文件上传</span>
								</div>
								<!-- 		uploadContrac.value = false; -->
								<template #tip>
									<div class="el-upload__tip">支持PDF档案，大小不超过50M，最多上传3个文件</div>
								</template>
							</el-upload>
						</el-form-item>
					</el-form>
					<div class="btn">
						<el-button @click="resetForm(ruleFormRef)">取消</el-button> <el-button type="primary" @click="submitForm(ruleFormRef)"> 提交 </el-button>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>
<script setup lang="ts">
const route = useRoute();
const router = useRouter();
import other from '/@/utils/other';
import { ElNotification } from 'element-plus';
import { Session } from '/@/utils/storage';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { uploadImage } from '/@/api/culture/common';
import { getPlatformMerchantAdd, getPlatformCategoryArr, getPlatformMerchantGet, getPlatformMerchantUpdate } from '/@/api/platformEntry/merchantList';
import type { FormInstance, FormRules, UploadProps, UploadRequestOptions } from 'element-plus';
const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
const type = ref<string>('add');
const contractList = ref([]) as any;
const isEditChangeFileList = ref(false);
const storeCategoryCodeArr = ref([]) as any;
const uploadContrac = ref(false);
const isAdd = ref(false);
const ruleForm = ref<any>({
	name: '',
	creditCode: '',
	legalRepresentative: '',
	registrationTime: '',
	registeredCapital: '',
	businessAddress: '',
	businessLicense: '',
	businessScope: '',
	storeName: '',
	storeCategoryCode: '',
	duration: '',
	premiseImgUrls: [],
	accountContact: '',
	mobile: '',
	contractUrls: [],
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
	creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
	legalRepresentative: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
	registrationTime: [{ required: true, message: '请输入注册时间', trigger: 'blur' }],
	registeredCapital: [
		{ required: true, message: '请输入注册资本金额', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请输入注册资本金额'));
				} else if (Number.isNaN(Number(value))) {
					return callback(new Error('请输入纯数字金额'));
				} else callback();
			},
			trigger: 'blur',
		},
	],
	businessAddress: [{ required: true, message: '请输入经营地址', trigger: 'blur' }],
	businessLicense: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
	businessScope: [{ required: true, message: '请输入经营范围', trigger: 'blur' }],
	storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
	storeCategoryCode: [{ required: true, message: '请选择门店品类', trigger: 'blur' }],
	duration: [{ required: true, message: '请输入经营年限', trigger: 'blur' }],
	premiseImgUrls: [
		// { required: true, message: '请上传场所照片', trigger: 'blur' },
		{
			required: true,
			validator: (rule, value, callback) => {
				if (!value[0]) {
					callback(new Error('请上传门头照'));
				}
				if (!value[1]) {
					callback(new Error('请上传环境照'));
				}
				if (!value[2]) {
					callback(new Error('请上传收银台照'));
				}
				if (!value[3]) {
					callback(new Error('请上传仓储照'));
				}
				callback();
			},
			trigger: 'blur',
		},
	],
	accountContact: [{ required: true, message: '请输入账户联系人', trigger: 'blur' }],
	mobile: [
		{ required: true, message: '请输入手机号码', trigger: 'blur' },
		{
			min: 11,
			max: 11,
			message: '请输入11位手机号码',
			trigger: 'blur',
		},
	],
});

onMounted(() => {
	console.log('aaaaa', route);
	type.value = 'add';
	Object.assign(ruleForm.value, {
		name: '',
		creditCode: '',
		legalRepresentative: '',
		registrationTime: '',
		registeredCapital: '',
		businessAddress: '',
		businessLicense: '',
		businessScope: '',
		storeName: '',
		storeCategoryCode: '',
		duration: '',
		premiseImgUrls: ['', '', '', ''],
		accountContact: '',
		mobile: '',
		contractUrls: [],
		auditStatus: false,
	});
	getStoreCategoryCodeArr();
	console.log(route.query.id);
	if (route.query.id) {
		type.value = 'edit';
		getDetail(Number(route.query.id));
	} else type.value = 'add';
	console.log('type.value', type.value);
});

const getDetail = async (id: number) => {
	try {
		const res = await getPlatformMerchantGet(id);
		if (res.code === 0) {
			console.log('res', res);
			ruleForm.value = res.data;
			// 审核状态为通过或驳回的编辑后新增一条
			isAdd.value = res.data.auditStatus === 3 || res.data.auditStatus === 4 ? true : false;
			if (res.data.contractUrls) {
				res.data.contractUrls.forEach((item: any) => {
					contractList.value.push({
						name: item.contractName,
						url: item.contractUrl,
						isEdit: true,
					});
				});
			} else {
				contractList.value = [];
			}

			ruleForm.value.contractUrls = [];
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	//
};
const getStoreCategoryCodeArr = async () => {
	try {
		const res = await getPlatformCategoryArr();
		if (res.code === 0) {
			storeCategoryCodeArr.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 上传图片
// const handleFileUploadProgress = () => {
// 	console.log('上传进度条变化事件');
// 	uploadContrac.value = true;
// };
const handleSuccess = () => {
	ElNotification({
		title: '温馨提示',
		message: '文件上传成功！',
		type: 'success',
	});
	// uploadContrac.value = false;
};
// 多文件上传组件配置;
const beforebusinessLicenseUpload: UploadProps['beforeUpload'] = (file) => {
	console.log('beforeUpload', file);
	const fileType = ['image/jpeg', 'image/png', 'image/jpg'];
	const imgSize = file.size / 1024 / 1024 < 5;
	const imgType = fileType.includes(file.type);
	if (!imgType)
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: '上传图片不符合所需的格式！',
				type: 'warning',
			});
		}, 0);
	if (!imgSize)
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传图片大小不能超过 5M！`,
				type: 'warning',
			});
		}, 0);
	return imgType && imgSize;
};
//
const handleTableImageUpload = async (key: string, row: any, index: number, options: UploadRequestOptions) => {
	let formData = new FormData();
	formData.append('file', options.file);
	formData.append('dir', 'culture');
	try {
		const { data } = await uploadImage(formData);
		console.log('上传成功', data.url);
		if (key === 'premiseImgUrls') {
			ruleForm.value[key][index] = data.url;
		} else {
			ruleForm.value[key] = data.url;
		}
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
// 请求头处理
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});
const handleChange: UploadProps['onChange'] = () => {
	if (type.value === 'edit') isEditChangeFileList.value = true;
};
const beforeUploadContract: UploadProps['beforeUpload'] = (file) => {
	console.log('beforeUpload', file);
	const fileType = ['application/pdf'];
	const imgSize = file.size / 1024 / 1024 < 50;
	const imgType = fileType.includes(file.type);
	if (!imgType) {
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: '上传文件不符合所需的格式！',
				type: 'warning',
			});
		}, 0);
	}
	if (!imgSize) {
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传图片大小不能超过 50M！`,
				type: 'warning',
			});
		}, 0);
	}
	return imgType && imgSize;
};
const handleExceed: UploadProps['onExceed'] = (uploadFile) => {
	console.log('uploadFile', uploadFile);
	useMessage().error('上传附件最多3个文件！');
};
const submitForm = async (formEl: FormInstance | undefined) => {
	console.log('type.value', type.value);
	uploadContrac.value = false;
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			// contractName
			console.log('submit!', ruleForm.value);
			console.log('contractList.value!', contractList.value);
			if (!contractList.value.length && type.value === 'edit' && !isAdd.value) {
				ruleForm.value.contractUrls = [];
			} else if (!isEditChangeFileList.value && type.value === 'edit' && !isAdd.value) {
				ruleForm.value.contractUrls = null;
			} else {
				ruleForm.value.contractUrls = [];
				contractList.value.forEach((item: any) => {
					console.log('item', item);
					let obj = {
						contractName: '',
						contractUrl: '',
					};
					if (item?.response?.data) {
						obj = {
							contractName: item.response.data.fileName,
							contractUrl: item.response.data.url,
						};
						ruleForm.value.contractUrls.push(obj);
					} else {
						console.log('item.url', item.url);
						obj = {
							contractName: item.name,
							contractUrl: item.url,
						};
						ruleForm.value.contractUrls.push(obj);
					}
					if (!obj.contractUrl) {
						useMessage().error('合同文件上传中，请稍后提交');
						uploadContrac.value = true;
						return;
					}
				});
			}
			if (uploadContrac.value) return;
			try {
				const str = type.value == 'add' ? `确认信息无误并提交吗?` : `确认要变更信息吗？`;
				await useMessageBox().confirm(str, '提示', '确定');
			} catch {
				ruleForm.value.contractUrls = [];
				return;
			}
			console.log('type.value', type.value);
			try {
				let res =
					type.value == 'edit' && !isAdd.value ? await getPlatformMerchantUpdate(ruleForm.value) : await getPlatformMerchantAdd(ruleForm.value);
				if (res.code === 0) {
					useMessage().success('提交成功，请前往列表查看');
					router.push('/platformEntry/merchantManagement/merchantList/index');
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
	router.push('/platformEntry/merchantManagement/merchantList/index');
};
</script>
<style scoped>
.demo-container {
	width: 60%;
	margin: 0 auto;
}
.title {
	font-size: 18px;
}
.form-title {
	font-size: 16px;
	font-weight: 500;
	display: flex;
	align-items: center;
	margin: 10px 0 10px 0;
	div {
		flex: 1;
		border-bottom: 1px solid #e6e6e6;
		margin-left: 15px;
	}
}
.uploader-text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #999;
	font-size: 12px;
	.avatar-uploader-icon {
		margin-bottom: 5px;
		font-size: 32px;
	}
}
.btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

:deep(.upload-demo .el-upload-dragger) {
	width: 250px;
}
:deep(.el-input-number .el-input__inner) {
	text-align: left;
}
:deep(.el-input-number__decrease) {
	display: none;
}
:deep(.el-input-number__increase) {
	display: none;
}
</style>
