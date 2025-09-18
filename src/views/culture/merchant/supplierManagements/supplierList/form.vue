<template>
	<div>
		<el-card>
			<div class="full">
				<div class="order_icon"><span class="iconfont icon-shanghuliebiao"></span></div>
				<div class="text">
					<div class="acea-row">
						<div class="title mr10">{{ dataForm.name ? dataForm.name : '新增供应商' }}</div>
						<div v-if="dataForm.isSelf" class="isSelf bg-prompt-color">自营</div>
						<div v-if="dataForm.typeId && typeName" class="ml8 bg-warning-color isSelf">
							{{ typeName }}
						</div>
					</div>
					<div v-if="dataForm.addressDetail">
						<span class="mr20">{{ dataForm.addressDetail }}</span>
					</div>
				</div>
			</div>
			<div class="prompt">
				<el-alert title="供应商登录账号为手机号，初始密码为000000，可从个人中心修改密码" type="warning" effect="light"> </el-alert>
			</div>
			<el-form v-loading="loadingFrom" ref="ruleFormRef" :model="dataForm" label-width="180px" :rules="rules">
				<el-form-item label="供应商名称：" prop="name">
					<el-input
						class="from-ipt-width"
						v-model.trim="dataForm.name"
						:maxlength="16"
						:disabled="isDisabled"
						placeholder="请输入供应商名称"
						style="width: 400px"
					/>
				</el-form-item>
				<el-form-item label="联系电话：" prop="phone">
					<el-input
						v-model.trim="dataForm.phone"
						:disabled="isDisabled || merId > 0"
						placeholder="请输入联系电话"
						class="from-ipt-width"
						style="width: 400px"
					/>
				</el-form-item>
				<el-form-item label="联系人：" prop="realName">
					<el-input v-model.trim="dataForm.realName" :disabled="isDisabled" placeholder="请输入联系人" class="from-ipt-width" style="width: 400px" />
				</el-form-item>
				<el-form-item label="供应商类别：" prop="categoryId">
					<el-select
						class="from-ipt-width"
						v-model="dataForm.categoryId"
						placeholder="请选择供应商类别"
						:disabled="isDisabled"
						@change="onChange(dataForm.categoryId)"
						style="width: 400px"
					>
						<!-- merchantType -->
						<el-option
							v-for="item in merchantClassify"
							:key="'merchantClassify' + item.id.toString()"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="合同有效期：" prop="contractExpireTime" style="width: 540px">
					<el-date-picker
						:disabled="isDisabled"
						v-model="contractExpireTime"
						type="daterange"
						range-separator="-"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						value-format="YYYY-MM-DD"
						@change="onchangeTime"
					/>
				</el-form-item>
				<el-form-item label="供应商账户：" prop="">
					<el-input
						v-model.trim="dataForm.account"
						:disabled="isDisabled"
						placeholder="请输入供应商账户"
						class="from-ipt-width"
						maxlength="100"
						style="width: 400px"
					/>
				</el-form-item>
				<el-form-item label="资质图片：" prop="sliderImages">
					<div class="acea-row">
						<div class="upload-item" style="display: flex; align-items: center; width: 100%; flex-wrap: wrap">
							<upload-img
								v-for="(item, index) in dataForm.sliderImages"
								:key="index"
								v-model:imageUrl="dataForm.sliderImages[index]"
								dir="culture"
								:fileType="['image/jpeg', 'image/jpg', 'image/png']"
								:disabled="isDisabled"
								:limit="10"
								:on-exceed="handleExceed"
								style="margin-left: 5px"
							>
							</upload-img>
							<el-button v-if="!disabledBannerUpload && !isDisabled" @click="handleCreateUploadComponent" type="primary"> 添加上传图片 </el-button>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="同城配送发货地址：" prop="addressDetail">
					<el-input
						v-model.trim="dataForm.addressDetail"
						:disabled="isDisabled"
						placeholder="请输入地址"
						class="from-ipt-width"
						style="width: 400px"
					/>
				</el-form-item>
				<el-form-item label="同城配送发货地址经纬度：" prop="longitude">
					<el-input
						type="number"
						v-model.trim="dataForm.longitude"
						:disabled="isDisabled"
						placeholder="请输入经度"
						class="from-ipt-width mr-[20px]"
						style="width: 190px"
					/>
					<el-input
						type="number"
						v-model.trim="dataForm.latitude"
						:disabled="isDisabled"
						placeholder="请输入纬度"
						class="from-ipt-width"
						style="width: 190px"
					/>
				</el-form-item>
				<el-form-item label="备注：" prop="remark">
					<el-input
						v-model.trim="dataForm.remark"
						:disabled="isDisabled"
						type="textarea"
						placeholder="请输入备注"
						class="from-ipt-width"
						style="width: 400px"
					/>
				</el-form-item>
				<el-form-item label="商品审核：" class="inline">
					<el-switch
						v-model="dataForm.productSwitch"
						:disabled="isDisabled"
						:active-value="true"
						:inactive-value="false"
						inline-prompt
						active-text="开启"
						inactive-text="关闭"
						style="width: 400px"
					></el-switch>
				</el-form-item>
			</el-form>
			<div class="footer">
				<el-button v-if="!isDisabled" @click="handleClose(ruleFormRef)">取消</el-button>
				<el-button v-if="!isDisabled" type="primary" :loading="loading" @click="onsubmit(ruleFormRef)">保存</el-button>
				<!-- <el-button v-if="isDisabled" type="primary" :loading="loading" @click="handleChangeEdit">编辑</el-button> -->
				<el-button v-if="isDisabled" :loading="loading" @click="handleBack">返回</el-button>
			</div>
		</el-card>
	</div>
</template>
<script setup lang="ts">
import {
	merchantCategoryAllListApi,
	merchantTypeListApi,
	merchantAddApi,
	merchantUpdateApi,
	merchantDetailApi,
} from '/@/api/culture/merchant/supplierList';
import { useMessage } from '/@/hooks/message';
import { ElNotification } from 'element-plus';
import type { FormInstance, FormRules, UploadProps } from 'element-plus';
const route = useRoute();
const router = useRouter();
const dataForm = ref<any>({
	categoryId: null,
	handlingFee: 0,
	isRecommend: false,
	isSelf: false,
	isSwitch: false,
	keywords: '',
	name: '',
	phone: '',
	productSwitch: false,
	qualificationPicture: '',
	realName: '',
	remark: '',
	sort: 0,
	typeId: 0,
	sliderImages: [],
	id: 0,
});
interface type {
	id: number;
	name: string;
	handlingFee?: any;
}
const typeName = ref<any>('');
const loadingFrom = ref(false);
const isDisabled = ref(false);
const merId = ref<any>(0);
const merchantClassify = ref<type[]>([]);
const merchantType = ref<type[]>([]);
const labelarr = ref([]) as any;
const dragging = ref() as any;
const handleType = ref<string>('');
const ruleFormRef = ref<any>(null);
const loading = ref(false); //按钮的
const disabledBannerUpload = ref(false);
const contractExpireTime = ref<any>([]);
onMounted(() => {
	if (route.query?.id) {
		merId.value = Number(route.query.id);
	}
	if (route.query?.id) {
		onInfo();
	}
	getMerchantClassify();
	getMerchantTypeListApi();
	if (route.query?.id && route.query?.type === 'info') {
		isDisabled.value = true;
	} else isDisabled.value = false;
	console.log('route.query.id', route.query.id);
});
watch(
	() => dataForm.value.sliderImages,
	(val) => {
		if (val.length >= 10) {
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
const onchangeTime = (val: any) => {
	if (val?.length > 0) {
		dataForm.value.contractExpireTime = val.join(',');
	}
};
const validatePhone = (rule: any, value: any, callback: any) => {
	if (!value) {
		return callback(new Error('请填写联系电话'));
	} else {
		callback();
	}
};
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
	categoryId: [{ required: true, message: '请选择供应商类别', trigger: 'change' }],
	// typeId: [{ required: true, message: '请选择店铺类型', trigger: 'change' }],
	realName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
	// labelarr: [{ required: true, validator: validateVal, trigger: 'blur' }],
	phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
	handlingFee: [{ required: true, message: '请输入手续费', trigger: 'blur' }],
	sliderImages: [{ required: true, message: '请上传资质图片', trigger: 'blur' }],
});
const onChange = (id: any) => {
	dataForm.value.handlingFee = merchantClassify.value.find((item: any) => item.id === id)?.handlingFee;
};
const getMerchantClassify = async () => {
	try {
		const { code, data, msg } = await merchantCategoryAllListApi();
		if (code === 0) {
			console.log('data', data);
			merchantClassify.value = data;
			console.log('merchantClassify', merchantClassify.value);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const getMerchantTypeListApi = async () => {
	try {
		const { code, data, msg } = await merchantTypeListApi();
		if (code === 0) {
			merchantType.value = data.records;
			console.log('dataForm.value.typeId', dataForm.value.typeId);
			if (merchantType.value.length > 0) {
				const obj = merchantType.value.find((item: any) => {
					console.log('item.id', item.id, Number(dataForm.value.typeId));
					return item.id === Number(dataForm.value.typeId); // 返回布尔值
				}) || { name: '' };
				typeName.value = obj.name;
				console.log('typeName', typeName.value);
			}
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 移除
const handleRemove = (i: any) => {
	dataForm.value.sliderImages.splice(i, 1);
};
// 移动
const handleDragStart = (e: any, item: any) => {
	dragging.value = item;
};
const handleDragEnd = (e: any, item: any) => {
	dragging.value = null;
};
const handleDragOver = (e: any) => {
	e.dataTransfer.dropEffect = 'move';
};
const handleDragEnter = (e: any, item: any) => {
	e.dataTransfer.effectAllowed = 'move';
	if (item === dragging.value) {
		return;
	}
	const newItems = [dataForm.value.sliderImages];
	const src = newItems.indexOf(dragging.value);
	const dst = newItems.indexOf(item);
	newItems.splice(dst, 0, ...newItems.splice(src, 1));
	dataForm.value.sliderImages = newItems;
};
//取消
const handleClose = (formEl: FormInstance | undefined) => {
	// if (merId.value > 0) {
	// 	if (handleType.value === 'edit') {
	// 		this.$emit('closeModel');
	// 	} else {
	// 		this.handleChangeEdit();
	// 	}
	// } else {
	// 	this.$nextTick(() => {
	// 		this.$refs['dataForm'].resetFields();
	// 	});
	// 	this.$emit('closeModel');
	// }
	if (!formEl) return;
	formEl.resetFields();
	contractExpireTime.value = [];
	router.push({
		path: '/culture/merchant/supplierManagements/supplierList/index',
	});
};
const onInfo = async () => {
	// if (!merchantClassify.length) this.$store.dispatch('merchant/getMerchantClassify');
	// if (!this.merchantType.length) this.$store.dispatch('merchant/getMerchantType');
	loadingFrom.value = true;
	try {
		const { code, msg, data } = await merchantDetailApi(merId.value);
		if (code === 0) {
			dataForm.value = data;
			labelarr.value = data.keywords.split(',') || [];
			loadingFrom.value = false;
			if (data.contractExpireTime) {
				contractExpireTime.value = data.contractExpireTime.split(',');
			} else {
				contractExpireTime.value = [];
			}

			dataForm.value.sliderImages = data.qualificationPicture ? JSON.parse(data.qualificationPicture) : [];
			// this.$set(data, 'sliderImages', res.qualificationPicture ? JSON.parse(res.qualificationPicture) : []);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	//
	// merchant.value.merchantDetailApi(merId.value).then((res:any) => {
	// 	$set(res, 'sliderImages', res.qualificationPicture ? JSON.parse(res.qualificationPicture) : []);
	// 	this.dataForm = res;
	// 	this.labelarr = res.keywords.split(',') || [];
	// 	this.loadingFrom = false;
	// });
};
const onsubmit = async (formEl: FormInstance | undefined) => {
	loading.value = true;
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			dataForm.value.qualificationPicture = JSON.stringify(dataForm.value.sliderImages);
			dataForm.value.keywords = labelarr.value.join(',');
			try {
				const { code, msg } = dataForm.value.id === 0 ? await merchantAddApi(dataForm.value) : await merchantUpdateApi(dataForm.value);
				if (code === 0) {
					useMessage().success(`${dataForm.value.id === 0 ? '添加供应商' : '操作'}成功`);
					router.push({
						path: '/culture/merchant/supplierManagements/supplierList/index',
					});
					loading.value = false;
				} else {
					useMessage().error(msg);
					loading.value = false;
				}
			} catch (err: any) {
				useMessage().error(err.msg);
				loading.value = false;
			}
			console.log('error submit!', fields);
		}
	});
};
// 添加图片上传按钮
const handleCreateUploadComponent = () => {
	dataForm.value.sliderImages.push('');
};
const handleExceed: UploadProps['onExceed'] = (files: any) => {
	ElNotification({
		title: '温馨提示',
		message: '最多只能上传10张图片！',
		type: 'error',
	});
};
const handleChangeEdit = () => {
	isDisabled.value = false;
};

const handleBack = () => {
	router.push('/culture/merchant/supplierManagements/supplierList/index');
};
// 点击商品图
const modalPicTap = (multiple: any) => {
	// 稍后写
	//   const _this = this;
	//   this.$modalUpload(
	//     function (img) {
	//       if (!img) return;
	//       if (img.length > 10) return this.$message.warning('最多选择10张图片！');
	//       if (img.length + _this.dataForm.sliderImages.length > 10) return this.$message.warning('最多选择10张图片！');
	//       img.map((item) => {
	//         _this.dataForm.sliderImages.push(item.sattDir);
	//       });
	//     },
	//     multiple,
	//     'store',
	//   );
};
</script>
<style scoped lang="scss">
.full {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.order_icon {
		width: 60px;
		height: 60px;
		border-radius: 6px;
		background-color: var(--prev-color-primary);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.iconfont {
		color: #fff;
		font-size: 35px;

		&.sale-after {
			color: #90add5;
		}
	}

	.text {
		align-self: center;
		flex: 1;
		min-width: 0;
		padding-left: 12px;
		font-size: 13px;
		color: #606266;

		.title {
			margin-bottom: 10px;
			font-weight: 500;
			font-size: 16px;
			line-height: 16px;
			color: rgba(0, 0, 0, 0.85);
		}

		.order-num {
			padding-top: 10px;
			white-space: nowrap;
		}
	}
}
.bg-warning-color {
	// background-color: var(--prev-color-warning-color);
	background-color: #ff7d00 !important;
}
.bg-prompt-color {
	background-color: #f56464 !important;
}
.acea-row {
	display: -webkit-box;
	display: -moz-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-lines: multiple;
	-moz-box-lines: multiple;
	-o-box-lines: multiple;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	/* 辅助类 */
}
.isSelf {
	padding: 2px 4px;
	height: 16px;
	border-radius: 2px 2px 2px 2px;
	font-size: 13px;
	color: #ffffff;
	text-align: center;
	line-height: 1;
}
.prompt {
	// width: 100%;
	width: 570px;
	padding: 20px 25px;
}
.footer {
	width: 570px;
	text-align: center;
	margin-top: 20px;
}
</style>
