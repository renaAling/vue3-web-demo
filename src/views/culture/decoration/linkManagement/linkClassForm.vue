<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="dataForm.id ? '分类编辑' : '分类新增'" draggable v-model="visible" :show-close="false">
			<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
				<el-form-item label="分类名称" prop="name">
					<el-input placeholder="请输入分类名称" maxlength="10" v-model="dataForm.name" clearable></el-input>
				</el-form-item>
				<el-form-item label="父级分类" prop="pid" v-if="!disabledPid">
					<el-select v-model="dataForm.pid" style="width: 100%" placeholder="请选择父级分类">
						<el-option v-for="(item, index) in linkClassData" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
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

<script lang="ts" name="link-class-form" setup>
import { useMessage } from '/@/hooks/message';
import { linkClassListApi, linkClassAddApi, linkClassUpdateApi } from '/@/api/culture/devise';

// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const linkClassData = ref<{ id: number; name: string }[]>([]); // 分类数据
const disabledPid = ref(false);
const dataForm = ref({
	id: '',
	pid: null,
	name: '' as string | undefined,
	level: 1,
});

const dataRules = ref({
	name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
	pid: [{ required: true, message: '请选择父级分类', trigger: 'blur' }],
});
// 打开弹窗
const openDialog = async (row: any) => {
	console.log('打开分类弹窗row', row);
	disabledPid.value = false;
	visible.value = true;
	dataForm.value.id = '';
	if (row?.id) {
		dataForm.value = { ...row };
		if (row.pid == 0) {
			// 父级为根目录的禁止修改父级
			disabledPid.value = true;
		}
	}
	getClassDataList();
};
const getClassDataList = async () => {
	try {
		const { data, msg, code } = await linkClassListApi();
		if (code === 0) {
			linkClassData.value = data;
			linkClassData.value.unshift({
				id: 0,
				name: '根目录',
			});
			console.log('linkClassData.value', data);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		dataForm.value.level = Number(dataForm.value.pid) ? 2 : 1;
		const request = dataForm.value.id ? linkClassUpdateApi : linkClassAddApi;
		const { code, data } = await request(dataForm.value);
		if (code === 0) {
			useMessage().success(dataForm.value.id ? '编辑成功' : '创建成功');
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
		pid: null,
		level: 1,
		name: '' as string | undefined,
	};
	visible.value = false;
	dataFormRef.value.resetFields();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
