<template>
	<el-dialog :model-value="modelValue" :title="type === 'add' ? '新增' : '编辑'" destroy-on-close width="700px" @close="closeDialog">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
			<el-form-item label="批次名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入批次名称" />
			</el-form-item>
			<el-form-item label="关联会员类型" prop="cardId">
				<el-select v-model="formData.cardId" placeholder="请选择关联会员类型" clearable>
					<el-option :label="a.name" :value="a.id" v-for="(a, i) of memberList" :key="i"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="卡密数量" prop="num">
				<el-input-number v-model="formData.num" placeholder="请输入" :min="1" :max="999999" controls-position="right" />
			</el-form-item>
			<el-form-item label="有效期" prop="daterangeTime">
				<el-checkbox label="长期" v-model="formData.isLasting" @change="handleLastingChange" />
				<el-date-picker
					class="ml-[10px]"
					:disabled="formData.isLasting"
					v-model="formData.daterangeTime"
					:clearable="false"
					@change="changeTime"
					type="daterange"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					value-format="YYYY-MM-DD"
				/>
			</el-form-item>
			<el-form-item label="销售渠道" prop="saleWay">
				<el-select v-model="formData.saleWay" placeholder="请选择销售渠道" clearable>
					<el-option label="线上购买" :value="1"></el-option>
					<el-option label="线下赠送" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="使用限制" prop="useRule">
				<el-radio-group v-model="formData.useRule">
					<el-radio label="限制每人仅可使用一次" :value="1" />
					<el-radio label="限制仅新用户可用" :value="2" />
					<el-radio label="不限" :value="3" />
				</el-radio-group>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input type="textarea" v-model="formData.remark" placeholder="请输入备注" />
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
import { addPaidMemberCdkeyApi, editPaidMemberCdkeyApi, memberListApi } from '/@/api/culture/member';

const props = defineProps<{
	modelValue: boolean;
	row?: any;
	type: string;
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = ref({
	name: '',
	cardId: '',
	num: null,
	startTime: '',
	endTime: '',
	daterangeTime: [],
	isLasting: false,
	saleWay: '',
	useRule: '',
	remark: '',
	status: true,
});

const formRules = reactive({
	name: [{ required: true, message: '请输入批次名称', trigger: 'blur' }],
	cardId: [{ required: true, message: '请选择', trigger: 'change' }],
	num: [{ required: true, message: '请输入卡密数量', trigger: 'blur' }],
	isLasting: [{ required: true, message: '请选择', trigger: 'change' }],
	daterangeTime: [
		{
			required: true,
			validator: (rule: any, value: any, callback: any) => {
				if (!formData.value.isLasting && (!value || value.length !== 2)) {
					callback(new Error('请选择有效期'));
				} else {
					callback();
				}
			},
			trigger: 'change',
		},
	],
	saleWay: [{ required: true, message: '请选择', trigger: 'change' }],
	useRule: [{ required: true, message: '请选择', trigger: 'change' }],
	remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
	status: [{ required: true, message: '请选择', trigger: 'change' }],
});

const emits = defineEmits<{
	(event: 'update:modelValue', val: boolean): void;
	(event: 'ok', params?: any): void;
}>();

const changeTime = (val: any) => {
	if (formData.value.daterangeTime) {
		formData.value.startTime = `${val[0]} 00:00:00`;
		formData.value.endTime = `${val[1]} 23:59:59`;
	}
};

const handleLastingChange = (val: any) => {
	if (val) {
		formData.value.daterangeTime = [];
		formData.value.startTime = '';
		formData.value.endTime = '';
	}
};

const handleSubmit = () => {
	formRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			loading.value = true;
			const res = props.type === 'edit' ? await editPaidMemberCdkeyApi(formData.value) : await addPaidMemberCdkeyApi(formData.value);
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

watch(
	() => props.modelValue,
	(newUid) => {
		if (newUid) {
			try {
				loading.value = true;
				formData.value = { ...props.row };
				getMemberList();
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
