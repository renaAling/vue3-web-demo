<template>
	<el-dialog
		:model-value="modelValue"
		:title="type === 'add' ? '新增' : '编辑'"
		destroy-on-close
		align-center
		width="500px"
		class="common-dialog"
		@close="closeDialog"
	>
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
			<el-form-item label="上传分销等级图片" prop="levelImage">
				<UploadImg v-model:image-url="formData.levelImage" />
			</el-form-item>
			<el-form-item label="等级序号" prop="level">
				<el-input-number v-model="formData.level" placeholder="请输入等级序号" />
			</el-form-item>
			<el-form-item label="等级名称" prop="levelName">
				<el-input v-model="formData.levelName" placeholder="请输入等级名称" />
			</el-form-item>
			<el-form-item label="升级标准" prop="standardMoney">
				<el-input v-model="formData.standardMoney" placeholder="请输入数值" type="number">
					<template #prepend> 分销订单总额达到 </template>
					<template #suffix> 元 </template>
				</el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeDialog">取消</el-button>
				<el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { distributionLevelConfigAdd, distributionLevelConfigUpdate } from '/@/api/member/distributionManage';
import UploadImg from '/@/components/Upload/Image.vue';

const props = defineProps<{
	modelValue: boolean;
	row?: any;
	type: string;
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = ref({
  levelCode: '',
  level: '',
	levelName: '',
	standardMoney: 0,
  levelImage: '',
});

const formRules = reactive({
	level: [{ required: true, message: '请输入等级序号', trigger: 'blur' }],
	levelName: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
	standardMoney: [{ required: true, message: '请输入升级标准', trigger: 'blur' }],
});

const emits = defineEmits<{
	(event: 'update:modelValue', val: boolean): void;
	(event: 'ok', params?: any): void;
}>();

const handleSubmit = () => {
	formRef?.value?.validate(async (valid: any) => {
		if (valid) {
			let res;
			loading.value = true;
			if (props.type === 'edit') {
				res = await distributionLevelConfigUpdate(formData.value).finally(() => {
					loading.value = false;
				});
			} else {
				res = await distributionLevelConfigAdd(formData.value).finally(() => {
					loading.value = false;
				});
			}
			if (res?.ok) {
				useMessage().success('操作成功');
				closeDialog();
				emits('ok', formData);
			} else {
				useMessage().error(res?.msg || '操作失败');
			}
		}
	});
};

const closeDialog = () => {
	emits('update:modelValue', false);
};

watch(
	() => props.modelValue,
	(newUid) => {
		if (newUid) {
			try {
				loading.value = true;
				formData.value = props.row;
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
