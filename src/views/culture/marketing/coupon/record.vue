<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row class="justify-between">
        <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
          <el-form-item label="优惠券名" prop="name">
            <el-input v-model.trim="state.queryForm.name" placeholder="请输入优惠券名称" style="width: 180px;" clearable />
          </el-form-item>
          <el-form-item label="用户信息" prop="nickname">
            <el-input v-model.trim="state.queryForm.nickname" placeholder="请输入用户信息" style="width: 180px;" clearable />
          </el-form-item>
          <el-form-item label="使用状态" prop="status">
            <el-select v-model="state.queryForm.status" placeholder="请选择使用状态" clearable style="width: 180px;">
              <el-option label="已使用" :value="1"></el-option>
              <el-option label="未使用" :value="0"></el-option>
              <el-option label="已失效" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList" icon="search" type="primary">查询</el-button>
            <el-button @click="resetQuery" icon="Refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border :cell-style="tableStyle?.cellStyle"
        :header-cell-style="tableStyle?.headerCellStyle">
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column prop="name" label="优惠券名称" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="user" label="用户信息" min-width="140">
          <template #default="scope">
            <div>{{ scope.row.nickname }}/{{ scope.row.uid }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="面值" min-width="60" />
        <el-table-column prop="minPrice" label="最低消费额" min-width="90" />
        <el-table-column prop="startTime" label="使用有效期" min-width="150">
          <template #default="scope">
            <div v-if="scope.row.startTime">
              {{ scope.row.startTime }} -<br />
              {{ scope.row.endTime }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="使用范围" min-width="90">
          <template #default="scope">
            <span>{{ couponCategory[scope.row.category] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiveType" label="领取方式" min-width="100">
          <template #default="scope">
            <span>{{ receiveType[scope.row.receiveType] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领取时间" min-width="150">
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="使用状态" min-width="90">
          <template #default="scope">
            <el-tag class="endTag tag-background" v-if="scope.row.status == 1">已使用</el-tag>
            <el-tag class="doingTag tag-background" v-else-if="scope.row.status == 0">未使用</el-tag>
            <el-tag class="notStartTag tag-background" v-else>已失效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用时间" min-width="150">
          <template #default="scope">
            <span>{{ scope.row.useTime || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
    </div>
  </div>
</template>

<script lang="ts" setup name="couponRecord">
import { couponCategory, receiveType } from '../enum.ts'
import { couponUserListApi } from '/@/api/culture/marketing';

import { BasicTableProps, useTable } from '/@/hooks/table';



// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: couponUserListApi,
  queryForm: {},
  dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields();
  getDataList();
};


</script>
<style scoped lang="scss"></style>
