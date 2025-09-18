<template>
	<div class="dialog-wrapper">
		<el-dialog v-model="showDialog" :title="dialogTypeMap[dialogType]" width="50%" :show-close="false">
			<!-- 关闭工单 -->
			<el-form :model="orderCloseForm" v-if="dialogType === 1" ref="orderCloseFormRef" :rules="formRules.orderCloseFormRules">
				<el-form-item label="操作说明：" prop="closeMsg">
					<el-input type="textarea" v-model="orderCloseForm.closeMsg" maxlength="200" placeholder="请输入操作说明" />
				</el-form-item>
				<div class="mt-2 mb-2">当前工单状态为{{ afterSaleStatusMap[basicInfoForm.status] }},是否关闭工单</div>
			</el-form>
			<!-- 拒绝并退款 -->
			<el-form :model="orderRefundForm" v-if="dialogType === 2" ref="orderRefundFormRef" :rules="formRules.orderRefundFormRules">
				<el-form-item label="退款原因：" prop="refundResult">
					<el-input type="textarea" v-model="orderRefundForm.refundResult" maxlength="200" placeholder="请输入退款原因" />
				</el-form-item>
				<div class="mt-2 mb-2">拒绝将退款{{ scopeWorkOrderPrice }}并关闭订单</div>
			</el-form>
			<!-- 广告排期 -->
			<el-form :model="orderConfirmForm" v-if="dialogType === 3" ref="orderConfirmFormRef" :rules="formRules.orderConfirmFormRules">
				<el-form-item label="投放时间：" prop="publishTime">
					<el-date-picker
						v-model="orderConfirmForm.publishTime"
						type="date"
						placeholder="请输入投放时间"
						value-format="YYYY-MM-DD"
						:disabled-date="disabledDate"
						style="width: 380px"
					/>
				</el-form-item>
				<el-form-item label="投放说明：" prop="publishDescription">
					<el-input type="textarea" v-model="orderConfirmForm.publishDescription" maxlength="200" placeholder="请输入投放说明" />
				</el-form-item>
				<el-form-item label="补款退款：" prop="type">
					<el-select v-model="orderConfirmForm.type" clearable @change="changeRefundConfirm">
						<el-option v-for="(value, key) in payStatusMap" :key="key" :label="value" :value="key"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="输入金额：" prop="price">
					<el-input
						v-model="orderConfirmForm.price"
						:disabled="orderConfirmForm.type == 1"
						maxlength="9"
						@input="changeRefund"
						placeholder="请输入输入金额"
					/>
				</el-form-item>
				<div class="mt-2 mb-2">最多可退:{{ scopeWorkOrderPrice }},请注意，全额退款将关闭订单。</div>
			</el-form>
			<!-- 工单审核 -->
			<el-form :model="orderApplyForm" v-if="dialogType === 4 || dialogType === 5" ref="orderApplyFormRef" :rules="formRules.orderApplyFormRules">
				<el-form-item label="审核说明：" prop="auditDescription">
					<el-input type="textarea" v-model="orderApplyForm.auditDescription" maxlength="200" placeholder="请输入审核说明" />
				</el-form-item>
				<el-form-item label="附件上传：" prop="auditFile">
					<div v-for="(item, index) in orderApplyForm.auditFile" :key="index" class="flex items-center mr-2 box">
						<upload-img v-model:image-url="item.img" />
						<Delete class="del" @click="orderApplyForm.auditFile?.splice(index, 1)" v-if="(orderApplyForm.auditFile?.length ?? 0) > 0 && !item.img" />
					</div>
					<el-button type="primary" icon="Plus" v-if="(orderApplyForm.auditFile?.length ?? 0) < 9" @click="addImg('auditFile')">图片</el-button>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="refreshData">取消</el-button>
					<el-button type="primary" @click="handleConfirm(dialogType)" :disabled="countdownTime > 0">
						{{ dialogType === 3 ? '确认排期' : dialogTypeMap[dialogType] }}
						<div v-if="countdownTime > 0">（{{ countdownTime }}）</div></el-button
					>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="ad-adPlacement-dialogs">
import { ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import { ElMessage } from 'element-plus';
import { payStatusMap, dialogTypeMap, formRules, afterSaleStatusMap } from './constant';
import { OrderApplyInfoMap, orderCloseInfoTypes } from './types';
import { workOrderAudit, workOrderClose, workOrderPrice, workOrderRefund, workOrderSchedule } from '/@/api/ad/afterSellOrder';

const emit = defineEmits(['refreshList', 'refreshDetail']);
const orderCloseFormRef = ref();
const orderRefundFormRef = ref();
const orderConfirmFormRef = ref();
const orderApplyFormRef = ref();

const loading = ref(false);
// 倒计时3秒
const countdownTime = ref(3);
const dialogType = ref(1); // type 1:关闭工单，2:拒绝并退款，3:广告排期，，4:通过退款审核，5：驳回审核
const showDialog = ref(false);
const scopeWorkOrderPrice = ref(0); // 可退金额
const orderCloseForm = ref<orderCloseInfoTypes>({
	closeMsg: '',
});
const orderRefundForm = ref({
	refundResult: '',
});
const orderConfirmForm = ref<{ [key: string]: any }>({
	publishDescription: '',
	publishTime: '',
	type: '1',
	price: '',
});
const orderApplyForm = ref<OrderApplyInfoMap>({
	auditDescription: '',
	auditFile: [{ img: '' }],
	auditResult: false,
});
const basicInfoForm = ref<any>();
const openDialog = (row: any, type: number) => {
	showDialog.value = true;
	dialogType.value = type;
	basicInfoForm.value = Object.assign({}, row);
	getWorkOrderPrice(row.orderCode);
	startCountdown();
};
const getWorkOrderPrice = async (orderCode: string) => {
	const { code, data } = await workOrderPrice(orderCode);
	if (code === 0) {
		scopeWorkOrderPrice.value = data;
	}
};
const disabledDate = (time: any) => {
	return time.getTime() < Date.now();
};

const addImg = (type: string) => {
	orderApplyForm.value[type].push({ img: '' });
};
const changeRefund = (val: any) => {
	const reg = /^[\d\.]*$/;
	if (reg.test(val)) {
		orderConfirmForm.value.price = val;
	} else {
		orderConfirmForm.value.price = '';
	}
};
const changeRefundConfirm = (val: any) => {
	if (val == 1) {
		formRules.value.orderConfirmFormRules.price = [{ required: false, trigger: 'blur' }];
	} else {
		formRules.value.orderConfirmFormRules.price = [{ required: true, message: '请输入补退款金额', trigger: 'blur' }];
	}
};
const validImg = (list: Array<any> = [], msg: string) => {
	const val = list.some((item) => !item.img);
	if (val) useMessage().error(msg);
	return !val;
};
const delEmpty = (list: any[] = []) => {
	return list.filter((item) => item);
};
const handleConfirm = (type: number) => {
	console.log('type', type);
	const { workOrderCode, orderCode } = basicInfoForm.value;
	let auditFile = [];
	if (type === 4 || type === 5) {
		auditFile = delEmpty(orderApplyForm.value.auditFile)?.map((itemX: any) => itemX.img || itemX);
		if (!validImg(orderApplyForm.value.auditFile, '请上传审核附件')) return;
	}
	const dataMap: any = [
		{
			dataForm: Object.assign({ workOrderCode }, { closeMsg: orderCloseForm.value.closeMsg }),
			refs: orderCloseFormRef,
			request: workOrderClose,
		},
		{
			dataForm: Object.assign({ workOrderCode, orderCode }, { refundResult: orderRefundForm.value.refundResult }),
			refs: orderRefundFormRef,
			request: workOrderRefund,
		},
		{
			dataForm: Object.assign({ workOrderCode, orderCode }, orderConfirmForm.value),
			refs: orderConfirmFormRef,
			request: workOrderSchedule,
		},
		{
			dataForm: Object.assign(
				{ workOrderCode, orderCode },
				orderApplyForm.value,
				{ auditFile },
				{ auditResult: dialogType.value === 4 ? 'true' : 'false' }
			),
			refs: orderApplyFormRef,
			request: workOrderAudit,
		},
	];
	let formData, formRefs, request;
	if (type === 5) {
		formData = dataMap[type - 2].dataForm;
		formRefs = dataMap[type - 2].refs;
		request = dataMap[type - 2].request;
	} else {
		formData = dataMap[type - 1].dataForm;
		formRefs = dataMap[type - 1].refs;
		request = dataMap[type - 1].request;
	}
	onSubmit(formData, formRefs, request);
};

const onSubmit = (formData: any, formRef: any, request: any) => {
	loading.value = true;
	if (!formRef.value) return;
	formRef.value.validate(async (valid: Boolean) => {
		if (valid) {
			try {
				const { code, msg } = await request(formData);
				loading.value = false;
				if (code === 0) {
					ElMessage.success(msg || '操作成功');
					refreshData();
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
const refreshData = () => {
	if (dialogType.value === 1) {
		emit('refreshList');
	} else {
		emit('refreshDetail');
	}
	showDialog.value = false;
	countdownTime.value = 3;
	orderCloseForm.value = {
		closeMsg: '',
	};
	orderRefundForm.value = {
		refundResult: '',
	};
	orderConfirmForm.value = {};
	orderApplyForm.value = {
		auditDescription: '',
		auditFile: [{ img: '' }],
		auditResult: false,
	};
	basicInfoForm.value = {};
};
// 定义倒计时的函数
const startCountdown = () => {
	const countdown = setInterval(() => {
		countdownTime.value--;
		if (countdownTime.value <= 0) {
			clearInterval(countdown);
		}
	}, 1000);
};
onMounted(() => {
	loading.value = true;
});
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.dialog-title {
	font-size: 24px;
}
</style>
