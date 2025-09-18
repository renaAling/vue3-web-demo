<template>
	<div>
		<el-dialog title="发布" ref="myDialog" v-model="visible" draggable width="40%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item prop="releaseType">
					<el-radio-group v-model="model.releaseType">
						<el-radio :label="item.code" v-for="(item, index) in releaseTypeList" :key="index">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="releseTime" v-if="model.releaseType == 2">
					<el-date-picker v-model="model.releseTime" type="datetime" placeholder="请选择发布时间" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">发布</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
// import { configAdd, configDetail, configUpdate, getStoreNameInfo, getProductList } from '/@/api/operationConfig/firstPage';

const emit = defineEmits(['refresh']);
const releaseTypeList = ref<any[]>([
	{
		name: '立即发布',
		code: 1,
	},
	{
		name: '定时发布',
		code: 2,
	},
]);

const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const locationType = ref('');
const loading = ref(false);
const model = ref<any>({
	releaseType: 1,
	releseTime: [],
});
const formRules = reactive<FormRules>({
	releaseType: [{ required: true, message: '请选择发布类型' }],
	releseTime: [{ required: true, message: '请选择发布时间' }],
});
const openDialog = async (activeName: string, id: string | null) => {
	locationType.value = activeName;
	// if (id) {
	// 	try {
	// 		const { code, data } = await configDetail({ id });
	// 		if (code === 0) {
	// 			model.value = data;
	// 		}
	// 	} catch (err: any) {
	// 		useMessage().error(err.msg);
	// 	}
	// }
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	loading.value = true;
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				// const request = scopeId.value ? configUpdate : configAdd;
				// const { jumpType, jumpNewUrl, jumpUrl } = model.value;
				// const params = {
				// 	...model.value,
				// 	locationType: locationType.value,
				// 	jumpType: jumpType == '5' || jumpType == '6' ? '3' : jumpType,
				// 	jumpAddType: jumpType,
				// 	jumpUrl:
				// 		jumpType == '5'
				// 			? `/pages_main/pages/product/detail?spuCode=${jumpNewUrl}`
				// 			: jumpType == '6'
				// 			? `/pages_metro_mall/pages/detail/index?id=${jumpNewUrl}`
				// 			: jumpUrl,
				// };
				// const { code, msg } = await request(params);
				loading.value = false;
				// if (code === 0) {
				// 	useMessage().success(`${scopeId.value ? '修改' : '新建'}成功`);
				// 	resetForm(formEl);
				// 	emit('refresh');
				// } else {
				// 	useMessage().error(msg);
				// }
			} catch (err: any) {
				useMessage().error(err.msg);
				loading.value = false;
			}
		} else {
			loading.value = false;
			return false;
		}
	});
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = { releaseType: 1, releseTime: [] };
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	// if (scopeId.value) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
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
