<template>
	<div class="entrance-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="dataForm.code ? '链接编辑' : '链接新增'" draggable v-model="visible" :show-close="false">
			<el-form :model="dataForm" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading">
				<el-form-item label="链接名称" prop="name">
					<el-input placeholder="请输入链接名称" maxlength="10" v-model="dataForm.name" clearable></el-input>
				</el-form-item>
				<el-form-item label="所属分类" prop="cateCode">
					<el-cascader v-model="dataForm.cateCode" :options="linkClassData" :props="linkClassProps" @change="handleChange" />
				</el-form-item>
				<el-form-item label="H5链接" prop="urlH5">
					<el-input placeholder="请输入H5链接" v-model="dataForm.urlH5" clearable style="width: 100%;"></el-input>
				</el-form-item>
				<el-form-item label="小程序链接" prop="urlApp">
					<el-input placeholder="请输入小程序链接" v-model="dataForm.urlApp" clearable></el-input>
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
import { linkClassListApi, linkAddApi, linkUpdateApi } from '/@/api/culture/devise';

// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const linkClassData = ref<{ id: number; name: string }[]>([]); // 分类数据

const linkClassProps = ref({
	value: 'code', // ID字段名
	label: 'name', // 显示名称
	children: 'childList', // 子级字段名
});
const dataForm = ref({
	code: '',
	name: '' as string | undefined,
	cateCode: '' as string | undefined, // Added cateCode property
	urlH5: '' as string | undefined, // Added urlH5 property
	urlApp: '' as string | undefined, // Added urlApp property
});

const dataRules = ref({
	name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
	cateCode: [{ required: true, message: '请选择所属分类', trigger: 'blur' }],
	urlH5: [{ required: true, message: '请输入H5链接', trigger: 'blur' }],
	urlApp: [{ required: true, message: '请输入小程序链接', trigger: 'blur' }],
});
// 打开弹窗
const openDialog = async (row: any) => {
	visible.value = true;
	dataForm.value.code = '';
	if (row?.code) {
		dataForm.value = { ...row };
	}
	getClassDataList();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		const request = dataForm.value.code ? linkUpdateApi : linkAddApi;
		const { code, data } = await request(dataForm.value);
		if (code === 0) {
			useMessage().success(dataForm.value.code ? '编辑成功' : '创建成功');
			refreshData();
			emit('refresh');
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};
const getClassDataList = async () => {
	try {
		const { data, msg, code } = await linkClassListApi();
		if (code === 0) {
			console.log('linkClassData.value', data);
			data.map((item: any) => {
				if (item.childList?.length < 1) {
					item.disabled = true;
				}
			});
			linkClassData.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const handleChange = (value: string) => {
	dataForm.value.cateCode = value ? value[1] : '';
};
const refreshData = () => {
	dataForm.value = {
		code: '',
		name: '' as string | undefined,
		cateCode: '' as string | undefined,
		urlH5: '' as string | undefined,
		urlApp: '' as string | undefined,
	};
	visible.value = false;
	dataFormRef.value.resetFields();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped>
::v-deep(.el-cascader){
	width: 100%;
}
</style>
