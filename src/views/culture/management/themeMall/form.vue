<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" width="600" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="120px" v-loading="loading">
			<el-form-item :label="t('themeMall.name')" prop="name">
				<el-input v-model="form.name" :placeholder="t('themeMall.inputTip')" disabled />
			</el-form-item>
			<el-form-item :label="t('themeMall.status')" prop="status">
				<el-switch v-model="form.status" inline-prompt active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" />
			</el-form-item>
			<el-form-item :label="t('themeMall.remark')" prop="remark">
				<el-input type="textarea" maxlength="100" row="3" v-model="form.remark" :placeholder="t('themeMall.inputTip')" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="systemPostDialog">
import { useMessage } from '/@/hooks/message';
import { themeMallDetail, themeMallAdd, themeMallUpdate } from '/@/api/culture/management';
import { useI18n } from 'vue-i18n';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	name: '',
	subdomainPrefix: '',
	accessUrl: '',
	status: null,
	remark: '',
});

// 定义校验规则
const dataRules = reactive({
	name: [{ required: true, message: '主题商城名称不能为空', trigger: 'blur' }],
	subdomainPrefix: [{ required: true, message: '主题商城二级域名前缀不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.id = id;
		getPostData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await themeMallUpdate(form) : await themeMallAdd(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表格数据
const getPostData = (id: string) => {
	// 获取部门数据
	themeMallDetail(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
