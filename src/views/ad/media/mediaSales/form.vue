<template>
	<section class="basic-info">
		<el-card>
			<p class="title">基础信息</p>
			<el-form ref="basicInfoFormRef" :model="basicInfoForm" :rules="basicInfoRules" label-width="100px" :disabled="isDisabled">
				<el-form-item label="媒体名称：" prop="name" class="custom-width">
					<el-input v-model="basicInfoForm.name" placeholder="请输入商品标题" clearable maxlength="30" show-word-limit />
				</el-form-item>
				<el-form-item label="卖点推荐：" class="custom-width">
					<el-input
						v-model="basicInfoForm.intro"
						type="textarea"
						resize="none"
						placeholder="请输入卖点推荐"
						rows="4"
						maxlength="100"
						show-word-limit
					/>
				</el-form-item>
				<el-form-item label="运营商：" prop="operatorCode" class="custom-width">
					<el-select v-model="basicInfoForm.operatorCode" placeholder="请选择供应商" clearable filterable>
						<el-option v-for="item in serviceProvidersList" :label="item.name" :value="item.code" :key="item.code" :disabled="item.disabled" />
					</el-select>
				</el-form-item>
				<el-form-item label="轮播图片：" prop="imageUrls">
					<template v-if="route.query.type !== 'detail'">
						<div class="upload-container">
							<div class="upload-item">
								<upload-img v-for="(item, index) in basicInfoForm.imageUrls" :key="index" v-model:imageUrl="item.imageUrl" dir="media"> </upload-img>
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
	<section class="product-standards">
		<el-card>
			<p class="title">售卖规格</p>
			<el-form ref="productStandardsFormRef" :model="productStandardsForm" :rules="productStandardsFormRules" :disabled="isDisabled" inline-message>
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
										:on-success="productUploadSuccess"
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
					<el-table-column prop="skuName" label="规格名称" width="200">
						<template #header>
							<span>规格名称<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.skuName`" :rules="productStandardsFormRules.skuName">
								<el-input placeholder="请输入规格名称" v-model="row.skuName" @blur="saveEdit" @keyup.enter="saveEdit" maxlength="10" />
							</el-form-item>
						</template>
					</el-table-column>
					3
					<el-table-column prop="publicationFee" label="发布费（每日）" width="200">
						<template #header>
							<span>发布费（每日）<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.publicationFee`" :rules="productStandardsFormRules.publicationFee">
								<el-input placeholder="请输入发布费" v-model="row.publicationFee" @blur="saveEdit" @keyup.enter="saveEdit" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="productionCost" label="制作费（含上刊费）一次" width="200">
						<template #header>
							<span>制作费（含上刊费）一次<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.productionCost`" :rules="productStandardsFormRules.productionCost">
								<el-input placeholder="请输入制作费" v-model="row.productionCost" @blur="saveEdit" @keyup.enter="saveEdit" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="minPurchase" label="起售天数" width="200">
						<template #header>
							<span>起售天数<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.minPurchase`" :rules="productStandardsFormRules.minPurchase">
								<el-input placeholder="请输入起售天数" v-model="row.minPurchase" @blur="saveEdit" @keyup.enter="saveEdit" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="inventory" label="可售总天数" width="200">
						<template #header>
							<span>可售总天数<span style="color: red">*</span></span>
						</template>
						<template #default="{ row, $index }">
							<el-form-item :prop="`tableData.${$index}.inventory`" :rules="productStandardsFormRules.inventory">
								<el-input placeholder="请输入可售总天数" v-model="row.inventory" @blur="saveEdit" @keyup.enter="saveEdit" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="120" fixed="right">
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
			<p class="title">媒体介绍</p>
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
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { uploadImage } from '/@/api/culture/common';
import { basicInfoTypes, standardsTypes } from './types';
import { getAllServiceProvidersList, mediaDetailSaveOrUpdate, getMediaDetail, previewMediaDetail } from '/@/api/ad/media';
import PreviewDialog from './dialog.vue';
import { useRoute } from 'vue-router';
let route = useRoute(); // 生成组件唯一id

const basicInfoFormRef = ref<FormInstance>();
const productStandardsFormRef = ref<FormInstance>();
const loading = ref(false);
1;
const router = useRouter();

// 基础信息form表单字段
const basicInfoForm = reactive<basicInfoTypes>({
	productCode: null, // spu编码(spuCode传空时新增,否者编辑)
	name: '', // 	spu名称
	intro: '', // 卖点推荐
	operatorCode: '', // 运营商编码
	imageUrls: [
		// 轮播图
		{
			imageUrl: '',
			isMain: true,
		},
	] as any,
});

// 动态表单表格嵌套 字段
const productStandardsForm = reactive({
	tableData: [
		{
			skuCode: null,
			skuImage: '',
			skuName: '',
			publicationFee: null,
			productionCost: null,
			minPurchase: null,
			inventory: null,
		},
	] as any,
});

const previewDialogRef = ref();

// 供应商列表
const serviceProvidersList = ref([]) as any;

// 商品详情 url列表
let detailUrls = ref([
	{
		imageUrl: '',
	},
]);

// 获取运营商全量列表
const getSuppliersList = async () => {
	let res = await getAllServiceProvidersList();
	serviceProvidersList.value = res.data;
};

const validateSelectPicture = (rule: any, value: any, callback: any) => {
	if (!value[0].imageUrl) {
		callback(new Error('请选择一张设置为轮播主图'));
	} else {
		callback();
	}
};

const basicInfoRules = reactive<FormRules<basicInfoTypes>>({
	name: [
		{ required: true, message: '请输入商品名称', trigger: 'blur' },
		{ min: 1, max: 30, message: '字符不能超过 30 字', trigger: 'blur' },
	],
	operatorCode: [
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

const checkPriceValidator = (rule: any, value: any, callback: any) => {
	// 定义正则表达式，匹配正整数或带有最多两位小数的正数
	const pricePattern = /^\d+(\.\d{1,2})?$/;
	// 检查值是否符合正则表达式，并且小于10000000
	if (!pricePattern.test(value) || parseFloat(value) >= 10000000 || parseFloat(value) <= 0) {
		// 如果不符合条件，则调用回调函数并传递错误消息
		callback(new Error('请输入10000000以内的正数，最多保留两位小数'));
	} else {
		// 如果符合条件，则调用回调函数（不带参数表示验证通过）
		callback();
	}
};

const checkDayNumber = (rule: any, value: any, callback: any, source: any, options: any) => {
	const pricePattern = /^[1-9]\d{0,6}$/;
	const index = productStandardsForm.tableData.findIndex((row: any) => row.minPurchase === value);
	if (index !== -1) {
		const inventory = parseInt(productStandardsForm.tableData[index].inventory);
		const minPurchase = parseInt(value);

		if (!pricePattern.test(value) || parseInt(value) >= 10000000) {
			callback(new Error('请输入10000000以内的正整数'));
		} else if (isNaN(inventory) || isNaN(minPurchase) || minPurchase > inventory) {
			callback(new Error('起售天数不能大于可售总天数'));
		} else {
			callback();
		}
	} else {
		// 这种情况通常不会发生，除非数据不一致
		callback(new Error('无法验证起售天数'));
	}
};

const checkAllDayNumber = (rule: any, value: any, callback: any, options: any) => {
	const pricePattern = /^[1-9]\d{0,6}$/;
	const index = productStandardsForm.tableData.findIndex((row: any) => row.inventory === value);
	if (index !== -1) {
		const minPurchase = parseInt(productStandardsForm.tableData[index].minPurchase);
		const inventory = parseInt(value);
		if (!pricePattern.test(value) || parseInt(value) >= 10000000) {
			callback(new Error('请输入10000000以内的正整数'));
		} else if (isNaN(inventory) || isNaN(minPurchase) || inventory < minPurchase) {
			callback(new Error('可售总天数不能小于起售天数'));
		} else {
			callback();
		}
	} else {
		// 这种情况通常不会发生，除非数据不一致
		callback(new Error('无法验证可售总天数'));
	}
};

const productStandardsFormRules = reactive<FormRules<standardsTypes>>({
	skuName: [
		{
			required: true,
			message: '请输入规格名称',
			trigger: 'blur',
		},
	],
	publicationFee: [
		{
			validator: checkPriceValidator,
			required: true,
			message: '请输入10000000以内的正数，最多保留两位小数',
			trigger: 'blur',
		},
	],
	productionCost: [
		{
			validator: checkPriceValidator,
			required: true,
			message: '请输入10000000以内的正数，最多保留两位小数',
			trigger: 'blur',
		},
	],
	minPurchase: [
		{
			validator: checkDayNumber,
			trigger: 'blur',
			required: true,
		},
	],
	inventory: [
		{
			validator: checkAllDayNumber,
			trigger: 'blur',
			required: true,
		},
	],
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
		publicationFee: null,
		productionCost: null,
		inventory: null,
		skuImage: null,
		skuCode: null,
		minPurchase: null,
	});
};

const handleCopyRow = (row: any) => {
	productStandardsForm.tableData.push({
		skuName: row.skuName,
		skuImage: row.skuImage,
		publicationFee: row.publicationFee,
		productionCost: row.productionCost,
		inventory: row.inventory,
		minPurchase: row.minPurchase,
		skuCode: null,
	});
};

const handleDeleteRow = (row: any, index: number) => {
	productStandardsForm.tableData.splice(index, 1);
};

const productInfo = reactive({
	carousels: [] as any, // 轮播位列表，暂时只展示第一张图
	details: [] as any,
	skus: [] as any,
	productCode: '',
	name: '',
	intro: '',
	image: '',
	sales: '',
});

const handlePreview = () => {
	// 针对新增的预览操作进行纯前端拼接
	if (basicInfoForm.imageUrls && basicInfoForm.name && productStandardsForm.tableData) {
		productInfo.carousels = basicInfoForm.imageUrls.filter((item) => item.imageUrl);
		productInfo.name = basicInfoForm.name;
		productInfo.intro = basicInfoForm.intro as string;
		productInfo.skus = productStandardsForm.tableData;
		productInfo.details = detailUrls.value;
		console.log('productInfo', productInfo);
		previewDialogRef.value.openDialog(productInfo);
	} else {
		ElNotification({
			title: '温馨提示',
			message: '请填写完所有的表单项再预览！',
			type: 'error',
		});
		return;
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
	try {
		const valid = await Promise.all([basicInfoFormRef.value?.validateField(), productStandardsFormRef.value?.validateField()]);

		let tableValid = false;
		if (productStandardsForm.tableData.length > 1) {
			tableValid = hasDuplicateNames(productStandardsForm.tableData);
		}
		if (tableValid) {
			ElMessage({
				message: '同一SPU下不能拥有重复的规格名称，请重新输入！',
				type: 'error',
			});
			return;
		}

		if (valid.every((result) => result === true) && !tableValid) {
			let params = {
				...basicInfoForm,
				productCode: basicInfoForm.productCode ? basicInfoForm.productCode : null,
				name: basicInfoForm.name,
				intro: basicInfoForm.intro,
				operatorCode: basicInfoForm.operatorCode,
				imageUrls: basicInfoForm.imageUrls.filter((item: any) => item.imageUrl),
				specSkus: productStandardsForm.tableData,
				details: detailUrls.value.filter((item: any) => item.imageUrl),
				goodsType: 2,
			};

			params.details = params.details.map((item: any) => {
				if (item.imageUrl.includes('http')) {
					return item.imageUrl;
				} else {
					return item.imageUrl;
				}
			});
			loading.value = true;
			ElMessageBox.confirm(`${route.query.type === 'edit' ? '是否确认保存？' : '确认创建则创建商品，生成商品SPU?'}`, '保存', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					mediaDetailSaveOrUpdate(params)
						.then(() => {
							loading.value = false;
							router.push('/ad/media/mediaSales/index');
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
				router.push('/ad/media/mediaSales/index');
			})
			.catch(() => {
				// console.log('err', err);
			});
	} else {
		router.push('/ad/media/mediaSales/index');
	}
};

const isDisabled = ref(false);

onMounted(() => {
	getSuppliersList();
	if ((route.query.id as string) && route.query.type) {
		getMediaDetail(route.query.id as string).then((res) => {
			route.query.type === 'detail' ? (isDisabled.value = true) : (isDisabled.value = false);
			const { name, productCode, intro, operatorCode, operatorName, imageUrls, specSkus, details } = res.data;
			// 针对供应商停用后，特殊处理供应商列表展示 code无 name的情况
			const arr = serviceProvidersList.value.filter((item: any) => item.code === operatorCode);
			if (arr.length == 0) {
				serviceProvidersList.value.push({
					name: operatorName + '（已停用）',
					code: operatorCode,
					disabled: true,
				});
			}
			basicInfoForm.name = name;
			basicInfoForm.productCode = productCode;
			basicInfoForm.intro = intro;
			basicInfoForm.operatorCode = operatorCode;
			basicInfoForm.imageUrls = imageUrls.map((item: any) => {
				return {
					isMain: item.isMain,
					imageUrl: item.imageUrl,
				};
			});
			productStandardsForm.tableData = specSkus;
			detailUrls.value = details.map((item: any) => {
				return {
					imageUrl: item,
				};
			});
		});
	}
});
</script>
<style lang="scss">
section {
	margin-bottom: 28px;
}

.custom-width {
	width: 430px;
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
