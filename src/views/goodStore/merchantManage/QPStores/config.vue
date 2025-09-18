<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow-y: scroll">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="180px" :rules="formRules">
				<el-tabs v-model="activeName" class="demo-tabs">
					<el-tab-pane label="基本信息" name="Base">
						<el-form-item label="商家" prop="merchantCode">
							<el-select
								v-model="model.merchantCode"
								@keyup.enter="handleKeyUp(true)"
								filterable
								remote
								reserve-keyword
								placeholder="请输入关键字查询搜索"
								:remote-method="(val: string) => getMerchantsList(val)"
								:loading="loading"
								:disabled="scopeId"
							>
								<el-option v-for="item in merchantsList" :key="item.merchantCode" :label="item.name" :value="item.merchantCode" />
							</el-select>
						</el-form-item>
						<el-form-item label="渠道门店" prop="channelStoreName" v-if="scopeId && model.channelStoreName">
							<el-input v-model="model.channelStoreName" type="text" maxlength="50" show-word-limit clearable disabled />
						</el-form-item>
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
						<!-- <el-form-item label="站厅位置" prop="" class="flex-row">
							<div class="add_zhanting cursor-pointer" @click="showZhantingMap(true)" v-show="!isAddZhanTingMap">+添加</div>
							<div class="add_zhanting cursor-pointer" @click="showZhantingMap(false)" v-show="isAddZhanTingMap">-删除</div>
						</el-form-item> -->
						<!--  站厅位置   -->
						<el-form-item label="站厅位置" prop="">
							<div class="map-input">
								<el-select v-model="selectName" clearable filterable placeholder="请选择" class="mb-3" @change="handleZhantingChange">
									<el-option v-for="item in optionsZhanting" :key="item" :label="item.subwayName" :value="item"> </el-option>
								</el-select>

								<!-- 地图 -->
								<div ref="mapZhantingRef" class="map"></div>
								<div class="mt-3">
									经度：<el-input type="number" v-model="model.mapLongitude" @input="getAddress" placeholder="经度" style="width: 300px"></el-input>
									纬度：<el-input type="number" v-model="model.mapLatitude" @input="getAddress" placeholder="纬度" style="width: 300px"></el-input>
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
						<el-form-item label="营业时间" prop="businessHours">
							<el-input
								v-model="model.businessHours"
								type="text"
								maxlength="50"
								show-word-limit
								placeholder="请输入营业时间信息"
								clearable
								@keyup.enter="handleKeyUp(true)"
							/>
						</el-form-item>
						<el-form-item label="根据营业时间开店/闭店" prop="isOpenSwitch">
							<el-switch v-model="model.isOpenSwitch" :active-value="true" :inactive-value="false"></el-switch>
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
				<div class="mt-5 flex justify-center">
					<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
					<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Store, Item, Address, Category, Subway, Merchant, SubwayLines } from './types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { jsonp } from 'vue-jsonp';
import { storeDetailApi, storeSaveOrUpdateApi, getCategoryApi, notChannelMerchantApi, subwayListApi, subwayLikeListApi } from '/@/api/trcomps/store';
import { useThrottleFn } from '@vueuse/core';
import router from '/@/router';
import { useRoute } from 'vue-router';
import { getSubwayList } from '/@/api/goodStore/merchant';
let route = useRoute();

const formRef = ref();
const scopeId = ref<any>('');
const activeName = ref('Base');
const loading = ref(false);
const subwayDataList = ref<Subway[]>([]);
const merchantType = ref();
//站厅列表数据
let optionsZhanting = ref<SubwayLines[]>([]);
//选中的站厅Name
let selectName = ref('');
//是否是编辑，并且选择过站厅站点
let isEditAndHaveZhanTingMap = ref(false);
const TZhantingMap = (window as any).TMap;
//是否添加了站厅位置
let isAddZhanTingMap = ref(true);
// 动态经纬度站点和code，随着接口或者点击切换而来
const newZhantingLocationInfo = ref({
	lat: 0,
	lng: 0,
	subwayName: '',
	subwayCode: '',
	mapImageUrl: '',
});
const model = ref<Store>({
	mapStationCode: '',
	logoUrl: '',
	storeName: '',
	storeCode: '',
	channelStoreCode: '',
	categoryCode: '',
	merchantCode: '',
	headImages: [],
	aptitude: [],
	address: '',
	detailAddress: '',
	longitude: 0,
	latitude: 0,
	mapLongitude: 0,
	mapLatitude: 0,
	subwayCodes: [],
	license: [],
	businessHours: '',
	mobile: '',
	status: 1,
	isOpenSwitch: false
});
const categoryList = ref<Category[]>([]);
const merchantsList = ref<Merchant[]>([]);

// 地址列表
const addressSuggestsList = ref<Address[]>([]);
//   表单校验规则
const formRules = reactive<FormRules>({
	storeName: [{ required: true, message: '门店名称不能为空' }],
	categoryCode: [{ required: true, message: '门店品类不能为空' }],
	address: [{ required: true, message: '详细地址不能为空' }],
	merchantCode: [{ required: true, message: '关联商户不能为空' }],
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

// const showZhantingMap = (isShow: boolean) => {
//   isAddZhanTingMap.value = isShow
//   //如果添加了站点地图
//   if (isAddZhanTingMap.value){
//     model.value.mapLatitude = newZhantingLocationInfo.value.lat;
//     model.value.mapLongitude = newZhantingLocationInfo.value.lng;
//   }else {
//     model.value.mapLatitude = '';
//     model.value.mapLongitude = '';
//   }
// };

const addZhantingLocationInfo = (e: any) => {
	newZhantingLocationInfo.value.lat = Number(e.latitude);
	newZhantingLocationInfo.value.lng = Number(e.longitude);
	newZhantingLocationInfo.value.subwayName = e.subwayName;
	newZhantingLocationInfo.value.subwayCode = e.subwayCode;
	newZhantingLocationInfo.value.mapImageUrl = e.mapImageUrl;
	console.log('addZhantingLocationInfo', e);
};

const changeZhantingCenter = () => {
	newZhantingLocationInfo.value.lat = model.value.mapLatitude || 0;
	newZhantingLocationInfo.value.lng = model.value.mapLongitude || 0;
	if (mapZhanting) {
		mapZhanting.destroy();
	}
	initZhantingMap();
};

const handleZhantingChange = (e: any) => {
	console.log('重选了', e);
	//changeZhantingMap(optionsZhanting.value[e]);

	selectName.value = e.subwayName;
	model.value.mapLatitude = Number(e.latitude);
	model.value.mapLongitude = Number(e.longitude);
	model.value.mapStationCode = e.subwayCode;
	addZhantingLocationInfo(e);

	//如果点击清空，清空经纬度
	if (!e?.subwayCode) {
		model.value.mapLatitude = '';
		model.value.mapLongitude = '';
		model.value.mapStationCode = '';
		return;
	}

	if (mapZhanting) {
		mapZhanting.destroy();
	}
	initZhantingMap();
};
// 地图实例
let mapZhanting: any = null;
// 初始化地图
const mapZhantingRef = ref(null);
// marker图层
let markerZhantingLayer: any = null;

// 地图实例
let map: any = null;
// marker图层
let markerLayer: any = null;
// 初始化地图
const mapRef = ref(null);
const TMap = (window as any).TMap;
const getDetail = async (id: any) => {
	try {
		const { code, data } = await storeDetailApi(id);
		const { mapStationCode, mapLatitude, mapLongitude, latitude, longitude, merchantName, merchantCode, merchantType: type } = data;
		if (code === 0) {
			newLocationInfo.value.lat = latitude;
			newLocationInfo.value.lng = longitude;
			if (mapLatitude != null && mapLatitude > 0) {
				isEditAndHaveZhanTingMap.value = true;
				newZhantingLocationInfo.value.lat = mapLatitude;
				newZhantingLocationInfo.value.lng = mapLongitude;
				newZhantingLocationInfo.value.subwayCode = mapStationCode;
			} else {
				isEditAndHaveZhanTingMap.value = false;
			}
			const aptitude = data.aptitude?.map((itemX: Item) => ({ img: itemX }));
			const headImages = data.headImages?.map((itemX: Item) => ({ img: itemX }));
			const license = data.license?.map((itemX: Item) => ({ img: itemX }));
			merchantsList.value = [{ name: merchantName, merchantCode: merchantCode }];
			merchantType.value = type;
			const detail = Object.assign(data, { aptitude, headImages, license });
			model.value = detail;
			if (latitude || longitude) {
				if (map) {
					map.destroy();
				}
				initMap();
			}
			/*if (model.value.mapStationCode) {
				newZhantingLocationInfo.value.lat = mapLatitude;
				newZhantingLocationInfo.value.lng = mapLongitude;
			} else {
				addZhantingLocationInfo(optionsZhanting.value[0]);
				if (mapZhanting) {
					mapZhanting.destroy();
				}
				initZhantingMap();
			}*/
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 处理数据格式
const transformListSubway = (originalList: Array<any>) => {
	return originalList.map((line) => ({
		label: line.lineName.trim(),
		value: line.lineCode.trim(),
		children: line.subways.map((subway: any) => ({
			label: subway.subwayName.trim(),
			value: subway.subwayCode.trim(), // 去除 subwayCode 的多余空格
		})),
	}));
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
		const { code, data } = await subwayListApi();
		if (code === 0) {
			subwayDataList.value = transformListSubway(data);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getCatgry = async () => {
	try {
		const { code, data } = await getCategoryApi();
		if (code === 0) {
			categoryList.value = transformListCat(data);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleCategoryChange = (selectedData: string[]) => {
	if (selectedData) {
		model.value.categoryCode = selectedData[selectedData.length - 1];
	}
};
let keywords: any;
const getMerchantsList = async (query: string | undefined) => {
	if (keywords === query) return;
	keywords = query;
	loading.value = true;
	try {
		const params = {
			keywords: query,
			page: 1,
			limit: 20,
		};
		const { data, code, msg } = await notChannelMerchantApi(params);
		loading.value = false;
		if (code === 0) {
			merchantsList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
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

const initZhantingMap = () => {
	//定义地图中心点坐标
	console.log('newZhantingLocationInfo.value.lat', newZhantingLocationInfo.value.lat);
	const mapCenter = new TZhantingMap.LatLng(newZhantingLocationInfo.value.lat, newZhantingLocationInfo.value.lng);
	mapZhanting = new TZhantingMap.Map(mapZhantingRef.value, {
		center: mapCenter, //设置地图中心点坐标
		zoom: 19, //设置地图缩放级别
		pitch: 0, //设置俯仰角
		rotation: 0, //设置地图旋转角度
		viewMode: '2D',
	});
	console.log('mapZhanting');
	// 移除旋转控件
	mapZhanting.removeControl(TZhantingMap.constants.DEFAULT_CONTROL_ID.ROTATION);
	// 移除logo以及左下角信息
	let logoInfo = document.querySelector('canvas+div:last-child') as HTMLDivElement;
	logoInfo.style.display = 'none';
	console.log('移除logo以及左下角信息');

	//初始化marker图层
	markerZhantingLayer = new TZhantingMap.MultiMarker({
		map: mapZhanting,
	});
	console.log('初始化marker图层');
	addZhantingMarker();
	addZhantingGround(newZhantingLocationInfo);
	console.log('addZhantingMarker');
	// 点击地图获取定位和地址
	mapZhanting.on('click', (e: any) => {
		const { lat, lng } = e.latLng;
		newZhantingLocationInfo.value.lat = lat;
		newZhantingLocationInfo.value.lng = lng;
		model.value.mapLatitude = lat;
		model.value.mapLongitude = lng;
		console.log('点击地图获取定位和地址', lat + '--' + lng);
		addZhantingMarker();
		//getZhantingAddress();
		if (mapZhanting) {
			mapZhanting.destroy();
		}
		initZhantingMap();
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

const initZhantingList = async () => {
	loading.value = true;
	try {
		const { data, code, msg } = await getSubwayList({});
		loading.value = false;
		if (code === 0) {
			optionsZhanting.value = data;

			if (isEditAndHaveZhanTingMap.value) {
				console.log('changeZhantingMap == 0', isEditAndHaveZhanTingMap);
				for (let i = 0; i < optionsZhanting.value.length; i++) {
					if (optionsZhanting.value[i].subwayCode == newZhantingLocationInfo.value.subwayCode) {
						console.log('optionsZhanting.value', optionsZhanting.value[i]);
						// handleZhantingChange(optionsZhanting.value[i]);

						selectName.value = optionsZhanting.value[i].subwayName;
						model.value.mapStationCode = optionsZhanting.value[i].subwayCode;
						newZhantingLocationInfo.value.subwayName = optionsZhanting.value[i].subwayName;
						newZhantingLocationInfo.value.subwayCode = optionsZhanting.value[i].subwayCode;
						newZhantingLocationInfo.value.mapImageUrl = optionsZhanting.value[i].mapImageUrl || '';
						if (mapZhanting) {
							mapZhanting.destroy();
						}
						initZhantingMap();

						model.value.mapLatitude = newZhantingLocationInfo.value.lat;
						model.value.mapLongitude = newZhantingLocationInfo.value.lng;
						model.value.mapStationCode = newZhantingLocationInfo.value.subwayCode;
						break;
					}
				}
			} else {
				console.log('changeZhantingMap！=0', isEditAndHaveZhanTingMap);
				//handleZhantingChange(data[0]);
				if (mapZhanting) {
					mapZhanting.destroy();
				}
				initZhantingMap();

				model.value.mapLatitude = '';
				model.value.mapLongitude = '';
				model.value.mapStationCode = '';
				selectName.value = '';
			}
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// const changeZhantingMap = async (data: SubwayLines) => {
//   addZhantingGround(data);

//   newZhantingLocationInfo.value.lat = Number(optionsZhanting.value[0].latitude);
//   newZhantingLocationInfo.value.lng = Number(optionsZhanting.value[0].longitude);

//   const mapCenter = new TZhantingMap.LatLng(newZhantingLocationInfo.value.lat, newZhantingLocationInfo.value.lng);
//   mapZhanting = new TZhantingMap.Map(mapZhantingRef.value, {
//     center: mapCenter, //设置地图中心点坐标
//     zoom: 19, //设置地图缩放级别
//     pitch: 0, //设置俯仰角
//     rotation: 0, //设置地图旋转角度
//     viewMode: '2D',
//   });
// };
//添加覆盖图层
function addZhantingGround(val: any) {
	console.log('valvalvalval', val);
	if (!val.value.subwayCode) {
		return;
	}
	let southwest;
	let northeast;
	const offset = 0.00158; // 实际尺寸除以缩放比例：3000/19
	// 世纪城由于图片尺寸特殊，作特殊处理
	if (val.value.subwayCode == '510100022320018') {
		southwest = {
			longitude: 104.06738042991083,
			latitude: 30.55158924538942,
		};
		// 右上角
		northeast = {
			longitude: 104.07017717741144,
			latitude: 30.556329495767482,
		};
	} else {
		// 左下角
		southwest = {
			longitude: val.value.lng - offset,
			latitude: val.value.lat - offset,
		};
		// 右上角
		northeast = {
			longitude: parseFloat(val.value.lng) + offset,
			latitude: parseFloat(val.value.lat) + offset,
		};
	}
	console.log('imageLatLngBounds前', val.value.mapImageUrl);
	const imageLatLngBounds = new TZhantingMap.LatLngBounds(
		new TZhantingMap.LatLng(southwest.latitude, southwest.longitude),
		new TZhantingMap.LatLng(northeast.latitude, northeast.longitude)
	); // 根据拟覆盖范围的西南角与东北角新建LatLngBounds对象
	console.log('imageLatLngBounds后', val.value.mapImageUrl);
	if (val.value.mapImageUrl != null) {
		new TZhantingMap.ImageGroundLayer({
			bounds: imageLatLngBounds,
			src: val.value.mapImageUrl,
			map: mapZhanting,
		});
	}
	console.log('TZhantingMap.ImageGroundLayer', val.value.mapImageUrl);
}
// 添加标注
const addZhantingMarker = () => {
	// 清空标注 使其始终为一个
	markerZhantingLayer.setGeometries([]);
	markerZhantingLayer.add({
		position: new TZhantingMap.LatLng(newZhantingLocationInfo.value.lat, newZhantingLocationInfo.value.lng),
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
	const headImagesValid = validImg(model.value.headImages, '头图图片区不能为空');
	const aptitudeValid = validImg(model.value.aptitude, '行业资质图片区不能为空');
	const licenseValid = validImg(model.value.license, '营业执照图片区不能为空');
	if (!formEl || !headImagesValid || !aptitudeValid || !licenseValid) return;
	formEl.validate(async (valid) => {
		// 处理提交参数
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
				const { code, msg } = await storeSaveOrUpdateApi(params);
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改成功' : '新建成功'}`);
					resetForm(formEl);
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
	if (map) {
		map.destroy(); // 销毁地图实例
	}
	getBack();
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
const getBack = () => {
	router.push('/goodStore/merchantManage/QPStores/index');
};
onMounted(() => {
	initZhantingList();
	const { id, storeCode } = route.query;
	scopeId.value = id;
	model.value.storeCode = storeCode;
	if (!id) {
		getMerchantsList('');
		model.value.longitude = Number(originLocationInfo.lng);
		model.value.latitude = Number(originLocationInfo.lat);
		newLocationInfo.value.lat = Number(originLocationInfo.lat);
		newLocationInfo.value.lng = Number(originLocationInfo.lng);
		newZhantingLocationInfo.value.lat = Number(originLocationInfo.lat);
		newZhantingLocationInfo.value.lng = Number(originLocationInfo.lng);
	} else {
		getDetail(scopeId.value);
	}
	getSubway();
	getCatgry();
	nextTick(() => {
		initMap();
		initZhantingList();
	});
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
