<template>
	<el-dialog :close-on-click-modal="false" title="新增事件" width="450" draggable v-model="visible">
		<el-form :model="form" label-width="100px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="事件名称" prop="name">
				<el-input placeholder="请输入" style="width: 180px" clearable v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="适用渠道" prop="channelCode">
				<el-checkbox-group v-model="selectedOptions">
					<el-checkbox v-for="(item, key) in channelType" @change="handleChangeChannel(item.channelCode)" :key="key" :label="item.channelCode">
						{{ item.name }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="适用类型" prop="applyStatus">
				<el-checkbox-group v-model="selectedOption">
					<el-checkbox v-for="(item, key) in eventType" :key="key" :label="item.value" @change="handleChange(item.value)">
						{{ item.label }}
					</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="form.status">
					<el-radio label="2">启用</el-radio>
					<el-radio label="1">禁用</el-radio>
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
import { useI18n } from 'vue-i18n';
import { eventAdd } from '/@/api/points/config';
import { useMessage } from '/@/hooks/message';
import { channelList } from '/@/api/points/manage';
// 定义子组件向父组件传值/事件
const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const selectedOption: any = ref([]);
const selectedOptions: any = ref([]);
const emit = defineEmits(['refresh']);

// 表单复选框
const channelType: any = ref([]);
const eventType = ref([
	{
		label: '积分发放',
		value: '1',
		elTagType: '',
	},
	{
		label: '积分使用',
		value: '2',
		elTagType: '',
	},
	{
		label: '积分回退-退增',
		value: '3',
		elTagType: '',
	},
	{
		label: '积分回退- 退减',
		value: '4',
		elTagType: '',
	},
	{
		label: '积分过期',
		value: '5',
		elTagType: '',
	},
	{
		label: '积分冻结',
		value: '6',
		elTagType: '',
	},
	{
		label: '积分解冻',
		value: '7',
		elTagType: '',
	},
	{
		label: '积分冻结扣减',
		value: '8',
		elTagType: '',
	}
]);

// 提交表单数据
const form = reactive({
	name: '',
	status: '2',
	applyStatus: null as any,
	channelCode: null as any,
});
const dataRules = ref({
	name: [{ required: true, message: '事件名称不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
	applyStatus: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
	channelCode: [{ required: true, message: '渠道不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	nextTick(() => {
		dataFormRef.value.resetFields();
		selectedOption.value = [];
		selectedOptions.value = [];
		channelList().then((res) => {
			channelType.value = res.data;
		});
	});
};

const handleChange = (values: any) => {
	selectedOption.value = [values];
	const selected = eventType.value.find((option) => option.value === values);
	form.applyStatus = selected?.value;
};

const handleChangeChannel = (value: any) => {
	selectedOptions.value = [value];
	const selected = channelType.value.find((option: any) => option.channelCode === value);
	form.channelCode = selected?.channelCode;
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		await eventAdd(form);
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
<style lang="scss" scoped>
::v-deep {
	.el-checkbox {
		display: flex;
	}
}
</style>
