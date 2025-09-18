<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="40%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item label="消息标题" prop="title">
					<el-input v-model="model.title" placeholder="请输入消息标题" maxlength="20" show-word-limit clearable />
				</el-form-item>
				<el-form-item label="消息内容" prop="content">
					<editor v-model:get-html="model.content" height="400" />
				</el-form-item>
				<el-form-item label="消息类型" prop="msgType">
					<el-radio-group v-model="model.msgType">
						<el-radio :label="item.code" v-for="(item, index) in msgTypeList" :key="index">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">保存</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { MsgConfigTypes } from '../types';
import { useMessage, useMessageBox } from '/@/hooks/message';

const emit = defineEmits(['refresh']);

const dialogTitle = ref('新建配置');
const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const scopeId = ref<string | null>('');
const locationType = ref('');
const loading = ref(false);

const msgTypeList = ref<any[]>([
	{
		name: '系统消息',
		code: 1,
	},
	{
		name: '业务消息',
		code: 2,
	},
]);

const model = ref<MsgConfigTypes>({
	title: '',
	content: '',
	msgType: 1,
});

const formRules = reactive<FormRules>({
	title: [{ required: true, message: '请输入标题' }],
	content: [{ required: true, message: '请输入内容' }],
	msgType: [{ required: true, message: '请选择类型' }],
});
const openDialog = async (preTitle: string, activeName: string, id: string | null) => {
	// scopeId.value = id;
	// locationType.value = activeName;
	// if (id) {
	// 	dialogTitle.value = preTitle + '编辑配置';
	// 	try {
	// 		const { code, data } = await configDetail({ id });
	// 		if (code === 0) {
	// 			model.value = data;
	// 			model.value.identityCodes = data.visibleIdentity.map((item: any) => item.identityCode);
	// 			if (model.value.jumpAddType == '5') {
	// 				getProductList().then((res) => {
	// 					if (res.code == 0) {
	// 						const spuCode = getQueryParameter('spuCode', model.value.jumpUrl);
	// 						productList.value = res.data.map((item: any) => {
	// 							return {
	// 								label: item.spuName,
	// 								value: item.spuCode,
	// 							};
	// 						});
	// 						res.data.forEach((item: any) => {
	// 							if (item.spuCode === spuCode) {
	// 								model.value.jumpNewUrl = item.spuCode;
	// 							}
	// 						});
	// 					}
	// 				});
	// 			} else if (model.value.jumpAddType == '6') {
	// 				getStoreNameInfo().then((res) => {
	// 					if (res.code == 0) {
	// 						const id = getQueryParameter('id', model.value.jumpUrl);
	// 						storeList.value = res.data.map((item: any) => {
	// 							return {
	// 								label: item.storeName,
	// 								value: item.storeCode,
	// 								id: item.id,
	// 							};
	// 						});
	// 						res.data.forEach((item: any) => {
	// 							if (item.id === id) {
	// 								model.value.jumpNewUrl = item.id;
	// 							}
	// 						});
	// 					}
	// 				});
	// 			}
	// 		}
	// 	} catch (err: any) {
	// 		useMessage().error(err.msg);
	// 	}
	// } else {
	// 	dialogTitle.value = preTitle + '新建配置';
	// }
	visible.value = true;
};

function getQueryParameter(paramName: any, url: string) {
	const index = url?.indexOf('?') + 1;
	const queryString = url?.slice(index);
	const params = new URLSearchParams(queryString);
	return params.get(paramName);
}

const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	loading.value = true;
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			// 	try {
			// 		await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}配置`, `${scopeId.value ? '修改' : '新建'}配置`);
			// 	} catch {
			// 		return false;
			// 	}
			// 	try {
			// 		const request = scopeId.value ? configUpdate : configAdd;
			// 		const { jumpType, jumpNewUrl, jumpUrl } = model.value;
			// 		const params = {
			// 			...model.value,
			// 			locationType: locationType.value,
			// 			jumpType: jumpType == '5' || jumpType == '6' ? '3' : jumpType,
			// 			jumpAddType: jumpType,
			// 			jumpUrl:
			// 				jumpType == '5'
			// 					? `/pages_main/pages/product/detail?spuCode=${jumpNewUrl}`
			// 					: jumpType == '6'
			// 					? `/pages_metro_mall/pages/detail/index?id=${jumpNewUrl}`
			// 					: jumpUrl,
			// 		};
			// 		const { code, msg } = await request(params);
			// 		loading.value = false;
			// 		if (code === 0) {
			// 			useMessage().success(`${scopeId.value ? '修改' : '新建'}成功`);
			// 			resetForm(formEl);
			// 			emit('refresh');
			// 		} else {
			// 			useMessage().error(msg);
			// 		}
			// 	} catch (err: any) {
			// 		useMessage().error(err.msg);
			// 		loading.value = false;
			// 	}
		} else {
			loading.value = false;
			return false;
		}
	});
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		title: '',
		content: '',
		msgType: 1,
	};
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) return resetForm(formEl);
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
