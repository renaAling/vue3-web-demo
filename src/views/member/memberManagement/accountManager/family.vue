<template>
	<div>
		<div class="px-4 py-2"><el-button type="primary" @click="familyMemberVisible()">新增家庭成员</el-button></div>
		<el-table
			class="px-4"
			:data="familyMemberDataList"
			style="width: 60%"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			height="200"
		>
			<el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
			<el-table-column prop="relation" label="关系" show-overflow-tooltip></el-table-column>
			<el-table-column label="联系电话" show-overflow-tooltip>
				<template #default="scope">
					{{ maskedMobile(scope.row.phone) }}
				</template>
			</el-table-column>
			<el-table-column label="操作" show-overflow-tooltip>
				<template #default="scope">
					<span class="ml-2 cursor-pointer text-[#4785ea]" @click="familyMemberVisible(scope.row)">编辑</span>
					<span class="ml-2 cursor-pointer text-[#4785ea]" @click="delFamilyMemberVisible(scope.row)">删除</span>
				</template>
			</el-table-column>
		</el-table>
		<!-- 添加家庭成员 -->
		<el-dialog v-model="dialogFamilyMemberVisible" :title="visibleTitle" width="400" @close="closeFamilyMemberVisible(ruleFamilyFormRef)">
			<el-form ref="ruleFamilyFormRef" :model="familyMemberForm" :rules="familyRules" label-width="80px">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="familyMemberForm.name" maxlength="12" />
				</el-form-item>
				<el-form-item label="关系" prop="relation">
					<!-- <el-input v-model="familyMemberForm.relation" maxlength="12" /> -->
					<el-select v-model="familyMemberForm.relation" placeholder="请选择家庭成员关系">
						<el-option label="配偶" value="配偶" />
						<el-option label="父子" value="父子" />
						<el-option label="母子" value="母子" />
						<el-option label="其他" value="其他" />
					</el-select>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="familyMemberForm.phone" maxlength="11" />
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
import { postMemberFamilyAdd, postMemberFamilyUpdate, deleteMemberFamilyDel } from '/@/api/member/member';
import type { FormRules, FormInstance } from 'element-plus';

import { useMessage, useMessageBox } from '/@/hooks/message';
interface familyMember {
	id: string;
	unionId: string;
	name: string;
	relation: string;
	phone: string;
}
const ruleFamilyFormRef = ref<FormInstance>();

const dialogFamilyMemberVisible = ref(false);
const visibleTitle = ref('新增家庭成员');
const familyMemberDataList = ref([]);
const familyMemberForm = reactive<familyMember>({
	id: '',
	unionId: '',
	name: '',
	relation: '',
	phone: '',
});
const isEditFamily = ref(false); //是否编辑家庭成员数据
const isChangeFamilyPhone = ref('');
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
});
const maskedMobile = (mobile: any) => {
	console.log('mobile', mobile);
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
const { tableStyle } = useTable(state);

const getList = async (unionId: string) => {
	// state.loading = true;
	// return new Promise((resolve, reject) => {
	// 	getUserCenter(unionId)
	// 		.then((val) => {
	// 			userCenterList.value = val.data.thirdAuthInfos;
	// 			resolve(true);
	// 		})
	// 		.catch((err) => {
	// 			useMessage().error(err.msg);
	// 			reject(false);
	// 		}).finally(() => {
	// 		    state.loading = true;
	// 		})
	// });
};
const familyRules = reactive<FormRules<familyMember>>({
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
			// message: '请输入正确的手机号',
			validator: function (rules, val, callback) {
				console.log('val', val);
				// let success = false;
				// if (isEditFamily.value && val.includes('***') && !isChangeFamilyPhone.value) success = true;
				if (!val) return callback('联系电话必填');
				// if (regExp_phoneNumber.test(val)) success = true;
				if (val.length !== 11) return callback('请输入正确的11位手机号!');
				callback();
			},
			trigger: 'blur',
		},
	],
});
// 新增家庭成员档案
const familyMemberVisible = (data?: any) => {
	if (!data && familyMemberDataList.value?.length === 5) {
		useMessage().error('最多输入5位家庭成员');
		return;
	}
	console.log('data', data);
	if (!data) visibleTitle.value = '新增家庭成员';
	else {
		visibleTitle.value = '编辑家庭成员';
		isEditFamily.value = true;
		Object.assign(familyMemberForm, data);
	}
	dialogFamilyMemberVisible.value = true;
};
// 删除家庭成员档案
const delFamilyMemberVisible = async (data: any) => {
	console.log('删除数据', data);
	useMessageBox()
		.confirm('是否删除该家庭成员档案', '删除')
		.then(async () => {
			try {
				const { code } = await deleteMemberFamilyDel(Number(data.id));
				if (code === 0) {
					getList();
					useMessage().success('删除成功');
				} else {
					useMessage().error('删除失败');
				}
			} catch (err: any) {
				useMessage().error(err.msg || '删除失败');
			}
		})
		.catch(() => {});
};
// 关闭家庭成员档案弹窗
const closeFamilyMemberVisible = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	Object.assign(familyMemberForm, {
		unionId: '',
		name: '',
		phone: '',
		relation: '',
	});
	isChangeFamilyPhone.value = '';
	isEditFamily.value = false;
	dialogFamilyMemberVisible.value = false;
};
// 提交编辑家庭成员档案
const onSubmitFamilyMember = async (formEl: FormInstance | undefined) => {
	console.log('家庭成员档案', familyMemberForm);
	familyMemberForm.unionId = dataForm.unionId;
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			try {
				if (!familyMemberForm.id) await postMemberFamilyAdd(familyMemberForm);
				else await postMemberFamilyUpdate(familyMemberForm);
				useMessage().success(`${!familyMemberForm.id ? '新增' : '编辑'}成功`);
			} catch (err: any) {
				useMessage().error(err.msg);
			} finally {
				Object.assign(familyMemberForm, {
					id: '',
					unionId: '',
					name: '',
					phone: '',
					relation: '',
				});
			}
			isChangeFamilyPhone.value = '';
			isEditFamily.value = false;
			dialogFamilyMemberVisible.value = false;
			getDetail(route.query.id as string);
		} else {
			console.log('error submit!', fields);
		}
	});
};
defineExpose({
	getList,
});
</script>
