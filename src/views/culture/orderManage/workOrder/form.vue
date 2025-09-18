<template>
	<el-form class="custom-form" :model="basicInfoForm" label-width="100px" ref="formRef" :rules="formRules" v-loading="loading">
		<el-card>
			<p class="title">工单审核</p>
			<el-row :getter="24">
				<el-col :span="6">
					<el-form-item label="工单号：">
						<span>{{ basicInfoForm.afterSaleCode }}</span>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="发起时间：">
						<span>{{ basicInfoForm.applyTime }}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="售后原因：">
						<span>{{ basicInfoForm.reasonDescription }}</span>
					</el-form-item></el-col
				>
				<el-col :span="6"
					><el-form-item label="情况说明：">
						<div class="text">{{ basicInfoForm.applyDescription }}</div>
					</el-form-item></el-col
				>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="售后凭证：">
						<div class="flex">
							<div v-for="(item, index) in basicInfoForm.vouchers" :key="index" class="mr-3">
								<!-- <img :src="item" class="img" /> -->
								<el-image class="img" :src="item" :preview-src-list="basicInfoForm.vouchers" :initial-index="index" fit="cover" />
							</div>
						</div> </el-form-item
				></el-col>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="订单编号：">
						<span>{{ basicInfoForm.orderCode }}</span>
					</el-form-item></el-col
				>
				<el-col :span="6"
					><el-form-item label="订单金额：">
						<span>￥{{ basicInfoForm.orderAmount }}</span>
					</el-form-item></el-col
				>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6">
					<el-form-item label="物流单号：">
						<span>{{ basicInfoForm.logisticsNumber && basicInfoForm.logisticsNumber[0] }}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="实付金额：">
						<span>￥{{ basicInfoForm.payAmount }}</span>
					</el-form-item></el-col
				>
				<el-col :span="6">
					<el-form-item label="当前可退：">
						<span>￥{{ basicInfoForm.currentlyRefundable || 0 }}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="订单状态：">
						<span>{{ orderStatusMap[basicInfoForm.orderStatus] }}</span>
					</el-form-item></el-col
				>
				<el-col :span="6"
					><el-form-item label="发货状态：">
						<span>{{ shippingStatusMap[basicInfoForm.shippingStatus] }}</span>
					</el-form-item></el-col
				>
			</el-row>
			<el-row :getter="24">
				<el-form-item label="退款金额：" prop="refundAmount">
					<el-input
						v-model="basicInfoForm.refundAmount"
						:disabled="basicInfoForm.auditResult == 2 || basicInfoForm.status !== 1"
						maxlength="20"
						@input="changeRefund"
						placeholder="请输入退款金额"
					/>
				</el-form-item>
			</el-row>
			<el-row :getter="24" class="mt-6">
				<el-form-item label="审核说明：" prop="auditDescription">
					<el-input
						type="textarea"
						v-model="basicInfoForm.auditDescription"
						maxlength="200"
						style="width: 500px"
						show-word-limit
						placeholder="请输入审核说明"
						:disabled="basicInfoForm.status !== 1"
					/>
				</el-form-item>
			</el-row>
			<el-form-item label="审核意见：" prop="auditResult" class="mt-4">
				<el-radio-group v-model="basicInfoForm.auditResult" @change="changeAuditResult" :disabled="basicInfoForm.status !== 1">
					<el-radio :label="1">通过</el-radio>
					<el-radio :label="2">驳回</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="basicInfoForm.status === 1">
				<el-button type="primary" size="default" @click="confirmData">确认</el-button>
				<el-button type="info" size="default" @click="handleCancel">取消</el-button>
			</el-form-item>
			<el-form-item v-else>
				<el-button type="info" size="default" @click="handleCancel">返回</el-button>
			</el-form-item>
		</el-card>
		<el-card>
			<p class="title">订单商品</p>
			<el-table
				border
				:data="basicInfoForm.skuInfos"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="SKU" prop="spuCode" />
				<el-table-column label="SKU图" prop="skuImage">
					<template #default="{ row }">
						<el-image style="width: 50px; height: 50px" :src="row.skuImage" />
					</template>
				</el-table-column>
				<el-table-column label="商品标题" prop="spuName" show-overflow-tooltip />
				<el-table-column label="规格" prop="skuName" />
				<el-table-column label="供应商" prop="supplierName" show-overflow-tooltip />
				<el-table-column label="数量" prop="quantity" />
				<el-table-column label="单价（￥）" prop="price" width="140" />
				<el-table-column label="总价（￥）" prop="skuAmount" width="140" />
			</el-table>
		</el-card>
		<el-card>
			<p class="title">售后历史</p>
			<el-table
				border
				:data="basicInfoForm.afterSaleInfos"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="售后单号" prop="afterSaleCode" />
				<el-table-column label="创建时间" prop="applyTime" />
				<el-table-column label="售后状态" prop="status">
					<template #default="{ row }">{{ afterSaleStatusMap[row.status] }}</template>
				</el-table-column>
				<el-table-column label="审核人" prop="auditName" />
				<el-table-column label="审核时间" prop="auditTime" />
				<el-table-column label="审核结果" prop="auditResult">
					<template #default="{ row }">{{ row.auditResult === true ? '通过' : row.auditResult === false ? '驳回' : '-' }}</template>
				</el-table-column>
				<el-table-column label="退款金额（元）" prop="refundAmount" width="140" />
				<el-table-column label="审核说明" prop="auditDescription" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</el-card>

		<el-dialog v-model="confirmDialogVisible" :title="basicInfoForm.auditResult == 1 ? '请核实退款金额' : '驳回申请'" width="400" :show-close="false">
			<span>请确认是否{{ basicInfoForm.auditResult == 1 ? '通过' : '驳回' }}对工单：{{ basicInfoForm.afterSaleCode }}退款</span>
			<span v-if="basicInfoForm.auditResult == 1"
				>：<span style="color: red; font-weight: 600; font-size: 16px">{{ Number(basicInfoForm.refundAmount).toFixed(2) }}</span> 元</span
			>的申请
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="cancel">取消</el-button>
					<el-button type="primary" @click="handleConfirm" :disabled="countdownTime > 0">
						确定<span v-if="countdownTime > 0"> （{{ countdownTime }}） </span></el-button
					>
				</div>
			</template>
		</el-dialog>
	</el-form>
</template>

<script setup lang="ts" name="orderManage-workOrder-refundDetail">
import { reactive, ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { refundApprove, refundDetail } from '/@/api/culture/orderManage';
import { useMessage } from '/@/hooks/message';
import { ElMessage, FormRules } from 'element-plus';
import { afterSaleStatusMap, orderStatusMap, shippingStatusMap } from './constant';

const router = useRouter();
const formRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});
const loading = ref(false);
// 倒计时3秒
const countdownTime = ref(3);

const confirmDialogVisible = ref(false);
//  table hook
const { tableStyle, currentChangeHandle, sizeChangeHandle } = useTable(state);
const formRules = reactive<FormRules>({
	auditResult: [{ required: true, message: '请选择审核意见' }],
	auditDescription: [{ required: true, message: '请输入审核说明' }],
});
const basicInfoForm = ref({
	afterSaleCode: '',
	status: null,
	reasonDescription: '',
	applyDescription: '',
	vouchers: [],
	orderAmount: '',
	orderCode: '',
	logisticsNumber: '',
	applyTime: '',
	currentlyRefundable: '',
	orderStatus: '',
	shippingStatus: '',
	payAmount: '',
	refundCode: '',
	auditDescription: '',
	auditResult: 1,
	refundAmount: '',
	refundStatus: '',
	refundReason: '',
	skuInfos: [],
	afterSaleInfos: [],
	avatar: '',
	name: '',
	mobile: '',
	userIdentity: '',
	registerTime: '',
	lastLoginTime: '',
});

const cancel = () => {
	confirmDialogVisible.value = false;
	countdownTime.value = 0;
};
// 取消
const handleCancel = () => {
	router.push('/culture/orderManage/workOrder/index');
};
const changeRefund = (val: any) => {
	const reg = /^[\d\.]*$/;
	if (reg.test(val)) {
		basicInfoForm.value.refundAmount = val;
	} else {
		basicInfoForm.value.refundAmount = '';
	}
	if (Number(basicInfoForm.value.refundAmount) > Number(basicInfoForm.value.currentlyRefundable)) {
		basicInfoForm.value.refundAmount = basicInfoForm.value.currentlyRefundable;
	}
};
const changeAuditResult = () => {
	if (basicInfoForm.value.auditResult == 2) {
		basicInfoForm.value.refundAmount = '';
	}
};
const getOrderDetailData = async (orderCode: any) => {
	try {
		const { code, data, msg } = await refundDetail(orderCode);
		loading.value = false;
		if (code === 0) {
			const auditResult = data.auditResult ? 1 : 2;
			console.log('data.orderStatus', data.orderStatus);
			basicInfoForm.value = Object.assign(data, { auditResult });
		} else {
			useMessage().error(msg);
			loading.value = false;
			router.push('/culture/orderManage/workOrder/index');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		router.push('/culture/orderManage/workOrder/index');
		loading.value = false;
	}
};

// 定义倒计时的函数
function startCountdown() {
	const countdown = setInterval(() => {
		countdownTime.value--;
		if (countdownTime.value <= 0) {
			clearInterval(countdown);
		}
	}, 1000);
}

const handleConfirm = () => {
	onSubmit();
	confirmDialogVisible.value = false;
};
const confirmData = async () => {
	const { refundAmount, auditResult } = basicInfoForm.value;
	if (auditResult === 1 && !refundAmount) {
		return useMessage().error('请输入退款金额');
	}
	try {
		confirmDialogVisible.value = true;
		if (basicInfoForm.value.auditResult === 1) {
			countdownTime.value = 3;
			// 弹窗打开的同时倒计时启动
			await startCountdown();
		} else {
			countdownTime.value = 0;
		}

		// await useMessageBox().confirm(
		// 	`请确认是否${auditResult == 1 ? '通过' : '驳回'}对工单：${afterSaleCode} 退款：${Number(refundAmount).toFixed(2)}元的申请`,
		// 	'请核实退款金额'
		// );
	} catch (error) {
		return;
	}
};

const onSubmit = () => {
	loading.value = true;
	if (!formRef.value) return;
	formRef.value.validate(async (valid: Boolean) => {
		if (valid) {
			const { afterSaleCode, refundAmount, auditResult, auditDescription } = basicInfoForm.value;
			const params = {
				afterSaleCode,
				refundAmount,
				auditResult: auditResult === 1 ? true : false,
				auditDescription,
			};
			try {
				const { code, msg } = await refundApprove(params);
				loading.value = false;
				if (code === 0) {
					ElMessage.success('审核成功');
					router.push('/culture/orderManage/workOrder/index');
				} else {
					useMessage().error(msg);
				}
			} catch (error: any) {
				useMessage().error(error.msg);
				loading.value = false;
			}
		} else {
			loading.value = false;
		}
	});
};
onMounted(() => {
	loading.value = true;
	const afterSaleCode = router.currentRoute.value.query.afterSaleCode;
	getOrderDetailData({ afterSaleCode });
});
</script>
<style lang="scss" scoped>
.custom-form {
	padding: 20px 20px 0;

	.el-card {
		margin-bottom: 20px;
	}

	.title {
		font-size: 18px;
		font-weight: 500;
		line-height: 28px;
		color: #1d2129;
		margin-bottom: 16px;
	}
}

.custom-width {
	width: 330px;
}

.footer {
	text-align: center;

	.el-button {
		width: 68px;
	}
}

.img {
	width: 100px;
	height: 100px;
}

.text {
	width: 400px;
	overflow-wrap: break-word;
	line-height: 25px;
}
</style>
