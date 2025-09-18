<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" width="30%" :close-on-click-modal="false">
			<el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm">
				<el-form-item label="设备名称" prop="name">
					<el-input v-if="dialogType !== 'repairs'" v-model="ruleForm.name" placeholder="请输入设备名称" maxlength="12" show-word-limit />
					<span v-else>{{ ruleForm.name }}</span>
				</el-form-item>
				<el-form-item label="场所" prop="placeCode">
					<el-select v-if="dialogType !== 'repairs'" v-model="ruleForm.placeCode" placeholder="请选择场所">
						<el-option v-for="item in placeCodeArr" :key="'placeCode' + item.code" :label="item.name" :value="item.code" />
					</el-select>
					<span v-else>{{ ruleForm.placeName }}</span>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select
						v-if="dialogType !== 'repairs' && ruleForm.status !== 3"
						v-model="ruleForm.status"
						placeholder="请选择状态"
						:disabled="dialogType === 'edit'"
					>
						<el-option v-for="item in statusArr" :key="'status' + item.value" :label="item.label" :value="item.value" />
					</el-select>
					<el-select
						v-if="dialogType !== 'repairs' && ruleForm.status === 3"
						v-model="ruleForm.status"
						placeholder="请选择状态"
						:disabled="dialogType === 'edit'"
					>
						<el-option v-for="item in statusData" :key="'status' + item.value" :label="item.label" :value="item.value" />
					</el-select>
					<div v-if="dialogType === 'repairs'">
						<span v-if="ruleForm.status === 1">正常</span>
						<span v-if="ruleForm.status === 2">待报修</span>
						<span v-if="ruleForm.status === 3">已报修</span>
					</div>
				</el-form-item>
				<el-form-item label="入库时间" prop="storageTime">
					<el-date-picker
						v-if="dialogType !== 'repairs'"
						v-model="ruleForm.storageTime"
						type="date"
						placeholder="请选择入库时间"
						style="width: 100%"
						value-format="YYYY-MM-DD"
					/>
					<span v-else>{{ ruleForm.storageTime }}</span>
				</el-form-item>
				<el-form-item label="设备到期时间" prop="expireTime">
					<el-date-picker
						v-if="dialogType !== 'repairs'"
						v-model="ruleForm.expireTime"
						type="date"
						:disabled-date="disabledDate"
						placeholder="请选择设备到期时间"
						style="width: 100%"
						value-format="YYYY-MM-DD"
					/>
					<span v-else>{{ ruleForm.expireTime }}</span>
				</el-form-item>
				<el-form-item v-if="dialogType === 'repairs'" label="发生故障时间" prop="faultTime">
					<el-date-picker v-model="ruleForm.faultTime" type="date" placeholder="请选择发生故障时间" style="width: 100%" value-format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item v-if="dialogType === 'repairs'" label="报修原因" prop="repairReason">
					<el-input v-model="ruleForm.repairReason" placeholder="请输入报修原因" maxlength="50" :rows="3" type="textarea" show-word-limit />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)"> {{ btnText }} </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { orderDetail } from '/@/api/goodStore/order';
import type { FormInstance, FormRules } from 'element-plus';
import {
	geplatformPlaceList,
	getPlatformDeviceAdd,
	getPlatformDeviceUpdate,
	getPlatformDeviceRepair,
} from '/@/api/platformEntry/locationFacilityList';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const ruleFormRef = ref<FormInstance>();
const dialogType = ref<string>(''); //弹窗状态
const placeCodeArr = ref([]) as any;
const btnText = ref('保存');
const statusArr = ref([
	{
		label: '正常',
		value: 1,
	},
	{
		label: '待报修',
		value: 2,
	},
	// {
	// 	label: '已报修',
	// 	value: 3,
	// },
]);
const statusData = ref([
	{
		label: '正常',
		value: 1,
	},
	{
		label: '待报修',
		value: 2,
	},
	{
		label: '已报修',
		value: 3,
	},
]);
const title = ref('');
const ruleForm = ref<any>({
	id: '',
	name: '',
	placeCode: '',
	status: '',
	storageTime: '',
	expireTime: '',
	faultTime: '',
	repairReason: '',
});
// 设备到期时间限制
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now();
};
const openDialog = async (type: string, row?: any) => {
	getRegionArr();
	Object.assign(ruleForm.value, {
		id: '',
		name: '',
		placeCode: '',
		status: '',
		storageTime: '',
		expireTime: '',
		faultTime: '',
		repairReason: '',
	});
	dialogType.value = type ? type : 'add';
	if (row?.id) {
		title.value = dialogType.value === 'edit' ? '编辑设备' : '报修设备';
		btnText.value = dialogType.value === 'edit' ? '保存' : '提交';
		Object.assign(ruleForm.value, row);
	} else {
		title.value = '新增设备';
		btnText.value = '新增';
	}
	visible.value = true;
};
const getRegionArr = async () => {
	try {
		let res = await geplatformPlaceList();
		if (res.code === 0) {
			placeCodeArr.value = res.data;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const rules = reactive<FormRules<any>>({
	name: [{ required: dialogType.value !== 'repairs', message: '请输入设备名称', trigger: 'blur' }],
	placeCode: [{ required: dialogType.value !== 'repairs', message: '请选择场所', trigger: 'blur' }],
	status: [{ required: dialogType.value !== 'repairs', message: '请选择状态', trigger: 'blur' }],
	storageTime: [{ required: dialogType.value !== 'repairs', message: '请选择入库时间', trigger: 'blur' }],
	expireTime: [{ required: dialogType.value !== 'repairs', message: '请选择设备到期时间', trigger: 'blur' }],
	faultTime: [{ required: dialogType.value === 'repairs', message: '请选择发生故障时间', trigger: 'blur' }],
	repairReason: [{ required: dialogType.value === 'repairs', message: '请输入报修原因', trigger: 'blur' }],
});
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', ruleForm.value);
			console.log('dialogType.value', dialogType.value);
			let res = null;
			let msg = '';
			try {
				if (dialogType.value === 'add') {
					res = await getPlatformDeviceAdd(ruleForm.value);
					msg = '新增成功';
				} else if (dialogType.value === 'edit') {
					res = await getPlatformDeviceUpdate(ruleForm.value);
					msg = '编辑成功';
				} else if (dialogType.value === 'repairs') {
					res = await getPlatformDeviceRepair({
						code: ruleForm.value.code,
						faultTime: ruleForm.value.faultTime,
						repairReason: ruleForm.value.repairReason,
					});
					msg = '报修成功';
				}
				if (res?.code === 0) {
					useMessage().success(msg);
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
