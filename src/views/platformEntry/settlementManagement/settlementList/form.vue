<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" width="30%" :close-on-click-modal="false">
			<el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm">
				<el-form-item label="商家ID" prop="merchantCode">
					<el-input v-model="ruleForm.merchantCode" placeholder="请输入商家ID" @change="changeId" />
				</el-form-item>
				<el-form-item label="商家名称" prop="merchantName">
					<el-input v-model="ruleForm.merchantName" placeholder="请输入商家名称" disabled />
				</el-form-item>
				<el-form-item label="费用类型" prop="feeType">
					<el-select v-model="ruleForm.feeType" placeholder="请选择费用类型">
						<el-option v-for="item in feeTypeList" :key="'feeType' + item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="应收金额(元)" prop="receivableAmount">
					<el-input-number
						v-model="ruleForm.receivableAmount"
						min="0.01"
						:precision="2"
						:step="0.01"
						max="10000000"
						placeholder="请输入应收金额"
						controls-position="right"
					/>
				</el-form-item>
				<!-- <el-form-item label="实收金额(元)" prop="sbmc">
					<el-input-number v-model="ruleForm.sbmc" min="1" max="10000000" placeholder="请输入应收金额" controls-position="right" />
				</el-form-item> -->
				<el-form-item label="账单时间" prop="billingDate">
					<el-date-picker v-model="ruleForm.billingDate" type="month" value-format="YYYY-MM-DD" placeholder="请选择账单时间" style="width: 100%" />
				</el-form-item>
				<el-form-item label="收款状态" prop="paymentStatus">
					<el-select v-model="ruleForm.paymentStatus" default-first-option clearable placeholder="请选择收款状态">
						<el-option v-for="(item, index) in paymentStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开票金额(元)" prop="invoiceAmount">
					<el-input-number
						v-model="ruleForm.invoiceAmount"
						min="0.01"
						:precision="2"
						:step="0.01"
						max="10000000"
						placeholder="请输入开票金额"
						controls-position="right"
					/>
				</el-form-item>
				<el-form-item label="开票状态" prop="invoiceStatus">
					<el-select v-model="ruleForm.invoiceStatus" default-first-option clearable placeholder="请选择开票状态">
						<el-option v-for="(item, index) in invoiceStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">{{ dialogType === 'add' ? '新增' : '确认' }} </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { orderDetail } from '/@/api/goodStore/order';
import type { FormInstance, FormRules } from 'element-plus';
import {
	getPlatformSettlementGet,
	getPlatformSettlementAdd,
	getPlatformSettlementUpdate,
	getPlatformMerchantList,
} from '/@/api/platformEntry/settlementList';
import { useMessage } from '/@/hooks/message';
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const ruleFormRef = ref<FormInstance>();
const dialogType = ref<string>(''); //弹窗状态
const platformMerchantArr = ref([]) as any;
const feeTypeList = ref([
	{ label: '租金', value: 1 },
	{ label: '水费', value: 2 },
	{ label: '电费', value: 3 },
	{ label: '燃气费', value: 4 },
	{ label: '维修费', value: 5 },
]);
const paymentStatusList = ref([
	{ label: '已收款', value: 0 },
	{ label: '未收款', value: 1 },
]);
const invoiceStatusList = ref([
	{ label: '已开票', value: 0 },
	{ label: '未开票', value: 1 },
]);
const title = ref('');
const ruleForm = ref<any>({
	merchantCode: '',
	merchantName: '',
	feeType: '',
	receivableAmount: '',
	billingDate: '',
	paymentStatus: '',
	invoiceAmount: '',
	invoiceStatus: '',
});
onMounted(() => {
	getPlatformMerchantArr();
});
// 根据id查名称
const changeId = async (id: any) => {
	console.log('id', id);
	if (id) {
		console.log('platformMerchantArr.value', platformMerchantArr.value);
		console.log(
			'platformMerchantArr.value.find((item: any) => item.code === id)',
			platformMerchantArr.value.find((item: any) => item.code === id)
		);
		ruleForm.value.merchantName = platformMerchantArr.value.find((item: any) => item.code === id).name;
	} else {
		ruleForm.value.merchantName = '';
	}
	// console.log('id', id);
	// console.log(
	// 	'platformMerchantArr.value.find((item: any) => item.code === id)',
	// 	platformMerchantArr.value.find((item: any) => item.code === id)
	// );
};
watch(
	() => ruleForm.value.merchantCode,
	(id) => {
		if (id) {
			if (!platformMerchantArr.value) {
				ruleForm.value.merchantName = platformMerchantArr.value.find((item: any) => item.code === id).name;
			}
		} else {
			ruleForm.value.merchantName = '';
		}
	}
);

const getPlatformMerchantArr = async () => {
	try {
		let res = await getPlatformMerchantList();
		if (res.code === 0) {
			console.log('res', res);
			platformMerchantArr.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const openDialog = async (type: string, row?: any) => {
	getPlatformMerchantArr();
	Object.assign(ruleForm.value, {
		merchantCode: '',
		merchantName: '',
		feeType: '',
		receivableAmount: '',
		billingDate: '',
		paymentStatus: '',
		invoiceAmount: '',
		invoiceStatus: '',
	});
	dialogType.value = type ? type : 'add';
	if (row?.id) {
		title.value = '编辑';
		getDetail(Number(row.id));
	} else title.value = '数据录入';
	visible.value = true;
};

const getDetail = async (id: number) => {
	try {
		const res = await getPlatformSettlementGet(id);
		if (res.code === 0) {
			Object.assign(ruleForm.value, res.data);
			ruleForm.value.billingDate = res.data.billingDate ? res.data.billingDate + '-01' : '';
			ruleForm.value.paymentStatus = res.data.paymentStatus ? 1 : 0;
			ruleForm.value.invoiceStatus = res.data.invoiceStatus ? 1 : 0;
			ruleForm.value.merchantCode = res.data.merchantCode;
			changeId(ruleForm.value.merchantCode);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const rules = reactive<FormRules<any>>({
	merchantCode: [{ required: true, message: '请输入商家ID', trigger: 'blur' }],
	merchantName: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
	feeType: [{ required: true, message: '请选择费用类型', trigger: 'blur' }],
	receivableAmount: [{ required: true, message: '请输入应收金额', trigger: 'blur' }],
	sbmc: [{ required: true, message: '请输入实收金额', trigger: 'blur' }],
	billingDate: [{ required: true, message: '请选择账单时间', trigger: 'blur' }],
	paymentStatus: [{ required: true, message: '请选择收款状态', trigger: 'blur' }],
	invoiceAmount: [{ required: true, message: '请输入开票金额', trigger: 'blur' }],
	invoiceStatus: [{ required: true, message: '请选择开票状态', trigger: 'blur' }],
});
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', ruleForm.value);
			try {
				let res = dialogType.value === 'add' ? await getPlatformSettlementAdd(ruleForm.value) : await getPlatformSettlementUpdate(ruleForm.value);
				if (res.code === 0) {
					visible.value = false;
					emit('refresh');
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
.uploader-text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #999;
	font-size: 14px;
	.avatar-uploader-icon {
		margin-bottom: 5px;
		font-size: 32px;
	}
}
:deep(.el-input-number__decrease) {
	display: none;
}
:deep(.el-input-number__increase) {
	display: none;
}
:deep(.el-input-number .el-input__inner) {
	text-align: left;
}
</style>
