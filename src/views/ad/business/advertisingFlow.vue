<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto;">
			<el-row>
				<el-col :span="24">
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
			<el-row class="my-[20px]">
				<el-col :span="6" class="flex items-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="contain" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">总曝光量</div>
						<div class="text-[24px] font-bold">{{ countObj.totalExposure }}</div>
					</div>
				</el-col>
				<el-col :span="6" class="flex items-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="contain" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">总点击量</div>
						<div class="text-[24px] font-bold">{{ countObj.totalClick }}</div>
					</div>
				</el-col>
				<el-col :span="6" class="flex items-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="contain" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">总浏览人数</div>
						<div class="text-[24px] font-bold">{{ countObj.totalView }}</div>
					</div>
				</el-col>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="广告位名称" prop="adSpaceName" />
				<el-table-column label="广告位简介" prop="pageDesc" show-overflow-tooltip />
				<el-table-column label="总曝光量" prop="exposure" />
				<el-table-column label="总点击量" prop="click" />
				<el-table-column label="总浏览人数" prop="view" />
			</el-table>
		</div>
	</div>
</template>

<script setup lang="ts" name="advertisingFlow">
import dayjs from 'dayjs';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { homeStatistics } from '/@/api/ad/advertise';
import imageUrl from '/@/assets/imgs/tip.png';

const daterangeTime = ref([dayjs().startOf('month').format('YYYY-MM-DD 00:00:00'), dayjs().endOf('month').format('YYYY-MM-DD 23:59:59')]);
const queryForm = reactive({
	startTime: daterangeTime.value[0],
	endTime: daterangeTime.value[1],
});
const changeTime = (val: any) => {
	queryForm.startTime = `${val[0]} 00:00:00`;
	queryForm.endTime = `${val[1]} 23:59:59`;
};

const countObj = ref({
	totalExposure: 0,
	totalClick: 0,
	totalView: 0,
});
const getStaticDataList = async () => {
  state.loading = true;
	const params = {
		startTime: queryForm.startTime,
		endTime: queryForm.endTime,
	};
	try {
		const res = await homeStatistics(params);
		countObj.value = {
			totalExposure: res.data?.totalExposure || 0,
			totalClick: res.data?.totalClick || 0,
			totalView: res.data?.totalView || 0,
		};
    state.dataList = res.data?.adSpaceStatistics;
    state.loading = false;
	} catch (error) {
    state.loading = false;
		console.error('获取数据失败:', error);
	}
};
const state: BasicTableProps = reactive<BasicTableProps>({
	dataList: [],
});
const handleReset = () => {
	daterangeTime.value = [dayjs().startOf('month').format('YYYY-MM-DD 00:00:00'), dayjs().endOf('month').format('YYYY-MM-DD 23:59:59')];
	queryForm.startTime = daterangeTime.value[0];
	queryForm.endTime = daterangeTime.value[1];
	getStaticDataList();
};

onMounted(() => {
	getStaticDataList();
});
const { tableStyle } = useTable(state);
</script>
