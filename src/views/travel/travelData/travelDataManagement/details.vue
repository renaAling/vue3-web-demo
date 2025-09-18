<template>
	<div class="layout-padding" style="width: 100%">
		<div>
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
							<el-avatar :size="84" :src="dataForm.avatar"> </el-avatar>
						</div>
					</div>
					<div class="flex-1 px-2">
						<el-form ref="dataFormRef" :model="dataForm" label-width="86">
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">用户名:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.userName || '-' }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">手机号:</div>
										<!-- <span class="ml-2 text-slate-700">{{ maskedMobile(dataForm.mobile) }}</span> -->
										<span class="ml-2 text-slate-700">{{ dataForm.mobile || '-' }}</span>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">注册时间:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.registerTime || '-' }}</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">轨道生活通小程序OpenID:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.trackLifeOpenId || '-' }}</span>
									</div>
								</el-col>
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">成都地铁乘车码小程序OpenID:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.chengduMetroOpenId || '-' }}</span>
									</div>
								</el-col>
								<!-- <el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">是否员工:</div>
										<span class="ml-2 text-slate-700">{{ Number(dataForm.userInfo.isStaff) ? '是' : '否' }}</span>
										<span v-if="Number(dataForm.userInfo.isStaff)" class="ml-2 text-slate-700">({{ dataForm.userInfo.staffId }})</span>
										<el-button v-if="Number(dataForm.userInfo.isStaff)" text type="primary" @click="recharge(dataForm)">充值</el-button>
									</div>
								</el-col> -->
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">授权时间:</div>
										<span class="ml-2 text-slate-700">{{ dataForm.createTime || '-' }}</span>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" class="mb20">
									<div class="flex justify-start items-center text-slate-500">
										<div class="text-right">授权状态:</div>
										<span class="ml-2 text-slate-700" v-if="dataForm.bindStatus">{{ dataForm.bindStatus == 1 ? '已授权' : '未授权' }}</span>
										<span class="ml-2 text-slate-700" v-if="!dataForm.bindStatus">-</span>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</div>
			</div>
			<div style="overflow: hidden">
				<el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleChange">
					<el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value"> </el-tab-pane>
				</el-tabs>
				<passengerRecord ref="passengerRecordRef" :unionId="userUnionId" v-if="activeName == '1'"></passengerRecord>
				<passengerMileage ref="passengerMileageRef" :unionId="userUnionId" v-if="activeName == '2'"></passengerMileage>
				<passengerMileagePoints ref="passengerMileagePointsRef" :unionId="userUnionId" v-if="activeName == '3'"></passengerMileagePoints>
			</div>
		</div>
		<formDialog ref="formDialogRef"></formDialog>
		<rechargeFormDialog ref="rechargeFormDialogRef"></rechargeFormDialog>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import router from '/@/router';

const route = useRoute();
const passengerRecord = defineAsyncComponent(() => import('./components/passengerRecord.vue'));
const passengerRecordRef = ref();
const passengerMileage = defineAsyncComponent(() => import('./components/passengerMileage.vue'));
const passengerMileageRef = ref();
const passengerMileagePoints = defineAsyncComponent(() => import('./components/passengerMileagePoints.vue'));
const passengerMileagePointsRef = ref();
const activeName = ref('1');
const userUnionId = ref('');
const tabList = ref([
	{ label: '乘车记录', value: '1' },
	{ label: '乘车里程', value: '2' },
	{ label: '乘车积分', value: '3' },
]);
// 页面对应元数据
const dataForm = ref<any>({
	avatar: '',
});

onMounted(() => {
	const data: any = route.query.row;
	dataForm.value = JSON.parse(data);
	dataForm.value.avatar = JSON.parse(data).avatar || 'https://oss.duomixing.com/rls/b/dthd/20240814-110044.png';
	userUnionId.value = dataForm.value.platformId;
});
const handleChange = (tab: any, event: Event) => {
	console.log(tab, event);
};
const toForward = () => {
	activeName.value = '1';
	router.push('/travel/travelData/travelDataManagement/index');
};

// const maskedMobile = (mobile: any) => {
// 	console.log('mobile', mobile);
// 	if (mobile && mobile?.length === 11) {
// 		return mobile.slice(0, 3) + '****' + mobile.slice(7);
// 	}
// 	return mobile;
// };
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
	width: 200px;
	text-align: right;
}
</style>
