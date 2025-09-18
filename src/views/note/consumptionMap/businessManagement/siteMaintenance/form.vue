<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="60%" :close-on-click-modal="false" :before-close="resetForm">
			<el-scrollbar height="500px">
				<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="120px" class="pr-5">
					<el-form-item label="站点名称:" prop="name">
						<el-input placeholder="请输入站点名称" maxlength="20" v-model="formData.name" clearable />
					</el-form-item>
					<el-form-item label="所属线路:" prop="linesCode">
						<el-select
							v-model="formData.linesCode"
							multiple
							filterable
							remote
							reserve-keyword
							placeholder="请选择所属线路"
							:remote-method="remoteMethod"
							:loading="loading"
						>
							<el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" />
						</el-select>
					</el-form-item>
					<el-form-item label="站点所在区域" prop="areaCode">
						<el-select v-model="formData.areaCode" placeholder="请选择站点所在区域" disabled default-first-option clearable>
							<el-option v-for="value in regionCodeList" :key="value.regionCode" :label="value.regionName" :value="value.regionCode"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="站点位置" prop="longitude">
						<el-col :span="11">
							<el-input clearable placeholder="经度" v-model="formData.longitude" disabled></el-input>
						</el-col>
						<el-col :span="2" class="text-center">
							<span class="text-gray-500">-</span>
						</el-col>
						<el-col :span="11">
							<el-input clearable placeholder="纬度" v-model="formData.latitude" disabled></el-input>
						</el-col>
					</el-form-item>
					<!-- 地图 -->
					<div ref="mapRef" class="map"></div>
				</el-form>
			</el-scrollbar>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ref } from 'vue';
import { jsonp } from 'vue-jsonp';
import { ElForm } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { useThrottleFn } from '@vueuse/core';
import { Session } from '/@/utils/storage';
import { postSubwayStationAddApi, gettSubwayStationGetApi, putSubwayStationUpdateApi } from '/@/api/travel/travelInfo';
import { getRegionCodeListApi, getSubwayLineListApi } from '/@/api/travel/index';

const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('新增');
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();
const options = ref<any[]>([]);
const subwayLineList = ref<any[]>([]);
const regionCodeList = ref<any[]>([]);
const regionCodeMap = ref<any>({});
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 地图部分
// 地图实例
let map: any = null;
// 初始化地图
const mapRef = ref(null);
// marker图层
let markerLayer: any = null;
const TMap = (window as any).TMap;
const formData = ref<any>({
	id: 0,
	name: '',
	linesCode: [],
	areaCode: '',
	longitude: 0,
	latitude: 0,
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
	linesCode: [{ required: true, message: '请选择所属线路', trigger: 'blur' }],
	areaCode: [{ required: true, message: '请选择站点所在区域', trigger: 'blur' }],
	longitude: [{ required: true, message: '请选择经纬度', trigger: 'blur' }],
});
const openDialog = (row?: any) => {
	if (!Session.get('regionCode')) {
		getRegionCodeList();
	}
	regionCodeList.value = JSON.parse(Session.get('regionCode'));
	regionCodeMap.value = JSON.parse(Session.get('regionCodeMap'));
	if (map) {
		map.destroy();
		map = null;
	}
	if (row?.id) {
		dialogTitle.value = '编辑';
		getSubwayStationGet(row.id);
	} else {
		dialogTitle.value = '新增';
		formData.value.areaCode = '510105';
		formData.value.longitude = 104.06576663;
		formData.value.latitude = 30.65734806;
		visible.value = true;
		nextTick(() => {
			initMap();
		});
	}
};

// 通过id查询
const getSubwayStationGet = async (id: any) => {
	try {
		loading.value = true;
		const { code, data, msg } = await gettSubwayStationGetApi(id);
		if (code === 0) {
			formData.value = data;
			if (data.linesCode) {
				const codeList = data.linesCode.split(',');
				const nameList = data.linesName.split(',');
				formData.value.linesCode = codeList;
				if (codeList.length > 0) {
					codeList.forEach((item: any, index: number) => {
						options.value.push({ code: item, name: nameList[index] });
					});
				}
			}
			visible.value = true;
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

const getSubwayLineList = async (name: any) => {
	console.log('name', name);
	const { data, msg, code } = await getSubwayLineListApi(name);
	if (code === 0) {
		subwayLineList.value = data;
		console.log('data', data);
	} else {
		useMessage().error(msg);
	}
};
// 站点
const remoteMethod = (query: string) => {
	if (query) {
		console.log('query', query);
		loading.value = true;
		options.value = [];
		setTimeout(async () => {
			loading.value = false;
			await getSubwayLineList(query);
			options.value = subwayLineList.value;
		}, 200);
	} else {
		options.value = [];
	}
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields: any) => {
		if (valid) {
			console.log('submit!');
			console.log('formData.value', formData.value);
			const response = formData.value.id ? await putSubwayStationUpdateApi(formData.value) : await postSubwayStationAddApi(formData.value);
			if (response.code === 0) {
				useMessage().success(response.msg || '操作成功');
				emit('refresh');
				formData.value = {
					id: 0,
					name: '',
					linesCode: [],
					areaCode: '',
					longitude: 0,
					latitude: 0,
				};
				visible.value = false;
				map.destroy();
			} else {
				useMessage().error(response.msg);
			}
		} else {
			console.log('error submit!', fields);
			if (fields.msg) useMessage().error(fields.msg);
		}
	});
};
const resetForm = () => {
	formData.value = {
		id: 0,
		name: '',
		linesCode: [],
		areaCode: '',
		longitude: 0,
		latitude: 0,
	};
	emit('refresh');
	visible.value = false;
	if (map) {
		map.destroy();
	}
};

// 初始化地图
const initMap = () => {
	const mapCenter = new TMap.LatLng(formData.value.latitude, formData.value.longitude);
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
	// 点击地图：只更新坐标和 marker，不重置地图
	map.on('click', (e: any) => {
		const { lat, lng } = e.latLng;
		formData.value.latitude = lat;
		formData.value.longitude = lng;
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
		position: new TMap.LatLng(formData.value.latitude, formData.value.longitude),
	});
};

// 获取地址（防抖）
const getAddress = useThrottleFn(() => {
	const params = {
		location: `${formData.value.latitude},${formData.value.longitude}`,
		key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
		output: 'jsonp',
		poi_options: {
			policy: 4,
		},
	};
	jsonp('https://apis.map.qq.com/ws/geocoder/v1', params).then((data) => {
		const { status, result } = data;
		if (status === 0) {
			formData.value.latitude = result.location.lat;
			formData.value.longitude = result.location.lng;
			formData.value.areaCode = result.ad_info.adcode;
			// 可选：marker 可能因地址纠偏移动，再次更新
			addMarker();
		}
	});
}, 1000);

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
