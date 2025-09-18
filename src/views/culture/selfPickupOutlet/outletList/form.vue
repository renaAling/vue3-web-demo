<template>
	<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="50%" :close-on-click-modal="false" :show-close="false">
		<el-form @submit.prevent :model="model" ref="formRef" :rules="formRules">
			<el-card>
				<template #header> <span class="font-bold">基础信息</span> </template>
				<el-form-item label="网点名称：" prop="name" class="custom-width">
					<el-input v-model="model.name" type="text" placeholder="请输入网点名称" maxlength="30" show-word-limit clearable />
				</el-form-item>
				<el-form-item label="营业时间：" class="custom-width">
					<el-input v-model.trim="model.businessHours" type="text" placeholder="请输入营业时间" maxlength="30" clearable show-word-limit />
				</el-form-item>
				<el-form-item label="备注说明：" class="custom-width">
					<el-input
						v-model="model.remark"
						type="textarea"
						placeholder="请输入备注"
						maxlength="200"
						clearable
						resize="none"
						rows="6"
						show-word-limit
					/>
				</el-form-item>
				<el-form-item label="门头照片：">
					<upload-img v-model:imageUrl="model.imageUrl" dir="culture"> </upload-img>
				</el-form-item>
				<el-form-item label="联系人：" class="custom-width">
					<el-input v-model="model.contactName" placeholder="请输入联系人" clearable />
				</el-form-item>
				<el-form-item label="联系电话" class="custom-width">
					<el-input v-model="model.contactTelephone" type="text" placeholder="请输入联系电话" clearable />
				</el-form-item>
			</el-card>
			<el-card class="mt-3">
				<template #header> <span class="font-bold">受众范围</span> </template>
				<el-form-item label="自提点受众：" prop="identityCodes">
					<el-checkbox-group v-model="model.identityCodes" id="identityCodes">
						<el-checkbox :label="item.code" v-for="(item, index) in userRoleList" :key="index">{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-card>
			<el-card class="mt-3">
				<template #header> <span class="font-bold">取货信息</span> </template>
				<el-form-item label="省市区：" prop="districtCode" class="custom-width">
					<el-cascader
						v-model="model.districtCode"
						@change="handleChange"
						:props="{
							value: 'code',
							label: 'name',
							children: 'childNode',
							emitPath: false,
						}"
						:options="provinceCityDistrictTreeList"
						placeholder="请选择省市区"
						clearable
						ref="cascader"
					/>
				</el-form-item>
				<el-form-item label="详细地址：" prop="address" style="width: 554px" class="address-wrapper">
					<el-input v-model="model.address" type="text" placeholder="请输入详细地址" maxlength="100" show-word-limit clearable />
					<el-button type="primary" @click="handleChangeAddress">点击更新位置信息</el-button>
				</el-form-item>
				<el-form-item label="经度：" prop="longitude" class="custom-width">
					<el-input type="number" v-model="model.longitude" disabled></el-input>
				</el-form-item>
				<el-form-item label="纬度：" prop="latitude" class="custom-width">
					<el-input type="number" v-model="model.latitude" disabled></el-input>
				</el-form-item>
				<!-- 地图 -->
				<div>注意：地图默认定位到成都市中心，如需更换点位请在地图内部点击，自动替换选中点经纬度</div>
				<div ref="mapRef" class="map" style="width: 615px; height: 386px; padding-bottom: 10px"></div>
			</el-card>
		</el-form>
		<template #footer>
			<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
			<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { OutletParams } from './types';
import { pickupSiteSaveOrUpdate, getPickupSiteDetail } from '/@/api/culture/pickupSite';
import { getProvinceCityDistrictTree } from '/@/api/culture/common';
import { jsonp } from 'vue-jsonp';
// import { userRoleList } from '/@/hooks/enums';
import { userVisiableRole } from '/@/stores/userVisiableRole';
import pinia from '/@/stores';
const userRoleList = ref<any[]>([]);
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('新增网点');
const formRef = ref();
const scopeId = ref('') as any;
const provinceCityDistrictTreeList = ref([]);
const cascader = ref();
const regionTextInfo = ref(null);
const model = ref<OutletParams>({
	// type: [],
	identityCodes: [],
	code: null, // spu编码(传空值时新增,否则编辑)
	name: '', // 网点名称
	businessHours: '', // 营业时间
	remark: '', // 备注说明
	imageUrl: '', // 门头照片
	contactName: '', // 联系人
	contactTelephone: '', // 联系电话
	districtCode: '', // 行政区编码
	address: '', // 详细地址
	longitude: 0, // 经度
	latitude: 0, // 纬度
});
// 默认经纬度，定位到成都，新增时需要使用
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

const initMap = () => {
	//定义地图中心点坐标
	const mapCenter = new TMap.LatLng(newLocationInfo.value.lat, newLocationInfo.value.lng);
	map = new TMap.Map(mapRef.value, {
		center: mapCenter, //设置地图中心点坐标
		zoom: 14, //设置地图缩放级别
		pitch: 0, //设置俯仰角
		rotation: 0, //设置地图旋转角度
		viewMode: '2D',
	});
	// 移除旋转控件
	map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
	// 移除logo以及左下角信息
	let logoInfo = document.querySelector('canvas+div:last-child') as HTMLDivElement;
	logoInfo.style.display = 'none';
	// 禁止拖拽
	// map.setDraggable(false);
	// 禁止缩放
	// map.setScrollable(false);
	//移除控件缩放
	// map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
	// 移除比例尺控件
	// map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE);

	//初始化marker图层
	markerLayer = new TMap.MultiMarker({
		map: map,
	});
	addMarker();
	map.on('click', clickHandler);
};
// 添加标注
const addMarker = () => {
	// 清空标注 使其始终为一个
	markerLayer.setGeometries([]);
	markerLayer.add({
		position: new TMap.LatLng(newLocationInfo.value.lat, newLocationInfo.value.lng),
	});
};
// 地图点击事件
const clickHandler = (event: any) => {
	const { lat, lng } = event.latLng;
	newLocationInfo.value.lat = Number(lat.toFixed(8));
	newLocationInfo.value.lng = Number(lng.toFixed(8));
	model.value.longitude = Number(lng.toFixed(8));
	model.value.latitude = Number(lat.toFixed(8));
	jsonp(`https://apis.map.qq.com/ws/geocoder/v1`, {
		key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
		location: `${lat},${lng}`,
		output: 'jsonp',
	})
		.then((res: any) => {
			const { status, result, message } = res;
			if (status === 0) {
				// console.log('result', result);
				model.value.districtCode = result.ad_info.adcode;
				// 使用推荐地址回显
				model.value.address = result.formatted_addresses.recommend;
				// 处理省市区在回显的时候没有选择造成的参数报错的问题
				regionTextInfo.value = result.address;
			} else {
				useMessage().error(message);
			}
		})
		.catch((err) => {
			useMessage().error(err);
		});
	addMarker();
};

const closeMyDialog = () => {
	visible.value = false;
	model.value = {
		identityCodes: [],
		code: null,
		name: '',
		businessHours: '',
		remark: '',
		imageUrl: '',
		contactName: '',
		contactTelephone: '',
		districtCode: '',
		address: '',
		longitude: 0,
		latitude: 0,
	};
	if (map) {
		map.destroy(); // 销毁地图实例
	}
};
const openDialog = async (id?: string) => {
	visible.value = true;
	scopeId.value = id;
	getTree();
	// 获取用户可见角色列表
	const roleList = userVisiableRole().userRoleList;
	if (roleList.length > 0) {
		userRoleList.value = roleList;
	} else {
		await userVisiableRole(pinia).setUserRoleInfos();
		const roleList = userVisiableRole().userRoleList;
		if (roleList.length > 0) {
			userRoleList.value = roleList;
		}
	}
	if (id) {
		dialogTitle.value = '编辑网点';
		try {
			const { code, data } = await getPickupSiteDetail(scopeId.value);
			if (code === 0) {
				model.value = { ...data };
				console.log('model.value', model.value);
				if (data.imageUrl) {
					model.value.imageUrl = data.imageUrl;
				} else {
					model.value.imageUrl = '';
				}
				// if (data.type === 1) {
				// 	model.value.type = ['1'];
				// } else if (data.type === 2) {
				// 	model.value.type = ['2'];
				// } else if (data.type === 3) {
				// 	model.value.type = ['1', '2'];
				// }
				// model.value;
				newLocationInfo.value.lat = data.latitude;
				newLocationInfo.value.lng = data.longitude;
			}
		} catch (err: any) {
			useMessage().error(err);
		}
	} else {
		dialogTitle.value = '新建网点';
		model.value.longitude = Number(originLocationInfo.lng.toFixed(8));
		model.value.latitude = Number(originLocationInfo.lat.toFixed(8));
		newLocationInfo.value.lat = Number(originLocationInfo.lat.toFixed(8));
		newLocationInfo.value.lng = Number(originLocationInfo.lng.toFixed(8));
	}
	nextTick(() => {
		initMap();
	});
};

//   表单校验规则
const formRules = reactive<FormRules>({
	name: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
	// type: [{ required: true, message: '请选择受众范围', trigger: 'change' }],
	districtCode: [{ required: true, message: '请选择省市区', trigger: 'change' }],
	address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
	longitude: [{ required: true, message: '请选择经度', trigger: 'change' }],
	latitude: [{ required: true, message: '请选择纬度', trigger: 'change' }],
	identityCodes: [{ required: true, message: '请选择受众范围', trigger: 'change' }],
});

// 获取到选中节点的完整数组列表，获取省市区的文本信息，用于地图地址解析联动
const handleChange = () => {
	if (cascader.value) {
		const checkedNodes = cascader.value.getCheckedNodes();
		if (checkedNodes && checkedNodes.length > 0) {
			regionTextInfo.value = checkedNodes[0].pathLabels?.join('');
		}
	}
};

// 获取行政区树形结构数据
const getTree = async () => {
	let res = await getProvinceCityDistrictTree();
	provinceCityDistrictTreeList.value = res.data;
};

// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm(formEl);
};

const handleChangeAddress = async () => {
	jsonp('https://apis.map.qq.com/ws/geocoder/v1', {
		address: regionTextInfo.value ? regionTextInfo.value + model.value.address : model.value.address,
		key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
		output: 'jsonp',
	}).then((data) => {
		// 获取到地址信息，进行地址解析，生成新的经纬度
		const { status, result } = data;
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
		}
	});
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${scopeId.value ? '编辑' : '新建'}网点`, `${scopeId.value ? '编辑' : '新建'}网点`);
			} catch {
				return false;
			}

			let params = {
				...model.value,
				code: model.value.code ? model.value.code : null,
				// type: model.value.type?.length === 2 ? 3 : model.value.type?.includes('1') ? 1 : 2,
			};
			if (model.value.imageUrl) {
				params.imageUrl = model.value.imageUrl;
			} else {
				params.imageUrl = '';
			}

			try {
				const { code, msg } = await pickupSiteSaveOrUpdate(params);
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
			moveToErr();
			return false;
		}
	});
};
// 自动定位到表单报错项
const moveToErr = () => {
	nextTick(() => {
		let isError = document.getElementsByClassName('is-error');
		if (isError.length) {
			isError[0].scrollIntoView({
				block: 'center',
				behavior: 'smooth',
			});
			// 这个当滑动到报错项之后自动获取输入框的焦点，方便用户直接进行输入，延迟 800ms 是因为需要都能到定位成功后在进行获取焦点体验更好一些
			setTimeout(() => {
				if (isError[0].previousElementSibling?.querySelector('input')) {
					isError[0].previousElementSibling.querySelector('input')?.focus();
				}
			}, 800);
		}
	});
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	Object.keys(model.value).forEach((key) => ((model as any).value[key] = ''));
	model.value.code = null;
	closeMyDialog();
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.custom-width {
	width: 400px;

	:deep(.el-cascader) {
		width: 100%;
	}
}

.position-info {
	display: flex;
	flex-direction: row;
}

.address-wrapper {
	:deep(.el-form-item__content) {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;

		> div {
			margin-right: 10px;
		}
	}
}
</style>
