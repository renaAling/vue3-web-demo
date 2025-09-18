<template>
	<el-dialog :close-on-click-modal="false" title="编辑" width="600" draggable v-model="visible" :before-close="resetForm">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="用户ID" prop="unionId">
				<span>{{ form.unionId }}</span>
			</el-form-item>
			<el-form-item label="用户昵称" prop="nickName">
				<span>{{ form.nickName ? form.nickName : '-' }}</span>
			</el-form-item>
			<el-form-item label="联系电话" prop="mobile">
				<span>{{ form.mobile }}</span>
			</el-form-item>
			<el-form-item label="会员标签" prop="signCodes">
				<el-select
					v-model="form.signCodes"
					multiple
					filterable
					remote
					reserve-keyword
					placeholder="请选择会员标签"
					:remote-method="remoteMethod"
					:loading="loading"
					style="width: 240px"
				>
					<el-option v-for="item in groupOptions" :key="item.code" :label="item.name" :value="item.code" />
				</el-select>
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
import { useMessage } from '/@/hooks/message';
import { saveOrUpdateUserInfos, getUserInfos, getMemberSignList } from '/@/api/member/memberLabel/manageMember';

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref<boolean>(false);
const groupOptions = ref<any[]>([]);
interface FormData {
	unionId: string;
	nickName: string;
	mobile: string;
	signCodes: any[];
}
// 提交表单数据
const form = reactive<FormData>({
	mobile: '',
	unionId: '',
	nickName: '',
	signCodes: [],
});
const validateSignCodes = (rule: any, value: any, callback: any) => {
	if (value?.length > 0) {
		return callback();
	} else {
		return callback(new Error('请选择会员标签!'));
	}
};
// 定义校验规则
const dataRules = ref({
	unionId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
	nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
	signCodes: [{ required: true, validator: validateSignCodes, trigger: 'blur' }],
});

onMounted(() => {
	remoteMethod('');
});
const getTypeList = () => {};

// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	form.unionId = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		if (row) {
			form.signCodes = [];
			form.unionId = row.unionId;
			Object.assign(form, row);
			getUserInfosData(row.unionId);
		}
	});
	getTypeList();
};
const remoteMethod = async (str?: string) => {
	try {
		const { code, data, msg } = await getMemberSignList(str);
		if (code === 0) {
			console.log('saveOrUpdateUserInfos', data);
			groupOptions.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const getUserInfosData = async (uid: string) => {
	try {
		const { code, data, msg } = await getUserInfos(uid);
		if (code === 0) {
			console.log('getUserInfosData', data);
			data.map((item: any) => {
				form.signCodes.push(item.signCode);
			});
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 提交
const onSubmit = async () => {
	if (form.signCodes.length == 0) {
		useMessage().error('请选择会员标签!');
		return;
	}
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, msg } = await saveOrUpdateUserInfos(form);
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
// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
