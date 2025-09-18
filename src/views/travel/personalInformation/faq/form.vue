<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="50%" :close-on-click-modal="false" :show-close="false">
			<el-scrollbar height="400px">
				<el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="100px">
					<el-form-item label="问题名称:" prop="question" class="pr-5">
						<div v-if="!isEdit">{{ formData.question }}</div>
						<el-input v-if="isEdit" placeholder="请输入问题名称" maxlength="30" v-model="formData.question" clearable />
					</el-form-item>
					<el-form-item label="内容解答:" prop="answer" class="pr-5">
						<editor-text v-if="isEdit" v-model:get-html="formData.answer" :constraintLength="30" :excludeKeys="excludeKeys" height="400" />
						<div v-if="!isEdit" v-html="formData.answer"></div>
						<!-- <div v-if="!isEdit">{{ formData.answer }}</div> -->
					</el-form-item>
					<el-form-item label="排序:" prop="sequence" class="pr-5">
						<div v-if="!isEdit">{{ formData.sequence }}</div>
						<el-input v-if="isEdit" type="number" placeholder="请输入排序" min="0" v-model="formData.sequence" :disabled="!isEdit" clearable />
					</el-form-item>
				</el-form>
			</el-scrollbar>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { commonQuestionsUpdate, commonQuestionsAdd } from '/@/api/travel/personalInformation';
import type { FormInstance, FormRules } from 'element-plus';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('新增');
const ruleFormRef = ref<FormInstance>();
const isEdit = ref(false);
const excludeKeys = ref(['group-image', 'group-video', 'insertTable', 'codeBlock', 'emotion', 'insertLink']);

interface RuleForm {
	question: string;
	answer: string;
	sequence: number | string;
	id: string | number;
}
const formData = ref<RuleForm>({
	question: '',
	answer: '',
	sequence: '',
	id: '',
});
const rules = reactive<FormRules<RuleForm>>({
	question: [{ required: true, message: '请输入问题名称', trigger: 'blur' }],
	answer: [{ required: true, message: '请输入内容解答', trigger: 'blur' }],
	sequence: [{ required: true, message: '请输入序号', trigger: 'blur' }],
});
const openDialog = (type: string, row?: any) => {
	if (type == 'add') {
		isEdit.value = true;
		dialogTitle.value = '新增';
	}
	if (type == 'see') {
		isEdit.value = false;
		dialogTitle.value = '查看';
	} else if (type == 'edit') {
		isEdit.value = true;
		dialogTitle.value = '编辑';
	}
	visible.value = true;
	nextTick(() => {
		if (type == 'edit' || type == 'see') {
			formData.value = { ...row };
		}
	});
};

const submitForm = async (formEl: FormInstance | undefined) => {
	if (formData.value.answer) {
		const answer: any = formData.value.answer;
		const answerText = answer.replace(/<\/?[^>]*>/g, '');
		if (answerText.length > 300) {
			useMessage().error('内容解答不能超过300字');
			return;
		}
		if (answerText.length < 1 || !formData.value.answer || !answerText) {
			useMessage().error('内容解答不能为空');
			return;
		}
	}
	if (!formData.value.sequence.toString()) {
		useMessage().error('请输入序号');
		return;
	}
	if (!formEl) return;
	await formEl.validate(async (valid, fields: any) => {
		if (valid) {
			const request = formData.value.id ? commonQuestionsUpdate : commonQuestionsAdd;
			const response = await request(formData.value);
			if (response.ok) {
				ElMessage.success(response.msg || '操作成功');
				emit('refresh');
				if (!formEl) return;
				formEl.resetFields();
				formData.value.id = '';
				visible.value = false;
			} else {
				useMessage().error(response.msg);
			}
		} else {
			if (fields.msg) useMessage().error(fields.msg);
		}
	});
};
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	formData.value.id = '';
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
