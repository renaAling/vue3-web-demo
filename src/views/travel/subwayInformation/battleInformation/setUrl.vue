<template>
	<div>
		<el-dialog title="配置接口地址" ref="myDialog" v-model="visible" width="30%" :close-on-click-modal="false" :before-close="resetForm">
			<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
				<el-form-item label="接口地址:" prop="interfaceUrl">
					<el-input placeholder="请输入接口地址" v-model="formData.interfaceUrl" clearable />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ref } from 'vue';
import { ElForm } from 'element-plus';
import { putInterfaceConfigUpdateApi } from '/@/api/travel/subwayInformation';
import { useMessage } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const ruleFormRef = ref<FormInstance>();
interface RuleForm {
	id: number | null;
	interfaceUrl: '';
}
const formData = ref<RuleForm>({
	id: 0,
	interfaceUrl: '',
});
const rules = reactive<FormRules<RuleForm>>({
	interfaceUrl: [{ required: true, message: '请输入接口地址', trigger: 'blur' }],
});
const openDialog = (row?: any) => {
	if (row?.id) {
		formData.value.id = Number(row.id);
	}
	formData.value.interfaceUrl = row?.interfaceUrl || '';
	visible.value = true;
};

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields: any) => {
		if (valid) {
			const response = await putInterfaceConfigUpdateApi(formData.value);
			if (response.code === 0) {
				useMessage().success(response.msg || '操作成功');
				emit('refresh');
				formData.value = {
					id: 0,
					interfaceUrl: '',
				};
				visible.value = false;
			} else {
				useMessage().error(response.msg);
			}
		} else {
			if (fields.msg) useMessage().error(fields.msg);
		}
	});
};
const resetForm = () => {
	formData.value = {
		id: 0,
		interfaceUrl: '',
	};
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
