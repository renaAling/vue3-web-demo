<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="30%" :close-on-click-modal="false">
			<el-card>
				<template #header> 基础信息 </template>
				<el-form @submit.prevent :model="model" ref="formRef" :rules="userFormRules" label-width="80px">
					<el-form-item label="员工姓名" prop="name">
						<el-input
							v-model="model.name"
							type="text"
							placeholder="输入员工姓名"
							maxlength="10"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="手机号" prop="sjh">
						<el-input
							v-model="model.sjh"
							type="text"
							placeholder="请输入手机号"
							maxlength="11"
							show-word-limit
							clearable
							@keyup.enter="handleKeyUp(true)"
						/>
					</el-form-item>
					<el-form-item label="角色" prop="role">
						<el-select @change="getDataList" placeholder="请选择员工角色" v-model="model.role" clearable>
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in supply_type" />
						</el-select>
					</el-form-item>
				</el-form>
			</el-card>
			<template #footer>
				<el-button type="info" size="default" @click="resetForm(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDict } from '/@/hooks/dict';
import type { FormInstance, FormRules } from 'element-plus';
import { rule } from '/@/utils/validate';
const myDialog = ref(null);
const dialogTitle = ref('新增');
const { supply_type } = useDict('supply_type');
const formRef = ref();
const visible = ref(false);

const userFormRules = reactive<FormRules>({
	name: [{ required: true, message: '供应商名称不能为空' }],
	sjh: [
		{ required: true, message: '手机号不能为空' },
		{ validator: rule.validatePhone, trigger: 'blur', message: '手机格式不正确' },
	],
});
const openDialog = (id: string | null) => {
	dialogTitle.value = id ? '编辑' : '新增';
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};

const getDataList = () => {};

const model = ref({
	name: '供应商',
	sjh: 1,
	role: [1],
});
/**
 * 注意： model数据模型非必填项，如果仅仅是用于数据收集，model参数可以不用填，表单的submit事件会返回所有搜集的数据对象
 *       如果是编辑的情况下，页面需要回显数据，则model数据模型必须要填写
 */
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			// console.log('model.value', model.value)
			closeMyDialog();
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
	if (!formEl) return;
	formEl.resetFields();
	closeMyDialog();
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss"></style>
