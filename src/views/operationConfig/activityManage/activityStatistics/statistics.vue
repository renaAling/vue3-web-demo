<template>
	<div class="layout-padding">
		<!-- 访问行为 -->
		<el-card class="custom-card">
			<div class="title">访问行为</div>
			<el-row>
				<el-form :inline="true" :model="accessBehaviorState.queryForm" ref="accessBehaviorQueryRef">
					<el-form-item label="统计周期：" prop="accessBehaviorTime">
						<el-date-picker
							v-model="accessBehaviorTime"
							type="datetimerange"
							style="width: 380px"
							range-separator="-"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getAccessBehaviorList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetAccessBehaviorQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="accessBehaviorState.dataList"
				v-loading="accessBehaviorState.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="访问来源" prop="eventCode" width="130" />
				<el-table-column label="UV" prop="uniqueVisitor" />
				<el-table-column label="PV" prop="pageView" />
			</el-table>
		</el-card>
		<!-- 参与统计 -->
		<el-card class="custom-card">
			<div class="title">参与统计</div>
			<el-row>
				<el-form :inline="true" :model="involvedState.queryForm" ref="involvedQueryRef">
					<el-form-item label="统计周期：" prop="involvedTime">
						<el-date-picker
							v-model="involvedTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							style="width: 380px"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getInvolvedList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetInvolvedQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="involvedState.dataList"
				v-loading="involvedState.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="抽奖次数发放" prop="totalDistributeNum" width="130" />
				<el-table-column label="参与人数" prop="totalUserNum" />
				<el-table-column label="单用户最多获得" prop="maxDistributeNum" />
				<el-table-column label="人均获得次数" prop="averageDistributeNum" />
			</el-table>
		</el-card>
		<!-- 抽奖统计 -->
		<el-card class="custom-card">
			<div class="title">抽奖统计</div>
			<el-row>
				<el-form :inline="true" :model="involvedState.queryForm" ref="lotteryQueryRef">
					<el-form-item label="统计周期：" prop="lotteryStatisticsTime">
						<el-date-picker
							v-model="lotteryStatisticsTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							style="width: 380px"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getLotteryStatisticsList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetLotteryStatisticsQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="lotteryStatisticsState.dataList"
				v-loading="lotteryStatisticsState.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="总抽奖次数" prop="totalLotteryNum" width="130" />
				<el-table-column label="总抽奖人数" prop="totalUserNum" />
				<el-table-column label="单用户最多抽奖" prop="maxLotteryNum" />
				<el-table-column label="总中奖次数" prop="totalWinNum" />
				<el-table-column label="总中奖人数" prop="totalWinner" />
			</el-table>
		</el-card>
		<!-- 奖品信息统计 -->
		<el-card class="custom-card">
			<div class="title">奖品信息统计</div>
			<el-row>
				<el-form :inline="true" :model="prizeInfoState.queryForm" ref="prizeInfoQueryRef">
					<el-form-item label="统计周期：" prop="prizeInfoTime">
						<el-date-picker
							v-model="prizeInfoTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							style="width: 380px"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getPrizeInfoList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetPrizeInfoQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="prizeInfoState.dataList"
				v-loading="prizeInfoState.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="奖品名称" prop="prizeName" width="130" />
				<el-table-column label="奖品总数" prop="totalNum" />
				<el-table-column label="每日投放数量" prop="dayNum" />
				<el-table-column label="已抽取数量" prop="currentNum" />
				<el-table-column label="实际中奖概率" prop="actuallyOdds" />
			</el-table>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox } from '/@/hooks/message';
import {
	getAccessStatistics,
	getLotteryNumLogStatistics,
	getLotteryUserInfoStatistics,
	getLotteryAwardStatistics,
} from '/@/api/operationConfig/lotteryManage';
const route = useRoute();
const router = useRouter();
const accessBehaviorQueryRef = ref();
const involvedQueryRef = ref();
const lotteryQueryRef = ref();
const prizeInfoQueryRef = ref();

/**
 * 访问行为列表相关逻辑
 */
const accessBehaviorTime = ref([]);
const accessBehaviorState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		activityCode: route.query.activityCode,
	},
	dataList: [],
	loading: false,
});
const getAccessBehaviorList = async () => {
	try {
		accessBehaviorState.loading = true;
		let params = {
			activityCode: route.query.activityCode,
			startTime: accessBehaviorTime.value && accessBehaviorTime.value.length > 0 ? accessBehaviorTime.value[0] : '',
			endTime: accessBehaviorTime.value && accessBehaviorTime.value.length > 0 ? accessBehaviorTime.value[1] : '',
		};
		let res = await getAccessStatistics(params);
		accessBehaviorState.loading = false;
		accessBehaviorState.dataList = res.data;
	} catch (err) {
		accessBehaviorState.loading = false;
		console.log('err', err);
	}
};
const resetAccessBehaviorQuery = () => {
	accessBehaviorQueryRef.value.resetFields();
	accessBehaviorTime.value = [];
	getAccessBehaviorList();
};

/**
 * 参与统计列表相关逻辑
 */
const involvedTime = ref([]);
const involvedState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		activityCode: route.query.activityCode,
	},
	dataList: [],
	loading: false,
});
const getInvolvedList = async () => {
	try {
		involvedState.loading = true;
		let params = {
			activityCode: route.query.activityCode,
			startTime: involvedTime.value && involvedTime.value.length > 0 ? involvedTime.value[0] : '',
			endTime: involvedTime.value && involvedTime.value.length > 0 ? involvedTime.value[1] : '',
		};
		let res = await getLotteryNumLogStatistics(params);
		involvedState.loading = false;
		involvedState.dataList = res.data;
	} catch (err) {
		involvedState.loading = false;
		console.log('err', err);
	}
};
const resetInvolvedQuery = () => {
	involvedQueryRef.value.resetFields();
	involvedTime.value = [];
	getInvolvedList();
};

/**
 * 抽奖统计列表相关逻辑
 */
const lotteryStatisticsTime = ref([]);
const lotteryStatisticsState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		activityCode: route.query.activityCode,
	},
	dataList: [],
	loading: false,
});
const getLotteryStatisticsList = async () => {
	try {
		lotteryStatisticsState.loading = true;
		let params = {
			activityCode: route.query.activityCode,
			startTime: lotteryStatisticsTime.value && lotteryStatisticsTime.value.length > 0 ? lotteryStatisticsTime.value[0] : '',
			endTime: lotteryStatisticsTime.value && lotteryStatisticsTime.value.length > 0 ? lotteryStatisticsTime.value[1] : '',
		};
		let res = await getLotteryUserInfoStatistics(params);
		lotteryStatisticsState.loading = false;
		lotteryStatisticsState.dataList = res.data;
	} catch (err) {
		lotteryStatisticsState.loading = false;
		console.log('err', err);
	}
};
const resetLotteryStatisticsQuery = () => {
	involvedQueryRef.value.resetFields();
	lotteryStatisticsTime.value = [];
	getLotteryStatisticsList();
};

/**
 * 奖品信息统计列表相关逻辑
 */
const prizeInfoTime = ref([]);
const prizeInfoState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		activityCode: route.query.activityCode,
	},
	dataList: [],
	loading: false,
});
const getPrizeInfoList = async () => {
	try {
		prizeInfoState.loading = true;
		let params = {
			activityCode: route.query.activityCode,
			startTime: prizeInfoTime.value && prizeInfoTime.value.length > 0 ? prizeInfoTime.value[0] : '',
			endTime: prizeInfoTime.value && prizeInfoTime.value.length > 0 ? prizeInfoTime.value[1] : '',
		};
		let res = await getLotteryAwardStatistics(params);
		prizeInfoState.loading = false;
		prizeInfoState.dataList = res.data;
	} catch (err) {
		prizeInfoState.loading = false;
		console.log('err', err);
	}
};
const resetPrizeInfoQuery = () => {
	prizeInfoQueryRef.value.resetFields();
	prizeInfoTime.value = [];
	getPrizeInfoList();
};

//  table hook
const { tableStyle } = useTable(accessBehaviorState);
onMounted(() => {
	getAccessBehaviorList();
	getInvolvedList();
	getLotteryStatisticsList();
	getPrizeInfoList();
});
</script>
<style lang="scss" scoped>
.layout-padding {
	height: auto;
	.custom-card {
		overflow-y: scroll;
		margin-bottom: 10px;
		.title {
			font-size: 24px;
			font-weight: bold;
			margin-bottom: 10px;
		}
		&:nth-child(1) {
			max-height: 500px;
		}
		&:nth-child(2) {
			max-height: 220px;
		}
		&:nth-child(3) {
			max-height: 220px;
		}
		&:nth-child(4) {
			max-height: 500px;
		}
	}
}
</style>
