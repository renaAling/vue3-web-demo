<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="title" draggable v-model="visible" width="30%">
			<el-form :model="dataForm" :rules="dataRules" label-width="120px" ref="dataFormRef" v-loading="loading">
				<el-form-item label="分类名称" prop="name">
					<el-input placeholder="请输入分类名称" maxlength="12" show-word-limit v-model="dataForm.name" clearable></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="refreshData(dataFormRef)">取消</el-button>
					<el-button @click="onSubmit(dataFormRef)" type="primary" :disabled="loading">保存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
import { useMessage } from '/@/hooks/message';
import { addGroup, updateGroup, groupList, sysConfigList, groupDetail } from '/@/api/portal';
import type { FormInstance, FormRules } from 'element-plus';
// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const dataForm = ref({
	id: '',
	groupId: '',
	name: '' as string | undefined,
	description: '',
	imageUrl: '',
	tenantId: '',
	linkType: 1,
	jumpLink: '',
	subSysId: '',
	subSysName: '',
});

// 打开弹窗
const title = ref('');
const scopeId = ref(''); //数据ID

const dataRules = ref({
	name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
});
const openDialog = async (id: string, pid: number) => {
	scopeId.value = id;
	const pre = id ? `编辑` : `新增`;
	const next = pid == 0 ? '分类' : '子系统';
	title.value = `${pre}${next}`;
	dataForm.value.id = '';
	if (id) {
		const { code, data } = await groupDetail({ id });
		if (code === 0) {
			dataForm.value = data;
			visible.value = true;
		}
	} else {
		visible.value = true;
	}
};

// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	let request = null;
	request = dataForm.value.id ? updateGroup : addGroup;
	try {
		const { code, data } = await request(dataForm.value);
		if (code === 0) {
			useMessage().success(dataForm.value.id ? '编辑成功' : '创建成功');
			refreshData(formEl);
			emit('refresh');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};
const refreshData = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl?.resetFields();
	dataForm.value = {
		id: '',
		groupId: '',
		name: '' as string | undefined,
		description: '',
		imageUrl: '',
		tenantId: '',
		linkType: 1,
		jumpLink: '',
		subSysId: '',
		subSysName: '',
	};
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
