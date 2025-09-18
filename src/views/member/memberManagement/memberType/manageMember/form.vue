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
			<el-form-item label="所属分类" prop="categoryCodes">
				<el-select
					v-model="form.categoryCodes"
					multiple
					filterable
					remote
					reserve-keyword
					placeholder="请选择所属分类"
					:remote-method="remoteMethod"
					:loading="loading"
					style="width: 240px"
				>
					<el-option v-for="item in categoryOptions" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode" />
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
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getMemberCategoryGetList, saveOrUpdateUserInfos, getMemberCategoryInfo } from '/@/api/member/memberType/typeManager';

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
interface FormData {
	unionId: string;
	nickName: string;
	mobile: string;
	categoryCodes: any[];
}
// 提交表单数据
const form = reactive<FormData>({
	unionId: '',
	nickName: '',
	mobile: '',
	categoryCodes: [],
});
let categoryOptions = ref<any>([]);
const validateCategory = (rule: any, value: any, callback: any) => {
	if (value?.length > 0) {
		return callback();
	} else {
		return callback(new Error('所属分类不能为空!'));
	}
};
// 定义校验规则
const dataRules = ref({
	unionId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
	nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
	categoryCodes: [{ required: true, validator: validateCategory, trigger: 'blur' }],
});
onMounted(() => {
	remoteMethod('');
});
// 打开弹窗
const openDialog = (row: any) => {
	console.log('row', row);
	visible.value = true;
	form.unionId = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		if (row) {
			form.unionId = row.unionId;
			Object.assign(form, row);
			getMemberCategoryInfoData(row.unionId);
		}
	});
};
const remoteMethod = async (str?: string) => {
	try {
		const { code, data, msg } = await getMemberCategoryGetList(str);
		if (code === 0) {
			console.log('getMemberCategoryGetList', data);
			categoryOptions.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const getMemberCategoryInfoData = async (uid: string) => {
	try {
		const { code, data, msg } = await getMemberCategoryInfo(uid);
		if (code === 0) {
			console.log('getMemberCategoryInfoData', data);
			data.map((item: any) => {
				form.categoryCodes.push(item.categoryCode);
			});
			// categoryOptions.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

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
	console.log('form.category', form);
	if (form.categoryCodes.length == 0) {
		useMessage().error('请选择所属类型!');
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
