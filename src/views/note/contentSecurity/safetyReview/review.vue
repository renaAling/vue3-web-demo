<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<div style="margin-left: 50px">
				<el-form :model="formData" label-width="100px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
					<el-form-item label="内容类型：">
						{{ formData.type === 1 ? '笔记' : formData.type === 2 ? '评论' : '-' }}
					</el-form-item>
					<el-form-item label="用户昵称：">
						{{ formData?.nickName || '-' }}
					</el-form-item>
					<el-form-item label="提交时间：">
						{{ formData.createTime }}
					</el-form-item>
					<el-form-item label="商家名称：">
						{{ formData?.name || '-' }}
					</el-form-item>
					<el-form-item label="关联商圈:">
						{{ formData?.subwayName || '-' }}
					</el-form-item>
					<el-form-item label="内容：">
						{{ formData?.content || '-' }}
					</el-form-item>
					<el-form-item label="图片/视频:">
						<el-image v-for="(a, i) of formData?.images" :key="i" class="w-[100px] h-[100px] mr-2" :src="a" fit="contain" />
					</el-form-item>
					<div class="line"></div>
					<el-form-item label="审核结果" prop="status">
						<el-select class="!w-[200px]" v-model="formData.status" placeholder="请选择">
							<!-- 1-待审核 2-高风险 3-已通过 -->
							<el-option label="高风险" :value="2"></el-option>
							<el-option label="已通过" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="显示状态" prop="isShow">
						<el-radio-group v-model="formData.isShow">
							<el-radio :value="true">显示</el-radio>
							<el-radio :value="false">隐藏</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<div class="flex align-center justify-center mt-10">
					<span class="dialog-footer">
						<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import type { FormRules } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { commentDetailApi, commentAuditApi } from '/@/api/note/noteInfo';
const route = useRoute();
const router = useRouter();
const dataFormRef = ref();
const loading = ref(false);
const formData = ref<any>({});
// 定义校验规则
const dataRules = reactive<FormRules<any>>({
	status: [{ required: true, message: '请选择', trigger: 'change' }],
	isShow: [{ required: true, message: '请选择', trigger: 'change' }],
});
const commentDetail = async () => {
	const { code, data, msg } = await commentDetailApi(route.query.id as string);
	if (code === 0) {
		formData.value = { ...data, images: data?.images?.split(',') };
	} else {
		useMessage().error(msg);
	}
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const res = await commentAuditApi(formData.value);
		if (res?.ok) {
			useMessage().success('编辑成功');
			dataFormRef.value.resetFields();
			router.push({
				path: '/note/contentSecurity/safetyReview/index',
			});
		} else {
			useMessage().error(res?.msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
onMounted(() => {
	commentDetail();
});
</script>
<style lang="scss" scoped>
.line {
	width: 100%;
	height: 1px;
	background-color: #000;
	margin-bottom: 20px;
}
</style>
