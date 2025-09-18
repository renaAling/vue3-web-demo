<template>
	<div class="layout-padding" v-loading="loading">
		<el-scrollbar>
			<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
				<div class="content-title">
					用户信息
					<el-icon color="#409efc" v-if="!typeEdit.isBase" class="cursor-pointer absolute el_edit" @click="edit()">
						<EditPen />
					</el-icon>
				</div>
				<div class="flex flex-row">
					<div class="flex justify-start items-center" style="width: 150px">
						<div class="relative avatar">
							<el-avatar :size="84" :src="dataForm.avatar"> </el-avatar>
							<el-upload
								action="#"
								v-if="typeEdit.isBase"
								:show-file-list="false"
								:http-request="handleTableImageUpload"
								accept="image/jpeg,image/png,image/gif,image/jpg"
								:before-upload="beforeUpload"
							>
								<div class="upload_icon">
									<el-icon color="#165DFF"><Camera /></el-icon>
								</div>
							</el-upload>
						</div>
					</div>
					<div class="flex-1 px-2">
						<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="86" @keydown.enter.prevent>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">UID:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.unionId }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">手机号:</div>
										<span class="ml-2 text-slate-700">{{ maskedMobile(dataForm.mobile) }}</span>
									</div>
									<!-- <template v-if="typeEdit.isBase">
										<el-form-item label="手机号:" prop="mobile">
											<el-input placeholder="请输入手机号" maxlength="11" v-model="dataForm.mobile" clearable></el-input>
										</el-form-item>
									</template>
									<template v-else>
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">手机号:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.mobile }}</span>
										</div>
									</template> -->
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">邮箱:</div>
										<span class="ml-2 text-slate-700"></span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<template v-if="typeEdit.isBase">
										<el-form-item label="昵称:" prop="nickName">
											<el-input placeholder="请输入昵称" @input="validateInput" v-model="dataForm.nickName" clearable></el-input>
										</el-form-item>
									</template>
									<template v-else>
										<div class="flex justify-start items-center text-slate-500">
											<div class="text-right" style="width: 72px">昵称:</div>
											<span class="ml-2 text-slate-700">{{ dataForm.nickName }}</span>
										</div>
									</template>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">员工:</div>
										<span class="ml-2 text-slate-700" v-if="dataForm.isStaff === '0'">否</span>
										<span class="ml-2 text-green-400" v-else>是</span>
										<span class="ml-2 cursor-pointer text-[#4785ea]" v-if="dataForm.isStaff === '1'" @click="openDialogStaff(dataForm.mobile)"
											>查看详情</span
										>
									</div>
								</el-col>
								<el-col :span="8" class="mb20" v-if="dataForm.isStaff === '1'">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 74px">员工卡余额:</div>
										<div class="flex justify-between ml-2 text-slate-700">
											<div>{{ staffForm.balance ? `${staffForm.balance}元` : '0元' }}</div>
											<span class="ml-2 cursor-pointer text-[#4785ea]" @click="clickDialogMoneyVisible(staffForm.guid)">明细</span>
										</div>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right" style="width: 72px">最近登录:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.lastLoginTime }}</span>
										<span class="ml-2 cursor-pointer text-[#4785ea]" v-if="dataForm.lastLoginTime" @click="pageForMemberVisible">查看详情</span>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</div>
			</div>
			<div class="py-2 bg-white mt-2 rounded border-inherit border border-solid boxSizing" v-if="!typeEdit.isBase">
				<div class="content-title">基础会员信息</div>
				<div class="mt-2 flex flex-row py-2 px-4">
					<div class="w-1/4" style="color: #4e5969">
						会员等级<span class="ml-4" style="color: #1d2129">{{ dataForm.levelName }}</span>
						<span class="ml-2 cursor-pointer text-[#4785ea]" v-if="dataForm.levelName" @click="handleLevelVisibleList()">详情</span>
					</div>
					<div class="w-1/4" style="color: #4e5969">
						会员卡号<span class="ml-4" style="color: #1d2129">{{ dataForm.card }}</span>
					</div>
					<div class="w-1/4" style="color: #4e5969">
						成长值<span class="ml-4" style="color: #1d2129">{{ dataForm.growthValue }}</span>
						<span class="ml-2 cursor-pointer text-[#4785ea]" v-if="dataForm.growthValue" @click="handleGrowthVisibleList()">明细</span>
					</div>
					<div class="w-1/4" style="color: #4e5969">
						积分<span class="ml-4" style="color: #1d2129">{{ dataForm.score }}</span>
						<span class="ml-2 cursor-pointer text-[#4785ea]" @click="handleScoreVisibleList()">明细</span>
					</div>
				</div>
				<div class="mt-2 py-2 px-4">
					<div style="color: #4e5969">
						<span>分组</span>
						<span class="ml-4 text-[#1D2129;]" v-for="item in groupNames" :key="item">{{ item }}</span>
					</div>
				</div>
				<div class="mt-2 py-2 px-4">
					<div style="color: #4e5969">
						<span>标签</span>
						<span class="ml-4 text-[#1D2129;]" v-for="item in signNames" :key="item">{{ item }}</span>
					</div>
				</div>
			</div>
			<div class="py-2 bg-white mt-2 rounded border-inherit border border-solid boxSizing" v-if="!typeEdit.isBase">
				<div class="content-title">
					家庭成员档案
					<!-- <el-icon color="#409efc" class="cursor-pointer absolute el_edit" @click="familyMemberVisible()">
						<EditPen />
					</el-icon> -->
				</div>
				<div class="px-4 py-2"><el-button type="primary" @click="familyMemberVisible()">新增家庭成员</el-button></div>
				<el-scrollbar height="200px">
					<el-table
						class="px-4"
						:data="familyMemberDataList"
						style="width: 60%"
						row-key="id" border
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
				</el-scrollbar>
			</div>
			<div class="py-2 bg-white mt-2 rounded border-inherit border border-solid boxSizing" v-if="!typeEdit.isBase">
				<div class="content-title">子系统ID</div>
				<el-scrollbar height="200px">
					<el-table
						class="px-4"
						:data="userCenterList"
						style="width: 60%"
						row-key="id" border
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						height="200"
					>
						<el-table-column prop="platformName" label="系统名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="openId" label="子ID" show-overflow-tooltip></el-table-column>
						<el-table-column prop="createTime" label="同步时间" show-overflow-tooltip></el-table-column>
						<el-table-column label="同步状态" show-overflow-tooltip>
							<template #default>
								<span class="ml-2 cursor-pointer text-[#27d23e]">同步成功</span>
							</template>
						</el-table-column>
					</el-table>
				</el-scrollbar>
			</div>
			<div class="py-2 bg-white mt-2 rounded border-inherit border border-solid boxSizing" v-if="!typeEdit.isBase">
				<div class="content-title">订单信息</div>
				<div class="mt-2 py-2 px-4 flex">
					<div class="w-1/6 py-2" style="color: #4e5969">
						支付笔数<span class="ml-4 text-[#1D2129;]">{{ orderInfo.totalCount }}</span>
					</div>
					<div class="w-1/6 py-2" style="color: #4e5969">
						支付金额<span class="ml-4 text-[#1D2129;]">{{ orderInfo.totalAmount }}元</span>
					</div>
				</div>
				<el-scrollbar height="200px">
					<el-table
						class="px-4"
						:data="orderInfo.orderList"
						style="width: 60%"
						row-key="id" border
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						height="200"
					>
						<el-table-column prop="payModule" label="模块" show-overflow-tooltip></el-table-column>
						<el-table-column prop="payCount" label="支付笔数" show-overflow-tooltip></el-table-column>
						<el-table-column prop="payAmount" label="支付金额" show-overflow-tooltip></el-table-column>
						<el-table-column prop="lastOrderTime" label="最近下单时间" show-overflow-tooltip></el-table-column>
					</el-table>
				</el-scrollbar>
			</div>
			<div class="mt-4 content-center w-full text-center" v-if="typeEdit.isBase">
				<el-button type="primary" @click="onSubmit">保存</el-button>
				<el-button @click="cancel">取消</el-button>
			</div>
			<el-dialog v-model="dialogTableVisible" title="登录系统" width="800" @close="closeDialogVisible('dialogTableVisible')">
				<el-scrollbar height="400px">
					<el-table
						border
						:data="state.dataList"
						v-loading="dialogLoading"
						:cell-style="tableStyle.cellStyle"
						height="400"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column prop="loginTime" label="登录时间" show-overflow-tooltip></el-table-column>
						<!-- <el-table-column prop="type" label="登录系统" show-overflow-tooltip>
						<template #default="{ row }">
							<span v-if="row.type === 1">B端</span>
							<span v-if="row.type === 2">C端</span>
						</template>
					</el-table-column> -->
						<el-table-column prop="loginIp" label="登录ID" show-overflow-tooltip></el-table-column>
					</el-table>
				</el-scrollbar>
				<pagination
					@size-change="sizeChangeHandle"
					@current-change="currentChangeHandle"
					v-bind="state.pagination"
					layout="prev, pager, next, jumper"
				/>
			</el-dialog>
			<el-dialog v-model="dialogGrowthVisible" title="成长值" width="800" @close="closeDialogVisible('dialogGrowthVisible')">
				<el-scrollbar height="400px">
					<el-table
					border
						:data="state.dataList"
						v-loading="dialogLoading"
						:cell-style="tableStyle.cellStyle"
						height="400"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column prop="changeTime" label="时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="title" label="来源" show-overflow-tooltip></el-table-column>
						<el-table-column prop="changeValue" label="获得成长值" show-overflow-tooltip>
							<template #default="scope"
								><div>
									<span v-if="scope.row.changeType">{{ scope.row.changeType === 1 ? '+' : '-' }}</span
									>{{ scope.row.changeValue }}
								</div></template
							>
						</el-table-column>
					</el-table>
				</el-scrollbar>
				<pagination
					@size-change="sizeChangeHandle"
					@current-change="currentChangeHandle"
					v-bind="state.pagination"
					layout="prev, pager, next, jumper"
				/>
			</el-dialog>

			<el-dialog v-model="dialogScoreVisible" title="积分明细" width="800" @close="closeDialogVisible('dialogScoreVisible')">
				<el-scrollbar height="400px">
					<el-table
					border
						:data="state.dataList"
						v-loading="dialogLoading"
						:cell-style="tableStyle.cellStyle"
						height="400"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column prop="handleTime" label="时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="eventName" label="事件" show-overflow-tooltip></el-table-column>
						<el-table-column prop="changeScore" label="积分" show-overflow-tooltip></el-table-column>
					</el-table>
				</el-scrollbar>
				<pagination
					@size-change="sizeChangeHandle"
					@current-change="currentChangeHandle"
					v-bind="state.pagination"
					layout="prev, pager, next, jumper"
				/>
			</el-dialog>
			<!-- 详情 -->
			<el-dialog v-model="dialogStaffVisible" title="员工信息" width="400" @close="closeDialogVisible()">
				<el-form :model="staffForm">
					<el-form-item label="手机号:">
						<div>{{ maskedMobile(staffForm.mobile) }}</div>
					</el-form-item>
					<el-form-item label="姓名:">
						<div>{{ staffForm.name }}</div>
					</el-form-item>
					<el-form-item label="工号:">
						<div>{{ staffForm.userJobNum }}</div>
					</el-form-item>
					<el-form-item label="员工类型:">
						<div v-if="staffForm.userType === 1">内部员工</div>
						<div v-if="staffForm.userType === 2">委外员工</div>
						<div v-if="staffForm.userType === 3">见习</div>
						<div v-if="staffForm.userType === 4">其他</div>
					</el-form-item>
					<el-form-item label="部门:">
						<div>{{ staffForm.deptName }}</div>
					</el-form-item>
				</el-form>
			</el-dialog>
			<el-dialog v-model="dialogMoneyVisible" title="员工卡余额明细" width="800" @close="closeDialogVisible('dialogMoneyVisible')">
				<el-scrollbar height="400px">
					<el-table
					border
						:data="state.dataList"
						v-loading="dialogLoading"
						:cell-style="tableStyle.cellStyle"
						height="400"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column prop="tradeTime" label="时间" show-overflow-tooltip></el-table-column>
						<el-table-column label="类型" show-overflow-tooltip>
							<template #default="{ row }">
								<div v-if="row.tradeType == 1">增加</div>
								<div v-if="row.tradeType == 2">扣减</div>
							</template>
						</el-table-column>
						<el-table-column label="金额" show-overflow-tooltip>
							<template #default="scope">
								<div v-if="scope.row.amount">{{ `${scope.row.amount}元` }}</div>
							</template>
						</el-table-column>
					</el-table>
				</el-scrollbar>
				<pagination
					@size-change="sizeChangeHandle"
					@current-change="currentChangeHandle"
					v-bind="state.pagination"
					layout="prev, pager, next, jumper"
				/>
			</el-dialog>
			<el-dialog v-model="dialogLevelVisible" title="等级信息" width="400">
				<el-form>
					<el-form-item label="当前等级:">
						<div>{{ levelForm.levelName }}</div>
					</el-form-item>
					<el-form-item label="升级时间:">
						<div>{{ levelForm.upgradeTime }}</div>
					</el-form-item>
				</el-form>
			</el-dialog>
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
						<el-input v-model="familyMemberForm.phone" @change="changeFamilyPhone" maxlength="11" />
					</el-form-item>
				</el-form>
				<div class="flex justify-center pt-10">
					<el-button type="primary" @click="onSubmitFamilyMember(ruleFamilyFormRef)">保存</el-button>
					<el-button @click="closeFamilyMemberVisible(ruleFamilyFormRef)">取消</el-button>
				</div>
			</el-dialog>
		</el-scrollbar>
	</div>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import {
	getMemberDetail,
	getMemberStaffInfoByMobile,
	getMemberStaffWalletFlow,
	getPageByUnionId,
	getFindScoreFlowByUnionId,
	getUserLevelInfoByUnionId,
	postMemberFamilyAdd,
	postMemberFamilyUpdate,
	deleteMemberFamilyDel,
	getPageForMember,
	upDateAvatarAndNickNameByUnionId,
	getUserCenter,
} from '../../../../api/member/member';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { uploadImage } from '/@/api/culture/common';
import type { UploadRequestOptions, UploadProps, FormRules, FormInstance } from 'element-plus';
import { useRoute } from 'vue-router';
import { BasicTableProps, useTable } from '/@/hooks/table';
// import { fa } from 'element-plus/es/locale';
const route = useRoute();
const userCenterList = ref([]) as any;
// 编辑
interface TypeEdit {
	isBase: boolean; // 基础信息是否编辑
}
const typeEdit = reactive<TypeEdit>({
	isBase: true,
});

const dialogTableVisible = ref(false);
const dialogGrowthVisible = ref(false);
const dialogScoreVisible = ref(false);
const dialogStaffVisible = ref(false);
const dialogMoneyVisible = ref(false);
const dialogLevelVisible = ref(false);
const dialogLoading = ref(false);
const levelForm = ref({
	levelName: '',
	upgradeTime: '',
});
const dialogFamilyMemberVisible = ref(false);
const visibleTitle = ref('新增家庭成员');
const dataFormRef = ref();
const loading = ref(false);
const ruleFamilyFormRef = ref<FormInstance>();
const orderInfo = ref({
	orderList: [],
	totalAmount: null,
	totalCount: null,
});
const staffForm = ref({ mobile: '', name: '', userJobNum: '', userType: null, deptName: '', balance: '', guid: '' }) as any;
const groupNames = ref([]); //基础信息分组
const signNames = ref([]); //基础信息标签
const dialogData = reactive({
	dataList: [],
	pagination: {
		size: 10,
		current: 1,
	},
});
// 弹窗数据
interface DataForm {
	avatar: string;
	mobile: string;
	nickName: string;
	unionId: string;
	isStaff?: string;
	lastLoginTime?: string;
	growthValue?: string;
	levelName?: string;
	score?: string;
	card?: string;
}
// 页面对应元数据
const dataForm = reactive<DataForm>({
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
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pagination: {
		pageSizes: [10, 20, 50, 100, 200],
	},
});
interface familyMember {
	id: string;
	unionId: string;
	name: string;
	relation: string;
	phone: string;
}
const familyMemberForm = reactive<familyMember>({
	id: '',
	unionId: '',
	name: '',
	relation: '',
	phone: '',
});
const familyMemberDataList = ref([]);
const isEditFamily = ref(false); //是否编辑家庭成员数据
const isChangeFamilyPhone = ref('');
const maskedMobile = (mobile: any) => {
	console.log('mobile', mobile);
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
const getMemberStaffInfo = async (mobile: string) => {
	return new Promise((resolve, reject) => {
		getMemberStaffInfoByMobile(mobile)
			.then((val) => {
				Object.assign(staffForm.value, val.data);
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				reject(false);
			});
	});
};
// 打开员工弹窗-再拿一次数据（防止出现被其他人修改的情况）
const openDialogStaff = async (mobile: string) => {
	return new Promise((resolve, reject) => {
		getMemberStaffInfoByMobile(mobile)
			.then((val) => {
				Object.assign(staffForm.value, val.data);
				dialogStaffVisible.value = true;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				reject(false);
			});
	});
};
// 登录信息明细表
const pageForMemberVisible = async () => {
	dialogLoading.value = true;
	const params = {
		unionId: dataForm.unionId,
		current: dialogData.pagination.current,
		size: dialogData.pagination.size,
	};
	state.pageList = getPageForMember;
	state.queryForm = params;
	return new Promise((resolve, reject) => {
		getPageForMember(params)
			.then(() => {
				getDataList();
				dialogTableVisible.value = true;
				dialogLoading.value = false;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				dialogLoading.value = false;
				reject(false);
			});
	});
};
// 员工卡余额明细弹窗
const clickDialogMoneyVisible = async (guid: string) => {
	dialogLoading.value = true;
	const params = {
		userGuid: guid,
		current: dialogData.pagination.current,
		size: dialogData.pagination.size,
		tradeType: '',
	};
	state.pageList = getMemberStaffWalletFlow;
	state.queryForm = params;
	return new Promise((resolve, reject) => {
		getMemberStaffWalletFlow(params)
			.then(() => {
				getDataList();
				dialogMoneyVisible.value = true;
				dialogLoading.value = false;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				dialogLoading.value = false;
				reject(false);
			});
	});
};
// 积分明细弹窗
const handleScoreVisibleList = async () => {
	dialogLoading.value = true;
	console.log('state', state);
	const params = {
		unionId: dataForm.unionId,
		current: dialogData.pagination.current,
		size: dialogData.pagination.size,
	};
	state.pageList = getFindScoreFlowByUnionId;
	state.queryForm = params;
	return new Promise((resolve, reject) => {
		getFindScoreFlowByUnionId(params)
			.then(() => {
				getDataList();
				dialogScoreVisible.value = true;
				dialogLoading.value = false;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				dialogLoading.value = false;
				reject(false);
			});
	});
};
// 打开成长值弹窗
const handleGrowthVisibleList = async () => {
	dialogLoading.value = true;
	const params = {
		unionId: dataForm.unionId,
		current: dialogData.pagination.current,
		size: dialogData.pagination.size,
	};
	state.pageList = getPageByUnionId;
	state.queryForm = params;
	return new Promise((resolve, reject) => {
		getPageByUnionId(params)
			.then(() => {
				getDataList();
				dialogGrowthVisible.value = true;
				dialogLoading.value = false;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				dialogLoading.value = false;
				reject(false);
			});
	});
};
// 会员等级详情
const handleLevelVisibleList = async () => {
	return new Promise((resolve, reject) => {
		getUserLevelInfoByUnionId(dataForm.unionId)
			.then((val) => {
				Object.assign(levelForm.value, val.data);
				dialogLevelVisible.value = true;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				reject(false);
			});
	});
};
const getUserCenterList = async () => {
	return new Promise((resolve, reject) => {
		getUserCenter(dataForm.unionId)
			.then((val) => {
				userCenterList.value = val.data.thirdAuthInfos;
				resolve(true);
			})
			.catch((err) => {
				useMessage().error(err.msg);
				reject(false);
			});
	});
};

const changeFamilyPhone = (val: string) => {
	console.log('isChangeFamilyPhone.value', val);
	isChangeFamilyPhone.value = val;
};
// const regExp_phoneNumber: RegExp = new RegExp(/^(\+?0?86\-?)?1[3456789]\d{9}$/);
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

// 关闭弹窗清空表格数据
const closeDialogVisible = (type?: string) => {
	if (type === 'dialogGrowthVisible') dialogGrowthVisible.value = false;
	if (type === 'dialogScoreVisible') dialogScoreVisible.value = false;
	if (type === 'dialogMoneyVisible') dialogMoneyVisible.value = false;
	resetDialogData();
	getDetail(route.query.id as string);
};
// 重置弹窗表格数据
const resetDialogData = () => {
	dialogData.dataList = [];
	dialogData.pagination.current = 1;
	dialogData.pagination.size = 10;
};
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
					getDetail(route.query.id as string);
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
// 上传图片前检查上传图片大小，最多允许上传1M图片
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
	const imgSize = file.size / 1024 / 1024 < 1;
	if (!imgSize) {
		useMessage().error('头像只允许上传1M以内的照片');
	}
	return imgSize;
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 上传图片
const handleTableImageUpload = async (options: UploadRequestOptions) => {
	let formData = new FormData();
	formData.append('file', options.file);
	formData.append('dir', 'unified-sign-on');
	try {
		const { data } = await uploadImage(formData);
		console.log('上传data', data);
		// const baseURL = import.meta.env.VITE_DOCUMENT_FILE_URL;
		// useMessage().success(t('图片上传成功'));
		dataForm.avatar = data.url;
		// dataForm.avatar = data.url.includes('http') ? data.url : baseURL + data.url;
	} catch (error: any) {
		useMessage().error(error.msg);
		options.onError(error);
	}
};

const getDetail = async (id: string) => {
	try {
		loading.value = true;
		const res = await getMemberDetail(id);
		console.log('res', res);
		// eslint-disable-next-line no-console
		const obj = res.data;
		dataForm.avatar = obj.userInfo.avatar;
		dataForm.mobile = obj.userInfo.mobile;
		dataForm.nickName = obj.userInfo.nickName;
		dataForm.unionId = obj.userInfo.unionId;
		dataForm.isStaff = obj.userInfo.isStaff;
		dataForm.lastLoginTime = obj.userInfo.lastLoginTime;
		dataForm.growthValue = obj.memberInfo?.userLevelInfo?.growthValue;
		dataForm.levelName = obj.memberInfo?.userLevelInfo?.levelName;
		dataForm.card = obj.memberInfo?.userLevelInfo?.card;
		dataForm.score = obj.memberInfo.score;

		familyMemberDataList.value = obj.familyInfo;
		orderInfo.value.orderList = obj.orderInfo;
		if (obj.orderInfo?.length > 0) {
			orderInfo.value.totalAmount = obj.orderInfo[0].totalAmount;
			orderInfo.value.totalCount = obj.orderInfo[0].totalCount;
		}
		groupNames.value = obj.memberInfo?.groupNames;
		signNames.value = obj.memberInfo?.signNames;
		// 拿员工卡余额等数据
		getMemberStaffInfo(dataForm.mobile);
		getUserCenterList();
	} finally {
		loading.value = false;
	}
};

if (route.query.id) {
	console.log('unionId', route.query.id);
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
const validateInput = () => {
	// 如果输入的内容去掉前后空格后长度为0，则认为是无效输入
	if (dataForm.nickName.trim().length === 0) {
		dataForm.nickName = '';
	}
};
// 定义校验规则
const dataRules = ref({
	mobile: [
		{ required: true, message: '手机号不能为空', trigger: 'change' },
		{ validator: validatLength, trigger: ['blur', 'change'] },
	],
	nickName: [{ required: true, message: '请输入昵称', trigger: 'change' }],
	// deptCode: [{ required: true, message: '组织不能为空', trigger: 'change' }]
});
// 返回
// const toBack = () => {
// 	router.push({ path: '/member/memberManagement/memberManager/detail' });
// };
// 点击取消
const cancel = () => {
	dataFormRef.value?.resetFields();
	typeEdit.isBase = false;
	getDetail(route.query.id as string);
	// toBack();
};

//提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		dataForm.lastLoginTime = undefined;
		const params = {
			unionId: dataForm.unionId,
			// mobile: dataForm.mobile,
			nickName: dataForm.nickName,
			avatar: dataForm.avatar,
		};
		upDateAvatarAndNickNameByUnionId(params)
			.then((res) => {
				loading.value = false;
				if (res.ok) {
					useMessage().success(t('common.editSuccessText'));
					typeEdit.isBase = false;
					getDetail(route.query.id as string);
					// toBack();
				} else {
					useMessage().error(res.msg);
				}
			})
			.catch((err) => {
				loading.value = false;
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
.layout-padding {
	height: 100%;
	.boxSizing {
		box-sizing: border-box;
	}
}
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

.avatar {
	margin-left: 25px;
	height: 84px;
	width: 84px;
}
.upload_icon {
	position: absolute;
	width: 24px;
	height: 24px;
	left: 62px;
	top: 62px;
	border-radius: 100px;
	border: 2px solid #ffffff;
	background-color: #e8f3ff;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
::v-deep {
	.el-overlay .el-overlay-dialog .el-dialog .el-dialog__body {
		padding-top: 0 !important;
	}
	.el-scrollbar__bar.is-horizontal > div {
		height: 0;
	}
}
</style>
