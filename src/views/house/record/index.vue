<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row class="justify-between">
        <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model.trim="state.queryForm.projectName" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="contact">
            <el-input v-model.trim="state.queryForm.contact" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="客户电话" prop="contactPhone">
            <el-input v-model.trim="state.queryForm.contactPhone" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="看房日期">
            <el-date-picker v-model="timeDay" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" unlink-panels type="daterange" @change="onChangeData" />
          </el-form-item>
          <el-form-item label="预约时间">
            <el-time-picker v-model="timeVal" placeholder="请选择预约时间" is-range range-separator="-"
              start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm:ss" @change="onChangeTime" />
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList" icon="search" type="primary">查询</el-button>
            <el-button @click="resetQuery" icon="Refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="mb8 flex items-center">
        <div class="mb8" style="width: 100%">
          <el-button @click="exports" type="primary">导出</el-button>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="stateForm.loading" row-key="id" border
        :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="contact" label="看房客户姓名" />
        <el-table-column prop="contactPhone" label="看房客户电话" />
        <el-table-column prop="visitingDate" label="看房时间">
          <template #default="{ row }">
            <span v-if="row.visitingDate">{{ row.visitingDate}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiveStartTime" label="预约时间">
          <template #default="{ row }">
            <span v-if="row.startTime && row.endTime">{{ row.startTime + '-' + row.endTime }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="createPhone" label="预约用户电话"> </el-table-column>
        <el-table-column label="预约状态" fixed="right">
          <template #default="{ row }">
            <el-tag v-if="row.status == 1">已预约</el-tag>
            <el-tag v-if="row.status == 2">已取消</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
    </div>
  </div>
</template>
<script lang="ts" setup name="groupBuyingIndex">
import dayjs from 'dayjs';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getHouseList, exportHouse } from '/@/api/house';
import { handleBlobFile } from '/@/utils/other';
const timeDay = ref()
const timeVal = ref();

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: getHouseList,
  queryForm: {},
  dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const stateForm = reactive({
  loading: false,
});
// 导出
const exports = () => {
  console.log(state, '<<<<')
  let data = {
    current: state.pagination?.current,
    size: state.pagination?.current,
    ...state.queryForm,
  }
  console.log(data, '----data')
  exportHouse(data).then((res) => {
    handleBlobFile(res, '预约看房记录.xlsx');
  });
};
const onChangeData = (val: any) => {
  console.log('val', val);
  if (val) {
    timeDay.value = val;
    state.queryForm.startDate = `${val[0]}`;
    state.queryForm.endDate = `${val[1]}`;
  }
};
// 日期选择
const onChangeTime = (val: any) => {
  if (val) {
    timeVal.value = val;
    state.queryForm.startTime = `${val[0]}`;
    state.queryForm.endTime = `${val[1]}`;
  }
};

// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields();
  timeDay.value = [];
  timeVal.value = [];
  state.queryForm.startTime = '';
  state.queryForm.endTime = '';
  state.queryForm.startDate = '';
  state.queryForm.endDate = '';
  getDataList();
};
</script>

<style scoped lang="scss"></style>
