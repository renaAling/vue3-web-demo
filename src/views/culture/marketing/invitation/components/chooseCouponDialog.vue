<template>
  <div class="chooseCouponDialog">
    <el-dialog 
      title="选择优惠券" 
      v-model="visible" 
      width="70%" 
      :close-on-click-modal="false"
      @closed="handleDialogClosed"
    >
      <el-form :inline="true" :model="state.queryForm" ref="queryRef" @submit.prevent>
        <el-form-item label="优惠券名称：">
          <el-input v-model.trim="state.queryForm.keywords" @keyup.enter="getDataList()" placeholder="请输入优惠券名称" />
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList" icon="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table
        ref="multipleTableRef"
        v-loading="state.loading"
        :data="state.dataList"
        row-key="id"
        border
        :cell-style="tableStyle?.cellStyle"
        :header-cell-style="tableStyle?.headerCellStyle"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true" fixed="left" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="优惠券名称" min-width="120" />
        <el-table-column label="使用范围" min-width="90">
          <template #default="{ row }">
            <span v-if="row.category === 1">店铺</span>
            <span v-if="row.category === 2">商品</span>
            <span v-if="row.category === 3">通用</span>
            <span v-if="row.category === 4">品类</span>
            <span v-if="row.category === 5">品牌</span>
            <span v-if="row.category === 6">跨店</span>
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
        <el-table-column label="使用门槛(元)" prop="minPrice" min-width="110">
          <template #default="{ row }">
            <span>{{ row.minPrice === 0 ? '不限制' : row.minPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效期限" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <div v-if="row.isFixedTime">
              {{ row.useStartTime + '一' + row.useEndTime }}
            </div>
            <div v-else>
              {{ row.day + '天' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="剩余数量" min-width="90">
          <template #default="{ row }">
            <span v-if="!row.isLimited">不限量</span>
            <span v-else> {{ row.lastTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否重复领取" min-width="110">
          <template #default="{ row }">
            {{ row.isRepeated ? '是' : '否' }}
          </template>
        </el-table-column>
      </el-table>

      <pagination 
        @current-change="currentChangeHandle" 
        @size-change="sizeChangeHandle" 
        v-bind="state.pagination" 
      />

      <template #footer>
        <div class="flex items-center">
          <span class="selected-count">已选 {{ currentSelected.length }} 项</span>
          <el-button @click="visible = false">取消</el-button>
          <el-button @click="submitForm" type="primary">保存选择</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { canSendListApi } from '/@/api/culture/commodity/commodityList';

interface Coupon {
  id: number;
  name: string;
  category: number;
  money: number;
  minPrice: number;
  isFixedTime: boolean;
  useStartTime?: string;
  useEndTime?: string;
  day?: number;
  isLimited: boolean;
  lastTotal?: number;
}

const props = defineProps({
  selectedCoupons: {
    type: Array as () => Coupon[],
    default: () => []
  }
});

const emit = defineEmits(['save']); // 修改为只在保存时触发事件

const queryRef = ref();
const multipleTableRef = ref();
const visible = ref(false);
const currentSelected = ref<Coupon[]>([]);
const initialized = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: canSendListApi,
  queryForm: {},
  dataList: [],
});

// table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 打开对话框时初始化选择状态
const openDialog = async () => {
  visible.value = true;
  await nextTick();
  
  // 重置选择状态
  multipleTableRef.value?.clearSelection();
  currentSelected.value = [...props.selectedCoupons];
  
  // 设置初始选中状态
  await nextTick();
  props.selectedCoupons.forEach(coupon => {
    const row = state.dataList?.find(item => item.id === coupon.id);
    if (row) {
      multipleTableRef.value?.toggleRowSelection(row, true);
    }
  });
  initialized.value = true;
};

const handleSelectionChange = (val: Coupon[]) => {
  if (!initialized.value) return;
  currentSelected.value = val;
};

// 对话框关闭时重置
const handleDialogClosed = () => {
  initialized.value = false;
};

// 保存选择
const submitForm = () => {
  // if (currentSelected.value.length === 0) {
  //   ElMessage.warning('请至少选择一张优惠券');
  //   return;
  // }
  emit('save', currentSelected.value); // 只在保存时触发事件
  visible.value = false;
};

defineExpose({
  openDialog,
});
</script>

<style lang="scss" scoped>
.selected-count {
  margin-right: auto;
  padding-left: 10px;
  color: #666;
}
</style>