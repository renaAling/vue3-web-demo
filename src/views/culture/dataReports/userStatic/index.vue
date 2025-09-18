<template>
	<div class="layout-padding">
		<div class="bg-[#fff] p-[10px] overflow-auto">
			<el-row>
				<el-col :span="12" class="text-[16px] font-bold">用户统计报表</el-col>
				<el-col :span="12" class="text-right">
					<el-date-picker
						class="mr-[20px]"
						v-model="daterangeTime"
						:clearable="false"
						@change="changeTime"
						type="daterange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="YYYY-MM-DD"
					/>
					<el-button icon="search" type="primary" @click="getStaticDataList">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-col>
			</el-row>
			<div class="flex justify-between m-[20px]">
				<div class="flex items-center justify-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">用户数</div>
						<div class="text-[24px] font-bold">{{ countObj.totalUserCount }}</div>
					</div>
				</div>
				<div class="flex items-center justify-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">活跃用户数</div>
						<div class="text-[24px] font-bold">{{ countObj.activeUserCount }}</div>
					</div>
				</div>
				<div class="flex items-center justify-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">新增用户数</div>
						<div class="text-[24px] font-bold">{{ countObj.newUserCount }}</div>
					</div>
				</div>
			</div>
			<lineChart :initialData="chartData" />
			<div class="flex justify-between items-center">
				<mapChart class="w-[50%]" :initialData="mapDataList" />
				<el-table
					class="w-[50%]"
					:data="provinceResultInfos"
					border
					:cell-style="{ textAlign: 'center' }"
					:header-cell-style="{
						textAlign: 'center',
						background: 'var(--el-table-row-hover-bg-color)',
						color: 'var(--el-text-color-primary)',
					}"
				>
					<el-table-column type="index" label="序号" width="60" />
					<el-table-column prop="province" label="TOP省份" />
					<el-table-column prop="userCount" label="累计用户数" />
					<el-table-column prop="percentage" label="占比(%)" />
				</el-table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="userStatic">
import dayjs from 'dayjs';
import { userStatisticsApi } from '/@/api/culture/dataReports';
import lineChart from './lineChart.vue';
import mapChart from './mapChart.vue';

import imageUrl from '/@/assets/imgs/tip.png';

const daterangeTime = ref(
	[dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')]
);
const queryForm = reactive({
	startDate: daterangeTime.value[0],
	endDate: daterangeTime.value[1],
});
const changeTime = (val: any) => {
	queryForm.startDate = val[0];
	queryForm.endDate = val[1];
};

const countObj = ref({
	totalUserCount: 0,
	activeUserCount: 0,
	newUserCount: 0,
});
const chartData = ref();
const provinceResultInfos = ref();
const mapDataList = ref();
const getStaticDataList = async () => {
	const params = {
		startDate: queryForm.startDate,
		endDate: queryForm.endDate,
	};
	try {
		const res = await userStatisticsApi(params);
		countObj.value = {
			totalUserCount: res.data.totalUserCount,
			activeUserCount: res.data.activeUserCount,
			newUserCount: res.data.newUserCount,
		};
		const resultInfos = res.data.resultInfos;
		chartData.value = {
			date: resultInfos.map((item: any) => item.date),
			consumeNum: resultInfos.map((item: any) => item.consumeNum),
			totalAmount: resultInfos.map((item: any) => item.totalAmount),
		};
		provinceResultInfos.value = res.data.provinceResultInfos;
		mapDataList.value = provinceResultInfos.value.map((item: any) => {
			return {
				name: item.province,
				value: item.userCount,
			};
		});
	} catch (error) {
		console.error('获取图表数据失败:', error);
	}
};
const handleReset = () => {
	daterangeTime.value = [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')];
	queryForm.startDate = daterangeTime.value[0];
	queryForm.endDate = daterangeTime.value[1];
	getStaticDataList();
};

onMounted(() => {
	getStaticDataList();
});
</script>
