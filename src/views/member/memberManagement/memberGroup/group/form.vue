<template>
	<el-dialog :close-on-click-modal="false" title="编辑" width="800" draggable v-model="visible">
		<el-form :model="form" label-width="78px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="分组名称" prop="name">
				<el-input placeholder="请输入分组名称" clearable v-model="form.name" ></el-input>
			</el-form-item>
			<el-form-item label="分组说明">
				<el-input placeholder="请输入分组说明" clearable v-model="form.remark" ></el-input>
			</el-form-item>
			<el-form-item label="创建时间">
				<span>{{form.time}}</span>
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
import {formatDate} from '/@/utils/formatTime';
// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	name: '',
	remark: '',
	time: '',
	id: '',
});
// 定义校验规则
const dataRules = ref({
	name: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }],
});



// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	form.id = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		form.time = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
		if (row) {
			form.id = row.id;
			Object.assign(form, row);
			// getData(row.id);
		} 
	})
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
	const valid = await dataFormRef.value.validate().catch(() => { });
	if (!valid) return false;
	try {
		loading.value = true;
		form.id ? await updateProtocolByScore(form) : await addProtocolByScore(form);
		useMessage().success('操作成功');
		resetForm();
		emit('refresh');
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
