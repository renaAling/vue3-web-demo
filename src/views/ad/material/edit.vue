<template>
	<div class="layout-padding" style="overflow: auto">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" label-width="120px">
			<el-card>
				<template #header>
					<div class="card-header">通用设置</div>
				</template>
				<el-row :gutter="40">
					<el-col :span="8">
						<el-form-item label="广告位名称" prop="name">
							<el-input v-model="formData.name" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="广告位ID" prop="code">
							{{ formData.code }}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="所处页面说明" prop="pageDesc">
							<el-input type="textarea" v-model="formData.pageDesc" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="素材格式及尺寸说明" prop="formatDesc">
							<el-input type="textarea" v-model="formData.formatDesc" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<div class="footer-audit">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" :loading="loading" @click="handleSave">提交</el-button>
			</div>
		</el-form>
	</div>
</template>
<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { adSpaceDetail, adSpaceUpdate } from '/@/api/ad/advertise';

const router = useRouter();
const route = useRoute();
const formData = ref({
	code: '',
	name: '',
	pageDesc: '',
	formatDesc: '',
});
const formRules = reactive({
	name: [{ required: true, message: '请输入广告位名称', trigger: 'blur' }],
	pageDesc: [{ required: true, message: '请输入所处页面说明', trigger: 'blur' }],
	formatDesc: [{ required: true, message: '请输入素材格式及尺寸说明', trigger: 'blur' }],
});
const handleCancel = () => {
	router.push({ path: '/ad/material/advertising' });
};
const getDataDetail = async () => {
	const res = await adSpaceDetail(route.query.code as string);
	formData.value = res.data;
};
const formRef = ref<FormInstance>();
const loading = ref(false);
const handleSave = () => {
	formRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			loading.value = true;
			const res = await adSpaceUpdate(formData.value);
			if (res?.ok) {
				loading.value = false;
				useMessage().success('操作成功');
				handleCancel();
			} else {
				loading.value = false;
				useMessage().error(res?.msg || '操作失败');
			}
		} catch (err: any) {
			const errorMsg = err?.msg || '操作失败';
			useMessage().error(errorMsg);
		} finally {
			loading.value = false;
		}
	});
};

watch(
	() => route.query.code,
	(newUid) => {
		if (newUid) {
			try {
				loading.value = true;
				getDataDetail();
			} catch (err) {
				loading.value = false;
			} finally {
				loading.value = false;
			}
		}
	},
	{ immediate: true }
);
</script>
<style lang="scss" scoped>
.el-form .el-form-item:last-of-type {
	margin-bottom: 18px !important;
}
</style>
