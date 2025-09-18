<template>
	<div class="layout-padding">
		<div class="page_title mb8">订单管理</div>
		<el-card shadow="never" class="mb8" :body-style="{ paddingBottom: 0 }">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item label="订单编号" prop="orderNo">
					<el-input placeholder="请输入订单编号" v-model="state.queryForm.orderNo" clearable style="width: 230px" maxlength="50" />
				</el-form-item>
				<el-form-item label="商家名称" prop="merchantCode">
					<el-select
						v-model="state.queryForm.merchantCode"
						filterable
						remote
						reserve-keyword
						style="width: 230px"
						placeholder="请输入关键字查询搜索"
						:remote-method="(val: string) => getMerchantsList(val)"
						:loading="loading"
					>
						<el-option v-for="item in merchantsList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
					<!-- <el-input placeholder="请输入商家名称" v-model="state.queryForm.merchantName" clearable style="width: 230px" maxlength="50" /> -->
				</el-form-item>
				<el-form-item label="门店名称" prop="storeCode">
					<!-- <el-input placeholder="请输入门店名称" v-model="state.queryForm.storeCode" clearable style="width: 230px" maxlength="50" /> -->
					<el-select
						v-model="state.queryForm.storeCode"
						filterable
						remote
						reserve-keyword
						style="width: 230px"
						placeholder="请输入关键字查询搜索"
						:remote-method="(val: string) => getStoreList(val)"
						:loading="loading"
					>
						<el-option v-for="item in storeList" :key="item.value" :label="`${item.label}`" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="下单用户" prop="mobile">
					<el-input placeholder="请输入下单用户手机号" v-model="state.queryForm.mobile" clearable style="width: 230px" maxlength="50" />
				</el-form-item>
				<el-form-item label="订单类型" prop="type">
					<el-select v-model="state.queryForm.type" default-first-option clearable style="width: 230px" disabled>
						<el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
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
						range-separator="-"
						start-placeholder="请选择开始时间"
						end-placeholder="请选择结束时间"
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
				<el-form-item label="支付时间" prop="paymentTime">
					<el-date-picker
						v-model="paymentTime"
						type="daterange"
						range-separator="-"
						start-placeholder="请选择开始时间"
						end-placeholder="请选择结束时间"
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
					<el-button @click="resetQuery" icon="Refresh">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8 text-right" style="width: 100%">
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
				<el-table-column label="订单编号" prop="orderNo" />
				<el-table-column label="商家" prop="merchantName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="门店" prop="storeName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="下单用户" prop="mobile"> </el-table-column>
				<el-table-column label="订单类型" prop="type">
					<template #default="{ row }">
						<span>{{ formatOrderType(row.type) }}</span>
					</template>
				</el-table-column>
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
					<template #default="{ row }">
						<span>{{ row.paymentMethod == 1 ? '微信支付' : row.paymentMethod == 8 ? '员工卡' : '' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单状态" width="90" prop="status">
					<template #default="{ row }">
						<span>{{ formatOrderStatus(row.status) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="退款状态" width="90" prop="refundStatus">
					<template #default="{ row }">
						<span>{{ formatRefundStatus(row.refundStatus) }}</span>
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

<script lang="ts" name="outletList" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { merchantListApi } from '/@/api/trcomps/merchant';
import { orderPageApi } from '/@/api/trcomps/order';
import { storePageApi } from '/@/api/trcomps/store';
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
const merchantsList = ref<
	Array<{
		label?: string;
		value?: number | string;
	}>
>([]);
const storeList = ref<
	Array<{
		label?: string;
		value?: number | string;
	}>
>([]);

const loading = ref(false);
let keywords: any;
const getMerchantsList = async (query: string | undefined) => {
	if (keywords === query) return;
	keywords = query;
	loading.value = true;
	try {
		const params = {
			keywords: query,
			page: 1,
			limit: 20,
		};
		const { data, code, msg } = await merchantListApi(params);
		loading.value = false;
		if (code === 0) {
			const list = data?.records?.map((item: any) => {
				return {
					label: item.name,
					value: item.merchantCode,
				};
			});
			merchantsList.value = list;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		console.log('err', err);
		useMessage().error(err.msg);
	}
};
let storekeywords: any;
const getStoreList = async (query: string | undefined) => {
	if (storekeywords === query) return;
	storekeywords = query;
	loading.value = true;
	try {
		const params = {
			storeName: query,
			page: 1,
			limit: 20,
		};
		const { data, code, msg } = await storePageApi(params);
		loading.value = false;
		if (code === 0) {
			const list = data?.records?.map((item: any) => {
				return {
					label: item.storeName,
					value: item.storeCode,
				};
			});
			storeList.value = list;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 订单类型枚举
const orderTypeList = ref([
	{
		label: '全部',
		value: '',
	},
	{
		label: '到店支付',
		value: '1',
	},
	{
		label: '网订店取',
		value: '7',
	},
]);

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
		label: '待收货',
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

// 格式化订单类型
const formatOrderType = (type: any) => {
	const obj = orderTypeList.value.find((item) => item.value === type);
	return obj?.label || '网订店取';
};
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
		state.queryForm.payTimeStart = valPayment[0];
		state.queryForm.payTimeEnd = valPayment[1];
		state.queryForm.orderTimeStart = valCreate[0];
		state.queryForm.orderTimeEnd = valCreate[1];
		console.log('state.queryForm', state.queryForm);
	}
);
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
		paymentTimeStart: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[0] : null,
		paymentTimeEnd: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[1] : null,
		orderTimeStart: createTime.value && createTime.value.length > 0 ? createTime.value[0] : null,
		orderTimeEnd: createTime.value && createTime.value.length > 0 ? createTime.value[1] : null,
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
	getMerchantsList('');
});
</script>
<style lang="scss" scoped>
.page_title {
	font-size: 18rpx;
	font-weight: bold;
}
</style>
