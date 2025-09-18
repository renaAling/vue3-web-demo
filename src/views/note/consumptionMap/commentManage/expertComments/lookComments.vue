<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-scrollbar>
				<div style="margin-left: 50px">
					<el-form :model="formData" label-width="100px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
						<el-form-item label="达人昵称：">
							{{ formData.nickName }}
						</el-form-item>
						<el-form-item label="提交时间：">
							{{ formData.createTime }}
						</el-form-item>
						<el-form-item label="商家名称：">
							{{ formData.name }}
						</el-form-item>
						<el-form-item label="关联商圈：">
							{{ formData?.subwayName || '-' }}
						</el-form-item>
						<el-form-item label="笔记内容：">
							{{ formData.content }}
						</el-form-item>
						<el-form-item label="评论图片：">
							<el-image class="w-[100px] h-[100px] mr-2" :src="formData.images" fit="contain" />
						</el-form-item>
						<div class="line"></div>
						<el-form-item label="显示状态：">
							<el-switch v-model="formData.isShow" :active-value="true" :inactive-value="false" @change="handleStatusChange(formData)" />
						</el-form-item>
					</el-form>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useMessage } from '/@/hooks/message';
import router from '/@/router';
import { commentDetailApi, commentUpdateShowApi } from '/@/api/note/noteInfo';
const route = useRoute();
const dataFormRef = ref();
const loading = ref(false);
const formData = ref<any>({});

const expertNotesDetail = async () => {
	const { code, data, msg } = await commentDetailApi(route.query.id as string);
	if (code === 0) {
		formData.value = { ...data };
	} else {
		useMessage().error(msg);
	}
};

// 定义校验规则
const dataRules = ref({});
const handleStatusChange = async (row: any) => {
	const params = { id: row.id, isShow: row.isShow };
	try {
		const { code, msg } = await commentUpdateShowApi(params);
		if (code === 0) {
			useMessage().success('修改成功');
			expertNotesDetail();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		expertNotesDetail();
	}
};

onMounted(() => {
	expertNotesDetail();
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
