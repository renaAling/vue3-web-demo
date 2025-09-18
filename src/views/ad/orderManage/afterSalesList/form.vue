<template>
	<el-form class="custom-form" :model="basicInfoForm" label-width="100px" ref="formRef" :rules="formRules" v-loading="loading">
		<el-card>
			<p class="title">工单审核</p>
			<el-row :getter="24">
				<el-col :span="6">
					<el-form-item label="工单号：">
						<span>{{ basicInfoForm.refundOrderNo || '——' }}</span>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="发起时间：">
						<span>{{ basicInfoForm.createTime || '——' }}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="售后原因：">
						<span>{{ basicInfoForm.refundReasonWap || '——' }}</span>
					</el-form-item></el-col
				>
				<el-col :span="6"
					><el-form-item label="情况说明：">
						<div class="text">{{ basicInfoForm.refundReasonWapExplain || '——' }}</div>
					</el-form-item></el-col
				>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="售后凭证：">
						<div class="flex">
							<div v-for="(item, index) in basicInfoForm.saleImages" :key="index" class="mr-3">
								<el-image class="img" :src="item" :preview-src-list="basicInfoForm.saleImages" :initial-index="index" fit="cover" />
							</div>
						</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="订单编号：">
						<span>{{ basicInfoForm.orderNo || '——' }}</span>
					</el-form-item></el-col
				>
				<el-col :span="6"
					><el-form-item label="订单金额：">
						<span>￥{{ basicInfoForm.totalPrice || '——' }}</span>
					</el-form-item></el-col
				>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="实付金额：">
						<span>￥{{ basicInfoForm.payPrice || '——' }}</span>
					</el-form-item></el-col
				>
				<el-col :span="6">
					<el-form-item label="当前可退：">
						<span>￥{{ basicInfoForm.refundableAmount || 0 }}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :getter="24">
				<el-col :span="6"
					><el-form-item label="订单状态：">
						<span>{{ orderStatusMap[basicInfoForm.orderStatus] || '——' }}</span>
					</el-form-item></el-col
				>
			</el-row>
			<el-row :getter="24">
				<el-form-item label="退款金额：">
					<el-input
						v-model="basicInfoForm.refundPrice"
						:disabled="basicInfoForm.refundStatus !== 0 || basicInfoForm.auditResult == false"
						maxlength="20"
						@input="changeRefund"
						placeholder="请输入退款金额"
					/>
				</el-form-item>
			</el-row>
			<el-row :getter="24" class="mt-6">
				<el-form-item label="审核说明：" prop="refundReason">
					<el-input
						type="textarea"
						v-model="basicInfoForm.refundReason"
						maxlength="100"
						style="width: 500px"
						show-word-limit
						placeholder="请输入审核说明"
						:disabled="basicInfoForm.refundStatus !== 0"
					/>
				</el-form-item>
			</el-row>
			<el-form-item label="审核意见：" prop="auditResult" class="mt-4">
				<el-radio-group v-model="basicInfoForm.auditResult" @change="changeAuditResult" :disabled="basicInfoForm.refundStatus !== 0">
					<el-radio :label="true">通过</el-radio>
					<el-radio :label="false">驳回</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="basicInfoForm.refundStatus === 0">
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
				:data="basicInfoForm.orderDetails"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				class="table-product"
			>
				<el-table-column label="SKU" prop="sku" />
				<el-table-column label="SKU图" prop="image">
					<template #default="{ row }">
						<el-image style="width: 50px; height: 50px" :src="row.image" />
					</template>
				</el-table-column>
				<el-table-column label="媒体标题" prop="productName" show-overflow-tooltip />
				<el-table-column label="规格" prop="skuName" />
				<el-table-column label="运营商" prop="supplierName" show-overflow-tooltip />
				<el-table-column label="数量" prop="payNum" />
				<el-table-column label="单价（￥）" prop="price" width="140" />
				<el-table-column label="总价（￥）" prop="payPrice" width="140" />
			</el-table>
			<div style="text-align: right">订单总金额：¥{{ basicInfoForm.totalPrice }}</div>
		</el-card>
		<el-card>
			<p class="title">售后历史</p>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="售后单号" prop="refundOrderNo" />
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="售后状态" prop="refundStatus">
					<template #default="{ row }">{{ afterSaleStatusMap[row.refundStatus] }}</template>
				</el-table-column>
				<el-table-column label="审核人" prop="auditName">
					<template #default="{ row }">{{ row.auditName || '——' }}</template>
				</el-table-column>
				<el-table-column label="审核时间" prop="auditTime">
					<template #default="{ row }">{{ row.auditTime || '——' }}</template>
				</el-table-column>
				<el-table-column label="审核结果" prop="auditResult">
					<template #default="{ row }">
						<span v-if="row.auditResult == true">通过</span>
						<span v-else-if="row.auditResult == false">驳回</span>
						<span v-else>——</span>
					</template>
				</el-table-column>
				<el-table-column label="退款金额（元）" prop="refundPrice" width="140" />
				<el-table-column label="审核说明" prop="refundReason">
					<template #default="{ row }">{{ row.refundReason || '——' }}</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</el-card>

		<el-dialog v-model="confirmDialogVisible" :title="basicInfoForm.auditResult ? '请核实退款金额' : '驳回申请'" width="400" :show-close="false">
			<span>请确认是否{{ basicInfoForm.auditResult ? '通过' : '驳回' }}对工单：{{ basicInfoForm.refundOrderNo }}退款</span>
			<span v-if="basicInfoForm.auditResult"
				>：<span style="color: red; font-weight: 600; font-size: 16px">{{ Number(basicInfoForm.refundPrice).toFixed(2) }}</span> 元</span
			>的申请
			<span v-if="basicInfoForm.refundPrice == basicInfoForm.refundableAmount"> 全额退款请注意处理广告投放工单 </span>
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
import { useMessage } from '/@/hooks/message';
import { ElMessage, FormRules } from 'element-plus';
import { afterSaleStatusMap, orderStatusMap, shippingStatusMap } from './constant';
import { refundOrderDetail, refundOrderPage, refundApprove } from '/@/api/ad/afterSellOrder';

const router = useRouter();
const formRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: refundOrderPage,
	queryForm: {
		orderType: 8,
		orderNo: router.currentRoute.value.query.orderNo,
	},
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
	refundReason: [{ required: true, message: '请输入审核说明', trigger: 'blur' }],
});
const basicInfoForm = ref({
	refundOrderNo: '',
	createTime: '',
	refundReasonWap: '',
	refundReasonWapExplain: '',
	saleImages: [],
	orderNo: '',
	totalPrice: '',
	payPrice: '',
	refundableAmount: '',
	orderStatus: '',
	refundPrice: '',
	refundReason: '',
	auditResult: false,
	orderDetails: [],
	refundStatus: 0,
});

const cancel = () => {
	confirmDialogVisible.value = false;
	countdownTime.value = 0;
};
// 取消
const handleCancel = () => {
	router.push('/ad/orderManage/afterSalesList/index');
};
const changeRefund = (val: any) => {
	const reg = /^[\d\.]*$/;
	if (reg.test(val)) {
		basicInfoForm.value.refundPrice = val;
	} else {
		basicInfoForm.value.refundPrice = '';
	}
	if (Number(basicInfoForm.value.refundPrice) > Number(basicInfoForm.value.refundableAmount)) {
		basicInfoForm.value.refundPrice = basicInfoForm.value.refundableAmount;
	}
};
const changeAuditResult = () => {
	if (!basicInfoForm.value.auditResult) {
		basicInfoForm.value.refundPrice = '';
	}
};
const getOrderDetailData = async (refundOrderNo: any) => {
	try {
		const { code, data, msg } = await refundOrderDetail(refundOrderNo);
		loading.value = false;
		if (code === 0) {
			basicInfoForm.value = data;
			basicInfoForm.value.refundPrice = '';
		} else {
			useMessage().error(msg);
			loading.value = false;
			router.push('/ad/orderManage/afterSalesList/index');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		router.push('/ad/orderManage/afterSalesList/index');
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
	console.log('basicInfoForm.value', basicInfoForm.value);
	const { refundPrice, auditResult } = basicInfoForm.value;
	if (auditResult && !refundPrice) {
		return useMessage().error('请输入退款金额');
	}
	try {
		confirmDialogVisible.value = true;
		if (basicInfoForm.value.auditResult) {
			countdownTime.value = 3;
			// 弹窗打开的同时倒计时启动
			await startCountdown();
		} else {
			countdownTime.value = 0;
		}
	} catch (error) {
		return;
	}
};

const onSubmit = () => {
	loading.value = true;
	if (!formRef.value) return;
	formRef.value.validate(async (valid: Boolean) => {
		if (valid) {
			const { refundOrderNo, refundPrice, auditResult, refundReason } = basicInfoForm.value;
			const params = {
				refundOrderNo,
				refundPrice: Number(refundPrice),
				auditType: auditResult ? 'success' : 'refuse',
				reason: refundReason,
				refundAmountType: 2,
			};
			try {
				const { code, msg } = await refundApprove(params);
				loading.value = false;
				if (code === 0) {
					ElMessage.success('审核成功');
					router.push('/ad/orderManage/afterSalesList/index');
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
	const refundOrderNo = router.currentRoute.value.query.refundOrderNo;
	getOrderDetailData(refundOrderNo);
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

.table-product {
	margin-bottom: 20px;
}
</style>
