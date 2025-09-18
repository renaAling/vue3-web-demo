<template>
	<el-dialog :close-on-click-modal="false" width="400px" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="24" class="mb20">
					<el-form-item label="渠道名称" prop="payType">
						<el-select v-model="payItem">
							<el-option :key="item.value" :label="item.label" :value="item" v-for="item in payType"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item label="状态" prop="state">
						<el-select v-model="form.state">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in status_type"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="PayChannelDialog" setup>
// 定义子组件向父组件传值/事件
import { useMessage } from '/@/hooks/message';
import { getObj, putObj, channelAdd } from '/@/api/pay/channel';
import { useI18n } from 'vue-i18n';
import { payType } from '/@/hooks/enums';

const emit = defineEmits(['refresh']);

const { t } = useI18n();
const status_type = [
	{
		label: '开启',
		value: true,
	},
	{
		label: '关闭',
		value: false,
	},
];
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	payType: '',
	channelName: '',
	state: true,
});
const payItem = ref({});

// 定义校验规则
const dataRules = ref({
	channelName: [{ required: true, message: '渠道名称不能为空', trigger: 'blur' }],
	state: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value.resetFields();
		payItem.value = {};
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		const params = {
			channelName: payItem.value.label,
			state: true,
			payType: payItem.value.value,
		};
		let res = await channelAdd(params);
		if (res.code != 0) {
			return useMessage().error(res.msg);
		}
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
