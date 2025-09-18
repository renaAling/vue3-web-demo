<template>
	<el-dialog :close-on-click-modal="false" title="新增用户协议" width="450" draggable v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="协议标题" prop="name">
				<el-input placeholder="请输入" clearable v-model="form.name" maxlength="20"></el-input>
			</el-form-item>
			<el-form-item label="版本号" prop="version">
				<el-input placeholder="请输入" clearable v-model="form.version" maxlength="12"></el-input>
			</el-form-item>
			<el-form-item label="协议内容" prop="context">
				<el-input placeholder="请输入" type="textarea" rows="8" clearable v-model="form.context"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { useI18n } from 'vue-i18n';
import { addProtocol, getByProtocolId, updateSingleProtocol } from '/@/api/points/agreement';
import { useMessage } from '/@/hooks/message';
// 定义子组件向父组件传值/事件
const { t } = useI18n();

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	name: '',
	version: '',
	context: '',
	groupCode: 'score_agreement',
	id: '',
});

// 定义校验规则
const dataRules = ref({
	name: [{ required: true, message: '协议标题不能为空', trigger: 'blur' }],
	version: [{ required: true, message: '协议号不能为空', trigger: 'blur' }],
	context: [{ required: true, message: '协议内容不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
	});
	if (id) {
		form.id = id;
		getData(id);
	}
};

// 根据id获取详情
const getData = (id: string) => {
	getByProtocolId({ protocolId: id }).then((res) => {
		Object.assign(form, res.data);
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		form.id ? await updateSingleProtocol(form) : await addProtocol(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
