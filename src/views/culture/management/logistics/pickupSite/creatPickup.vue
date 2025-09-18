<template>
	<el-drawer
		v-if="dialogVisible"
		:title="drawerTitle"
		v-model="dialogVisible"
		size="1100px"
		direction="rtl"
		:before-close="handleClose"
		:modal-append-to-body="false"
		:wrapperClosable="false"
		class="showHeader"
		v-loading="loading"
	>
		<div class="demo-drawer__content detailSection">
			<el-form ref="ruleFormRef" :model="ruleForm" label-width="100px" size="small" :rules="rules">
				<!-- 基础信息 -->
				<el-card>
					<template #header> <span class="font-bold">基础信息</span> </template>
					<el-form-item label="网点名称：" prop="name">
						<el-input v-model.trim="ruleForm.name" class="withs" type="text" placeholder="请输入网点名称" maxlength="30" show-word-limit clearable />
					</el-form-item>
					<el-form-item label="营业时间：">
						<el-input
							v-model.trim="ruleForm.businessHours"
							class="withs"
							type="text"
							placeholder="请输入营业时间"
							maxlength="30"
							clearable
							show-word-limit
						/>
					</el-form-item>
					<el-form-item label="备注说明：">
						<el-input
							v-model="ruleForm.remark"
							type="textarea"
							placeholder="请输入备注"
							maxlength="200"
							class="withs"
							clearable
							resize="none"
							rows="6"
							show-word-limit
						/>
					</el-form-item>
					<el-form-item label="门头照片：">
						<upload-img v-model:image-url="ruleForm.imageUrl" :fileType="['image/jpeg', 'image/jpg', 'image/png']" />
					</el-form-item>
					<el-form-item label="联系人：">
						<el-input v-model="ruleForm.contactName" class="withs" type="text" placeholder="请输入联系人" clearable />
					</el-form-item>
					<el-form-item label="联系电话">
						<el-input v-model.trim="ruleForm.contactTelephone" class="withs" type="text" placeholder="请输入联系电话" clearable />
					</el-form-item>
				</el-card>

				<!-- 受众范围 -->
				<el-card class="mt-3">
					<template #header> <span class="font-bold">受众范围</span> </template>
					<el-form-item label="自提点受众：" prop="identityCodes">
						<el-checkbox-group v-model="ruleForm.identityCodes" id="identityCodes">
							<el-checkbox v-for="item in userRoleList" :key="item.code" :label="item.code">
								{{ item.name }}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-card>

				<!-- 取货信息 -->
				<el-card class="mt-3">
					<template #header> <span class="font-bold">取货信息</span> </template>
					<el-form-item label="省市区：" prop="districtCode">
						<el-cascader
							ref="cascader"
							class="withs"
							:options="cityList"
							v-model="ruleForm.districtCode"
							placeholder="请选择省市区"
							:props="props"
							clearable
							@change="changeRegion"
							style="width: 430px"
						/>
					</el-form-item>
					<el-form-item label="详细地址：" prop="address">
						<el-input v-model="ruleForm.address" class="withs" type="text" placeholder="请输入详细地址" maxlength="100" show-word-limit clearable />
						<el-button type="primary" @click="handleChangeAddress">点击更新位置信息</el-button>
					</el-form-item>
					<el-form-item label="经度：" prop="longitude">
						<el-input type="number" class="withs" v-model.number="ruleForm.longitude" disabled />
					</el-form-item>
					<el-form-item label="纬度：" prop="latitude">
						<el-input type="number" class="withs" v-model.number="ruleForm.latitude" disabled />
					</el-form-item>
					<div>注意：地图默认定位到成都市中心，如需更换点位请在地图内部点击，自动替换选中点经纬度</div>
					<div ref="mapRef" id="map" class="map" style="width: 615px; height: 386px; padding-bottom: 10px"></div>
				</el-card>
			</el-form>
		</div>
		<template #footer>
			<div class="demo-drawer__footer from-foot-btn btn-shadow drawer_fix">
				<div class="acea-row row-center">
					<el-button @click="handleClose(ruleFormRef)">取 消</el-button>
					<el-button type="primary" :loading="loading" @click="onsubmit(ruleFormRef)">确 定</el-button>
				</div>
			</div>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import * as pickup from '/@/api/culture/pickup';
import { jsonp } from 'vue-jsonp';

// 默认表单结构
const defaultRole = {
	identityCodes: [] as string[], // 自提点受众
	code: null as string | null,
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

// 表单数据
const ruleForm = reactive({ ...defaultRole });
const dialogVisible = ref(false);
const drawerTitle = ref('');
const loading = ref(false);
const cityList = ref<any[]>([]);
const props = {
	children: 'child',
	label: 'regionName',
	value: 'regionId',
	emitPath: false,
};
const ruleFormRef = ref() as any;
const regionTextInfo = ref<string | null>(null);
const newLocationInfo = reactive({
	lat: 0,
	lng: 0,
});
const userRoleList = ref<any>([]); // 用户角色
const cascader = ref();
const mapRef = ref<HTMLDivElement | null>(null);
let map: any = null;
let markerLayer: any = null;
const TMap = (window as any).TMap;
// Emits
const emit = defineEmits(['refresh']);
// 表单验证规则
const rules = {
	name: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
	districtCode: [{ required: true, message: '请选择省市区', trigger: 'change' }],
	address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
	longitude: [{ required: true, message: '请选择经度', trigger: 'change' }],
	latitude: [{ required: true, message: '请选择纬度', trigger: 'change' }],
	identityCodes: [{ required: true, message: '请选择受众范围', trigger: 'change' }],
};

// 初始化地图
const initMap = () => {
	const mapCenter = new TMap.LatLng(newLocationInfo.lat, newLocationInfo.lng);
	map = new TMap.Map(mapRef.value, {
		center: mapCenter,
		zoom: 14,
		pitch: 0,
		rotation: 0,
		viewMode: '2D',
	});

	map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);

	let logoInfo = document.querySelector('canvas+div:last-child');
	if (logoInfo) logoInfo.style.display = 'none';

	markerLayer = new TMap.MultiMarker({ map });
	addMarker();
	map.on('click', clickHandler);
};

// 添加标记
const addMarker = () => {
	markerLayer.setGeometries([]);
	markerLayer.add({
		position: new TMap.LatLng(newLocationInfo.lat, newLocationInfo.lng),
	});
};

// 地图点击事件
const clickHandler = (event: any) => {
	const { lat, lng } = event.latLng;
	newLocationInfo.lat = Number(lat.toFixed(8));
	newLocationInfo.lng = Number(lng.toFixed(8));
	ruleForm.longitude = Number(lng.toFixed(8));
	ruleForm.latitude = Number(lat.toFixed(8));

	jsonp(`https://apis.map.qq.com/ws/geocoder/v1`, {
		key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
		location: `${lat},${lng}`,
		output: 'jsonp',
	})
		.then((res: any) => {
			const { status, result, message } = res;
			console.log('result', result);
			if (status === 0) {
				ruleForm.districtCode = result.ad_info.adcode;
				ruleForm.address = result.formatted_addresses.recommend;
				regionTextInfo.value = result.address;
			} else {
				useMessage().error(message);
			}
		})
		.catch((err: any) => {
			useMessage().error(err);
		});

	addMarker();
};

// 更新地址时重新定位
const handleChangeAddress = () => {
	jsonp('https://apis.map.qq.com/ws/geocoder/v1', {
		address: regionTextInfo.value ? regionTextInfo.value + ruleForm.address : ruleForm.address,
		key: 'PJPBZ-Z4RE7-Y5VXU-PMM5Q-TGFRO-45BPO',
		output: 'jsonp',
	}).then((data: any) => {
		const { status, result } = data;
		if (status === 0) {
			newLocationInfo.lat = result.location.lat;
			newLocationInfo.lng = result.location.lng;
			ruleForm.longitude = Number(result.location.lng);
			ruleForm.latitude = Number(result.location.lat);

			if (map) {
				map.destroy();
			}
			initMap();
		}
	});
};

// 树形结构处理
const changeNodes = (data: any[]): any[] => {
	if (data.length > 0) {
		for (let i = 0; i < data.length; i++) {
			if (!data[i].child || data[i].child.length < 1) {
				data[i].child = undefined;
			} else {
				changeNodes(data[i].child);
			}
		}
	}
	return data;
};

// 区域选择回调
const changeRegion = () => {
	if (cascader.value) {
		const checkedNodes = cascader.value.getCheckedNodes();
		if (checkedNodes && checkedNodes.length > 0) {
			regionTextInfo.value = checkedNodes[0].pathLabels?.join('');
		}
	}
};

// 获取详情
const getInfo = (id: string) => {
	loading.value = true;
	// const loadingInstance = Loading.service({ fullscreen: true });
	pickup
		.pickupDetailApi({ id })
		.then((res) => {
			dialogVisible.value = true;
			Object.assign(ruleForm, res.data);
			ruleForm.districtCode = res.data.regionId;
			newLocationInfo.lat = res.data.latitude;
			newLocationInfo.lng = res.data.longitude;
			loading.value = false;
			nextTick(() => {
				initMap();
				// loadingInstance.close();
			});
		})
		.catch((res) => {
			useMessage().error(res.message);
			// loadingInstance.close();
		});
};

// 获取城市列表
const getCityList = () => {
	pickup
		.cityListTree()
		.then((res) => {
			localStorage.setItem('cityList', JSON.stringify(res.data));
			cityList.value = changeNodes(JSON.parse(localStorage.getItem('cityList')));
		})
		.catch((res) => {
			useMessage().error(res.message);
		});
};

// 提交表单（带防抖）
const onsubmit = (formEl: any) => {
	formEl.validate((valid: boolean) => {
		if (valid) {
			loading.value = true;
			let params = {
				...ruleForm,
				code: ruleForm.code || null,
				type: 1,
			};
			if (ruleForm.imageUrl) {
				params.imageUrl = ruleForm.imageUrl;
			}

			pickup
				.savePickupApi(params)
				.then(() => {
					useMessage().success('操作成功');
					emit('refresh');
					loading.value = false;
					handleClose(ruleFormRef.value);
				})
				.catch(() => {
					loading.value = false;
				});
		} else {
			return false;
		}
	});
};
// 关闭弹窗并重置数据
const handleClose = (formEl?: any) => {
	// if (!formEl) return;
	// if (formEl) formEl?.resetFields();
	dialogVisible.value = false;
	Object.assign(ruleForm, defaultRole);
	emit('refresh');
	if (map) map.destroy();
};
// 打开弹窗
const openDetail = (id?: string) => {
	if (id) {
		drawerTitle.value = '编辑自提点';
		getInfo(id);
	} else {
		drawerTitle.value = '新增自提点';
		dialogVisible.value = true;
		newLocationInfo.lat = originLocationInfo.lat;
		newLocationInfo.lng = originLocationInfo.lng;
		ruleForm.longitude = Number(originLocationInfo.lng.toFixed(8));
		ruleForm.latitude = Number(originLocationInfo.lat.toFixed(8));
		nextTick(() => {
			initMap();
		});
	}
};

// 获取用户角色
const getUserRole = () => {
	// const loadingInstance = Loading.service({ fullscreen: true });
	pickup
		.userRoleApi()
		.then((res) => {
			console.log('getUserRole', res);
			userRoleList.value = res.data || [];
			// nextTick(() => loadingInstance.close());
		})
		.catch((res) => {
			useMessage().error(res.message);
			// nextTick(() => loadingInstance.close());
		});
};

// 暴露给父组件的方法
defineExpose({ openDetail, getCityList });

onMounted(() => {
	const savedCityList = localStorage.getItem('cityList');
	if (savedCityList) {
		cityList.value = changeNodes(JSON.parse(savedCityList));
	}
	getUserRole();
});

// 默认定位成都
const originLocationInfo = {
	lat: 30.65734806,
	lng: 104.06576663,
};

// 使用 Message
const useMessage = () => {
	return {
		success: (msg: string) => console.log(msg),
		error: (msg: string) => console.error(msg),
	};
};
</script>
<style scoped lang="scss">
.showHeader {
	.el-drawer__body {
		padding: 15px 0;
	}
	.el-drawer__header {
		display: flex;
		margin-bottom: 5px !important;
	}
	.demo-drawer_title {
		font-size: 18px !important;
	}
}
.demo-drawer__content {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 24px 24px 24px;
}
.mt-3 {
	margin-top: 24px;
}

.demo-drawer__content form {
	flex: 1;
	padding-bottom: 80px;
}

::v-deep .el-drawer__body {
	padding: 30px 0 70px 0;
}

.withs {
	width: 50%;
}

.pictrue {
	width: 60px;
	height: 60px;
	border: 1px dotted rgba(0, 0, 0, 0.1);
	margin-right: 10px;
	position: relative;
	cursor: pointer;

	img {
		width: 100%;
		height: 100%;
	}

	video {
		width: 100%;
		height: 100%;
	}
}

.tempBox {
	::v-deep .el-input-number--mini {
		width: 100px !important;
	}

	::v-deep .el-form-item {
		margin-bottom: 0 !important;
	}
}
.acea-row {
	display: -webkit-box;
	display: -moz-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-lines: multiple;
	-moz-box-lines: multiple;
	-o-box-lines: multiple;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	/* 辅助类 */
}
.acea-row.row-between {
	-webkit-box-pack: justify;
	-moz-box-pack: justify;
	-o-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
}
.acea-row.row-center {
	-webkit-box-pack: center;
	-moz-box-pack: center;
	-o-box-pack: center;
	-ms-flex-pack: center;
	-webkit-justify-content: center;
	justify-content: center;
}

:deep(.el-drawer__header) {
	margin-bottom: 0px !important;
}
</style>
