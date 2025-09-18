<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="售后单号" prop="refundOrderNo">
						<el-input placeholder="请输入售后单号" v-model="state.queryForm.refundOrderNo" clearable />
					</el-form-item>
					<el-form-item label="订单号" prop="orderNo">
						<el-input placeholder="请输入订单号" v-model="state.queryForm.orderNo" clearable />
					</el-form-item>
					<el-form-item label="下单手机号" prop="telephone">
						<el-input placeholder="请输入下单手机号" v-model="state.queryForm.telephone" clearable />
					</el-form-item>
					<el-form-item label="售后单状态" prop="refundStatus">
						<el-select v-model="state.queryForm.refundStatus" clearable @change="getDataList">
							<el-option v-for="(item, index) in afterSaleStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="售后单号" prop="refundOrderNo" width="240" show-overflow-tooltip>
					<template #default="{ row }">{{ row.refundOrderNo || '——' }}</template>
				</el-table-column>
				<el-table-column label="发起时间" prop="createTime" width="160">
					<template #default="{ row }">{{ row.createTime || '——' }}</template>
				</el-table-column>
				<el-table-column label="订单号" prop="orderNo" width="240" show-overflow-tooltip>
					<template #default="{ row }">{{ row.orderNo || '——' }}</template>
				</el-table-column>
				<el-table-column label="下单手机号" prop="telephone" width="120">
					<template #default="{ row }">{{ row.telephone || '——' }}</template>
				</el-table-column>
				<el-table-column label="售后类型" prop="refundReasonWap" width="120">
					<!-- <template #default="{ row }">{{ row.afterSalesType === 1 ? '仅退款' : row.afterSalesType === 2 ? '退货退款' : '——' }}</template> -->
					<template #default="{ row }">{{ row.refundReasonWap || '——' }}</template>
				</el-table-column>
				<el-table-column label="售后状态" prop="refundStatus" width="120">
					<template #default="{ row }">{{ afterSaleStatusMap[row.refundStatus] || '——' }}</template>
				</el-table-column>
				<el-table-column label="审核人" prop="auditName">
					<template #default="{ row }">{{ row.auditName || '——' }}</template>
				</el-table-column>
				<el-table-column label="审核时间" prop="auditTime" width="180">
					<template #default="{ row }">{{ row.auditTime || '——' }}</template>
				</el-table-column>
				<el-table-column label="退款金额（元）" prop="refundPrice" width="150">
					<template #default="{ row }">{{ row.refundPrice || '——' }}</template>
				</el-table-column>
				<el-table-column label="退款状态" prop="refundStatus" width="120">
					<template #default="{ row }">{{ refundStatusMap[row.refundStatus] || '——' }}</template>
				</el-table-column>
				<el-table-column label="退款时间" prop="refundTime" width="160">
					<template #default="{ row }">{{ row.refundTime || '——' }}</template>
				</el-table-column>
				<el-table-column label="操作" width="160" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleDetail(row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-afterSalesList">
import { BasicTableProps, useTable } from '/@/hooks/table';

import { afterSaleStatusMap, refundStatusMap } from './constant';
import { refundOrderPage } from '/@/api/ad/afterSellOrder';
import { afterSaleStatusList } from './enums';
const router = useRouter();

// 搜索变量
const queryRef = ref();

const createTime = ref([]);
const refundTime = ref([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: refundOrderPage,
	queryForm: {
		orderType: 8,
	},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

watch(
	() => createTime.value,
	(val) => {
		if (val) {
			state.queryForm.createTimeStart = val[0];
			state.queryForm.createTimeEnd = val[1];
		} else {
			state.queryForm.createTimeStart = '';
			state.queryForm.createTimeEnd = '';
		}
	}
);

watch(
	() => refundTime.value,
	(val) => {
		if (val) {
			state.queryForm.refundTimeStart = val[0];
			state.queryForm.refundTimeEnd = val[1];
		} else {
			state.queryForm.refundTimeStart = '';
			state.queryForm.refundTimeEnd = '';
		}
	}
);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	createTime.value = [];
	refundTime.value = [];
	state.queryForm.createTimeStart = '';
	state.queryForm.createTimeEnd = '';
	state.queryForm.refundTimeStart = '';
	state.queryForm.refundTimeEnd = '';
	getDataList();
};

const handleDetail = async (row: any) => {
	router.push({
		path: '/ad/orderManage/afterSalesList/form',
		query: {
			refundOrderNo: row.refundOrderNo,
			orderNo: row.orderNo,
		},
	});
};
</script>
