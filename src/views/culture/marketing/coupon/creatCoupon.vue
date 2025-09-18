<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view" style="overflow: auto;">
      <div class="my-3 mx-2">
        <span @click="router.go(-1)" class=" cursor-pointer"><el-icon>
            <ArrowLeftBold />
          </el-icon>返回</span>
        <span class="ml-6">{{ isEdit && !isCopy ? '编辑优惠券' : !isCopy ? '添加优惠券' : '复制优惠券' }}</span>
      </div>
      <el-tabs v-if="tabList.length > 0" v-model="currentTab" class="list-tabs mb25">
        <el-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.value" :label="item.title" />
      </el-tabs>
      <el-form ref="formValidateRef" v-loading="loading" class="formValidate" :rules="ruleValidate"
        :model="formValidate" label-width="150px" @submit.native.prevent>
        <div v-show="currentTab === '1'">
          <el-form-item label="优惠券名称" prop="name">
            <el-input v-model="formValidate.name" class="from-ipt-width" placeholder="请输入优惠券名称" maxlength="20" />
          </el-form-item>
          <el-form-item label="优惠券类型" prop="couponType">
            <el-radio-group v-model="formValidate.couponType" :disabled="isEdit && !isCopy">
              <el-radio label="折扣券" :value="2" />
              <el-radio label="满减券" :value="1" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="优惠券折扣" prop="discount" v-if="formValidate.couponType === 2">
            <el-input-number type="number" v-model="formValidate.discount" :min="0" :step="1" :precision="1" :disabled="isEdit && !isCopy" :max="9.9"
               class="from-ipt-width" placeholder="请输入优惠券折扣">
              <template #suffix><span class="suffix_text">折</span></template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="优惠券面值(元)" prop="money" v-if="formValidate.couponType === 1">
            <!-- @change="changeMinPrice" -->
            <el-input-number type="number" v-model="formValidate.money" :min="0" :step="1" step-strictly :disabled="isEdit && !isCopy" :max="9999"
               class="from-ipt-width" placeholder="请输入优惠券面值">
              <template #suffix><span class="suffix_text">元</span></template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="使用门槛(元)" prop="minPrice">
            <el-input-number v-model="formValidate.minPrice" :min="0" :disabled="isEdit && !isCopy" class="from-ipt-width"
              :max="999999"  :step="1" step-strictly   placeholder="请输入使用门槛">
              <template #suffix><span class="suffix_text">元</span></template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="领取方式" prop="receiveType">
            <el-radio-group v-model="formValidate.receiveType" :disabled="isEdit && !isCopy">
              <!-- <el-radio :label="1">用户领取</el-radio> -->
              <el-radio :label="3">平台活动使用</el-radio>
            </el-radio-group>
            <p class="desc mt-10">
              1. 用户手动领取指用户需要在移动端的领券中心领取优惠券；<br />
              2. 平台活动使用指其他营销活动可选择此类型优惠券，用户满足活动条件后直接提示发放 ；
            </p>
          </el-form-item>
          <el-form-item label="领取时间" prop="isTimeReceive" v-if="formValidate.receiveType === 1">
            <el-radio-group v-model="formValidate.isTimeReceive" :disabled="isEdit && !isCopy">
              <el-radio :label="true">时间段</el-radio>
              <el-radio :label="false">不限时</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formValidate.isTimeReceive && formValidate.receiveType === 1" prop="collectionTime">
            <el-date-picker v-model="formValidate.collectionTime" class="from-ipt-width" type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptionsForEditCoupon" align="right"
              @change="onChangeCollectionTime" />
            <p class="desc mt10">优惠券可以在此时间范围之内领取</p>
          </el-form-item>
          <el-form-item label="使用有效期" prop="isFixedTime">
            <el-radio-group v-model="formValidate.isFixedTime">
              <el-radio :label="false">天数</el-radio>
              <el-radio :label="true">时间段</el-radio>
            </el-radio-group>
            <p class="desc mt10">
              {{ !isEdit || isCopy ? '' : '优惠券编辑后，之前已经领取的优惠券使用有效期不会改变' }}
            </p>
          </el-form-item>
          <el-form-item v-if="!formValidate.isFixedTime" prop="day">
            <el-input-number class="from-ipt-width" placeholder="请输入天数" :max="999" :step="1" step-strictly
              v-model="formValidate.day">
              <template #suffix><span class="suffix_text">天</span></template>
            </el-input-number>
            <p class="desc mt10">领取之后多少天之后失效，失效的优惠券将不能使用</p>
          </el-form-item>
          <el-form-item v-if="formValidate.isFixedTime" prop="validityTime">
            <el-date-picker placement="top" v-model="formValidate.validityTime" class="from-ipt-width"
              type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]" start-placeholder="开始日期"
              end-placeholder="结束日期" align="right" @change="onChangeValidityTime"
              :picker-options="pickerOptionsForEditCoupon" />
          </el-form-item>
          <el-form-item :label="!isEdit || isCopy ? '发布数量(张)' : '增加发布数量(张)'" prop="isLimited">
            <el-radio-group v-model="formValidate.isLimited" :disabled="isEdit && !isCopy">
              <el-radio :label="true">限量</el-radio>
              <el-radio :label="false">不限量</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formValidate.isLimited" prop="total">
            <el-input-number v-if="!isEdit || isCopy" class="from-ipt-width" placeholder="请输入优惠券数量" :max="999999"
              :step="1" step-strictly v-model="formValidate.total">
              <template #suffix><span class="suffix_text">张</span></template>
            </el-input-number>
            <el-input-number v-else class="from-ipt-width" placeholder="请输入优惠券数量" :max="999999" :step="1" step-strictly
              v-model="formValidate.num">
              <template #suffix><span class="suffix_text">张</span></template>
            </el-input-number>
            <p class="desc mt10">
              {{
                !isEdit || isCopy
                  ? '填写优惠券的发放数量'
                  : '编辑时，填写优惠券增加的数量；例如：新增时填写2张优惠券，编辑时填写1，则编辑后总共发布3张优惠券'
              }}
            </p>
          </el-form-item>
          <el-form-item label="重复领取" prop="isRepeated">
            <el-radio-group v-model="formValidate.isRepeated">
              <el-radio :label="false">不可重复</el-radio>
              <el-radio :label="true">可重复</el-radio>
            </el-radio-group>
            <p v-if="formValidate.receiveType === 1" class="desc mt10">
              可重复领取，若用户领取该优惠券且使用过后，可以再次领取；<br />
              不可重复领取，若用户领取该优惠券无论是否使用，都不可再次领取
            </p>
            <p v-else class="desc mt10">
              可重复领取，若多个营销活动赠送同一优惠券，一个用户可领取多张；<br />
              不可重复领取，若多个营销活动赠送同一优惠券，一个用户只能领取1张
            </p>
          </el-form-item>
          <el-form-item label="是否开启:">
            <el-switch :width="56" :disabled="isEdit && !isCopy" v-model="formValidate.status" active-text="开启"
              inactive-text="关闭" inline-prompt />
          </el-form-item>
        </div>
        <div v-show="currentTab === '2'">
          <el-form-item label-width="0">
            <el-radio-group v-model="formValidate.category" :disabled="isEdit && !isCopy">
              <el-radio :label="3">通用</el-radio>
              <el-radio :label="4">品类</el-radio>
              <el-radio :label="2">商品</el-radio>
              <!-- <el-radio :label="5">品牌</el-radio> -->
              <el-radio :label="6">供应商</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formValidate.category == 4" label="选择分类" :span="24" label-width="80px">
            <el-cascader class="from-ipt-width" ref="cascader" v-model="state.linkedData" clearable
              :options="adminProductClassify" :props="categoryProps" />
          </el-form-item>
          <el-form-item v-if="formValidate.category == 2" label-width="0">
            <el-button type="primary" @click="addGoods">添加商品</el-button>
            <el-button @click="batchDel" :disabled="!state.multipleSelection.length">批量删除</el-button>
          </el-form-item>
          <el-form-item v-if="formValidate.category == 2" label-width="0">
            <el-table border ref="tableList" v-loading="state.listLoading" :data="state.tableData.data" style="width: 100%"
              @selection-change="handleSelectionChange" @select-all="selectAll" @select="selectOne"
              class="tableSelection">
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="id" label="ID" width="55"> </el-table-column>
              <el-table-column label="商品图" min-width="80">
                <template #default="scope">
                  <div class="demo-image__preview line-heightOne">
                    <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="name" label="商品名称" min-width="200" />
              <el-table-column prop="price" label="售价" min-width="90" />
              <el-table-column prop="stock" label="库存" min-width="70" />
              <el-table-column label="操作" width="140" fixed="right">
                <template #default="scope">
                  <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="formValidate.category == 5" label="选择品牌" :span="24" prop="proBrandList"
            label-width="80px">
            <el-select class="from-ipt-width" clearable filterable v-model="state.proBrandList" :loading="loading"
              remote placeholder="请选择品牌">
              <el-option v-for="(v, i) in productBrand" :key="i" :label="v.name" :value="v.id" :disabled="!v.isShow">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择供应商" v-if="formValidate.category == 6" :span="24" label-width="90px" prop="merIds">
            <merchant-name @getMerId="getMerId" :multiple="true" :merIdChecked="state.merIds"
              style="width: 460px"></merchant-name>
          </el-form-item>
        </div>
      </el-form>
      <div class="flex justify-center items-center">
        <el-button type="primary" v-show="currentTab === '1'" @click="submitForm">下一步</el-button>
        <el-button v-show="currentTab === '2'" @click="currentTab = '1'" class="priamry_border">上一步</el-button>
        <el-button v-show="currentTab === '2'" type="primary" @click="save">保存</el-button>
      </div>
    </div>

    <goodListModal ref="goodListRef"></goodListModal>
  </div>
</template>
<script lang="ts" setup name="creatCoupon">
import { couponInfoApi, platformCouponAddApi, platformCouponEditApi } from '/@/api/culture/marketing.ts';
import merchantName from './merUseCategory.vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import goodListModal from '../seckill/seckillActivity/goodList/goodListFrom/index.vue';
import {
  productCategoryApi,
  brandListAllApi
} from '/@/api/culture/commodity/commodityList';
const formValidateRef = ref();
let currentTab = ref('1');
const goodListRef = ref();
const tabList = [
  { value: '1', title: '基础设置' },
  { value: '2', title: '使用范围' },
]
let loading = ref(false);

const formValidate = reactive({
  name: '', //优惠券名称
  category: 3, //适用范围
  money: 1, //面值
  minPrice: 2, // 使用门槛(使用门槛略高于优惠券面额)
  receiveType: 3, //领取方式
  isTimeReceive: true, //领取时间类型
  receiveStartTime: '', //可领取开始时间
  receiveEndTime: '', //可领取结束时间
  isFixedTime: false,
  day: 1, //天数
  useStartTime: '', //可使用时间范围 开始时间
  useEndTime: '', //可使用时间范围 结束时间
  isLimited: true, //是否限量
  total: 1, //总数
  num: 0, //编辑优惠券发布数量
  isRepeated: false, //是否可重复领取
  linkedData: null, //关联数据
  status: false,
  validityTime: [], //使用有效期
  collectionTime: [], //领取时间
  couponType: 2, // 优惠券类型
  discount: 0, //折扣
});
const ruleValidate = {
  name: [{ required: true, message: '请输入优惠券名称' }],
  money: [{ required: true, message: '请输入优惠券面值' }],
  discount: [{ required: true, message: '请输入优惠券折扣' }],
  minPrice: [{ required: true, message: '请输入优惠券使用门槛' }],
  receiveType: [{ required: true, message: '请选择领取方式' }],
  isTimeReceive: [{ required: true, message: '请选择领取时间类型' }],
  day: [{ required: true, message: '请输入天数' }],
  total: [{ required: true, message: '请输入发布数量' }],
  isLimited: [{ required: true, message: '请选择使用有效期' }],
  isRepeated: [{ required: true, message: '请选择是否可重复领取' }],
  isFixedTime: [{ required: true, message: '请选择使用有效期' }],
  validityTime: [
    {
      type: 'array',
      required: true,
      message: '请选择日期区间',
      fields: {
        0: {
          //type: 'tpye', //tpye类型试情况而定,所以如果返回的是date就改成date
          required: true,
          trigger: 'change',
          message: '请选择开始日期',
        },
        1: {
          //type: 'tpye',
          required: true,
          trigger: 'change',
          message: '请选择结束日期',
        },
      },
    },
  ],
  collectionTime: [
    {
      type: 'array',
      required: true,
      message: '请选择日期区间',
      fields: {
        0: {
          //type: 'tpye', //tpye类型试情况而定,所以如果返回的是date就改成date
          required: true,
          trigger: 'change',
          message: '请选择开始日期',
        },
        1: {
          //type: 'tpye',
          required: true,
          trigger: 'change',
          message: '请选择结束日期',
        },
      },
    },
  ],
  couponType: [{ required: true, message: '请选择优惠券类型' }],
};
const categoryProps = {
  value: 'id',
  label: 'name',
  children: 'childList',
  expandTrigger: 'hover',
  checkStrictly: true,
  emitPath: false,
  multiple: false,
};
const state = reactive({
  listLoading: false,
  selectGoods: false,
  multipleSelection: [],
  tableData: {
    data: [],
    total: 0,
  },
  proBrandList: '',
  merIds: [],
  ids: [],
  linkedData: null,
})
const route = useRoute();
const router = useRouter();
const pickerOptionsForEditCoupon = {
  // 时间有效校验
  disabledDate(time) {
    return time.getTime() < Date.now() - 8.64e7;
  },
}
const isEdit = computed(() => {
  return route.query.id ? true : false;
})
const isCopy = computed(() => {
  return route.query.copy ? true : false;
})

state.tempRoute = Object.assign({}, route);
const adminProductClassify = ref<any[]>([]);
const productBrand = ref<any[]>([]);
/** 平台商品分类 **/
const getAdminProductClassify = async () => {
  try {
    const { code, data, msg } = await productCategoryApi();
    if (code === 0) {
      console.log('data', data);
      adminProductClassify.value = data.map(e => {
        return {
          ...e,
          disabled: true
        }
      });
    } else {
      useMessage().error(msg);
    }
  } catch (error: any) {
    useMessage().error(error.msg);
  }
};
/** 商品品牌 **/
const getMerProductBrand = async () => {
  try {
    const { code, data, msg } = await brandListAllApi();
    if (code === 0) {
      console.log('data', data);
      productBrand.value = data;
    } else {
      useMessage().error(msg);
    }
  } catch (error: any) {
    useMessage().error(error.msg);
  }
};

const changeMinPrice = ()=>{
  if(formValidate.couponType === 1 && formValidate.minPrice <= formValidate.money) {
    useMessage().error('优惠卷面值必须小于优惠券使用门槛');
    formValidate.minPrice = formValidate.money + 1;
    return;
  }
}

onMounted(() => {
  getAdminProductClassify()
  getMerProductBrand();
  if (isEdit.value) {
    getInfo();
  }
})
const submitForm = () => {
  formValidateRef.value.validate((valid) => {
    if (valid) {
      currentTab.value = '2';
    } else {
      useMessage().warning('请完善基础设置信息');
    }
  });
};

// 具体日期
const onChangeValidityTime = (e) => {
  formValidate.validityTime = e;
  formValidate.useStartTime = e ? e[0] : '';
  formValidate.useEndTime = e ? e[1] : '';
};
// 领取时间
const onChangeCollectionTime = (e) => {
  formValidate.collectionTime = e;
  formValidate.receiveStartTime = e ? e[0] : '';
  formValidate.receiveEndTime = e ? e[1] : '';
};
const back = () => {
  router.push({ path: '/culture/marketing/coupon/index' });
};
// 获取商户id
const getMerId = (id) => {
  state.merIds = id;
};
// const addGoods = () => {
//   this.$modalGoodList(
//     function (row) {
//       state.listLoading = false;
//       state.tableData.data = row;
//     },
//     'many',
//     _state.tableData.data,
//   );
// };
const addGoods = () => {
  goodListRef.value.state.handleNum = 'many';
  if (state.tableData.data.length) {
    // goodListRef.value.state.goodsType = state.tableData.data.map(e => { return e.id })
    goodListRef.value.state.goodsType = ''
  }
  // goodListRef.value.state.goodsType = state.tableData.data;
  goodListRef.value.state.callback = function (row) {
    state.listLoading = false;
    state.tableData.data = row;
  };
  goodListRef.value.state.visible = true;
  // this.$modalGoodList(
  //   function (row) {
  //     state.listLoading = false;
  //     getAttrValue(row);
  //   },
  //   'many',
  //   state.proData,
  // );
};
//行删除
const handleDelete = async (index) => {
  try {
    await useMessageBox().confirm('删除该秒杀商品吗？');
  } catch {
    return;
  }
  try {
    state.tableData.data.splice(index, 1);
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
//批量删除
const batchDel = async () => {
  try {
    await useMessageBox().confirm('批量删除该商品吗？');
  } catch {
    return;
  }
  try {
    let data = [];
    for (let item1 of state.tableData.data) {
      let _index = state.multipleSelection.findIndex((c) => c.id === item1.id);
      if (_index === -1) {
        data.push(item1);
      }
    }
    state.tableData.data = data;
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
const handleSelectionChange = (val) => {
  state.multipleSelection = val;
};
const selectAll = (data) => {
  let id = data.map((i) => {
    return i.spu_id;
  });
  state.ids = Array.from(new Set([...state.ids, ...id]));
};
const selectOne = (data, row) => {
  let id = data.map((i) => {
    return i.spu_id;
  });
  let index = state.ids.findIndex((e) => {
    return e == row.spu_id;
  });
  state.ids.splice(index, 1);
  state.ids = Array.from(new Set([...state.ids, ...id]));
};

const getInfo = () => {
  couponInfoApi(route.query.id).then((data) => {
    const res = data.data
    Object.assign(formValidate, JSON.parse(JSON.stringify(res)))
    formValidate.discount = formValidate.discount / 10;
    if (formValidate.isTimeReceive) {
      formValidate.collectionTime = [
        formValidate.receiveStartTime,
        formValidate.receiveEndTime,
      ]
    }
    if (res.category == 6) {
      state.merIds = formValidate.linkedData.split(',');
    } else if (formValidate.category == 4) {
      state.linkedData = Number(formValidate.linkedData);
    } else if (formValidate.category == 2) {
      state.tableData.data = formValidate.productList;
    } else if (formValidate.category == 5) {
      state.proBrandList = Number(formValidate.linkedData);
    }
    if (formValidate.useStartTime && formValidate.useEndTime) {
      formValidate.validityTime = [res.useStartTime, res.useEndTime]
    }
    formValidate.num = 1;
  });
};

//保存
const save = () => {
  formValidate.discount = formValidate.discount * 10;
  switch (formValidate.category) {
    case 6:
      formValidate.linkedData = state.merIds.toString();
      break;
    case 2:
      if (!state.tableData.data.length) return useMessage().error('请选择至少一个商品');
      let data = [];
      state.tableData.data.map((item) => data.push(item.id));
      formValidate.linkedData = data.toString();
      break;
    case 4:
      formValidate.linkedData = state.linkedData;
      break;
    case 5:
      formValidate.linkedData = state.proBrandList.toString();
      break;
    default:
      formValidate.linkedData = '';
      break;
  }
  if (formValidate.receiveType === 3) formValidate.isTimeReceive = false;
  if (isEdit.value && !isCopy.value) {
    platformCouponEditApi(formValidate).then(() => {
      useMessage().success('添加成功');
      back();
    });
  } else {
    platformCouponAddApi(formValidate).then(() => {
      useMessage().success('添加成功');
      back();
    });
  }
}
</script>
<style lang="scss" scoped>
::v-deep .selWidth {
  width: 460px !important;
}

.add_title {
  position: relative;
}

.box-body {
  ::v-deep.el-card__body {
    padding-top: 0px;
  }
}

.from-ipt-width {
  width: 460px;
}

.input_width {
  width: 100px;
}

.pictrue {
  width: 58px;
  height: 58px;
  margin-right: 10px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .del {
    position: absolute;
    top: 0;
    right: 0;
  }
}

.suffix_text {
  color: #333;
}

.desc {
  color: #999;
  font-size: 12px;
  line-height: 16px;
  margin: 0;
  padding-left: 10px;
}

.demo-image__preview {
  display: inline-block;

  .el-image {
    width: 50px;
    height: 50px;
  }
}

.line-heightOne {
  line-height: 1;
}
</style>
