<template>
	<div class="familyContent">
		<div class="mb-5">
			<el-button icon="Plus" type="primary" @click="handleAdd"> 新增 </el-button>
		</div>
		<el-table
			:data="familyInfoList"
			v-loading="state.loading"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			height="200"
		>
			<el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
			<el-table-column prop="relation" label="关系" show-overflow-tooltip></el-table-column>
			<el-table-column prop="createTime" label="联系电话" show-overflow-tooltip>
				<template #default="{ row }">
					{{ maskedMobile(row.phone) }}
				</template>
			</el-table-column>
			<el-table-column label="操作" show-overflow-tooltip>
				<template #default="{ row }">
					<el-button text type="primary" @click="handleAdd(row)">编辑</el-button>
					<el-button text type="primary" @click="handleDel(row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog v-model="dialogFormVisible" :title="isEditFamily ? '编辑' : '新增'" width="400" @close="closeFamilyMemberVisible(ruleFamilyFormRef)">
			<el-form ref="ruleFamilyFormRef" :model="form" :rules="familyRules" label-width="80px">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="form.name" maxlength="12" />
				</el-form-item>
				<el-form-item label="关系" prop="relation">
					<el-select v-model="form.relation" placeholder="请选择家庭成员关系">
						<el-option label="配偶" value="配偶" />
						<el-option label="父子" value="父子" />
						<el-option label="母子" value="母子" />
						<el-option label="其他" value="其他" />
					</el-select>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="form.phone" maxlength="11" />
				</el-form-item>
			</el-form>
			<div class="flex justify-center pt-10">
				<el-button type="primary" @click="onSubmitFamilyMember(ruleFamilyFormRef)">保存</el-button>
				<el-button @click="closeFamilyMemberVisible(ruleFamilyFormRef)">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="rechargeForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberDetail, postMemberFamilyAdd, putMemberFamilyUpdate, deleteMemberFamilyDel } from '/@/api/member/memberManagement/accountManager';
import { useMessage } from '/@/hooks/message';
import type { FormRules, FormInstance } from 'element-plus';
import { ElMessageBox } from 'element-plus';

const props = defineProps<{
	unionId: string;
}>();
const familyInfoList = ref([]) as any;
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
});
const { tableStyle } = useTable(state);
const form = ref<any>({
	unionId: '',
	name: '',
	phone: '',
	relation: '',
	id: '',
});
const dialogFormVisible = ref(false);
const ruleFamilyFormRef = ref<FormInstance>();
const isEditFamily = ref(false);

onMounted(() => {
	console.log('props', props);
	if (props?.unionId) {
		getFamilyInfoList(props.unionId);
	}
});
const maskedMobile = (mobile: any) => {
	console.log('mobile', mobile);
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
const familyRules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入家庭成员姓名', trigger: 'blur' }],
	relation: [
		{
			required: true,
			message: '请输入家庭成员关系',
			trigger: 'blur',
		},
	],
	phone: [
		{
			required: true,
			validator: function (rules, val, callback) {
				console.log('val', val);
				if (!val) return callback('联系电话必填');
				if (val.length !== 11) return callback('请输入正确的11位手机号!');
				callback();
			},
			trigger: 'blur',
		},
	],
});
const getFamilyInfoList = async (unionId: string) => {
	state.loading = true;
	try {
		const { code, data, msg } = await getMemberDetail(unionId);
		if (code === 0) {
			console.log('familyInfo', data);
			familyInfoList.value = data.familyInfo;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		state.loading = false;
	}
};
// 新增编辑
const handleAdd = async (row?: any) => {
	isEditFamily.value = false;
	form.value.unionId = '';
	console.log('row', row);
	if (row.id) {
		isEditFamily.value = true;
		Object.assign(form.value, row);
		dialogFormVisible.value = true;
	} else {
		isEditFamily.value = false;
		dialogFormVisible.value = true;
	}
};
// 提交编辑家庭成员档案
const onSubmitFamilyMember = async (formEl: FormInstance | undefined) => {
	console.log('家庭成员档案', form.value);
	form.value.unionId = props.unionId;
	form.value.id = isEditFamily.value ? form.value.id : '';
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			try {
				if (!isEditFamily.value) await postMemberFamilyAdd(form.value);
				else await putMemberFamilyUpdate(form.value);
				useMessage().success(`${!form.value.id ? '新增' : '编辑'}成功`);
			} catch (err: any) {
				useMessage().error(err.msg);
			} finally {
				Object.assign(form, {
					id: '',
					unionId: '',
					name: '',
					phone: '',
					relation: '',
				});
			}
			dialogFormVisible.value = false;
			getFamilyInfoList(props.unionId as string);
		} else {
			console.log('error submit!', fields);
		}
	});
};

// 关闭家庭成员档案弹窗
const closeFamilyMemberVisible = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	Object.assign(form.value, {
		unionId: '',
		name: '',
		phone: '',
		relation: '',
	});
	dialogFormVisible.value = false;
};
const handleDel = async (row: any) => {
	console.log('row', row);
	try {
		await ElMessageBox.confirm(`此操作将永久删除？`, '系统提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	try {
		const { code, msg } = await deleteMemberFamilyDel(Number(row.id));
		if (code === 0) {
			useMessage().success('删除成功');
			getFamilyInfoList(props.unionId as string);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		state.loading = false;
	}
};

defineExpose({
	getFamilyInfoList,
});
</script>

<style>
.familyContent {
	background: var(--el-color-white);
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	padding: 10px;
	overflow: hidden;
	height: 100%;
}
</style>
