<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="40%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item label="消息标题" prop="title">
					<el-input v-model="model.title" placeholder="请输入消息标题" maxlength="20" show-word-limit clearable />
				</el-form-item>
				<el-form-item label="消息内容" prop="content">
					<editor v-model:get-html="model.content" height="400" />
				</el-form-item>
				<el-form-item label="消息类型" prop="type">
					<el-radio-group v-model="model.type">
						<el-radio :label="item.code" v-for="(item, index) in msgTypeList" :key="index">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">保存</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { MsgConfigTypes } from '../types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { addMessage, updateMessage, messageDetail } from '/@/api/portal/index';

const emit = defineEmits(['refresh']);

const dialogTitle = ref('新增消息');
const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const scopeId = ref<string | null>('');
const loading = ref(false);

const msgTypeList = ref<any[]>([
	{
		name: '系统消息',
		code: 1,
	},
	{
		name: '业务消息',
		code: 2,
	},
]);

const model = ref<MsgConfigTypes>({
	id: '',
	title: '',
	content: '',
	type: 1,
});

const formRules = reactive<FormRules>({
	title: [{ required: true, message: '请输入标题' }],
	content: [{ required: true, message: '请输入内容' }],
	type: [{ required: true, message: '请选择类型' }],
});
const openDialog = async (id?: string | null) => {
	scopeId.value = id ?? null;
	if (id) {
		dialogTitle.value = '编辑消息';
		try {
			const { code, data } = await messageDetail(id);
			if (code === 0) {
				model.value = data;
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = '新增消息';
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
				await useMessageBox().confirm(`是否保存${scopeId.value ? '编辑' : '新增'}的消息内容？`, `${scopeId.value ? '编辑' : '新增'}消息`);
			} catch {
				return false;
			}
			try {
				const request = scopeId.value ? updateMessage : addMessage;
				const params = {
					...model.value,
				};
				const { code, msg } = await request(params);
				loading.value = false;
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '编辑' : '新建'}成功`);
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
		id: '',
		title: '',
		content: '',
		type: 1,
	};
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm(formEl);
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
