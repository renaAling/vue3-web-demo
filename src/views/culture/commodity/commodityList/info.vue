<template>
	<div class="infoBox">
		<el-dialog :title="isAudit ? '商品审核' : '商品详情'" ref="myDialog" v-model="visible" width="70%" :close-on-click-modal="false" class="infoBox">
			<div v-loading="loading">
				<div class="detailHead">
					<div class="acea-row row-between headerBox">
						<div class="full">
							<img class="order_icon" :src="formValidate.image" alt="" />
							<div class="text">
								<div class="title">{{ formValidate.name }}</div>
								<div>
									<span class="mr20">商品ID：{{ formValidate.id }}</span>
								</div>
							</div>
						</div>
						<div v-if="isAudit" class="acea-row justify-content">
							<!-- v-debounceClick="
									() => {
										onSubmit('fail');
									}
								" -->
							<el-button size="small" style="margin-left: 0" @click="handleAudit('fail')">{{ loadingBtn ? '提交中 ...' : '审核拒绝' }}</el-button>
							<el-button size="small" type="primary" @click="handleAudit('success')">{{ loadingBtn ? '提交中 ...' : '审核通过' }}</el-button>
						</div>
					</div>
					<ul class="list">
						<li class="item">
							<div class="title">商品类型</div>
							<div v-if="formValidate.type == 0">普通商品</div>
							<div v-if="formValidate.type == 5">云盘商品</div>
							<div v-if="formValidate.type == 6">卡密商品</div>
							<div v-if="formValidate.type == 9">数字藏品</div>
							<div v-if="formValidate.type == 11">优惠券商品</div>
						</li>
						<li class="item">
							<div class="title">商品状态</div>
							<div class="color-warning">{{ formValidate.isShow ? '上架' : '下架' }}</div>
						</li>
						<li class="item" v-if="tenantId != '1922177185280557058'">
							<div class="title">商品售价</div>
							<div>{{ formValidate.price }}元</div>
						</li>
						<li class="item">
							<div class="title">销量</div>
							<div>{{ formValidate.sales }}</div>
						</li>
						<li class="item">
							<div class="title">库存</div>
							<div>{{ formValidate.stock }}</div>
						</li>
						<li class="item">
							<div class="title">创建时间</div>
							<div></div>
						</li>
					</ul>
				</div>
				<el-tabs type="border-card" v-model="currentTab" v-if="formValidate && isShow">
					<el-tab-pane label="基本信息" name="0">
						<div class="detailSection divBox">
							<ul class="list">
								<li class="item tabItem">
									<div class="lang">平台商品分类：</div>
									<div class="value">
										<el-cascader
											v-model="formValidate.categoryId"
											:options="adminProductClassify"
											:props="props1"
											:show-all-levels="false"
											:disabled="isDisabled"
										/>
									</div>
								</li>
								<li class="item tabItem">
									<div class="lang">排序：</div>
									<div class="value">{{ formValidate.sort }}</div>
								</li>
							</ul>
							<div class="list" style="display: block">
								<div class="item tabItem">
									<div class="lang">关键字：</div>
									<div class="value">{{ formValidate.keyword }}</div>
								</div>
								<div class="item tabItem">
									<div class="lang line-heightOne">保障服务：</div>
									<div class="value acea-row" style="display: flex; flex-direction: row">
										<div v-for="item in formValidate.guaranteeList" :key="item.id" class="mr-5">
											<span class="iconfont font14"></span>{{ item.name }}
										</div>
									</div>
								</div>
								<div class="item tabItem">
									<div class="lang">商品简介：</div>
									<div class="value">{{ formValidate.intro }}</div>
								</div>
								<div class="item tabItem">
									<div class="acea-row row-middle">
										<div class="lang">封面图：</div>
										<div class="upLoadPicBox">
											<el-image class="pictrue" :src="formValidate.image" :preview-src-list="[formValidate.image]" />
										</div>
									</div>
								</div>
								<div v-show="videoLink" class="item">
									<div class="acea-row row-middle">
										<div class="lang">主图视频：</div>
										<div class="upLoadPicBox">
											<video class="pictrue" :src="videoLink" controls="controls">您的浏览器不支持 video 标签。</video>
										</div>
									</div>
								</div>
								<div class="item">
									<div class="acea-row row-middle">
										<div class="lang">轮播图：</div>
										<div v-for="(item, index) in formValidate.sliderImages" :key="index" class="pictrue">
											<el-image class="pictrue" :src="item" :preview-src-list="formValidate.sliderImages" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="规格库存" name="1">
						<div class="detailSection divBox">
							<ul class="list">
								<li class="item tabItem">
									<div class="lang">商品规格：</div>
									<div class="value">{{ formValidate.specType ? '多规格' : '单规格' }}</div>
								</li>
								<li class="item tabItem" v-if="tenantId !== '1925075171367059458' && tenantId !== '1925074881528070146'">
									<div class="lang">会员商品：</div>
									<div class="value">{{ formValidate.isPaidMember ? '是' : '否' }}</div>
								</li>
							</ul>
							<div style="margin-top: 16px">
								<div class="lang mb10">商品属性：</div>
								<template v-if="formValidate.specType === false">
									<el-table border :data="OneattrValue" class="tabNumWidth" size="small">
										<el-table-column label="图片">
											<template #default="{ row }">
												<div class="upLoadPicBox">
													<div v-if="row.image" class="pictrue tabPic">
														<el-image :src="row.image" />
													</div>
													<div v-else class="upLoad tabPic">
														<i class="el-icon-camera cameraIconfont" />
													</div>
												</div>
											</template>
										</el-table-column>
										<!-- <el-table-column label="支付现金" prop="price" width="90" /> -->
										<!-- <el-table-column  v-if="tenantId == '1922177185280557058'" label="使用积分" prop="scorePrice" width="120">
											<template #default="{ row }">
												<span v-text="row.scorePrice" />
												<span v-if="row.scorePrice != null">({{ (row.scorePrice / 100).toFixed(2) }}元)</span>
											</template>
										</el-table-column> -->
										<el-table-column v-if="tenantId != '1922177185280557058'" label="原价" prop="">
											<template #default="{ row }">
												<span v-if="row.price != null && row.scorePrice != null">
													{{ (row.price + row.scorePrice / 100).toFixed(2) }}
												</span>
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId == '1922177185280557058'" label="支付积分" prop="scorePrice">
											<template #default="{ row }">
												<span v-text="row.scorePrice" />
												<!-- <span v-if="row.scorePrice != null">({{ (row.scorePrice / 100).toFixed(2) }}元)</span> -->
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId != '1922177185280557058'" label="内购金额(元)" prop="vipPrice">
											<template #default="{ row }">
												<span>{{ row.vipPrice }}</span>
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId == '1922177185280557058' && formValidate.isPaidMember" label="内购积分" prop="vipScorePrice" width="120">
											<template #default="{ row }">
												<span>{{ row.vipScorePrice }}</span>
											</template>
										</el-table-column>
										<el-table-column v-for="(item, iii) in attrValue" :key="'attrValuea' + iii" :label="formThead[iii].title">
											<template #default="{ row }">
												<span>{{ row[iii] }}</span>
											</template>
										</el-table-column>
									</el-table>
								</template>
								<template v-if="formValidate.attr.length > 0 && formValidate.specType">
									<el-table border :data="ManyAttrValue" class="tabNumWidth" size="small">
										<template v-if="manyTabDate">
											<el-table-column v-for="(item, iii) in manyTabDate" :key="iii" :label="manyTabTit[iii].title">
												<template #default="{ row }">
													<span class="priceBox" v-text="row[iii]" />
												</template>
											</el-table-column>
										</template>
										<el-table-column label="图片">
											<template #default="{ row }">
												<div class="upLoadPicBox">
													<div v-if="row.image" class="pictrue tabPic"><img :src="row.image" /></div>
													<div v-else class="upLoad tabPic">
														<i class="el-icon-camera cameraIconfont" />
													</div>
												</div>
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId != '1922177185280557058'" label="内购金额(元)" prop="vipPrice">
											<template #default="{ row }">
												<span>{{ row.vipPrice }}</span>
											</template>
										</el-table-column>
										<el-table-column v-if="tenantId == '1922177185280557058' && formValidate.isPaidMember" label="内购积分" prop="vipScorePrice">
											<template #default="{ row }">
												<span>{{ row.vipScorePrice }}</span>
											</template>
										</el-table-column>
										<el-table-column v-for="(item, iii) in attrValue" :key="iii" :label="formThead[iii].title">
											<template #default="{ row }">
												<span>{{ row[iii] }}</span>
											</template>
										</el-table-column>
									</el-table>
								</template>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="商品详情" name="2">
						<div class="detailSection divBox">
							<div class="contentPic" v-html="formValidate.content || '无'"></div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-dialog>
		<el-dialog v-model="dialogFormVisible" title="审核驳回" width="30%">
			<el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100">
				<el-form-item label="拒绝原因" label-width="100" prop="reason">
					<el-input v-model="ruleForm.reason" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="submit()">确认</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	productCategoryApi,
	brandListAllApi,
	productAuditApi,
	productDetailApi,
	setDomain,
	replaceImgSrcHttps,
} from '/@/api/culture/commodity/commodityList';
import { Session } from '/@/utils/storage';
const $emit = defineEmits(['subSuccess']);
const visible = ref<boolean>(false);
const isAudit = ref<boolean>(false);
const loading = ref<boolean>(false);
const loadingBtn = ref<boolean>(false);
const ruleFormRef = ref() as any;
const tenantId = ref(Session.getTenant());
const dialogFormVisible = ref<boolean>(false); //驳回审核弹窗
const rules = reactive({
	auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
	reason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
});
const ruleForm = reactive<any>({
	reason: '',
	auditStatus: 'success',
	id: '',
});
const isShow = ref(false);
const defaultObj = ref({
	image: '',
	sliderImages: [],
	videoLink: '',
	sliderImage: '',
	name: '',
	intro: '',
	keyword: '',
	sort: 0,
	giveIntegral: 0,
	ficti: 0,
	isShow: false,
	attrValue: [
		{
			image: '',
			// price: 0,
			vipPrice: 0,
			// cost: 0,
			// otPrice: 0,
			stock: 0,
			weight: 0,
			volume: 0,
			brokerage: 0,
			brokerageTwo: 0,
		},
	],
	attr: [],
	selectRule: '',
	content: '',
	specType: false,
	id: undefined,
	couponIds: [],
	coupons: [],
	postage: '1',
	categoryId: '',
	guaranteeIds: '',
	guaranteeIdsList: [],
});
const objTitle = ref({
	price: {
		title: '售价',
	},
	vipPrice: {
		title: '内购金额(元)',
	},
	cost: {
		title: '成本价',
	},
	otPrice: {
		title: '原价',
	},
	stock: {
		title: '库存',
	},
	weight: {
		title: '重量（KG）',
	},
	volume: {
		title: '体积(m³)',
	},
	brokerage: {
		title: '一级返佣(%)',
	},
	brokerageTwo: {
		title: '二级返佣(%)',
	},
});
// const direction = ref('rtl');
const dialogVisible = ref(false);
const isDisabled = ref(true);
const props1 = reactive({
	children: 'childList',
	label: 'name',
	value: 'id',
	multiple: false,
	emitPath: false,
});
// const tabs = ref([]);
// const props = ref({ multiple: true });
// const active = ref(0);
const OneattrValue = ref([Object.assign({}, defaultObj.value.attrValue[0])]); // 单规格
const ManyAttrValue = ref([Object.assign({}, defaultObj.value.attrValue[0])]); // 多规格
// const ruleList = ref([]);
// const merCateList = ref([]); // 商户分类筛选
// const shippingList = ref([]); // 运费模板
const formThead = ref<any>(Object.assign({}, objTitle.value));
const formValidate = ref<any>(Object.assign({}, defaultObj.value));
// const tempData = ref({
// 	page: 1,
// 	limit: 9999,
// });
const manyTabTit = ref({});
const manyTabDate = ref({});
// const grid2 = ref({
// 	xl: 12,
// 	lg: 12,
// 	md: 12,
// 	sm: 24,
// 	xs: 24,
// });
// const isBtn = ref(false);
// const manyFormValidate = ref([]);
const currentTab = ref('0');
// const isChoice = ref('');
// const grid = ref({
// 	xl: 8,
// 	lg: 8,
// 	md: 12,
// 	sm: 24,
// 	xs: 24,
// });
const attrInfo = ref<any>({});
// const tempRoute = ref<any>({});
const isAttr = ref(false);
const showAll = ref(false);
const videoLink = ref('');
const productId = ref<any>('');
// const search = ref({
// 	limit: 10,
// 	page: 1,
// 	cid: '',
// 	brandName: '',
// });
// const totalPage = ref(0);
// const total = ref(0);
const adminProductClassify = ref<any[]>([]);
const attrValue = computed(() => {
	// const obj: { [key: string]: any } = { ...defaultObj.value.attrValue[0] };
	const obj: any = Object.assign({}, defaultObj.value.attrValue[0]);
	delete obj.image;
	delete obj.brokerage;
	delete obj.brokerageTwo;
	delete obj.vipPrice;
	// const arr = Object.keys(obj);
	// console.log('attrValueattrValueattrValueattrValue', arr);
	return obj;
});
// attrValue 计算属性
// const attrValue = computed(() => {
// 	const obj: AttrValue = Object.assign({}, defaultObj.attrValue[0]);

// 	delete obj.price;
// 	delete obj.scorePrice;
// 	delete obj.image;
// 	delete obj.cdkeyId;
// 	delete obj.expand;
// 	delete obj.cdkeyLibraryName;

// 	if (!dataForm.value.isPaidMember) {
// 		delete obj.vipPrice;
// 	}

// 	const type = dataForm.value.type;
// 	if (type === 5 || type === 9) {
// 		delete obj.volume;
// 		delete obj.weight;
// 	}

// 	if (type === 6) {
// 		delete obj.stock;
// 		delete obj.volume;
// 		delete obj.weight;
// 	}
// 	console.log('attrValue 计算属性obj', obj);
// 	return obj;
// });
onMounted(() => {
	getAdminProductClassify();
	getMerProductBrand();
});
// 计算属性
const oneFormBatch = computed(() => {
	return [
		{
			id: '',
			image: '',
			price: 0,
			stock: 0,
			weight: 0,
			volume: 0,
			cdkeyId: null,
			cdkeyLibraryName: '',
			expand: '',
			vipPrice: 0,
			scorePrice: 0,
		},
	];
});
const openDialog = async (id: any, style: string) => {
	await getInfo(id);
	// setTagsViewTitle(id);
	isShow.value = true;
	productId.value = id;
	if (style === 'audit') isAudit.value = true;
	else isAudit.value = false;
	visible.value = true;
};
// const setTagsViewTitle = (id: any) => {
// 	const title = isDisabled.value ? '商品详情' : '编辑商品';
// 	const routeData = Object.assign({}, tempRoute.value, { title: `${title}-${id}` });
// 	this.$store.dispatch('tagsView/updateVisitedView', routeData);
// };
// watch: {
//     'formValidate.attr': {
//       handler: function (val) {
//         if (this.formValidate.specType && this.isAttr) this.watCh(val); //重要！！！
//       },
//       immediate: false,
//       deep: true,
//     },
//     componentKey: {
//       handler: function (val) {
//         this.currentTab = '0';
//         this.dialogVisible = true;
//       },
//       immediate: false,
//       deep: true,
//     },
//   },
watch(
	() => formValidate.value.attr,
	(val) => {
		if (formValidate.value.specType && isAttr.value) watCh(val); //重要！！！
	},
	{
		immediate: true,
		deep: true,
	}
);
const watCh = (val: any) => {
	const tmp: any = {};
	const tmpTab: any = {};
	formValidate.value.attr.forEach((o: any) => {
		tmp[o.attrName] = { title: o.attrName };
		tmpTab[o.attrName] = '';
	});
	ManyAttrValue.value = attrFormat(val);
	ManyAttrValue.value.forEach((val: any, index) => {
		const key = Object.values(val.attrValue).sort().join('/');
		if (attrInfo.value[key]) ManyAttrValue.value[index] = attrInfo.value[key];
	});
	attrInfo.value = [];
	ManyAttrValue.value.forEach((val: any) => {
		attrInfo.value[Object.values(val.attrValue).sort().join('/')] = val;
	});
	manyTabTit.value = tmp;
	manyTabDate.value = tmpTab;
	formThead.value = Object.assign({}, formThead.value, tmp);
};
// 防抖
const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
	let timer: ReturnType<typeof setTimeout> | null = null;
	return function (...args: Parameters<T>): void {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
};
// 使用防抖包装处理函数
const handleAudit = debounce((str: string) => {
	onSubmit(str);
}, 500); // 设置防抖时间为 500ms
const getFileType = (fileName: string) => {
	// 后缀获取
	let suffix = '';
	// 获取类型结果
	let result = '';
	try {
		const flieArr = fileName.split('.');
		suffix = flieArr[flieArr.length - 1];
	} catch (err) {
		suffix = '';
	}
	// fileName无后缀返回 false
	if (!suffix) {
		return false;
	}
	suffix = suffix.toLocaleLowerCase();
	// 图片格式
	const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
	// 进行图片匹配
	result = imglist.find((item) => item === suffix) || '';
	if (result) {
		return 'image';
	}
	// 匹配 视频
	const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
	result = videolist.find((item) => item === suffix) || '';
	if (result) {
		return 'video';
	}
	// 其他 文件类型
	return 'other';
};
const attrFormat = (arr: any) => {
	let data: any[] = [];
	const res: any[] = [];
	return format(arr);
	function format(arr: any) {
		if (arr.length > 1) {
			arr.forEach((v: any, i) => {
				if (i === 0) data = arr[i]['attrValue'];
				const tmp: any[] = [];
				if (!data) return;
				data.forEach(function (vv) {
					arr[i + 1] &&
						arr[i + 1]['attrValue'] &&
						arr[i + 1]['attrValue'].forEach((g) => {
							const rep2: any = (i !== 0 ? '' : arr[i]['attrName'] + '_') + vv + '$&' + arr[i + 1]['attrName'] + '_' + g;
							tmp.push(rep2);
							if (i === arr.length - 2) {
								const rep4: any = {
									image: '',
									price: 0,
									vipPrice: 0,
									cost: 0,
									otPrice: 0,
									stock: 0,
									weight: 0,
									volume: 0,
									brokerage: 0,
									brokerageTwo: 0,
								};
								rep2.split('$&').forEach((h: any) => {
									const rep3 = h.split('_');
									if (!rep4['attrValue']) rep4['attrValue'] = {};
									rep4['attrValue'][rep3[0]] = rep3.length > 1 ? rep3[1] : '';
								});
								for (let attrValueKey in rep4.attrValue) {
									rep4[attrValueKey] = rep4.attrValue[attrValueKey];
								}
								res.push(rep4);
							}
						});
				});
				data = tmp.length ? tmp : [];
			});
		} else {
			const dataArr: any[] = [];
			arr.forEach((v: any) => {
				v['attrValue'].forEach((vv: any, kk: number) => {
					dataArr[kk] = v['attrName'] + '_' + vv;
					res[kk] = {
						image: '',
						price: 0,
						vipPrice: 0,
						cost: 0,
						otPrice: 0,
						stock: 0,
						weight: 0,
						volume: 0,
						brokerage: 0,
						brokerageTwo: 0,
						attrValue: { [v['attrName']]: vv },
					};
					// Object.values(res[kk].attrValue).forEach((v, i) => {
					//   res[kk]['value' + i] = v
					// })
					for (let attrValueKey in res[kk].attrValue) {
						res[kk][attrValueKey] = res[kk].attrValue[attrValueKey];
					}
				});
			});
			data.push(dataArr.join('$&'));
		}
		return res;
	}
};
// 详情
const getInfo = async (id: any) => {
	loading.value = true;
	try {
		const { code, data, msg } = await productDetailApi(id);
		if (code === 0) {
			console.log('data', data);
			let info = data;
			formValidate.value = {
				image: setDomain(info.image),
				sliderImage: info.sliderImage,
				sliderImages: JSON.parse(info.sliderImage),
				name: info.name,
				intro: info.intro,
				keyword: info.keyword,
				// cateIds: info.cateId.split(',').map(Number), // 商品分类id
				// cateId: info.cateId, // 商户商品分类id传值
				sort: info.sort,
				isShow: info.isShow,
				// tempId: info.tempId,
				attr: info.attr,
				attrValue: info.attrValue,
				selectRule: info.selectRule,
				content: replaceImgSrcHttps(info.content),
				specType: info.specType,
				id: info.id,
				giveIntegral: info.giveIntegral,
				ficti: info.ficti,
				coupons: info.coupons,
				couponIds: info.couponIds,
				postage: info.postage,
				categoryId: info.categoryId, //平台商品分类
				guaranteeIds: info.guaranteeIds, //保障服务传值
				guaranteeList: info.guaranteeList, //保障服务
				sales: info.sales,
				type: info.type,
				stock: info.stock,
				price: info.price,
				vipPrice: info.vipPrice,
				auditStatus: info.auditStatus,
				isPaidMember: info.isPaidMember,
			};
			let imgs = JSON.parse(info.sliderImage);
			let imgss: any[] = [];
			Object.keys(imgs).map((i) => {
				imgss.push(setDomain(imgs[i]));
			});
			formValidate.value.sliderImages = [...imgss];
			console.log('formValidate.value.sliderImages', formValidate.value.sliderImages);
			if (getFileType(formValidate.value.sliderImages[0]) == 'video') {
				console.log('aaaaaaa');
				//如果返回数据轮播图的第一张是视频，就将其赋值给videoLink做渲染，同时将其在轮播图中删除
				// this.$set(this, 'videoLink', this.formValidate.sliderImages[0]);
				videoLink.value = formValidate.value.sliderImages[0];
				// formValidate.value.sliderImages.splice(0, 1);
				formValidate.value.sliderImages.shift();
			}
			console.log('formValidate.value.sliderImages', formValidate.value.sliderImages);
			console.log('info.specTyp', info.specTyp);
			if (info.specType) {
				formValidate.value.attr = info.attr.map((item: any) => {
					return {
						attrName: item.attrName,
						attrValue: item.attrValues.split(','),
					};
				});
				ManyAttrValue.value = info.attrValue;
				ManyAttrValue.value.forEach((val: any) => {
					val.image = setDomain(val.image);
					val.attrValue = JSON.parse(val.attrValue);
					attrInfo.value[Object.values(val.attrValue).sort().join('/')] = val;
				});
				/***多规格商品如果被删除过sku，优先展示api返回的数据,否则会有没有删除的错觉***/
				let manyAttr = attrFormat(formValidate.value.attr);
				if (manyAttr.length !== ManyAttrValue.value.length) {
					// this.$set(this, 'showAll', true);
					showAll.value = true;
					isAttr.value = false;
				} else {
					isAttr.value = true;
				}
				/*******/
				const tmp: any = {};
				const tmpTab: any = {};
				formValidate.value.attr.forEach((o: any) => {
					// tmp['value' + i] = { title: o.attrName }
					// tmpTab['value' + i] = ''
					tmp[o.attrName] = { title: o.attrName };
					tmpTab[o.attrName] = '';
				});

				// 此处手动实现后台原本value0 value1的逻辑
				formValidate.value.attrValue.forEach((item: any) => {
					for (let attrValueKey in item.attrValue) {
						item[attrValueKey] = item.attrValue[attrValueKey];
					}
				});
				manyTabTit.value = tmp ? tmp : {};
				manyTabDate.value = tmpTab ? tmpTab : {};
				formThead.value = Object.assign({}, formThead.value, tmp);
				console.log('formThead.value', formThead.value);
				console.log('attrValue.value', attrValue.value);
			} else {
				OneattrValue.value = info.attrValue;
				OneattrValue.value[0].image = setDomain(info.image);
			}
			loading.value = false;
			// attrValue.value.forEach((item: any) => {
			// 	console.log('attrValueItem', item);
			// });
			console.log('attrValue', attrValue.value);
			console.log('formThead', formThead.value);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		loading.value = false;
		useMessage().error(error.msg);
	}
};
/** 平台商品分类 **/
const getAdminProductClassify = async () => {
	try {
		const { code, data, msg } = await productCategoryApi();
		if (code === 0) {
			console.log('data', data);
			adminProductClassify.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
/** 商品品牌 **/
const getMerProductBrand = async () => {
	try {
		const { code, data, msg } = await brandListAllApi();
		if (code === 0) {
			console.log('data', data);
			// adminProductClassify.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
	// return new Promise((resolve, reject) => {
	//   product
	//     .brandListAllApi()
	//     .then(async (res) => {
	//       commit('SET_ProductBrand', res);
	//       resolve(res);
	//     })
	//     .catch((error) => {
	//       reject(error);
	//     });
	// });
};
// 审核提交
const onSubmit = async (type: string) => {
	ruleForm.auditStatus = type;
	if (type === 'success') {
		try {
			await useMessageBox().confirm('审核通过该商品吗？', '提示');
		} catch {
			return;
		}
		submit();
	} else {
		cancelForm();
	}
};
const submit = async () => {
	loadingBtn.value = true;
	ruleForm.id = productId.value;
	try {
		const { code, msg } = await productAuditApi(ruleForm);
		if (code === 0) {
			useMessage().success('操作成功');
			visible.value = false;
			dialogFormVisible.value = false;
			currentTab.value = '0';
			$emit('subSuccess');
			loadingBtn.value = false;
		} else {
			loadingBtn.value = false;
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
//审核拒绝
const cancelForm = () => {
	dialogFormVisible.value = true;
	//   this.$modalPrompt('textarea', '拒绝原因').then((V) => {
	//     this.ruleForm.reason = V;
	//     this.submit();
	//   });
};

defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
::v-deep .el-table th.el-table__cell > .cell,
::v-deep.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
	padding-left: 15px;
}
.detailSection {
	border: none !important;
}
.tipsWidth {
	width: 65px !important;
}
.tabNumWidth {
	margin-left: -15px;
}
.contentPic {
	::v-deep img {
		width: 100%;
		height: 100%;
	}
}
.demo-drawer__content {
	padding-bottom: 86px;
}
.spfont {
	color: #606266;
}
.from-foot-btn {
	width: 100%;
	padding: 20px;
}
.fix {
	z-index: 10;
	position: absolute;
	left: 0;
	bottom: 0px;
	padding-bottom: 10px;
	background: #fff;
}
.btn-shadow {
	box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
}
.infoBox {
	::v-deep .el-select__tags {
		line-height: inherit;
		left: -6px;
		top: 37%;
	}
	::v-deep .el-tag.el-tag--info {
		background: none;
		border: none;
		color: #303133 !important;
		height: auto;
		line-height: inherit;
		cursor: none;
		font-size: 13px !important;
	}
	::v-deep .el-input--medium {
		font-size: 13px;
	}
	::v-deep .el-drawer__header {
		margin-bottom: 0;
		font-size: 20px;
	}
	::v-deep .el-input.is-disabled .el-input__inner,
	::v-deep .el-cascader {
		font-size: 13px;
		height: auto;
		background: none;
		cursor: none;
		color: #303133;
		display: inline-block;
		line-height: inherit;
	}
	:v-deep(.el-input.is-disabled .el-input__wrapper) {
		background-color: #fff !important;
	}
	:v-deep(.el-input.el-input-hover-border-color) {
		border: #fff;
	}
	:v-deep .el-input__suffix {
		display: none !important;
	}
	::v-deep .el-icon-arrow-down,
	::v-deep .el-icon-arrow-up {
		display: none;
	}
}
.divBox {
	::v-deep .el-input__inner:hover,
	::v-deep.el-input > input,
	::v-deep .el-textarea > textarea {
		border: none;
		padding: 0;
	}
	::v-deep .el-card__body {
		padding: 5px;
	}
}
.disLabel {
	::v-deep .el-form-item__label {
		margin-left: 36px !important;
	}
}
.disLabelmoren {
	::v-deep.el-form-item__label {
		margin-left: 120px !important;
	}
}
.priamry_border {
	border: 1px solid var(--prev-color-primary);
	color: var(--prev-color-primary);
}
.color-item {
	height: 30px;
	line-height: 30px;
	padding: 0 10px;
	color: #fff;
	margin-right: 10px;
}
.color-list .color-item.blue {
	background-color: #1e9fff;
}
.color-list .color-item.yellow {
	background-color: rgb(254, 185, 0);
}
.color-list .color-item.green {
	background-color: #009688;
}
.color-list .color-item.red {
	background-color: #ed4014;
}
.proCoupon {
	::v-deepel-form-item__content {
		margin-top: 5px;
	}
}
.tabPic {
	width: 40px !important;
	height: 40px !important;
	img {
		width: 100%;
		height: 100%;
	}
}
.noLeft {
	::v-deepel-form-item__content {
		margin-left: 0 !important;
	}
}
.selWidth {
	width: 100%;
}
.selWidthd {
	width: 100px;
}
.button-new-tag {
	height: 28px;
	line-height: 26px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
.labeltop {
	::v-deepel-form-item__label {
		float: none !important;
		display: inline-block !important;
		width: auto !important;
	}
}
.iview-video-style {
	width: 300px;
	height: 180px;
	border-radius: 10px;
	background-color: #707070;
	margin: 0 120px 20px;
	position: relative;
	overflow: hidden;
}

.iview-video-style .iconv {
	color: #fff;
	line-height: 180px;
	width: 50px;
	height: 50px;
	display: inherit;
	font-size: 26px;
	position: absolute;
	top: -74px;
	left: 50%;
	margin-left: -25px;
}

.iview-video-style .mark {
	position: absolute;
	width: 100%;
	height: 30px;
	top: 0;
	background-color: rgba(0, 0, 0, 0.5);
	text-align: center;
}
.order_icon {
	width: 60px;
	height: 60px;
	border-radius: 6px;
	background-color: var(--prev-color-primary);
	display: flex;
	justify-content: center;
	align-items: center;
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
}
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
		text-align: left;

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
.lang {
	width: 100px;
	text-align: right;
}
.list {
	display: flex;
	align-items: center;
	justify-content: space-between;
	// margin: 10px 0;
	.tabItem {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}
}
.upLoadPicBox {
	display: inline-block;
	cursor: pointer;

	.upLoad {
		width: 58px;
		height: 58px;
		line-height: 58px;
		border: 1px dotted rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.02);
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
//多图中图片样式
.pictrue {
	width: 60px;
	height: 60px;
	border: 1px dotted rgba(0, 0, 0, 0.1);
	margin-right: 10px;
	position: relative;
	cursor: pointer;
	border-radius: 4px;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
	}

	video {
		width: 100%;
		height: 100%;
	}
}
.acea-row {
	display: flex;
}
::v-deep(.el-cascader) {
	.el-input__wrapper {
		/* 隐藏背景颜色 */
		background-color: transparent !important;

		/* 隐藏边框颜色 */
		box-shadow: none !important;
	}
	.el-input__suffix {
		display: none !important;
	}

	/* 如果需要移除焦点状态下的边框 */
	&:focus-within .el-input__wrapper {
		box-shadow: none !important;
	}
}
</style>
