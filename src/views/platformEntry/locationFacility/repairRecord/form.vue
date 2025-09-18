<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" width="30%" :close-on-click-modal="false">
			<el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm">
				<el-form-item label="设备ID" prop="code">
					<span>{{ ruleForm.code }}</span>
				</el-form-item>
				<el-form-item label="设备名称" prop="name">
					<span>{{ ruleForm.name }}</span>
				</el-form-item>
				<el-form-item label="场所ID" prop="placeCode">
					<span>{{ ruleForm.placeCode }}</span>
				</el-form-item>
				<el-form-item label="场所名称" prop="placeName">
					<span>{{ ruleForm.placeName }}</span>
				</el-form-item>
				<el-form-item label="发现故障时间" prop="faultTime">
					<span>{{ ruleForm.faultTime }}</span>
				</el-form-item>
				<el-form-item label="报修原因" prop="repairReason">
					{{ ruleForm.repairReason }}
				</el-form-item>
				<el-form-item label="处理结果" prop="processResult">
					<el-input v-model="ruleForm.processResult" placeholder="请输入处理结果" maxlength="300" :rows="5" type="textarea" show-word-limit />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)">处理 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { orderDetail } from '/@/api/goodStore/order';
import type { FormInstance, FormRules } from 'element-plus';
import { getPlatformDeviceHandle } from '/@/api/platformEntry/repairRecord';
import { useMessage } from '/@/hooks/message';
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const ruleFormRef = ref<FormInstance>();
const placeNameArr = ref([]) as any;
const digitalSystemArr = ref([]) as any;
const title = ref('');
const ruleForm = ref<any>({
	id: '',
	code: '',
	codeid: '',
	placeName: '',
	faultTime: '',
	repairReason: '',
	processResult: '',
});
watch(
	() => ruleForm.value,
	(val) => {
		if (val) {
			console.log('val', val);
			// const obj = statusArr.value.find((item: any) => item.value === val);
			// ruleForm.ztnr = obj.ztnr;
		} else {
			// ruleForm.ztnr = '';
		}
	},
	{ immediate: true }
);
const openDialog = async (row: any) => {
	title.value = '处理';
	Object.assign(ruleForm.value, row);
	visible.value = true;
};

const rules = reactive<FormRules<any>>({
	processResult: [{ required: true, message: '请输入处理结果', trigger: 'blur' }],
});
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', ruleForm.value);
			try {
				let res = await getPlatformDeviceHandle({
					id: Number(ruleForm.value.id),
					code: ruleForm.value.code,
					processResult: ruleForm.value.processResult,
				});
				if (res.code === 0) {
					useMessage().success('处理成功');
					visible.value = false;
					emit('refresh');
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
.uploader-text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #999;
	font-size: 14px;
	.avatar-uploader-icon {
		margin-bottom: 5px;
		font-size: 32px;
	}
}
</style>
