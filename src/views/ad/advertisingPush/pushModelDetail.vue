<template>
	<div class="layout-padding">
		<el-scrollbar class="!h-[calc(100%-60px)]">
			<el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" label-width="120px">
				<el-card>
					<template #header>
						<div class="card-header">广告推送模型</div>
					</template>
					<el-row :gutter="40">
						<el-col :span="12">
							<el-form-item label="广告模型ID">{{ formData?.code || '-' }}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="模型名称" prop="name">
								<el-input v-model="formData.name" placeholder="说明广告投放的来源、用途等等投放背景" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="12">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" v-model="formData.remark" placeholder="说明广告投放的来源、用途等等投放背景" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="12">
							<el-form-item label="模型参数" prop="param">
								<VAceEditor class="w-full h-[500px]" v-model:value="formData.param" lang="python" theme="twilight" :options="editorOptions" />
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
			</el-form>
		</el-scrollbar>
		<div class="footer-audit">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handleSave">保存</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { VAceEditor } from 'vue3-ace-editor';
// 导入必要的 Ace 模块
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';
import { useMessage } from '/@/hooks/message';
import { adPushModelDetail, adPushModelAdd, adPushModelUpdate } from '/@/api/ad/advertise';

const route = useRoute();
const router = useRouter();
const editorOptions = ref({
	fontSize: 14,
	highlightActiveLine: true,
	enableBasicAutocompletion: true,
	enableLiveAutocompletion: true,
	showLineNumbers: true,
	tabSize: 2,
});
const formData = ref({
  code: '',
	name: '',
	remark: '',
	param: '# Python 代码示例',
});
const formRules = reactive({
	name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
});

const getDataDetail = async () => {
	const res = await adPushModelDetail(route.query.code as string);
	formData.value = { ...res.data }
};
const handleCancel = () => {
	router.push({ path: '/ad/advertisingPush/pushModelManage' });
};
const formRef = ref<FormInstance>();
const loading = ref(false);
const handleSave = () => {
	formRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			loading.value = true;
			const res = route.query.code ? await adPushModelUpdate(formData.value) : await adPushModelAdd(formData.value);
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
