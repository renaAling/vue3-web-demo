<template>
	<div class="system-user-dialog-container">
		<el-dialog
			width="900px"
			:close-on-click-modal="false"
			:title="dataForm.userId ? $t('common.editBtn') : $t('common.addBtn')"
			draggable
			v-model="visible"
		>
			<el-form :model="dataForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
				<el-row :gutter="20">
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.phone')" prop="phone">
							<el-input clearable placeholder="请输入手机号" v-model="dataForm.phone" maxlength="11"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.username')" prop="username">
							<el-input
								:disabled="dataForm.userId !== '' || userPresence"
								placeholder="请输入用户名"
								v-model="dataForm.username"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.password')" prop="password">
							<el-input
								clearable
								placeholder="请输入密码"
								v-model="dataForm.password"
								type="password"
								show-password
								autocomplete="new-password"
								:disabled="userPresence && userPresencePassword !== ''"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.name')" prop="name">
							<el-input clearable placeholder="请输入姓名" v-model="dataForm.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.role')" prop="role">
							<el-select clearable multiple placeholder="请选择角色" v-model="dataForm.role">
								<el-option :key="item.roleId" :label="item.roleName" :value="item.roleId" v-for="item in roleData" />
							</el-select>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12" class="mb20" v-if="currentTenantId != '1855880243516456961'">
						<el-form-item :label="$t('sysuser.post')" prop="post">
							<el-select clearable multiple placeholder="请选择岗位" v-model="dataForm.post">
								<el-option :key="item.postId" :label="item.postName" :value="item.postId" v-for="item in postData" />
							</el-select>
						</el-form-item>
					</el-col> -->
					<el-col :span="12" class="mb20" v-if="currentTenantId != '1855880243516456961'">
						<el-form-item :label="$t('sysuser.post')" prop="postName">
							<el-input clearable placeholder="请输入岗位" v-model="dataForm.postName"></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.dept')" prop="deptId">
							<el-tree-select
								:data="deptData"
								:props="{ value: 'id', label: 'name', children: 'children' }"
								check-strictly
								class="w100"
								clearable
								placeholder="请选择所属部门"
								v-model="dataForm.deptId"
							>
							</el-tree-select>
						</el-form-item>
					</el-col> -->
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.dept')" prop="deptName">
							<el-input clearable placeholder="请输入所属部门" v-model="dataForm.deptName"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.email')" prop="email">
							<el-input clearable placeholder="请输入邮箱" v-model="dataForm.email"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.nickname')" prop="nickname">
							<el-input clearable placeholder="请输入昵称" v-model="dataForm.nickname"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20" v-if="lock_flag.length > 0">
						<el-form-item :label="$t('sysuser.lockFlag')" prop="lockFlag">
							<el-radio-group v-model="dataForm.lockFlag">
								<el-radio :key="index" :label="item.value" border v-for="(item, index) in lock_flag">{{ item.label }} </el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="systemUserDialog" setup>
import { addObj, getObj, putObj, validatePhone, getDetails, validateUsername, getBgGetBasicsByMobile } from '/@/api/admin/user';
import { list as roleList } from '/@/api/admin/role';
import { list as postList } from '/@/api/admin/post';
import { deptTree } from '/@/api/admin/dept';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';
import { PASSWORD_REGEX } from '/@/utils/toolsValidate';

const { t } = useI18n();
const currentTenantId = import.meta.env.VITE_TENANT_ID;
// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// @ts-ignore
const { lock_flag } = useDict('lock_flag');

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const deptData = ref<any[]>([]);
const roleData = ref<any[]>([]);
const postData = ref<any[]>([]);
const loading = ref(false);
const userPresence = ref(false); //用户已存在为true-不可修改用户名(回填)、密码置灰(不回填不传值)、昵称(回填可修改)
const userPresencePassword = ref(''); //用户在其他平台的密码
const dataForm = reactive({
	userId: '',
	username: '',
	password: '' as String | undefined,
	salt: '',
	wxOpenid: '',
	qqOpenid: '',
	lockFlag: '0',
	phone: '' as String | undefined,
	deptId: '',
	roleList: [],
	postList: [],
	nickname: '',
	name: '',
	email: '',
	post: [] as string[],
	role: [] as string[],
	postName:'',
	deptName:'',
});
const validatePassword = (rule: any, value: any, callback: any) => {
	if (userPresence.value && userPresencePassword.value !== '') {
		if (value) {
			callback();
		} else {
			return callback(new Error('请输入密码'));
		}
	} else {
		if (!PASSWORD_REGEX.test(value)) {
			return callback(new Error('密码必须至少8位，包含大小写字母、数字和特殊字符'));
		} else {
			callback();
		}
	}
};
const dataRules = ref({
	// 用户名校验，不能为空 、长度 5-20、不能和已有数据重复
	username: [
		{ required: true, message: '用户名不能为空', trigger: 'blur' },
		{ min: 5, max: 20, message: '用户名称长度必须介于 5 和 20 之间', trigger: ['blur', 'change'] },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateUsername(rule, value, callback, dataForm.userId !== '');
			},
			trigger: 'blur',
		},
	],
	password: [{ trigger: 'blur', validator: validatePassword, required: true }],
	// 姓名校验，不能为空、只能是中文
	name: [
		{ required: true, message: '姓名不能为空', trigger: 'blur' },
		{ validator: rule.chinese, trigger: 'blur' },
	],
	// deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
	role: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
	// post: [{ required: true, message: '岗位不能为空', trigger: 'blur' }],
	// 手机号校验，不能为空、新增的时不能重复校验
	phone: [
		{ required: true, message: '手机号不能为空', trigger: 'blur' },
		{
			min: 11,
			max: 11,
			message: '请输入正确手机号',
			trigger: 'blur',
		},
		{
			validator: (rule: any, value: any, callback: any) => {
				// validatePhone(rule, value, callback, dataForm.userId !== '');
				getUserInfo(value, callback, dataForm.userId !== '');
			},
			trigger: 'blur',
		},
	],
	email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
	lockFlag: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (id: string) => {
	console.log('lock_flag', lock_flag);
	visible.value = true;
	dataForm.userId = '';
	userPresence.value = false;

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 修改获取用户信息
	if (id) {
		dataForm.userId = id;
		await getUserData(id);
		// dataForm.password = '******';
		dataForm.password = '';
	}

	// 加载使用的数据
	getDeptData();
	getPostData();
	getRoleData();
};
const getUserInfo = async (phone: string, callback: any, isEdit: boolean) => {
	userPresencePassword.value = '';
	if (phone) {
		if (isEdit) {
			return callback();
		}
		let result: any = null;
		try {
			// 查询是否本平台已存在
			const res = await getDetails({ phone: phone });
			console.log('SSSSS', res);
			result = res.data;
			if (result !== null) {
				return callback(new Error('手机号已经存在'));
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
		console.log('result', result);
		if (result === null) {
			try {
				// 查询其他平台是否存在
				const res = await getBgGetBasicsByMobile(phone);
				console.log('SSSSS', res);

				if (res.data) {
					userPresence.value = true;
					dataForm.username = res.data.username;
					dataForm.nickname = res.data.nickName;

					if (res.data.password) {
						dataForm.password = '******';
						userPresencePassword.value = res.data.password;
					} else {
						userPresencePassword.value = '';
					}
					console.log('dataForm', dataForm);
					return callback();
				} else {
					if (userPresence.value) {
						dataForm.username = '';
						dataForm.nickname = '';
						dataForm.password = '';
					}
					userPresence.value = false;
					return callback();
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		}
	} else {
		dataForm.username = '';
		dataForm.nickname = '';
		dataForm.password = '';
		userPresence.value = false;
		return callback('手机号不能为空');
	}
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	console.log('dataForm', dataForm);
	try {
		const { userId, phone, password } = dataForm;
		if (password?.includes('******')) dataForm.password = undefined;
		if (userId) {
			// 清除占位符，避免提交错误的数据
			if (phone?.includes('*')) dataForm.phone = undefined;
			loading.value = true;
			await putObj(dataForm);
			useMessage().success(t('common.editSuccessText'));
			visible.value = false; // 关闭弹窗
			emit('refresh');
		} else {
			if (userPresence.value && userPresencePassword.value !== '') {
				dataForm.password = userPresencePassword.value;
			}
			loading.value = true;
			try {
				await addObj(dataForm);
				useMessage().success(t('common.addSuccessText'));
				visible.value = false; // 关闭弹窗
				emit('refresh');
				userPresence.value = false; // 重置用户其他平台已存在状态
				userPresencePassword.value = '';
			} catch (error: any) {
				if (userPresence.value && userPresencePassword.value !== '') {
					dataForm.password = '******';
				}
				useMessage().error(error.msg);
			}
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	} finally {
		loading.value = false;
	}
};

/**
 * 从服务器获取用户数据
 *
 * @async
 * @param {string} id - 用户 ID
 * @return {Promise} - 包含用户数据的 Promise 对象
 */
const getUserData = async (id: string) => {
	try {
		loading.value = true;
		const { data } = await getObj(id);
		Object.assign(dataForm, data);
		if (data.roleList) {
			dataForm.role = data.roleList.map((item: any) => item.roleId);
		}
		// if (data.postList) {
		// 	dataForm.post = data.postList.map((item: any) => item.postId);
		// }
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化部门数据
const getDeptData = () => {
	// 获取部门数据
	deptTree().then((res) => {
		deptData.value = res.data;
		// 默认选择第一个
		// if (!dataForm.userId) {
		// 	dataForm.deptId = res.data[0].id;
		// }
	});
};

// 岗位数据
const getPostData = () => {
	postList().then((res) => {
		postData.value = res.data;
		// 默认选择第一个
		// if (!dataForm.userId) {
		// 	dataForm.post = [res.data[0].postId];
		// }
	});
};
// 角色数据
const getRoleData = () => {
	roleList().then((res) => {
		roleData.value = res.data;
		// 默认选择第一个
		// if (!dataForm.userId) {
		// 	dataForm.role = [res.data[0].roleId];
		// }
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
