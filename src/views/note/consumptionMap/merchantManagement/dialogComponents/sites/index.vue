<template>
	<div>
		<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="120px">
			<el-form-item label="关联站点:" prop="subwayId">
				<el-select v-model="formData.subwayId" placeholder="请选择关联站点" @change="handleChange">
					<el-option v-for="item in subwayStationList" :key="item.value" :label="item.subwayName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="所属线路:" prop="lineName">
				<el-select v-model="formData.lineName" disabled placeholder="请选择关联站点">
					<el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" />
				</el-select>
			</el-form-item>
			<el-form-item label="区域" prop="areaName">
				<el-select v-model="formData.areaName" placeholder="请选择区域" disabled default-first-option clearable>
					<el-option v-for="value in stores.regionCodeList" :key="value.regionCode" :label="value.regionName" :value="value.regionCode"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="站点位置" prop="subwayLongitude">
				<el-col :span="11">
					<el-input clearable placeholder="经度" v-model="formData.subwayLongitude" disabled></el-input>
				</el-col>
				<el-col :span="2" class="text-center">
					<span class="text-gray-500">-</span>
				</el-col>
				<el-col :span="11">
					<el-input clearable placeholder="纬度" v-model="formData.subwayLatitude" disabled></el-input>
				</el-col>
			</el-form-item>

			<!-- 地图 -->
			<div ref="mapRef" class="map"></div>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ref } from 'vue';
import { jsonp } from 'vue-jsonp';
import { ElForm } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useThrottleFn } from '@vueuse/core';
import { subwayStationApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';

const stores = travelCommunalData();
const ruleFormRef = ref<FormInstance>();
const options = ref<any[]>([]);

// 地图实例
let map: any = null;
// 初始化地图
const mapRef = ref(null);
// marker图层
let markerLayer: any = null;
const TMap = (window as any).TMap;
const formData = ref<any>({
	name: '',
	lineName: null,
	areaName: '',
	subwayLongitude: 0,
	subwayLatitude: 0,
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
	lineName: [{ required: true, message: '请选择所属线路', trigger: 'blur' }],
	subwayLongitude: [{ required: true, message: '请选择经纬度', trigger: 'blur' }],
});
const subwayStationList = ref();
const getSubwayStation = async () => {
	const res = await subwayStationApi();
	subwayStationList.value = flattenStations(res.data);
};
const flattenStations = (data: any) => {
	const allStations = [] as any[];
	data.forEach((line: any) => {
		line.stations.forEach((station: any) => {
			if (!allStations.some((s) => s.id === station.id)) {
				allStations.push(station);
			}
		});
	});
	return allStations;
};
const handleChange = (value: any) => {
	const selectedStation = subwayStationList.value.find((station: any) => station.id === value);
	formData.value.lineName = selectedStation.lineName;
	formData.value.areaName = selectedStation.areaName;
	formData.value.subwayLongitude = selectedStation.longitude;
	formData.value.subwayLatitude = selectedStation.latitude;
};

const openDialog = async (row?: any) => {
	if (map) {
		map.destroy();
	}
	if (row?.id) {
		// getSubwayStationGet(row.id);
		await getSubwayStation();
		formData.value = { ...row };
		handleChange(row.subwayId);
	} else {
		formData.value.areaName = '青羊区';
		formData.value.subwayLongitude = 104.06576663;
		formData.value.subwayLatitude = 30.65734806;
	}
	nextTick(() => {
		initMap();
	});
};
const props = defineProps<{
	active: number;
	visible: boolean;
}>();
watch(
	() => props.active,
	(newVal) => {
		if (newVal === 1 && props.visible) {
			// openDialog(); // 自动初始化
		}
	},
	{ immediate: true }
);

const returnForm = () => {
	return formData.value;
};

const submitForm = async (formEl: FormInstance | undefined = ruleFormRef.value): Promise<boolean> => {
	if (!formEl) return false;

	// 使用 Promise 包装 validate，使其可以返回布尔值
	return new Promise((resolve) => {
		formEl.validate((valid: boolean, fields: any) => {
			if (valid) {
				console.log('校验通过');
				resolve(true);
			} else {
				console.log('校验失败', fields);
				resolve(false);
			}
		});
	});
};

const initMap = () => {
	//定义地图中心点坐标
	const mapCenter = new TMap.LatLng(formData.value.subwayLatitude, formData.value.subwayLongitude);
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
		console.log('e', e);
		const { lat, lng } = e.latLng;
		formData.value.subwayLatitude = lat;
		formData.value.subwayLongitude = lng;
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
		position: new TMap.LatLng(formData.value.subwayLatitude, formData.value.subwayLongitude),
	});
};
// 根据经纬度获取地址
const getAddress = useThrottleFn(
	() => {
		const params = {
			location: formData.value.subwayLatitude + ',' + formData.value.subwayLongitude,
			key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
			output: 'jsonp',
			poi_options: {
				policy: 4,
			},
		};
		jsonp('https://apis.map.qq.com/ws/geocoder/v1', params).then((data) => {
			const { status, result } = data;
			if (status === 0) {
				console.log('result', result);
				formData.value.subwayLatitude = result.location.lat;
				formData.value.subwayLongitude = result.location.lng;
				formData.value.areaCode = result.ad_info.adcode;
				console.log('formData.value', formData.value);
				console.log('stores.regionCodeList', stores.regionCodeList);
				// formData.value.address = result.formatted_addresses.standard_address;
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
// 暴露变量
defineExpose({
	openDialog,
	submitForm,
	returnForm,
});
</script>

<style scoped lang="scss"></style>
