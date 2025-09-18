<template>
	<el-dialog :close-on-click-modal="false" title="手动发放积分" width="450" draggable v-model="visible">
		<el-form :model="form" label-width="110px" :rules="dataRules" ref="dataFormRef" v-loading="loading">
			<el-form-item label="用户id/手机号" prop="uidMobile">
				<el-input placeholder="请输入" style="width: 180px" @change="handldChange" clearable v-model="form.uidMobile"></el-input>
			</el-form-item>
			<el-form-item label="用户姓名" prop="name">
				<div>{{ form.name }}</div>
			</el-form-item>
			<el-form-item label="类型" prop="manualType">
				<el-radio-group v-model="form.manualType">
					<el-radio label="1">充值</el-radio>
					<el-radio label="2">扣减</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="积分数值" prop="changeScore">
				<el-input placeholder="请输入" style="width: 180px" clearable v-model="form.changeScore"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancel">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { getUserInfoByUidMobile, manualGrant } from '/@/api/points/manage';
import { useMessage, useMessageBox } from '/@/hooks/message';



// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	unionId: '',
	changeScore: null,
	manualType: '1',
	uidMobile: '',
	name: '',
});

const dataRules = ref({
	uidMobile: [{ required: true, message: '用户信息不能为空', trigger: 'blur' }],
	changeScore: [
		{ required: true, message: '积分数值不能为空', trigger: 'blur' },
		{
			validator: (rule, value, callback) => {
				if (isNaN(Number(value))) {
					callback(new Error('请输入有效的数字'));
				}
				// 确保值是正数
				if (value <= 0) {
					callback(new Error('积分数值必须大于0'));
				}
				if (value > 1000) {
					callback(new Error('积分数值不能为大于1000'));
				}
				if (/\.\d+/.test(value)) {
					callback(new Error('积分数值必须为整数'));
				}
				// if (!Number.isInteger(Number(value))) {
				// 	callback(new Error('积分数值必须为整数'));
				// }
				callback();
			},
			trigger: 'blur',
		},
	],
});

// 打开弹窗
const openDialog = () => {
	visible.value = true;
};

// 重置
const resetForm = () => {
    dataFormRef.value.resetFields();
    visible.value = false;
};

// 取消
const cancel = async () => {
    if (!(form.unionId || form.changeScore || form.uidMobile  )) {
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

const handldChange = (val: string) => {
	if (!val) {
		dataFormRef.value.resetFields();
		return;
	}
	getUserInfoByUidMobile({ uidMobile: form.uidMobile })
		.then((res) => {
			Object.assign(form, res.data);
		})
		.catch((err) => {
			useMessage().error(err.msg);
		});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		if (!form.unionId) return useMessage().error('输入正确的用户');
		await manualGrant(form);
		useMessage().success('操作成功');
		resetForm();
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
