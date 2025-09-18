<template>
	<el-dialog :close-on-click-modal="false" title="新增发放渠道" width="450" draggable v-model="visible">
		<el-form :model="form" label-width="110px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="发放渠道名称" prop="name">
				<el-input placeholder="请输入" style="width: 180px" clearable v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="form.status">
					<el-radio :label="true">启用</el-radio>
					<el-radio :label="false">禁用</el-radio>
				</el-radio-group>
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
import { channelAdd } from '/@/api/points/config';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';

// 定义子组件向父组件传值/事件
const { t } = useI18n();
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	name: '',
	status: true,
});

const dataRules = ref({
	name: [{ required: true, message: '渠道名称不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '渠道状态不能为空', trigger: 'change' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	nextTick(() => {
		dataFormRef.value.resetFields();
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		await channelAdd(form);
		useMessage().success('新增成功');
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
