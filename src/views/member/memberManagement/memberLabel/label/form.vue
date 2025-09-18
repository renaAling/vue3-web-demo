<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" width="500" draggable v-model="visible" :before-close="resetForm">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="标签分类" prop="categoryCode">
				<el-select v-model="form.categoryCode" placeholder="请选择标签分类" clearable>
					<el-option v-for="item in categoryCodeList" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode" />
				</el-select>
			</el-form-item>
			<el-form-item label="标签名称" prop="name">
				<el-input placeholder="请输入标签名称" clearable v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="标签说明" prop="description">
				<el-input placeholder="请输入标签说明" clearable v-model="form.description"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="accountForm" setup>
import { postMemberSignAdd, putMemberSignUpdate, getMemberSignCategoryList, getMemberSignCategoryById } from '/@/api/member/memberLabel/label';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const categoryCodeList = ref<any[]>([]);

// 提交表单数据
const form = reactive({
	name: '',
	categoryCode: '',
	time: '',
	description: '',
	id: '',
});
// 定义校验规则
const dataRules = ref({
	categoryCode: [{ required: true, message: '标签分类不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row?: any) => {
	visible.value = true;
	getMemberSignCategory();
	form.id = '';
	dataFormRef.value.resetFields();
	if (row) {
		form.id = row.id;
		Object.assign(form, row);
	}
};
const getMemberSignCategory = async () => {
	try {
		loading.value = true;
		const { code, data, msg } = await getMemberSignCategoryList();
		if (code === 0) {
			console.log('data', data);
			categoryCodeList.value = data;
			loading.value = false;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const closeMyDialog = () => {
	visible.value = false;
};

// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	closeMyDialog();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const request = form.id ? await putMemberSignUpdate : await postMemberSignAdd;
		const response = await request(form);
		if (response.code === 0) {
			useMessage().success('操作成功');
			emit('refresh');
			resetForm();
		} else {
			useMessage().error(response.msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
