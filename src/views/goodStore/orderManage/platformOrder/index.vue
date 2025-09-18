<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="商家ID" prop="merchantCode">
						<el-input placeholder="请输入商家ID" v-model="state.queryForm.merchantCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="商家名称" prop="merchantName">
						<el-input placeholder="请输入商家名称" v-model="state.queryForm.merchantName" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="门店ID" prop="storeCode">
						<el-input placeholder="请输入门店ID" v-model="state.queryForm.storeCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="门店名称" prop="storeName">
						<el-input placeholder="请输入门店名称" v-model="state.queryForm.storeName" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="下单用户" prop="mobile">
						<el-input placeholder="请输入下单用户手机号" v-model="state.queryForm.mobile" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="订单编号" prop="orderCode">
						<el-input placeholder="请输入订单编号" v-model="state.queryForm.orderCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="业务类型" prop="orderType">
						<el-select placeholder="请选择业务类型" v-model="state.queryForm.orderType" clearable style="width: 230px">
							<el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单状态" prop="status">
						<el-select placeholder="请选择订单状态" v-model="state.queryForm.status" clearable style="width: 230px">
							<el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="退款状态" prop="refundStatus">
						<el-select placeholder="请选择退款状态" v-model="state.queryForm.refundStatus" clearable style="width: 230px">
							<el-option v-for="(item, index) in refundStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间" prop="createTime">
						<el-date-picker
							v-model="createTime"
							type="datetimerange"
							range-separator="-"
							style="width: 400px"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							clearable
						/>
					</el-form-item>
					<el-form-item label="支付时间" prop="paymentTime">
						<el-date-picker
							v-model="paymentTime"
							type="datetimerange"
							range-separator="-"
							style="width: 400px"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							clearable
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
					<el-button plain @click="handleDownload" class="ml10" icon="download" type="primary"> 下载 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="订单编号" prop="orderCode" show-overflow-tooltip />
				<el-table-column label="商家名称" prop="merchantName" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.merchantName }}({{ row.merchantCode }})</span>
					</template>
				</el-table-column>
				<el-table-column label="门店名称" prop="storeName" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.storeName }}({{ row.storeCode }})</span>
					</template>
				</el-table-column>
				<el-table-column label="下单用户手机号" prop="mobile" width="150" />
				<el-table-column label="业务类型" prop="orderType">
					<template #default="{ row }">
						<el-tag v-if="row.orderType === 1">到店支付</el-tag>
						<el-tag v-else-if="row.orderType === 2">网订店取</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="订单金额（元）" prop="paymentAmount" />
				<el-table-column label="优惠金额（元）" prop="discountAmount" />
				<el-table-column label="实付金额（元）" prop="userPaymentAmount" />
				<el-table-column label="订单状态" prop="status">
					<template #default="{ row }">
						<el-tag v-if="row.status === 1">待支付</el-tag>
						<el-tag v-else-if="row.status === 2">已完成</el-tag>
						<el-tag v-else-if="row.status === 3">已退款</el-tag>
						<el-tag v-else-if="row.status === 4">已取消</el-tag>
						<el-tag v-else-if="row.status === 5">订餐成功</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="退款状态" prop="refundStatus">
					<template #default="{ row }">
						<el-tag v-if="row.refundStatus === 1">未退款</el-tag>
						<el-tag v-else-if="row.refundStatus === 2">部分退款</el-tag>
						<el-tag v-else-if="row.refundStatus === 3">已退款</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="支付方式" prop="type" show-overflow-tooltip>
					<template #default="{ row }">
						<el-tag v-if="row.type === 1">微信小程序</el-tag>
						<el-tag v-else-if="row.type === 6">员工卡支付</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="交易单号" prop="transactionId" show-overflow-tooltip />
				<el-table-column label="商户号" prop="channelMchId" show-overflow-tooltip />
				<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip />
				<el-table-column label="支付时间" prop="paymentTime" show-overflow-tooltip />
				<el-table-column label="操作" width="120" align="left">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('detail', row)">查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="outletList" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getOrderList } from '/@/api/goodStore/order';
import router from '/@/router';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { downFileAddTask } from '/@/utils/other';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const paymentTime = ref([]);
const createTime = ref([]);

const orderTypeList = [
	{
		label: '到店支付',
		value: 1,
	},
	{
		label: '网订店取',
		value: 2,
	},
];

const orderStatusList = [
	{
		label: '待支付',
		value: 1,
	},
	{
		label: '已完成',
		value: 2,
	},
	{
		label: '已退款',
		value: 3,
	},
	{
		label: '已取消',
		value: 4,
	},
	{
		label: '订餐成功',
		value: 5,
	},
];

const refundStatusList = [
	{
		label: '未退款',
		value: 1,
	},
	{
		label: '部分退款',
		value: 2,
	},
	{
		label: '已退款',
		value: 3,
	},
];

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getOrderList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

watch(
	() => [paymentTime.value, createTime.value],
	([valPayment, valCreate]) => {
		if (!valPayment) {
			state.queryForm.paymentTimeStart = '';
			state.queryForm.paymentTimeEnd = '';
		} else {
			state.queryForm.paymentTimeStart = valPayment[0];
			state.queryForm.paymentTimeEnd = valPayment[1];
		}
		if (!valCreate) {
			state.queryForm.createTimeStart = '';
			state.queryForm.createTimeEnd = '';
		} else {
			state.queryForm.createTimeStart = valCreate[0];
			state.queryForm.createTimeEnd = valCreate[1];
		}
	}
);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [];
	createTime.value = [];
	state.queryForm.createTimeStart = '';
	state.queryForm.createTimeEnd = '';
	state.queryForm.paymentTimeStart = '';
	state.queryForm.paymentTimeEnd = '';
	getDataList();
};

const handleCommand = async (command: Table.Command, row: any) => {
	switch (command) {
		case 'detail':
			formDialogRef.value.openDialog(row);
			break;
	}
};
const handleDownload = async () => {
	const { merchantCode, merchantName, storeCode, storeName, mobile, orderCode, orderType, status, refundStatus } = state.queryForm;
	const query = {
		merchantCode,
		merchantName,
		storeCode,
		storeName,
		mobile,
		orderCode,
		orderType,
		status,
		refundStatus,
		paymentTimeStart: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[0] : '',
		paymentTimeEnd: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[1] : '',
		createTimeStart: createTime.value && createTime.value.length > 0 ? createTime.value[0] : '',
		createTimeEnd: createTime.value && createTime.value.length > 0 ? createTime.value[1] : '',
	};
	const { code } = await downFileAddTask('/mall/payment_order/export', query);
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
