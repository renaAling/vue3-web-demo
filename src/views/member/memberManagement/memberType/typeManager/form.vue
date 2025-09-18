<template>
	<el-dialog v-model="dialogVisible" :title="isEdit ? '编辑' : '新增'" width="500px" :close-on-click-modal="false" @close="handleClose">
		<el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="right">
			<el-form-item label="上级分类:" prop="parentCategory">
				<el-input v-model="form.parentCategory" disabled style="width: 100%" />
			</el-form-item>

			<el-form-item label="分类名称:" prop="categoryName">
				<el-input v-model="form.categoryName" placeholder="请输入" style="width: 100%" />
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
import { postMemberCategoryAdd, putMemberCategoryUpdate } from '/@/api/member/memberType/typeManager';

// Emits
const emit = defineEmits(['submit']);

// 响应式数据
const dialogVisible = ref(false);
const formRef = ref();
const currentRow = ref(null); // 当前编辑的行数据

const form = reactive({
	id: null,
	parentCategory: '',
	categoryName: '',
});
const isEdit = ref(false);

// 计算属性：判断是否为编辑模式
// const isEdit = computed(() => {
// 	return currentRow.value !== null;
// });

// 表单验证规则
const rules = {
	categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
};

// 重置表单
const resetForm = () => {
	if (formRef.value) {
		formRef.value.resetFields();
	}
	Object.assign(form, {
		id: null,
		parentCategory: '',
		categoryName: '',
	});
};

// 初始化表单数据
const initFormData = (row) => {
	if (row) {
		// 编辑模式：使用传入的行数据
		Object.assign(form, {
			id: row.id,
			parentCategory: row.parentCategory || '',
			categoryName: row.categoryName || '',
		});
	}
};

// 对外暴露的打开弹框方法
const openDialog = (type: string, row: any) => {
	console.log('rowaaaaa', row);
	if (type === 'add') {
		isEdit.value = false;
		// 新增
	} else {
		isEdit.value = true;
		// 编辑
	}
	Object.assign(form, row);
	form.categoryName = row.label;
	console.log('row', row);
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
		// const submitData = {
		// 	...form,
		// 	id: isEdit.value ? form.id : '',
		// };
		try {
			const { code, msg } = isEdit.value ? await putMemberCategoryUpdate(form) : await postMemberCategoryAdd(form);
			if (code === 0) {
				useMessage().success(isEdit.value ? '编辑成功' : '新增成功');
			} else {
				useMessage().error(msg);
			}
		} catch (error: any) {
			useMessage().error(error.msg);
		}
		emit('submit');
		// useMessage().success(isEdit.value ? '编辑成功' : '新增成功');
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
