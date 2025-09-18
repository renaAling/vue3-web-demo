<template>
	<div class="relative overscroll-y-auto" style="padding: 16px" v-loading="loading">
		<div class="py-2 bg-white rounded border-inherit border border-solid">
			<div class="content-title">
				用户信息
				<el-icon color="#409efc" class="cursor-pointer absolute el_edit" @click="edit()">
					<EditPen />
				</el-icon>
			</div>
			<div class="p-4 w-full">
				<div class="flex flex-row">
					<el-form class="w-full" ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="104">
						<el-row :gutter="20">
							<el-col :span="12" class="mb20">
								<div class="flex justify-start items-center text-slate-500">
									<div class="text-right" style="width: 90px">UID:</div>
									<span class="ml-2 text-slate-700">{{ dataForm.unionId }}</span>
								</div>
							</el-col>
							<el-col :span="12" class="mb20">
								<template v-if="typeEdit.isBase">
									<el-form-item label="手机号:" prop="mobile">
										<el-input placeholder="请输入手机号" maxlength="11" v-model="dataForm.mobile" clearable></el-input>
									</el-form-item>
								</template>
								<template v-else>
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 90px">手机号:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.mobile }}</span>
									</div>
								</template>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12" class="mb20">
								<template v-if="typeEdit.isBase">
									<el-form-item label="密码:" prop="password">
										<el-input placeholder="请输入密码" maxlength="20" type="password" v-model="dataForm.password" show-password clearable></el-input>
									</el-form-item>
								</template>
								<template v-else>
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 90px">用户登录密码:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.isSetPassword ? '已设置' : '未设置' }}</span>
									</div>
								</template>
							</el-col>
							<el-col :span="12" class="mb20 inline-block"> </el-col>
						</el-row>
					</el-form>
				</div>
			</div>
		</div>
		<div class="py-2 bg-white mt-2 rounded border-inherit border border-solid" v-if="!typeEdit.isBase">
			<div class="content-title">三方授权ID</div>
			<div class="mt-2 flex flex-row py-2 px-4">
				<el-table :data="dataForm.thirdAuthInfos" row-key="id" border :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
					<el-table-column label="系统名称" prop="platformName" fixed="left" show-overflow-tooltip></el-table-column>
					<el-table-column label="子ID" prop="openId" show-overflow-tooltip></el-table-column>
					<el-table-column label="同步时间" prop="createTime" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
		</div>
		<div class="py-2 bg-white mt-2 rounded border-inherit border border-solid" v-if="!typeEdit.isBase">
			<div class="content-title">子系统ID</div>
			<div class="mt-2 flex flex-row py-2 px-4">
				<el-table :data="dataForm.subSystemInfos" row-key="id" border :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
					<el-table-column label="系统名称" prop="platformName" fixed="left" show-overflow-tooltip></el-table-column>
					<el-table-column label="子ID" prop="channelUserCode" show-overflow-tooltip></el-table-column>
					<el-table-column label="同步时间" prop="createTime" show-overflow-tooltip></el-table-column>
				</el-table>
			</div>
		</div>
		<div class="mt-4 content-center w-full text-center" v-if="typeEdit.isBase">
			<el-button type="primary" @click="onSubmit">保存</el-button>
			<el-button @click="cancel">取消</el-button>
		</div>
		<!-- <div class="bg-white absolute pr-4 w-full text-right align-middle fotter" v-if="!typeEdit.isBase">
			<el-button type="info" @click="handleDelete">注销</el-button>
		</div> -->
	</div>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { useTable } from '/@/hooks/table';
import { getUserDetail, putUser } from '/@/api/user';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
// 编辑
interface TypeEdit {
	isBase: boolean; // 基础信息是否编辑
}
const typeEdit = reactive<TypeEdit>({
	isBase: true,
});
const { tableStyle } = useTable({});

const dataFormRef = ref();
const loading = ref(false);
interface DataForm {
	unionId: string;
	mobile: string;
	password?: string;
	isSetPassword?: string;
	thirdAuthInfos?: any[];
	subSystemInfos?: any[];
}
// 页面对应元数据
const dataForm = reactive<DataForm>({
	unionId: '',
	mobile: '',
	password: '',
	isSetPassword: '',
	thirdAuthInfos: [],
	subSystemInfos: [],
});

// 注销
// const handleDelete = async () => {
// 	try {
// 		await useMessageBox().confirm('请确认是否注销');
// 	} catch {
// 		return;
// 	}

// 	try {
// 		loading.value = true;
// 		const params:any = {
// 			unionId: dataForm.unionId
// 		}
// 		await bgLogout(params)
// 		useMessage().success('注销成功')
// 		toBack()
// 	} catch (err: any) {
// 		useMessage().error(err.msg);
// 	} finally {
// 		loading.value = false;
// 	}
// }
const getDetail = async (id: string) => {
	try {
		loading.value = true;
		const res = await getUserDetail(id);
		// eslint-disable-next-line no-console
		const obj = res.data;
		dataForm.unionId = obj.unionId;
		dataForm.mobile = obj.mobile;
		dataForm.isSetPassword = obj.isSetPassword;
		dataForm.thirdAuthInfos = obj.thirdAuthInfos;
		dataForm.subSystemInfos = obj.subSystemInfos;
	} finally {
		loading.value = false;
	}
};
if (route.query.id) {
	typeEdit.isBase = false;
	getDetail(route.query.id as string);
}
const edit = () => {
	typeEdit.isBase = true;
};

dataFormRef.value?.resetFields();

const { t } = useI18n();

const validatLength = (rule: any, value: any, callback: any) => {
	const reg = /^\d{11}$/;
	if (value.length !== 11) {
		callback(new Error('长度11个字符'));
	} else if (!reg.test(value)) {
		callback(new Error('必须是数字'));
	} else {
		callback();
	}
};
const validatPassword = (rule: any, value: any, callback: any) => {
	const reg = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^[_#@*]+$)^\w{8,20}$/;
	if (!value) {
		callback();
	} else if (!reg.test(value)) {
		callback(new Error('密码为8-20位字母、数字和符号2种以上组合'));
	} else {
		callback();
	}
};

// 定义校验规则
const dataRules = ref({
	mobile: [
		{ required: true, message: '手机号不能为空', trigger: 'change' },
		{ validator: validatLength, trigger: ['blur', 'change'] },
	],
	password: [{ validator: validatPassword, trigger: ['change'] }],
	// deptCode: [{ required: true, message: '组织不能为空', trigger: 'change' }]
});
// 返回
const toBack = () => {
	router.push({ path: '/userManager/index' });
};
// 点击取消
const cancel = () => {
	dataFormRef.value?.resetFields();
	toBack();
};

//提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		const params: any = {
			unionId: dataForm.unionId,
			mobile: dataForm.mobile,
		};
		if (dataForm.password) {
			params['password'] = dataForm.password;
		}
		putUser(params)
			.then((res) => {
				if (res.ok) {
					useMessage().success(t('common.editSuccessText'));
					toBack();
				} else {
					useMessage().error(res.msg);
				}
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>
<style lang="scss" scoped>
.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;
	&::before {
		content: '';
		width: 8px;
		height: 20px;
		border-radius: 2px;
		background-color: #165dff;
		position: absolute;
		left: 0;
	}
}
.el_edit {
	left: 91%;
}
.fotter {
	z-index: 2;
	bottom: 0;
	left: 0;
	height: 55px;
	line-height: 55px;
}
</style>
