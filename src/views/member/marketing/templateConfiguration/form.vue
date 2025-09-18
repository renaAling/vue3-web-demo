<template>
	<el-dialog :close-on-click-modal="false" :title="isAdd ? '新增' : '编辑'" width="800" draggable v-model="visible">
		<div class="flex" style="justify-content: space-between">
			<el-form :model="form" label-width="100px" ref="dataFormRef" :rules="dataRules" v-loading="loading" style="width: 60%">
				<el-form-item label="模板名称" prop="name">
					<el-input placeholder="请输入模板名称" clearable v-model="form.name" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="模板内容" prop="content">
					<el-input
						placeholder="请输入模板内容"
						@click="handleFocus"
						maxlength="100"
						type="textarea"
						:rows="6"
						v-model="form.content"
						show-word-limit
						ref="inputRef"
					></el-input>
				</el-form-item>
			</el-form>
			<div class="form-right">
				<div>点击变量名称，将其插入到光标处</div>
				<div class="variate">
					<span @click="insertVariable('{用户名称}')">{用户名称}</span>
					<span @click="insertVariable('{手机号}')">{手机号}</span>
					<span @click="insertVariable('{成长值}')">{成长值}</span>
					<span @click="insertVariable('{会员等级}')">{会员等级}</span>
					<span @click="insertVariable('{可用积分}')">{可用积分}</span>
					<span @click="insertVariable('{发送时间}')">{发送时间}</span>
				</div>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<!-- 已驳/通过 -->
				<el-button @click="resetForm">{{ $t('common.cancelButtonText') }}</el-button>
				<!-- <el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button> -->
				<!-- 已发起 -->
				<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { postMemberMarketingTemplateAddApi, putMemberMarketingTemplateUpdateApi } from '/@/api/member/marketing/marketing';
// import { addBackendUser, updateBackendUser } from '/@/api/member/backendUsers/user';
// import { batchSysPermission } from '/@/api/portal';
// import { addBackendUser } from '/@/api/points/manage';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh', 'addToDetail']);
const dataFormRef = ref<any>();
const visible = ref(false);
const loading = ref(false);
const isAdd = ref(true);
const inputRef = ref();
// 提交表单数据
const form = reactive({
	content: '', //内容
	name: '',
	id: '',
});
const cursorPosition = ref(0); // 光标的位置
// 这里后端要求返回{中文}，暂时不用
// const variable = ref([
// 	{
// 		label: '{{用户名称}}',
// 		value: '{{userName}}',
// 	},
// 	{
// 		label: '{{手机号}}',
// 		value: '{{mobil}}',
// 	},
// 	{
// 		label: '{{成长值}}',
// 		value: '{{growthValue}}',
// 	},
// 	{
// 		label: '{{会员等级}}',
// 		value: '{{level}}',
// 	},
// 	{
// 		label: '{{可用积分}}',
// 		value: '{{score}}',
// 	},
// 	{
// 		label: '{{发送时间}}',
// 		value: '{{time}}',
// 	},
// ]);

const handleFocus = () => {
	const textareaElm = inputRef.value?.textarea;
	if (textareaElm) {
		cursorPosition.value = textareaElm.selectionStart;
	}
};

const insertVariable = (key: string) => {
	const textareaElm = inputRef.value?.textarea;
	if (!textareaElm) return;

	const startPos = textareaElm.selectionStart;
	const endPos = textareaElm.selectionEnd;

	// 更新输入值
	form.content = form.content.substring(0, startPos) + key + form.content.substring(endPos);

	// 设置新的光标位置
	setTimeout(() => {
		textareaElm.focus();
		textareaElm.setSelectionRange(startPos + key.length, startPos + key.length);
	}, 0);
};
// 定义校验规则
const dataRules = ref({
	name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row?: any) => {
	console.log('row', row);
	visible.value = true;
	isAdd.value = true;
	// form.unionId = '';
	nextTick(() => {
		dataFormRef.value.resetFields();
		if (row) {
			isAdd.value = false;
			Object.assign(form, row);
		}
	});
};
// 关闭弹窗
const resetForm = () => {
	dataFormRef.value.resetFields();
	visible.value = false;
	// useMessage().error('充值失败');
};

// 提交
const onSubmit = async () => {
	console.log('form.content');

	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	// if (form.content) {
	// 	// 使用正则匹配 {{xxx}} 并替换
	// 	const result = form.content.replace(/({{.*?}})/g, (match) => {
	// 		const found = variable.value.find((item) => item.label === match);
	// 		return found ? found.value : match;
	// 	});
	// 	console.log('result', result);
	// 	form.content = result;
	// }
	try {
		loading.value = true;
		const { code, data, msg } = form.id ? await putMemberMarketingTemplateUpdateApi(form) : await postMemberMarketingTemplateAddApi(form);
		if (code === 0) {
			console.log('aaa', data);
			useMessage().success(`${form.id ? '修改' : '添加'} 成功`);
			dataFormRef.value.resetFields();
			visible.value = false;
			emit('refresh');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.upload_icon {
	position: absolute;
	width: 24px;
	height: 24px;
	left: 62px;
	top: 62px;
	border-radius: 100px;
	border: 2px solid #ffffff;
	background-color: #e8f3ff;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
.form-right {
	background-color: #f2f2f2;
	padding: 10px;
	margin-bottom: 5px;
}
.variate {
	color: #0fa2dc;
	display: flex;
	flex-direction: column;
}
</style>
