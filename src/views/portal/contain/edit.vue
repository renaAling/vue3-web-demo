<template>
	<div class="edit-container">
		<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-form-item label="文章名称" prop="name">
				<el-input placeholder="请输入文章名称" maxlength="100" v-model="dataForm.name" clearable show-word-limit class="w-50"></el-input>
			</el-form-item>
			<el-form-item label="主图" prop="imgUrl">
				<upload-img v-model:image-url="dataForm.imgUrl" />
			</el-form-item>
			<el-form-item label="所属栏目" prop="channelIds">
				<el-cascader :options="channdelList" clearable v-model="dataForm.channelIds" multiple />
			</el-form-item>
			<el-form-item label="描述" prop="description">
				<editor v-model:get-html="dataForm.description" height="400" width="50%" />
			</el-form-item>
			<el-form-item label="">
				<el-button @click="goBack">取消</el-button>
				<el-button @click="previewRef.openDialog(dataForm.description)" type="primary" :disabled="loading">预览</el-button>
				<el-button @click="onSubmit(1)" type="primary" :disabled="loading">保存并发布</el-button>
				<el-button @click="onSubmit(0)" type="primary" :disabled="loading">仅保存</el-button>
			</el-form-item>
		</el-form>
		<preview ref="previewRef" />
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';

import { addContent, contentDetail, allChannel, updateContent, getChannelCascadeList } from '/@/api/portal';
import preview from './preview.vue';
import router from '/@/router';

const route = useRoute();
// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const previewRef = ref();
const channdelList = ref<{ label: string; value: number }[]>([]);
const dataForm = ref({
	id: '',
	channelIds: [] as number[],
	name: '' as string | undefined,
	description: '',
	imgUrl: '',
});
const dataRules = ref({
	imgUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '请输入文章名称', trigger: 'blur' }],
	channelIds: [{ required: true, message: '请选择栏目', trigger: 'blur' }],
	description: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
});
// 打开弹窗
onMounted(async () => {
	dataForm.value.id = '';
	const id = route.query.id as string;
	if (id) {
		dataForm.value.id = id;
		const { code, data } = await contentDetail({ id });
		if (code === 0) {
			dataForm.value = data;
			dataForm.value.channelIds = [data.channelId, data.columnId];
		}
	}
	const { code, data } = await getChannelCascadeList();
	if (code === 0) {
		channdelList.value = data.map((item: any) => {
			return {
				label: item.channelName,
				value: item.channelId,
				children:
					item.children &&
					item.children.map((item: any) => {
						return {
							label: item.columnName,
							value: item.columnId,
						};
					}),
			};
		});
	}
});
// 提交
const onSubmit = async (status: number) => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (dataForm.value.description && !validateRichTextNotEmpty(dataForm.value.description)) {
		return useMessage().error('请输入文章内容');
	}
	if (!valid) return false;
	try {
		await useMessageBox().confirm(`确定要${status ? '保存并发布' : '仅保存'}吗？`);
	} catch {
		return;
	}
	const params = {
		...dataForm.value,
		status, // 状态 0 草稿 1 发布
		channelId: dataForm.value.channelIds[0],
		columnId: dataForm.value.channelIds[1],
	};
	if (!valid) return false;
	try {
		const request = dataForm.value.id ? updateContent : addContent;
		const { code, data } = await request(params);
		if (code === 0) {
			useMessage().success(dataForm.value.id ? '编辑成功' : '创建成功');
			refreshData();
			emit('refresh');
			router.go(-1);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};
const validateRichTextNotEmpty = (html: string) => {
	const textWithoutTags = html.replace(/<[^>]+>/g, '');
	const trimmedText = textWithoutTags.trim();
	if (trimmedText.length === 0) {
		return false;
	}
	return true;
};
const goBack = () => {
	refreshData();
	router.go(-1);
};
const refreshData = () => {
	visible.value = false;
	dataForm.value = {
		id: '',
		channelIds: [],
		name: '' as string | undefined,
		description: '',
		imgUrl: '',
	};
};
</script>
<style lang="scss" scoped>
.edit-container {
	padding: 20px;
	background: #fff;
	.w-50 {
		width: 50%;
	}
}
</style>
