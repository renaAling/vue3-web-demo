<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="订单编号" prop="orderNo">
					<el-input placeholder="请输入订单编号" v-model="state.queryForm.orderNo" clearable style="width: 230px" maxlength="50" />
				</el-form-item>
				<el-form-item label="商家名称" prop="merchantCode">
					<el-select
						v-model="state.queryForm.merchantCode"
						filterable
						style="width: 230px"
						placeholder="请选择商家"
						clearable
						@change="merchantChange"
					>
						<el-option v-for="item in merchantsList" :key="item.merchantCode" :label="item.name" :value="item.merchantCode" />
					</el-select>
				</el-form-item>
				<el-form-item label="门店名称" prop="storeCode" v-if="state.queryForm.merchantCode">
					<el-select v-model="state.queryForm.storeCode" filterable style="width: 260px" placeholder="请选择门店" clearable>
						<el-option v-for="item in storeList" :key="item.storeCode" :label="item.storeName" :value="item.storeCode" />
					</el-select>
				</el-form-item>
				<el-form-item label="下单用户" prop="mobile">
					<el-input placeholder="请输入下单用户手机号" v-model="state.queryForm.mobile" clearable style="width: 230px" maxlength="50" />
				</el-form-item>
				<el-form-item label="订单状态" prop="orderStatus">
					<el-select v-model="state.queryForm.orderStatus" default-first-option clearable style="width: 230px">
						<el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="退款状态" prop="refundStatus">
					<el-select v-model="state.queryForm.refundStatus" default-first-option clearable style="width: 230px">
						<el-option v-for="(item, index) in refundStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="下单时间" prop="createTime">
					<el-date-picker
						v-model="createTime"
						type="daterange"
						style="width: 280px"
						range-separator="-"
						start-placeholder="请选择开始时间"
						clearable
						end-placeholder="请选择结束时间"
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
				<el-form-item label="支付时间" prop="paymentTime">
					<el-date-picker
						v-model="paymentTime"
						type="daterange"
						range-separator="-"
						style="width: 280px"
						start-placeholder="请选择开始时间"
						end-placeholder="请选择结束时间"
						clearable
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button plain @click="handleDownload" icon="download" type="primary"> 下载 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="订单编号" prop="orderNo" show-overflow-tooltip />
				<el-table-column label="商家" prop="merchantName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="门店" prop="storeName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="下单用户" prop="mobile"> </el-table-column>
				<el-table-column label="渠道总额" prop="channelTotalPrice">
					<template #default="{ row }">
						<span>{{ row.channelTotalPrice || 0 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单总额" prop="totalPrice">
					<template #default="{ row }">
						<span>{{ row.totalPrice || 0 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="优惠金额" prop="couponPrice">
					<template #default="{ row }">
						<span>{{ row.couponPrice || 0 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="实付金额" prop="payPrice">
					<template #default="{ row }">
						<span>{{ row.payPrice || 0 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="退款金额" prop="refundPrice">
					<template #default="{ row }">
						<span>{{ row.refundPrice || 0 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="支付方式" prop="paymentMethod">
					<template #default="{ row }" >
						<el-tag >{{ row.paymentMethod == 1 ? '微信支付' : row.paymentMethod == 8 ? '员工卡' : '' }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="订单状态" width="90" prop="status">
					<template #default="{ row }">
						<el-tag>{{ formatOrderStatus(row.status) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="退款状态" width="90" prop="refundStatus">
					<template #default="{ row }">
						<el-tag>{{ formatRefundStatus(row.refundStatus) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="60" align="left">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('detail', row)">详情</el-button>
						<!-- <el-button type="primary" v-if="row.status === 2" link @click="handleCommand('revoke', row)">撤销</el-button> -->
						<!-- <el-button type="primary" link @click="handleCommand('cancelRevoke', row)">取消撤销</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { merchantListApi } from '/@/api/trcomps/merchant';
import { orderPageApi } from '/@/api/trcomps/order';
import { storePageApi } from '/@/api/trcomps/store';
import { getQPMerchantsList, getCurrentStoresList } from '/@/api/goodStore/goods';
import { ElMessageBox } from 'element-plus';
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
const merchantsList = ref<Array<{ merchantCode: string; name: string }>>([]);
const storeList = ref<Array<{ storeName: string; storeCode: string }>>([]);
const getMerchantsList = () => {
	getQPMerchantsList().then((res) => {
		if (res.code === 0) {
			merchantsList.value = res.data;
		}
	});
};

// 订单状态枚举
const orderStatusList = ref([
	{
		label: '全部',
		value: '',
	},
	{
		label: '待支付',
		value: 0,
	},
	{
		label: '待出码',
		value: 1,
	},
	{
		label: '部分发货',
		value: 2,
	},
	{
		label: '待核销',
		value: 3,
	},
	{
		label: '订餐成功',
		value: 4,
	},
	{
		label: '已收货',
		value: 5,
	},
	{
		label: '已完成',
		value: 6,
	},
	{
		label: '已取消',
		value: 9,
	},
]);

const refundStatusList = ref([
	{
		label: '未退款',
		value: 0,
	},
	{
		label: '申请中',
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
]);

// 格式化订单状态
const formatOrderStatus = (status: any) => {
	const obj = orderStatusList.value.find((item) => item.value === status);
	return obj?.label || '--';
};
// 格式化退款状态
const formatRefundStatus = (status: any) => {
	const obj = refundStatusList.value.find((item) => item.value === status);
	return obj?.label || '--';
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: orderPageApi,
	queryForm: {
		type: '7',
	},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

watch(
	() => [paymentTime.value, createTime.value],
	([valPayment, valCreate]) => {
		console.log(valPayment, valCreate);
		if (!valPayment) {
			state.queryForm.payTimeStart = '';
			state.queryForm.payTimeEnd = '';
		}
		if (valPayment && valPayment[0]) {
			state.queryForm.payTimeStart = valPayment[0] + ' 00:00:00';
			state.queryForm.payTimeEnd = valPayment[1] + ' 23:59:59';
		}
		if (!valCreate) {
			state.queryForm.orderTimeStart = '';
			state.queryForm.orderTimeEnd = '';
		}
		if (valCreate && valCreate[0]) {
			state.queryForm.orderTimeStart = valCreate[0];
			state.queryForm.orderTimeEnd = valCreate[1];
		}
	}
);

const merchantChange = (val: any) => {
	state.queryForm.storeCode = '';
	if (val) {
		getCurrentStoresList(val).then((res) => {
			if (res.code === 0) {
				storeList.value = res.data;
			}
		});
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [];
	createTime.value = [];
	state.queryForm.payTimeStart = '';
	state.queryForm.payTimeEnd = '';
	state.queryForm.orderTimeStart = '';
	state.queryForm.orderTimeEnd = '';
	getDataList();
};

const handleCommand = async (command: Table.Command, row: any) => {
	switch (command) {
		case 'detail':
			formDialogRef.value.openDialog(row);
			break;
		case 'revoke':
			ElMessageBox.confirm(`撤销后将原路退回已支付费用`, '确认撤销交易单？', {
				confirmButtonText: '确认撤销',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					// cancelOrder({
					// 	orderCode: row.orderCode,
					// })
					// 	.then(() => {
					// 		useMessage().success('撤销成功');
					// 		getDataList();
					// 	})
					// 	.catch((err) => {
					// 		useMessage().error(err.msg);
					// 	});
				})
				.catch(() => {});
			break;
	}
};
const handleDownload = async () => {
	const { orderCode, merchantCode, storeCode, type, mobile, refundStatus, orderStatus } = state.queryForm;
	const query = {
		orderCode: orderCode, // 订单编号
		merchantCode: merchantCode, //商家
		storeCode: storeCode, //门店
		mobile: mobile, // 下单用户手机号
		type: type, // 订单类型
		refundStatus: refundStatus, // 退款状态
		status: orderStatus,
		payTimeStart: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[0] + ' 00:00:00' : null,
		payTimeEnd: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[1] + ' 23:59:59' : null,
		orderTimeStart: createTime.value && createTime.value.length > 0 ? createTime.value[0] + ' 00:00:00' : null,
		orderTimeEnd: createTime.value && createTime.value.length > 0 ? createTime.value[1] + ' 23:59:59' : null,
	};
	const { code } = await downFileAddTask('/tracomps-admin/api/admin/platform/export/order/excels', query);
	if (code === 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
		router.push('/downloadCenter');
	}
};
onMounted(() => {
	getMerchantsList();
});
</script>
<style lang="scss" scoped>
.page_title {
	font-size: 18rpx;
	font-weight: bold;
}
</style>
