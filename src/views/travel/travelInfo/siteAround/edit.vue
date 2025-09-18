<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<div class="my-5 flex align-center justify-start cursor-pointer" @click="resetForm">
					<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
				</div>
				<div class="m-5 flex" style="justify-content: space-between; width: 900px; margin-left: 50px">
					<span class="addTitle">编辑</span>
					<el-button @click="getInformation" type="primary" :disabled="loading">获取该设施地图数据</el-button>
				</div>
				<div style="width: 900px; margin-left: 50px">
					<el-form :model="form" label-width="150px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
						<el-form-item label="站点名称:" prop="stationName">
							{{ form.stationName }}
						</el-form-item>
						<el-form-item label="站点类型" prop="stationType">
							{{ stationTypeList[form.stationType] }}
						</el-form-item>
						<el-form-item label="设施设备类型" prop="facilityType">
							{{ facilityTypelist[form.facilityType] }}
						</el-form-item>
						<el-form-item label="设施设备名称:" prop="facilityName">
							<el-input placeholder="请输入设施设备名称" clearable v-model="form.facilityName" maxlength="20"></el-input>
						</el-form-item>
						<el-form-item label="位置:">
							<el-col :span="8">
								<el-input clearable placeholder="经度" v-model="form.longitude" disabled></el-input>
							</el-col>
							<el-col :span="2" class="text-center">
								<span class="text-gray-500">-</span>
							</el-col>
							<el-col :span="8">
								<el-input clearable placeholder="纬度" v-model="form.latitude" disabled></el-input>
							</el-col>
							<el-col :span="6">
								<span class="ml-5">距站点：{{ form.distance || 0 }}KM</span>
							</el-col>
						</el-form-item>
						<el-form-item label="区域:" prop="regionCode">
							<el-select v-model="form.regionCode" placeholder="请选择站点所在区域" disabled default-first-option clearable>
								<el-option v-for="(value, key) in regionCodeMap" :key="key" :label="value" :value="key"></el-option>
							</el-select>
						</el-form-item>
						<!-- 地图 -->
						<div ref="mapRef" class="map"></div>
						<el-form-item label="是否允许同步覆盖" prop="allowOverride">
							<el-radio-group v-model="form.allowOverride">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-form>
					<div class="flex align-center justify-center mt-10">
						<span class="dialog-footer">
							<el-button @click="resetForm">取消</el-button>
							<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
						</span>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import router from '/@/router';
import { jsonp } from 'vue-jsonp';
import { Session } from '/@/utils/storage';
import { useThrottleFn } from '@vueuse/core';
import { getRegionCodeListApi } from '/@/api/travel/index';
import { gettSubwayStationAroundGetApi, putSubwayStationAroundUpdateApi, getAroundDetailApi } from '/@/api/travel/travelInfo';

const route = useRoute();
const dataFormRef = ref();
const loading = ref(false);
const stationTypeList = ref<any>({
	1: '地铁站',
});
const facilityTypelist = ref<any>({
	1: '商业设施',
	2: '教育设施',
	3: '医疗设施',
	4: '景点设施',
	5: '市政设施',
});
const form = ref<any>({
	id: 0,
	stationName: '',
	stationType: 0,
	facilityType: 0,
	facilityName: '',
	regionCode: '',
	allowOverride: true,
	createBy: '',
	createTime: '',
	updateBy: '',
	updateTime: '',
	delFlag: true,
	latitude: 30.819721,
	longitude: 104.064825,
	distance: 0,
});
// 定义校验规则
const dataRules = ref({
	stationName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
	stationType: [{ required: true, message: '请选择站点类型', trigger: 'blur' }],
	facilityType: [{ required: true, message: '请选择设施设备类型', trigger: 'blur' }],
	latitude: [{ required: true, message: '请选择位置', trigger: 'blur' }],
	regionCode: [{ required: true, message: '请选择区域', trigger: 'blur' }],
	allowOverride: [{ required: true, message: '请选择是否允许同步覆盖', trigger: 'blur' }],
});
// 计算距离的两点
const pointA = ref<any>({}); // 当前选中的经纬度
const pointB = ref<any>({}); // 站点经纬度
const regionCodeList = ref<any[]>([]);
const regionCodeMap = ref<any>({});

onMounted(() => {
	if (map) {
		map.destroy();
	}
	if (!Session.get('regionCode')) {
		getRegionCodeList();
	}
	regionCodeList.value = JSON.parse(Session.get('regionCode'));
	regionCodeMap.value = JSON.parse(Session.get('regionCodeMap'));
	gettSubwayStationAroundGet(route.query.id);
});
const getRegionCodeList = async () => {
	const { data, msg, code } = await getRegionCodeListApi();
	if (code === 0) {
		const obj: any = {};
		data.map((item: any) => {
			obj[item.regionCode] = item.regionName;
		});
		Session.set('regionCode', JSON.stringify(data));
		Session.set('regionCodeMap', JSON.stringify(obj));
	} else {
		useMessage().error(msg);
	}
};
// 通过id查询
const gettSubwayStationAroundGet = async (id: any) => {
	try {
		loading.value = true;
		const { code, data, msg } = await gettSubwayStationAroundGetApi(id);
		if (code === 0) {
			console.log('data', data);
			form.value = data;
			form.value.distance = (Number(data.distance) / 1000).toFixed(2) || 0;
			calculateDistance();
			if (map) {
				map.destroy();
			}
			nextTick(() => {
				initMap();
			});
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 关闭
const resetForm = () => {
	ElMessageBox.confirm('请确认是否取消编辑?', '取消编辑', {
		distinguishCancelAndClose: true,
		confirmButtonText: '确认',
		cancelButtonText: '取消',
	})
		.then(async () => {
			dataFormRef.value.resetFields();
			router.push('/travel/travelInfo/siteAround/index');
			if (map) {
				map.destroy();
			}
		})
		.catch(() => {
			return;
		});
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, msg } = await putSubwayStationAroundUpdateApi(form.value);
		if (code === 0) {
			useMessage().success('操作成功');
			dataFormRef.value.resetFields();
			router.push('/travel/travelInfo/siteAround/index');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 获取该站点地图数据
const getInformation = () => {
	ElMessageBox.confirm('是否获取该站点最新数据?', '获取该站点地图数据', {
		confirmButtonText: '立即同步',
		showCancelButton: false,
	})
		.then(async () => {
			try {
				const { code, data, msg } = await getAroundDetailApi(form.value.ipoCode);
				if (code === 0) {
					useMessage().success('数据同步成功');
					form.value.facilityName = data.facilityName;
					form.value.regionCode = data.regionCode;
					if (data.coordinates) {
						form.value.latitude = data.coordinates.split(',')[1];
						form.value.longitude = data.coordinates.split(',')[0];
					}
					calculateDistance();
					if (map) {
						map.destroy();
					}
					nextTick(() => {
						initMap();
					});
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		})
		.catch(() => {});
};

// // 地图部分
// // 地图实例
// let map: any = null;
// // 初始化地图
// const mapRef = ref(null);
// // marker图层
// let markerLayer: any = null;
// const TMap = (window as any).TMap;

// const initMap = () => {
// 	//定义地图中心点坐标
// 	const mapCenter = new TMap.LatLng(form.value.latitude, form.value.longitude);
// 	map = new TMap.Map(mapRef.value, {
// 		center: mapCenter, //设置地图中心点坐标
// 		zoom: 16, //设置地图缩放级别
// 		pitch: 0, //设置俯仰角
// 		rotation: 0, //设置地图旋转角度
// 		viewMode: '2D',
// 	});
// 	// 移除旋转控件
// 	map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
// 	// 移除logo以及左下角信息
// 	let logoInfo = document.querySelector('canvas+div:last-child') as HTMLDivElement;
// 	logoInfo.style.display = 'none';

// 	//初始化marker图层
// 	markerLayer = new TMap.MultiMarker({
// 		map: map,
// 	});
// 	addMarker();
// 	// 点击地图获取定位和地址
// 	map.on('click', (e: any) => {
// 		const { lat, lng } = e.latLng;
// 		form.value.latitude = lat;
// 		form.value.longitude = lng;
// 		getAddress();
// 		// 调用计算函数
// 		calculateDistance();
// 		console.log('form.value.distance', form.value.distance);
// 		if (map) {
// 			map.destroy();
// 		}
// 		initMap();
// 	});
// };
// // 添加标注
// const addMarker = () => {
// 	// 清空标注 使其始终为一个
// 	markerLayer.setGeometries([]);
// 	markerLayer.add({
// 		position: new TMap.LatLng(form.value.latitude, form.value.longitude),
// 	});
// };
// // 根据经纬度获取地址
// const getAddress = useThrottleFn(
// 	() => {
// 		const params = {
// 			location: form.value.latitude + ',' + form.value.longitude,
// 			key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
// 			output: 'jsonp',
// 			poi_options: {
// 				policy: 4,
// 			},
// 		};

// 		jsonp('https://apis.map.qq.com/ws/geocoder/v1', params).then((data) => {
// 			const { status, result } = data;
// 			if (status === 0) {
// 				form.value.latitude = result.location.lat;
// 				form.value.longitude = result.location.lng;
// 				form.value.regionCode = result.ad_info.adcode;
// 			}
// 		});
// 	},
// 	1000,
// 	false
// );
// 地图部分
let map: any = null;
const mapRef = ref(null);
let markerLayer: any = null;
const TMap = (window as any).TMap;

// 初始化地图
const initMap = () => {
	const mapCenter = new TMap.LatLng(form.value.latitude, form.value.longitude);
	map = new TMap.Map(mapRef.value, {
		center: mapCenter,
		zoom: 16,
		pitch: 0,
		rotation: 0,
		viewMode: '2D',
	});
	// 移除旋转控件
	map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
	// 移除logo
	const logoInfo = document.querySelector('canvas+div:last-child') as HTMLDivElement;
	if (logoInfo) {
		logoInfo.style.display = 'none';
	}
	// 初始化 marker 图层
	markerLayer = new TMap.MultiMarker({
		map: map,
	});
	addMarker();

	//  点击地图：只更新坐标和 marker，不重置地图
	map.on('click', (e: any) => {
		const { lat, lng } = e.latLng;
		form.value.latitude = lat;
		form.value.longitude = lng;
		calculateDistance();
		addMarker();
		getAddress();
	});
};

// 添加或移动 marker
const addMarker = () => {
	if (!markerLayer) return;
	// 清空旧 marker
	markerLayer.setGeometries([]);
	// 添加新 marker
	markerLayer.add({
		position: new TMap.LatLng(form.value.latitude, form.value.longitude),
	});
};

// 获取地址（防抖）
const getAddress = useThrottleFn(() => {
	const params = {
		location: `${form.value.latitude},${form.value.longitude}`,
		key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
		output: 'jsonp',
		poi_options: {
			policy: 4,
		},
	};
	jsonp('https://apis.map.qq.com/ws/geocoder/v1', params).then((data) => {
		const { status, result } = data;
		if (status === 0) {
			form.value.latitude = result.location.lat;
			form.value.longitude = result.location.lng;
			form.value.region = result.ad_info.adcode;
			// ✅ 可选：marker 可能因地址纠偏移动，再次更新
			addMarker();
		}
	});
}, 1000);
// 计算两点间直线距离（单位：米）
const calculateDistance = useThrottleFn(
	() => {
		pointA.value = { latitude: Number(form.value.latitude), longitude: Number(form.value.longitude) };
		pointB.value = { latitude: Number(form.value.subWayLatitude), longitude: Number(form.value.subWayLongitude) };
		const { latitude: lat1, longitude: lon1 } = pointA.value; // 第一个点 { latitude, longitude }
		const { latitude: lat2, longitude: lon2 } = pointB.value; // 第二个点
		console.log('pointA.value', pointA.value);
		console.log('pointB.value', pointB.value);

		if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number') {
			console.warn('无效的经纬度');
			return;
		}

		// 地球半径（米）
		const R = 6371000;

		// 转换为弧度
		const toRad = (deg: any) => (deg * Math.PI) / 180;

		const dLat = toRad(lat2 - lat1);
		const dLon = toRad(lon2 - lon1);
		const radLat1 = toRad(lat1);
		const radLat2 = toRad(lat2);

		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c; // 距离，单位：米

		console.log('两点间直线距离:', (Number(distance) / 1000).toFixed(2), 'KM');
		form.value.distance = (Number(distance) / 1000).toFixed(2);
		return form.value.distance;
	},
	1000,
	false
);

// 页面销毁时
onBeforeUnmount(() => {
	map.destroy();
});
</script>
<style lang="scss" scoped>
.back-icon {
	font-size: 20px;

	.el-icon {
		height: 100%;
	}
}
.addTitle {
	font-size: 20px;
	font-weight: 600;
	color: #000;
}
.map {
}
</style>
