<template>
	<div class="platformEntry">
		<div class="header">
			<Logo />
		</div>
		<div class="content">
			<el-scrollbar style="width: 100%; display: flex; align-items: center; flex-direction: column; box-sizing: border-box">
				<div class="mainBody">
					<div class="steps">
						<el-steps :active="active" finish-status="success" align-center>
							<el-step title="基本信息" />
							<el-step title="经营信息" />
							<el-step title="联系方式" />
						</el-steps>
					</div>
					<div class="form-container" v-if="active === 0 && !isSubmit">
						<div class="form-title">商家基本信息</div>
						<el-form :model="form" ref="merchantRef" :inline="true" :rules="merchantRules" label-position="top" style="width: 100%; display: block">
							<div>
								<el-row>
									<el-col :span="12">
										<el-form-item label="商家名称" prop="name">
											<el-input placeholder="请输入营业执照上的企业名称" v-model="form.name" clearable maxlength="30" />
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="统一社会信用编码" prop="creditCode">
											<el-input placeholder="请输入18位统一社会信用编码" v-model="form.creditCode" clearable maxlength="18" />
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="法定代表人" prop="legalRepresentative">
											<el-input placeholder="请输入法定代表人姓名" v-model="form.legalRepresentative" clearable />
										</el-form-item>
									</el-col>
									<el-col :span="12" style="display: flex">
										<el-form-item label="注册时间" prop="registrationTime" style="width: 50%">
											<el-date-picker
												v-model="form.registrationTime"
												value-format="YYYY-MM-DD"
												placeholder="请选择营业执照上的注册时间"
												style="width: 100%"
											/>
										</el-form-item>
										<el-form-item label="注册资本" prop="registeredCapital" style="width: 50%">
											<div style="position: relative; width: 100%">
												<el-input-number
													v-model="form.registeredCapital"
													:precision="2"
													clearable
													:step="0.01"
													controls-position="right"
													style="width: 100%"
												>
												</el-input-number>
												<span style="width: 40px; position: absolute; top: 0; right: 0; color: #999">万元</span>
											</div>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<div style="padding-bottom: 10px; color: var(--el-text-color-regular)">
											<span style="color: var(--el-color-danger)">*</span> 经营地址
										</div>
										<div
											style="
												display: flex;
												justify-content: space-between;
												align-items: center;
												width: 100%;
												margin-right: 10px;
												box-sizing: border-box;
											"
										>
											<el-form-item label="" prop="province" style="width: 31%">
												<el-select v-model="form.province" placeholder="请选择省份" style="width: 100%" @change="getCityList">
													<el-option v-for="item in provinceArr" :key="'province' + item.code" :label="item.name" :value="item.code" />
												</el-select>
											</el-form-item>
											<el-form-item label="" prop="city" style="width: 31%">
												<el-select
													v-model="form.city"
													placeholder="请选择城市"
													style="width: 100%"
													:disabled="!form.province"
													@change="getCountyList"
												>
													<el-option v-for="item in cityArr" :key="'city' + item.code" :label="item.name" :value="item.code" />
												</el-select>
											</el-form-item>
											<el-form-item label="" prop="county" style="width: 31%">
												<el-select v-model="form.county" placeholder="请选择区县" style="width: 100%" :disabled="!form.city">
													<el-option v-for="item in countyArr" :key="'county' + item.code" :label="item.name" :value="item.name" /> </el-select
											></el-form-item>
										</div>
									</el-col>
									<el-col :span="24">
										<el-form-item label="" prop="address">
											<el-input placeholder="请输入详细地址" v-model="form.address" clearable maxlength="50" />
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<el-form-item label="营业执照" prop="businessLicense" style="width: 100%">
											<el-upload
												class="upload-demo"
												action="#"
												drag
												:show-file-list="false"
												:http-request="handleTableImageUpload.bind(null, 'businessLicense', row, $index)"
												:on-success="productUploadSuccess"
												:before-upload="beforeUpload"
												style="width: 100%"
											>
												<img v-if="form.businessLicense" :src="form.businessLicense" class="avatar" />
												<div v-else class="uploader-text">
													<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
													<span>点击或拖拽文件上传</span>
													<span>支持jpg、png格式,大小不超过5M</span>
												</div>
											</el-upload>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-form>
					</div>
					<div class="form-container" v-if="active === 1 && !isSubmit">
						<div class="form-title">经营信息</div>
						<el-form :model="form" ref="manageRef" :inline="true" :rules="manageRules" label-position="top" style="width: 100%; display: block">
							<div>
								<el-row>
									<el-col :span="12">
										<el-form-item label="经营范围" prop="businessScope">
											<el-input placeholder="请输入营业执照经营范围" v-model="form.businessScope" clearable maxlength="500" />
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="门店名称" prop="storeName">
											<el-input placeholder="请输入门店名称" v-model="form.storeName" clearable maxlength="30" />
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-form-item label="门店品类" prop="storeCategoryCode">
											<el-select v-model="form.storeCategoryCode" placeholder="请选择门店品类" style="width: 100%">
												<el-option
													v-for="item in storeCategoryArr"
													:key="'storeCategory' + item.categoryCode"
													:label="item.categoryName"
													:value="item.categoryCode"
												/>
											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="经营年限" prop="duration">
											<el-input-number v-model="form.duration" min="1" max="99999" placeholder="请输入经营年限" controls-position="right" />
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<div style="padding-bottom: 10px; color: var(--el-text-color-regular)">
											<span style="color: var(--el-color-danger)">*</span> 经营场所照片
										</div>
										<div class="businessSite" style="">
											<el-form-item label="" prop="dpmtz" style="width: 24%">
												<el-upload
													class="upload-demo"
													action="#"
													drag
													:show-file-list="false"
													:http-request="handleTableImageUpload.bind(null, 'dpmtz', row, $index)"
													:on-success="productUploadSuccess"
													accept="image/png,image/jpg"
													:before-upload="beforeUpload"
													style="width: 100%"
												>
													<img v-if="form.dpmtz" :src="form.dpmtz" class="avatar" />
													<div v-else class="uploader-text">
														<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
														<span>店铺门头照</span>
													</div>
												</el-upload>
											</el-form-item>
											<el-form-item label="" prop="dphjz" style="width: 24%">
												<el-upload
													class="upload-demo"
													action="#"
													drag
													:show-file-list="false"
													:http-request="handleTableImageUpload.bind(null, 'dphjz', row, $index)"
													:on-success="productUploadSuccess"
													accept="image/png,image/jpg"
													:before-upload="beforeUpload"
													style="width: 100%"
												>
													<img v-if="form.dphjz" :src="form.dphjz" class="avatar" />
													<div v-else class="uploader-text">
														<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
														<span>店铺环境照</span>
													</div>
												</el-upload>
											</el-form-item>
											<el-form-item label="" prop="dpsytz" style="width: 24%">
												<el-upload
													class="upload-demo"
													action="#"
													drag
													:show-file-list="false"
													:http-request="handleTableImageUpload.bind(null, 'dpsytz', row, $index)"
													:on-success="productUploadSuccess"
													accept="image/png,image/jpg"
													:before-upload="beforeUpload"
													style="width: 100%"
												>
													<img v-if="form.dpsytz" :src="form.dpsytz" class="avatar" />
													<div v-else class="uploader-text">
														<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
														<span>店铺收银台照</span>
													</div>
												</el-upload>
											</el-form-item>
											<el-form-item label="" prop="dpccz" style="width: 24%">
												<el-upload
													class="upload-demo"
													action="#"
													drag
													:show-file-list="false"
													:http-request="handleTableImageUpload.bind(null, 'dpccz', row, $index)"
													:on-success="productUploadSuccess"
													accept="image/png,image/jpg"
													:before-upload="beforeUpload"
													style="width: 100%"
												>
													<img v-if="form.dpccz" :src="form.dpccz" class="avatar" />
													<div v-else class="uploader-text">
														<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
														<span>店铺仓储照</span>
													</div>
												</el-upload>
											</el-form-item>
										</div>
										<div class="businessSite-text">支持jpg、png格式,大小不超过5M</div>
									</el-col>
								</el-row>
							</div>
						</el-form>
					</div>
					<div class="form-container" v-if="active === 2 && !isSubmit">
						<div class="form-title">账户信息</div>
						<el-form :model="form" ref="accountRef" :inline="true" :rules="accountRules" label-position="top" style="width: 100%; display: block">
							<div>
								<el-row>
									<el-col :span="12">
										<el-form-item label="账户联系人" prop="accountContact">
											<el-input placeholder="请输入账户联系人" v-model="form.accountContact" clearable maxlength="10" />
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="手机号码" prop="mobile">
											<el-input placeholder="请输入手机号码" v-model="form.mobile" clearable maxlength="11" />
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<el-form-item label="合约" prop="name" style="width: 100%">
											<el-upload
												v-model:file-list="contractUrls"
												class="upload-box"
												drag
												:headers="headers"
												:action="baseURL + other.adaptationUrl('/admin/sys-file/uploadC')"
												:before-upload="beforeUploadContract"
												:on-exceed="handleExceed"
												:limit="3"
												style="width: 100%"
											>
												<div class="uploader-text">
													<el-icon class="avatar-uploader-icon"><upload-filled /></el-icon>
													<span>点击或拖拽文件上传</span>
												</div>
												<template #tip>
													<div class="el-upload__tip">支持PDF档案，大小不超过50M，最多上传3个文件</div>
												</template>
											</el-upload>
										</el-form-item>
									</el-col>
								</el-row>
							</div>
						</el-form>
					</div>
					<div class="form-btn" v-if="!isSubmit">
						<el-button class="btn-last" v-if="active > 0" @click="lastForm()"> 上一步 </el-button>
						<el-button class="btn-next" v-if="active < 2" type="primary" @click="nextForm(active)"> 下一步 </el-button>
						<el-button class="btn-next" v-if="active === 2" type="primary" @click="submit()"> 提 交 </el-button>
					</div>
				</div>
				<div v-if="isSubmit" class="submitSuccess">
					<p>
						<el-icon style="color: #20b759" :size="50"><SuccessFilled /></el-icon>
					</p>
					<p>提交成功</p>
					<p>稍后会有客服与您联系</p>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { FormRules, UploadRequestOptions, UploadProps } from 'element-plus';
import { ElNotification } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';
import { getPlatformMerchantAdd, getPlatformCategoryArr, getTreeList, uploadImage } from '/@/api/platformEntry/dataFilling';
const Logo = defineAsyncComponent(() => import('/@/layout/logo/index.vue'));
const form = ref<any>({
	name: '',
	creditCode: '',
	legalRepresentative: '',
	registrationTime: '',
	registeredCapital: '',
	province: '',
	city: '',
	county: '',
	address: '',
	businessLicense: '',
	businessScope: '',
	storeName: '',
	storeCategoryCode: '',
	duration: '',
	dpmtz: '',
	dphjz: '',
	dpsytz: '',
	dpccz: '',
	fileList: [],
	businessAddress: '',
	premiseImgUrls: [], //店铺照片
	contractUrls: [],
	auditStatus: true, //链接添加默认提交审核
});
const contractUrls = ref([]) as any;
const provinceArr = ref([]) as any;
const cityArr = ref([]) as any;
const countyArr = ref([]) as any;
const storeCategoryArr = ref([]) as any;
const active = ref(0);
const isSubmit = ref(false); //是否提交
const merchantRef = ref() as any; //商家基本信息表单
const uploadContrac = ref(false);
const merchantRules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
	creditCode: [{ required: true, message: '请输入18位统一社会信用编码', trigger: 'blur' }],
	legalRepresentative: [{ required: true, message: '请输入法定代表人姓名', trigger: 'blur' }],
	registrationTime: [{ required: true, message: '请选择营业执照上的注册时间', trigger: 'blur' }],
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
	province: [{ required: true, message: '请选择省份', trigger: 'blur' }],
	city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
	// { required: countyArr.value.length > 0, message: '请选择区县', trigger: 'blur' },
	county: [
		{
			validator: (rule, value, callback) => {
				if (countyArr.value.length > 0 && !value) {
					return callback(new Error('请选择区县'));
				} else callback();
			},
			trigger: 'blur',
		},
	],
	address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
	businessLicense: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
});

const manageRef = ref() as any; //经营信息表单
const manageRules = reactive<FormRules<any>>({
	businessScope: [{ required: true, message: '请输入营业执照经营范围', trigger: 'blur' }],
	storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
	storeCategoryCode: [{ required: true, message: '请选择门店品类', trigger: 'blur' }],
	duration: [{ required: true, message: '请输入经营年限', trigger: 'blur' }],
	dpmtz: [{ required: true, message: '请上传店铺门头照', trigger: 'blur' }],
	dphjz: [{ required: true, message: '请上传店铺环境照', trigger: 'blur' }],
	dpsytz: [{ required: true, message: '请上传店铺收银台照', trigger: 'blur' }],
	dpccz: [{ required: true, message: '请上传店铺仓储照', trigger: 'blur' }],
});

const accountRef = ref() as any; //账户信息表单
const accountRules = reactive<FormRules<any>>({
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
	active.value = 0;
	getStoreCategoryCodeArr();
	getSiteTreeList();
});
const getStoreCategoryCodeArr = async () => {
	try {
		const res = await getPlatformCategoryArr();
		if (res.code === 0) {
			storeCategoryArr.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const getCityList = (province: string) => {
	if (province) {
		const arr = provinceArr.value.filter((e: any) => e.code === province);
		cityArr.value = arr[0].childNode;
		form.value.city = '';
		form.value.county = '';
	} else {
		cityArr.value = [];
		form.value.city = '';
	}
};
const getCountyList = (city: string) => {
	console.log(' cityArr.value', cityArr.value);
	console.log('city', city);
	if (city) {
		const arr = cityArr.value.filter((e: any) => e.code === city);
		console.log('arr', arr);
		countyArr.value = arr[0].childNode;
		form.value.county = '';
	} else {
		countyArr.value = [];
		form.value.county = '';
	}
};
const getSiteTreeList = async () => {
	try {
		const res = await getTreeList();
		if (res.code === 0) {
			console.log('res', res);
			provinceArr.value = res.data;
			// storeCategoryArr.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const lastForm = () => {
	console.log('active.value', active.value);
	if (active.value > 0) active.value--;
};
const nextForm = async (index: number) => {
	if (index === 0) {
		await merchantRef.value.validate((valid: boolean) => {
			if (valid) active.value = 1;
		});
	} else if (index === 1) {
		await manageRef.value.validate((valid: boolean) => {
			if (valid) active.value = 2;
		});
	}
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
		// if (key === 'premiseImgUrls') {
		// 	form.value[key][index] = data.url;
		// } else {
		form.value[key] = data.url;
		// }
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

// 上传图片
// 多文件上传组件配置;
const uploadImageConfig = {
	fileSize: 5,
	fileType: ['image/png', 'image/jpg', 'image/jpeg'],
};
/**
 * @description 文件上传之前判断
 * @param file 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
	console.log('file', file);
	const imgSize = file.size / 1024 / 1024 < uploadImageConfig.fileSize;
	const imgType = uploadImageConfig.fileType.includes(file.type);
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
				message: `上传图片大小不能超过 ${uploadImageConfig.fileSize}M！`,
				type: 'warning',
			});
		}, 0);
	return imgType && imgSize;
};

// 请求头处理
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});
const handleExceed: UploadProps['onExceed'] = (uploadFile) => {
	console.log('uploadFile', uploadFile);
	useMessage().error('上传附件最多3个文件！');
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
		useMessage().error('上传附件大小不能超过50M！');
	}
	return imgType && imgSize;
};
// 防抖
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout> | null = null;
	return function (...args: Parameters<T>): void {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
}
// 使用防抖包装处理函数
const submit = debounce(() => {
	handleSubmit();
}, 500); // 设置防抖时间为 500ms
// 提交表单
const handleSubmit = async () => {
	uploadContrac.value = false;
	console.log('contractUrls', contractUrls.value);
	console.log('form.value.contractUrls', form.value.contractUrls);
	if (!accountRef.value) return;
	await accountRef.value.validate(async (valid: any, fields: any) => {
		if (valid) {
			console.log('submit!', form.value);
			// 经营地址
			const prArr = provinceArr.value.filter((e: any) => e.code === form.value.province);
			const province = prArr[0].name.split(' ');
			const cArr = cityArr.value.filter((e: any) => e.code === form.value.city);
			const city = cArr[0].name.split(' ');
			const county = form.value.county.split(' ');
			form.value.businessAddress = province[1] + city[1] + county[1] + form.value.address;
			// 店铺照片
			form.value.premiseImgUrls = [form.value.dpmtz, form.value.dphjz, form.value.dpsytz, form.value.dpccz];
			contractUrls.value.forEach((item: any) => {
				let obj = { contractName: '', contractUrl: '' };
				obj = {
					contractName: item.response.data.fileName,
					contractUrl: item.response.data.url,
				};
				if (!obj.contractUrl) {
					useMessage().error('合同文件上传中，请稍后提交');
					uploadContrac.value = true;
					return;
				}
				form.value.contractUrls.push(obj);
			});
			if (uploadContrac.value) return;
			try {
				let res = await getPlatformMerchantAdd(form.value);
				if (res.code === 0) {
					useMessage().success('提交成功，稍后会有客服与您联系');
					isSubmit.value = true;
					active.value = 3;
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
</script>
<style lang="scss" scoped>
.platformEntry {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	position: relative;
}
.header {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	background: var(--next-bg-menuBar);
}
.content {
	width: 100%;
	height: 100%;
	padding: 40px 0 0px 0;
	box-sizing: border-box;
}
.mainBody {
	margin: 50px 0 20px 0;
	width: 80%;
	padding: 15px 15px 5px 15px;
	border-radius: 16px;
	box-sizing: border-box;
	background: var(--next-bg-menuBar);
	box-shadow: 2px 0 6px rgb(0 21 41 / 1%);
}
.submitSuccess {
	margin: 50px 0 20px 0;
	align-items: center;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	p {
		text-align: center;
		font-size: 20px;
		margin: 0 auto;
		color: #4785ea;
		font-weight: bold;
	}
}
.steps {
	width: 60%;
	margin: 30px auto 10px auto;
}
.form-container {
	width: 90%;
	margin: 0 auto;
	padding-bottom: 20px;
	border-bottom: 1px solid #e2e2e2;
}
.form-title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 20px;
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
.businessSite {
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-right: 10px;
}
.businessSite-text {
	color: #999;
	font-size: 12px;
}
.form-btn {
	// position: relative;
	width: 90%;
	margin: 0 auto 20px auto;
	padding: 20px 0px;
	background: var(--next-bg-menuBar);
	// display: flex;
	// justify-content: space-between;
	position: relative;
	.btn-last {
		position: absolute;
		top: 20px;
		left: 0;
	}
	.btn-next {
		position: absolute;
		top: 20px;
		right: 0;
	}
}
:deep(.steps .is-process) {
	color: var(--el-color-primary) !important;
	border-color: var(--el-color-primary) !important;
}
:deep(.el-input-number .el-input__inner) {
	text-align: left;
}
:deep(.steps .el-step__icon-inner) {
	font-size: 20px !important;
}
:deep(.el-input-number__decrease) {
	display: none;
}
:deep(.el-input-number__increase) {
	display: none;
}
:deep(.el-scrollbar__wrap) {
	width: 100%;
}
:deep(.el-scrollbar__view) {
	width: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
}
:deep(.el-upload-dragger) {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
