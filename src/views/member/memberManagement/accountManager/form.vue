<template>
	<el-dialog :close-on-click-modal="false" title="编辑" width="600" draggable v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="用户头像" prop="avatar">
				<upload-img v-model:image-url="form.avatar" />
			</el-form-item>
			<el-form-item label="用户昵称" prop="nickName">
				<el-input placeholder="请输入用户昵称" v-model="form.nickName"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="mobile">
				<el-input placeholder="请输入联系电话" disabled clearable v-model="form.mobile" maxlength="11"></el-input>
			</el-form-item>
			<el-form-item label="注册时间" prop="deptId">
				<el-input placeholder="请输入注册时间" disabled v-model="form.registerTime"></el-input>
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

<script lang="ts" name="accountForm" setup>
import { addProtocolByScore, updateProtocolByScore } from '/@/api/points/agreement';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { upDateAvatarAndNickNameByUnionId } from '/@/api/member/memberManagement/accountManager';
//
// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	registerTime: '',
	avatar: '',
	unionId: '',
	nickName: '',
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
	// mobile: [
	// 	{ required: true, message: '联系电话不能为空', trigger: 'blur' },
	// 	{ required: true, validator: validatePhone, trigger: 'change' },
	// ],
	avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
	nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	console.log('row', row);
	form.unionId = '';

	nextTick(() => {
		dataFormRef.value.resetFields();
		// form.context = '';
		if (row) {
			form.unionId = row.unionId;
			Object.assign(form, row);
		}
	});
};

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
	closeMyDialog();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, msg } = await upDateAvatarAndNickNameByUnionId(form);
		if (code === 0) {
			useMessage().success('操作成功');
			resetForm();
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

// 暴露变量
defineExpose({
	openDialog,
});
</script>
