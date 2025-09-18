<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="订单号" prop="orderNo">
						<el-input placeholder="请输入订单号" v-model="state.queryForm.orderNo" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="媒体名称" prop="productName">
						<el-input placeholder="请输入媒体名称" v-model="state.queryForm.productName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="订单状态" prop="status">
						<el-select v-model="state.queryForm.status" clearable @change="getDataList">
							<el-option v-for="(value, key) in orderStatusMap" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="工单号" prop="workOrderNo">
						<el-input placeholder="请输入工单号" v-model="state.queryForm.workOrderNo" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="下单手机号" prop="mobile">
						<el-input placeholder="请输入下单手机号" v-model="state.queryForm.mobile" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="下单时间" prop="orderTime">
						<el-date-picker
							v-model="orderTime"
							@change="changeOrderTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item label="订单支付时间" prop="paymentTime">
						<el-date-picker
							v-model="paymentTime"
							@change="changePaymentTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
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
					<el-button @click="handleDownload" icon="download" type="primary">下载订单</el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="订单号" prop="orderNo" width="180">
					<template #default="{ row }">
						<span>{{ row.orderNo || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="媒体名称" prop="productName" width="180">
					<template #default="{ row }">
						<span>{{ row.productName || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="广告费" prop="publicationFee">
					<template #default="{ row }">
						<span>{{ row.publicationFee || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="数量" prop="totalNum">
					<template #default="{ row }">
						<span>{{ row.totalNum || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="上刊制作费" prop="productionCost" width="180">
					<template #default="{ row }">
						<span>{{ row.productionCost || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="运营商" prop="operator" width="180">
					<template #default="{ row }">
						<span>{{ row.operator || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单金额" prop="payPrice" width="100">
					<template #default="{ row }">
						<span>{{ row.payPrice || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单状态" prop="status" width="150">
					<template #default="{ row }">
						<span>{{ orderStatusMap[row.status] || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="下单时间" prop="createTime" width="180">
					<template #default="{ row }">
						<span>{{ row.createTime || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="支付状态" prop="paid">
					<template #default="{ row }">
						<span>{{ payStatusMap[row.paid] || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="支付时间" prop="payTime" width="180">
					<template #default="{ row }">
						<span>{{ row.payTime || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="工单编号" prop="workOrderNo" width="180">
					<template #default="{ row }">
						<span>{{ row.workOrderNo || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="工单状态" prop="workOrderStatus" width="180">
					<template #default="{ row }">
						<span>{{ workOrderStatusMap[row.workOrderStatus] || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="下单手机号" prop="mobile" width="120">
					<template #default="{ row }">
						<span>{{ row.mobile || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="退款状态" prop="refundStatus" width="120">
					<template #default="{ row }">
						<span>{{ refundStatusMap[row.refundStatus] || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="已退金额" prop="refundedAmount" width="140">
					<template #default="{ row }">
						<span :class="row.refundedAmount > 0 ? 'refundedAmount' : ''">{{ row.refundedAmount || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="300" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('orderDetail', row)">订单详情</el-button>
						<el-button type="primary" link @click="handleCommand('viewWorkOrder', row)" v-if="row.paid == 1">查看工单</el-button>
						<el-button
							type="primary"
							link
							@click="handleCommand('afterSalesService', row)"
							v-if="row.status == 4 || row.status == 5 || row.status == 6"
						>
							发起售后
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" title="发起售后" width="400" :show-close="false" :close-on-click-modal="false">
			<el-form ref="formRef" style="max-width: 600px" :model="afterSaleServiceForm" :rules="afterSaleServiceFormRules" label-width="auto">
				<el-form-item label="售后类型" prop="refundReasonWap">
					<el-select v-model="afterSaleServiceForm.refundReasonWap" placeholder="请选择售后类型" clearable>
						<el-option label="不想买了" value="不想买了" />
						<el-option label="无法在期望时间投放" value="无法在期望时间投放" />
					</el-select>
				</el-form-item>
				<el-form-item label="原因说明" prop="refundReasonWapExplain">
					<el-input
						v-model="afterSaleServiceForm.refundReasonWapExplain"
						clearable
						placeholder="请输入原因说明"
						type="textarea"
						resize="none"
						rows="8"
						maxlength="200"
						show-word-limit
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="handleCancel(formRef)"> 取消 </el-button>
					<el-button type="primary" @click="onSubmit(formRef)"> 发起售后 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup name="orderManage-orderList">
import type { FormInstance, FormRules } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { orderStatusMap, payStatusMap, workOrderStatusMap, refundStatusMap } from './constant';
import { downFileAddTask } from '/@/utils/other';
import { getOrdersList, applyAfterSale } from '/@/api/ad/orderManage';

const router = useRouter();

// 搜索变量
const queryRef = ref();
const paymentTime = ref([]);
const orderTime = ref([]);
const dialogVisible = ref(false);
const formRef = ref();
const orderNo = ref('');

// 发起售后form
const afterSaleServiceForm = reactive({
	refundReasonWap: '',
	refundReasonWapExplain: '',
});

// 发起售后formRules
const afterSaleServiceFormRules = reactive<FormRules>({
	refundReasonWap: [{ required: true, message: '售后类型不能为空' }],
	refundReasonWapExplain: [{ required: true, message: '原因不能为空' }],
});

// 查询操作
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getOrdersList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

watch(
	() => paymentTime.value,
	(val) => {
		if (val) {
			state.queryForm.paymentStartTime = val[0];
			state.queryForm.paymentEndTime = val[1];
		} else {
			state.queryForm.paymentStartTime = '';
			state.queryForm.paymentEndTime = '';
		}
	}
);

watch(
	() => orderTime.value,
	(val) => {
		if (val) {
			state.queryForm.startTime = val[0];
			state.queryForm.endTime = val[1];
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [];
	orderTime.value = [];
	state.queryForm.paymentStartTime = '';
	state.queryForm.paymentEndTime = '';
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};

const changeOrderTime = (val: any) => {
	if (!val) {
		state.queryForm.startTime = '';
		state.queryForm.endTime = '';
	}
	getDataList();
};
const changePaymentTime = (val: any) => {
	if (!val) {
		state.queryForm.paymentStartTime = '';
		state.queryForm.paymentEndTime = '';
	}
	getDataList();
};

// 取消
const handleCancel = async (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	dialogVisible.value = false;
};

//
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否发起售后？点击确认创建售后工单`, '发起售后');
			} catch {
				return false;
			}
			try {
				const { code, msg } = await applyAfterSale({
					orderNo: orderNo.value,
					refundReasonWap: afterSaleServiceForm?.refundReasonWap,
					refundReasonWapExplain: afterSaleServiceForm?.refundReasonWapExplain,
				});
				if (code === 0) {
					useMessage().success(`创建售后工单成功`);
					formEl?.resetFields();
					dialogVisible.value = false;
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};
// 下载订单
const handleDownload = async () => {
	const { orderNo, mobile, status, productName, workOrderNo } = state.queryForm;
	const query = {
		orderNo,
		mobile,
		status,
		productName,
		workOrderNo,
		paymentStartTime: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[0] : '',
		paymentEndTime: paymentTime.value && paymentTime.value.length > 0 ? paymentTime.value[1] : '',
		startTime: orderTime.value && orderTime.value.length > 0 ? orderTime.value[0] : '',
		endTime: orderTime.value && orderTime.value.length > 0 ? orderTime.value[1] : '',
	};
	const { code } = await downFileAddTask('/tracomps-admin/api/admin/platform/export/adOrder/excels', query);
	if (code === 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
		router.push('/downloadCenter');
	}
};

const handleCommand = (command: Table.Command, row: any) => {
	switch (command) {
		// 订单详情
		case 'orderDetail':
			router.push({
				path: `/ad/orderManage/orderList/form`,
				query: { orderNo: row.orderNo },
			});
			break;
		// 查看工单
		case 'viewWorkOrder':
			router.push({
				path: `/ad/orderManage/adPlacement/form`,
				query: { workOrderCode: row.workOrderNo },
			});
			break;
		// 发起售后
		case 'afterSalesService':
			dialogVisible.value = true;
			orderNo.value = row.orderNo;
			break;
	}
};
</script>
<style lang="scss" scoped>
.isPay,
.refundAmount {
	color: #4785ea;
}
</style>
