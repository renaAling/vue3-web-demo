<template>
	<el-dialog :close-on-click-modal="false" :title="(!form.id ? '新增' : '修改') + '用户协议'" width="800" draggable
		v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="版本号" prop="version">
				<el-input placeholder="请输入版本号" disabled v-model="form.version"></el-input>
			</el-form-item>
			<el-form-item label="版本说明" prop="remark">
				<el-input placeholder="请输入版本说明" clearable v-model="form.remark" maxlength="20"></el-input>
			</el-form-item>

			<el-form-item label="协议内容" prop="context">
				<editor v-model:get-html="form.context" style="margin-top: 20px" height="400"></editor>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancel">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { useI18n } from 'vue-i18n';
import { addProtocolByScore, updateProtocolByScore, getAgreementVersion } from '/@/api/points/agreement';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义子组件向父组件传值/事件
const { t } = useI18n();

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	remark: '',
	version: '',
	context: '',
	groupCode: 'score_agreement',
	id: '',
});

// 定义校验规则
const dataRules = ref({
	version: [{ required: true, message: '协议号不能为空', trigger: 'blur' }],
	context: [{ required: true, message: '协议内容不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	form.id = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		form.context = '';
		form.remark = '';
		if (row) {
			form.id = row.id;
			Object.assign(form, row);
			// getData(row.id);
		} else {
			getVersion();
		}
	})


};
const getVersion = () => {
	getAgreementVersion({ groupCode: 'score_agreement' }).then((res: { data: string; }) => {
		form.version = res.data
	})
}

// 根据id获取详情
// const getData = (id: string) => {
// 	getByProtocolId({ protocolId: id }).then((res) => {
// 		Object.assign(form, res.data);
// 	});
// };
const closeMyDialog = () => {
	visible.value = false;
};

// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	// Object.keys(form).forEach((key) => (form[key] = ''));
	form.context = '';
	form.remark = '';
	closeMyDialog();
};

// 取消
const cancel = async () => {
	if (!(form.id || form.context || form.remark)) {
		resetForm();
		return;
	}
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		resetForm();
	} catch {
		return false;
	}
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => { });
	if (!valid) return false;
	try {
		loading.value = true;
		form.id ? await updateProtocolByScore(form) : await addProtocolByScore(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		resetForm();
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
