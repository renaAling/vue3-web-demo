<template>
	<el-dialog v-model="justmentDialogVisible" :title="dataForm.name + '-商品调价'" width="30%" height="932" align-center>
		<el-form @submit.prevent :model="dataForm" ref="formRef" :rules="formRules">
			<div class="mt-2 mb-2">默认为加价比例，若需减价可在数值前“-”。</div>
			<el-form-item label="" prop="priceRatio">
				<el-input v-model="dataForm.priceRatio" placeholder="请输入调价金额" @change="changepriceRatio" maxlength="9">
					<template #suffix>%</template>
				</el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" size="default" @click="onSubmit()">保存</el-button>
			<el-button type="info" size="default" @click="cancel()">取消</el-button>
		</template>
	</el-dialog>
</template>
<script setup lang="ts" name="justment">
import { ref } from 'vue';
import { JustmentTypes } from './types';
import { ElMessage } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { priceAdjustment } from '/@/api/trcomps/merchant';
const emit = defineEmits(['refresh']);
const formRef = ref();
const justmentDialogVisible = ref(false);
const dataForm = ref<JustmentTypes>({ priceRatio: '', priceDir: true, name: '' });
const formRules = ref({
	priceRatio: [{ required: true, message: '请输入调价金额', trigger: 'change' }],
});
const openDialog = (res?: JustmentTypes) => {
	justmentDialogVisible.value = true;
	if (res) {
		dataForm.value.name = res.name;
		dataForm.value.id = res.id;
		dataForm.value.priceRatio = res.priceDir === true ? res.priceRatio : res.priceDir === false ? '-' + res.priceRatio : '0';
	}
};
const changepriceRatio = (val: string) => {
	const reg = /^(\-|\+)?\d+(\.\d+)?$/;
	if (!reg.test(val)) {
		dataForm.value.priceRatio = '';
		return;
	} else {
		if (Number(val) < -100) {
			dataForm.value.priceRatio = '-100';
		} else dataForm.value.priceRatio = Number(val).toFixed(2) + '';
	}
};
const onSubmit = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		const priceRatio = Math.abs(Number(dataForm.value.priceRatio));
		const params = {
			merId: dataForm.value.id,
			priceDir: dataForm.value.priceRatio.indexOf('-') > -1 ? false : true,
			priceRatio,
		};
		const { code, msg } = await priceAdjustment(params);
		if (code === 0) {
			ElMessage.success('调价成功');
			emit('refresh');
			cancel();
		} else {
			useMessage().error(msg);
		}
	});
};
const cancel = () => {
	justmentDialogVisible.value = false;
	dataForm.value = {
		priceRatio: '',
		priceDir: true,
		name: '',
	};
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
