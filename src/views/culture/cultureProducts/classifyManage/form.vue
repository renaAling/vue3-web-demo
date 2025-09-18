<template>
	<section class="basic-info">
		<el-card>
			<p class="title">基础信息</p>
			<el-form ref="basicInfoFormRef" :model="basicInfoForm" :rules="basicInfoRules" label-width="100px">
				<el-form-item label="商品名称：" prop="spuName" class="custom-width">
					<el-input v-model="basicInfoForm.spuName" placeholder="请输入商品标题" clearable maxlength="30" />
				</el-form-item>
				<el-form-item label="卖点推荐：" class="custom-width">
					<el-input v-model="basicInfoForm.sellingPoint" type="textarea" resize="none" placeholder="请输入卖点推荐" rows="4" maxlength="100" />
				</el-form-item>
				<el-form-item label="供应商：" prop="supplierCode" class="custom-width">
					<el-select v-model="basicInfoForm.supplierCode" placeholder="请选择供应商" clearable filterable>
						<el-option v-for="item in supplierList" :label="item.name" :value="item.code" :key="item.code" />
					</el-select>
				</el-form-item>
				<el-form-item label="轮播图片：" prop="imageUrls">
					<div class="upload-box">
						<el-upload
							action="#"
							ref="upload"
							class="upload-box-inner"
							v-model="basicInfoForm.imageUrls"
							:file-list="bannerFileList"
							:http-request="handleHttpUpload"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-exceed="handleExceed"
							:on-remove="handleRemove"
							:multiple="true"
							:limit="9"
							:before-upload="beforeUpload"
							:on-success="uploadSuccess"
							:on-error="uploadError"
							:disabled="disabledBannerUpload"
						>
							<el-icon>
								<Plus />
							</el-icon>
							<template #tip>
								<div>
									<span>注意：默认第一张图为轮播主图</span>
								</div>
							</template>
						</el-upload>
						<!-- @change="changeMainPicture" -->
						<!-- <el-radio v-model="radio" :label="item.isMain" v-for="item in basicInfoForm.imageUrls" :key="item">选择主图</el-radio> -->
					</div>

					<el-image-viewer :teleported="true" v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="previewImageUrl" />
				</el-form-item>
			</el-form>
		</el-card>
	</section>
	<section class="logistics-methods">
		<el-card>
			<p class="title">物流方式</p>
			<el-form ref="logisticsMethodsFormRef" :model="logisticsMethodsForm" :rules="logisticsMethodsRules" label-width="140px">
				<el-form-item label="支持的物流方式：" prop="logisticsType">
					<el-checkbox-group v-model="logisticsMethodsForm.logisticsType">
						<el-checkbox :label="1">邮寄</el-checkbox>
						<el-checkbox :label="2">网点自提</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</el-card>
	</section>
	<section class="product-standards">
		<el-card>
			<p class="title">商品规格</p>
			<el-form ref="productStandardsFormRef" :model="productStandardsForm" :rules="productStandardsFormRules">
				<el-table :data="productStandardsForm.tableData" style="width: 100%" border class="product-specifications">
					<el-table-column prop="id" label="ID" width="150" />
					<el-table-column prop="skuImageUrl" label="规格图">
						<template #default="{ row, $index }">
							<el-form-item>
								<div class="img-box">
									<div v-if="row.skuImageUrl" class="view-img">
										<img :src="row.skuImageUrl" class="operate-img" />
										<el-icon style="cursor: pointer; color: red" @click="handleDeleteImage($index)"><Delete /></el-icon>
									</div>
									<el-upload
										v-else
										class="upload-box"
										list-type="picture-card"
										action="#"
										:show-file-list="false"
										:http-request="handleTableImageUpload.bind(null, row, $index)"
										:on-remove="handleRemoveProduct"
										:on-success="producUuploadSuccess"
										:before-upload="beforeUpload"
									>
										<el-icon><Plus /></el-icon>
									</el-upload>
								</div>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="skuName" label="规格名称" width="200">
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.skuName`" :rules="productStandardsFormRules.skuName">
								<el-input
									placeholder="请输入规格名称"
									v-model="row.skuName"
									@blur="saveEdit(row, $index)"
									@keyup.enter="saveEdit(row, $index)"
									maxlength="10"
								/>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="sellingPrice" label="正常售价" width="160">
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.sellingPrice`" :rules="productStandardsFormRules.sellingPrice">
								<el-input
									placeholder="请输入正常售价"
									v-model="row.sellingPrice"
									@blur="saveEdit(row, $index)"
									@keyup.enter="saveEdit(row, $index)"
								/>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="employeePrice" label="员工价" width="160">
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.employeePrice`" :rules="productStandardsFormRules.employeePrice">
								<el-input placeholder="请输入员工价" v-model="row.employeePrice" @blur="saveEdit(row, $index)" @keyup.enter="saveEdit(row, $index)" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="inventory" label="可用库存" width="160">
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.inventory`" :rules="productStandardsFormRules.inventory">
								<el-input placeholder="请输入可用库存" v-model="row.inventory" @blur="saveEdit(row, $index)" @keyup.enter="saveEdit(row, $index)" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="120">
						<template #default="{ row, $index }">
							<el-button text type="primary" @click="handleCopyRow(row)">复制</el-button>
							<el-button text type="primary" @click="handleDeleteRow(row, $index)" :disabled="productStandardsForm.tableData.length === 1"
								>删除</el-button
							>
						</template>
					</el-table-column>
				</el-table>
			</el-form>

			<div class="add-standards-btn">
				<el-button @click="addStandards" type="primary">添加规格</el-button>
			</div>
		</el-card>
	</section>
	<section class="basic-info">
		<el-card>
			<p class="title">商品详情</p>
			<el-upload
				action="#"
				v-model="detailUrls"
				:file-list="detailFileList"
				:http-request="handleHttpUpload"
				list-type="picture-card"
				:on-preview="handlePictureCardPreview"
				:on-remove="handleRemoveDetailFile"
				:on-exceed="handleExceed"
				:multiple="true"
				:limit="9"
				:before-upload="beforeUpload"
				:on-success="uploadDetailFileSuccess"
				:on-error="uploadError"
			>
				<el-icon>
					<Plus />
				</el-icon>
			</el-upload>
			<el-image-viewer :teleported="true" v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="previewImageUrl" />
		</el-card>
	</section>
	<footer class="footer">
		<el-button type="primary">预览</el-button>
		<el-button type="primary" @click="submitForm">保存</el-button>
		<el-button @click="handleCancel">取消</el-button>
	</footer>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { reactive, ref, watch, getCurrentInstance } from 'vue';
import type { FormInstance, FormRules, UploadUserFile, UploadProps, UploadRequestOptions, UploadFile, UploadFiles } from 'element-plus';
import { ElNotification } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { uploadImage } from '/@/api/culture/common';
import { basicInfoTypes, logisticsMethodsTypes, productStandardsTypes } from './types';
import { getSupplierList, productSaveOrUpdate } from '/@/api/culture/products';

const basicInfoFormRef = ref<FormInstance>();
const logisticsMethodsFormRef = ref<FormInstance>();
const productStandardsFormRef = ref<FormInstance>();

const router = useRouter();

const basicInfoForm = reactive<basicInfoTypes>({
	spuCode: null,
	spuName: '',
	sellingPoint: '',
	supplierCode: '',
	imageUrls: [] as any,
});

const logisticsMethodsForm = reactive<logisticsMethodsTypes>({
	logisticsType: [],
});
const productStandardsForm = reactive({
	tableData: [
		{
			skuCode: null,
			skuName: '',
			sellingPrice: '',
			employeePrice: '',
			inventory: '',
			skuImageUrl: '',
		},
	] as any,
});
const radio = ref(false);

// 供应商列表
const supplierList = ref([]) as any;

// 商品详情 url列表
let detailUrls = ref([]) as any;

const getSuppliersList = async () => {
	let res = await getSupplierList();
	supplierList.value = res.data;
};

const validateSelectPicture = (rule: any, value: any, callback: any) => {
	if (basicInfoForm.imageUrls.length <= 0) {
		callback(new Error('请选择一张设置为轮播主图'));
	} else {
		if (!basicInfoFormRef.value) return;
		basicInfoFormRef.value.validateField('imageUrls');
		callback();
	}
};

const basicInfoRules = reactive<FormRules<basicInfoTypes>>({
	spuName: [
		{ required: true, message: '请输入商品名称', trigger: 'blur' },
		{ min: 2, max: 40, message: '字符不能超过 40 字', trigger: 'blur' },
	],
	supplierCode: [
		{
			required: true,
			message: '请选择供应商',
			trigger: 'change',
		},
	],
	imageUrls: [
		{
			type: 'array',
			validator: validateSelectPicture,
			required: true,
			trigger: 'change',
		},
	],
});

const logisticsMethodsRules = reactive<FormRules<logisticsMethodsTypes>>({
	logisticsType: [
		{
			type: 'array',
			required: true,
			message: '请选择支持的物流方式',
			trigger: 'change',
		},
	],
});

const checkPriceValidator = (rule: any, value: any, callback: any) => {
	const pricePattern = /^\d+(\.\d{1,2})?$/;
	if (!pricePattern.test(value) || parseFloat(value) > 100000) {
		callback(new Error('请输入100000以内的正数，最多保留两位小数'));
	} else {
		callback();
	}
};

const checkKucunValidator = (rule: any, value: any, callback: any) => {
	const integerPattern = /^(?:[1-9]\d{0,4}|100000)$/;
	if (!integerPattern.test(value)) {
		callback(new Error('请输入100000以内的正整数'));
	} else {
		callback();
	}
};
const productStandardsFormRules = reactive<FormRules<productStandardsTypes>>({
	skuName: [
		{
			required: true,
			message: '请输入规格名称',
			trigger: 'blur',
		},
	],
	sellingPrice: [
		{
			validator: checkPriceValidator,
			required: true,
			message: '请输入正常售价',
			trigger: 'blur',
		},
	],
	employeePrice: [
		{
			validator: checkPriceValidator,
			required: true,
			message: '请输入员工价',
			trigger: 'blur',
		},
	],
	inventory: [
		{
			validator: checkKucunValidator,
			required: true,
			message: '请输入可用库存',
			trigger: 'blur',
		},
	],
});

const bannerFileList = ref<UploadUserFile[]>([]);
const detailFileList = ref<UploadUserFile[]>([]);

// 多文件上传组件配置;
const uploadImageConfig = {
	fileSize: 20,
	fileType: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
};

// 预览图片
const imgViewVisible = ref(false);
const previewImageUrl = ref([]) as any;
// 图片上传相关
const handleHttpUpload = async (options: UploadRequestOptions) => {
	console.log('options', options);
	let formData = new FormData();
	formData.append('file', options.file);
	try {
		const { data } = await uploadImage(formData);
	} catch (error) {
		options.onError(error as any);
	}
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

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
	const baseURL = import.meta.env.VITE_API_URL;
	if (uploadFile && uploadFile.url) {
		previewImageUrl.value = uploadFile.url.includes('http') ? [uploadFile.url] : [baseURL + uploadFile.url];
		imgViewVisible.value = true;
	}
};
// 超出文件上传个数限制
const handleExceed: UploadProps['onExceed'] = (files) => {
	ElNotification({
		title: '温馨提示',
		message: '最多只能上传9张图片！',
		type: 'error',
	});
};

const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
	console.log('uploadFile', uploadFile);
	basicInfoForm.imageUrls = basicInfoForm.imageUrls.filter((item: any) => item.uid !== uploadFile.uid);
	console.log('basicInfoForm.imageUrls', basicInfoForm.imageUrls);
	console.log('bannerFileList', bannerFileList);
};

const handleSetMain = (file: UploadFile) => {
	basicInfoForm.imageUrls.forEach((item: any) => {
		item.uid === file.uid ? (item.isMain = true) : (item.isMain = false);
	});
	console.log('basicInfoForm', basicInfoForm);
};

const handleRemoveDetailFile: UploadProps['onRemove'] = (uploadFile) => {
	detailUrls.vaue = detailUrls.value.filter((item: any) => item.uid !== uploadFile.uid);
};
const disabledBannerUpload = ref(false);
watch(
	() => basicInfoForm.imageUrls,
	(val) => {
		if (val.length >= 9) {
			disabledBannerUpload.value = true;
		} else {
			disabledBannerUpload.value = false;
		}
	},
	{
		immediate: true,
		deep: true,
	}
);

/**
 * @description 图片上传成功
 * */
const uploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传成功！',
		type: 'success',
	});
	basicInfoForm.imageUrls.push({
		isMain: false,
		url: uploadFile.url,
		uid: uploadFile.uid,
	});
	console.log('basicInfoForm', basicInfoForm);
};

const uploadDetailFileSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传成功！',
		type: 'success',
	});
	detailUrls.value.push(uploadFile);
};

/**
 * @description 图片上传错误
 * */
const uploadError = () => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传失败，请您重新上传！',
		type: 'error',
	});
};

const handleTableImageUpload = async (row: any, index: number, options: UploadRequestOptions) => {
	let formData = new FormData();
	formData.append('file', options.file);
	try {
		const { data } = await uploadImage(formData);

		const baseURL = import.meta.env.VITE_API_URL;
		productStandardsForm.tableData[index].skuImageUrl = data.url.includes('http') ? data.url : baseURL + data.url;
	} catch (error) {
		options.onError(error as any);
	}
};
const handleRemoveProduct: UploadProps['onRemove'] = (uploadFile) => {
	productStandardsForm.tableData.filter((item: any) => item.skuImageUrl !== uploadFile.url);
};

const producUuploadSuccess = (row: any, index: number, response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传成功！',
		type: 'success',
	});
};

const handleDeleteImage = (index: number) => {
	productStandardsForm.tableData[index].skuImageUrl = '';
};

const saveEdit = async (row: any, index: any) => {
	console.log('row', row);
	let res = await productStandardsFormRef.value?.validate();
	if (res) {
		console.log(res);
	} else {
		console.log('未通过校验');
	}
	// try {

	// 	console.log('表单1校验通过');
	// 	// await this.$refs.form2Ref.validate();
	// 	// console.log('表单2校验通过');
	// 	// //都校验成功之后，这里可以发请求
	// 	// this.$message.success('表单校验成功');
	// } catch (error) {
	// 	console.error('表单校验失败', error);
	// }

	// 如果id存在，即代表更新
	// if (row && row.id) {
	// 	tableData = tableData.map((item: any) => {
	// 		if (item.id === row.id) {
	// 			return {
	// 				id: row.id,
	// 				name: row.name,
	// 				price: row.price,
	// 				innerPrice: row.innerPrice,
	// 				kucun: row.kucun,
	// 				skuImageUrl: row.skuImageUrl,
	// 			};
	// 		}
	// 	});
	// }
};

const addStandards = () => {
	productStandardsForm.tableData.push({
		skuName: '',
		sellingPrice: '',
		employeePrice: '',
		inventory: '',
		skuImageUrl: '',
		skuCode: null,
	});
};

const handleCopyRow = (row: any) => {
	productStandardsForm.tableData.push({
		skuName: row.skuName,
		sellingPrice: row.sellingPrice,
		employeePrice: row.employeePrice,
		inventory: row.inventory,
		skuImageUrl: row.skuImageUrl,
		skuCode: row.skuCode ? row.skuCode : null,
	});
};

const handleDeleteRow = (row: any, index: number) => {
	productStandardsForm.tableData.splice(index, 1);
};

const changeMainPicture = (item: any) => {
	item.isMain = true;
};

const submitForm = async (formEl: FormInstance | undefined) => {
	let params = {
		spuCode: basicInfoForm.spuCode,
		spuName: basicInfoForm.spuName,
		sellingPoint: basicInfoForm.sellingPoint,
		supplierCode: basicInfoForm.supplierCode,
		imageUrls: basicInfoForm.imageUrls.map((item: any) => {
			return {
				imageUrl: item.url,
				isMain: false,
			};
		}),
		logisticsType: logisticsMethodsForm.logisticsType.length === 2 ? 3 : logisticsMethodsForm.logisticsType.toString(),
		specSkus: productStandardsForm.tableData,
		details: detailUrls.value.map((item: any) => {
			return item.url;
		}),
	};
	// 因业务实现问题，需要特殊处理
	params.imageUrls[0].isMain = true;

	try {
		const valid = await Promise.all([
			basicInfoFormRef.value?.validateField(),
			logisticsMethodsFormRef.value?.validateField(),
			productStandardsFormRef.value?.validateField(),
		]);
		console.log('valid', valid); // [true,true]
		if (valid.every((result) => result === true)) {
			productSaveOrUpdate(params).then((res) => {
				console.log('res', res);
			});
		}
	} catch (error) {}

	// if (!formEl) return;
	// await formEl.validate((valid, fields) => {
	// 	if (valid) {
	// 		console.log('submit!');
	// 	} else {
	// 		console.log('error submit!', fields);
	// 	}
	// });
};

// 取消
const handleCancel = () => {
	router.push('/culture/cultureProducts/classifyManage/index');
};

onMounted(() => {
	getSuppliersList();
});
</script>
<style lang="scss">
section {
	margin-bottom: 28px;
}

.custom-width {
	width: 330px;
}
.upload-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	.upload-box-inner {
		.thumbnail {
			position: relative;
			.badge {
				position: absolute; /* 绝对定位 */
				top: 0; /* 位于右上角 */
				right: 0;
				background-color: red; /* 角标背景色 */
				color: white; /* 角标文字颜色 */
				padding: 2px 5px; /* 角标内边距 */
				border-radius: 10px; /* 角标圆角 */
				font-size: 12px; /* 角标字号 */
			}
		}
	}
	.el-radio {
		// padding-left: 40px;
	}
}

.title {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: #1d2129;
	margin-bottom: 16px;
}
.product-specifications {
	margin-bottom: 36px;
	.img-box {
		width: 100%;
		.view-img {
			display: flex;
			flex-direction: column;
			align-items: center;
			.operate-img {
				width: 100%;
				position: relative;
				margin-bottom: 4px;
				&:after {
					position: absolute;
					content: '';
					top: 0;
					right: 0;
					border-radius: 50%;
					background: red;
					width: 20px;
					height: 20px;
				}
			}
		}
		.upload-box {
			width: 100%;
			height: 120px;

			.el-upload--picture-card {
				width: 100%;
				height: 100%;
			}
		}
	}
}
.add-standards-btn {
	text-align: center;
}

.footer {
	text-align: center;

	.el-button {
		width: 68px;
	}
}

// .basic-info {
// }
// .logistics-methods {
// }
</style>
