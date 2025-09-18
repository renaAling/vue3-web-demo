<template>
	<el-dialog :close-on-click-modal="false" :title="form.roleId ? $t('common.editBtn') : $t('common.addBtn')" width="600" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-form-item label="角色名称" prop="roleName">
				<el-input placeholder="请输入角色名称" clearable v-model="form.roleName"></el-input>
			</el-form-item>
			<el-form-item label="角色标识" prop="roleCode">
				<el-input placeholder="请输入角色标识" :disabled="form.roleId !== ''" clearable v-model="form.roleCode"></el-input>
			</el-form-item>
			<el-form-item label="角色描述" prop="roleDesc">
				<el-input maxlength="100" :rows="3" placeholder="请输入角色描述" type="textarea" v-model="form.roleDesc"></el-input>
			</el-form-item>
			<el-form-item label="数据权限" prop="dsType">
				<el-select placeholder="请输入数据权限" clearable v-model="form.dsType">
					<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in dictType" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="userRoleDialog" setup>
import { rule } from '/@/utils/validate';
import { deptTree } from '/@/api/admin/dept';
import { useMessage } from '/@/hooks/message';
import { addObjTenantId, getObjTenantId, putObjTenantId, validateRoleCodeTenantId, validateRoleNameTenantId } from '/@/api/admin/role';
import { useI18n } from 'vue-i18n';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const deptTreeRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	roleId: '',
	roleName: '',
	roleCode: '',
	roleDesc: '',
	dsType: 0,
	dsScope: '',
});

// 页面对应元数据
const dataForm = reactive({
	deptData: [],
	checkedDsScope: [],
	deptProps: {
		children: 'children',
		label: 'name',
		value: 'id',
	},
});

// 定义校验规则
const dataRules = ref({
	roleName: [
		{ required: true, message: '角色名称不能为空', trigger: 'blur' },
		{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateRoleNameTenantId(rule, value, callback, form.roleId !== '', tenantId.value);
			},
			trigger: 'blur',
		},
	],
	roleCode: [
		{ required: true, message: '角色标识不能为空', trigger: 'blur' },
		{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
		{ validator: rule.validatorCapital, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateRoleCodeTenantId(rule, value, callback, form.roleId !== '', tenantId.value);
			},
			trigger: 'blur',
		},
	],
	roleDesc: [{ max: 128, message: '长度在 128 个字符内', trigger: 'blur' }],
	dsType: [{ required: true, message: '请选择数据权限类型', trigger: 'blur' }],
	menu_authority: [{ required: true, message: '数据权限不能为空', trigger: 'blur' }],
});

const dictType = ref([
	{
		label: '全部',
		value: 0,
	},
	{
		label: '自定义',
		value: 1,
	},
	{
		label: '本级及子级',
		value: 2,
	},
	{
		label: '本级',
		value: 3,
	},
	{
		label: '本人',
		value: 4,
	},
]);
const tenantId = ref('');
// 打开弹窗
const openDialog = (id: any, row?: any) => {
	visible.value = true;
	form.roleId = '';
	tenantId.value = id;
	nextTick(() => {
		dataFormRef.value.resetFields();
	});

	// 获取角色信息
	if (row) {
		form.roleId = row.roleId;
		Object.assign(form, row);
		getRoleData(row.roleId);
	} else {
		dataFormRef.value.resetFields();
	}

	getDeptData();
};

// 提交
const onSubmit = async () => {
	if (form.dsType === 1) {
		form.dsScope = deptTreeRef.value.getCheckedKeys().join(',');
	} else {
		form.dsScope = '';
	}

	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		form.roleId ? await putObjTenantId(form, tenantId.value) : await addObjTenantId(form, tenantId.value);
		useMessage().success(t(form.roleId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化角色数据
const getRoleData = (id: string) => {
	// 获取部门数据
	getObjTenantId(id, tenantId.value).then((res: any) => {
		Object.assign(form, res.data);
		console.log('res', res);
		if (res.data?.dsScope) {
			dataForm.checkedDsScope = res.data.dsScope.split(',');
		} else {
			dataForm.checkedDsScope = [];
		}
	});
};
// 获取菜单结构数据
const getDeptData = () => {
	deptTree().then((res: any) => {
		dataForm.deptData = res.data;
	});
	console.log('dataForm.deptData', dataForm.deptData);
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
