<template>
	<el-dialog :close-on-click-modal="false" title="设置" width="500" draggable v-model="visible">
		<div class="mb-5">系统名称：{{ form.name }}</div>
		<el-form :model="form" label-width="150px" :rules="dataRules" ref="dataFormRef" v-loading="loading">
			<el-form-item label="单次邀请积分奖励" prop="inviteRewardValue">
				<el-input-number v-model="form.inviteRewardValue" placeholder="请输入" :precision="0" :min="1" />
			</el-form-item>
			<el-form-item label="每日邀请次数上限" prop="dailyInviteLimit">
				<div class=" flex items-center">
					<el-input-number v-model="form.dailyInviteLimit" :disabled="checkDay" placeholder="请输入"
						:precision="0" :min="1" />
					<el-checkbox v-model="checkDay" label="无" class="ml-2" size="large" @change="changeDay" />
				</div>
			</el-form-item>
			<el-form-item label="邀请次数上限" prop="totalInviteLimit">
				<div class=" flex items-center">
					<el-input-number v-model="form.totalInviteLimit" :disabled="checkNum" placeholder="请输入"
						:precision="0" :min="1" />
					<el-checkbox v-model="checkNum" label="无" class="ml-2" size="large" @change="changeNum" />
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
import { inviteDetail, inviteUpdate } from '/@/api/points/grant';
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
	inviteRewardValue: null,
	dailyInviteLimit: null,
	totalInviteLimit: null,
});

const checkDay = ref(false);
const checkNum = ref(false);
const changeDay = (value: boolean) => {
	dataRules.value.dailyInviteLimit[0].required = !value;

}
const changeNum = (value: boolean) => {
	dataRules.value.totalInviteLimit[0].required = !value;
}
const dataRules = ref({
	inviteRewardValue: [
		{ required: true, message: '单次邀请积分奖励不能为空', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('单次邀请积分奖励最小1积分'));
				}
				callback();
			},
			trigger: 'blur',
		},
	],
	dailyInviteLimit: [
		{ required: true, message: '每日邀请次数上限不能为空', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// // 确保值是正数
				// if (value <= 0) {
				// 	callback(new Error('每日邀请次数上限最小1次'));
				// }
				callback();
			},
			trigger: 'blur',
		},
	],
	totalInviteLimit: [
		{ required: true, message: '邀请次数上限不能为空', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				// if (value <= 0) {
				// 	callback(new Error('邀请次数上限最小1次'));
				// }
				callback();
			},
			trigger: 'blur',
		},
	],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	if (id) {
		inviteDetail(id).then((res) => {
			Object.assign(form, res.data);
			if(form.dailyInviteLimit == 0){
				form.dailyInviteLimit = null;
				checkDay.value = true;
				changeDay(true)
			}
			if(form.totalInviteLimit == 0){
				form.totalInviteLimit = null;
				checkNum.value = true;
				changeNum(true)
			}
			
		});
	}
};
const closeMyDialog = () => {
	visible.value = false;
};
// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	Object.keys(form).forEach((key) => (form[key] = null));
	checkDay.value = false;
	checkNum.value = false;
	closeMyDialog();
};

// 取消
const cancel = async () => {
	if (!(form.inviteRewardValue || form.dailyInviteLimit || form.totalInviteLimit || form.id)) {
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
		await inviteUpdate({
			...form,
			dailyInviteLimit: !checkDay.value ? form.dailyInviteLimit : 0,
			totalInviteLimit: !checkNum.value ? form.totalInviteLimit : 0,
		});
		useMessage().success('操作成功');
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
