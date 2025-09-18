<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="dataForm.id ? '编辑' : '新增'" draggable v-model="visible">
			<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
				<el-form-item label="标签名称" prop="tagName">
					<el-input placeholder="请输入标签名称" maxlength="50" v-model="dataForm.tagName" clearable></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="refreshData">取消</el-button>
					<el-button @click="onSubmit" type="primary" :disabled="loading">保存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="goodstore-label-form" setup>
import { useMessage } from '/@/hooks/message';
import { addTag, editTag } from '/@/api/goodStore/xianwang';


// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const dataForm = ref({
	id: '',
	tagName: '' as string | undefined,
});

const dataRules = ref({
	tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
});
// 打开弹窗
const openDialog = async (row: any) => {
	visible.value = true;
	dataForm.value.id = '';
	if (row.id) {
		dataForm.value.id = row.id;
		dataForm.value.tagName = row.tagName;
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		const request = dataForm.value.id ? editTag : addTag;
		const { code, data } = await request(dataForm.value);
		if (code === 0) {
			useMessage().success((dataForm.value.id ? '编辑成功' : '创建成功'));
			refreshData();
			emit('refresh');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};
const refreshData = () => {
	dataForm.value = {
		id: '',
		tagName: '' as string | undefined,
	};
	visible.value = false;
	dataFormRef.value.resetFields();

};


// 暴露变量
defineExpose({
	openDialog,
});
</script>
