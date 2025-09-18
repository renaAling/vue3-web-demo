<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row>
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item label="内容类型">
            <el-select v-model="state.queryForm.type" placeholder="请选择">
              <el-option v-for="item in centerList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
          </el-form-item>
          <el-form-item label="商家名称">
            <el-input placeholder="请输入" maxlength="30" v-model="state.queryForm.storeName" clearable />
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input placeholder="请输入" maxlength="30" v-model="state.queryForm.nickName" clearable />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
							v-model="daterangeTime"
							@change="changeTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
          </el-form-item>
            <el-form-item label="状态">
            <el-select v-model="state.queryForm.status" placeholder="请选择">
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">查询</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border
        :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="内容类型" prop="type">
          <template #default="scope">
            <span v-if="scope.row.type == 1">笔记</span>
            <span v-else-if="scope.row.type == 2">评论</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content" show-overflow-tooltip />
        <el-table-column label="商家名称" prop="storeName" show-overflow-tooltip />
        <el-table-column label="用户昵称" prop="nickName" />
        <el-table-column label="提交时间" prop="createTime" />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <span v-if="scope.row.status == 2">高风险</span>
            <span v-else-if="scope.row.status == 3">已通过</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="auditReason"  show-overflow-tooltip />
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { automaticReviewPageApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';
// 引入组件
const stores = travelCommunalData();
const queryRef = ref();
const centerList = ref<any[]>([
  { label: '笔记', value: 1 },
  { label: '评论', value: 2 },
]);
const statusList = ref<any[]>([
  { label: '高风险', value: 2 },
  { label: '已通过', value: 3 },
])
const daterangeTime = ref<string[]>([]);
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    original: 1, // 复核列表不传，自动审核列表传1
  },
  pageList: automaticReviewPageApi,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

onMounted(async () => {
  if (Session.get('state')) {
    const data = JSON.parse(Session.get('state'));
    state.queryForm = data.queryForm;
    state.pagination = data.pagination;
    Session.remove('state');
  }
  if (stores.regionCodeList.length < 1) {
    await stores.getRegionCodeList();
  }
});
// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields();
  daterangeTime.value = [];
  state.queryForm = {};
  state.queryForm.original = 1;
  getDataList();
};

</script>
