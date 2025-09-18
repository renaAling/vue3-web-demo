<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="支付单号" prop="orderCode">
						<el-input placeholder="请输入支付单号" v-model="state.queryForm.orderCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="门店ID" prop="storeCode">
						<el-input placeholder="请输入门店ID" v-model="state.queryForm.storeCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="订单状态" prop="status">
						<el-select v-model="state.queryForm.status" default-first-option clearable style="width: 230px">
							<el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
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
				<el-table-column label="支付单号" prop="orderCode" />
				<el-table-column label="收款门店" prop="storeName" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.storeName }}({{ row.storeCode }})</span>
					</template>
				</el-table-column>
				<el-table-column label="支付时间" prop="paymentTime" />
				<el-table-column label="订单状态" prop="status">
					<template #default="{ row }">
						<span v-if="row.status === 1">待支付</span>
						<span v-else-if="row.status === 2">已支付</span>
						<span v-else-if="row.status === 3">已退款</span>
						<span v-else>已取消</span>
					</template>
				</el-table-column>
				<el-table-column label="支付方式" prop="type">
					<template #default="{ row }">
						<span>{{ row.type == 1 ? '微信支付' : '员工卡' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="应付金额（元）" prop="paymentAmount" />
				<el-table-column label="优惠金额（元）" prop="discountAmount" />
				<el-table-column label="实付金额（元）" prop="userPaymentAmount" />
				<el-table-column label="预估收入（元）" prop="estimateIncome" />
				<el-table-column label="操作" width="240" align="left">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('detail', row)">详情</el-button>
						<el-button type="primary" v-if="row.status === 2 && row.isShowRevoke" link @click="handleCommand('revoke', row)">撤销</el-button>
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
import { getOrderList, cancelOrder } from '/@/api/goodStore/order';
import { ElMessageBox } from 'element-plus';
import { downFileAddTask } from '/@/utils/other';
import { useMessageBox, useMessage } from '/@/hooks/message';
import router from '/@/router';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const paymentTime = ref([]);

// 订单状态枚举
const orderStatusList = ref([
	{
		label: '待支付',
		value: 1,
	},
	{
		label: '已支付',
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
]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getOrderList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

watch(
	() => paymentTime.value,
	(val) => {
		if (!val) {
			state.queryForm.paymentTimeStart = '';
			state.queryForm.paymentTimeEnd = '';
		} else {
			state.queryForm.paymentTimeStart = val[0];
			state.queryForm.paymentTimeEnd = val[1];
		}
	}
);
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [];
	state.queryForm.paymentTimeStart = '';
	state.queryForm.paymentTimeEnd = '';
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
					cancelOrder({
						orderCode: row.orderCode,
					})
						.then((res) => {
							useMessage().success('撤销成功');
							getDataList();
						})
						.catch((err) => {
							useMessage().error(err.msg);
						});
				})
				.catch(() => {
					// console.log('err', err);
				});
			break;
	}
};
const handleDownload = async () => {
	const { orderCode, merchantCode, storeCode, status } = state.queryForm;
	const query = {
		orderCode: orderCode,
		merchantCode: merchantCode,
		storeCode: storeCode,
		status: status,
		paymentTimeStart: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[0] : '',
		paymentTimeEnd: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[1] : '',
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
