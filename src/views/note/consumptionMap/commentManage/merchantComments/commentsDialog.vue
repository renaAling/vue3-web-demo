<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="44%" :before-close="resetForm">
			<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="100px">
				<el-form-item label="选择身份">
					<el-radio-group v-model="formData.userType">
						<el-radio :value="1">地铁达人</el-radio>
						<el-radio :value="2">普通用户</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="达人姓名:" prop="nickName" v-if="formData.userType === 1">
					<el-input v-model="formData.nickName" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="用户姓名:" prop="nickName" v-if="formData.userType === 2">
					<el-input v-model="formData.nickName" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="评分:" prop="score">
					<el-input-number placeholder="请输入" v-model="formData.score" clearable :min="0" :max="5" :precision="1" />
					<span>范围0-5</span>
				</el-form-item>
				<el-form-item label="评论内容:" prop="content" v-if="formData.userType === 1">
					<el-input v-model="formData.content" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="评论内容:" prop="content" v-if="formData.userType === 2">
					<div class="flex w-full" v-for="(category, categoryIndex) of commentList" :key="categoryIndex">
						<span class="w-[80px]">{{ category.title }}: </span>
						<div v-for="item of category.list" :key="item.id">
							<span class="comment-option" :class="{ selected: isSelected(item) }" @click="handleClick(item)">
								{{ item.name }}
							</span>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="图片:" prop="images" v-if="formData.userType === 1">
					<div class="upload-item flex items-center flex-wrap">
						<UploadImg
							class="mr-[10px]"
							v-for="(item, index) in formData.images"
							:key="index"
							v-model:imageUrl="formData.images[index]"
							:fileType="['image/jpeg', 'image/jpg', 'image/png']"
						/>
						<el-button v-if="formData.images.length < 9" @click="handleCreateUploadComponent" type="primary"> 添加上传图片 </el-button>
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">确定 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ElForm } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { commentAddApi, getCommentConfigApi } from '/@/api/note/noteInfo';
import UploadImg from '/@/components/Upload/Image.vue';

const route = useRoute();
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('新增');
const ruleFormRef = ref<FormInstance>();
const emit = defineEmits(['refresh']);
const formData = ref<any>({
	code: route.query.ipoCode as string,
	type: 1, // 1-商户评论 2-活动评论 3-笔记评论
	userType: 1,
	nickName: '',
	score: 0,
	content: [],
	images: [],
});

const rules = reactive<FormRules<any>>({
	nickName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	userType: [{ required: true, message: '请选择', trigger: 'change' }],
	score: [{ required: true, message: '请输入评分', trigger: 'blur' }],
	content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }],
});

const openDialog = (row?: any) => {
	if (row?.id) {
		dialogTitle.value = '编辑';
	} else {
		dialogTitle.value = '新增';
	}
	getCommentConfig();
	visible.value = true;
};

const commentList = ref();
const getCommentConfig = async () => {
	const res = await getCommentConfigApi();
	if (res?.ok) {
		let arr = [];
		for (const key in res.data) {
			if (Object.prototype.hasOwnProperty.call(res.data, key)) {
				let title = '';
				switch (key) {
					case '1':
						title = '服务';
						break;
					case '2':
						title = '环境';
						break;
					case '3':
						title = '性价比';
						break;
					default:
						title = '其他';
						break;
				}
				arr.push({
					title,
					list: res.data[key],
				});
			}
		}
		commentList.value = arr;
	}
};

const handleCreateUploadComponent = () => {
	const MAX_IMAGES = 9;
	if (formData.value.images.some((img: any) => !img)) {
		useMessage().error('请先上传已有的图片');
		return;
	}
	if (formData.value.images.length >= MAX_IMAGES) {
		useMessage().error(`最多上传${MAX_IMAGES}张轮播图`);
		return;
	}
	formData.value.images.push('');
};

const handleClick = (item: any) => {
	const index = formData.value.content.indexOf(item.id);
	if (index > -1) {
		formData.value.content.splice(index, 1);
	} else {
		formData.value.content.push(item.id);
	}
};

const isSelected = (item: any) => {
	return formData.value.content.includes(item.id);
};

// 获取选中项的名称
const getSelectedNames = () => {
	return commentList.value
		.flatMap((category: any) => category.list.filter((item: any) => formData.value.content.includes(item.id)))
		.map((item: any) => item.name);
};

const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid: boolean) => {
		if (!valid) return;
		const res =
			formData.value.userType === 2
				? await commentAddApi({ ...formData.value, content: getSelectedNames().join(',') })
				: await commentAddApi({ ...formData.value, images: formData.value.images.join(',') });
		if (res?.ok) {
			useMessage().success(res?.msg || '操作成功');
			emit('refresh');
			visible.value = false;
		} else {
			useMessage().error(res?.msg);
		}
	});
};

const resetForm = async () => {
	try {
		await useMessageBox().confirm('确定要取消吗？', '提示');
	} catch {
		return;
	}
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.comment-option {
	margin: 4px;
	border: 1px solid #dcdfe6;
	border-radius: 20px;
	padding: 0 10px;
	cursor: pointer;
	display: inline-block;
}
.comment-option.selected {
	background-color: #409eff;
	color: #fff;
	border-color: #409eff;
}
</style>
