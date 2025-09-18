<template>
	<div>
		<el-dialog title="订单详情" ref="myDialog" v-model="visible" width="50%" :close-on-click-modal="false" @close="closeDialog">
			<el-form :model="data" label-position="right" label-width="auto">
				<el-card class="mb-5">
					<el-form-item label="订单编号">{{ data.orderCode }}</el-form-item>
					<el-form-item label="业务类型">{{ orderTypeMap[data.orderType] }}</el-form-item>
					<el-form-item label="订单状态">{{ orderStatusMap[data.status] }}</el-form-item>
					<el-form-item label="退款状态">{{ refundStatusMap[data.refundStatus] }}</el-form-item>
					<el-form-item label="下单用户">{{ data.mobile }}</el-form-item>
					<el-form-item label="下单时间">{{ data.createTime }}</el-form-item>
					<el-form-item label="支付时间">{{ data.paymentTime }}</el-form-item>
					<el-form-item label="支付方式">{{ payTypeMap[data.type] }}</el-form-item>
					<el-form-item label="收款商户号" v-if="data.orderType == 2">{{ data.channelMchId }}</el-form-item>
					<el-form-item label="交易单号">{{ data.transactionId }}</el-form-item>
					<el-form-item label="取餐码" v-if="data.orderType == 2">{{ data.mealCode }}</el-form-item>
				</el-card>
				<el-card class="mb-5">
					<el-form-item label="商家">{{ data.merchantName }}</el-form-item>
					<el-form-item label="门店">{{ data.storeName }}</el-form-item>
					<el-table
						border
						v-if="data.orderType == 2"
						:data="data.orderDetails"
						class="mt8"
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
						size="small"
					>
						<el-table-column label="商品" prop="productName" />
						<el-table-column label="规格" prop="skuName" />
						<el-table-column label="单价" prop="price">
							<template #default="{ row }">
								<span>{{ row.price || 0 }}元</span>
							</template>
						</el-table-column>
						<el-table-column label="数量" prop="num" />
						<el-table-column label="小记" prop="payPrice">
							<template #default="{ row }">
								<span>￥{{ row.payPrice || 0 }}</span>
							</template>
						</el-table-column>
					</el-table>
					<div class="flex justify-end mt8 amount">
						<div class="label">订单总额</div>
						<div class="num">￥{{ data.paymentAmount || 0 }}</div>
						<div class="label">支付优惠</div>
						<div class="num">￥{{ data.discountAmount || 0 }}</div>
						<div class="label">实付金额</div>
						<div class="num" style="color: #f77110">￥{{ data.userPaymentAmount || 0 }}</div>
					</div>
					<div class="flex justify-end items-center mt16 amount">
						<div class="label" v-if="data.orderType === 2">已退款金额</div>
						<div class="num" v-if="data.orderType === 2">￥{{ data.refundTotalAmount || 0 }}</div>
						<el-button text bg style="margin-left: 50px" v-if="data.status === 2 || data.status === 5" @click="handleRefund">退款</el-button>
					</div>
				</el-card>
				<el-card v-if="data.orderType == 2 && data.orderLogs.length > 0">
					<div class="itemTitle">订单日志</div>
					<div class="item flex justify-start align-top" v-for="(item, index) of data.orderLogs" :key="index">
						<div class="item_label">{{ item.createTime }}</div>
						<div class="item_text">{{ item.changeMessage }}</div>
					</div>
				</el-card>
			</el-form>
		</el-dialog>

		<el-dialog v-model="refundVisible" ref="refundDialog" :show-close="false" width="500">
			<template #header="{ titleId, titleClass }">
				<div class="my-header">
					<div :id="titleId" class="flex">
						<div :class="titleClass">订单退款</div>
						<div class="subTitle">订单剩余金额<span>￥</span>{{ restAmount }}</div>
					</div>
				</div>
			</template>
			<el-form :model="refundform" ref="formRef" label-width="100px" :rules="formRules">
				<div style="margin-bottom: 18px">
					<el-form-item label="退款金额" prop="refundAmount">
						<el-input type="number" :max="restAmount" v-model="refundform.refundAmount" placeholder="输入退款金额" :step="0.01" />
					</el-form-item>
				</div>
				<el-form-item label="备注">
					<el-input v-model="refundform.remark" placeholder="输入备注（选填）" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="resetForm(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { orderDetail, getRestAmount, refundOrder, cancelOrder } from '/@/api/goodStore/order';
import { orderTypeMap, orderStatusMap, payTypeMap, refundStatusMap } from './enum';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';

const emit = defineEmits(['refresh']);

const visible = ref(false);
const formRef = ref();
const refundVisible = ref(false);
const refundDialog = ref(null);
const refundform = ref({
	refundAmount: '',
	remark: '',
});
const restAmount = ref(0);

const Timer = ref();
//   表单校验规则
const formRules = reactive<FormRules>({
	refundAmount: [
		{ required: true, message: '退款金额不能为空' },
		{
			validator: (rule, value, callback) => {
				if (!/^(?!0\.00$)(?!0$)\d+(\.\d{1,2})?$/.test(value)) {
					callback(new Error(`必须是数字，且最多输入两位小数，范围在${restAmount.value}`));
				} else if (value > restAmount.value) {
					callback(new Error('退款金额不能大于剩余退款金额'));
				} else {
					callback();
				}
			},
			trigger: ['blur', 'change'],
		},
	],
});

//  table hook
const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});
const { tableStyle } = useTable(state);
const data = ref<any>({});

watch(
	() => refundform.value.refundAmount,
	(newVal) => {
		if (parseFloat(newVal) > restAmount.value) {
			refundform.value.refundAmount = restAmount.value.toString();
		}
	}
);

const openDialog = async (row: any) => {
	try {
		let res = await orderDetail(row.orderCode);
		if (res.code === 0) {
			data.value = res.data;
			visible.value = true;
		}
	} catch (err: any) {
		console.log('err', err);
	}
};

const upDataOrder = async (row: any) => {
	if (row.orderCode) {
		try {
			let res = await orderDetail(row.orderCode);
			if (res.code === 0) {
				data.value = Object.assign(row, res.data);
			}
		} catch (err: any) {
			// useMessage().error(err);
		}
	}
};

const handleRefund = () => {
	if (data.value.orderType === 2) {
		refundVisible.value = true;
		getRestAmount(data.value.orderCode).then((res) => {
			if (res.code === 0) {
				restAmount.value = res.data;
			}
		});
	} else {
		ElMessageBox.confirm(`撤销后将原路退回已支付费用`, '确认撤销交易单？', {
			confirmButtonText: '确认撤销',
			cancelButtonText: '取消',
			type: 'warning',
		})
			.then(() => {
				cancelOrder({
					orderCode: data.value.orderCode,
				})
					.then((res) => {
						useMessage().success('撤销成功');
						visible.value = false;
					})
					.catch((err) => {
						useMessage().error(err.msg);
					});
			})
			.catch(() => {});
	}
};

// 取消
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	refundform.value = {
		refundAmount: '',
		remark: '',
	};
	refundVisible.value = false;
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		// 处理提交参数
		if (valid) {
			try {
				const { refundAmount, remark } = refundform.value;
				const params = {
					orderCode: data.value.orderCode,
					amount: refundAmount,
					original: 1,
					remark,
				};
				const { code, msg } = await refundOrder(params);
				if (code === 0) {
					useMessage().success('退款成功');
					Timer.value = setInterval(() => {
						upDataOrder(data.value);
					}, 1000);
					resetForm(formEl);

					// visible.value = false;
				} else {
					// useMessage().error(msg);
					console.log('msg', msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};

const closeDialog = () => {
	emit('refresh');
	if (Timer.value) {
		clearInterval(Timer.value);
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.scope-list {
	display: flex;
	flex-direction: column;
	width: 314px;
	flex-wrap: nowrap;

	border: 2px solid #efefef;
	padding: 10px;

	.add-btn {
		display: flex;
		align-items: center;
		color: #165dff;
		cursor: pointer;
	}

	.list {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.el-icon {
			cursor: pointer;
		}

		&:hover {
			color: #165dff;
		}
	}
}
.amount {
	font-size: 14px;
	color: #3d3d3d;
	.label {
		margin-left: 50px;
		white-space: nowrap;
	}
	.num {
		margin-left: 20px;
	}
}
.subTitle {
	margin-left: 18px;
	font-size: 14px;
	color: #767676;
	span {
		margin: 0 4px;
	}
}
.my-header {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: 16px;
}
.itemTitle {
	font-family: Source Han Sans;
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	margin-bottom: 13px;
}
.item {
	line-height: 22px;
	margin-bottom: 10px;
	font-size: 14px;
	color: #3d3d3d;
	.item_label {
		margin-right: 32px;
	}
	.item_text {
		flex: 1;
	}
}
:deep {
	.el-form-item.el-form-item--default {
		margin-bottom: 0 !important;
	}
}
</style>
