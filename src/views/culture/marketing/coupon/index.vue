<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row class="justify-between">
        <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
          <el-form-item label="优惠券名" prop="name">
            <el-input v-model.trim="state.queryForm.name" placeholder="请输入优惠券名称" clearable
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="开启状态" prop="status">
            <el-select v-model="state.queryForm.status" placeholder="请选择开启状态" clearable style="width: 180px">
              <el-option label="开启" :value="1"></el-option>
              <el-option label="关闭" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="领取方式" prop="receiveType">
            <el-select v-model="state.queryForm.receiveType" clearable placeholder="请选择领取方式" style="width: 180px">
              <el-option label="用户领取" :value="1"></el-option>
              <el-option label="平台活动使用" :value="3"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="使用范围" prop="category">
            <el-select v-model="state.queryForm.category" clearable placeholder="请选择使用范围" @change="getList(1)"
              style="width: 180px">
              <el-option label="商品" :value="2"></el-option>
              <el-option label="通用" :value="3"></el-option>
              <el-option label="品类" :value="4"></el-option>
              <!-- <el-option label="品牌" :value="5"></el-option> -->
              <el-option label="供应商" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList" icon="search" type="primary">查询</el-button>
            <el-button @click="resetQuery" icon="Refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="mb8 flex  items-center">
        <router-link :to="{ path: '/culture/marketing/coupon/creatCoupon' }">
          <el-button icon="Plus" type="primary">添加优惠券</el-button>
        </router-link>
      </el-row>

      <el-table :data="state.dataList" v-loading="stateForm.loading" row-key="id" border 
        :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">

        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="name" show-overflow-tooltip label="优惠券名称" min-width="150" />
        <el-table-column prop="category" label="使用范围" min-width="90">
          <template #default="scope">
            <span>{{ couponCategory[scope.row.category] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="couponType" label="优惠券类型" min-width="100">
          <template #default="scope">
            <span>{{ scope.row.couponType === 1 ? '满减券' : '折扣券' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="面值(元)/折扣率(折)" min-width="150">
          <template #default="scope">
            <span v-if="scope.row.couponType === 1">{{ scope.row.money }}元</span>
            <span v-else>{{ scope.row.discount / 10 || 0 / 10 }}折</span>
          </template>
        </el-table-column>
        <el-table-column prop="minPrice" label="使用门槛(元)" min-width="110" />
        <el-table-column prop="issuedNum" label="发布数量/余量" min-width="120">
          <template #default="scope">
            <span>{{ scope.row.issuedNum }}/{{ scope.row.lastTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="issuedNum" label="领取量/使用量" min-width="120">
          <template #default="scope">
            <span>{{ scope.row.issuedNum }}/{{ scope.row.usedNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isLimited" label="发布数量" min-width="90">
          <template #default="scope">
            <span>{{ !scope.row.isLimited ? '不限量' : scope.row.total }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="receiveType" label="领取方式" min-width="100">
          <template #default="scope">
            <span>{{ receiveType[scope.row.receiveType] }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="useEndTime" label="有效期" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <div v-if="scope.row.useEndTime">
              {{ scope.row.useStartTime }} - {{ scope.row.useEndTime }}
            </div>
            <span v-else>不限时</span>
          </template>
        </el-table-column>
        <el-table-column label="是否开启" fixed="right" min-width="90">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-text="开" inline-prompt inactive-text="关" @change="onchangeIsShow(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <div class=" flex justify-center items-center">
              <el-button text type="primary" class="mr-2" @click="look(scope.row.id)">详情</el-button>
              <!-- <el-divider direction="vertical"></el-divider> -->
              <el-dropdown trigger="click">
                更多
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <router-link :to="{ path: `/culture/marketing/coupon/creatCoupon`,query: { id: scope.row.id }}"  >
                        编辑
                      </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <router-link :to="{ path: `/culture/marketing/coupon/creatCoupon`,query: { id: scope.row.id, copy:1 } }">
                        复制
                      </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleDelete(scope.row.id)">
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />

      <!--优惠券详情-->
      <el-drawer title="优惠券详情" size="1000px" v-model="stateForm.showInfo" direction="rtl" :before-close="handleClose">
        <div v-loading="stateForm.loading">
          <div class="detailHead" :class="!stateForm.showTab ? 'bdbtmSolid' : ''">
            <div class="full">
              <div class="order_icon"><span class="iconfont icon-youhuiquan"></span></div>
              <div class="text">
                <div class="title">{{ cell.name }}</div>
                <div>
                  <span class="mr20">优惠券面值：{{ cell.money }}元</span>
                </div>
              </div>
            </div>
          </div>
          <el-tabs v-model="stateForm.activeNames" v-if="stateForm.showTab">
            <el-tab-pane label="基础信息" name="one"></el-tab-pane>
            <el-tab-pane :label="stateForm.tabPaneName" name="two"></el-tab-pane>
          </el-tabs>
          <div class="px35" v-if="stateForm.activeNames == 'one'">
            <div class="detailSection" style="border: none">
              <div class="title">优惠券信息</div>
              <ul class="list">
                <li class="item">
                  <div class="tips">使用门槛：</div>
                  <div class="value">{{ cell.minPrice }}元</div>
                </li>
                <li class="item">
                  <div class="tips">领取时间：</div>
                  <div class="value">
                    {{ cell.isTimeReceive ? cell.receiveStartTime + ' - ' + cell.receiveEndTime : '不限时' }}
                  </div>
                </li>
                <li class="item">
                  <div class="tips">领取方式：</div>
                  <div class="value">
                    {{ receiveType[cell.receiveType] }}
                  </div>
                </li>
                <li class="item">
                  <div class="tips">使用范围：</div>
                  <div class="value">{{ couponCategory[cell.category] }}</div>
                </li>
                <li class="item">
                  <div class="tips">重复领取：</div>
                  <div class="value">{{ cell.isRepeated ? '可重复领取' : '不可重复领取' }}</div>
                </li>
                <li class="item">
                  <div class="tips">发布数量：</div>
                  <div class="value">{{ !cell.isLimited ? '不限量' : cell.total }}</div>
                </li>

                <li class="item">
                  <div class="tips">是否开启：</div>
                  <div class="value">{{ cell.status ? '开启' : '关闭' }}</div>
                </li>
                <li class="item">
                  <div class="tips">使用有效期：</div>
                  <div class="value">
                    {{
                      cell.isFixedTime
                        ? cell.useStartTime + ' - ' + cell.useEndTime + ' 有效'
                        : '领取后' + cell.day + '天内有效'
                    }}
                  </div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">优惠券情况</div>
              <ul class="list">
                <li class="item">
                  <div class="tips">已发放数量：</div>
                  <div class="value">{{ cell.issuedNum }}</div>
                </li>
                <li class="item">
                  <div class="tips">已使用数量：</div>
                  <div class="value">{{ cell.usedNum }}</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="px35" v-if="cell.category == 2 && stateForm.activeNames == 'two'">
            <el-table border ref="tableList" :cell-style="tableStyle?.cellStyle"
              :header-cell-style="tableStyle?.headerCellStyle" v-loading="stateForm.listLoading"
              :data="cell.productList" class="mt20">
              <el-table-column prop="id" label="ID" width="55"> </el-table-column>
              <el-table-column label="商品图" min-width="80">
                <template #default="scope">
                  <div class="demo-image__preview line-heightOne">
                    <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="name" label="商品名称" min-width="150" />
              <el-table-column prop="price" label="售价" min-width="90" />
              <el-table-column prop="stock" label="库存" min-width="70" />
            </el-table>
          </div>
          <div class="px35" v-if="cell.category == 6 && stateForm.activeNames == 'two'">
            <el-table border :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle"
              ref="tableList" :data="cell.merchantList" class="mt20">
              <el-table-column prop="categoryId" label="ID" min-width="55"> </el-table-column>
              <el-table-column label="商户头像" min-width="80">
                <template #default="scope">
                  <div class="demo-image__preview line-heightOne">
                    <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="name" label="商户名称" min-width="150" />
              <el-table-column label="商户类别" min-width="80">
                <template #default="scope">
                  <span>{{ selfTypeFilter[scope.row.isSelf] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-drawer>
      <el-dialog title="删除" v-model="stateForm.delShow" width="430px" :before-close="handleClose">
        <div>
          <el-radio v-model="stateForm.loseEfficacyStatus" :label="0">已领取的优惠券仍可正常使用</el-radio><br />
          <el-radio v-model="stateForm.loseEfficacyStatus" :label="1" class="mt20">同步删除已领取的优惠券，已领取的优惠券展示为已失效</el-radio>
        </div>
        <div class="acea-row row-right mt20 btnBottom">
          <el-button @click="stateForm.delShow = false">取消</el-button>
          <el-button type="primary" @click="confirmDelete">删除</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup name="couponIndex">
import { couponCategory, selfTypeFilter, receiveType } from '../enum.ts';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { couponDeleteApi, couponInfoApi, couponStatusApi, platformCouponListApi } from '/@/api/culture/marketing.ts';
import {
  productCategoryApi
} from '/@/api/culture/commodity/commodityList';


// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: platformCouponListApi,
  queryForm: {},
  dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const stateForm = reactive({
  listLoading: false,
  name: '',
  fromList: {
    title: '选择时间',
    custom: true,
    fromTxt: [
      { text: '全部', val: '' },
      { text: '今天', val: 'today' },
      { text: '昨天', val: 'yesterday' },
      { text: '最近7天', val: 'lately7' },
      { text: '最近30天', val: 'lately30' },
      { text: '本月', val: 'month' },
      { text: '本年', val: 'year' },
    ],
  },
  showInfo: false,
  delShow: false,
  loseEfficacyStatus: 0,
  tabPaneName: '更多',
  activeNames: 'one',
  showTab: false,
  loading: false,
});
const cell = reactive({})
const adminProductClassify = ref<any[]>([]);

onMounted(() => {
  getAdminProductClassify()
})
/** 平台商品分类 **/
const getAdminProductClassify = async () => {
  try {
    const { code, data, msg } = await productCategoryApi();
    if (code === 0) {
      adminProductClassify.value = data;
    } else {
      useMessage().error(msg);
    }
  } catch (error: any) {
    useMessage().error(error.msg);
  }
};
const onchangeIsShow = (row) => {
  couponStatusApi(row.id)
    .then(async () => {
      useMessage().success('修改成功');
    })
    .catch(() => {
      row.status = !row.status;
    });
};
const look = (id) => {

  stateForm.showTab = false;
  stateForm.activeNames = 'one';
  stateForm.loading = true;
  couponInfoApi(id)
    .then((data) => {
      const res = data.data
      if (res.category == 6) {
        stateForm.tabPaneName = '商户列表';
        stateForm.showTab = true;
      } else if (res.category == 2) {
        stateForm.tabPaneName = '商品列表';
        stateForm.showTab = true;
      }
      Object.assign(cell, res);
      stateForm.showInfo = true;
      stateForm.loading = false;
    })
    .catch(() => {
      stateForm.loading = false;
    });
};
// 删除
const handleDelete = (id) => {
  stateForm.rowId = id;
  stateForm.delShow = true;
};
// 列表
// const getList = (num) => {
//   this.tableFrom.page = num ? num : this.tableFrom.page;
//   this.tableFrom.name = encodeURIComponent(this.name);
//   this.listLoading = true;
//   platformCouponListApi(this.tableFrom)
//     .then((res) => {
//       this.tableData.data = res.records;
//       this.tableData.total = res.total;
//       this.listLoading = false;
//     })
//     .catch((res) => {
//       this.listLoading = false;
//     });
// };
// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields();
  getDataList();
};
const handleClose = () => {
  stateForm.showInfo = false;
  stateForm.delShow = false;
};
const confirmDelete = () => {
  couponDeleteApi({
    id: stateForm.rowId,
    loseEfficacyStatus: stateForm.loseEfficacyStatus,
  }).then(() => {
    useMessage().success('删除成功');
    stateForm.delShow = false;
    getDataList();
  }).catch((err) => {
    useMessage().error(err.msg);
  })
};
</script>

<style scoped lang="scss">
::v-deep.el-drawer__header {
  display: block !important;
}

::v-deep .el-table th.el-table__cell>.cell,
::v-deep.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
  padding-left: 15px;
}

.section {
  padding: 25px 0;
  border-bottom: 1px dashed #eeeeee;

  .title {
    padding-left: 10px;
    border-left: 3px solid #1890ff;
    font-size: 15px;
    line-height: 15px;
    font-weight: bold;
    color: #333;
  }

  .cell {
    font-size: 14px;
    color: #333;
    margin-top: 20px;
  }
}

::v-deep .el-tabs__content {
  display: none;
}

.full {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .order_icon {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    background-color: var(--prev-color-primary);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .iconfont {
    color: #fff;
    font-size: 35px;

    &.sale-after {
      color: #90add5;
    }
  }

  .text {
    align-self: center;
    flex: 1;
    min-width: 0;
    padding-left: 12px;
    font-size: 13px;
    color: #606266;

    .title {
      margin-bottom: 10px;
      font-weight: 500;
      font-size: 16px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.85);
    }

    .order-num {
      padding-top: 10px;
      white-space: nowrap;
    }
  }
}

.detailHead {
  padding: 0 24px 24px 35px;

  .headerBox {
    align-items: flex-start;
  }

  .full {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .order_icon {
      width: 60px;
      height: 60px;
      border-radius: 6px;
      background-color: var(--prev-color-primary);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .iconfont {
      color: #fff;
      font-size: 35px;

      &.sale-after {
        color: #90add5;
      }
    }

    .text {
      align-self: center;
      flex: 1;
      min-width: 0;
      padding-left: 12px;
      font-size: 13px;
      color: #606266;

      .title {
        margin-bottom: 10px;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        color: rgba(0, 0, 0, 0.85);
      }

      .order-num {
        padding-top: 10px;
        white-space: nowrap;
      }
    }
  }

  .list {
    display: flex;
    margin-top: 20px;
    overflow: hidden;
    list-style: none;
    padding: 0;

    .item {
      flex: none;
      width: 200px;
      font-size: 14px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.85);

      .title {
        margin-bottom: 12px;
        font-size: 13px;
        line-height: 13px;
        color: #666666;
      }

      .value1 {
        color: #f56022;
      }

      .value2 {
        color: #1bbe6b;
      }

      .value3 {
        color: var(--prev-color-primary);
      }

      .value4 {
        color: #6a7b9d;
      }

      .value5 {
        color: #f5222d;
      }
    }
  }
}

.px35 {
  padding: 0 35px;
}

.bdbtmSolid {
  border-bottom: 1px solid #f5f5f5;
}

.detailSection {
  padding: 25px 0;
  border-top: 1px dashed #eeeeee;

  :deep(.el-table__row) {
    padding-left: 15px !important;
  }

  .mt-16 {
    margin-top: -16px;
  }

  .title {
    padding-left: 10px;
    border-left: 3px solid var(--prev-color-primary);
    font-size: 15px;
    line-height: 15px;
    color: #303133;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
  }

  .lang {
    width: 100px;
    text-align: right;
  }

  .tips {
    width: 78px;
    text-align: right;
    font-size: 13px;
    color: #606266;
  }

  .item {
    flex: 0 0 calc(100% / 3);
    display: flex;
    margin-top: 16px;
    font-size: 13px;
    color: #606266;

    &:nth-child(3n + 1) {
      padding-right: 20px;
    }

    &:nth-child(3n + 2) {
      padding-right: 20px;
      //  padding-left: 10px;
    }

    &:nth-child(3n + 3) {
      //  padding-left: 20px;
    }
  }

  .value {
    flex: 1;
    color: #303133;

    image {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin: 0 12px 12px 0;
      vertical-align: middle;
    }
  }

  .item.pic {
    display: flex;

    img {
      width: 80px;
      height: 80px;
    }
  }
}
</style>
