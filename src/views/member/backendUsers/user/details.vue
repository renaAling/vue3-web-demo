<template>
	<div class="layout-padding" style="width: 100%">
		<el-scrollbar>
			<div class="">
				<div class="my-5 flex align-center justify-start cursor-pointer" @click="toForward">
					<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
				</div>

				<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
					<div class="content-title">用户信息</div>
					<div class="flex flex-row">
						<div class="flex justify-start items-center" style="width: 150px">
							<div class="relative avatar">
								<el-avatar :size="84" :src="dataForm.avatar"> </el-avatar>
							</div>
						</div>
						<div class="flex-1 px-2">
							<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="86" @keydown.enter.prevent>
								<el-row :gutter="20">
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">用户名:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.username }}</span>
										</div>
									</el-col>
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">姓名:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.name }}</span>
										</div>
									</el-col>
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">手机号:</div>
											<span class="ml-2 text-slate-700">{{ maskedMobile(dataForm.mobile) }}</span>
										</div>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">用户ID:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.unionId }}</span>
										</div>
									</el-col>
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">状态:</div>
											<span v-if="dataForm.userState" class="ml-2 text-slate-700">{{ dataForm.userState == 1 ? '启用' : '禁用' }}</span>
											<span v-else class="ml-2 text-slate-700">-</span>
										</div>
									</el-col>
									<el-col :span="8" class="mb20">
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">密码:</div>
											<span class="ml-2 text-slate-700">xxxxxx</span>
											<!-- <span class="ml-2 text-slate-700">{{ dataForm.nickName || '-' }}</span> -->
											<span class="ml-2 cursor-pointer text-[#4785ea]" @click="visible = true">修改密码</span>
										</div>
									</el-col>
								</el-row>
							</el-form>
						</div>
						<div>
							<el-icon color="#409efc" class="cursor-pointer absolute el_edit" @click="edit(dataForm)">
								<Edit />
							</el-icon>
						</div>
					</div>
				</div>
				<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
					<el-row class="mb8 flex justify-between items-center content-title">
						<div>授权系统</div>
					</el-row>
					<div class="mx-2">
						<el-scrollbar height="300px">
							<el-table
								:data="authorizationList"
								v-loading="loading"
								row-key="id"
								border
								:cell-style="tableStyle?.cellStyle"
								:header-cell-style="tableStyle?.headerCellStyle"
							>
								<el-table-column type="index" label="序号" width="60" align="center" />
								<el-table-column label="授权系统" prop="platformName" />
								<el-table-column label="授权角色" prop="roleName">
									<template #default="{ row }">
										<span>{{ row.roleName ? row.roleName : '-' }}</span>
									</template>
								</el-table-column>
								<el-table-column label="操作">
									<template #default="{ row }">
										<el-button type="primary" link @click="set(row, dataForm.mobile)">设置</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-scrollbar>
					</div>
				</div>
				<div class="mr-5 py-2 bg-white rounded border-inherit border border-solid boxSizing">
					<el-row class="mb8 flex justify-between items-center content-title">
						<div>日志记录</div>
					</el-row>
					<div class="mx-2">
						<el-form :inline="true" :model="queryForm" @keyup.enter="getDataList" ref="queryRef">
							<el-form-item label="时间" prop="userId">
								<el-date-picker
									v-model="searchTime"
									type="daterange"
									range-separator="-"
									start-placeholder="开始时间"
									end-placeholder="结束时间"
									value-format="YYYY-MM-DD"
									style="width: 270px"
									:disabled-date="disabledDate"
								/>
							</el-form-item>
							<el-form-item label="类型" prop="riskType">
								<el-select v-model="queryForm.riskType" clearable style="width: 180px">
									<el-option v-for="(item, key) in searchFieldType" :key="key" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button @click="getMemberBackendUserLogPage" icon="search" type="primary">查询</el-button>
								<el-button @click="resetQuery" icon="Refresh">重置</el-button>
							</el-form-item>
						</el-form>
					</div>
					<div class="mx-2">
						<el-table
							:data="dataList"
							v-loading="userLogloading"
							row-key="id"
							border
							:cell-style="tableStyle1?.cellStyle"
							:header-cell-style="tableStyle1?.headerCellStyle"
						>
							<el-table-column type="index" label="序号" width="60" align="center" />
							<el-table-column label="时间" prop="createTime" />
							<el-table-column label="类型" prop="riskTypeName">
								<template #default="{ row }">
									<span>{{ row.riskTypeName == 1 ? '登录' : '操作' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="操作内容" prop="title" />
						</el-table>
						<el-pagination
							background
							layout="total, sizes, prev, pager, next, jumper"
							:page-sizes="[10, 20, 50, 100, 200]"
							:total="total"
							:page-size="pageSize"
							:current-page="currentPage"
							@size-change="handleSizeChange"
							@current-change="handlePageChange"
						></el-pagination>
					</div>
				</div>
			</div>
		</el-scrollbar>
		<formDialog ref="formDialogRef" @refresh="getUserInfoByUidMobileData"></formDialog>
		<el-dialog :close-on-click-modal="false" title="修改密码" width="500" draggable v-model="visible">
			<el-form :model="form" label-width="78px" ref="passwordFormRef" :rules="dataRules" v-loading="loading">
				<el-form-item label="修改密码" prop="version">
					<el-input placeholder="请输入密码" v-model="form.password"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetForm">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- <balanceDialog ref="balanceDialogRef" @refresh="getDataList"></balanceDialog> -->
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import {
	getUserInfoByUidMobile,
	getAuthorizationSystemInfos,
	changePasswordForBackendUser,
	getMemberBackendUserLogPageApi,
} from '/@/api/member/backendUsers/user';
import { accountDetailList } from '/@/api/points/manage';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getAuthorizedHeaders } from '/@/api/portal';
import { useTenantConfig } from '/@/stores/tenantConfig';
import { Session } from '/@/utils/storage';
import pinia from '/@/stores';

const stores = useTenantConfig(pinia);
const { tenantConfig } = storeToRefs(stores);
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const authorizationList = ref<any[]>([
	// {code: 'CCMALL_SYSTEM', domainUrl: 'https://rls-cultural.linghzx.online',  tenantId: '1816751886640836610', platformName: '地铁好店管理系统', roleName: '-' },
	// { domainUrl: 'https://rls-portal.linghzx.online', tenantId: '1853370696281276417', platformName: '成都轨道生活智慧服务平台', roleName: '-' },
	// { domainUrl: 'https://rls-score.linghzx.online', tenantId: '1855880243516456961', platformName: '积分福利社', roleName: '-' },
	// { domainUrl: 'https://rls-cultural.linghzx.online', tenantId: '1815608904948617218', platformName: '文创商城', roleName: '-' },
	// { domainUrl: 'https://rls-ops.linghzx.online', tenantId: '1830437681746067458', platformName: '运营活动管理', roleName: '-' },
	// { domainUrl: 'https://rls-ip-mall.linghzx.online', tenantId: '1830437681746067458', platformName: '地铁IP商城', roleName: '-' },
]);
// const balanceDialog = defineAsyncComponent(() => import('./balanceDetail.vue'));
const balanceDialogRef = ref();
// const { query } = route;
const queryRef = ref();
const searchTime = ref<any[]>([]);
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const userLogloading = ref<boolean>(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const queryForm = reactive({
	startTime: '',
	endTime: '',
	riskType: '',
	unionId: '',
});
const searchFieldType = ref([
	{ value: '1', label: '登陆' },
	{ value: '2', label: '权限变更' },
	{ value: '3', label: '其他' },
]);
let visible = ref(false);
const unionId = ref('');
// 提交表单数据
const form = reactive({
	password: '',
});
// 定义校验规则
const dataRules = ref({
	password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
});
// 页面对应元数据
const dataForm = reactive({
	avatar: '',
	mobile: '',
	nickName: '',
	unionId: '',
	isStaff: '',
	lastLoginTime: '',
	growthValue: '',
	levelName: '',
	score: '',
	card: '',
});
const sysInfostem = ref<any[]>([]);
const passwordFormRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
const state1: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const { getDataList: getDataList1, tableStyle: tableStyle1 } = useTable(state1);

watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			queryForm.startTime = val[0] + ' 00:00:00';
			queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			queryForm.startTime = '';
			queryForm.endTime = '';
		}
	}
);
const show = (id: string) => {
	// queryForm.unionId = id;
	unionId.value = '';
	if (unionId) {
		unionId.value = id;
		queryForm.unionId = id;
		getUserInfoByUidMobileData();
		getAuthorizationSystemInfosList(id);
		getMemberBackendUserLogPage();
	}
	// 获取子系统列表
	getsysInfostem();
	getDataList();
	getDataList1();
};

// 获取详情
const getUserInfoByUidMobileData = async () => {
	try {
		const { code, data, msg } = await getUserInfoByUidMobile({ uidMobile: unionId.value });
		if (code === 0) {
			Object.assign(dataForm, data);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 授权
const getAuthorizationSystemInfosList = async (unionId: string) => {
	try {
		const { code, data, msg } = await getAuthorizationSystemInfos(unionId);
		if (code === 0) {
			authorizationList.value = data;
			// Object.assign(dataForm, data);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getsysInfostem = async () => {
	const { code, data, msg } = await getAuthorizedHeaders();
	console.log('子系统列表', data);
};
// 跳转到其他系统授权页面
const set = (row: any, mobile: string) => {
	console.log('tenantConfig', tenantConfig.value[row.tenantId]);
	const tenantId = row.tenantId;
	if (tenantConfig.value[tenantId].isLink) {
		const isLink = tenantConfig.value[tenantId].isLink;
		const token = Session.getToken();
		const url = `${row.domainUrl}/${isLink}&isAuthorization=true&token=${token}&tenantId=1&mobile=${mobile}`;
		// const url = `https://rls-score.linghzx.online/${isLink}&token=${token}&tenantId=1&mobile=${mobile}`;
		window.open(url);
	}
};
const maskedMobile = (mobile: any) => {
	console.log('mobile', mobile);
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
const emit = defineEmits(['changeType']);
const toForward = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	queryForm.startTime = '';
	queryForm.endTime = '';
	emit('changeType');
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	queryForm.startTime = '';
	queryForm.endTime = '';
	queryForm.riskType = '';
	queryForm.unionId = '';
	getMemberBackendUserLogPage();
};

const edit = (row: any) => {
	formDialogRef.value.openDialog(row);
};
const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};

// 重置
const resetForm = () => {
	passwordFormRef.value.resetFields();
	form.password = '';
	visible.value = false;
};
// 修改密码
const putChangePasswordForBackendUser = async (form: any) => {
	const params = {
		unionId: unionId.value,
		newPassWord: form.password,
	};
	try {
		const { code, msg } = await changePasswordForBackendUser(params);
		if (code === 0) {
			useMessage().success('修改成功');
			resetForm();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 提交修改密码
const onSubmit = async () => {
	const valid = await passwordFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	putChangePasswordForBackendUser(form);
};

const getMemberBackendUserLogPage = async () => {
	userLogloading.value = true;
	const params = {
		startTime: queryForm.startTime,
		endTime: queryForm.endTime,
		riskType: queryForm.riskType,
		unionId: unionId.value,
		size: pageSize.value,
		page: currentPage.value,
	};
	try {
		const { code, data, msg } = await getMemberBackendUserLogPageApi(params);
		if (code === 0) {
			dataList.value = data.records;
			total.value = data.total;
			userLogloading.value = false;
		} else {
			useMessage().error(msg);
			userLogloading.value = false;
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		userLogloading.value = false;
	}
};
const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getMemberBackendUserLogPage();
};

const handlePageChange = (page: number) => {
	currentPage.value = page;
	getMemberBackendUserLogPage();
};
defineExpose({
	show,
});
</script>
<style lang="scss" scoped>
.layout-padding {
	height: 100%;
	.boxSizing {
		box-sizing: border-box;
		margin-bottom: 10px;
	}
}
.back-icon {
	font-size: 20px;
	.el-icon {
		height: 100%;
	}
}

.avatar {
	margin-left: 25px;
	height: 84px;
	width: 84px;
}
.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;
	margin-bottom: 9px;
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
	margin-right: 10px;
}
</style>
