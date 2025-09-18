<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-steps :active="stepsActive" align-center>
				<el-step title="选择拼团商品" />
				<el-step title="填写基础信息" />
				<el-step title="修改商品详情" />
			</el-steps>
			<div v-if="stepsActive === 1">
				<el-form ref="formEl1" class="formValidate my-[100px] text-center" :rules="ruleValidate" :model="groupForm" label-width="150px">
					<el-form-item label="选择商品" prop="name">
						<el-select
							class="!w-[400px]"
							v-model="groupForm.name"
							placeholder="请选择商品"
							:disabled="pageType || route.query.id"
							@click="handleSelectClick"
						/>
					</el-form-item>
					<el-form-item label="商品名称">
						{{ groupForm.name || '-' }}
					</el-form-item>
					<el-form-item label="商品ID">
						{{ groupForm.id || '-' }}
					</el-form-item>
				</el-form>
			</div>

			<div v-if="stepsActive === 2">
				<el-form ref="formEl2" class="formValidate" :rules="ruleValidate" :model="groupForm" label-width="150px">
					<el-card class="my-[10px]" shadow="never">
						<template #header>
							<div>
								<span>基础信息</span>
							</div>
						</template>
						<el-form-item label="商品名称" prop="name">
							<el-input class="!w-[400px]" :disabled="pageType" v-model="groupForm.name" placeholder="请输入" />
						</el-form-item>
						<el-form-item label="活动时间" prop="timeVal">
							<div class="!w-[400px]">
								<el-date-picker
									class="!w-full"
									:disabled="pageType"
									v-model="groupForm.timeVal"
									format="YYYY-MM-DD"
									value-format="YYYY-MM-DD"
									unlink-panels
									type="daterange"
									@change="onchangeTime"
								/>
							</div>
							<p class="desc">设置活动开启结束时间，用户可以在设置时间内发起参与拼团</p>
						</el-form-item>
						<el-form-item label="成团期限" prop="groupBuyTerm">
							<el-input-number
								class="!w-[400px]"
								:disabled="pageType"
								v-model="groupForm.groupBuyTerm"
								controls-position="right"
								:min="0"
								:max="99999"
								:precision="0"
							>
								<template #suffix>
									<span>小时</span>
								</template>
							</el-input-number>
							<p class="desc">用户发起拼团后开始计时，需在设置时间内邀请到规定好友人数参团，超过时效时间，则系统判定拼团失败，自动发起退款</p>
						</el-form-item>
						<el-form-item label="成团人数" prop="groupBuyCount">
							<el-input-number
								class="!w-[400px]"
								:disabled="pageType"
								v-model="groupForm.groupBuyCount"
								controls-position="right"
								:min="0"
								:max="99999"
								:precision="0"
							>
								<template #suffix>
									<span>人</span>
								</template>
							</el-input-number>
							<p class="desc">单次拼团需要参与的用户数</p>
						</el-form-item>
						<el-form-item label="成团后退款" prop="groupBuyRefundType">
							<el-radio-group :disabled="pageType" v-model="groupForm.groupBuyRefundType">
								<div class="mr-[20px]">
									<el-radio :value="1">单个退款</el-radio>
									<p class="desc">选择单个退款，则不影响其他人订单</p>
								</div>
								<div>
									<el-radio :value="2">全团退款</el-radio>
									<p class="desc">选择全团退款，则影响其他人订单</p>
								</div>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="可见对象" prop="identityTypeList">
							<el-checkbox-group :disabled="pageType" v-model="groupForm.identityTypeList">
								<el-checkbox label="内部员工" :value="1" />
								<el-checkbox label="见习员工" :value="2" />
								<el-checkbox label="见习-其他" :value="3" />
								<el-checkbox label="学生" :value="4" />
								<el-checkbox label="委外员工" :value="5" />
								<el-checkbox label="普通用户" :value="6" />
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="物流方式" prop="shippingTypeList">
							<el-checkbox-group :disabled="pageType" v-model="groupForm.shippingTypeList">
								<el-checkbox label="快递发货" :value="1" />
								<el-checkbox label="同城配送" :value="5" />
								<el-checkbox label="自提核销" :value="2" />
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="运费模板">
							<el-select class="!w-[400px]" :disabled="pageType" v-model="groupForm.tempId" placeholder="请选择" clearable>
								<el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in shippingTemplatesOption" />
							</el-select>
						</el-form-item>
						<el-form-item label="商品关键字" prop="keyword">
							<el-input class="!w-[400px]" :disabled="pageType" v-model="groupForm.keyword" placeholder="请输入商品关键字，多个关键字用逗号分割" />
							<p class="desc">用于商品搜索，最多可输入10个关键字</p>
						</el-form-item>
						<el-form-item label="商品简介" prop="intro">
							<el-input
								class="!w-[400px]"
								:disabled="pageType"
								v-model="groupForm.intro"
								type="textarea"
								:rows="3"
								maxlength="200"
								placeholder="请输入商品简介"
								show-word-limit
							/>
							<p class="desc">通过公众号分享商品详情，会展示此简介信息</p>
						</el-form-item>
					</el-card>
					<el-card class="my-[10px]" shadow="never">
						<template #header>
							<div>
								<span>价格设置</span>
							</div>
						</template>
						<el-table
							ref="tableList"
							row-key="id"
							:data="groupForm.attrValue"
							:cell-style="tableStyle.cellStyle"
							:header-cell-style="tableStyle.headerCellStyle"
						>
							<el-table-column label="序号" type="index" width="60" align="center" />
							<el-table-column prop="sku" label="规格" />
							<el-table-column prop="image" label="图片" align="center">
								<template #default="scope">
									<UploadImg v-model:image-url="scope.row.image" :disabled="pageType" />
								</template>
							</el-table-column>
							<el-table-column prop="stock" label="库存">
								<template #default="scope">
									<el-input-number :disabled="pageType" v-model="scope.row.stock" :min="0" :max="99999" :controls="false" />
								</template>
							</el-table-column>
							<el-table-column prop="otPrice" label="原价">
								<template #default="scope">
									<el-input-number :disabled="pageType" v-model="scope.row.otPrice" :precision="2" :min="0.0" :max="99999" :controls="false" />
								</template>
							</el-table-column>
							<el-table-column prop="price" label="拼团价">
								<template #default="scope">
									<el-input-number :disabled="pageType" v-model="scope.row.price" :precision="2" :min="0.0" :max="99999" :controls="false" />
								</template>
							</el-table-column>
						</el-table>
					</el-card>
				</el-form>
			</div>

			<div v-if="stepsActive === 3">
				<el-form ref="formEl3" class="formValidate" :rules="ruleValidate" :model="groupForm" label-width="150px">
					<el-card class="my-[10px]" shadow="never">
						<template #header>
							<div>
								<span>图片视频</span>
							</div>
						</template>
						<el-form-item label="商品封面图" prop="image">
							<UploadImg v-model:image-url="groupForm.image" :disabled="pageType" />
						</el-form-item>
						<el-form-item label="商品轮播图" prop="sliderImages">
							<div class="upload-item flex items-center">
								<UploadImg
									class="mr-[10px]"
									v-for="(item, index) in groupForm.sliderImages"
									:key="index"
									:disabled="pageType"
									v-model:imageUrl="groupForm.sliderImages[index]"
									:fileType="['image/jpeg', 'image/jpg', 'image/png']"
								/>
								<el-button v-if="groupForm.sliderImages.length < 5" :disabled="pageType" @click="handleCreateUploadComponent" type="primary">
									添加上传图片
								</el-button>
							</div>
						</el-form-item>
						<el-form-item label="保障服务">
							<el-select
								class="!w-[400px]"
								:disabled="pageType"
								v-model="groupForm.guaranteeIdsList"
								placeholder="请选择"
								multiple
								clearable
								filterable
							>
								<el-option :value="item.id" v-for="(item, index) in guaranteeList" :key="index" :label="item.name"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="主图视频：" prop="video_link">
							<div class="acea-row" style="width: 100%">
								<el-upload
									class="upload-demo"
									:action="baseURL + other.adaptationUrl('/admin/sys-file/upload')"
									:http-request="handleUploadForm"
									:on-success="handleSuccess"
									:on-error="handleError"
									:on-exceed="handleExceed"
									:before-upload="beforeAvatarUpload"
									:headers="headers"
									:show-file-list="false"
									:disabled="pageType"
								>
									<el-input :disabled="pageType" v-model="videoLink" placeholder="请输入MP4格式的视频链接" class="!w-[400px]">
										<template #append>
											<el-button :disabled="pageType">上传视频</el-button>
										</template>
									</el-input>
									<div class="desc">请上传小于20M的视频</div>
								</el-upload>
								<div v-if="videoLink" class="iview-video-style">
									<video class="w-[400px] my-[10px]" :src="videoLink" controls="controls">您的浏览器不支持 video 标签。</video>
									<el-button type="text" :disabled="pageType" @click="delVideo">删除</el-button>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="商品详情" prop="content">
							<editor :disable="pageType" v-model:get-html="groupForm.content" height="500" width="100%" />
						</el-form-item>
					</el-card>
				</el-form>
			</div>
			<div class="flex justify-center">
				<el-button v-if="stepsActive > 1 && stepsActive <= 3" type="primary" class="w-[100px]" @click="prevStep">上一步</el-button>
				<el-button v-if="stepsActive >= 1 && stepsActive < 3" type="primary" class="w-[100px]" @click="nextStep">下一步</el-button>
				<el-button v-if="stepsActive === 3 && !pageType" type="primary" class="w-[100px]" @click="save">保存</el-button>
			</div>
		</div>
		<el-dialog v-model="chooseShopDialogVisible" title="商品列表" width="1200">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="商品ID">
					<el-input v-model.trim="state.queryForm.id" placeholder="请输入商品ID" clearable></el-input>
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model.trim="state.queryForm.keywords" placeholder="请输入商品名称" clearable></el-input>
				</el-form-item>
				<el-form-item label="商品分类">
					<el-cascader
						ref="cascader"
						v-model="state.queryForm.categoryId"
						placeholder="请选择商品分类"
						clearable
						:options="adminProductClassify"
						:props="categoryProps"
					/>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="state.dataList" row-key="id" border :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column type="index" label="序号" width="80" />
				<el-table-column prop="id" label="商品ID" />
				<el-table-column prop="name" label="商品名称" />
				<el-table-column prop="categoryName" label="商品分类" />
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="text" @click="handleChooseShop(row)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</el-dialog>
	</div>
</template>
<script lang="ts" setup>
import type { UploadProps } from 'element-plus';
import { ElNotification } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fileImageApi, getShippingTemplatesList, guaranteeListApi, changeNodes, productCategoryApi } from '/@/api/culture/commodity/commodityList';
import { productListApi, productInfoApi, saveProductApi, updateProductApi } from '/@/api/culture/groupBuying';
import UploadImg from '/@/components/Upload/Image.vue';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';

const route = useRoute();
const router = useRouter();
const stepsActive = ref(1);
const chooseShopDialogVisible = ref(false);
const groupForm = ref({
	id: '',
	name: '',
	timeVal: '',
	groupBuyStartTime: '',
	groupBuyEndTime: '',
	groupBuyTerm: '',
	groupBuyCount: '',
	groupBuyRefundType: 1,
	identityTypeList: '',
	guaranteeIdsList: [],
	guaranteeIds: '',
	sliderImage: '', // 后端返回的轮播图
	sliderImages: [], // 前端转换的轮播图
	image: '',
	shippingTypeList: null,
	intro: '',
	content: '',
	keyword: '',
	tempId: '',
	attrValue: [],
});
const ruleValidate = reactive({
	name: [{ required: true, message: '请选择商品', trigger: 'change' }],
	timeVal: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
	groupBuyTerm: [{ required: true, message: '请输入成团期限', trigger: 'blur' }],
	groupBuyCount: [{ required: true, message: '请输入成团人数', trigger: 'blur' }],
	groupBuyRefundType: [{ required: true, message: '请选择', trigger: 'change' }],
	identityTypeList: [{ required: true, message: '请选择', trigger: 'change' }],
	shippingTypeList: [{ required: true, message: '请选择', trigger: 'change' }],
	image: [{ required: true, message: '请选择商品封面图', trigger: 'change' }],
});
const formEl1 = ref();
const formEl2 = ref();
const formEl3 = ref();

const handleSelectClick = () => {
	if (pageType.value || route.query.id) {
		return;
	}
	chooseShopDialogVisible.value = true;
	getDataList();
};

const handleChooseShop = (row: any) => {
	groupForm.value.id = row.id;
	groupForm.value.name = row.name;
	chooseShopDialogVisible.value = false;
	productInfoApi(row.id).then((res) => {
		const parsedImages = res.data.sliderImage ? JSON.parse(res.data.sliderImage) : [];
		const videoItem = parsedImages.find((img: string) => img?.endsWith('.mp4'));
		groupForm.value = {
			...res.data,
			groupBuyRefundType: res.data?.groupBuyRefundType || 1,
			sliderImages: videoItem ? parsedImages.slice(1) : parsedImages,
			guaranteeIdsList: res.data.guaranteeIds && res.data.guaranteeIds !== '0' ? res.data.guaranteeIds.split(',').map(Number) : [], // 保障服务
			tempId: !shippingTemplatesOption.value.some((item) => item.id == res.data.tempId) || res.data.tempId == 0 ? null : Number(res.data.tempId),
		};
		videoLink.value = videoItem || '';

		// 如果拼团商品为新增，初始化 price=0
		if (!route.query.id) {
			if (groupForm.value.attrValue) {
				groupForm.value.attrValue.forEach((item: any) => {
					item.price = 0;
				});
			}
		}

		getShippingTemplates(res.data.merId); // 获取运费模板
		getProductGuarantee(); // 获取保障服务
	});
};

// 上一步
const prevStep = () => {
	if (stepsActive.value > 1) {
		stepsActive.value--;
	}
};

// 下一步
const nextStep = async () => {
	try {
		const valid = await Promise.all([formEl1.value?.validate(), formEl2.value?.validate(), formEl3.value?.validate()]);
		if (valid) {
			if (stepsActive.value < 3) {
				stepsActive.value++;
			}
		} else {
			return false;
		}
	} catch (error) {
		console.log('验证失败', error);
	}
};

const save = async () => {
	// 如果有视频链接，将其添加到轮播图数组前面
	const finalSliderImages = videoLink.value ? [videoLink.value, ...groupForm.value.sliderImages] : [...groupForm.value.sliderImages];
	const formData = {
		...groupForm.value,
		isGroupBuy: true,
		sliderImage: JSON.stringify(finalSliderImages.filter((img) => img)),
		guaranteeIds: groupForm.value.guaranteeIdsList.join(','),
		couponIds: null, // 拼团商品不使用优惠券
	};
	try {
		const id = route.query.id;
		const { code, msg } = id ? await updateProductApi(formData) : await saveProductApi(formData);
		if (code === 0) {
			useMessage().success('保存成功');
			router.go(-1);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const pageType = computed(() => {
	return route.query.type === 'check' ? true : false;
});

const onchangeTime = (e: any) => {
	groupForm.value.timeVal = e;
	groupForm.value.groupBuyStartTime = e ? `${e[0]} 00:00:00` : '';
	groupForm.value.groupBuyEndTime = e ? `${e[1]} 23:59:59` : '';
};

// 上传多张图片
const handleCreateUploadComponent = () => {
	const MAX_IMAGES = 5;
	if (groupForm.value.sliderImages.some((img) => !img)) {
		useMessage().error('请先上传已有的图片');
		return;
	}
	if (groupForm.value.sliderImages.length >= MAX_IMAGES) {
		useMessage().error(`最多上传${MAX_IMAGES}张轮播图`);
		return;
	}
	groupForm.value.sliderImages.push('');
};

// 上传视频
const uploading = ref<boolean>(false);
const fullscreenLoading = ref(false);
const videoLink = ref<any>(); //主图视频路径
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': Session.getTenant(),
	};
});
const handleUploadForm = async (param: any) => {
	const formData = new FormData();
	const data = {
		model: 'product',
		pid: 0,
	};
	formData.append('multipart', param.file);
	fullscreenLoading.value = true;
	try {
		let res = await fileImageApi(formData, data);
		if (res.code === 0) {
			videoLink.value = res.data.url;
			useMessage().success('上传成功');
			fullscreenLoading.value = false;
		} else {
			useMessage().error(res.msg);
			fullscreenLoading.value = false;
		}
	} catch (e: any) {
		useMessage().error(e.msg);
		fullscreenLoading.value = false;
	}
};
const handleSuccess: UploadProps['onSuccess'] = () => {
	uploading.value = false;
};
const handleError = () => {
	uploading.value = false;
};
const handleExceed: UploadProps['onExceed'] = () => {
	useMessage().error('最多上传1个视频！');
};
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	let type: string[] = [];
	type = rawFile.type.split('/');
	if (type[0] !== 'video') {
		ElNotification({
			title: '温馨提示',
			message: '请上传视频文件！',
			type: 'warning',
		});
		return false;
	} else if (rawFile.size / 1024 / 1024 > 10) {
		ElNotification({
			title: '温馨提示',
			message: '视频大小不超过10MB',
			type: 'warning',
		});
		return false;
	}
	uploading.value = true;
	return true;
};
const delVideo = () => {
	videoLink.value = '';
};

const shippingTemplatesOption = ref<any[]>([]); // 运费模板
// 运费模板选项
const getShippingTemplates = async (id: any) => {
	try {
		const { code, data, msg } = await getShippingTemplatesList(id);
		if (code === 0) {
			shippingTemplatesOption.value = data.records;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const guaranteeList = ref<any[]>([]); // 保障服务
// 保障服务选项
const getProductGuarantee = async () => {
	try {
		const { code, data, msg } = await guaranteeListApi();
		if (code === 0) {
			const arr = changeNodes(data);
			guaranteeList.value = arr.filter((item: any) => item.isShow);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const getProductDetail = async (id: any) => {
	try {
		productInfoApi(id).then((res) => {
			const parsedImages = res.data.sliderImage ? JSON.parse(res.data.sliderImage) : [];
			const videoItem = parsedImages.find((img: string) => img?.endsWith('.mp4'));
			groupForm.value = {
				...res.data,
				timeVal: [res.data.groupBuyStartTime, res.data.groupBuyEndTime],
				groupBuyRefundType: res.data?.groupBuyRefundType || 1,
				guaranteeIdsList: res.data.guaranteeIds && res.data.guaranteeIds !== '0' ? res.data.guaranteeIds.split(',').map(Number) : [], // 保障服务
				sliderImages: videoItem ? parsedImages.slice(1) : parsedImages,
				tempId: !shippingTemplatesOption.value.some((item) => item.id == res.data.tempId) || res.data.tempId == 0 ? null : Number(res.data.tempId),
			};
			videoLink.value = videoItem || '';

			if (!route.query.id) {
				if (groupForm.value.attrValue) {
					groupForm.value.attrValue.forEach((item: any) => {
						item.price = 0;
					});
				}
			}

			getShippingTemplates(res.data.merId); // 获取运费模板
			getProductGuarantee(); // 获取保障服务
		});
	} catch (e) {
		console.log(e);
	}
};

const categoryProps = ref({
	value: 'id',
	label: 'name',
	children: 'childList',
	expandTrigger: 'hover',
	checkStrictly: false,
	emitPath: false,
	multiple: false,
});
const adminProductClassify = ref<any[]>([]);
const getAdminProductClassify = async () => {
	try {
		const { code, data, msg } = await productCategoryApi();
		if (code === 0) {
			adminProductClassify.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: productListApi,
	queryForm: {},
	dataList: [],
});
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

onMounted(() => {
	const id = route.query.id;
	getAdminProductClassify();
	id && getProductDetail(id);
});
</script>
<style lang="scss" scoped>
:deep(.el-step__icon-inner) {
	font-size: 20px !important;
}
.desc {
	color: #999;
	font-size: 12px;
	line-height: 16px;
	margin: 0;
	padding-left: 10px;
}
</style>
