<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" draggable width="30%" :close-on-click-modal="false" :show-close="false">
			<el-form :model="form" ref="queryRef" :rules="rules" @keyup.enter="submit(queryRef)">
				<el-form-item label="分组名称" prop="groupName" label-width="80">
					<el-input placeholder="请输入分组名称" maxlength="30" v-model="form.groupName" clearable />
				</el-form-item>
				<el-form-item label="分组描述" prop="groupDescription" label-width="80">
					<el-input placeholder="请输入分组描述" maxlength="300" :rows="2" type="textarea" v-model="form.groupDescription" clearable />
				</el-form-item>
				<el-form-item label="状态" prop="status" label-width="80">
					<el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="cancel(queryRef)">取消</el-button>
				<el-button type="primary" @click="submit(queryRef)"> 确认 </el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="form-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { getActivityInfoGroupAdd, getActivityInfoGroupUpdate } from '/@/api/operationConfig/activityInformation';
// const emit = defineEmits(['refresh']);
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const title = ref('');
const dialogType = ref('');
const queryRef = ref<FormInstance>();
const router = useRouter();
const form = ref<any>({
	groupName: '',
	groupDescription: '',
	status: 0,
});
const rules = reactive<FormRules<any>>({
	groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
});

const openDialog = async (row: object, type: string) => {
	dialogType.value = type;
	dialogType.value === 'add' ? (title.value = '新建分组') : (title.value = '编辑分组');
	visible.value = true;
	console.log('row', row);
	if (row) {
		Object.assign(form.value, row);
	}
};
const submit = async (formEl: FormInstance | undefined) => {
	console.log('form', form.value);
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			try {
				let res = dialogType.value === 'add' ? await getActivityInfoGroupAdd(form.value) : await getActivityInfoGroupUpdate(form.value);
				emit('refresh');
				cancel(queryRef.value);
				// state.dataList = res.data;
			} catch (err: any) {
				useMessage().error(err.msg);
				// console.log('err', err);
			}
			visible.value = false;
		} else {
			// console.log('error submit!', fields);
		}
	});
};
const cancel = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	Object.assign(form.value, {
		groupName: '',
		groupDescription: '',
		status: 0,
	});
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.form-btn {
	display: flex;
	justify-content: flex-end;
}
</style>
