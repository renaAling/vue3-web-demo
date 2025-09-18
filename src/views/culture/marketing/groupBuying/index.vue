<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="商品名称">
						<el-input v-model.trim="state.queryForm.keywords" placeholder="请输入商品名称" clearable></el-input>
					</el-form-item>
					<el-form-item label="活动状态">
						<el-select v-model="state.queryForm.groupBuyStatus" placeholder="请选择活动状态" clearable>
							<el-option label="待开始" :value="1"></el-option>
							<el-option label="进行中" :value="2"></el-option>
							<el-option label="已结束" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8 flex items-center">
				<router-link :to="{ path: '/culture/marketing/groupBuying/edit', query: { type: 'add' } }">
					<el-button icon="Plus" type="primary">添加拼团商品</el-button>
				</router-link>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="stateForm.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" min-width="50" />
				<el-table-column prop="name" :show-overflow-tooltip="true" label="商品名称" min-width="150" />
				<el-table-column prop="otPrice" label="原价" />
				<el-table-column prop="price" label="拼团价" />
				<el-table-column prop="groupBuyCount" label="拼团人数" />
				<el-table-column prop="groupBuyPartCount" label="参与人数">
					<template #default="scope">
						<span>{{ scope.row.groupBuyPartCount || 0 }}</span>
					</template>
        </el-table-column>
				<el-table-column prop="groupBuyStatus" label="活动状态">
					<template #default="scope">
						<span>{{ statusMap[scope.row.groupBuyStatus] }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="receiveStartTime" label="活动时间" min-width="150">
					<template #default="scope">
						<div v-if="scope.row.groupBuyEndTime">
              {{ dayjs(scope.row.groupBuyStartTime).format('YYYY-MM-DD') }} 至 {{ dayjs(scope.row.groupBuyEndTime).format('YYYY-MM-DD') }}
						</div>
						<span v-else>暂无</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" fixed="right">
					<template #default="scope">
						<el-switch
							v-model="scope.row.isShow"
							inline-prompt
							active-text="开"
							inactive-text="关"
							@change="onchangeIsShow(scope.row)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200" fixed="right">
					<template #default="scope">
            <div class="flex justify-center items-center">
              <router-link v-if="scope.row.groupBuyStatus !== 1" class="text-[#4785ea]" :to="{ path: '/culture/marketing/groupBuying/edit', query: { id: scope.row.id, type: 'check' } }">
                查看
              </router-link>
              <router-link v-if="scope.row.groupBuyStatus === 1" class="mx-[10px] text-[#4785ea]" :to="{ path: '/culture/marketing/groupBuying/edit', query: { id: scope.row.id, type: 'edit' } }">
                编辑
              </router-link>
              <el-button v-if="scope.row.groupBuyStatus === 1" text type="primary" @click="handleDelete(scope.row.id)">
                删除
              </el-button>
            </div>
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
import { useMessage, useMessageBox } from '/@/hooks/message';
import { productListApi, productDeleteApi, updateStatusApi } from '/@/api/culture/groupBuying';

// 拼团状态1：待开始，2：进行中，3：已结束
const statusMap: Record<number, string> = {
	1: '待开始',
	2: '进行中',
	3: '已结束',
};

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: productListApi,
	queryForm: {
    isGroupBuy: true
  },
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const stateForm = reactive({
	loading: false,
});
const onchangeIsShow = (row: any) => {
	updateStatusApi({ id: row.id, isShow: row.isShow})
		.then(async (res: any) => {
      if(res.ok) {
        useMessage().success('修改成功');
      } else {
        useMessage().error(res.msg);
        getDataList();
      }
		})
		.catch(() => {});
};
// 删除
const handleDelete = async(id: string) => {
  useMessageBox().confirm(`确认要删除该活动？`, '删除').then(async () => {
    productDeleteApi({ id }).then((res: any) => {
      if(res.ok) {
        useMessage().success('删除成功');
        getDataList();
      } else {
        useMessage().error(res.msg);
      }
    }).catch(() => {});
  }).catch(() => {});
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
  state.queryForm.keywords = '';
  state.queryForm.groupBuyStatus = '';
	getDataList();
};
</script>

<style scoped lang="scss"></style>
