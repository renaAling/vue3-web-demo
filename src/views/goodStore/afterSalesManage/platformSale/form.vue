<template>
	<div>
		<el-dialog title="售后详情" ref="myDialog" v-model="visible" width="40%" :close-on-click-modal="false">
			<el-form :model="data">
				<el-card class="mb-5">
					<el-form-item label="商家">{{ data.merchantName }}</el-form-item>
					<el-form-item label="门店">{{ data.storeName }}</el-form-item>
					<el-form-item label="退款金额">{{ data.refundTotalAmount }}元</el-form-item>
				</el-card>
				<el-card>
					<el-form-item label="售后单号">{{ data.refundCode }}</el-form-item>
					<el-form-item label="订单编号">{{ data.orderCode }}</el-form-item>
					<el-form-item label="售后状态">{{ data.refundStatus }}</el-form-item>
					<el-form-item label="下单用户">{{ data.mobile }}</el-form-item>
					<el-form-item label="创建时间">{{ data.createTime }}</el-form-item>
					<el-form-item label="退款时间">{{ data.refundTime }}</el-form-item>
					<el-form-item label="退款方式">{{ payTypeMap[data.type] }}</el-form-item>
					<el-form-item label="商户号" v-if="data.refundOrderType === 2">{{ data.merId }}</el-form-item>
					<el-form-item label="备注">{{ data.channelNotifyRemark }}</el-form-item>
					<el-form-item label="退款类型">{{ refundTypeMap[data.original] }}</el-form-item>
					<el-form-item label="操作人">{{ data.operator }}</el-form-item>
				</el-card>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="visible = false">关闭 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { sellDetail } from '/@/api/goodStore/afterSell';
import { useMessage } from '/@/hooks/message';
import { payTypeMap, refundTypeMap } from '../../orderManage/platformOrder/enum';

const visible = ref(false);
const myDialog = ref(null);

const data = ref({
	merchantName: '',
	storeName: '',
	refundTotalAmount: null,
	id: null,
	refundCode: '',
	orderCode: '',
	refundStatus: null,
	mobile: '',
	createTime: '',
	refundTime: '',
	type: 0,
	merId: '',
	channelNotifyRemark: '',
	original: '',
	operator: '',
	refundOrderType: null,
});

const orderStatusList = ref([
	{
		label: '退款中',
		value: 1,
	},
	{
		label: '已退款',
		value: 2,
	},
	{
		label: '已关闭',
		value: 3,
	},
]);
const openDialog = async (row: any) => {
	if (row.id) {
		data.value.merchantName = `${row.merchantName} (${row.merchantCode})`;
		data.value.storeName = `${row.storeName} (${row.storeCode})`;
		try {
			let res = await sellDetail(row.id);
			if (res.code === 0) {
				const refundStatus = orderStatusList.value.filter((item: any) => item.value === res.data.refundStatus)[0]?.label;
				let operator = '';
				if (res.data.operateName && res.data.operatePhone) {
					operator = `${res.data.operateName} (${res.data.operatePhone})`;
				}
				if (res.data.operateName && !res.data.operatePhone) {
					operator = `${res.data.operateName}`;
				}
				if (res.data.operatePhone && !res.data.operateName) {
					operator = `${res.data.operatePhone}`;
				}
				if (!res.data.operateName && !res.data.operatePhone) {
					operator = '';
				}
				data.value = Object.assign(res.data, { operator, refundStatus });
			}
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
