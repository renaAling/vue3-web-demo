<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" v-loading="loading">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item prop="searchTime">
						<date-compents ref="dateRef" @getDate="getDate"></date-compents>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="refreshT">只看今日</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mt-1">
				<el-card style="width: 360px">
					<!-- 总览 -->
					<div class="flex justify-between">
						<div class="text-[20px] font-medium">积分发放总计</div>
						<div class="text-[#165DFF] text-[20px] font-medium">{{ overviews.scoreIncreaseSum || 0 }}</div>
					</div>
				</el-card>
			</el-row>
			<el-scrollbar>
				<el-row class="mt-6">
					<el-card style="width: 360px" class="mb-4 mr-4" v-for="(item, index) in overviews.grantChannelOverviews" :key="index">
						<el-row class="flex items-center justify-between">
							<div class="text-[18px] font-medium w-[212px] text-left">{{ item.channelName }}</div>
							<div class="text-[#165DFF] text-[18px] text-right font-medium">{{ item.channelIncreaseSum }}</div>
						</el-row>
						<el-row class="flex items-center justify-between mb-5 mt-5" v-for="(item1, index1) in item.grantEventOverviews" :key="index1">
							<div class="text-[16px] font-medium text-[#3D3D3D] text-left w-[212px]">{{ item1.eventName }}</div>
							<div class="text-[#165DFF] text-[16px] text-right font-medium">{{ item1.eventIncreaseSum }}</div>
						</el-row>
					</el-card>
				</el-row>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { grantOverviewByToday } from '/@/api/points/manage';

const dateCompents = defineAsyncComponent(() => import('../components/index.vue'));
const dateRef = ref();
// 搜索变量
const queryRef = ref();
const loading = ref(false);
interface overviewsTs {
	grantChannelOverviews?: any[];
	scoreIncreaseSum?: number;
}
const overviews = ref<overviewsTs>({});
const state = reactive({
	queryForm: {
		endTime: '',
		startTime: '',
	},
});

const getDate = (val: string) => {
	[state.queryForm.startTime, state.queryForm.endTime] = val;
	if (state.queryForm.startTime && state.queryForm.endTime) {
		loading.value = true;
		overviews.value = {};
		grantOverviewByToday(state.queryForm)
			.then((res) => {
				overviews.value = res.data;
			})
			.finally(() => {
				loading.value = false;
			});
	}
};

// 初始进入页面
onMounted(() => {
	lockToday();
});

const refreshT = () => {
	dateRef.value.resetField();
	lockToday();
};

const lockToday = () => {
	loading.value = true;
	overviews.value = {};
	grantOverviewByToday()
		.then((res) => {
			overviews.value = res.data;
		})
		.finally(() => {
			loading.value = false;
		});
};
</script>
<style lang="scss" scoped>
.layout-padding {
	height: 100%;
}
</style>
