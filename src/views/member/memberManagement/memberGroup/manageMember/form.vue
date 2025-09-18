<template>
	<el-dialog :close-on-click-modal="false" title="编辑" width="800" draggable v-model="visible" :before-close="resetForm">
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
			<el-form-item label="所属分组">
				<el-select
					v-model="form.groupCodes"
					multiple
					filterable
					remote
					reserve-keyword
					placeholder="请选择所属分类"
					:remote-method="remoteMethod"
					:loading="loading"
					style="width: 240px"
				>
					<el-option v-for="item in groupCodesOptions" :key="item.code" :label="item.name" :value="item.code" />
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
import { saveOrUpdateUserInfos, getMemberGroupList, getUserInfos } from '/@/api/member/memberGroup/manageMember';
import { useMessage } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
interface FormData {
	unionId: string;
	nickName: string;
	mobile: string;
	groupCodes: any[];
}
// 提交表单数据
const form = reactive<FormData>({
	nickName: '',
	unionId: '',
	mobile: '',
	groupCodes: [],
});
const groupCodesOptions = ref<any>([]);
const validateGroupCodes = (rule: any, value: any, callback: any) => {
	if (value?.length > 0) {
		return callback();
	} else {
		return callback(new Error('所属分组不能为空!'));
	}
};
// 定义校验规则
const dataRules = ref({
	unionId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
	nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
	groupCodes: [{ required: true, validator: validateGroupCodes, trigger: 'blur' }],
});

onMounted(() => {
	remoteMethod('');
});

// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	form.unionId = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		if (row) {
			form.groupCodes = [];
			form.unionId = row.unionId;
			Object.assign(form, row);
			getMemberInfoData(row.unionId);
		}
	});
};
const remoteMethod = async (str?: string) => {
	try {
		const { code, data, msg } = await getMemberGroupList(str);
		if (code === 0) {
			console.log('getMemberCategoryGetList', data);
			groupCodesOptions.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const getMemberInfoData = async (uid: string) => {
	try {
		const { code, data, msg } = await getUserInfos(uid);
		if (code === 0) {
			console.log('getMemberCategoryInfoData', data);
			data.map((item: any) => {
				form.groupCodes.push(item.groupCode);
			});
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	visible.value = false;
};

// 提交
const onSubmit = async () => {
	if (form.groupCodes.length == 0) {
		useMessage().error('请选择所属分组!');
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

// 暴露变量
defineExpose({
	openDialog,
});
</script>
