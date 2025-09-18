<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar>
				<div class="flex flex-end py-10" style="justify-content: flex-end">
					<el-button type="default" @click="handleHistory">历史版本</el-button>
					<el-button type="primary" @click="handleEdit">编辑</el-button>
				</div>
				<div v-if="!isEdit" v-html="context" class="context"></div>
				<editor v-else v-model:get-html="context" :disabled="!isEdit" :placeholder="'请输入内容'" height="400px" />
				<div v-if="isEdit" class="flex my-10" style="justify-content: flex-end">
					<el-button @click="handleCancel">取消</el-button>
					<el-button type="primary" @click="handleSave">保存</el-button>
				</div>
			</el-scrollbar>
		</div>

		<formDialog ref="formDialogRef" @refresh="getGetmemberLevelRuleGet"></formDialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
const formDialog = defineAsyncComponent(() => import('./form.vue'));
import { getMemberLevelRuleGet, getMemberLevelAdd } from '/@/api/member/memberLevel/levelRule';
import { useMessage, useMessageBox } from '/@/hooks/message';

const formDialogRef = ref();

const context = ref('');
const isEdit = ref(false);
onMounted(() => {
	getGetmemberLevelRuleGet();
});
const getGetmemberLevelRuleGet = async () => {
	try {
		const { code, data, msg } = await getMemberLevelRuleGet();
		if (code === 0) {
			context.value = data.description;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleHistory = (row: any) => {
	formDialogRef.value.openDialog(row);
};

const handleEdit = () => {
	isEdit.value = true;
};
const handleCancel = () => {
	isEdit.value = false;
};
const handleSave = async () => {
	isEdit.value = false;
	try {
		const { code, msg } = await getMemberLevelAdd({ description: context.value });
		if (code === 0) {
			useMessage().success('编辑成功');
			getGetmemberLevelRuleGet();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>

<style lang="scss" scoped>
.context {
	min-height: 100px;
	margin: 10px 30px;
}
</style>
