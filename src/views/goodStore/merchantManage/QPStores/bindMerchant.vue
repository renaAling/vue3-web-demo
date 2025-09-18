<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="30%" :close-on-click-modal="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item label="商户" prop="merchantCode">
					<el-select
						v-model="model.merchantCode"
						@keyup.enter="handleKeyUp(true)"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键字查询搜索"
						:remote-method="(val:any)=>getMerchantsList(val)"
						:loading="loading"
					>
						<el-option v-for="item in merchantsList" :key="item.value" :label="`${item.label}`" :value="item.value" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { storeBindApi } from '/@/api/trcomps/store';
import { merchantListApi } from '/@/api/trcomps/merchant';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('绑定商家');
const formRef = ref();
const scopeId = ref<string | null>('');

const model = ref<{ [key: string]: string }>({
	merchantCode: '',
});
const merchantsList = ref<
	Array<{
		label?: string;
		value?: number | string;
	}>
>([]);

const loading = ref(false);

//   表单校验规则
const formRules = reactive<FormRules>({
	merchantCode: [{ required: true, message: '请选择要绑定的商户' }],
});
const openDialog = async (val: string) => {
	scopeId.value = val;
	visible.value = true;
	getMerchantsList('');
};
let keywords: any;
const getMerchantsList = async (query: string | undefined) => {
	if (keywords === query) return;
	keywords = query;
	loading.value = true;
	try {
		const params = {
			keywords: query,
			page: 1,
			limit: 20,
		};
		const { data, code, msg } = await merchantListApi(params);
		loading.value = false;
		if (code === 0) {
			const list = data?.records?.map((item: any) => {
				return {
					label: item.name,
					value: item.merchantCode,
				};
			});
			merchantsList.value = list;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		console.log('err', err);
		useMessage().error(err.msg);
	}
};
const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm('是否绑定商家');
			} catch {
				return false;
			}
			let params = {
				id: scopeId.value,
				...model.value,
			};
			try {
				const { code, msg } = await storeBindApi(params);
				if (code === 0) {
					useMessage().success('绑定成功');
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};
// 输入框回车事件
const handleKeyUp = (enterable: Boolean) => {
	if (!enterable) return;
	onSubmit(formRef.value);
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	Object.keys(model.value).forEach((key) => (model.value[key] = ''));
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会取消绑定商家，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm(formEl);
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
