<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="投放工单号" prop="workOrderCode">
						<el-input placeholder="请输入投放工单号" v-model="state.queryForm.workOrderCode" clearable />
					</el-form-item>
					<el-form-item label="工单状态" prop="status">
						<el-select v-model="state.queryForm.status" clearable @change="getDataList">
							<el-option v-for="(value, key) in afterSaleStatusMap" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="媒体名称" prop="productName">
						<el-input placeholder="请输入媒体名称" v-model="state.queryForm.productName" clearable />
					</el-form-item>
					<el-form-item label="用户手机号" prop="mobile">
						<el-input placeholder="请输入用户手机号" maxlength="11" v-model="state.queryForm.mobile" clearable />
					</el-form-item>
					<el-form-item label="订单号" prop="orderCode">
						<el-input placeholder="请输入订单号" v-model="state.queryForm.orderCode" clearable />
					</el-form-item>
					<el-form-item label="补款单号" prop="compOrderCode">
						<el-input placeholder="请输入补款单号" v-model="state.queryForm.compOrderCode" clearable />
					</el-form-item>
					<el-form-item label="退款单号" prop="refundOrderCode">
						<el-input placeholder="请输入退款单号" v-model="state.queryForm.refundOrderCode" clearable />
					</el-form-item>
					<el-form-item label="创建时间" prop="createTime">
						<el-date-picker
							v-model="createTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item label="上刊时间" prop="publishTime">
						<el-date-picker
							v-model="publishTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleDownload" class="ml10" icon="download" type="primary"> 下载工单 </el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="80" />
				<el-table-column label="工单号" prop="workOrderCode" width="220" />
				<el-table-column label="工单状态" prop="status" width="100">
					<template #default="{ row }">{{ afterSaleStatusMap[row.status] }}</template>
				</el-table-column>
				<el-table-column label="投放排期" prop="deliveryTime" width="160">
					<template #default="{ row }">{{ row.deliveryTime || '——' }}</template>
				</el-table-column>
				<el-table-column label="上刊时间" prop="publishTime" width="160">
					<template #default="{ row }">{{ row.publishTime || '——' }}</template>
				</el-table-column>
				<el-table-column label="媒体名称" prop="productName" width="150" show-overflow-tooltip>
					<template #default="{ row }">{{ row.productName || '——' }}</template>
				</el-table-column>
				<el-table-column label="用户手机号" prop="mobile" width="120">
					<template #default="{ row }">{{ row.mobile || '——' }}</template>
				</el-table-column>
				<el-table-column label="订单号" prop="orderCode" width="220">
					<template #default="{ row }">{{ row.orderCode || '——' }}</template>
				</el-table-column>
				<el-table-column label="订单金额(元)" prop="orderPrice" width="120">
					<template #default="{ row }">{{ row.orderPrice || '——' }}</template>
				</el-table-column>
				<el-table-column label="订单状态" prop="orderStatus" width="100">
					<template #default="{ row }">{{ orderStatusMap[row.orderStatus] || '——' }}</template>
				</el-table-column>
				<el-table-column label="补款单号" prop="compOrderCode" width="220">
					<template #default="{ row }">{{ row.compOrderCode || '——' }}</template>
				</el-table-column>
				<el-table-column label="补款金额(元)" prop="compOrderPrice" width="120">
					<template #default="{ row }">{{ row.compOrderPrice || '——' }}</template>
				</el-table-column>
				<el-table-column label="补款状态" prop="isComp" width="100">
					<template #default="{ row }">{{ row.isComp ? '已支付' : !row.isComp ? '未支付' : '——' }}</template>
				</el-table-column>
				<el-table-column label="退款单号" prop="refundOrderCode" width="220">
					<template #default="{ row }">{{ row.refundOrderCode || '——' }}</template>
				</el-table-column>
				<el-table-column label="退款金额(元)" prop="refundPrice" width="120">
					<template #default="{ row }">{{ row.refundPrice || '——' }}</template>
				</el-table-column>
				<el-table-column label="退款状态" prop="refundStatus" width="100">
					<template #default="{ row }">{{ refundStatusMap[row.refundStatus] || '——' }}</template>
				</el-table-column>
				<el-table-column label="操作" width="200" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleDetail(row)">查看详情</el-button>
						<el-button type="primary" link @click="dialogsRef.openDialog(row, 1)" v-if="row.status !== 10">关闭工单</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 弹窗 -->
		<Dialogs ref="dialogsRef" @refreshList="getDataList" />
	</div>
</template>

<script lang="ts" setup name="ad-adPlacement">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox } from '/@/hooks/message';
import { afterSaleStatusMap, refundStatusMap } from './constant';
import { orderStatusMap } from '../../orderManage/orderList/constant';
import { downFileAddTask } from '/@/utils/other';
import { workOrderPage } from '/@/api/ad/afterSellOrder';

const Dialogs = defineAsyncComponent(() => import('./dialogs.vue'));
const router = useRouter();
const dialogsRef = ref();
// 搜索变量
const queryRef = ref();
const createTime = ref([]);
const publishTime = ref([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: workOrderPage,
	queryForm: {},
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
	() => publishTime.value,
	(val) => {
		if (val) {
			state.queryForm.publishTimeStart = val[0];
			state.queryForm.publishTimeEnd = val[1];
		} else {
			state.queryForm.publishTimeStart = '';
			state.queryForm.publishTimeEnd = '';
		}
	}
);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	createTime.value = [];
	publishTime.value = [];
	state.queryForm.createTimeStart = '';
	state.queryForm.createTimeEnd = '';
	state.queryForm.publishTimeStart = '';
	state.queryForm.publishTimeEnd = '';
	getDataList();
};

const handleDetail = async (row: any) => {
	router.push({
		path: '/ad/orderManage/adPlacement/form',
		query: {
			workOrderCode: row.workOrderCode,
		},
	});
};
const handleDownload = async () => {
	const query = {
		...state.queryForm,
		publishTimeStart: publishTime.value && publishTime.value.length > 0 ? publishTime.value[0] : null,
		publishTimeEnd: publishTime.value && publishTime.value.length > 0 ? publishTime.value[1] : null,
		createTimeStart: createTime.value && createTime.value.length > 0 ? createTime.value[0] : null,
		createTimeEnd: createTime.value && createTime.value.length > 0 ? createTime.value[1] : null,
	};

	const { code } = await downFileAddTask('/tracomps-admin/api/admin/platform/export/workOrder/excels', query);
	if (code === 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
		router.push('/downloadCenter');
	}
};
</script>
