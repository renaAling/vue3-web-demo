<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="40%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item label="分组名称" prop="name">
					<el-input v-model="model.name" placeholder="请输入分组名称" maxlength="200" clearable />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { addGroup, groupDetail, updateGroup } from '/@/api/portal';

const emit = defineEmits(['refresh']);
const dialogTitle = ref('新建分组');
const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const scopeId = ref<string | null>('');
const loading = ref(false);
const model = ref({
	name: '',
	id: '',
});
const formRules = reactive<FormRules>({
	name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
});
const openDialog = async (id: string | null) => {
	scopeId.value = id;
	if (id) {
		dialogTitle.value = '编辑分组';
		try {
			const { code, data } = await groupDetail({ id });
			if (code === 0) {
				model.value = data;
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = '新建分组';
	}
	visible.value = true;
};
const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	loading.value = true;
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				const request = scopeId.value ? updateGroup : addGroup;
				const params = {
					...model.value,
				};
				const { code, msg } = await request(params);
				loading.value = false;
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改' : '新建'}成功`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
				loading.value = false;
			}
		} else {
			loading.value = false;
			return false;
		}
	});
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		name: '',
		id: '',
	};
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	resetForm(formEl);
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
