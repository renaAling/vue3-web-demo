<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="50%" :close-on-click-modal="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-card>
					<template #header> <span class="font-bold">基础信息</span> </template>
					<el-form-item label="运营商名称" prop="name">
						<el-input
							v-model="model.name"
							type="text"
							placeholder="输入运营商名称"
							maxlength="30"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="备注说明" type="textarea" prop="remark">
						<el-input
							v-model="model.remark"
							type="text"
							maxlength="200"
							show-word-limit
							placeholder="请输入备注信息"
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
				</el-card>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Supplier } from './types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { serviceProvidersAdd, serviceProvidersUpdate, serviceProvidersDetail } from '/@/api/ad/serviceProvider';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('新建运营商');
const formRef = ref();
const scopeId = ref<string | null>('');
const model = ref<Supplier>({
	code: '',
	name: '',
	remark: '',
});
//   表单校验规则
const formRules = reactive<FormRules>({
	name: [{ required: true, message: '运营商名称不能为空' }],
});

const openDialog = async (id: string | null) => {
	scopeId.value = id;
	if (id) {
		dialogTitle.value = '编辑运营商';
		try {
			const { code, data } = await serviceProvidersDetail(id);
			if (code === 0) {
				model.value = { ...data };
			}
		} catch (err: any) {
			useMessage().error(err);
		}
	} else {
		dialogTitle.value = '新建运营商';
	}
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}运营商`, `${scopeId.value ? '编辑' : '创建'}运营商`);
			} catch {
				return false;
			}
			try {
				const request = scopeId.value ? serviceProvidersUpdate : serviceProvidersAdd;
				const { code, msg } = await request(model.value);
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改成功' : '新建成功'}`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};
// 输入框回车事件
const handleKeyUp = (enterable: Boolean) => {
	if (!enterable) return;
	onSubmit(formRef.value);
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	Object.keys(model.value).forEach((key) => (model.value[key] = ''));
	closeMyDialog();
};

// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		resetForm(formEl);
	} catch {
		return false;
	}
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
