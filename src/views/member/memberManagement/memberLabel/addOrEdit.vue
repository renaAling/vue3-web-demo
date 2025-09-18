<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="40%" :close-on-click-modal="false" @close="resetForm(ruleFormRef)">
			<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="80px">
				<el-form-item label="标签名称" prop="name">
					<el-input placeholder="请输入标签名称" maxlength="50" v-model="formData.name" clearable />
				</el-form-item>
				<el-form-item label="标签说明" prop="description">
					<el-input
						placeholder="请输入标签说明"
						type="textarea"
						maxlength="200"
						:autosize="{ minRows: 4 }"
						show-word-limit
						v-model="formData.description"
						clearable
					/>
				</el-form-item>
				<el-form-item label="标签状态" prop="status">
					<el-select v-model="formData.status" placeholder="请选择标签状态" size="large" style="width: 240px">
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="2" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-label">
import { ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { pageSignAdd, pageSignUpdate } from '../../../../api/member/member';
import type { FormInstance, FormRules } from 'element-plus';
const emit = defineEmits(['refresh']);
const ruleFormRef = ref<FormInstance>();
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('新增标签');
interface RuleForm {
	id: number | null;
	name: string;
	description: string;
	code: string;
	status: 1 | 2 | null;
}
const formData = ref<RuleForm>({
	id: null,
	name: '',
	description: '',
	code: '',
	status: null,
});
const rules = reactive<FormRules<RuleForm>>({
	name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
	status: [{ required: true, message: '请选择标签状态', trigger: 'blur' }],
});
const openDialog = async (row?: any) => {
	if (row?.code) {
		dialogTitle.value = '编辑标签';
		const { id, name, description, code, status } = row;
		formData.value = { id, name, description, code, status };
	} else {
		dialogTitle.value = '新增标签';
	}
	visible.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			const request = formData.value?.code ? pageSignUpdate : pageSignAdd;
			const response = await request(formData.value);
			if (response.code === 0) {
				ElMessage.success(response.msg || '操作成功');
				emit('refresh');
				resetForm(formEl);
			} else {
				useMessage().error(response.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	formData.value = {
		name: '',
		description: '',
		code: '',
		status: null,
	};
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
