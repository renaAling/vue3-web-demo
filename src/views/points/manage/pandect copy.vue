<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item prop="searchTime">
						<el-date-picker
							v-model="state.queryForm.searchTime"
							value-format="YYYY-MM-DD"
							style="width: 280px"
							type="date"
							placeholder="开始时间"
							:disabled-date="disabledDate"
							@change="handleChange"
						/>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="refreshT">只看今日</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-card style="max-width: 540px" v-loading="loading">
				<!-- 总览 -->
				<div>
					<div class="text-[20px] font-medium">积分存量池总览</div>
					<div class="text-[#165DFF] text-[20px] font-medium mt-[8px]">{{ pandectInfo.scoreStock || 0 }}</div>
				</div>
				<el-row class="mt-[30px]">
					<el-col :span="8">
						<div class="text-[18px] font-medium">积分已发放</div>
						<div class="text-[#165DFF] text-[18px] font-medium mt-[8px]">{{ pandectInfo.scoreIncreaseSum || 0 }}</div>
					</el-col>
					<el-col :span="8">
						<div class="text-[18px] font-medium">积分已使用</div>
						<div class="text-[#165DFF] text-[18px] font-medium mt-[8px]">{{ pandectInfo.scoreDeductionSum || 0 }}</div>
					</el-col>
					<el-col :span="8">
						<div class="text-[18px] font-medium">积分已过期</div>
						<div class="text-[#165DFF] text-[18px] font-medium mt-[8px]">{{ pandectInfo.scoreExpiredSum || 0 }}</div>
					</el-col>
				</el-row>
			</el-card>
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { dataOverview, dataOverviewByToday } from '/@/api/points/manage';

// 搜索变量
const queryRef = ref();
const loading = ref(false);
const state = reactive({
	queryForm: {
		searchTime: '',
	},
});
interface infoTs {
	scoreStock?: number | string;
	scoreIncreaseSum?: number | string;
	scoreDeductionSum?: number | string;
	scoreExpiredSum?: number | string;
}
const pandectInfo = ref<infoTs>({});
const disabledDate = computed(() => {
	return (time: any) => {
		return time.getTime() > Date.now() - 86400000;
	};
});

const refreshT = () => {
	queryRef.value.resetFields();
	lockToday();
};

const handleChange = () => {
	loading.value = true;
	pandectInfo.value = {};
	dataOverview({ date: state.queryForm.searchTime })
		.then((res) => {
			pandectInfo.value = res.data;
		})
		.finally(() => {
			loading.value = false;
		});
};
// 初始进入页面
onMounted(() => {
	lockToday();
});

// 只看今日
const lockToday = () => {
	loading.value = true;
	pandectInfo.value = {};
	dataOverviewByToday()
		.then((res) => {
			pandectInfo.value = res.data;
		})
		.finally(() => {
			loading.value = false;
		});
};
</script>
<style lang="scss" scoped></style>
