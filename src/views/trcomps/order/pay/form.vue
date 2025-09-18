<template>
	<div>
		<el-dialog title="订单详情" ref="myDialog" v-model="visible" width="50%" :close-on-click-modal="false" @close="closeDig">
			<el-form :model="data" label-position="right" label-width="auto">
				<el-card class="mb-5">
					<el-form-item label="订单编号">{{ data.orderNo }}</el-form-item>
					<el-form-item label="渠道订单编号">{{ data.outTradeNo }}</el-form-item>
					<el-form-item label="订单类型">{{ formatOrderType(data.type) }}</el-form-item>
					<el-form-item label="订单状态">{{ formatOrderStatus(data.status) }}</el-form-item>
					<el-form-item label="退款状态">{{ formatRefundStatus(data.refundStatus) }}</el-form-item>
					<el-form-item label="下单用户">{{ data.mobile }}</el-form-item>
					<el-form-item label="下单时间">{{ data.createTime }}</el-form-item>
					<el-form-item label="支付时间">{{ data.payTime }}</el-form-item>
					<el-form-item label="支付方式">{{ data.payType }}</el-form-item>
				</el-card>
				<el-card class="mb-5">
					<el-form-item label="商家">{{ data.merchantName }}</el-form-item>
					<el-form-item label="门店">{{ data.storeName }}</el-form-item>
					<el-table
						:data="data.orderDetailList"
						row-key="id" border
						class="mt8"
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
						size="small"
					>
						<el-table-column label="商品" prop="productName" />
						<el-table-column label="规格" prop="sku" />
						<el-table-column label="渠道价" prop="channelPrice">
							<template #default="{ row }">
								<span>{{ row.channelPrice || 0 }}元</span>
							</template>
						</el-table-column>
						<el-table-column label="单价" prop="price">
							<template #default="{ row }">
								<span>{{ row.price || 0 }}元</span>
							</template>
						</el-table-column>
						<el-table-column label="数量" prop="payNum" />
						<el-table-column label="小记" prop="payPrice">
							<template #default="{ row }">
								<span>￥{{ row.payPrice || 0 }}</span>
							</template>
						</el-table-column>
					</el-table>
					<div class="flex justify-end mt8 amount">
						<div class="label">渠道总额</div>
						<div class="num">￥{{ data.channelTotalPrice || 0 }}</div>
						<div class="label">订单总额</div>
						<div class="num">￥{{ data.totalPrice || 0 }}</div>
						<div class="label">支付优惠</div>
						<div class="num">￥{{ data.couponPrice || 0 }}</div>
						<div class="label">实付金额</div>
						<div class="num" style="color: #f77110">￥{{ data.payPrice || 0 }}</div>
					</div>
					<div class="flex justify-end items-center mt16 amount">
						<div class="label">已退款金额</div>
						<div class="num">￥{{ data.refundTotal || 0 }}</div>
						<el-button
							text
							bg
							style="margin-left: 50px"
							v-if="data.status !== 0 && data.status !== 9 && data.refundRemain !== 0"
							@click="refundVisible = true"
							>退款</el-button
						>
					</div>
				</el-card>
				<el-card>
					<div class="itemTitle">订单日志</div>
					<div class="item flex justify-start align-top" v-for="(item, index) of data.logs" :key="index">
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
						<div class="subTitle">退款剩余金额<span>￥</span>{{ data.refundRemain }}</div>
					</div>
					<!-- <el-icon @click="resetForm(formRef);close"><Close /></el-icon> -->
				</div>
			</template>
			<el-form :model="refundform" ref="formRef" label-width="100px" :rules="formRules">
				<div style="margin-bottom: 18px">
					<el-form-item label="退款金额" prop="refundAmount">
						<el-input type="number" :max="data.refundRemain" v-model="refundform.refundAmount" placeholder="输入退款金额" :step="0.01" />
						<!-- <el-input-number v-model="refundform.refundAmount" :step="0.01" :min="0.00" placeholder="输入退款金额" controls-position="right" /> -->
					</el-form-item>
				</div>
				<div class="mb-[18px]">
					<el-form-item label="退款类型" prop="type">
						<el-radio-group v-model="refundform.type">
							<el-radio :label="2">渠道退款</el-radio>
							<el-radio :label="1">后台退款</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<el-form-item label="备注" prop="remark">
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
import { orderInfosApi, orderRefundApi } from '/@/api/trcomps/order';
import { useMessage } from '/@/hooks/message';

// 定义刷新表格emit
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const refundVisible = ref(false);
const refundDialog = ref(null);
const refundform = ref({
	refundAmount: '',
	remark: '',
	type: '',
});
const Timer = ref();
//   表单校验规则
const formRules = reactive<FormRules>({
	refundAmount: [
		{ required: true, message: '退款金额不能为空' },
		{
			validator: (rule, value, callback) => {
				if (!/^\d+(\.\d{1,2})?$/.test(value)) {
					console.log('value', value);
					callback(new Error('必须是数字，且最多输入两位小数'));
				} else if (value > data.value.refundRemain) {
					callback(new Error('退款金额不能大于剩余退款金额'));
				} else {
					callback();
				}
			},
			trigger: ['blur', 'change'],
		},
	],
	type: [{ required: true, message: '退款类型不能为空', trigger: 'change' }],
});

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
		value: '2',
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
const formatRefundStatus = (status: any) => {
	const obj = refundStatusList.value.find((item) => item.value === status);
	return obj?.label || '--';
};

//  table hook
const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});
const { tableStyle } = useTable(state);
const data = ref<any>({});

const closeDig = () => {
	emit('refresh');
	if (Timer.value) {
		clearInterval(Timer.value);
	}
};

const openDialog = async (row: any) => {
	if (row.orderNo) {
		try {
			let res = await orderInfosApi(row.orderNo);
			if (res.code === 0) {
				data.value = Object.assign(row, res.data);
			}
		} catch (err: any) {
			// useMessage().error(err);
		}
	}
	visible.value = true;
};
const upDataOrder = async (row: any) => {
	if (row.orderNo) {
		try {
			let res = await orderInfosApi(row.orderNo);
			if (res.code === 0) {
				data.value = Object.assign(row, res.data);
			}
		} catch (err: any) {
			// useMessage().error(err);
		}
	}
};

// 取消
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	refundform.value = {
		refundAmount: '',
		remark: '',
		type: '',
	};
	refundVisible.value = false;
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		// 处理提交参数
		if (valid) {
			try {
				const { refundAmount, remark, type } = refundform.value;
				const params = {
					orderNo: data.value.orderNo,
					returnType: 3,
					remark: remark,
					refundAmount,
					type,
				};
				const { code, msg } = await orderRefundApi(params);
				if (code === 0) {
					useMessage().success('操作成功');
					Timer.value = setInterval(() => {
						upDataOrder(data.value);
					}, 1000);
					resetForm(formEl);
					// visible.value = false;
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
