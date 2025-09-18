<template>
	<el-dialog :close-on-click-modal="false" title="编辑" width="800" draggable v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="用户ID" prop="id">
				<span>{{ form.unionId }}</span>
			</el-form-item>
			<el-form-item label="用户昵称" prop="id">
				<span>{{ form.nickName ? form.nickName : '-' }}</span>
			</el-form-item>
			<el-form-item label="联系电话" prop="id">
				<span>{{ form.mobile }}</span>
			</el-form-item>
			<el-form-item label="等级" prop="val">
				<el-select v-model="form.level" placeholder="选择会员等级" clearable>
					<el-option v-for="item in levelList" :key="'dialog' + item.level" :label="item.levelName" :value="item.level" />
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
import { getLevelList, changeLevelByUnionIdApi } from '/@/api/member/memberLevel/levelAdjust';
import { useMessage } from '/@/hooks/message';
// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	level: '',
	nickName: '',
	mobile: '',
	unionId: '',
});
const levelList = ref<any[]>([]);
// 定义校验规则
const dataRules = ref({
	level: [{ required: true, message: '等级不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any) => {
	getLevelListData();
	console.log('row', row);
	visible.value = true;
	form.unionId = '';
	if (row) {
		Object.assign(form, row);
		form.unionId = row.unionId;
	}
};

const getLevelListData = async () => {
	try {
		loading.value = true;
		const { code, data, msg } = await getLevelList();
		if (code === 0) {
			levelList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	loading.value = false;
};
const closeMyDialog = () => {
	visible.value = false;
};

// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	emit('refresh');
	closeMyDialog();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, msg } = await changeLevelByUnionIdApi(form);
		if (code === 0) {
			useMessage().success('编辑成功');
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
