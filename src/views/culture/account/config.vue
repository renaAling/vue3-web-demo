<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="30%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules" v-model="loading">
				<el-form-item label="手机号：" prop="mobile">
					<div class="flex" style="width: 100%">
						<el-input
							placeholder="请输入手机查询"
							v-model="model.mobile"
							maxlength="11"
							oninput="value=value.replace(/^(0+)|[^\d]+/g, '')"
							:disabled="scopeId"
						/>
						<el-button type="primary" size="default" @click="queryInfoByMobile" class="ml-4">查询</el-button>
					</div>
				</el-form-item>
				<div v-if="userStateMsg" class="ml-10 mb-3">{{ userStateMsg }}</div>
				<el-form-item label="昵称：" prop="nickName" v-if="isShowResult">
					<el-input v-if="isShowName" placeholder="请输入昵称" v-model="model.nickName" maxlength="10" clearable />
					<span v-else>{{ model.nickName }}</span>
				</el-form-item>
				<el-form-item label="角色：" prop="roleInfos" v-if="isShowResult">
					<el-select
						v-if="isShowRole"
						multiple
						v-model="model.roleInfos"
						@keyup.enter="handleKeyUp(true)"
						filterable
						placeholder="请选择角色"
						:loading="loading"
					>
						<el-option v-for="item in roleTypeList" :key="item.roleId" :label="`${item.roleName}`" :value="item.roleId" />
					</el-select>
					<div v-else>
						<el-tag v-for="(item, index) in model.roleInfos" :key="index" class="mr10">{{ item.roleName }}</el-tag>
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)" v-if="isShowName || isShowRole">{{ dialogTitle }}</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="cututal-account-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { AccountType, RoleType } from './types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	culturalBackUserAdd,
	culturalBackUserDetail,
	culturalBackUserQueryMobile,
	culturalBackUserQueryRole,
	culturalBackUserUpdate,
} from '/@/api/culture/systemMange';
const dialogTitle = ref('新建账户');
const emit = defineEmits(['refresh']);
const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const scopeId = ref<string | null>('');
const isShowName = ref(false);
const isShowRole = ref(false);
const isShowResult = ref(false);
const loading = ref(false);
const roleTypeList = ref<RoleType[]>([]);
const model = ref<AccountType>({
	mobile: '',
	roleInfos: [],
	nickName: '',
});
const formRules = reactive<FormRules>({
	mobile: [{ required: true, message: '手机号不能为空' }],
});
const userStateMsg = ref('');
// 手机号查询
const queryInfoByMobile = async () => {
	model.value.mobile.length !== 11 && useMessage().error('请输入正确的手机号');
	try {
		loading.value = true;
		const { code, data } = await culturalBackUserQueryMobile({ mobile: model.value.mobile });
		if (code === 0) {
			isShowResult.value = true;
			if (data) {
				model.value.nickName = data.nickName || '';
				if (data.userState === 2 || data.userState === 3) {
					userStateMsg.value = data.userState === 2 ? '该用户账户已冻结，请联系系统管理员' : '该用户账户已注销，请联系管理员';
					isShowName.value = false;
					isShowRole.value = false;
				} else if (data.userState === 1) {
					if (data.roleInfos && data.roleInfos.length) {
						userStateMsg.value = '当前用户已经是管理员，请直接前往编辑';
						model.value.roleInfos = data.roleInfos;
						isShowName.value = true;
						isShowRole.value = false;
					} else {
						userStateMsg.value = '当前用户已存在，是否将其添加为管理员';
						isShowName.value = true;
						isShowRole.value = true;
					}
				}
			} else {
				isShowName.value = true;
				isShowRole.value = true;
			}
			loading.value = false;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		loading.value = false;
	}
};
// 角色查询
const queryRole = async () => {
	try {
		loading.value = true;
		const { code, data } = await culturalBackUserQueryRole();
		if (code === 0) {
			roleTypeList.value = data;
			loading.value = false;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		loading.value = false;
	}
};
const openDialog = async (id: string | null) => {
	scopeId.value = id;
	queryRole();
	if (id) {
		dialogTitle.value = '编辑账户';
		try {
			const { code, data } = await culturalBackUserDetail({ id });
			if (code === 0) {
				const roleInfos = data.roleInfos.map((item: any) => item.roleId);
				model.value = Object.assign(data, { roleInfos });
				visible.value = true;
				isShowResult.value = true;
				isShowName.value = true;
				isShowRole.value = true;
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = '新建账户';
		visible.value = true;
	}
};
const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}账户`, `${scopeId.value ? '修改' : '新建'}账户`);
			} catch {
				return false;
			}
			const roleInfos = roleTypeList.value.filter((item: any) => model.value.roleInfos.includes(item && item.roleId));
			try {
				const request = scopeId.value ? culturalBackUserUpdate : culturalBackUserAdd;
				const params = {
					...model.value,
					roleInfos,
				};
				const { code, msg } = await request(params);
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改' : '新建'}成功`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};
// 输入框回车事件
const handleKeyUp = (enterable: Boolean) => {
	if (!enterable) return;
	onSubmit(formRef.value);
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		mobile: '',
		roleInfos: [],
		nickName: '',
	};
	isShowName.value = false;
	isShowRole.value = false;
	isShowResult.value = false;
	userStateMsg.value = '';
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) return resetForm(formEl);
	// try {
	// 	await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	// } catch {
	// 	return false;
	// }
	resetForm(formEl);
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
