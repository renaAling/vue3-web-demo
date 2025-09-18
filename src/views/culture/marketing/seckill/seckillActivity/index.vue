<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row>
        <el-form :inline="true"  :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
          
          <el-form-item label="活动名称"  prop="name">
            <el-input v-model="state.queryForm.name" placeholder="请输入活动名称" style="width: 180px" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动日期"  prop="date">
            <el-date-picker
							v-model="createTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							style="width: 380px"
						/>
          </el-form-item>
          <el-form-item label="活动状态" prop="status">
						<el-select v-model.trim="state.queryForm.status" clearable placeholder="请选择" >
							<el-option :label="item" :value="key" v-for="(item,key) in statusMap" :key="'status' + key" />
						</el-select>
					</el-form-item>
          <el-form-item>
            <el-button @click="getDataList" icon="search" type="primary">查询</el-button>
            <el-button @click="resetQuery" icon="Refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    
    <el-row>
      <div class="mb8" style="width: 100%">
        <router-link :to="{ path: '/culture/marketing/seckill/seckillActivity/creatSeckill' }">
          <el-button type="primary" icon="Plus" class="mr10">添加秒杀活动</el-button>
        </router-link>
      </div>
    </el-row>
    <el-table :data="state.dataList" v-loading="state.loading" row-key="id" border :cell-style="tableStyle.cellStyle"
      :header-cell-style="tableStyle.headerCellStyle">
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column prop="name" :show-overflow-tooltip="true" label="活动名称" min-width="150" />
      <el-table-column prop="productNum" label="商品数量" min-width="90" />
      <el-table-column prop="oneQuota" label="单次限购" min-width="90" />
      <el-table-column prop="allQuota" label="活动限购" min-width="90" />
      <!-- <el-table-column label="商家星级" min-width="140">
        <template #default="scope">
          <el-rate disabled v-model="scope.row.merStars"></el-rate>
        </template>
      </el-table-column> -->
      <el-table-column prop="status" label="活动状态" min-width="90">
        <template #default="scope">
          <el-tag class="notStartTag tag-background" v-if="scope.row.status == 0">未开始</el-tag>
          <el-tag class="doingTag tag-background" v-if="scope.row.status == 1">进行中</el-tag>
          <el-tag class="endTag tag-background" v-if="scope.row.status == 2">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="end_time" label="活动日期" min-width="180">
        <template #default="scope">
          <span>{{ scope.row.startDate }} - {{ scope.row.endDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="end_time" label="活动场次" min-width="110">
        <template #default="scope">
          <div v-for="(item, i) in scope.row.timeList" :key="i">{{ item }}<br /></div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="150" />
      <el-table-column label="活动开关" fixed="right" min-width="90">
        <template #default="scope">
          <el-switch v-model="scope.row.isOpen" inline-prompt :active-value="1" :inactive-value="0" active-text="开启"
            inactive-text="关闭" :disabled="scope.row.status === 2" @change="onchangeIsShow(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right">
        <template #default="scope">
          <router-link :to="{ path: '/culture/marketing/seckill/seckillActivity/creatSeckill', query:{id: scope.row.id, type:'add'}  }">
            <el-button text type="primary"> 添加商品 </el-button>
          </router-link>
          <router-link :to="{ path: '/culture/marketing/seckill/seckillActivity/creatSeckill', query:{id: scope.row.id, type:'edit'} }">
            <el-button text type="primary" class="mx-2"> 编辑 </el-button>
          </router-link>
          <el-button text type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { seckillActivityListApi, seckillAtivityDelApi, seckillAtivitySwitchApi } from '/@/api/culture/marketing';

const queryRef = ref();


const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: seckillActivityListApi,
  queryForm: {
    date: '',
    name: '',
  },
  dataList: [],
});
const statusMap = {
  0: '未开始',
  1: '进行中',
  2: '已结束',
};
const createTime = ref();
watch(
	() => createTime.value,
	(val) => {
		if (val) {
			state.queryForm.startDate = val[0];
			state.queryForm.endDate = val[1];
		} else {
			state.queryForm.createTimeStart = '';
			state.queryForm.endDate = '';
		}
	}
);
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const onchangeIsShow = (row: any) => {
  seckillAtivitySwitchApi(row.id)
    .then(() => {
      useMessage().success('操作成功');
      getDataList();
    })
    .catch((err) => { 
      useMessage().error(err.msg);
      row.isOpen = !row.isOpen;
    });
};
// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields();
  getDataList();
};
const handleDelete = async (ids: string) => {
  try {
    await useMessageBox().confirm('确认删除该条数据？');
  } catch {
    return;
  }
  try {
    await seckillAtivityDelApi(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};

</script>

<style scoped lang="scss">
/* ... */
</style>
