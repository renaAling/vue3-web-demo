<template>
	<div>
		<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="140px">
			<el-form-item label="商户名称:" prop="name">
				<el-input placeholder="请输入商户名称" maxlength="20" v-model="formData.name" clearable />
			</el-form-item>
			<el-form-item label="商户类型:" prop="storeType">
				<el-select v-model="formData.storeType" placeholder="请选择商户类型">
					<el-option label="中餐厅" :value="1" />
					<el-option label="外国餐厅" :value="2" />
					<el-option label="快餐厅" :value="3" />
					<el-option label="咖啡厅" :value="4" />
					<el-option label="茶艺馆" :value="5" />
					<el-option label="冷饮店" :value="6" />
					<el-option label="糕饼店" :value="7" />
					<el-option label="甜品店" :value="8" />
				</el-select>
			</el-form-item>
			<el-form-item label="位置:" prop="address">
				<el-input placeholder="请输入位置" maxlength="20" v-model="formData.address" clearable />
			</el-form-item>
			<el-form-item label="联系电话:" prop="mobile">
				<el-input placeholder="请输入联系电话" maxlength="20" v-model="formData.mobile" clearable />
			</el-form-item>
			<el-form-item label="营业时间:" prop="businessTime">
				<el-input placeholder="请输入营业时间" maxlength="20" v-model="formData.businessTime" clearable />
			</el-form-item>

			<el-form-item label="商户标签:">
				<div class="flex w-full">
					<el-input class="mr-4" placeholder="请输入商户标签" maxlength="20" v-model="formData.tags" clearable />
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</div>
				<div>
					<el-tag v-for="tag in tagList" :key="tag.name" class="mr-2" closable @close="handleClose(tag)">
						{{ tag.name }}
					</el-tag>
				</div>
			</el-form-item>
			<el-form-item label="是否允许同步覆盖:" prop="isCover">
				<el-radio-group v-model="formData.isCover">
					<el-radio :value="true">是</el-radio>
					<el-radio :value="false">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 地图 -->
			<div ref="mapRef" class="map"></div>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { jsonp } from 'vue-jsonp';
import { ElForm } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { useThrottleFn } from '@vueuse/core';
import { travelCommunalData } from '/@/stores/note';
const stores = travelCommunalData();
const ruleFormRef = ref<FormInstance>();
// 地图部分
// 地图实例
let map: any = null;
// 初始化地图
const mapRef = ref(null);
// marker图层
let markerLayer: any = null;
const TMap = (window as any).TMap;
const formData = ref<any>({
	ipoCode: null,
	name: '',
	storeType: null,
	address: '',
	longitude: 0,
	latitude: 0,
	mobile: '',
	tags: '',
	isCover: null,
});
const props = defineProps<{
	active: number;
	visible: boolean;
}>();

const tagList = ref<any[]>([]);
const handleClose = (tag: string) => {
	tagList.value.splice(tagList.value.indexOf(tag), 1);
};

const returnForm = () => {
	return {
		...formData.value,
		tags: tagList.value.map((item) => item.name).join(','),
	};
};
// 添加商户标签
const handleAdd = () => {
	if (tagList.value.length >= 3) {
		useMessage().error('最多添加三个标签');
		return;
	}
	if (formData.value.tags && formData.value.tags.trim()) {
		let find = tagList.value.findIndex((item) => item.name === formData.value.tags);
		if (find === -1) {
			tagList.value.push({
				name: formData.value.tags,
			});
			formData.value.tags = '';
		} else {
			useMessage().error('商户标签重复');
		}
	} else {
		formData.value.tags = '';
		useMessage().error('请输入正确的商户标签');
	}
};
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
	storeType: [{ required: true, message: '请选择', trigger: 'change' }],
	address: [{ required: true, message: '请输入位置', trigger: 'blur' }],
});
const openDialog = (row?: any) => {	
	if (map) {
		map.destroy();
	}
	if (row?.ipoCode) {
		// getSubwayStationGet(row.id);
		formData.value = { ...row, tags: row.tags ? row.tags.split(',') : [] };
		tagList.value = formData.value.tags.map((item: any) => ({ name: item }));
	} else {
		formData.value.longitude = 104.06576663;
		formData.value.latitude = 30.65734806;
	}
	nextTick(() => {
		initMap();
	});
};
watch(
	() => props.active,
	(newVal) => {
		if (newVal === 0 && props.visible) {
			openDialog(); // 自动初始化
		}
	},
	{ immediate: true }
);
// 通过id查询
// const getSubwayStationGet = async (id: any) => {
// 	try {
// 		loading.value = true;
// 		const { code, data, msg } = await gettSubwayStationGetApi(id);
// 		if (code === 0) {
// 			formData.value = { ...formData.value, ...data };
// 			if (data.linesCode) {
// 				const codeList = data.linesCode.split(',');
// 				const nameList = data.linesName.split(',');
// 				formData.value.linesCode = codeList;
// 				if (codeList.length > 0) {
// 					codeList.forEach((item: any, index: number) => {
// 						options.value.push({ code: item, name: nameList[index] });
// 					});
// 				}
// 			}
// 			nextTick(() => {
// 				initMap();
// 			});
// 		} else {
// 			useMessage().error(msg);
// 		}
// 	} catch (err: any) {
// 		useMessage().error(err.msg);
// 	} finally {
// 		loading.value = false;
// 	}
// };
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

const resetForm = () => {
	ruleFormRef.value?.resetFields();
	tagList.value = [];
	formData.value = {
		ipoCode: null,
		name: '',
		storeType: null,
		address: '',
		longitude: 104.06576663,
		latitude: 30.65734806,
		mobile: '',
		tags: '',
		isCover: null,
	};
	nextTick(() => {
		initMap();
	});
};

const initMap = () => {
	//定义地图中心点坐标
	const mapCenter = new TMap.LatLng(formData.value.latitude, formData.value.longitude);
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
		formData.value.latitude = lat;
		formData.value.longitude = lng;
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
		position: new TMap.LatLng(formData.value.latitude, formData.value.longitude),
	});
};
// 根据经纬度获取地址
const getAddress = useThrottleFn(
	() => {
		const params = {
			location: formData.value.latitude + ',' + formData.value.longitude,
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
				formData.value.latitude = result.location.lat;
				formData.value.longitude = result.location.lng;
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
	resetForm,
	returnForm,
});
</script>

<style scoped lang="scss"></style>
