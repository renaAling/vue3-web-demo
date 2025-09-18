<template>
	<div>
		<el-dialog title="订单详情" ref="myDialog" v-model="visible" width="40%" :close-on-click-modal="false">
			<el-form :model="data">
				<el-card class="mb-5">
					<el-form-item label="商家">{{ data.merchantName }}</el-form-item>
					<el-form-item label="门店">{{ data.storeName }}</el-form-item>
					<el-form-item label="支付金额">{{ data.userPaymentAmount }}元</el-form-item>
					<el-form-item label="卡余额抵扣">{{ data.cardDiscountAmount }}元</el-form-item>
					<el-form-item label="微信支付">{{ data.wechatPaymentAmount }}元</el-form-item>
				</el-card>
				<el-card>
					<el-form-item label="支付单号">{{ data.orderCode }}</el-form-item>
					<el-form-item label="订单状态">{{ data.status }}</el-form-item>
					<el-form-item label="用户账号">{{ data.mobile }}</el-form-item>
					<el-form-item label="支付方式">{{ data.type }}</el-form-item>
					<el-form-item label="下单时间">{{ data.createTime }}</el-form-item>
					<el-form-item label="支付时间">{{ data.paymentTime }}</el-form-item>
					<!-- <el-form-item label="操作人">{{ data.operator }}</el-form-item> -->
				</el-card>
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
import { orderDetail } from '/@/api/goodStore/order';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);

const data = ref({
	merchantName: '',
	storeName: '',
	id: null,
	userPaymentAmount: null,
	discountAmount: null,
	wechatPaymentAmount: null,
	cardDiscountAmount: null,
	orderCode: '',
	userId: '',
	mobile: '',
	type: '',
	orderType: '',
	createTime: '',
	paymentTime: '',
	operator: '',
	status: '',
});

const openDialog = async (row: any) => {
	if (row.id) {
		try {
			let res = await orderDetail(row.orderCode);
			if (res.code === 0) {
				data.value.merchantName = res.data.merchantName;
				data.value.storeName = res.data.storeName;
				data.value.userPaymentAmount = res.data.userPaymentAmount;
				data.value.discountAmount = res.data.discountAmount;
				data.value.wechatPaymentAmount = res.data.wechatPaymentAmount;
				data.value.cardDiscountAmount = res.data.cardDiscountAmount;
				data.value.orderCode = res.data.orderCode;
				data.value.mobile = res.data.mobile;
				switch (res.data.type) {
					case 1:
						data.value.type = '微信小程序';
						break;
					// case 2:
					// 	data.value.type = '微信支付'
					// 	break
					// case 3:
					// 	data.value.type = '员工卡+微信支付'
					// 	break
				}

				switch (res.data.status) {
					case 1:
						data.value.status = '支付中';
						break;
					case 2:
						data.value.status = '支付成功';
						break;
					case 3:
						data.value.status = '已退款';
						break;
					case 4:
						data.value.status = '已取消';
						break;
				}
				data.value.orderType = res.data.orderType;
				data.value.createTime = res.data.createTime;
				data.value.paymentTime = res.data.paymentTime;
				data.value.operator = `${res.data.operator} (${res.data.mobile})`;
			}
		} catch (err: any) {
			// useMessage().error(err);
		}
	} else {
	}
	visible.value = true;
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
</style>
