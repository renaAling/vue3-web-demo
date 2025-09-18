<template>
	<el-dialog :close-on-click-modal="false" title="积分规则设置" width="500" draggable v-model="visible">
		<div class="mb-5">平台名称：{{ form.name }}</div>
		<el-form :model="form" label-width="80px" :rules="dataRules" ref="dataFormRef" v-loading="loading">
			<el-form-item label="消费金额" prop="consumeAmount">
				<div class="flex items-center">
					<el-input-number v-model="form.consumeAmount" placeholder="请输入" :precision="2" :min="0" />
					<span class="ml-2">(元)</span>
				</div>
			</el-form-item>
			<el-form-item label="发放积分" prop="rewardPoints">
				<div class="flex items-center">
					<el-input-number v-model="form.rewardPoints" placeholder="请输入" :precision="2" :min="0" />
					<span class="ml-2">(分)</span>
				</div>
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
// import { useI18n } from 'vue-i18n';
import { consumeRuleDetail, consumeRuleUpdate, thirdConfigDetail, thirdConfigUpdate } from '/@/api/points/grant';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义子组件向父组件传值/事件
// const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	name: '',
	rewardPoints: null,
	consumeAmount: null,
});
const contentType = ref('');
const dataRules = ref({
	consumeAmount: [
		{ required: true, message: '消费金额不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: number, callback: any) => {
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('消费金额需大于0'));
				}
				callback();
			},
			trigger: 'blur',
		},
	],
	rewardPoints: [
		{ required: true, message: '发放积分不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: number, callback: any) => {
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value < 0) {
					callback(new Error('发放积分需大于0或等于0'));
				}
				callback();
			},
			trigger: 'blur',
		},
	],
});

// 打开弹窗
const openDialog = (row: string, type: string) => {
	visible.value = true;
	if (row.id) {
		form.name = row.name;
		if (type === 'channel') {
			contentType.value = 'channel';
			thirdConfigDetail(row.id).then((res) => {
				Object.assign(form, res.data);
			});
		} else {
			consumeRuleDetail(row.id).then((res) => {
				Object.assign(form, res.data);
			});
		}

	}
};
const closeMyDialog = () => {
	visible.value = false;
};
// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	//Object.keys(form).forEach((key) => (form[key] = null));
	closeMyDialog();
};

// 取消
const cancel = async () => {
	if (!(form.consumeAmount || form.rewardPoints || form.id)) {
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
const emit = defineEmits(['refresh']);
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => { });
	if (!valid) return false;
	try {
		if(contentType.value === 'channel') {
			await thirdConfigUpdate(form);
		}else{
			await consumeRuleUpdate(form);
		}
		
		useMessage().success('操作成功');
		resetForm();
		emit('refresh')
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
