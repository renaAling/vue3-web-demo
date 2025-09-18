<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="40%" :before-close="resetForm">
			<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
				<el-form-item label="标签名称:" prop="name">
					<el-input placeholder="请输入标签名称" maxlength="30" v-model="formData.name" clearable />
				</el-form-item>
				<el-form-item label="标签分类:" prop="category">
					<el-select v-model="formData.category" placeholder="请选择标签分类" clearable>
						<el-option v-for="value in tagList" :key="value.value" :label="value.label" :value="value.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序权重:" prop="sort">
					<el-input-number v-model="formData.sort" controls-position="right" :min="0" :max="99999" :precision="0" />
				</el-form-item>
				<el-form-item label="显示状态:" prop="status">
					<el-switch v-model="formData.status" :active-value="true" :inactive-value="false" />
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
import { ElForm } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { userCommentAddApi, userCommentUpdateApi, userCommentDetailApi } from '/@/api/note/noteInfo';
import { tagList } from '../hook/index';

const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('新增');
const ruleFormRef = ref<FormInstance>();
const emit = defineEmits(['refresh']);
const formData = ref<any>({
	id: null,
	name: '',
	category: '',
	sort: '',
	status: true,
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
	category: [{ required: true, message: '请选择', trigger: 'change' }],
	sort: [{ required: true, message: '请输入排序权重', trigger: 'blur' }],
	status: [{ required: true, message: '请选择', trigger: 'change' }],
});
const openDialog = (row?: any) => {
	if (row?.id) {
    userCommentDetail(row?.id);
		dialogTitle.value = '编辑';
	} else {
		dialogTitle.value = '新增';
	}
	visible.value = true;
};
const userCommentDetail = async (id: string) => {
	const res = await userCommentDetailApi(id);
	formData.value = { ...res.data };
}
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	const valid = await ruleFormRef.value?.validate().catch(() => {});
	if (!valid) return false;
	try {
		const response = formData.value.id ? await userCommentUpdateApi(formData.value) : await userCommentAddApi(formData.value);
		if (response.code === 0) {
			useMessage().success(response.msg || '操作成功');
			emit('refresh');
			visible.value = false;
		} else {
			useMessage().error(response.msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const resetForm = () => {
  ruleFormRef.value?.resetFields();
	formData.value = {};
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
