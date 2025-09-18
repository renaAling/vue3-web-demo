<template>
	<div class="edit-container">
		<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-form-item label="文章名称" prop="name">
				<el-input placeholder="请输入文章名称" maxlength="20" v-model="dataForm.name" clearable show-word-limit style="width: 35%"></el-input>
			</el-form-item>
			<el-form-item label="主图" prop="imgUrl">
				<upload-img v-model:image-url="dataForm.imgUrl" />
			</el-form-item>
			<el-form-item label="所属栏目" prop="columnId">
				<el-select v-model="dataForm.columnId" placeholder="请选择所属栏目" clearable multiple>
					<el-option v-for="item in channdelList" :label="item.name" :value="item.id" :key="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="描述" prop="description">
				<editor v-model:get-html="dataForm.description" height="400" width="50%" />
			</el-form-item>
			<el-form-item label="">
				<el-button @click="goBack">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">保存</el-button>
				<el-button @click="previewRef.openDialog(dataForm.description)" type="primary" :disabled="loading">预览</el-button>
			</el-form-item>
		</el-form>
		<preview ref="previewRef" />
	</div>
</template>

<script lang="ts" name="portal-entrance-form" setup>
import { useMessage } from '/@/hooks/message';

import { addContent, contentDetail, updateContent, getUpdateArticleChannelList } from '/@/api/culture/contentCenter';
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
const channdelList = ref<{ name: string; id: number | string }[]>([]);
const dataForm = ref({
	id: '',
	columnId: '',
	name: '' as string | undefined,
	description: '',
	imgUrl: '',
});
const dataRules = ref({
	imgUrl: [{ required: true, message: '图片不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '请输入文章名称', trigger: 'blur' }],
	columnId: [{ required: true, message: '请选择栏目', trigger: 'blur' }],
	description: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
});
// 打开弹窗
onMounted(async () => {
	geteChannelList();
	dataForm.value.id = '';
	const id = route.query.id as string;
	if (id) {
		getDetail(id);
	}
});
const geteChannelList = async () => {
	const { code, data } = await getUpdateArticleChannelList();
	if (code === 0) {
		channdelList.value = data;
	}
};

const getDetail = async (id: any) => {
	dataForm.value.id = id;
	const { code, data } = await contentDetail({ id });
	if (code === 0) {
		dataForm.value = data;
		if (channdelList.value.some((item: any) => item.id === dataForm.value.columnId)) {
			dataForm.value.columnId = '';
		}
	}
	console.log('channdelList.value', channdelList.value);
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	console.log('dataForm.value.description', dataForm.value.description);
	if (dataForm.value.description && !validateRichTextNotEmpty(dataForm.value.description)) {
		return useMessage().error('请输入文章内容');
	}
	if (!valid) return false;
	console.log('dataForm.value', dataForm.value);
	const params = {
		...dataForm.value,
	};
	console.log('params', params);
	if (!valid) return false;
	try {
		const request = dataForm.value.id ? updateContent : addContent;
		const { code, data } = await request(params);
		if (code === 0) {
			useMessage().success(dataForm.value.id ? '编辑成功' : '创建成功');
			refreshData();
			emit('refresh');
			// router.go(-1);
			router.replace({
				path: '/culture/contentCenter/index',
				query: { active: '2' },
			});
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
		const containsImage = /<img[^>]+>/gi.test(html);
		if (containsImage) {
			return true;
		} else {
			return false;
		}
	}
	return true;
};
const goBack = () => {
	refreshData();
	// router.go(-1);
	router.replace({
		path: '/culture/contentCenter/index',
		query: { active: '2' },
	});
};
const refreshData = () => {
	visible.value = false;
	dataForm.value = {
		id: '',
		columnId: '',
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
