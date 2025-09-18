<template>
	<el-dialog v-model="dialogVisible" :title="isEdit ? '编辑' : '新增'" width="400px" :close-on-click-modal="false" @close="handleClose">
		<el-form ref="formRef" :model="form" :rules="rules" label-width="90px" label-position="right">
			<el-form-item label="上级机构:" prop="parentCategory">
				<el-input v-model="form.parentCategory" disabled style="width: 100%" />
			</el-form-item>

			<el-form-item label="机构名称:" prop="orgName">
				<el-input v-model="form.orgName" placeholder="请输入" style="width: 100%" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { postUserOutOrganizationAdd, putUserOutOrganizationUpdate } from '/@/api/member/staffCenter/institution';

// Emits
const emit = defineEmits(['submit']);

// 响应式数据
const dialogVisible = ref(false);
const formRef = ref();
const currentRow = ref(null); // 当前编辑的行数据

const form = reactive({
	id: null,
	parentCategory: '',
	orgName: '',
	parentId: '', //父级id
});
const isEdit = ref(false);

// 表单验证规则
const rules = {
	orgName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
};

// 重置表单
const resetForm = () => {
	if (formRef.value) {
		formRef.value.resetFields();
	}
	Object.assign(form, {
		id: null,
		parentCategory: '',
		orgName: '',
		parentId: '', //父级id
	});
};

// 对外暴露的打开弹框方法
const openDialog = (type: string, row?: any) => {
	if (type === 'add') {
		isEdit.value = false;
		currentRow.value = row;
		form.id = null;
		form.orgName = '';
		form.parentCategory = row.label;
		form.parentId = row.id;
	} else {
		isEdit.value = true;
		form.id = row.id;
		form.orgName = row.orgName;
		form.parentCategory = row.parentCategory;
	}
	dialogVisible.value = true;
};

// 关闭弹框
const handleClose = () => {
	dialogVisible.value = false;
	currentRow.value = null;
	resetForm();
};

// 提交表单
const handleSubmit = async () => {
	try {
		await formRef.value.validate();

		// 提交数据
		const submitData = {
			...form,
			id: isEdit.value ? form.id : '',
		};
		console.log('submitData', submitData);
		try {
			const { code, msg } = isEdit.value ? await putUserOutOrganizationUpdate(submitData) : await postUserOutOrganizationAdd(submitData);
			if (code === 0) {
				useMessage().success(isEdit.value ? '编辑成功' : '新增成功');
			} else {
				useMessage().error(msg);
			}
		} catch (error: any) {
			useMessage().error(error.msg);
		}
		emit('submit');
		handleClose();
	} catch (error) {
		useMessage().error('请检查表单填写是否正确');
	}
};

// 对外暴露方法
defineExpose({
	openDialog,
});
</script>
