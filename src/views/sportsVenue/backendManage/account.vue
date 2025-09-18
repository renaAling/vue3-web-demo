<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="guid">
						<el-input placeholder="请输入" v-model="state.queryForm.guid" clearable />
					</el-form-item>
					<el-form-item label="员工姓名">
						<el-input placeholder="请输入" v-model="state.queryForm.nickName" clearable />
					</el-form-item>
					<el-form-item label="员工号">
						<el-input placeholder="请输入" v-model="state.queryForm.userJobNum" clearable />
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="请输入" v-model="state.queryForm.mobile" clearable />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-4">
				<el-button @click="handleAdd" icon="Plus" type="primary">新增账号</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="guid" label="GUID" show-overflow-tooltip />
				<el-table-column prop="nickName" label="姓名" />
				<el-table-column prop="userJobNum" label="员工号" />
				<el-table-column prop="mobile" label="手机号" />
				<el-table-column prop="roleList" label="角色">
					<template #default="{ row }">
						<div class="m-2" v-for="item in row.roleList" :key="item.roleId">
							<el-tag>{{ item.roleName }}</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" show-overflow-tooltip />
				<el-table-column prop="createTime" label="创建时间" />
				<el-table-column prop="lockFlag" label="状态">
					<template #default="{ row }">
						<el-tag v-if="row.lockFlag === '0'">启用</el-tag>
						<el-tag v-else-if="row.lockFlag === '9'">禁用</el-tag>
						<el-link v-else>-</el-link>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" width="200">
					<template #default="{ row }">
						<div class="flex">
							<!-- 重置密码 -->
							<popover-input v-model="inputPassword" @confirm="changePassword(row)">
								<template #default>
									<el-button v-auth="'sys_user_edit'" class="!text-[16px] mb-[2px]" link type="primary">重置密码</el-button>
								</template>
							</popover-input>
							<el-button class="ml-[12px]" link type="primary" @click="handleEdit(row)">编辑</el-button>
							<el-button link type="primary" @click="handleDel(row)">删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" :title="accountForm.userId ? '编辑账号' : '新增账号'" width="600">
			<el-form :model="accountForm" :rules="accountFormRules" ref="formRef" label-width="80">
				<el-form-item label="guid" prop="guid">
					<!-- 编码类型-1:手机号；2：工号；3、账户中心对用户的唯一编码(guid)；4、员工卡物理卡号 -->
					<el-input
						v-model="accountForm.guid"
						placeholder="请输入guid"
						@change="queryUserTest($event, '3')"
						:disabled="accountForm.userId ? true : false"
					/>
				</el-form-item>
				<el-form-item label="姓名" prop="nickName">
					<el-input v-model="accountForm.nickName" placeholder="输入guid/手机号/员工号后自动获取" disabled />
				</el-form-item>
				<el-form-item label="员工号" prop="userJobNum">
					<el-input
						v-model="accountForm.userJobNum"
						placeholder="请输入员工号后"
						@change="queryUserTest($event, '2')"
						:disabled="accountForm.userId ? true : false"
					/>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input
						v-model="accountForm.mobile"
						placeholder="请输入手机号"
						autocomplete="new-password"
						@change="queryUserTest($event, '1')"
						:disabled="accountForm.userId ? true : false"
					/>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input
						type="password"
						v-model="accountForm.password"
						placeholder="必须至少8位，包含大小写字母、数字和特殊字符"
						autocomplete="new-password"
					/>
				</el-form-item>
				<el-form-item label="角色" prop="role">
					<el-select v-model="accountForm.role" multiple placeholder="请选择">
						<el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input
						type="textarea"
						v-model="accountForm.remark"
						placeholder="请输入账号备注，如该用户所属的公司/部门等"
						:rows="3"
						maxlength="200"
						show-word-limit
					/>
				</el-form-item>
				<el-form-item label="状态" prop="lockFlag">
					<!-- 0未锁定，9已锁定 -->
					<el-radio-group v-model="accountForm.lockFlag">
						<el-radio value="0" border>启用</el-radio>
						<el-radio value="9" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<div>
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" :loading="loading" @click="handleSubmit">确认</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="userManage">
import { ElMessage, ElMessageBox } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { employeePageApi, employeeUpdateApi, employeeAddApi, queryUserTestApi, deleteEmployeeApi } from '/@/api/sportsVenue/index';
import { list } from '/@/api/admin/role';
import { putObj, getBgGetBasicsByMobile } from '/@/api/admin/user';
import { PASSWORD_REGEX, validatePassword } from '/@/utils/toolsValidate';
import { useMessage } from '/@/hooks/message';

const PopoverInput = defineAsyncComponent(() => import('/@/components/PopoverInput/index.vue'));

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: employeePageApi,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const inputPassword = ref();
const changePassword = async (row: any) => {
	if (!PASSWORD_REGEX.test(inputPassword.value)) {
		useMessage().error('密码必须至少8位，包含大小写字母、数字和特殊字符');
		return;
	}

	row.mobile = undefined;
	row.password = inputPassword.value;
	const res = await putObj(row);
	if (res?.ok) {
		res?.ok && useMessage().success('操作成功');
		getDataList();
	} else {
		useMessage().error(res?.msg || '操作失败');
	}
};

const dialogVisible = ref(false);
const accountForm = ref({
	userId: null,
	guid: '',
	nickName: '',
	userJobNum: '',
	mobile: '',
	password: '',
	role: [],
	remark: '',
	lockFlag: '0',
	username: '',
	nickname: '',
});
const accountFormRules = ref({
	guid: [{ required: true, message: '请输入guid', trigger: 'blur' }],
	nickName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	userJobNum: [{ required: true, message: '请输入员工号', trigger: 'blur' }],
	mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
	password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
	role: [{ required: true, message: '请选择角色', trigger: 'change' }],
	lockFlag: [{ required: true, message: '请选择', trigger: 'change' }],
});

const roleList = ref();
const getRoleList = async () => {
	const res = await list();
	roleList.value = res?.data;
};

const queryUserTest = async (val: string, type: string) => {
	try {
		const res = await queryUserTestApi({ serialValue: val, serialType: type });
		if (res?.ok) {
			accountForm.value.guid = res?.data.guid;
			accountForm.value.nickName = res?.data.name;
			accountForm.value.userJobNum = res?.data.userJobNum;
			accountForm.value.mobile = res?.data.mobile;

			const res1 = await getBgGetBasicsByMobile(res?.data.mobile);
			if (res1?.ok && res1?.data) {
				accountForm.value.username = res1?.data.username;
			} else {
				accountForm.value.username = res?.data.mobile;
			}
		} else {
			ElMessage.error(res?.msg || '操作失败');
		}
	} catch (err: any) {
		accountForm.value.guid = '';
		accountForm.value.nickName = '';
		accountForm.value.userJobNum = '';
		accountForm.value.mobile = '';
		accountForm.value.username = '';
		const errorMsg = err?.msg || '操作失败';
		ElMessage.error(errorMsg);
	}
};

const formRef = ref();
const loading = ref(false);
const handleSubmit = () => {
	formRef?.value?.validate(async (valid: boolean) => {
		if (!valid) return;
		try {
			loading.value = true;
			const res = accountForm.value.userId ? await employeeUpdateApi(accountForm.value) : await employeeAddApi(accountForm.value);
			if (res?.ok) {
				loading.value = false;
				useMessage().success('操作成功');
				dialogVisible.value = false;
				getDataList();
			} else {
				loading.value = false;
				useMessage().error(res?.msg || '操作失败');
			}
		} catch (err: any) {
			const errorMsg = err?.msg || '操作失败';
			useMessage().error(errorMsg);
		} finally {
			loading.value = false;
		}
	});
};

const handleAdd = async () => {
	formRef?.value?.resetFields();
	accountForm.value = {
		userId: null,
		guid: '',
		nickName: '',
		userJobNum: '',
		mobile: '',
		password: '',
		role: [],
		remark: '',
		lockFlag: '0',
		username: '',
		nickname: '',
	};
	dialogVisible.value = true;
};

const handleEdit = async (row: any) => {
	formRef?.value?.resetFields();
	accountForm.value = { ...row, password: '', role: row?.roleList.map((item: any) => item.roleId) };
	dialogVisible.value = true;
};

const handleDel = async (row: any) => {
	ElMessageBox.confirm('删除后该账号不可登录本后台，确认删除吗？', '删除账号', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const res = await deleteEmployeeApi(row.userId);
		if (res?.ok) {
			getDataList();
		} else {
			ElMessage.error(res?.msg || '操作失败');
		}
	});
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};

onMounted(() => {
	getRoleList();
});
</script>

<style scoped lang="scss"></style>
