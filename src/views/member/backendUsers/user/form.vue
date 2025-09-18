<template>
	<el-dialog :close-on-click-modal="false" :title="isAdd ? '新增' : '编辑'" width="800" draggable v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="头像" prop="avatar" v-if="!form.unionId">
				<upload-img v-model:imageUrl="form.avatar"> </upload-img>
			</el-form-item>
			<el-form-item label="用户名" prop="forName">
				<el-input placeholder="请输入用户名" v-model="form.forName" maxlength="20"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input placeholder="请输入姓名" v-model="form.name" maxlength="5"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="mobile">
				<el-input placeholder="请输入联系电话" clearable :disabled="!isAdd" v-model="form.mobile" maxlength="11"></el-input>
			</el-form-item>
			<el-form-item label="密码" v-if="isAdd" prop="password">
				<el-input placeholder="请输入密码" clearable v-model="form.password" minlength="6" maxlength="20"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="userState" placeholder="请选择状态">
				<el-select v-model="form.userState" clearable>
					<el-option label="启用" :value="1">启用</el-option>
					<el-option label="禁用" :value="2">禁用</el-option>
					<!-- <el-option label="冻结" value="3">冻结</el-option> -->
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { addBackendUser, updateBackendUser } from '/@/api/member/backendUsers/user';
import { validateUsername } from '/@/api/admin/user';

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
	forName: '', // 用户名
	name: '',
	mobile: '',
	unionId: '',
	userState: '',
	avatar: '',
	password: '',
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
	name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
	forName: [
		{ required: true, message: '用户名不能为空', trigger: 'blur' },
		{
			min: 5,
			max: 20,
			message: '用户名称长度必须介于 5 和 20 之间',
			trigger: 'blur',
		},
		// 自定义方法验证用户名
		{
			validator: (rule, value, callback) => {
				validateUsername(rule, value, callback, false);
			},
			trigger: 'blur',
		},
	],
	mobile: [
		{ required: isAdd, message: '联系电话不能为空', trigger: 'blur' },
		{ required: isAdd, validator: validatePhone, trigger: 'change' },
	],
	password: [
		{ required: isAdd, message: '密码不能为空', trigger: 'blur' },
		{
			min: 6,
			max: 20,
			message: '请填写6-20位密码',
			trigger: 'blur',
		},
	],
	userState: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row?: any) => {
	console.log('row', row);
	visible.value = true;
	form.unionId = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		if (row) {
			isAdd.value = false;
			form.password = 'xxxxxx';
			form.unionId = row.unionId;
			Object.assign(form, row);
			form.forName = row.username;
			// Object.assign(form.forName, row.username);
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
		if (form.unionId) {
			form.password = '';
		}
		const { code, data, msg } = form.unionId ? await updateBackendUser(form) : await addBackendUser(form);
		if (code === 0) {
			console.log('aaa', data);
			useMessage().success('操作成功');
			resetForm();
			emit('refresh');
			if (!form.unionId) {
				saveBatchSysPermission(data);
				emit('addToDetail', data);
			}
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
const saveBatchSysPermission = async (data: string) => {
	const checkedKeys: any[] = ['CCMALL_SYSTEM', 'GOOD_SHOP_SYSTEM', 'PICKMALL_PLAT_SYSTEM', 'SCORE_SYSTEM', 'UPS'];
	const params = {
		unionId: data,
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
