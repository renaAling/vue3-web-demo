<template>
	<el-dialog :close-on-click-modal="false" title="充值" width="800" draggable v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="充值金额" prop="rechargeAmount">
				<el-input-number placeholder="请输入充值金额" :min="0" :precision="2" clearable v-model="form.rechargeAmount"></el-input-number>
			</el-form-item>
			<el-form-item label="充值类型" prop="rechargeType">
				<el-select v-model="form.rechargeType" placeholder="请输入充值类型">
					<el-option label="餐补账户" :value="1" />
					<el-option label="现金账户" :value="2" />
				</el-select>
			</el-form-item>
			<!-- <el-form-item label="备注" prop="remark">
				<el-input placeholder="请输入备注" clearable v-model="form.remark"></el-input>
			</el-form-item> -->
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="rechargeForm" setup>
import { synRechargeOrSynCashRechargeApi } from '/@/api/member/memberManagement/accountManager';

import { useMessage } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	userPhone: '',
	rechargeAmount: '',
	rechargeType: '',
	// remark: '',
	guid: '',
});

// 定义校验规则
const dataRules = ref({
	rechargeAmount: [{ required: true, message: '充值金额不能为空', trigger: 'blur' }],
	rechargeType: [{ required: true, message: '充值类型不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	form.id = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		if (row.userInfo.mobile) {
			Object.assign(form, row);
			form.userPhone = row.userInfo.mobile;
		}
	});
};
const closeMyDialog = () => {
	visible.value = false;
};

// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	closeMyDialog();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, data, msg } = await synRechargeOrSynCashRechargeApi(form);
		if (code == 0) {
			useMessage().error(data);
			// resetForm();
			// emit('refresh');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
