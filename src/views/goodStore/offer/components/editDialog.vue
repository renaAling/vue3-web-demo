<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="title" draggable v-model="visible">
			<el-form :model="dataForm" :rules="dataRules" label-width="120px" ref="dataFormRef" v-loading="loading">
				<el-form-item label="供应商名称" prop="supplierName">
					<el-input placeholder="请输入供应商名称" maxlength="50" v-model="dataForm.supplierName" clearable></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialog()">取消</el-button>
					<el-button @click="onSubmit" type="primary" :disabled="loading">保存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
import { useMessage } from '/@/hooks/message';
import { addSupplierApi, updateSupplierApi } from '/@/api/goodStore/offer';

// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const relatedId = ref('');
const title = ref('新增供应商');

const dataForm = ref({
	supplierName: null,
});

const dataRules = ref({
	supplierName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
});

// 打开弹框
const openDialog = async (opt: any) => {
	console.log('打开弹框：', opt);
	dataForm.value.supplierName = null;
	visible.value = true;
	if (opt?.id) {
		relatedId.value = opt.id;
		setFormValues(opt);
		title.value = '编辑供应商';
	} else {
		setFormValues();
		title.value = '新增供应商';
	}
};
const closeDialog = () => {
	title.value = '';
	setFormValues();
	visible.value = false;
};

const setFormValues = (data?: any) => {
	if (!data || Object.keys(data).length === 0) {
		// 未传入数据，清空表单
		relatedId.value = '';
		dataForm.value.supplierName = null;
		return;
	}

	// 设置表单值
	dataForm.value.supplierName = data.supplierName;
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		let params = {
			id: relatedId.value ? relatedId.value : undefined,
			...dataForm.value,
		};
		loading.value = true;
		const request = relatedId.value ? updateSupplierApi : addSupplierApi;
		const { code, msg } = await request(params);
		if (code === 0) {
			useMessage().success(relatedId.value ? '编辑成功' : '创建成功');
			closeDialog();
			emit('refresh');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
