<template>
	<div>
		<el-dialog title="售后详情" ref="myDialog" v-model="visible" width="40%" :close-on-click-modal="false">
			<el-form :model="data" label-position="right" label-width="auto">
				<el-card class="mb-[12px]">
					<el-form-item label="商家" label-width="80">{{ data.merName }}</el-form-item>
					<el-form-item label="门店" label-width="80">{{ data.storeName }}</el-form-item>
					<el-form-item label="退回金额" label-width="80">{{ data.refundPrice }}元</el-form-item>
					<!-- <el-form-item label="卡余额退回">{{ data.cardReturnedAmount }}元</el-form-item>
					<el-form-item label="微信支付退回">{{ data.wechatReturnedAmount }}元</el-form-item> -->
				</el-card>
				<el-card class="mb-[12px]">
					<el-form-item label="售后单号" label-width="80">{{ data.refundOrderNo }}</el-form-item>
					<el-form-item label="订单编号" label-width="80">{{ data.orderInfoVo.orderNo }}</el-form-item>
					<el-form-item label="售后类型" label-width="80">
						<dict-tag :options="refundType" :value="data.type"></dict-tag>
					</el-form-item>
					<el-form-item label="售后状态" label-width="80">
						<dict-tag :options="orderStatusList" :value="data.refundStatus"></dict-tag>
					</el-form-item>
					<el-form-item label="用户账号" label-width="80">{{ data.mobile }}</el-form-item>
					<!-- <el-form-item label="退款方式">{{ data.merchantName }}</el-form-item> -->
					<el-form-item label="创建时间" label-width="80">{{ data.orderInfoVo.createTime }}</el-form-item>
					<el-form-item label="退款时间" label-width="80">{{ data.refundTime }}</el-form-item>
					<el-form-item label="退款方式" label-width="80">
						<dict-tag :options="payTypeList" :value="data.paymentMethod"></dict-tag>
					</el-form-item>
					<el-form-item label="备注" label-width="80">{{ data.merRemark }}</el-form-item>
				</el-card>
				<!-- <el-card class="mb-[12px]">
					<div class="page_title mb8">售后日志</div>
					<el-form-item v-for="(item,index) in data.statusList" :key="index" :label="item.createTime">
						{{ formatLogsType(item.changeType) }} {{ item.changeMessage }}
					</el-form-item>
				</el-card> -->
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="visible = false">取消</el-button>
					<el-button type="primary" @click="visible = false">确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { orderInfo } from '/@/api/goodStore/afterSales';
import { useMessage } from '/@/hooks/message';

const visible = ref(false);
const myDialog = ref(null);

const data = ref<any>({});

const orderStatusList = ref([
	{
		label: '待审核',
		value: '0',
		elTagType: '',
	},
	{
		label: '商家拒绝',
		value: '1',
		elTagType: '',
	},
	{
		label: '退款中',
		value: '2',
		elTagType: '',
	},
	{
		label: '已退款',
		value: '3',
		elTagType: '',
	},
	{
		label: '用户退货',
		value: '4',
		elTagType: '',
	},
	{
		label: '商家待收货',
		value: '5',
		elTagType: '',
	},
	{
		label: '已撤销',
		value: '6',
		elTagType: '',
	},
]);

const payTypeList = ref([
	{
		label: '微信',
		value: '1',
		elTagType: '',
	},
	{
		label: '员工卡',
		value: '8',
		elTagType: '',
	},
]);

const refundType = ref([
	{
		label: '后台退款',
		value: '1',
		elTagType: '',
	},
	{
		label: '渠道退款',
		value: '2',
		elTagType: '',
	},
]);

const logsType = {
	apply: '申请退款',
	audit: '商家审核',
	returning: '商品退回',
	receiving: '商家确认收货',
	refund: '退款',
	compulsory: '平台强制退款',
	revoke: '撤销',
} as const;
const formatLogsType = (type: keyof typeof logsType): string => {
	return logsType[type] || '--';
};
const openDialog = async (row: any) => {
	if (row.refundOrderNo) {
		try {
			let res = await orderInfo(row.refundOrderNo);
			if (res.code === 0) {
				data.value = Object.assign(res.data, row);
			}
			// console.log(data);
		} catch (err: any) {
			useMessage().error(err);
		}
	}
	visible.value = true;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.page_title {
	font-size: 28rpx;
	font-weight: bold;
}
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
::v-deep .el-form-item--default {
	margin-bottom: 8px;
}
</style>
