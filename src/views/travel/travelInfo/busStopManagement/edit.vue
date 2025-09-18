<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<div class="my-5 flex align-center justify-start cursor-pointer" @click="resetForm">
					<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
				</div>
				<div class="m-5 flex" style="justify-content: space-between; width: 900px; margin-left: 80px">
					<span class="addTitle">{{ sysUserName }}</span>
					<el-button @click="getInformation" type="primary" :disabled="loading">获取该站点地图数据</el-button>
				</div>
				<div style="width: 900px; margin-left: 80px">
					<el-form :model="form" label-width="140px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
						<el-form-item label="站点名称" prop="stationName">
							<el-input placeholder="请输入站点名称" clearable v-model="form.stationName" maxlength="20"></el-input>
						</el-form-item>
						<el-form-item label="站点类型" prop="stationType">
							<el-select v-model="form.stationType" placeholder="请选择站点类型" default-first-option clearable>
								<el-option v-for="(value, key) in stationTypeList" :key="key" :label="value" :value="Number(key)"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="所属线路" prop="line">
							<el-input placeholder="请输入所属线路" clearable v-model="form.line" maxlength="20"></el-input>
						</el-form-item>
						<el-form-item label="站点所在区域" prop="region">
							<el-select v-model="form.region" placeholder="请选择站点所在区域" default-first-option disabled clearable>
								<el-option v-for="value in regionCodeList" :key="value.regionCode" :label="value.regionName" :value="value.regionCode"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="站点位置" prop="longitude">
							<el-col :span="11">
								<el-input clearable placeholder="经度" disabled v-model="form.longitude"></el-input>
							</el-col>
							<el-col :span="2" class="text-center">
								<span class="text-gray-500">-</span>
							</el-col>
							<el-col :span="11">
								<el-input clearable placeholder="纬度" disabled v-model="form.latitude"></el-input>
							</el-col>
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
		<!-- <el-dialog :close-on-click-modal="false" title="获取该站点地图数据" width="500" draggable v-model="visible" :before-close="visible = false">
			<div>是否获取该站点最新数据</div>
			<el-button @click="getInformation" type="primary" :disabled="loading">立即同步</el-button>
		</el-dialog> -->
	</div>
</template>
<script lang="ts" setup>
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import router from '/@/router';
import { jsonp } from 'vue-jsonp';
import { useThrottleFn } from '@vueuse/core';
import { getPublicTransportStationsGetApi, putPublicTransportStationsUpdateApi, getStationDetailApi } from '/@/api/travel/travelInfo';
import { getRegionCodeListApi } from '/@/api/travel/index';

const route = useRoute();
const sysUserName = ref<string>('编辑');
const dataFormRef = ref<any>();
const loading = ref(false);
const regionCodeList = ref<any>([]);
import { Session } from '/@/utils/storage';
const stationTypeList = ref<any>({
	1: '公交站',
	2: '公租自行车站',
});
const form = ref<any>({
	id: 0,
	ipoCode: '',
	stationName: '',
	stationType: 0,
	region: '',
	line: [],
	coordinates: '', // 经纬度
	allowOverride: true,
	longitude: '',
	latitude: '',
});
// 定义校验规则
const dataRules = ref({
	stationName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
	stationType: [{ required: true, message: '请选择站点类型', trigger: 'blur' }],
	region: [{ required: true, message: '请选择站点所在区域', trigger: 'blur' }],
	longitude: [{ required: true, message: '请选择站点所在经纬度', trigger: 'blur' }],
	allowOverride: [{ required: true, message: '请选择是否允许同步覆盖', trigger: 'blur' }],
});

// 初始化加载数据
onMounted(() => {
	if (map) {
		map.destroy();
	}
	if (route.query?.id) {
		getPublicTransportStationsGet(route.query.id);
	}
	if (!Session.get('regionCode')) {
		getRegionCodeList();
	}
	regionCodeList.value = JSON.parse(Session.get('regionCode'));
});

watch(
	() => form.value.longitude,
	(val) => {
		if (form.value.longitude && form.value.latitude) {
			form.value.coordinates = val + ',' + form.value.latitude;
		} else {
			form.value.coordinates = '';
		}
	}
);
// 通过id查询
const getPublicTransportStationsGet = async (id: any) => {
	try {
		loading.value = true;
		const { code, data, msg } = await getPublicTransportStationsGetApi(id);
		if (code === 0) {
			form.value = data;
			if (data.coordinates.split(',').length > 1) {
				form.value.longitude = data.coordinates.split(',')[0];
				form.value.latitude = data.coordinates.split(',')[1];
			}
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
			form.value = {
				id: 0,
				ipoCode: '',
				stationName: '',
				stationType: 0,
				region: '',
				line: [],
				coordinates: '', // 经纬度
				allowOverride: true,
				longitude: '',
				latitude: '',
			};
			router.push({
				path: '/travel/travelInfo/busStopManagement/index',
			});
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
		const { code, msg } = await putPublicTransportStationsUpdateApi(form.value);
		if (code === 0) {
			useMessage().success('保存成功');
			dataFormRef.value.resetFields();
			form.value = {
				id: 0,
				ipoCode: '',
				stationName: '',
				stationType: 0,
				region: '',
				line: [],
				coordinates: '', // 经纬度
				allowOverride: true,
				longitude: '',
				latitude: '',
			};
			router.push({
				path: '/travel/travelInfo/busStopManagement/index',
			});
			if (map) {
				map.destroy();
			}
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
				const { code, data, msg } = await getStationDetailApi(form.value.ipoCode);
				if (code === 0) {
					useMessage().success('数据同步成功');
					form.value.line = data.line;
					form.value.region = data.region;
					form.value.stationName = data.stationName;
					form.value.stationType = data.stationType;
					if (data.coordinates.split(',').length > 1) {
						form.value.longitude = data.coordinates.split(',')[0];
						form.value.latitude = data.coordinates.split(',')[1];
					}
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
// 				console.log('result', result);
// 				form.value.latitude = result.location.lat;
// 				form.value.longitude = result.location.lng;
// 				form.value.region = result.ad_info.adcode;
// 				console.log('form.value', form.value);
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
	// 点击地图
	map.on('click', (e: any) => {
		const { lat, lng } = e.latLng;
		form.value.latitude = lat;
		form.value.longitude = lng;
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
// 页面销毁时
onBeforeUnmount(() => {
	map.destroy();
	map = null;
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
	margin-left: 60px;
}
</style>
