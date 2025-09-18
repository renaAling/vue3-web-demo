<template>
	<el-dialog :close-on-click-modal="false" title="查看" width="800" draggable v-model="visible">
		<div class="flex" style="justify-content: space-between">
			<el-form :model="form" label-width="100px" ref="dataFormRef" v-loading="loading" style="width: 60%">
				<el-form-item label="推送ID" prop="pushId">
					<span>{{ form.pushId }}</span>
				</el-form-item>
				<!-- <el-form-item label="规则详情" prop="name">
					<span>{{ form.name }}</span>
				</el-form-item> -->
				<el-form-item label="推送对象" prop="pushTarget">
					<span>{{ form.pushTarget }}</span>
				</el-form-item>
				<el-form-item label="推送途径" prop="pushChannel">
					<span>{{ form.pushChannel == 2 ? '站内消息' : '短信' }}</span>
				</el-form-item>
				<el-form-item label="推送内容" prop="pushContent">
					<span>{{ form.pushContent }}</span>
				</el-form-item>
				<el-form-item label="推送时间" prop="name">
					<span>{{ form.pushTime }}</span>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { pageMemberMarketingPushLogGetApi } from '/@/api/member/marketing/marketing';
import { addBackendUser, updateBackendUser } from '/@/api/member/backendUsers/user';
import { batchSysPermission } from '/@/api/portal';
// import { addBackendUser } from '/@/api/points/manage';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh', 'addToDetail']);
const dataFormRef = ref<any>();
const visible = ref(false);
const loading = ref(false);
const inputRef = ref();
// 提交表单数据
const form = reactive<any>({});

// 打开弹窗
const openDialog = (row?: any) => {
	console.log('row', row);
	visible.value = true;
	nextTick(() => {
		dataFormRef.value.resetFields();
		if (row) {
			Object.assign(form, row);
		}
	});
};
// 关闭弹窗
const resetForm = () => {
	dataFormRef.value.resetFields();
	visible.value = false;
};

// 提交
const onSubmit = async () => {
	console.log('form.content');
	resetForm();
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
