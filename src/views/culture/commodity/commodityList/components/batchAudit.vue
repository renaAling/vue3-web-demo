<template>
	<el-dialog
		v-if="dialogVisible"
		title="商品审核"
		:visible.sync="dialogVisible"
		:append-to-body="isAppend"
		width="540px"
		:before-close="handleClose"
		class="projectInfo"
	>
		<el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" class="demo-formData">
			<el-form-item label="审核状态" prop="auditStatus">
				<el-radio-group v-model="formData.auditStatus">
					<el-radio label="success">通过</el-radio>
					<el-radio label="fail">拒绝</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="formData.auditStatus === 'fail'" label="原因" prop="reason">
				<el-input v-model="formData.reason" type="textarea" placeholder="请输入原因" />
			</el-form-item>
			<el-form-item>
				<div class="dialog-footer-inner">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="submitForm">提交</el-button>
				</div>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { productBatchAuditApi } from '/@/api/culture/commodity/commodityList';
// import Debounce from '@/libs/debounce';
// import { productBatchAuditApi } from '@/api/product';

// Props
const props = defineProps<{
	idList: number[];
}>();

// Emits
const emit = defineEmits<{
	(e: 'subBatchAuditSuccess'): void;
}>();

// Data
const dialogVisible = ref<boolean>(false);
const isAppend = ref<boolean>(true);
const formRef = ref();
const formData = reactive({
	reason: '',
	auditStatus: 'success' as 'success' | 'fail',
	idList: [] as number[],
});

// Rules
const rules = {
	auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
	reason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }],
};

// Methods
const handleClose = () => {
	dialogVisible.value = false;
	formData.reason = '';
	formData.auditStatus = 'success';
	formData.idList = [];
};

const submitForm = () => {
	formRef.value.validate(async (valid: boolean) => {
		if (valid) {
			formData.idList = props.idList;
			try {
				const { code, data, msg } = await productBatchAuditApi(formData);
				if (code === 0) {
					useMessage().success('操作成功');
					handleClose();
					emit('subBatchAuditSuccess');
				} else {
					useMessage().error(msg);
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		}
	});
};

// Expose open method to parent component
const openDialog = () => {
	dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>

<style scoped lang="scss"></style>
