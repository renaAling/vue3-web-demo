<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view" style="overflow: auto;">
      <div class="my-3 mx-2">
        <span @click="back" class=" cursor-pointer"><el-icon>
            <ArrowLeftBold />
          </el-icon>返回</span>
        <span class="ml-6">{{ pageType ? '添加商品' : `${title}秒杀活动` }}</span>
      </div>
      <el-tabs v-model="activeName" class="mb25">
        <el-tab-pane v-if="!pageType" label="基础设置" name="first">
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm">
            <div v-loading="state.loading">
              <template v-if="activeName == 'first' && !pageType">
                <el-form-item label="活动名称" prop="name">
                  <el-input :disabled="pageType" v-model="ruleForm.name" placeholder="请输入活动名称"
                    class="from-ipt-width"></el-input>
                </el-form-item>
                <el-form-item label="活动日期" prop="timeVal">
                  <el-date-picker :disabled="pageType" v-model="ruleForm.timeVal" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" align="right" unlink-panels type="daterange" placement="bottom-end"
                    placeholder="自定义时间" class="from-ipt-width" @change="onchangeTime" :picker-options="pickerOptions" />
                  <p class="desc mt10">设置活动开始日期与结束日期，用户可以在有效时间内参与秒杀</p>
                </el-form-item>
                <el-form-item label="秒杀场次" prop="timeVal2">
                  <el-select :disabled="pageType" v-model="ruleForm.timeVal2" placeholder="请选择秒杀场次" multiple cearable
                    class="from-ipt-width" @change="onchangeTime2">
                    <el-option v-for="item in state.spikeTimeList" :key="item.id + 'onl'"
                      :label="item.name + ' | ' + item.startTime + '-' + item.endTime" :value="item.id"
                      :disabled="item.status === 0" />
                  </el-select>
                  <p class="desc mt10">
                    选择商品开始时间段，该时间段内用户可参与购买；其它时间段会显示活动未开始或已结束，可多选
                  </p>
                </el-form-item>
                <el-form-item label="活动限购">
                  <el-input-number :disabled="pageType" v-model="ruleForm.allQuota" controls-position="right" :min="0"
                    :max="99999" class="from-ipt-width"></el-input-number>
                  <p class="desc mt10">
                    活动有效期内每个用户可购买该商品总数限制。例如设置为4，表示本次活动有效期内，每个用户最多可购买总数4个，0为不限购
                  </p>
                </el-form-item>
                <el-form-item label="单次限购">
                  <el-input-number :disabled="pageType" v-model="ruleForm.oneQuota" controls-position="right" :min="0"
                    :max="99999" class="from-ipt-width"></el-input-number>
                  <p class="desc mt10">
                    用户参与秒杀时，一次购买最大数量限制。例如设置为2，表示参与秒杀时，用户一次购买数量最大可选择2个，0为不限购
                  </p>
                </el-form-item>
                <!-- <el-form-item label="商品范围">
                  <el-select :disabled="pageType" v-model="ruleForm.proCategorylist" placeholder="请选择商品分类" multiple
                    class="from-ipt-width">
                    <el-option v-for="item in adminProductClassify" :key="item.id + 'onl'" :label="item.name"
                      :value="item.id" :disabled="!item.isShow" />
                  </el-select>
                  <p class="desc mt10">设置秒杀活动可以参与的商品分类，可多选，不选为全品类商品。</p>
                </el-form-item>
                <el-form-item label="参与门槛" prop="merStars">
                  <el-rate :disabled="pageType" v-model="ruleForm.merStars" style="margin-top: 6px"></el-rate>
                  <p class="desc mt10">设置秒杀活动可以参与的商户星级。</p>
                </el-form-item> -->
              </template>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="!isEdit || pageType ? '添加商品' : '商品列表'" name="second">
          <template v-if="activeName == 'second'">
            <div v-if="!isEdit || pageType" class="acea-row row-between-wrapper">
              <div class="acea-row mb20">
                <el-button type="primary" @click="addGoods">添加商品</el-button>
                <el-dropdown class="ml10 mr10">
                  <el-button :disabled="state.isShowCheck">
                    批量设置<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>

                      <el-dropdown-item :disabled="state.isShowCheck" @click.native="setPrice(2)">限量</el-dropdown-item>
                      <el-dropdown-item :disabled="state.isShowCheck" @click.native="setPrice(1)">活动价</el-dropdown-item>

                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button @click="batchDel" :disabled="state.isShowCheck">批量删除</el-button>
              </div>
            </div>
            <el-table ref="tableList" row-key="id" border :data="state.proData" v-loading="state.listLoading"
              :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle" default-expand-all
              :tree-props="{ children: 'children' }" style="width: 100%">
              <el-table-column width="30"></el-table-column>
              <el-table-column width="50">
                <template #header>
                  <el-checkbox :indeterminate="state.isIndeterminate" v-model="state.checkAll"
                    @change="handleCheckAllChange" />
                </template>
                <template #default="scope">
                  <el-checkbox v-model="scope.row.checked" v-if="!scope.row.sku"
                    @change="(v) => handleCheckOneChange(v, scope.row)" />
                </template>
              </el-table-column>
              <el-table-column width="240" label="商品信息">
                <template #default="scope">
                  <div class="acea-row">
                    <div class="demo-image__preview mr10 line-heightOne">
                      <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                    </div>
                    <div class="row_title line2">{{ scope.row.name }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="categoryName" label="商品分类" min-width="80" />
              <el-table-column prop="merName" label="商户名称" min-width="80" />
              <el-table-column prop="price" label="售价" width="120" />
              <el-table-column :label="isEdit && !pageType ? '限量剩余' : '库存'" min-width="80">
                <template #default="scope">
                  {{ isEdit && !pageType ? scope.row.quota : scope.row.stock }}
                </template>
              </el-table-column>
              <el-table-column label="限量" width="120">
                <template #default="scope">
                  <div v-if="scope.row.sku">
                    <span v-if="isEdit && !pageType">{{ scope.row.quotaShow }}</span>
                    <el-input-number v-else :disabled="isEdit && !pageType" v-model="scope.row.quota" :precision="0"
                      :min="0" :max="scope.row.stock" :controls="false" class="input_width">
                    </el-input-number>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="activityPrice" label="活动价格" width="120">
                <template #default="scope">
                  <el-input-number v-if="scope.row.sku" :disabled="isEdit && !pageType"
                    v-model="scope.row.activityPrice" type="number" :precision="2" :min="0.01" :max="99999"
                    :controls="false" class="input_width">
                  </el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排序" width="120">
                <template #default="scope">
                  <el-input-number v-if="!scope.row.sku" :disabled="isEdit && !pageType" v-model="scope.row.sort"
                    type="number" :precision="0" :min="0" :max="99999" :controls="false" class="input_width">
                  </el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60" fixed="right">
                <template #default="scope">
                  <el-button type="text" :disabled="isEdit && !pageType" v-if="!scope.row.sku"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
      </el-tabs>

      <div class="flex justify-center">
        <el-button v-show="activeName == 'first'" type="primary" @click="activeName = 'second'">下一步</el-button>
        <el-button v-show="activeName == 'second' && !pageType" class="priamry_border"
          @click="activeName = 'first'">上一步</el-button>
        <el-button v-show="(activeName == 'second' || (activeName == 'first' && isEdit && !pageType))" type="primary"
          @click="submitForm" :loading="state.submitLoading">保存</el-button>
      </div>
      <activity ref="activityModal" key="keyNum" @onChange="setActivity" />
      <goodListModal ref="goodListRef"></goodListModal>
    </div>

  </div>
</template>

<script lang="ts" name="creatSeckillForm" setup>
import {
  seckillIntervalListApi,
  seckillActivityAddApi,
  seckillActivityDetailApi,
  seckillAtivityUpdateApi,
  seckillProAdd,
} from '/@/api/culture/marketing.ts';
import {
  productCategoryApi
} from '/@/api/culture/commodity/commodityList';
import activity from './activity.vue';
import { useTable } from '/@/hooks/table';

import { useMessage, useMessageBox } from '/@/hooks/message';
import goodListModal from './goodList/goodListFrom/index.vue';

const goodListRef = ref();
const activeName = ref('first');
const ruleForm = reactive({
  allQuota: 0,
  endDate: '',
  merStars: 1,
  name: '',
  oneQuota: 0,
  proCategory: '',
  startDate: '',
  timeIntervals: '',
  id: '',
  productList: [],
  timeVal2: [],
  timeVal: [],
  proCategorylist: [],

});
const rules = ref({
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  share: [{ required: true, message: '请选择优惠比例', trigger: 'change' }],
  timeVal: [{ required: true, message: '请选择活动日期' }],
  discount: [{ required: true, message: '请选择优惠方式' }],
  timeVal2: [{ type: 'array', required: true, message: '请选择秒杀场次', trigger: 'change' }],
  merStars: [{ required: true, message: '请选择商户星级', trigger: 'change' }],
});
const pickerOptions = {
  disabledDate(time) {
    return time.getTime() < Date.now() - 8.64e7;
  },
};
const state = reactive({
  spikeTimeList: [],
  multipleSelection: [],
  activityType: null,
  proData: [],
  listLoading: false,
  checkAll: false,
  isIndeterminate: false,
  tempRoute: {},
  isShowCheck: false,
  keyNum: 0,
  loading: false,
  submitLoading: false,
})
const { tableStyle } = useTable(state);
const adminProductClassify = ref<any[]>([]);
const route = useRoute();
const router = useRouter();
state.tempRoute = Object.assign({}, route);
onMounted(() => {
  // if (!this.adminProductClassify.length) this.$store.dispatch('product/getAdminProductClassify');
  getAdminProductClassify()
  if (pageType.value) activeName.value = 'second';
  //setTagsViewTitle();
  getSeckillIntervalList();
  isCkecked();
  if (route.query.id && !pageType.value) {
    getInfo();
  }
})
const pageType = computed(() => {
  return route.query.type === 'add' ? true : false;
})
const title = computed(() => {
  return route.query.id ? '编辑' : '添加';
})
const isEdit = computed(() => {
  return route.query.id ? true : false;
})
/** 平台商品分类 **/
const getAdminProductClassify = async () => {
  try {
    const { code, data, msg } = await productCategoryApi();
    if (code === 0) {
      console.log('data', data);
      adminProductClassify.value = data;
    } else {
      useMessage().error(msg);
    }
  } catch (error: any) {
    useMessage().error(error.msg);
  }
};

// ...mapGetters(['adminProductClassify']),
// const setTagsViewTitle = () => {
//   if (route.params.id) {
//     const title = pageType.value ? '添加商品' : route.params.id ? '编辑秒杀活动' : '添加秒杀活动';
//     const route = Object.assign({}, state.tempRoute, { title: `${title}-${route.params.id}` });
//     this.$store.dispatch('tagsView/updateVisitedView', route);
//   }
// };
// 判断选中没有
const isCkecked = () => {
  let checked = state.proData.filter((item) => item.checked);
  if (checked.length) {
    state.isShowCheck = false;
  } else {
    state.isShowCheck = true;
  }
};

//全选
const handleCheckAllChange = (val) => {
  state.isIndeterminate = false;
  state.proData.forEach((item) => {
    item.checked = val;
  });
  isCkecked();
};
//单选
const handleCheckOneChange = (val, row) => {
  let totalCount = state.proData.length;
  let someStatusCount = 0;
  row.checked = val;
  state.proData.forEach((item) => {
    if (item.checked === val) {
      someStatusCount++;
    }
  });
  state.checkAll = totalCount === someStatusCount ? val : !val;
  state.isIndeterminate = someStatusCount > 0 && someStatusCount < totalCount;
  isCkecked();
};
//详情
const getInfo = () => {
  state.loading = true;
  seckillActivityDetailApi(route.query.id)
    .then((data) => {
      const res = data.data
      let info = res;
      Object.assign(ruleForm, {
        allQuota: info.allQuota,
        endDate: info.endDate,
        merStars: info.merStars,
        name: info.name,
        oneQuota: info.oneQuota,
        proCategory: info.proCategory,
        startDate: info.startDate,
        timeIntervals: info.timeIntervals,
        id: info.id,
        productList: info.productList,
        timeVal2: info.timeIntervals.split(',').map((item) => item * 1),
        timeVal: [info.startDate, info.endDate],
        proCategorylist: info.proCategory !== '0' ? info.proCategory.split(',').map((item) => item * 1) : [],
      })
      getAttrValue(info.productList);
      state.loading = false;
      //state.isIndeterminate = !state.isIndeterminate;
    })
    .catch(() => {
      state.loading = false;
    });
};
const back = () => {
  router.replace({ path: `/culture/marketing/seckill/seckillActivity/index` });
};
//行删除
const handleDelete = async (index, row) => {
  try {
    await useMessageBox().confirm('删除该秒杀商品吗？');
  } catch {
    return;
  }
  try {
    let i = state.proData.findIndex((item) => item == row);
    state.proData.splice(i, 1);
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
const setActivity = (data, type) => {
  if (type == 1) {
    if (data.type == 0) {
      state.proData.forEach((item) => {
        item.children.forEach((item1) => {
          if (item.checked) {
            item1.activityPrice = data.price;
          }
        });
      });
    } else {
      state.proData.forEach((item) => {
        item.children.forEach((item1) => {
          if (item.checked) {
            item1.activityPrice = (item1.price * data.discount) / 100;
          }
        });
      });
    }
  } else if (type == 2) {
    state.proData.forEach((item) => {
      item.children.forEach((item1) => {
        if (item.checked) {
          item1.quota = data.activity_stock
        }
      });
    });
  }
};
// 列表
const getSeckillIntervalList = () => {
  seckillIntervalListApi().then((res) => {
    state.spikeTimeList = res.data;
  });
};
const addGoods = () => {
  goodListRef.value.state.handleNum = 'many';
  goodListRef.value.state.checked = state.proData
  //goodListRef.value.state.goodsType = state.proData;
  goodListRef.value.state.callback = function (row) {
    state.listLoading = false;
    getAttrValue(row);
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
// 选中商品
const getAttrValue = (row) => {
  row.map((item) => {
    item.sort = item.sort ? item.sort : 0;
    item.id = item.id ? item.id : 0;
    item.checked = false;
    item.attrValue.map((i) => {
      i.name = i.sku;
      i.merName = item.merName;
      i.categoryName = item.categoryName;
      i.quota = i.quota ? i.quota : 0;
      i.quotaShow = i.quotaShow ? i.quotaShow : 0;
      i.activityPrice = route.query.id && !pageType.value ? i.price : 0;
      i.price = route.query.id && !pageType.value ? i.otPrice : i.price;
    });
    item.children = item.attrValue;
  });
  state.proData = row;
  isCkecked();
};
const batchDel = async () => {
  try {
    await useMessageBox().confirm('批量删除商品吗？');
  } catch {
    return;
  }
  try {
    state.proData = state.proData.filter((item) => !item.checked);
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
const activityModal = ref()
//设置活动价
const setPrice = (type) => {
  state.keyNum = Math.random();
  activityModal.value.type = type;
  activityModal.value.visible = true;
};
// 具体日期
const onchangeTime2 = (e) => {
  ruleForm.timeIntervals = e.toString();
};
// 具体日期
const onchangeTime = (e) => {
  ruleForm.timeVal = e;
  ruleForm.startDate = e ? e[0] : '';
  ruleForm.endDate = e ? e[1] : '';
};
const ruleFormRef = ref();
const submitForm = async () => {
  let valid = true;
  if (ruleFormRef.value) {
    valid = await ruleFormRef.value.validate().catch(() => { });
  }
  if (!valid) return false;
  try {
    state.submitLoading = true;
    if (state.proData.length > 0) {
      let total = 0;
      let price = 0;
      state.proData.map((item) => {
        item.children.map((i) => {
          total += i.quota;
          price += i.activityPrice;
        });
      });
      if (!total && total !== 0) return useMessage().warning('商品限量不能为空');
      if (!price) return useMessage().warning('商品秒杀价格不能为空');
      if (total < state.proData.length) return useMessage().warning('商品限量总和不能小于0');
    }
    ruleForm.productList = state.proData.map((item) => {
      return {
        id: item.id,
        sort: item.sort,
        attrValue: item.attrValue.map((item1) => {
          return {
            activityPrice: item1.activityPrice,
            attrValueId: item1.id,
            quota: item1.quota,
          };
        }),
      };
    });
    ruleForm.proCategory = ruleForm.proCategorylist.length
      ? ruleForm.proCategorylist.toString()
      : '0';
    if (pageType.value) {
      seckillProAdd({
        id: route.query.id,
        productList: ruleForm.productList,
      })
        .then(() => {
          useMessage().success('添加成功');
          back();
        })
        .catch((err) => {
          useMessage().error(err.msg);
        });
    } else {
      route.query.id
        ? seckillAtivityUpdateApi(ruleForm)
          .then(() => {
            useMessage().success('编辑成功');
            back();
          })
          .catch((err) => { useMessage().error(err.msg); })
        : seckillActivityAddApi(ruleForm)
          .then(() => {
            useMessage().success('添加成功');
            back();
          })
          .catch((err) => { useMessage().error(err.msg); });
    }
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    state.submitLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.add_title {
  position: relative;
}


.f-w-500 {
  font-weight: 500;
}

.f-s-18 {
  font-size: 18px;
}

.ml32 {
  margin-left: 32px;
}

.row_title {
  width: 170px !important;
}

.input_width {
  width: 100px;
}

.desc {
  color: #999;
  font-size: 12px;
  line-height: 16px;
  margin: 0;
  padding-left: 10px;
}

.mt10 {
  margin-top: 10px;
}

.mr14 {
  margin-right: 14px;
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

.from-ipt-width {
  width: 460px;
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
