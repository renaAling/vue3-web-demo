<template>
	<el-dialog :close-on-click-modal="false" :title="!form.id ? '新增' : '修改'" width="800" draggable v-model="visible" :before-close="resetForm">
		<el-form :model="form" label-width="110px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="图标" prop="logoUrl">
				<upload-img v-model:image-url="form.logoUrl" />
			</el-form-item>
			<el-form-item label="任务名称" prop="taskName">
				<el-input placeholder="请输入任务名称" :disabled="form.id" clearable v-model="form.taskName" max="30"></el-input>
			</el-form-item>
			<el-form-item label="任务标识" prop="mask">
				<el-input placeholder="请输入任务标识" :disabled="form.id" clearable v-model="form.mask" max="30"></el-input>
			</el-form-item>
			<el-form-item label="任务规则" prop="rule">
				<el-input v-model="form.rule" :rows="2" type="textarea" placeholder="请输入任务规则" max="50" />
			</el-form-item>
			<el-form-item label="发放积分" prop="growthValue">
				<el-input-number v-model="form.growthValue" :min="1" :step="1" step-strictly />
			</el-form-item>
			<el-form-item label="跳转地址" prop="jumpPath">
				<el-input placeholder="请输入跳转地址" clearable v-model="form.jumpPath"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="taskStatus" placeholder="请选择状态">
				<el-select v-model="form.taskStatus" clearable>
					<el-option label="启用" :value="1">启用</el-option>
					<el-option label="禁用" :value="2">禁用</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="form.id" label="创建时间" prop="createTime">
				{{ form.createTime }}
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
import { useMessage, useMessageBox } from '/@/hooks/message';
import { growthInAdd, growthInUpdate, growthDetailApi } from '/@/api/points/grant';

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 提交表单数据
const form = reactive({
	taskName: '',
	mask: '',
	logoUrl: '',
	rule: '',
	growthValue: '',
	jumpPath: '',
	taskStatus: '',
	id: null,
	createTime: '',
});

// 定义校验规则
const dataRules = ref({
	logoUrl: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
	taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
	mask: [{ required: true, message: '任务标识不能为空', trigger: 'blur' }],
	rule: [{ required: true, message: '任务规则不能为空', trigger: 'blur' }],
	growthValue: [{ required: true, message: '积分不能为空', trigger: 'blur' }],
	taskStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row?: any) => {
	visible.value = true;
	form.id = null;
	if (row) {
		form.id = row.id;
		growthDetail(row.id);
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
const growthDetail = async (id: any) => {
	try {
		loading.value = true;
		const { code, data, msg } = await growthDetailApi(id);
		if (code === 0) {
			console.log('data', data);
			Object.assign(form, data);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, msg } = form.id ? await growthInUpdate(form) : await growthInAdd(form);
		if (code === 0) {
			useMessage().success(`${form.id ? '编辑成功' : '新增成功'}`);
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
<style lang="scss" scoped>
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
