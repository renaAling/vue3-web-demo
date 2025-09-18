<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" width="600" draggable v-model="visible" :before-close="resetForm">
		<el-form :model="form" label-width="120px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="等级" prop="level">
				<span>LV{{ form.level }}</span>
			</el-form-item>
			<el-form-item label="等级名称" prop="levelName">
				<el-input placeholder="请输入等级名称" clearable v-model="form.levelName"></el-input>
			</el-form-item>
			<el-form-item label="升级所需成长值" prop="threshold">
				<el-input-number v-model="form.threshold" :min="min" :max="max" :step="1" step-strictly />
				<!-- <el-input placeholder="请输入" clearable v-model="form.threshold"></el-input> -->
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
import { postInsertMemberLevelAdd, postInsertMemberLevelUpdate } from '/@/api/member/memberLevel/gradeSet';
import { useMessage } from '/@/hooks/message';
// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const min = ref<number>(0);
const max = ref<number>(99999999999999);

// 提交表单数据
const form = reactive({
	levelName: '',
	threshold: '',
	level: 0,
	id: '',
});
// 定义校验规则
const dataRules = ref({
	levelName: [{ required: true, message: '等级名称不能为空', trigger: 'blur' }],
	threshold: [{ required: true, message: '成长值不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (list: any, index: number, row?: any) => {
	visible.value = true;
	max.value = 99999999999999;
	min.value = 0;
	form.id = '';
	console.log('list.length', list.length);
	console.log('index', index);
	console.log('list[index]', list[index]);
	if (row) {
		form.id = row.id;
		Object.assign(form, row);
		if (index == 0 && list[index + 1]) {
			// 第一个且有第二个
			max.value = list[index + 1].threshold;
		} else if (index == list.length - 1) {
			// 最后一个
			min.value = list[index - 1].threshold;
		} else {
			min.value = list[index - 1].threshold;
			max.value = list[index + 1].threshold;
		}
	} else {
		form.level = list.length + 1;
		min.value = list[list.length - 1].threshold;
		form.threshold = list[list.length - 1].threshold;
	}
};

// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	max.value = 99999999999999;
	min.value = 0;
	emit('refresh');
	visible.value = false;
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, msg } = form.id ? await postInsertMemberLevelUpdate(form) : await postInsertMemberLevelAdd(form);
		if (code === 0) {
			useMessage().success(`${form.id ? '编辑成功' : '添加成功'}`);
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
