<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="50%" :close-on-click-modal="false" :before-close="resetForm">
			<el-scrollbar height="300px">
				<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
					<el-form-item label="模板ID:" prop="name">
						<div>{{ formData.name }}</div>
					</el-form-item>
					<el-form-item label="模板名称:" prop="name">
						<div>{{ formData.name }}</div>
					</el-form-item>
					<el-form-item label="模板内容:" prop="name">
						<div>{{ formData.description }}</div>
					</el-form-item>
					<el-form-item label="推送途径:" prop="name">
						<div>{{ formData.name }}</div>
					</el-form-item>
					<el-form-item label="触发时机:" prop="index">
						<div>{{ formData.index }}</div>
					</el-form-item>
				</el-form>
			</el-scrollbar>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm">取消</el-button>
					<el-button type="primary" @click="resetForm">确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ref } from 'vue';
import { ElForm } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('查看');
const ruleFormRef = ref<FormInstance>();

interface RuleForm {
	name: '';
	description: '';
	index: '';
	id: '';
}
const formData = ref<RuleForm>({
	name: '',
	description: '',
	index: '',
	id: '',
});
const rules = reactive<FormRules<RuleForm>>({
});
const openDialog = (row?: any) => {
	visible.value = true;
	nextTick(() => {});
};
// };
const resetForm = () => {
	emit('refresh');
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
