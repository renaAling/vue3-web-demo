<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" width="600" draggable v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="图标" prop="icon">
				<upload-img v-model:image-url="form.icon" />
			</el-form-item>
			<el-form-item label="场景名称" prop="taskName">
				<el-input placeholder="请输入场景名称" clearable v-model="form.taskName" maxlength="30"></el-input>
			</el-form-item>
			<el-form-item label="场景规则" prop="taskRule">
				<el-input placeholder="请输入用户昵称" v-model="form.taskRule" maxlength="50"></el-input>
			</el-form-item>
			<el-form-item label="跳转地址" prop="jumpUrl">
				<el-input placeholder="请输入跳转地址" v-model="form.jumpUrl" maxlength="100"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="form.status" placeholder="请选择状态">
					<el-option label="开启" :value="1" />
					<el-option label="关闭" :value="2" />
				</el-select>
			</el-form-item>
			<el-form-item label="创建时间" prop="createTime" v-if="form.id">
				<span>{{ form.createTime }}</span>
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
import { getTaskGetApi, getTaskAdd, getTaskUpdate } from '/@/api/points/manage';
import { useMessage } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 提交表单数据
const form = reactive({
	id: '',
	icon: '',
	taskName: '',
	taskRule: '',
	jumpUrl: '',
	createTime: '',
	status: '',
});
// 定义校验规则
const dataRules = ref({
	icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
	taskName: [{ required: true, message: '场景名称不能为空', trigger: 'blur' }],
	taskRule: [{ required: true, message: '场景规则不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row?: any) => {
	Object.assign(form, {
		id: '',
		icon: '',
		taskName: '',
		taskRule: '',
		jumpUrl: '',
		createTime: '',
		status: '',
	});
	console.log('row', row);
	if (row) {
		getTaskGet(row.id);
	}
	visible.value = true;
};

// 关闭弹窗
const resetForm = () => {
	dataFormRef.value.resetFields();
	visible.value = false;
};

// 获取详情
const getTaskGet = async (id: string) => {
	try {
		const { code, data, msg } = await getTaskGetApi(id);
		if (code === 0) {
			Object.assign(form, data);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, data, msg } = form.id ? await getTaskUpdate(form) : await getTaskAdd(form);
		if (code === 0) {
			console.log('aaa', data);
			useMessage().success('提交成功');
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
