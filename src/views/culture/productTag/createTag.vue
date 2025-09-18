<template>
	<div class="layout-padding">
		<el-card class="box-card box-body" :bordered="false" shadow="never">
			<div class="acea-row">
				<div class="after-line" @click="goBack">
					<el-icon><ArrowLeft /></el-icon>
					<span class="pl10">返回</span>
				</div>
				<span class="ht_title ml10">{{ title }}</span>
			</div>
		</el-card>
		<el-card class="box-card box-body mt14" :bordered="false" shadow="never">
			<el-tabs v-model="activeName" class="list-tabs">
				<el-tab-pane label="基础设置" name="first"></el-tab-pane>
				<el-tab-pane label="使用范围" name="second"></el-tab-pane>
			</el-tabs>
			<el-form ref="dataFormRef" class="form-boder-padding" :model="dataForm" label-width="110px" :rules="rules">
				<template v-if="activeName === 'first'">
					<el-form-item label="标签名称：" prop="tagName">
						<el-input
							v-model.trim="dataForm.tagName"
							type="text"
							placeholder="请输入标签名称"
							maxLength="5"
							class="from-ipt-width"
							:disabled="dataForm.owner === 0"
						/>
					</el-form-item>
					<el-form-item label="标签说明：" prop="tagNote">
						<el-input
							class="from-ipt-width"
							v-model.trim="dataForm.tagNote"
							type="textarea"
							placeholder="请输入标签说明"
							:disabled="dataForm.owner === 0"
						/>
					</el-form-item>
					<el-form-item label="排序：" prop="sort">
						<el-input-number class="from-ipt-width" v-model.trim="dataForm.sort" :min="1" :max="99999" :step="1"></el-input-number>
					</el-form-item>
					<el-form-item label="生效时间：" prop="timerange">
						<div>
							<el-date-picker
								v-model="dataForm.timerange"
								type="daterange"
								value-format="YYYY-MM-DD"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								align="right"
								@change="onchangeTime"
								:disabledDate="pickerOptionsForEditCoupon"
							/>
						</div>
						<!-- 	style="width: 460px" -->
					</el-form-item>
					<el-form-item label="状态：" prop="status">
						<el-switch class="from-ipt-width" v-model="dataForm.status" :active-value="1" :inactive-value="0" active-text="显示" inactive-text="隐藏">
						</el-switch>
					</el-form-item>
					<el-form-item label="商城中的位置：" prop="position">
						<div class="from-ipt-width">
							<el-radio v-model="dataForm.position" :label="0">标题下</el-radio>
							<el-radio v-model="dataForm.position" :label="1">标题前</el-radio>
						</div>
					</el-form-item>
					<el-form-item label="">
						<div class="from-tips" style="width: 600px">标题前最多展示1个标签，标题下最多展示3个标签；系统根据标签顺序进行展示</div>
					</el-form-item>
					<el-form-item label="">
						<div class="form-btn">
							<el-button v-show="activeName == 'first'" type="primary" @click="activeName = 'second'">下一步</el-button>
						</div>
					</el-form-item>
				</template>
				<template v-if="activeName === 'second'">
					<!--      系统标签规则-->
					<div v-if="dataForm.owner === 0">
						<el-form-item label="展示规则:" prop="playProducts">
							<div v-if="dataForm.tagName === '新品'">
								商品创建后
								<el-input-number :min="1" :max="30" :step="1" v-model.trim="dataForm.playProducts"></el-input-number>
								天内，展示此标签。
							</div>
							<div v-if="dataForm.tagName === '爆品'">
								最近30天销量大于
								<el-input-number :min="1" :max="9999" :step="1" v-model.trim="dataForm.playProducts"></el-input-number>
								件，展示此标签。
							</div>
							<div v-if="dataForm.tagName === '自营'">商家有自营标签时，展示此标签。</div>
							<div v-if="dataForm.tagName === '热卖'">
								最近30天用户评论数大于
								<el-input-number :min="1" :max="9999" :step="1" v-model.trim="dataForm.playProducts"></el-input-number>
								条，展示此标签。
							</div>
							<div v-if="dataForm.tagName === '优选'">
								最近30天用户5星好评大于
								<el-input-number :min="1" :max="9999" :step="1" v-model.trim="dataForm.playProducts"></el-input-number>
								条，展示此标签。
							</div>
							<div v-if="dataForm.tagName === '包邮'">全国包邮商品，展示此标签。</div>
						</el-form-item>
					</div>
					<!--      自建标签规则可只用的条件-->
					<div v-if="dataForm.owner > 0 || !dataForm.id">
						<div>
							<!--商品参与类型 0=指定商品，1=指定品牌，2=指定商户，3=指定商品分类-->
							<el-form-item label="商品参与类型：" prop="playType" class="custom-radio-group">
								<el-radio-group v-model="dataForm.playType" @input="handlePlayTypeChange">
									<el-radio label="product">指定商品参与</el-radio>
									<el-radio label="category">指定分类参与</el-radio>
									<el-radio label="merchant">指定商户参与</el-radio>
								</el-radio-group>
								<!-- 选择商品加载方式-->
								<product-association-form
									class="mt14"
									style="width: 100%"
									:productAssociationType="dataForm.playType"
									:formValidate="dataForm"
									:multipleBrand="true"
									:multipleCategory="true"
									:isBatchDelete="false"
									ref="productAssociationFormRef"
									@getProductAssociationData="getProductAssociationData"
								></product-association-form>
							</el-form-item>
						</div>
					</div>
					<el-form-item style="margin-top: 30px">
						<el-button v-show="activeName === 'second'" @click="activeName = 'first'">上一步</el-button>
						<el-button type="primary" :loading="loading" @click="onsubmit(dataFormRef)">保存</el-button>
					</el-form-item>
				</template>
			</el-form>
		</el-card>
	</div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules, UploadUserFile, UploadProps, UploadRequestOptions, UploadFile, UploadFiles } from 'element-plus';
// import productAssociationForm from '/@/components/productAssociationForm/index.vue';
import { productTagInfoApi, productTagUpdateApi, productTagAddApi } from '/@/api/culture/product/product';
import { useMessage, useMessageBox } from '/@/hooks/message';
const productAssociationForm = defineAsyncComponent(() => import('./components/productAssociationForm/index.vue'));

const activeName = ref('first');
const router = useRouter();
const route = useRoute();
const playValues = ref<string[]>([]);
const loading = ref(false);
const title = ref('商品标签新增');
const dataFormRef = ref();
const productAssociationFormRef = ref();
const dataForm = ref({
	tagName: '',
	id: null,
	owner: 1,
	tagNote: '',
	timerange: [] as (string | Date)[],
	sort: 0,
	playType: 'product',
	playProducts: '',
	position: 0,
	status: null,
	proBrandList: [] as number[],
	data: '',
	proCategorylist: [] as number[],
	merIds: [] as number[],
	startTime: '',
	endTime: '',
});

watch(
	() => dataForm.value.owner,
	(val) => {
		console.log('dataForm.value.owner', val);
		console.log('playProducts', dataForm.value.playProducts);
	},
	{
		immediate: true,
		deep: true,
	}
);
watch(
	() => activeName.value,
	(val) => {
		console.log('activeName', val);
		if (val == 'first') {
			playValues.value = [];
		}
	},
	{
		immediate: true,
		deep: true,
	}
);
// 禁用比当前时间小的日期
const pickerOptionsForEditCoupon = (time: any) => {
	return time.getTime() < Date.now() - 8.64e7;
};

// 	components: { productAssociationForm, merchantName },
// 	computed: {
// 		...mapGetters(['adminProductClassify']),
// 	},

const validatePlayTypeAndPlayProducts = (rule: any, value: any, callback: any) => {
	console.log('value', value);
	console.log('dataForm.value', dataForm.value);
	if (dataForm.value.playType == 'product') {
		if (value === '' || dataForm.value.playProducts.length === 0) {
			callback(new Error('请选择参与类型和对应规则'));
		} else {
			callback();
		}
	} else {
		callback();
	}
};

const rules = reactive<FormRules>({
	tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
	timerange: [
		{
			required: true,
			trigger: 'blur',
			validator: (rule: any, value: any, callback: any) => {
				console.log('val', value);
				if (value.length !== 2) {
					callback(new Error('请选择生效时间区间'));
				} else {
					callback();
				}
			},
		},
	],
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
	playType: [
		{
			required: true,
			message: '请选择参与类型和对应规则',
			trigger: 'blur',
			validator: validatePlayTypeAndPlayProducts,
		},
	],
});

const onchangeTime = (e: Array<string | number>) => {
	console.log('e', dataForm);
	dataForm.value.startTime = e && e[0] ? String(e[0]) + ' 00:00:00' : '';
	dataForm.value.endTime = e && e[1] ? String(e[1]) + ' 23:59:59' : '';
	console.log('dataForm.value', dataForm.value);
};

const handlePlayTypeChange = () => {
	playValues.value = [];
	dataForm.value.playProducts = '';
	dataForm.value.data = '';
	dataForm.value.proBrandList = [];
	dataForm.value.proCategorylist = [];
	dataForm.value.merIds = [];
	console.log('dataForm.value', dataForm.value);
};

const getProductAssociationData = (res: any) => {
	console.log('res', res);
	playValues.value = res;
	dataForm.value.playProducts = playValues.value.join(',');
	dataForm.value.proBrandList = JSON.parse(JSON.stringify(playValues));
};

const initEditData = () => {
	loading.value = true;
	productTagInfoApi(Number(route.query.id))
		.then((res: any) => {
			if (res.code === 0) {
				console.log('rs', res);
				dataForm.value = { ...res.data, timerange: [] };
				if (res.data.startTime && res.data.endTime) {
					dataForm.value.timerange = [new Date(res.data.startTime), new Date(res.data.endTime)];
				}
				// 初始化根据条件加载对应商品的条件
				getRecommendedInfo();
				loading.value = false;
			} else {
				useMessage().error(res.msg);
			}
		})
		.catch((res) => {
			loading.value = false;
		});
};

const onsubmit = (formEl: FormInstance | undefined) => {
	if (!dataForm.value.tagName) {
		useMessage().error('请输入标签名称');
		return;
	} else {
		if (dataForm.value.tagName.length < 1 || dataForm.value.tagName.length > 4) {
			useMessage().error('标签名称长度为1-4个字符');
			return;
		}
	}
	if (dataForm.value.timerange.length !== 2) {
		useMessage().error('请选择生效时间区间');
		return;
	}
	if (!dataForm.value.sort) {
		useMessage().error('请输入排序');
		return;
	}
	// 组装当前根据类型参数的业务id
	if (!dataForm.value.owner || dataForm.value.owner > 0) {
		if (playValues.value) {
			// 如果编辑过数据那么再转换格式
			if (dataForm.value.playType === 'product') {
				dataForm.value.playProducts = playValues.value.map((item: any) => item.id).join(',');
			} else {
				dataForm.value.playProducts = playValues.value.join(',');
			}
		}
	}

	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${route.query.id ? '编辑' : '新建'}商品标签`, '提示');
			} catch {
				return false;
			}
			try {
				loading.value = true;
				const request = route.query.id ? productTagUpdateApi : productTagAddApi;
				const { code, msg } = await request(dataForm.value);
				if (code === 0) {
					useMessage().success(`${route.query.id ? '编辑成功' : '新建成功'}`);
					resetForm(formEl);
					goBack();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				loading.value = false;
				useMessage().error(err.msg);
			} finally {
				loading.value = false;
			}
		}
	});
};

const goBack = () => {
	router.back();
};
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
};

//模板数据
const getRecommendedInfo = () => {
	console.log('dataForm.value.playType', dataForm.value);
	switch (dataForm.value.playType) {
		case 'product':
			dataForm.value.data = dataForm.value.playProducts;
			break;
		case 'brand':
			dataForm.value.proBrandList = dataForm.value.playProducts.includes(',')
				? dataForm.value.playProducts.split(',').map((item) => Number(item))
				: [Number(dataForm.value.playProducts)];
			break;
		case 'category':
			dataForm.value.proCategorylist = dataForm.value.playProducts.split(',').map((item) => Number(item));
			break;
		case 'merchant':
			if (dataForm.value.playProducts) {
				dataForm.value.merIds = dataForm.value.playProducts.split(',').map((item) => Number(item));
			}
			break;
	}
};

onMounted(() => {
	console.log('dataForm.value', dataForm.value);
	if (route.query.id) {
		initEditData();
		title.value = '商品标签编辑';
	}
});
</script>
<style scoped lang="scss">
.box-body {
	::v-deep.el-card__body {
		padding-top: 0px;
	}
}
.acea-row {
	display: flex;
	align-items: center;
	.after-line {
		display: flex;
		align-items: center;
		margin-right: 16px;
		color: rgba(0, 0, 0, 0.85);
		cursor: pointer;
	}
	.ht_title {
		font-weight: 500;
		font-size: 18px;
	}
}

//页面中带tab的表单外边框
.form-boder-padding {
	padding: 25px 30px 40px 30px;
}
//表单内输入框宽度
.from-ipt-width {
	width: 350px !important;
}
.from-tips {
	font-size: 12px;
	color: #909399;
	line-height: 12px;
	text-align: left;
}
.form-btn {
	width: 700px;
}
.custom-date-picker {
	:deep(.el-input__inner) {
		/* 或者其他适当的类 */
		width: 200px !important; /* 或者你想要的任何宽度 */
	}
}
:deep(.el-form-item__label) {
	font-size: 12px;
}
.custom-radio-group {
	:deep(.el-form-item__content) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
