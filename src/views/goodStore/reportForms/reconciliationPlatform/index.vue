<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-form :model="form" ref="ruleFormRef" label-width="auto" class="custom-form" inline>
				<div class="ml30 pt20">
					<div class="title">
						<span>商家对账表</span>
					</div>
					<el-row>
						<el-form-item label="选择商家：" prop="merchantCode">
							<el-select v-model="form.merchantCode" clearable placeholder="请选择商家" style="width: 240px" filterable>
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="支付时间：" prop="merchantPaymentTime">
							<el-date-picker
								v-model="merchantPaymentTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="YYYY-MM-DD"
								style="width: 240px"
							/>
						</el-form-item>
						<el-form-item label="业务类型：" prop="orderType">
							<el-select v-model="form.orderType" clearable placeholder="请选择业务类型" style="width: 240px" filterable>
								<el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="支付方式：" prop="payType">
							<el-select v-model="form.type" clearable placeholder="请选择支付方式" style="width: 240px" filterable>
								<el-option v-for="item in payTypeList" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%">
								<el-button @click="handleDownload('merchant')" class="ml10" type="primary"> 下载 </el-button>
							</div>
						</el-form-item>
					</el-row>
				</div>
				<div class="ml30 pt20">
					<div class="title">
						<span>账单明细表</span>
					</div>
					<el-row>
						<el-form-item label="支付时间：" prop="billPaymentTime">
							<el-date-picker
								v-model="billPaymentTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="YYYY-MM-DD"
								style="width: 240px"
							/>
						</el-form-item>
						<el-form-item label="业务类型：" prop="orderType">
							<el-select v-model="form.orderType2" clearable placeholder="请选择业务类型" style="width: 240px" filterable>
								<el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="支付方式：" prop="payType">
							<el-select v-model="form.type2" clearable placeholder="请选择支付方式" style="width: 240px" filterable>
								<el-option v-for="item in payTypeList" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<div style="width: 100%">
								<el-button @click="handleDownload('bill')" class="ml10" type="primary"> 下载 </el-button>
							</div>
						</el-form-item>
					</el-row>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" name="good-store-reportForms-reconciliation-platform" setup>
import { getMerchantList } from '/@/api/goodStore/tableCenter';
import { downFileAddTask } from '/@/utils/other';
import { useMessageBox } from '/@/hooks/message';
const router = useRouter();

const form = reactive({
	merchantCode: '',
	paymentTimeStart: '',
	paymentTimeEnd: '',
	orderType: '',
	orderType2: '',
	type: '',
	type2: '',
});
const merchantPaymentTime = ref([]);
const billPaymentTime = ref([]);
const options = ref();

const orderTypeList = [
	{
		label: '网订店取',
		value: 2,
	},
	{
		label: '到店支付',
		value: 1,
	},
];

const payTypeList = [
	{
		label: '微信支付',
		value: 1,
	},
	{
		label: '员工卡支付',
		value: 6,
	},
];

onMounted(() => {
	getMerchantList().then((res) => {
		options.value = res.data.map((item: any) => {
			return {
				label: item.merchantName,
				value: item.merchantCode,
			};
		});
	});
});

watch(
	() => [merchantPaymentTime.value, billPaymentTime.value],
	([valMerchantPayment, valBillPayment]) => {
		if (!valMerchantPayment) {
			form.paymentTimeStart = '';
			form.paymentTimeEnd = '';
		} else {
			form.paymentTimeStart = valMerchantPayment[0];
			form.paymentTimeEnd = valMerchantPayment[1];
		}
		if (!valBillPayment) {
			form.paymentTimeStart = '';
			form.paymentTimeEnd = '';
		} else {
			form.paymentTimeStart = valBillPayment[0];
			form.paymentTimeEnd = valBillPayment[1];
		}
	}
);

const handleDownload = async (type: string) => {
	const query = {
		merchantCode: type === 'merchant' ? form.merchantCode : '',
		paymentTimeStart: '',
		paymentTimeEnd: '',
		orderType: type === 'merchant' ? form.orderType : form.orderType2,
		type: type === 'merchant' ? form.type : form.type2,
	};
	if (type === 'merchant' && merchantPaymentTime.value.length > 0) {
		query.paymentTimeStart = merchantPaymentTime.value[0];
		query.paymentTimeEnd = merchantPaymentTime.value[1];
	} else if (type === 'bill' && billPaymentTime.value.length > 0) {
		query.paymentTimeStart = billPaymentTime.value[0];
		query.paymentTimeEnd = billPaymentTime.value[1];
	}
	const { code } = await downFileAddTask(
		type === 'merchant' ? '/mall/payment_order/merchantBillExcel' : '/mall/payment_order/paymentBillDetailsExcel',
		query
	);
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
<style lang="scss" scoped>
.title {
	font-size: 16px;
	font-weight: bold;
	color: #3d3d3d;
	margin-bottom: 18px;
	.notice {
		color: #fa5151;
		font-size: 14px;
		font-weight: normal;
		margin-left: 10px;
	}
}
.custom-form {
}
</style>
