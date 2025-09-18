<template>
	<el-dialog :close-on-click-modal="false" title="充值" width="600" draggable v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="联系电话" prop="uidMobile">
				<el-input placeholder="请输入联系电话" clearable v-model="form.uidMobile" maxlength="11" @change="hanldChange"></el-input>
			</el-form-item>
			<el-form-item label="用户昵称" prop="name">
				<el-input placeholder="请输入用户昵称" disabled v-model="form.name" maxlength="30"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="transactionType">
				<el-radio-group v-model="form.transactionType">
					<el-radio :label="3">充值</el-radio>
					<el-radio :label="1">扣减</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="金额" prop="amountChange">
				<el-input-number v-model="form.amountChange" :precision="2" :step="0.1" step-strictly :min="0" />
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input placeholder="请输入备注" v-model="form.remark" maxlength="50"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { getUserInfoByUidMobile } from '/@/api/points/manage';
import { getMemberUserStoredLogAdd } from '/@/api/member/priceAccount/storedValueAccount';
// import { addBackendUser, updateBackendUser } from '/@/api/member/backendUsers/user';
import { batchSysPermission } from '/@/api/portal';
// import { addBackendUser } from '/@/api/points/manage';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh', 'addToDetail']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const isAdd = ref(true);
// 提交表单数据
const form = reactive({
	uidMobile: '',
	name: '', // 用户名
	transactionType: '',
	amountChange: '',
	remark: '',
	unionId: '',
});
const validatePhone = (rule: any, value: any, callback: any) => {
	const reg = /^1[3-9]\d{9}$/;
	if (!reg.test(value)) {
		return callback(new Error('请填写正确的联系电话!'));
	} else {
		callback();
	}
};
// 定义校验规则
const dataRules = ref({
	uidMobile: [
		{ required: isAdd, message: '联系电话不能为空', trigger: 'blur' },
		{ required: isAdd, validator: validatePhone, trigger: 'change' },
	],
	transactionType: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
	amountChange: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
	remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row?: any) => {
	console.log('row', row);
	visible.value = true;
	form.unionId = '';
	dataFormRef.value.resetFields();
};

// 根据手机号获取用户详情
const hanldChange = (val: any) => {
	console.log('val', val);
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
// 根据id获取详情
// const getData = (id: string) => {
// 	getByProtocolId({ protocolId: id }).then((res) => {
// 		Object.assign(form, res.data);
// 	});
// };

// 关闭弹窗
const resetForm = () => {
	dataFormRef.value.resetFields();
	visible.value = false;
	useMessage().error('充值失败');
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, data, msg } = await getMemberUserStoredLogAdd(form);
		if (code === 0) {
			console.log('aaa', data);
			useMessage().success('充值成功');
			dataFormRef.value.resetFields();
			visible.value = false;
			emit('refresh');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 保存权限 -- 目前只加了指定系统权限，后期可能是所有系统的权限
const saveBatchSysPermission = async (form: any) => {
	const checkedKeys: any[] = [];
	const params = {
		unionId: form.unionId,
		codes: checkedKeys,
	};
	console.log('params', params);
	const { code, msg } = await batchSysPermission(params);
	if (code === 0) {
		// useMessage().success('更新成功');
	} else {
		useMessage().error(msg);
	}
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.upload_icon {
	position: absolute;
	width: 24px;
	height: 24px;
	left: 62px;
	top: 62px;
	border-radius: 100px;
	border: 2px solid #ffffff;
	background-color: #e8f3ff;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
</style>
