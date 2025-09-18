<template>
	<el-dialog :close-on-click-modal="false" :title="!form.id ? '新增' : '修改'" width="800" draggable v-model="visible">
		<el-form :model="form" label-width="80px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
			<el-form-item label="姓名" prop="name">
				<el-input placeholder="请输入姓名" v-model="form.name" maxlength="5"></el-input>
			</el-form-item>
			<el-form-item label="联系电话" prop="mobile">
				<el-input placeholder="请输入联系电话" clearable v-model="form.mobile" maxlength="11"></el-input>
			</el-form-item>
			<el-form-item label="所属机构" prop="organizationId">
				<el-cascader
					placeholder="请选择机构"
					ref="cascader"
					v-model="form.organizationId"
					:props="props"
					clearable
					:options="organizationList"
					style="width: 100%"
				/>
			</el-form-item>
			<el-form-item label="所属部门" prop="department">
				<el-input placeholder="请输入所属部门" clearable v-model="form.department" maxlength="30"></el-input>
			</el-form-item>
			<el-form-item label="员工类型" prop="employeeType">
				<el-select v-model="form.employeeType" clearable placeholder="请选择员工类型">
					<el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="status" placeholder="请选择状态">
				<el-select v-model="form.status" clearable>
					<el-option label="启用" :value="1">启用</el-option>
					<el-option label="禁用" :value="2">禁用</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="resetForm">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { getUserOutOrganizationTree, getUserEmployeeAdd, getUserEmployeeUpdate } from '/@/api/member/staffCenter/staffCenter';
import { useMessage, useMessageBox } from '/@/hooks/message';
const typeList = ref([
	{
		label: '内部员工',
		value: 1,
	},
	{
		label: '委外员工',
		value: 2,
	},
	{
		label: '见习员工',
		value: 3,
	},
	{
		label: '充值无管理费人员',
		value: 4,
	},
	{
		label: '委外单位',
		value: 5,
	},
	{
		label: '食堂员工',
		value: 6,
	},
	{
		label: '其他',
		value: 7,
	},
	{
		label: '外部员工',
		value: 8,
	},
]);
// 定义变量内容
const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// const categoryProps = ref({
// 	value: 'id',
// 	label: 'name',
// 	children: 'childList',
// 	expandTrigger: 'hover',
// 	emitPath: false,
// 	multiple: false,
// });
const props = ref({
	// multiple: true,
	checkStrictly: true,
});
// 提交表单数据
const form = reactive<any>({
	id: '',
	name: '',
	mobile: '',
	organizationId: '',
	department: '',
	employeeType: '',
	wechatOpenid: '',
	status: '',
});
const validatePhone = (rule: any, value: any, callback: any) => {
	const reg = /^1[3-9]\d{9}$/;
	if (!reg.test(value)) {
		return callback(new Error('请填写正确的联系电话!'));
	} else {
		return callback();
	}
};
const validateOrganizationId = (rule: any, value: any, callback: any) => {
	if (value?.length < 1) {
		return callback(new Error('所属机构不能为空!'));
	} else {
		return callback();
	}
};

// 定义校验规则
const dataRules = ref({
	name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
	mobile: [
		{ required: true, message: '联系电话不能为空', trigger: 'blur' },
		{ required: true, validator: validatePhone, trigger: 'change' },
	],
	organizationId: [{ required: true, validator: validateOrganizationId, trigger: 'blur' }],
	employeeType: [{ required: true, message: '员工类型不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
});
const organizationList = ref<any[]>([]);
// 打开弹窗
const openDialog = (row: any) => {
	console.log('row', row);
	visible.value = true;
	form.id = '';
	// 加载使用的数据
	getUserOutOrganization();
	nextTick(() => {
		dataFormRef.value.resetFields();
		form.context = '';
		form.remark = '';
		if (row) {
			form.id = row.id;
			Object.assign(form, row);
			// getData(row.id);
		}
	});
};
// 转数据
const renameNameToLabel = (node: any) => {
	// 创建一个新对象，将 orgName 替换为 label
	const { orgName, id, children, ...rest } = node;
	const renamedNode = { label: orgName, value: id, ...rest };
	// 如果有子节点，递归处理每个子节点
	if (children && Array.isArray(children)) {
		renamedNode.children = children.map((child) => renameNameToLabel(child));
	}

	return renamedNode;
};
const getUserOutOrganization = async () => {
	try {
		const { code, data, msg } = await getUserOutOrganizationTree();
		if (code === 0) {
			console.log('data', data);
			organizationList.value = data.map((item: any) => renameNameToLabel(item));
			console.log('organizationList.value', organizationList.value);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const closeMyDialog = () => {
	visible.value = false;
};

// 重置
const resetForm = () => {
	dataFormRef.value.resetFields();
	// Object.keys(form).forEach((key) => (form[key] = ''));
	form.context = '';
	form.remark = '';
	closeMyDialog();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		if (form.organizationId.length > 0) {
			form.organizationId = form.organizationId[form.organizationId.length - 1];
		}
		const { code, data, msg } = form.id ? await getUserEmployeeUpdate(form) : await getUserEmployeeAdd(form);
		if (code === 0) {
			useMessage().success('操作成功');
			resetForm();
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
