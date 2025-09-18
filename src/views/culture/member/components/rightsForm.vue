<template>
	<el-dialog :model-value="modelValue" :title="type === 'add' ? '新增权益' : '编辑权益'" destroy-on-close width="600px" @close="closeDialog">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
			<el-form-item label="权益名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入权益名称" />
			</el-form-item>
			<el-form-item label="上传权益图片" prop="image">
				<UploadImg v-model:image-url="formData.image" />
			</el-form-item>
			<el-form-item label="权益简介" prop="description">
				<el-input type="textarea" v-model="formData.description" placeholder="请输入权益简介" />
			</el-form-item>
			<el-form-item label="权益类型" prop="type">
				<el-radio-group v-model="formData.type">
					<el-radio label="优惠券" :value="1" />
					<el-radio label="免费配送" :value="2" />
					<el-radio label="专属客服" :value="3" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="优惠券选择" prop="couponIds" v-if="formData.type === 1">
				<el-select v-model="formData.couponIds" placeholder="请选择" multiple clearable>
					<el-option :label="b.name" :value="b.id" v-for="(b, j) of couponList" :key="j"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="适用付费会员类型" prop="cardIds">
				<el-select v-model="formData.cardIds" placeholder="请选择" multiple clearable>
					<el-option :label="a.name" :value="a.id" v-for="(a, i) of memberList" :key="i"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="使用规则" prop="useRule">
				<el-input type="textarea" v-model="formData.useRule" placeholder="请输入使用规则" />
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
import UploadImg from '/@/components/Upload/Image.vue';
import { addBenefitApi, editBenefitApi, memberListApi, couponListApi } from '/@/api/culture/member';

const props = defineProps<{
	modelValue: boolean;
	row?: any;
	type: string;
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = ref({
	name: '',
	image: '',
	description: '',
	type: 1,
	couponIds: [],
	cardIds: [],
	useRule: '',
});

const formRules = reactive({
	name: [{ required: true, message: '请输入权益名称', trigger: 'blur' }],
	couponIds: [{ required: true, message: '请选择优惠券', trigger: 'change' }],
	cardIds: [{ required: true, message: '请选择适用付费会员类型', trigger: 'change' }],
});

const emits = defineEmits<{
	(event: 'update:modelValue', val: boolean): void;
	(event: 'ok', params?: any): void;
}>();

const handleSubmit = () => {
	formRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			loading.value = true;
			const res = props.type === 'edit' ? await editBenefitApi(formData.value) : await addBenefitApi(formData.value);
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

const memberList = ref();
const getMemberList = async () => {
	const res = await memberListApi({});
	memberList.value = res.data || [];
};

const couponList = ref();
const getCouponList = async () => {
	const res = await couponListApi({ current: 1, size: 999 });
	couponList.value = res.data?.records || [];
};

watch(
	() => props.modelValue,
	(newUid) => {
		if (newUid) {
			try {
				loading.value = true;
				formData.value = props.row;
				getMemberList();
				getCouponList();
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
