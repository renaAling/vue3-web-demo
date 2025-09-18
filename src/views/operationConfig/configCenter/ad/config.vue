<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="40%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item label="图片" prop="imageUrl">
					<upload-img v-model:image-url="model.imageUrl" />
				</el-form-item>
				<el-form-item label="可见对象" prop="identityCodes">
					<el-checkbox-group v-model="model.identityCodes">
						<el-checkbox :label="item.code" v-for="(item, index) in userRoleList" :key="index">{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="跳转类型" prop="jumpType">
					<el-select v-model="model.jumpType" style="width: 100%">
						<el-option v-for="(item, index) in jumpTypes" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="跳转目标" prop="jumpUrl" v-if="model.jumpType != '1'">
					<el-input v-model="model.jumpUrl" placeholder="请输入链接" maxlength="200" clearable />
				</el-form-item>
				<el-form-item label="弹框频次" prop="popupFrequency">
					<el-radio-group v-model="model.popupFrequency">
						<el-radio :label="1">每天首次弹出</el-radio>
						<el-radio :label="2">每次进入小程序弹出</el-radio>
						<el-radio :label="3">每次访问弹出</el-radio>
					</el-radio-group>
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
import { configAdd, configDetail, configUpdate } from '/@/api/operationConfig/firstPage';

const emit = defineEmits(['refresh']);
import { userVisiableRole } from '/@/stores/userVisiableRole';
import pinia from '/@/stores';

const dialogTitle = ref('新建广告配置');
const userRoleList = ref<any[]>([]);
const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const scopeId = ref<string | null>('');
const locationType = ref(8);
const loading = ref(false);
const jumpTypes = [
	{
		label: '不跳转',
		value: 1,
	},
	{
		label: '跳转H5',
		value: 2,
	},
	{
		label: '跳转微信小程序内部页面',
		value: 3,
	},
	{
		label: '跳转其他微信小程序',
		value: 4,
	},
	{ label: '文创商城', value: 5 },
	{ label: '好店系统', value: 6 },
];
const model = ref({
	imageUrl: '',
	visibleObjects: [],
	// employeeVisible: false,
	// visitorVisible: false,
	identityCodes: [],
	jumpType: '',
	jumpUrl: '',
	popupFrequency: null,
});
const formRules = reactive<FormRules>({
	identityCodes: [{ required: true, message: '请选择可见对象', trigger: 'change' }],
	imageUrl: [{ required: true, message: '图片不能为空' }],
	jumpType: [{ required: true, message: '请选择跳转类型', trigger: 'change' }],
	jumpUrl: [{ required: true, message: '请输入跳转目标', trigger: 'blur' }],
	popupFrequency: [{ required: true, message: '请选择弹出频次', trigger: 'change' }],
});
const openDialog = async (id: string | null) => {
	scopeId.value = id;
	// 获取用户可见角色列表
	const roleList = userVisiableRole().userRoleList;
	if (roleList.length > 0) {
		userRoleList.value = roleList;
	} else {
		await userVisiableRole(pinia).setUserRoleInfos();
		const roleList = userVisiableRole().userRoleList;
		if (roleList.length > 0) {
			userRoleList.value = roleList;
		}
	}

	if (id) {
		dialogTitle.value = '编辑广告配置';
		try {
			const { code, data } = await configDetail({ id });
			if (code === 0) {
				model.value = data;
				model.value.identityCodes = data.visibleIdentity.map((item: any) => item.identityCode);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = '新建广告配置';
	}
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
				await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}配置`, `${scopeId.value ? '修改' : '新建'}配置`);
			} catch {
				return false;
			}
			try {
				const request = scopeId.value ? configUpdate : configAdd;
				const params = {
					...model.value,
					locationType: locationType.value,
				};
				const { code, msg } = await request(params);
				loading.value = false;
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改' : '新建'}成功`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
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
	model.value = {
		imageUrl: '',
		visibleObjects: [],
		// employeeVisible: false,
		// visitorVisible: false,
		identityCodes: [],
		jumpType: '',
		jumpUrl: '',
		popupFrequency: null,
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
