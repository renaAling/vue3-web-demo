<template>
	<el-dialog :model-value="modelValue" :title="type === 'add' ? '新增' : '编辑'" destroy-on-close width="600px" @close="closeDialog">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
			<el-form-item label="会员名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入会员名称" />
			</el-form-item>
			<el-form-item label="有效期(天)" prop="deadlineDay">
				<el-input-number
					:disabled="formData.type === 2"
					v-model="formData.deadlineDay"
					placeholder="请输入"
					:min="1"
					:max="999999"
					controls-position="right"
				/>
				<el-radio-group v-model="formData.type" @change="handleTypeChange">
					<el-radio label="期限" :value="1" />
					<el-radio label="永久" :value="2" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="原价(元)" prop="originalPrice">
				<el-input-number v-model="formData.originalPrice" placeholder="请输入" :min="1" :max="999999" controls-position="right" />
			</el-form-item>
			<el-form-item label="优惠价(元)" prop="price">
				<el-input-number v-model="formData.price" placeholder="请输入" :min="1" :max="999999" controls-position="right" />
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="formData.sort" placeholder="请输入" :min="0" controls-position="right" />
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-switch v-model="formData.status" inline-prompt :active-value="true" :inactive-value="false" active-text="开" inactive-text="关" />
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
import { addMemberCardApi, editMemberCardApi } from '/@/api/culture/member';

const props = defineProps<{
	modelValue: boolean;
	row?: any;
	type: string;
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = ref({
	name: '',
	deadlineDay: '',
	originalPrice: '',
	price: '',
	sort: '',
	status: false,
	type: 1,
});

const formRules = reactive({
	name: [{ required: true, message: '请输入会员名称', trigger: 'blur' }],
	type: [{ required: true, message: '请选择', trigger: 'change' }],
	deadlineDay: [
		{
			required: true,
			validator: (rule: any, value: any, callback: any) => {
				// 仅当 type=1（期限）时校验必填
				if (formData.value.type === 1 && (!value || value < 1)) {
					callback(new Error('请输入有效期'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	originalPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
	price: [{ required: true, message: '请输入优惠价', trigger: 'blur' }],
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
	status: [{ required: true, message: '请选择', trigger: 'change' }],
});

const emits = defineEmits<{
	(event: 'update:modelValue', val: boolean): void;
	(event: 'ok', params?: any): void;
}>();

const handleTypeChange = (val: number) => {
	if (val === 2) {
		formData.value.deadlineDay = '';
	}
};

const handleSubmit = () => {
	const params = { ...formData.value, giftBalance: 0, isFirstChargeGive: false };
	formRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			loading.value = true;
			const res = props.type === 'edit' ? await editMemberCardApi(params) : await addMemberCardApi(params);
			if (res?.ok) {
				loading.value = false;
				useMessage().success('操作成功');
				closeDialog();
				emits('ok', formData);
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
