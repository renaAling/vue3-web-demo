<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="40%" :before-close="resetForm">
			<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
				<el-form-item label="昵称:">
					{{ currentRow?.nickName || '-' }}
				</el-form-item>
				<el-form-item label="手机号:">
					{{ currentRow?.phone || '-' }}
				</el-form-item>
				<el-form-item label="粉丝数:">
					{{ currentRow?.followerCount || '-' }}
				</el-form-item>
				<el-form-item label="解约原因:" prop="reason">
					<el-input type="textarea" placeholder="请输入" clearable v-model="formData.reason" />
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
import { expertUpdateStatusApi } from '/@/api/note/noteInfo';

const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('新增');
const ruleFormRef = ref<FormInstance>();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const formData = reactive<any>({
	reason: null,
});
const rules = reactive<FormRules<any>>({
	reason: [{ required: true, message: '请输入解约原因', trigger: 'blur' }],
});

const currentRow = ref();
const openDialog = (row?: any) => {
	console.log('row', row);
	currentRow.value = row;
	if (row?.id) {
		dialogTitle.value = '解约';
	} else {
		dialogTitle.value = '解约';
	}
	visible.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid: boolean) => {
		if (!valid) return;
		try {
			const response = await expertUpdateStatusApi({
				userId: currentRow.value?.userId,
				status: 2,
				reason: formData.reason,
			});
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
	formData.reason = '';
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
