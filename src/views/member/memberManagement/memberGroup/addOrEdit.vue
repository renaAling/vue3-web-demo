<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="30%" :close-on-click-modal="false" :before-close="resetForm">
			<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="80px">
				<el-form-item label="分组名称" prop="name">
					<el-input placeholder="请输入分组名称" maxlength="30" v-model="formData.name" clearable />
				</el-form-item>
				<el-form-item label="分组说明" prop="description">
					<el-input placeholder="请输入分组说明" maxlength="50" v-model="formData.description" clearable />
				</el-form-item>
				<!-- <el-form-item label="分组状态" prop="status">
					<el-select v-model="formData.status" placeholder="请选择分组状态" size="large" style="width: 240px">
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="2" />
					</el-select>
				</el-form-item> -->
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
import { ElForm, ElMessage } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { putMemberGroupUpdate, postMemberGroupAdd } from '/@/api/member/memberGroup';
import type { FormInstance, FormRules } from 'element-plus';
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('新增分组');
const ruleFormRef = ref<FormInstance>();
interface RuleForm {
	name: '';
	description: '';
	code: '';
	id: '';
}
const formData = ref<RuleForm>({
	name: '',
	description: '',
	code: '',
	id: '',
});
const rules = reactive<FormRules<RuleForm>>({
	name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
	// status: [{ required: true, message: '请选择分组状态', trigger: 'blur' }],
});
const openDialog = async (row?: any) => {
	console.log('row', row);
	if (row?.id) {
		dialogTitle.value = '编辑分组';
		const { name, description, code, id } = row;
		formData.value = { name, description, code, id };
	} else {
		dialogTitle.value = '新增分组';
	}
	visible.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			console.log('formData.value', formData.value);
			const request = formData.value.code ? putMemberGroupUpdate : postMemberGroupAdd;
			const response = await request(formData.value);
			if (response.code === 0) {
				ElMessage.success(response.msg || '操作成功');
				emit('refresh');
				resetForm();
			} else {
				useMessage().error(response.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
// const submitForm = () => {
// 	console.log('myDialog.value', myDialog.value);
// 	myDialog.value &&
// 		myDialog.value.validate(async (valid: boolean) => {
// 			if (valid) {
// 				try {
// 					const request = formData.value.id ? pageGroupaUpdate : pageGroupaAdd;
// 					const { code, msg } = await request(formData.value);
// 					if (code === 0) {
// 						ElMessage.success(msg || '操作成功');
// 						emit('refresh');
// 						resetForm();
// 					} else {
// 						useMessage().error(msg);
// 					}
// 				} catch (error: any) {
// 					useMessage().error(error.msg);
// 				}
// 			}
// 		});
// };
const resetForm = () => {
	formData.value = {
		name: '',
		description: '',
		code: '',
	};
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
