<template>
	<section class="basic-info">
		<el-card>
			<p class="title">基础信息</p>
			<el-form ref="basicInfoFormRef" :model="basicInfoForm" :rules="basicInfoRules" label-width="100px" :disabled="isDisabled">
				<el-form-item label="商品名称：" prop="spuName" class="custom-width">
					<el-input v-model="basicInfoForm.spuName" placeholder="请输入商品标题" clearable maxlength="30" />
				</el-form-item>
				<el-form-item label="卖点推荐：" class="custom-width">
					<el-input v-model="basicInfoForm.sellingPoint" type="textarea" resize="none" placeholder="请输入卖点推荐" rows="4" maxlength="100" />
				</el-form-item>
				<el-form-item label="供应商：" prop="supplierCode" class="custom-width">
					<el-select v-model="basicInfoForm.supplierCode" placeholder="请选择供应商" clearable filterable>
						<el-option v-for="item in supplierList" :label="item.name" :value="item.code" :key="item.code" :disabled="item.disabled" />
					</el-select>
				</el-form-item>
				<el-form-item label="轮播图片：" prop="imageUrls">
					<template v-if="route.query.type !== 'detail'">
						<div class="upload-container">
							<div class="upload-item">
								<upload-img v-for="(item, index) in basicInfoForm.imageUrls" :key="index" v-model:imageUrl="item.imageUrl" dir="culture">
								</upload-img>
								<el-button v-if="!disabledBannerUpload" @click="handleCreateUploadComponent" type="primary"> 添加上传图片 </el-button>
							</div>
							<div>注意：第一张图默认为主图</div>
						</div>
					</template>
					<template v-else>
						<div class="picture-list">
							<img v-for="item in basicInfoForm.imageUrls" :key="item" :src="item.imageUrl" alt="" />
						</div>
					</template>
				</el-form-item>
			</el-form>
		</el-card>
	</section>
	<section class="logistics-methods">
		<el-card>
			<p class="title">{{ merchandiseType === 'real' ? '物流方式' : '特殊配置' }}</p>
			<el-form
				ref="logisticsMethodsFormRef"
				:model="logisticsMethodsForm"
				:rules="logisticsMethodsRules"
				:label-width="merchandiseType === 'real' ? '140px' : '100px'"
				:disabled="isDisabled"
			>
				<el-form-item label="支持的物流方式：" prop="logisticsType" v-if="merchandiseType === 'real'">
					<el-checkbox-group v-model="logisticsMethodsForm.logisticsType">
						<el-checkbox :label="1">邮寄</el-checkbox>
						<el-checkbox :label="2">网点自提</el-checkbox>
						<el-checkbox :label="3"
							>员工单次购买满<el-input
								v-model="basicInfoForm.piece"
								type="text"
								placeholder="请输入"
								maxlength="9"
								style="width: 100px; margin: 0 10px"
							/>件，由专人配送</el-checkbox
						>
					</el-checkbox-group>
				</el-form-item>
				<el-row :getter="24">
					<el-col :span="12">
						<el-form-item label="领取链接：" prop="claimLink">
							<el-input v-model="basicInfoForm.claimLink" type="text" placeholder="请输入领取链接" maxlength="200" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</section>
	<section class="product-standards">
		<el-card>
			<p class="title">商品规格</p>
			<el-form ref="productStandardsFormRef" :model="productStandardsForm" :rules="productStandardsFormRules" :disabled="isDisabled">
				<el-table :data="productStandardsForm.tableData" style="width: 100%" border class="product-specifications">
					<el-table-column prop="skuCode" label="ID" width="210" />
					<el-table-column prop="skuImage" label="规格图" width="220">
						<template #default="{ row, $index }">
							<el-form-item>
								<div class="img-box">
									<div v-if="row.skuImage" class="view-img">
										<img :src="row.skuImage" class="operate-img" />
										<el-icon style="cursor: pointer; color: red" @click="handleDeleteImage($index)">
											<Delete />
										</el-icon>
									</div>
									<el-upload
										v-else
										class="upload-box"
										list-type="picture-card"
										action="#"
										:show-file-list="false"
										:http-request="handleTableImageUpload.bind(null, row, $index)"
										:on-success="producUuploadSuccess"
										accept="image/jpeg,image/png,image/gif,image/jpg"
										:before-upload="beforeUpload"
									>
										<el-icon>
											<Plus />
										</el-icon>
									</el-upload>
								</div>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="skuName" label="规格名称" :width="merchandiseType === 'real' ? 200 : 175">
						<template #header>
							<span>规格名称<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.skuName`" :rules="productStandardsFormRules.skuName">
								<el-input placeholder="请输入规格名称" v-model="row.skuName" @blur="saveEdit" @keyup.enter="saveEdit" maxlength="10" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="sellingPrice" label="正常售价" :width="merchandiseType === 'real' ? 200 : 175">
						<template #header>
							<span>正常售价<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.sellingPrice`" :rules="productStandardsFormRules.sellingPrice">
								<el-input placeholder="请输入正常售价" v-model="row.sellingPrice" @blur="saveEdit" @keyup.enter="saveEdit" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="employeePrice" label="员工价" :width="merchandiseType === 'real' ? 200 : 175">
						<template #header>
							<span>员工价<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.employeePrice`" :rules="productStandardsFormRules.employeePrice">
								<el-input placeholder="请输入员工价" v-model="row.employeePrice" @blur="saveEdit" @keyup.enter="saveEdit" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="inventory" label="可用库存" :width="merchandiseType === 'real' ? 200 : 175">
						<template #header>
							<span>可用库存<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.inventory`" :rules="productStandardsFormRules.inventory">
								<el-input placeholder="请输入可用库存" v-model="row.inventory" @blur="saveEdit" @keyup.enter="saveEdit" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="thirdSkuCode" label="产品绑定" width="175" v-if="merchandiseType === 'virtual'">
						<template #header>
							<span>产品绑定<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.thirdSkuCode`" :rules="productStandardsFormRules.thirdSkuCode">
								<el-select v-model="row.thirdSkuCode" placeholder="请选择套餐" clearable filterable>
									<el-option
										v-for="item in culturalCardList"
										:label="item.cardPackage"
										:value="item.level"
										:key="item.level"
										:disabled="item.disabled"
									/>
								</el-select>
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
				<el-button @click="addStandards" type="primary" :disabled="isDisabled">添加规格</el-button>
			</div>
		</el-card>
	</section>
	<section class="goods-detail">
		<el-card>
			<p class="title">商品详情</p>
			<template v-if="route.query.type !== 'detail'">
				<div class="upload-item">
					<upload-img v-for="(item, index) in detailUrls" :key="index" v-model:imageUrl="item.imageUrl" dir="culture">{{ item }} </upload-img>
					<el-button v-if="detailUrls.length < 9" @click="handleCreateDetailUpload" type="primary">添加上传图片</el-button>
				</div>
			</template>
			<template v-else>
				<div class="picture-list">
					<img v-for="item in detailUrls" :key="item.imageUrl" :src="item.imageUrl" alt="" />
				</div>
			</template>
		</el-card>
	</section>
	<footer class="footer">
		<el-button type="primary" @click="handlePreview">预览</el-button>
		<el-button type="primary" @click="submitForm" :disabled="isDisabled" :loading="loading">保存</el-button>
		<el-button @click="handleCancel">取消</el-button>
	</footer>

	<PreviewDialog ref="previewDialogRef" :productInfo="productInfo" />
</template>

<script setup lang="ts" name="cultureProductsForm">
import { reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules, UploadProps, UploadRequestOptions } from 'element-plus';
import { ElNotification, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { uploadImage } from '/@/api/culture/common';
import { basicInfoTypes, logisticsMethodsTypes, productStandardsTypes } from './types';
import { getSupplierList, getCulturalCardList, productSaveOrUpdate, previewProductDetail, getDetail } from '/@/api/culture/products';
import PreviewDialog from './dialog.vue';
import { useRoute } from 'vue-router';
let route = useRoute(); // 生成组件唯一id

const basicInfoFormRef = ref<FormInstance>();
const logisticsMethodsFormRef = ref<FormInstance>();
const productStandardsFormRef = ref<FormInstance>();
const loading = ref(false);
1;
const router = useRouter();
// 判断商品是虚拟商品virtual还是真实商品real
const merchandiseType = ref<'real' | 'virtual'>('real');
// const radio = ref(true);

const basicInfoForm = reactive<basicInfoTypes>({
	spuCode: null,
	piece: null,
	spuName: '',
	sellingPoint: '',
	claimLink: '',
	supplierCode: '',
	supplierName: '',
	imageUrls: [
		{
			imageUrl: '',
			isMain: false,
		},
	] as any,
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
			skuImage: '',
		},
	] as any,
});

const previewDialogRef = ref();

// 供应商列表
const supplierList = ref([]) as any;
// 获取三方票卡列表
const culturalCardList = ref([]) as any;

// 商品详情 url列表
let detailUrls = ref([
	{
		imageUrl: '',
	},
]);

const getSuppliersList = async () => {
	let res = await getSupplierList();
	supplierList.value = res.data;
};
// 获取三方票卡列表
const getCulturalCardsList = async () => {
	let res = await getCulturalCardList();
	culturalCardList.value = res.data;
};

const validateSelectPicture = (rule: any, value: any, callback: any) => {
	if (!value[0].imageUrl) {
		callback(new Error('请选择一张设置为轮播主图'));
	} else {
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
	if (!pricePattern.test(value) || parseFloat(value) >= 100000) {
		callback(new Error('请输入100000以内的正数，最多保留两位小数'));
	} else {
		callback();
	}
};

const checkKucunValidator = (rule: any, value: any, callback: any) => {
	const integerPattern = /^(?:0|[1-9]\d{0,4}|99999)$/;
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
	thirdSkuCode: [
		{
			validator: checkKucunValidator,
			required: merchandiseType.value === 'virtual',
			message: '请选择套餐',
			trigger: 'blur',
		},
	],
	// 表单验证
});

// 多文件上传组件配置;
const uploadImageConfig = {
	fileSize: 20,
	fileType: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
};

// 手动添加上传轮播图按钮
const handleCreateUploadComponent = () => {
	basicInfoForm.imageUrls.push({
		imageUrl: '',
		isMain: false,
	});
};

// 手动添加上传商品详情按钮
const handleCreateDetailUpload = () => {
	detailUrls.value.push({
		imageUrl: '',
	});
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

const handleTableImageUpload = async (row: any, index: number, options: UploadRequestOptions) => {
	let formData = new FormData();
	formData.append('file', options.file);
	formData.append('dir', 'culture');
	try {
		const { data } = await uploadImage(formData);

		productStandardsForm.tableData[index].skuImage = data.url;
		// console.log('productStandardsForm.tableData', productStandardsForm.tableData);
	} catch (error) {
		options.onError(error as any);
	}
};

const producUuploadSuccess = () => {
	ElNotification({
		title: '温馨提示',
		message: '图片上传成功！',
		type: 'success',
	});
};

const handleDeleteImage = (index: number) => {
	productStandardsForm.tableData[index].skuImage = '';
};

const saveEdit = async () => {
	let res = await productStandardsFormRef.value?.validate();
	if (res) {
		// console.log(res);
	} else {
		// console.log('未通过校验');
	}
};

const addStandards = () => {
	productStandardsForm.tableData.push({
		skuName: '',
		sellingPrice: '',
		employeePrice: '',
		inventory: '',
		skuImage: '',
		skuCode: null,
	});
};

const handleCopyRow = (row: any) => {
	productStandardsForm.tableData.push({
		skuName: row.skuName,
		sellingPrice: row.sellingPrice,
		employeePrice: row.employeePrice,
		inventory: row.inventory,
		skuImage: row.skuImage,
		skuCode: null,
	});
};

const handleDeleteRow = (row: any, index: number) => {
	productStandardsForm.tableData.splice(index, 1);
};

const productInfo = reactive({
	carousels: [] as any, // 轮播位列表，暂时只展示第一张图
	spuName: '',
	sellingPoint: '',
	skus: [] as any,
	lologisticsType: [] as any,
	details: [] as any,
});

const handlePreview = () => {
	if (route.query.type === 'edit' || route.query.type === 'detail') {
		previewProductDetail(route.query.id as string).then((res) => {
			previewDialogRef.value.openDialog(res.data);
		});
	} else {
		if (route.query.type === 'virtual') {
			console.log('虚拟发货');
		}
		// 针对新增的预览操作进行纯前端拼接
		if (
			basicInfoForm.imageUrls &&
			basicInfoForm.spuName &&
			basicInfoForm.sellingPoint &&
			productStandardsForm.tableData &&
			logisticsMethodsForm.logisticsType &&
			detailUrls.value
		) {
			productInfo.carousels = basicInfoForm.imageUrls.filter((item) => item.imageUrl);
			productInfo.spuName = basicInfoForm.spuName;
			productInfo.sellingPoint = basicInfoForm.sellingPoint as string;
			productInfo.skus = productStandardsForm.tableData;
			productInfo.lologisticsType = logisticsMethodsForm.logisticsType;
			productInfo.details = detailUrls.value;
			previewDialogRef.value.openDialog(productInfo);
		} else {
			ElNotification({
				title: '温馨提示',
				message: '请填写完所有的表单项再预览！',
				type: 'error',
			});
			return;
		}
	}
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

// 判断数组里某个属性的值是否相同，true代表有，false代表没有
function hasDuplicateNames(arr: { skuName: string }[]): boolean {
	const names = new Map<string, boolean>();
	for (const item of arr) {
		if (names.has(item.skuName)) {
			return true;
		}
		names.set(item.skuName, true);
	}

	return false;
}

const submitForm = async () => {
	if (merchandiseType.value === 'virtual') {
		logisticsMethodsForm.logisticsType = ['5'];
	}
	try {
		const valid = await Promise.all([
			basicInfoFormRef.value?.validateField(),
			logisticsMethodsFormRef.value?.validateField(),
			productStandardsFormRef.value?.validateField(),
		]);

		let tableValid = false;
		if (productStandardsForm.tableData.length > 1) {
			tableValid = hasDuplicateNames(productStandardsForm.tableData);
		}
		if (tableValid) {
			ElNotification({
				title: '温馨提示',
				message: '同一SPU下不能拥有重复的规格名称，请重新输入！',
				type: 'error',
			});
			return;
		}

		if (valid.every((result) => result === true) && !tableValid) {
			let params = {
				...basicInfoForm,
				spuCode: basicInfoForm.spuCode ? basicInfoForm.spuCode : null,
				spuName: basicInfoForm.spuName,
				sellingPoint: basicInfoForm.sellingPoint,
				supplierCode: basicInfoForm.supplierCode,
				imageUrls: basicInfoForm.imageUrls.filter((item: any) => item.imageUrl),
				logisticsType: logisticsMethodsForm.logisticsType.length === 2 ? 3 : logisticsMethodsForm.logisticsType.toString(),
				specSkus: productStandardsForm.tableData,
				details: detailUrls.value.filter((item: any) => item.imageUrl),
			};
			params.imageUrls = params.imageUrls.map((item) => {
				if (item.imageUrl.includes('http')) {
					return {
						imageUrl: item.imageUrl,
						isMain: false,
					};
				} else {
					return {
						imageUrl: item.imageUrl,
						isMain: false,
					};
				}
			});

			params.details = params.details.map((item: any) => {
				if (item.imageUrl.includes('http')) {
					return item.imageUrl;
				} else {
					return item.imageUrl;
				}
			});
			console.log('params', params);
			loading.value = true;
			ElMessageBox.confirm(`确认创建则创建商品，生成商品SPU?`, '保存', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					productSaveOrUpdate(params)
						.then(() => {
							loading.value = false;
							router.push('/culture/cultureProducts/productsManage/index');
						})
						.catch(() => {
							loading.value = false;
						});
				})
				.catch(() => {
					loading.value = false;
				});
		}
	} catch (error) {
		moveToErr();
		loading.value = false;
	}
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
				router.push('/culture/cultureProducts/productsManage/index');
			})
			.catch(() => {
				// console.log('err', err);
			});
	} else {
		router.push('/culture/cultureProducts/productsManage/index');
	}
};

const isDisabled = ref(false);

onMounted(() => {
	getSuppliersList();
	getCulturalCardsList();
	if (route.query.type === 'virtual') {
		// 新增的是虚拟商品
		merchandiseType.value = 'virtual';
	} else merchandiseType.value = 'real';
	if ((route.query.id as string) && route.query.type) {
		getDetail(route.query.id as string).then((res) => {
			route.query.type === 'detail' ? (isDisabled.value = true) : (isDisabled.value = false);
			if (res.type === '2') {
				// type为2是虚拟商品
				merchandiseType.value = 'virtual';
			} else merchandiseType.value = 'real';
			const { spuName, spuCode, sellingPoint, supplierCode, supplierName, imageUrls, logisticsType, specSkus, details, claimLink } = res.data;
			// 针对供应商停用后，特殊处理供应商列表展示 code无 name的情况
			const arr = supplierList.value.filter((item: any) => item.code === supplierCode);
			// console.log('arr', arr);
			if (arr.length == 0) {
				supplierList.value.push({
					name: supplierName + '（已停用）',
					code: supplierCode,
					disabled: true,
				});
			}
			basicInfoForm.spuName = spuName;
			basicInfoForm.spuCode = spuCode;
			basicInfoForm.sellingPoint = sellingPoint;
			basicInfoForm.supplierCode = supplierCode;
			basicInfoForm.claimLink = claimLink;
			basicInfoForm.imageUrls = imageUrls.map((item: any) => {
				return {
					isMain: item.isMain,
					imageUrl: item.imageUrl,
				};
			});
			logisticsMethodsForm.logisticsType = logisticsType === 3 ? [1, 2] : [logisticsType];
			productStandardsForm.tableData = specSkus;
			detailUrls.value = details.map((item: any) => {
				return {
					imageUrl: item,
				};
			});
			// console.log('detailUrls', detailUrls.value);
		});
	}
});
</script>
<style lang="scss">
section {
	margin-bottom: 28px;
}

.custom-width {
	width: 330px;
}

.upload-container {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	flex-direction: column;

	.upload-item {
		display: flex;
		align-items: center;
		flex-wrap: wrap;

		> div {
			margin-right: 8px;
			margin-bottom: 8px;
		}
	}
}

.picture-list {
	margin-right: 32px;
	display: flex;

	img {
		width: 198px;
		height: 136px;
		margin-right: 32px;
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
				width: 150px;
				height: 150px;
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

.goods-detail {
	.picture-list {
		display: flex;
		flex-direction: column;

		img {
			height: 100%;
		}
	}
}
</style>
