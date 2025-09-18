<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="50%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-tabs v-model="activeName" class="demo-tabs">
					<el-tab-pane label="基本信息" name="Base">
						<el-form-item label="门店主图" prop="storeImageUrl">
							<upload-img v-model:image-url="model.storeImageUrl" />
						</el-form-item>
						<el-form-item label="小图" prop="logoUrl">
							<upload-img v-model:image-url="model.logoUrl" />
						</el-form-item>
						<el-form-item label="头图" prop="headImages">
							<div v-for="(item, index) in model.headImages" :key="index" class="flex items-center mr-2 box">
								<upload-img v-model:image-url="item.img" />
								<Delete class="del" @click="model.headImages?.splice(index, 1)" v-if="(model.headImages?.length ?? 0) > 0 && !item.img" />
							</div>
							<el-button type="primary" icon="Plus" v-if="(model.headImages?.length ?? 0) < 9" @click="addImg('headImages')">图片</el-button>
						</el-form-item>
						<el-form-item label="地图图标" prop="mapPointImage">
							<upload-img v-model:image-url="model.mapPointImage" />
						</el-form-item>
						<el-form-item label="门店名称" prop="storeName">
							<el-input
								v-model="model.storeName"
								type="text"
								placeholder="请输入门店名称"
								maxlength="50"
								show-word-limit
								clearable
								@keyup.enter="handleKeyUp(true)"
							/>
						</el-form-item>
						<el-form-item label="门店品类" prop="categoryCode">
							<el-cascader
								style="width: 100%"
								v-model="model.categoryCode"
								@change="handleCategoryChange"
								:options="categoryList"
								placeholder="请选择"
								clearable
								ref="cascader"
							/>
						</el-form-item>
						<el-form-item label="详细地址" prop="address">
							<el-select
								v-model="model.address"
								@keyup.enter="handleKeyUp(true)"
								filterable
								remote
								reserve-keyword
								placeholder="请输入关键字查询搜索"
								@change="(val: string) => confirmAddress(val)"
								:remote-method="(val: string) => getAddressSuggestsList(val)"
								:loading="loading"
							>
								<el-option v-for="item in addressSuggestsList" :key="item.value" :label="item.label" :value="item.label" />
							</el-select>
						</el-form-item>
						<el-form-item label="" prop="">
							<div class="map-input">
								<div>注意：地图默认定位到成都市中心，如需更换点位请在地图内部点击，自动替换选中点经纬度</div>

								<!-- 地图 -->
								<div ref="mapRef" class="map"></div>
								<div class="mt-3">
									经度：<el-input type="number" v-model="model.longitude" @input="getAddress" placeholder="经度" style="width: 300px"></el-input>
									纬度：<el-input type="number" v-model="model.latitude" @input="getAddress" placeholder="纬度" style="width: 300px"></el-input>
								</div>
							</div>
						</el-form-item>
						<el-form-item label="附近地铁站" prop="subwayCodes">
							<el-cascader
								style="width: 100%"
								v-model="model.subwayCodes"
								popper-class="popper-select"
								:props="{
									multiple: true,
								}"
								@change="handleCascaderChange"
								:options="subwayDataList"
								placeholder="请选择"
								clearable
								ref="cascader-subway"
							/>
						</el-form-item>
						<el-form-item label="联系方式" prop="mobile">
							<el-input
								v-model="model.mobile"
								type="text"
								maxlength="50"
								show-word-limit
								placeholder="请输入联系方式信息"
								clearable
								@keyup.enter="handleKeyUp(true)"
							/>
						</el-form-item>
						<el-form-item label="营业时间" required>
							<div>
								<div v-if="timeText.length">
									<div v-for="(item, index) in timeText" :key="index">
										{{ item }}
									</div>
								</div>
								<el-button type="primary" icon="plus" size="default" @click="addTime">添加营业时间</el-button>
							</div>
						</el-form-item>
						<el-form-item label="营业状态" prop="status">
							<el-radio-group v-model="model.status">
								<el-radio :label="1">营业中</el-radio>
								<el-radio :label="2">暂停营业</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="店铺资质" name="Desc">
						<el-form-item label="营业执照" prop="license">
							<div v-for="(item, index) in model.license" :key="index" class="flex items-center mr-2 box">
								<upload-img v-model:image-url="item.img" />
								<Delete class="del" @click="model.license?.splice(index, 1)" v-if="(model.license?.length ?? 0) > 0 && !item.img" />
							</div>
							<el-button type="primary" icon="Plus" v-if="(model.license?.length ?? 0) < 5" @click="addImg('license')">图片</el-button>
						</el-form-item>
						<el-form-item label="行业资质" prop="aptitude">
							<div v-for="(item, index) in model.aptitude" :key="index" class="flex items-center mr-2 box">
								<upload-img v-model:image-url="item.img" />
								<Delete class="del" @click="model.aptitude?.splice(index, 1)" v-if="(model.aptitude?.length ?? 0) > 0 && !item.img" />
							</div>
							<el-button type="primary" icon="Plus" v-if="(model.aptitude?.length ?? 0) < 5" @click="addImg('aptitude')">图片</el-button>
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>
		<el-dialog :close-on-click-modal="false" :show-close="false" title="营业时间" width="35%" draggable v-model="visibleTime">
			<el-card style="width: 100%; position: relative; padding-top: 10px" class="mb-4" v-for="(item, index) in wdBusinessHours" :key="index">
				<el-select v-model="item.dayOfWeek" multiple @focus="handleFocus(index)" placeholder="请选择">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
				</el-select>
				<div class="mt-4 flex items-center" v-for="(item1, index1) in item.businessHours" :key="index1">
					<el-time-picker
						v-model="item1.timeValue"
						style="width: 100%"
						is-range
						range-separator="To"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						value-format="HH:mm"
						format="HH:mm"
					/>
					<Delete style="width: 1.5em; height: 1.5em; margin-left: 8px; cursor: pointer" @click="closeTime(index, index1)" />
				</div>
				<el-button type="primary" class="mt-4" icon="plus" size="default" @click="addTimes(index)">添加时间</el-button>
				<Close
					style="width: 1.5em; height: 1.5em; cursor: pointer; position: absolute; top: 5px; right: 8px; color: #d4d7de"
					@click="closeCard(index)"
				/>
			</el-card>
			<el-button type="primary" icon="plus" size="default" @click="addPeriodTime">添加时段</el-button>
			<template #footer>
				<el-button type="info" size="default" @click="cancelTime">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmitTime">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Store, Item, Address, Category, Subway, Merchant } from './types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { jsonp } from 'vue-jsonp';
import { getCategoryList, storeConfig, storeDetail, subwayList, getByCode } from '/@/api/goodStore/merchant';
import { useThrottleFn } from '@vueuse/core';
import { Session } from '/@/utils/storage';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('新建门店');
const formRef = ref();
const scopeId = ref<string | null>('');
const activeName = ref('Base');
const loading = ref(false);
const subwayDataList = ref<Subway[]>([]);
const merchantType = ref();
const visibleTime = ref(false);
let wdBusinessHours: any = reactive([]);
const wdBusinessHoursUpdate = ref(false);
const timeText: any = ref([]);
const options = ref([
	{
		value: 1,
		label: '周一',
		disabled: false,
	},
	{
		value: 2,
		label: '周二',
		disabled: false,
	},
	{
		value: 3,
		label: '周三',
		disabled: false,
	},
	{
		value: 4,
		label: '周四',
		disabled: false,
	},
	{
		value: 5,
		label: '周五',
		disabled: false,
	},
	{
		value: 6,
		label: '周六',
		disabled: false,
	},
	{
		value: 7,
		label: '周末',
		disabled: false,
	},
]);
const model = ref<Store>({
	logoUrl: '',
	mapPointImage: '',
	storeImageUrl: '',
	storeName: '',
	categoryCode: '',
	merchantCode: '',
	headImages: [],
	aptitude: [],
	address: '',
	detailAddress: '',
	longitude: 0,
	latitude: 0,
	subwayCodes: [],
	license: [],
	businessHours: '',
	mobile: '',
	status: 1,
	jumpUrl: '',
});
const categoryList = ref<Category[]>([]);
const merchantsList = ref<Merchant[]>([]);
// 地址列表
const addressSuggestsList = ref<Address[]>([]);
//   表单校验规则
const formRules = reactive<FormRules>({
	storeImageUrl: [{ required: true, message: '门店主图不能为空' }],
	storeName: [{ required: true, message: '门店名称不能为空' }],
	categoryCode: [{ required: true, message: '门店品类不能为空' }],
	address: [{ required: true, message: '详细地址不能为空' }],
	merchantCode: [{ required: true, message: '关联商户不能为空' }],
	mobile: [{ required: true, message: '联系方式不能为空' }],
	businessHours: [{ required: true, message: '营业时间不能为空' }],
	jumpUrl: [{ required: true, message: '跳转链接不能为空' }],
});
const originLocationInfo = {
	lat: 30.65734806,
	lng: 104.06576663,
};
// 动态经纬度，随着接口或者点击切换而来
const newLocationInfo = ref({
	lat: 0,
	lng: 0,
});
// 地图实例
let map: any = null;
// marker图层
let markerLayer: any = null;
// 初始化地图
const mapRef = ref(null);
const TMap = (window as any).TMap;
const openDialog = async (id: string | null) => {
	scopeId.value = id;
	wdBusinessHours = reactive([]);
	wdBusinessHoursUpdate.value = false;
	timeText.value = ref([]);
	if (id) {
		dialogTitle.value = '编辑门店';
		try {
			const { code, data } = await storeDetail(id);
			const { latitude, longitude, merchantName, merchantCode, merchantType: type } = data;
			if (code === 0) {
				newLocationInfo.value.lat = latitude;
				newLocationInfo.value.lng = longitude;
				const aptitude = data.aptitude?.map((itemX: Item) => ({ img: itemX }));
				const headImages = data.headImages?.map((itemX: Item) => ({ img: itemX }));
				const license = data.license?.map((itemX: Item) => ({ img: itemX }));
				merchantsList.value = [{ label: merchantName, value: merchantCode, type: type }];
				merchantType.value = type;
				const detail = Object.assign(data, { aptitude, headImages, license });
				model.value = detail;
				getBusinessTime();
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = '新建门店';
		model.value.longitude = Number(originLocationInfo.lng);
		model.value.latitude = Number(originLocationInfo.lat);
		newLocationInfo.value.lat = Number(originLocationInfo.lat);
		newLocationInfo.value.lng = Number(originLocationInfo.lng);
	}
	getSubway();
	getCatgry();
	visible.value = true;
	nextTick(() => {
		initMap();
	});
};

const getBusinessTime = () => {
	getByCode({ storeCode: model.value.storeCode }).then((res) => {
		const timeData = res.data;
		model.value.details = timeData;
		if (!timeData.length) {
			wdBusinessHours = reactive([
				{
					dayofWeek: [],
					businessHours: [],
				},
			]);
			return;
		}
		wdBusinessHours = reactive([]);
		timeData.forEach((item) => {
			let obj = {
				dayOfWeek: item.dayOfWeek,
				businessHours: [],
			};
			obj.businessHours = item.businessHours.map((item1) => {
				return { timeValue: [item1.openTime, item1.closeTime] };
			});
			wdBusinessHours.push(obj);
		});
		getTimeText();
	});
};
// 处理数据格式
const transformListSubway = (originalList: Array<any>) => {
	return originalList.map((line) => {
		// 检查 subways 是否为 null 或 undefined，并给它一个空数组作为默认值
		const subways = line.subways || [];

		return {
			label: line.lineName.trim(),
			value: line.lineCode.trim(),
			children: subways.map((subway: any) => ({
				label: subway.subwayName.trim(),
				value: subway.subwayCode.trim(), // 去除 subwayCode 的多余空格
			})),
		};
	});
};
// 处理数据格式
const transformListCat = (originalList: Array<any>) => {
	return originalList.map((line) => ({
		label: line.categoryName.trim(),
		value: line.categoryCode.trim(),
		children: line.children.map((category: any) => ({
			label: category.categoryName.trim(),
			value: category.categoryCode.trim(),
		})),
	}));
};
const getSubway = async () => {
	try {
		const { code, data } = await subwayList();
		if (code === 0) {
			subwayDataList.value = transformListSubway(data);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getCatgry = async () => {
	try {
		const { code, data } = await getCategoryList();
		if (code === 0) {
			categoryList.value = transformListCat(data);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const closeMyDialog = () => {
	visible.value = false;
	if (map) {
		map.destroy(); // 销毁地图实例
	}
};

const handleCategoryChange = (selectedData: string[]) => {
	model.value.categoryCode = selectedData[selectedData.length - 1];
};

const addImg = (type: string) => {
	(model.value[type] ?? []).push({ img: '' });
};
const initMap = () => {
	//定义地图中心点坐标
	const mapCenter = new TMap.LatLng(newLocationInfo.value.lat, newLocationInfo.value.lng);
	map = new TMap.Map(mapRef.value, {
		center: mapCenter, //设置地图中心点坐标
		zoom: 16, //设置地图缩放级别
		pitch: 0, //设置俯仰角
		rotation: 0, //设置地图旋转角度
		viewMode: '2D',
	});
	// 移除旋转控件
	map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
	// 移除logo以及左下角信息
	let logoInfo = document.querySelector('canvas+div:last-child') as HTMLDivElement;
	logoInfo.style.display = 'none';

	//初始化marker图层
	markerLayer = new TMap.MultiMarker({
		map: map,
	});
	addMarker();
	// 点击地图获取定位和地址
	map.on('click', (e: any) => {
		const { lat, lng } = e.latLng;
		newLocationInfo.value.lat = lat;
		newLocationInfo.value.lng = lng;
		model.value.latitude = lat;
		model.value.longitude = lng;
		addMarker();
		getAddress();
		if (map) {
			map.destroy();
		}
		initMap();
	});
};
// 添加标注
const addMarker = () => {
	// 清空标注 使其始终为一个
	markerLayer.setGeometries([]);
	markerLayer.add({
		position: new TMap.LatLng(newLocationInfo.value.lat, newLocationInfo.value.lng),
	});
};
// 根据经纬度获取地址
const getAddress = useThrottleFn(
	() => {
		const params = {
			location: model.value.latitude + ',' + model.value.longitude,
			key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
			output: 'jsonp',
			poi_options: {
				policy: 4,
			},
		};
		jsonp('https://apis.map.qq.com/ws/geocoder/v1', params).then((data) => {
			const { status, result } = data;
			if (status === 0) {
				newLocationInfo.value.lat = result.location.lat;
				newLocationInfo.value.lng = result.location.lng;
				model.value.address = result.formatted_addresses.standard_address;
				if (map) {
					map.destroy();
				}
				initMap();
			}
		});
	},
	1000,
	false
);
const confirmAddress = (val: string) => {
	const addressData = addressSuggestsList.value.find((item: Address) => item.label === val);
	const { province = '', city = '', district = '', latitude = 0, longitude = 0 } = addressData ?? {};
	model.value.detailAddress = province + city + district + val;
	model.value.latitude = latitude;
	model.value.longitude = longitude;
	handleChangeAddress();
};
// 推荐地址列表
const getAddressSuggestsList = (val: string) => {
	model.value.address = val;
	model.value.detailAddress = val;
	const params = {
		keyword: val,
		region: '成都',
		key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
		output: 'jsonp',
		region_fix: 1,
	};
	jsonp('https://apis.map.qq.com/ws/place/v1/suggestion', params).then((data) => {
		const { status, data: suggests } = data;
		if (status === 0) {
			const suggestsList = suggests?.map((item: any) => {
				return {
					...item,
					label: item.title,
					value: item.id,
				};
			});
			addressSuggestsList.value = suggestsList;
		}
	});
};
// 获取定位
const handleChangeAddress = async () => {
	const params = {
		address: model.value.detailAddress,
		key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
		output: 'jsonp',
	};
	jsonp('https://apis.map.qq.com/ws/geocoder/v1', params).then((data) => {
		const { status, result, message } = data;
		if (status === 0) {
			newLocationInfo.value.lat = result.location.lat;
			newLocationInfo.value.lng = result.location.lng;
			model.value.longitude = Number(result.location.lng);
			model.value.latitude = Number(result.location.lat);
			// 销毁地图实例，重新初始化地图
			if (map) {
				map.destroy();
			}
			initMap();
		} else {
			useMessage().error(message);
		}
	});
};
const delEmpty = (list: any[] = []) => {
	return list.filter((item) => item);
};

const validImg = (list: Array<Item> = [], msg: string) => {
	const val = list.some((item) => !item.img);
	if (val) useMessage().error(msg);
	return !val;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	console.log('model.value', model.value);
	const headImagesValid = validImg(model.value.headImages, '头图图片区不能为空');
	const aptitudeValid = validImg(model.value.aptitude, '行业资质图片区不能为空');
	const licenseValid = validImg(model.value.license, '营业执照图片区不能为空');
	if (!formEl || !headImagesValid || !aptitudeValid || !licenseValid) return;
	formEl.validate(async (valid) => {
		model.value.merchantCode = Session.get('merchantCode');
		model.value.details = wdBusinessHours.map((item) => ({
			dayOfWeek: item.dayOfWeek,
			businessHours: item.businessHours.map((time) => ({
				openTime: time.timeValue[0] + ':00',
				closeTime: time.timeValue[1] + ':00',
			})),
		}));
		const formParam = { ...model.value };
		const aptitude = delEmpty(model.value.aptitude)?.map((itemX: Item) => itemX.img || itemX);
		const headImages = delEmpty(model.value.headImages)?.map((itemX: Item) => itemX.img || itemX);
		const license = delEmpty(model.value.license)?.map((itemX: Item) => itemX.img || itemX);
		const params = Object.assign(formParam, { aptitude, headImages, license });
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}门店`, `${scopeId.value ? '修改' : '新建'}门店`);
			} catch {
				return false;
			}
			try {
				const { code, msg } = await storeConfig(params);
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改成功' : '新建成功'}`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};
const handleCascaderChange = (selectedData: any) => {
	// 获取叶子节点的值
	const leafValues = selectedData.map((item: any) => {
		return item[item.length - 1];
	});
	model.value.subwayCodes = leafValues;
	if (selectedData.length > 3) {
		useMessage().error('最多只能选择三个站点');
		model.value.subwayCodes = leafValues.slice(0, 3);
	}
};
// 输入框回车事件
const handleKeyUp = (enterable: Boolean) => {
	if (!enterable) return;
	onSubmit(formRef.value);
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		storeImageUrl: '',
		logoUrl: '',
		storeName: '',
		categoryCode: '',
		merchantCode: '',
		headImages: [],
		aptitude: [],
		address: '',
		detailAddress: '',
		longitude: 0,
		latitude: 0,
		subwayCodes: [],
		license: [],
		businessHours: '',
		mobile: '',
		status: 1,
	};
	activeName.value = 'Base';
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm(formEl);
};

const handleFocus = (idx) => {
	let newArr = wdBusinessHours.filter((item, index) => index === idx);
	options.value.forEach((item) => {
		wdBusinessHours.forEach((item1) => {
			if (item1.dayOfWeek.includes(item.value)) {
				item.disabled = true;
			}
		});
	});
	options.value.forEach((item) => {
		newArr.forEach((item1) => {
			if (item1.dayOfWeek.includes(item.value)) {
				item.disabled = false;
			}
		});
	});
};

const addTime = () => {
	visibleTime.value = true;
};
const addPeriodTime = () => {
	const obj = {
		dayOfWeek: [],
		businessHours: [],
	};
	wdBusinessHours.push(obj);
};

const closeCard = (idx: any) => {
	wdBusinessHours.splice(idx, 1);
	if (wdBusinessHours.length) {
		options.value.forEach((item) => {
			wdBusinessHours.forEach((item1) => {
				if (item1.dayOfWeek.includes(item.value)) {
					item.disabled = true;
				} else {
					item.disabled = false;
				}
			});
		});
	} else {
		options.value.forEach((item) => {
			item.disabled = false;
		});
	}
};
const closeTime = (idx: any, idx1: any) => {
	wdBusinessHours[idx].businessHours.splice(idx1, 1);
};
const addTimes = (idx: any) => {
	const obj = { timeValue: [] };
	wdBusinessHours[idx].businessHours.push(obj);
};

const weekList: any = reactive({
	1: '周一',
	2: '周二',
	3: '周三',
	4: '周四',
	5: '周五',
	6: '周六',
	7: '周末',
});
// 营业时间文本
const getTimeText = () => {
	timeText.value = [];
	wdBusinessHours.forEach((item) => {
		let textWeek = '';
		item.dayOfWeek.sort();
		item.dayOfWeek.forEach((item1, index) => {
			textWeek += weekList[item1] + (index + 1 === item.dayOfWeek.length ? '' : '、');
		});
		item.businessHours = item.businessHours.filter((item3) => item3.timeValue.length != 0);
		item.businessHours.forEach((item2) => {
			textWeek += '  ' + item2.timeValue[0] + ' - ' + item2.timeValue[1];
		});
		timeText.value.push(textWeek);
	});
	console.log(timeText.value);
};

const onSubmitTime = () => {
	getTimeText();
	const details: any = [];
	wdBusinessHours.forEach((item, index) => {
		// if (!item.dayOfWeek.length || !item.businessHours.length) {
		// 	return
		// }
		let obj = {
			dayOfWeek: item.dayOfWeek,
			businessHours: [],
		};
		item.businessHours = item.businessHours.filter((item1) => item1.timeValue.length != 0);
		obj.businessHours = item.businessHours.map((item1) => {
			if (item1.timeValue.length) {
				return { openTime: item1.timeValue[0], closeTime: item1.timeValue[1] };
			}
		});
		details.push(obj);
	});
	model.value.details = details;
	visibleTime.value = false;
	wdBusinessHoursUpdate.value = true;
};
const cancelTime = () => {
	if (wdBusinessHoursUpdate.value) return (visibleTime.value = false);
	wdBusinessHours = reactive([]);
	getBusinessTime();
	visibleTime.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.map-input {
	height: 456px;
}

.map {
	width: 715px;
	height: 366px;
}

.add-img {
	width: 150px;
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-color: transparent;
	border: 1px dashed #cdd0d6;
	border-radius: 8px;
	cursor: pointer;
	margin-left: 10px;

	.icon-plus {
		width: 24px;
		height: 24px;
	}
}

.box {
	position: relative;

	.del {
		position: absolute;
		width: 1em;
		height: 1em;
		top: 0;
		right: 0;
	}
}
</style>
<style>
.popper-select {
	:is(li)[aria-haspopup='true'] {
		.el-checkbox {
			display: none;
		}
	}
}
</style>
