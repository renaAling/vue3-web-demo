<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view" style="overflow: auto">
      <div @click="router.go(-1)" class="flex items-center cursor-pointer">
        <el-icon class="mr-[4px]">
          <ArrowLeftBold />
        </el-icon>
        返回
      </div>
      <el-steps class="my-4" :active="stepsActive" align-center>
        <el-step title="商户信息" />
        <el-step title="关联站点" />
        <el-step title="商户配置" />
      </el-steps>
      <div v-if="showGetNewInfo" @click="handleGetNewInfo" class="showGetNewInfo">拉取最新客户数据</div>
      <div v-if="stepsActive === 0">
        <!-- <ShopInfo ref="shopInfoRef" :stepsActive="stepsActive" :visible="visible"></ShopInfo> -->
        <el-form :model="formData" ref="formEl1" :rules="rules" label-width="140px">
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
          <div ref="mapRef" class="w-full h-[400px]" />
        </el-form>
      </div>
      <div v-if="stepsActive === 1">
        <!-- <Sites ref="sitesRef" :stepsActive="stepsActive" :visible="visible"></Sites> -->
        <el-form :model="formData" ref="formEl2" :rules="rules" label-width="120px">
          <el-form-item label="关联站点:" prop="subwayId">
            <el-select v-model="formData.subwayId" placeholder="请选择关联站点" @change="handleChange">
              <el-option v-for="item in subwayStationList" :key="item.value" :label="item.subwayName"
                :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属线路:" prop="lineName">
            <el-input placeholder="请选择所属线路" v-model="formData.lineName" clearable disabled />
          </el-form-item>
          <el-form-item label="区域" prop="areaName">
            <el-select v-model="formData.areaName" placeholder="请选择区域" disabled default-first-option clearable>
              <el-option v-for="value in stores.regionCodeList" :key="value.regionCode" :label="value.regionName"
                :value="value.regionCode"></el-option>
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
          <div ref="mapRef2" class="w-full h-[400px]" />
        </el-form>
      </div>
      <div v-if="stepsActive === 2">
        <!-- <Configuration ref="configurationRef" :stepsActive="stepsActive" :visible="visible"></Configuration> -->
        <el-form :model="formData" ref="formEl3" label-width="120px">
          <el-form-item label="商户LOGO:">
            <UploadImg v-model:image-url="formData.logoUrl" />
          </el-form-item>
          <el-form-item label="商家信息">
            <editor v-model:get-html="formData.information" height="500" width="100%" />
          </el-form-item>
          <el-form-item label="关联商家:">
            <el-select v-model="formData.linkStoreCode" filterable placeholder="请选择关联站点" @change="handleChange1">
              <el-option v-for="item in areaStoreList" :key="item.storeCode" :label="item.storeName"
                :value="item.storeCode" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="flex justify-center mt-[10px]">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="handleUp" v-if="stepsActive !== 0">上一步</el-button>
        <el-button type="primary" @click="handleNext" v-if="stepsActive !== 2">下一步</el-button>
        <el-button type="primary" @click="submitForm" v-if="stepsActive === 2">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="merchantManagementDetail">
import { jsonp } from 'vue-jsonp';
import type { FormRules } from 'element-plus';
import { goBackFn } from '/@/views/note/activityPageMangement/hooks';
import { travelCommunalData } from '/@/stores/note';
import { useThrottleFn } from '@vueuse/core';
import { storeAddApi, storeUpdateApi, storeDetailApi, getNewInfo, subwayStationApi, getAreaStoreListApi } from '/@/api/note/noteInfo';
import { useMessage } from '/@/hooks/message';

const stores = travelCommunalData();
const route = useRoute();
const router = useRouter();
// const ShopInfo = defineAsyncComponent(() => import('./dialogComponents/shopInfo/index.vue'));
// const Sites = defineAsyncComponent(() => import('./dialogComponents/sites/index.vue'));
// const Configuration = defineAsyncComponent(() => import('./dialogComponents/configuration/index.vue'));

const formEl1 = ref();
const formEl2 = ref();
const formEl3 = ref();
const formData = ref<any>({
  ipoCode: null,
  name: '',
  storeType: null,
  address: '',
  longitude: 0,
  latitude: 0,
  mobile: '',
  tags: '',
  isCover: true,

  lineName: null,
  areaName: '',
  subwayLongitude: 0,
  subwayLatitude: 0,

  logoUrl: null,
  information: null,
  linkMerchantCode: null,
  linkStoreCode: null,
  linkStoreId: null,
  original: null,
});
const rules = reactive<FormRules<any>>({
  name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
  storeType: [{ required: true, message: '请选择', trigger: 'change' }],
  address: [{ required: true, message: '请输入位置', trigger: 'blur' }],
  // businessTime: [{ required: true, message: '请输入营业时间', trigger: 'blur' }],
  lineName: [{ required: true, message: '请选择所属线路', trigger: 'blur' }],
  subwayLongitude: [{ required: true, message: '请选择经纬度', trigger: 'blur' }],
  subwayId: [{ required: true, message: '请选择关联站点', trigger: 'change' }],
});
const tagList = ref<any[]>([]);
const handleAdd = () => {
  if (tagList.value.length >= 3) {
    useMessage().error('最多添加三个标签');
    return;
  }
  
  let tagsArray = [];
  if (typeof formData.value.tags === 'string') {
    tagsArray = formData.value.tags.split(',').filter((tag: any) => tag.trim() !== '');
  } else if (Array.isArray(formData.value.tags)) {
    tagsArray = formData.value.tags;
  }
  
  if (tagsArray.length === 0) {
    useMessage().error('请输入正确的商户标签');
    return;
  }
  
  const str = tagsArray.join(',');
  
  const isDuplicate = tagList.value.some((item) => item.name === str);
  if (isDuplicate) {
    useMessage().error('商户标签重复');
    return;
  }
  
  tagList.value.push({
    name: str,
  });
  formData.value.tags = [];
};
const handleClose = (tag: string) => {
  tagList.value.splice(tagList.value.indexOf(tag), 1);
};

// 第二步
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
  if (!selectedStation) return;
  console.log(selectedStation, '----selectedStation-------')
  formData.value.lineName = selectedStation.lineName;
  formData.value.areaName = selectedStation.areaName;
  formData.value.subwayLongitude = selectedStation.longitude;
  formData.value.subwayLatitude = selectedStation.latitude;
  initMap2()
};

// 地图部分
let map: any = null;
// 初始化地图
const mapRef = ref(null);
// marker图层
let markerLayer: any = null;
const TMap = (window as any).TMap;
/**
* 初始化地图
*/
// const initMap = () => {
//   //定义地图中心点坐标
//   const mapCenter = new TMap.LatLng(formData.value.latitude, formData.value.longitude);
//   map = new TMap.Map(mapRef.value, {
//     center: mapCenter, //设置地图中心点坐标
//     zoom: 16, //设置地图缩放级别
//     pitch: 0, //设置俯仰角
//     rotation: 0, //设置地图旋转角度
//     viewMode: '2D',
//   });
//   // 移除旋转控件
//   map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
//   // 移除logo以及左下角信息
//   let logoInfo = document.querySelector('canvas+div:last-child') as HTMLDivElement;
//   logoInfo.style.display = 'none';

//   //初始化marker图层
//   markerLayer = new TMap.MultiMarker({
//     map: map,
//   });
//   addMarker();
//   // 点击地图获取定位和地址
//   map.on('click', (e: any) => {
//     console.log('e', e);
//     const { lat, lng } = e.latLng;
//     formData.value.latitude = lat;
//     formData.value.longitude = lng;
//     addMarker();
//     getAddress();
//     if (map) {
//       map.destroy();
//     }
//     initMap();
//   });
// };
let mapOne: any = null
let markerOneLayer: any = null
// 第一页地图
const initMap = () => {
  const lat = Number(formData.value.latitude) || 30.65734806
  const lng = Number(formData.value.longitude) || 104.06576663
  const center = new TMap.LatLng(lat, lng)

  // 如果实例已存在但 DOM 已换，销毁旧实例
  if (mapOne && mapOne.getContainer && mapOne.getContainer() !== mapRef.value) {
    mapOne.destroy()
    mapOne = null
    markerOneLayer = null
  }

  if (!mapOne) {
    mapOne = new TMap.Map(mapRef.value, { center, zoom: 16, pitch: 0, rotation: 0, viewMode: '2D' })
    mapOne.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)
    markerOneLayer = new TMap.MultiMarker({ map: mapOne })
    mapOne.on('click', (e: any) => {
      formData.value.latitude = e.latLng.lat
      formData.value.longitude = e.latLng.lng
      addMarker()
      getAddress()
    })
  } else {
    mapOne.setCenter(center)
  }
  addMarker()
}
// const initMap = () => {
//   const lat = Number(formData.value.latitude) || 30.65734806
//   const lng = Number(formData.value.longitude) || 104.06576663
//   const center = new TMap.LatLng(lat, lng)

//   // 首次初始化
//   if (!mapOne) {
//     mapOne = new TMap.Map(mapRef.value, {
//       center,
//       zoom: 16,
//       pitch: 0,
//       rotation: 0,
//       viewMode: '2D',
//     })
//     mapOne.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)
//     const logo = mapRef.value?.querySelector('canvas+div:last-child') as HTMLDivElement
//     if (logo) logo.style.display = 'none'

//     markerOneLayer = new TMap.MultiMarker({ mapOne })
//     addMarker()

//     // 只绑定一次点击
//     mapOne.on('click', (e: any) => {
//       formData.value.latitude = e.latLng.lat
//       formData.value.longitude = e.latLng.lng
//       addMarker()
//       getAddress()
//     })
//   } else {
//     // 仅更新中心点
//     mapOne.setCenter(center)
//     addMarker()
//   }
// }
// 添加标注
const addMarker = () => {
  // 清空标注 使其始终为一个
  markerOneLayer.setGeometries([]);
  markerOneLayer.add({
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
        // if (map) {
        //   map.destroy();
        // }
        // initMap();
      }
    });
  },
  1000,
  false
);

// 第二步的地图
let map2: any = null;          // 第二步专用地图实例
let markerLayer2: any = null;  // 第二步专用标注图层
const mapRef2 = ref();
// 第二页地图
const initMap2 = () => {
  const lat = Number(formData.value.subwayLatitude) || 30.65734806
  const lng = Number(formData.value.subwayLongitude) || 104.06576663
  const center = new TMap.LatLng(lat, lng)

  if (map2 && map2.getContainer && map2.getContainer() !== mapRef2.value) {
    map2.destroy()
    map2 = null
    markerLayer2 = null
  }

  if (!map2) {
    map2 = new TMap.Map(mapRef2.value, { center, zoom: 16, pitch: 0, rotation: 0, viewMode: '2D' })
    map2.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)
    markerLayer2 = new TMap.MultiMarker({ map: map2 })
    map2.on('click', (e: any) => {
      formData.value.subwayLatitude = e.latLng.lat
      formData.value.subwayLongitude = e.latLng.lng
      addMarker2()
      getAddress2()
    })
  } else {
    map2.setCenter(center)
  }
  addMarker2()
}
// const initMap2 = () => {
//   // 1. 经纬度兜底
//   const lat = Number(formData.value.subwayLatitude);
//   const lng = Number(formData.value.subwayLongitude);
//   const center = new (window as any).TMap.LatLng(lat, lng);

//   // 2. 首次初始化
//   if (!map2) {
//     map2 = new (window as any).TMap.Map(mapRef2.value, {
//       center,
//       zoom: 16,
//       pitch: 0,
//       rotation: 0,
//       viewMode: '2D',
//     });

//     // 移除腾讯自带控件
//     map2.removeControl((window as any).TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
//     const logo = mapRef2.value?.querySelector?.('canvas+div:last-child') as HTMLDivElement;
//     if (logo) logo.style.display = 'none';

//     // 标注图层
//     markerLayer2 = new (window as any).TMap.MultiMarker({ map: map2 });
//     addMarker2();

//     // 只绑定一次点击事件
//     map2.on('click', (e: any) => {
//       formData.value.subwayLatitude = e.latLng.lat;
//       formData.value.subwayLongitude = e.latLng.lng;
//       addMarker2();
//       getAddress2();
//     });
//   }
//   // 3. 非首次：仅更新中心点与标注
//   else {
//     map2.setCenter(center);
//     addMarker2();
//   }
// };

// 添加/更新标注
const addMarker2 = () => {
  if (!markerLayer2) return;
  const lat = Number(formData.value.subwayLatitude) || 30.65734806;
  const lng = Number(formData.value.subwayLongitude) || 104.06576663;
  markerLayer2.setGeometries([
    {
      position: new (window as any).TMap.LatLng(lat, lng),
    },
  ]);
};
// 根据经纬度获取地址
const getAddress2 = useThrottleFn(
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
        // if (map) {
        //   map.destroy();
        // }
        // initMap2();
      }
    });
  },
  1000,
  false
);

// 第三步
const areaStoreList = ref();
const getAreaStoreList = async () => {
  const { data } = await getAreaStoreListApi();
  areaStoreList.value = data;
};

const handleChange1 = (val: any) => {
  const linkMerchant = areaStoreList.value.find((station: any) => station.storeCode === val);
  formData.value.linkStoreCode = linkMerchant.storeCode;
  formData.value.linkMerchantCode = linkMerchant.merchantCode;
  formData.value.original = linkMerchant.original;
  formData.value.linkStoreId =linkMerchant.id
};

// 数据
const stepsActive = ref<number>(0);
const visible = ref(false);
const dialogTitle = ref('商户信息维护');

const openDialog = (row?: any) => {
  stepsActive.value = 0;
  if (row?.ipoCode) {
    dialogTitle.value = '编辑';
    getStoreDetail(row);
  } else {
    dialogTitle.value = '新增';
  }
  visible.value = true;
};
const showGetNewInfo = ref<boolean>(false)
// const getStoreDetail = async (ipoCode: string) => {
//   const res = await storeDetailApi(ipoCode);
//   if (res?.ok) {
//     console.log(res, '<<res')
//     formData.value = { ...res.data, tags: res.data.tags ? res.data.tags.split(',') : [] };
//     tagList.value = formData.value.tags.map((item: any) => ({ name: item }));
//     showGetNewInfo.value = res.data.isSynchronous
//     nextTick(() => {
//       initMap();
//     });
//   }
// };
const getStoreDetail = async (ipoCode: string) => {
  const res = await storeDetailApi(ipoCode)
  if (res?.ok) {
    formData.value = { ...res.data, tags: res.data.tags ? res.data.tags.split(',') : [] }
    tagList.value = formData.value.tags.map((item: any) => ({ name: item }))
    showGetNewInfo.value = res.data.isSynchronous

    // 直接复用旧地图，不再销毁
    nextTick(() => initMap())
  }
}
// 拉取最新客户数据
const handleGetNewInfo = async () => {
  let res = await getNewInfo({ ipoCode: route.query.ipoCode })
  console.log(res, '<<Res')
  if (res.ok) {
    await getStoreDetail(route.query.ipoCode as string)
    stepsActive.value = 0

  }

};
watch(
  () => stepsActive.value,
  async (newVal) => {
    if (newVal === 0) {
      const ipoCode = route.query.ipoCode as string;
      if (ipoCode) {
        getStoreDetail(ipoCode);
      } else {
        formData.value = {
          ...formData.value,
          latitude: 30.65734806,
          longitude: 104.06576663,
          subwayLatitude: 30.65734806,
          subwayLongitude: 104.06576663,
          areaName: '青羊区',
          areaCode: '',
          subwayId: '',//第二页的时候默认关联站点是空
          linkStoreCode: '',
          linkMerchantCode: '',
          original: '',
          tags: [],
        };
        nextTick(() => {
          initMap();
        });
      }
    }
    if (newVal === 1) {
      await getSubwayStation();
      handleChange(formData.value.subwayId);
      nextTick(() => {
        initMap2();
      });
    }
    if (newVal === 2) {
      await getAreaStoreList();
    }

    // if (newVal) {
    // 	if (newVal === 0) {
    // 		shopInfoRef.value.openDialog(formData.value);
    // 	}
    // 	if (newVal === 1) {
    // 		sitesRef.value.openDialog(formData.value);
    // 	}
    // 	if (newVal === 2) {
    // 		configurationRef.value.openDialog(formData.value);
    // 	}
    // }
  },
  { immediate: true }
);

// 上一步
const handleUp = () => {
  stepsActive.value -= 1;
};
// 下一步
const handleNext = async () => {
  // console.log('formData.value', formData.value);
  // stepsActive.value += 1;
  try {
    const valid = await Promise.all([formEl1.value?.validate(), formEl2.value?.validate(), formEl3.value?.validate()]);
    if (valid) {
      if (stepsActive.value < 2) {
        stepsActive.value++;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log('验证失败', error);
  }

  // const formRefs = [shopInfoRef, sitesRef, configurationRef];
  // const currentRef = formRefs[stepsActive.value];
  // if (currentRef?.value?.submitForm) {
  // 	const result = await currentRef.value.submitForm();
  // 	if (result) {
  // 		stepsActive.value += 1;
  // 	}
  // }
};
const submitForm = async () => {
  // let pageA = shopInfoRef.value.returnForm();
  // let pageB = sitesRef.value.returnForm();
  // let pageC = configurationRef.value.returnForm();
  if(formData.value.information==='<p><br></p>'){
    formData.value.information='';
  }
  const params = {
    ...formData.value,
    tags: tagList.value.map((item) => item.name).join(','),
  };
  try {
    const res = formData.value.ipoCode ? await storeUpdateApi(params) : await storeAddApi(params);
    if (res?.ok) {
      useMessage().success(res?.msg || '操作成功');
      router.go(-1);
    } else {
      useMessage().error(res?.msg);
    }
  } catch (error) {
    console.log(error);
  }
};
const resetForm = () => {
  goBackFn(formEl1.value, '/note/consumptionMap/merchantManagement/index');
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss">
:deep(.el-step__icon-inner) {
  font-size: 20px !important;
}
.showGetNewInfo{
      text-align: end;
    margin-bottom: 20px;
    color: #4785EA;
    cursor: pointer;
}
</style>
