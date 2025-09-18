<template>
	<div class="layout-padding" style="width: 100%">
		<div>
			<!-- <el-icon :size="24" @click="toForward" class="back-icon">
				<Back />
			</el-icon> -->
			<div class="my-2 flex justify-start cursor-pointer back-icon" @click="toForward">
				<div class="flex icon">
					<el-icon :size="22"><ArrowLeftBold /></el-icon>
				</div>
				<div class="ml-2">返回</div>
			</div>
			<div class="py-2 bg-white rounded border-inherit border border-solid boxSizing">
				<div class="content-title">用户信息</div>
				<div class="flex flex-row">
					<div class="flex justify-start items-center" style="width: 150px">
						<div class="relative avatar">
							<el-avatar :size="84" :src="dataForm.userInfo.avatar"> </el-avatar>
						</div>
					</div>
					<div class="flex-1 px-2">
						<el-form ref="dataFormRef" :model="dataForm" label-width="86">
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">用户昵称:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.userInfo.nickName }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">联系电话:</div>
										<span class="ml-2 text-slate-700">{{ maskedMobile(dataForm.userInfo.mobile) }}</span>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">微信平台openid:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.userInfo.openId || '-' }}</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">unionid:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.userInfo.unionId }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">是否员工:</div>
										<span class="ml-2 text-slate-700">{{ Number(dataForm.userInfo.isStaff) ? '是' : '否' }}</span>
										<span v-if="Number(dataForm.userInfo.isStaff)" class="ml-2 text-slate-700">({{ dataForm.userInfo.staffId }})</span>
										<el-button v-if="Number(dataForm.userInfo.isStaff)" text type="primary" @click="recharge(dataForm)">充值</el-button>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">乘车码状态:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.userInfo.rideAuth ? '未授权' : '已授权' }}</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">注册时间:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.userInfo.registerTime }}</span>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<div class="edit-icon">
						<el-icon color="#409efc" class="cursor-pointer absolute el_edit" @click="edit(dataForm.userInfo)">
							<Edit />
						</el-icon>
					</div>
				</div>
			</div>
			<div style="overflow: hidden">
				<el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleChange">
					<el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value"> </el-tab-pane>
				</el-tabs>
				<childSystemContent ref="childSystemRef" :unionId="userUnionId" v-if="activeName == '1'"></childSystemContent>
				<profileContent ref="profileRef" :unionId="userUnionId" :score="dataForm.memberInfo.score" v-if="activeName == '2'"></profileContent>
				<familyContent ref="familyRef" :unionId="userUnionId" v-if="activeName == '3'"></familyContent>
				<consumption ref="consumptionRef" :unionId="userUnionId" v-if="activeName == '4'"></consumption>
				<travelContent ref="travelRef" :unionId="userUnionId" v-if="activeName == '5'"></travelContent>
				<mealCard
					ref="mealCardRef"
					:unionId="userUnionId"
					:mobile="dataForm.userInfo.mobile"
					:staffId="dataForm.userInfo.staffId"
					v-if="activeName == '6'"
				></mealCard>
				<logContent ref="logRef" :unionId="userUnionId" v-if="activeName == '7'"></logContent>
			</div>
		</div>
		<formDialog ref="formDialogRef" @refresh="getDetailsData"></formDialog>
		<rechargeFormDialog ref="rechargeFormDialogRef" @refresh="getDataList"></rechargeFormDialog>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { accountDetailList } from '/@/api/points/manage';
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberDetail } from '/@/api/member/memberManagement/accountManager';

// import type { TabsPaneContext } from 'element-plus';

const familyContent = defineAsyncComponent(() => import('./familyContent.vue'));
const familyRef = ref();
const consumption = defineAsyncComponent(() => import('./consumption.vue'));
const consumptionRef = ref();
const childSystemContent = defineAsyncComponent(() => import('./childSystem.vue'));
const childSystemRef = ref();
const profileContent = defineAsyncComponent(() => import('./profile.vue'));
const profileRef = ref();
const travelContent = defineAsyncComponent(() => import('./travel.vue'));
const travelRef = ref();
const logContent = defineAsyncComponent(() => import('./log.vue'));
const logRef = ref();
const mealCard = defineAsyncComponent(() => import('./mealCard.vue'));
const mealCardRef = ref();

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const rechargeFormDialog = defineAsyncComponent(() => import('./rechargeForm.vue'));
const rechargeFormDialogRef = ref();

// const { query } = route;
const queryRef = ref();
const searchTime = ref([]);
const activeName = ref('1');
const userUnionId = ref('');
const tabList = ref([
	{ label: '子系统ID', value: '1' },
	{ label: '会员档案', value: '2' },
	{ label: '家庭成员档案', value: '3' },
	{ label: '生活消费', value: '4' },
	{ label: '出行行程', value: '5' },
	{ label: '员工餐卡', value: '6' },
	{ label: '日志记录', value: '7' },
]);
// 页面对应元数据
const dataForm = reactive<any>({
	userInfo: {},
	memberInfo: {},
	familyInfo: {},
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: accountDetailList,
	queryForm: {},
	dataList: [],
});

watch(
	() => activeName.value,
	(val) => {
		// if (val == '1') {
		// 	childSystemRef.value.getUserCenterList(userUnionId.value);
		// }
		// if (val[0] && val[1]) {
		// 	state.queryForm.dateStart = val[0] + ' 00:00:00';
		// 	state.queryForm.dateEnd = val[1] + ' 23:59:59';
		// } else {
		// 	state.queryForm.dateStart = '';
		// 	state.queryForm.dateEnd = '';
		// }
	}
);

const show = (unionId: string) => {
	console.log('unionIdunionId', unionId);
	state.queryForm.unionId = unionId;
	userUnionId.value = unionId;
	getDetail(unionId);
	getDataList();
	childSystemRef.value.getUserCenterList(state.queryForm.unionId);
};
const getDetailsData = () => {
	getDataList();
	getDetail(state.queryForm.unionId);
};
//  table hook
const { getDataList, tableStyle } = useTable(state);

const getDetail = async (unionId: string) => {
	try {
		const { code, data, msg } = await getMemberDetail(unionId);
		if (code === 0) {
			// dataForm = data;
			Object.assign(dataForm, data);
			console.log('getDetail', data);
			// queryForm.levelArr = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	// getMemberDetail
};
const recharge = (row: any) => {
	rechargeFormDialogRef.value.openDialog(row);
};
const handleChange = (tab: any, event: Event) => {
	console.log(tab, event);
	// if (tab == 1) {
	// 	childSystemRef.value.getUserCenterList(state.queryForm.unionId);
	// }
};
const emit = defineEmits(['changeType']);
const toForward = () => {
	// queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	activeName.value = '1';
	emit('changeType');
};

const edit = (row: any) => {
	console.log('formDialogRef', formDialogRef);
	formDialogRef.value.openDialog(row);
};

const maskedMobile = (mobile: any) => {
	console.log('mobile', mobile);
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
defineExpose({
	show,
});
</script>
<style lang="scss" scoped>
.layout-padding {
	height: 100%;
	overflow: auto;
	.boxSizing {
		box-sizing: border-box;
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
.edit-icon {
	padding-right: 20px;
}
.back-icon {
	font-size: 22px;
	.icon {
		align-items: flex-end;
	}
	.el-icon {
		height: 100%;
	}
}
.text-right {
	width: 105px;
	text-align: right;
}
</style>
