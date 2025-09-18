<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="50%" :close-on-click-modal="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-card>
					<template #header> <span class="font-bold">基础信息</span> </template>
					<el-form-item label="供应商名称" prop="name">
						<el-input
							v-model="model.name"
							type="text"
							placeholder="输入供应商名称"
							maxlength="30"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="联系人" prop="contactName">
						<el-input
							v-model="model.contactName"
							type="text"
							placeholder="请输入联系人"
							maxlength="10"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="联系电话" prop="contactTelephone">
						<el-input
							v-model="model.contactTelephone"
							type="text"
							placeholder="请输入联系电话"
							maxlength="11"
							@input="model.contactTelephone = model.contactTelephone.replace(/^(0+)|[^\d]+/g, '')"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="备注" type="textarea" prop="remark">
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
				<el-card class="mt-3">
					<template #header> <span class="font-bold">售后信息</span> </template>
					<el-form-item label="客服电话" prop="csTelephone">
						<el-input
							v-model="model.csTelephone"
							type="text"
							placeholder="请输入客服电话"
							maxlength="11"
							@input="model.contactTelephone = model.contactTelephone.replace(/^(0+)|[^\d]+/g, '')"
							show-word-limit
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="售后地址" prop="afterSalesAddress">
						<el-input
							v-model="model.afterSalesAddress"
							type="text"
							placeholder="请输入售后地址"
							maxlength="200"
							show-word-limit
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
import { supplierAdd, supplierUpdate, supplierGet } from '/@/api/culture/supplier';
import { useMessage, useMessageBox } from '/@/hooks/message';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('新建供应商');
const formRef = ref();
const scopeId = ref<string | null>('');
const model = ref<Supplier>({
	name: '',
	contactName: '',
	contactTelephone: '',
	remark: '',
	csTelephone: '',
	afterSalesAddress: '',
});
//   表单校验规则
const formRules = reactive<FormRules>({
	name: [{ required: true, message: '供应商名称不能为空' }],
});
const openDialog = async (id: string | null) => {
	scopeId.value = id;
	if (id) {
		dialogTitle.value = '编辑供应商';
		try {
			const { code, data } = await supplierGet(id);
			if (code === 0) {
				model.value = { ...data };
				// useMessage().success(data.msg);
			}
		} catch (err: any) {
			useMessage().error(err);
		}
	} else {
		dialogTitle.value = '新建供应商';
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
				await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}供应商`, '创建供应商');
			} catch {
				return false;
			}
			try {
				const request = scopeId.value ? supplierUpdate : supplierAdd;
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
const hasValues = (obj: Supplier) => {
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && obj[key] !== '') {
			return true;
		}
	}
	return false;
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	const isEmptyForm = !hasValues(model.value);
	if (isEmptyForm || scopeId.value) return resetForm(formEl);
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
