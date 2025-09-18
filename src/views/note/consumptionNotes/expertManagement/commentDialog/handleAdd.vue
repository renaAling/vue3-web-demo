<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="40%" :before-close="resetForm">
			<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
				<el-form-item label="手机号:" prop="phone">
					<el-input placeholder="请输入" clearable v-model="formData.phone" @change="handleChange" />
				</el-form-item>
				<!-- 调接口找用户昵称 -->
				<el-form-item label="用户昵称:" prop="userId">
					{{ formData?.nickName || '-' }}
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm">取消</el-button>
					<el-button type="primary" :disabled="!formData?.nickName" @click="submitForm(ruleFormRef)">确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ElForm } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { expertAddApi, getByMobileApi } from '/@/api/note/noteInfo';

const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('新增');
const ruleFormRef = ref<FormInstance>();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const formData = reactive<any>({
	userId: null,
	phone: null,
});
const rules = reactive<FormRules<any>>({
	phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
});

const openDialog = (row?: any) => {
	console.log('row', row);
	if (row?.id) {
		dialogTitle.value = '编辑';
	} else {
		dialogTitle.value = '新增';
	}
	visible.value = true;
};

const handleChange = async (val: any) => {
	const res = await getByMobileApi(val);
	if (res?.ok && res?.data) {
		formData.userId = res?.data?.channelUserCode;
		formData.nickName = res?.data?.nickName;
	} else {
		useMessage().error(res?.msg || '操作失败');
		formData.userId = null;
		formData.nickName = null;
	}
};

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid: boolean) => {
		if (!valid) return;
		try {
			const response = await expertAddApi(formData);
			if (response?.ok) {
				useMessage().success(response.msg || '操作成功');
				emit('refresh');
				visible.value = false;
			} else {
				useMessage().error(response.msg);
			}
		} catch (error: any) {
			useMessage().error(error.msg || '操作失败');
		}
	});
};
const resetForm = () => {
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
