<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="平台名称" prop="name">
						<el-input placeholder="请输入平台名称" v-model="form.name" maxlength="16" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="平台租户Id" prop="tenantId">
						<el-input placeholder="请输入平台租户Id" v-model="form.tenantId" maxlength="30" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="平台编码" prop="code">
						<el-input placeholder="请输入平台编码" v-model="form.code" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="状态" prop="status">
						<el-select v-model="form.status">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in status_type"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item label="备注" prop="remark">
						<el-input placeholder="请输入备注" :rows="5" type="textarea" maxlength="30" show-word-limit v-model="form.remark" />
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
import { getObj, putObj } from '/@/api/pay/channel';
import { platformAdd } from '/@/api/pay/abutment';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

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
	remark: '',
	code: '',
	tenantId: '',
	name: '',
	status: true,
	id: '',
});

// 定义校验规则
const dataRules = ref({
	name: [{ required: true, message: '平台名称不能为空', trigger: 'blur' }],
	tenantId: [
		{ required: true, message: '平台租户ID不能为空', trigger: 'blur' },
		{ validator: rule.letterAndNumber, trigger: 'blur' },
	],
	status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],

	code: [{ required: true, message: '平台编码不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value.resetFields();
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await platformAdd(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

/**
 * 根据 ID 获取支付通道数据并初始化表单。
 * @param {string} id - 要查询的支付通道 ID。
 * @returns {Promise<void>} - 初始化表单的 Promise 实例。
 */
const getpayChannelData = async (id: string): Promise<void> => {
	loading.value = true; // 显示加载状态

	try {
		const res = await getObj(id); // 执行查询操作
		Object.assign(form, res.data); // 将查询到的数据合并到表单中
	} catch (err) {
		useMessage().error('操作失败'); // 如果查询失败，则显示错误提示信息
	} finally {
		loading.value = false; // 结束加载状态
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
