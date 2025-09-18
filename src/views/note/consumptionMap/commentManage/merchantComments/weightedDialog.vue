<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="40%" :before-close="resetForm">
			<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="120px">
				<el-form-item label="当前评分:">
					{{ scoreNow }}
				</el-form-item>
				<el-form-item label="加权调整:" prop="score">
					<el-input-number placeholder="请输入" v-model="formData.score" clearable :min="-2" :max="2" :precision="1" />
					<span> 支持正负小数,范围-2~+2 </span>
				</el-form-item>
				<el-form-item label="最终评分:" prop="radius">
					{{ scoreNow + formData.score }}
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
import { storeUpdateScoreApi } from '/@/api/note/noteInfo';
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('加权调整');
const ruleFormRef = ref<FormInstance>();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const scoreNow = ref(0);
const formData = ref<any>({
	ipoCode: 0,
	score: 0,
});

const rules = reactive<FormRules<any>>({
	score: [{ required: true, message: '请输入加权调整', trigger: 'blur' }],
});

const openDialog = (row?: any) => {
	if (row?.id) {
		dialogTitle.value = '加权调整';
		formData.value = { ...row, score: 0 };
		scoreNow.value = row.score;
	}
	visible.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid: boolean) => {
		if (!valid) return;
		try {
			const response = await storeUpdateScoreApi(formData.value);
			if (response.code === 0) {
				useMessage().success(response.msg || '操作成功');
				emit('refresh');
				visible.value = false;
			} else {
				useMessage().error(response.msg);
			}
		} catch (error) {
			console.log(error);
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
