<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<el-row>
				<el-col :span="12" class="text-[16px] font-bold">订单统计报表</el-col>
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
						<div class="text-[14px] text-[#666]">订单总数</div>
						<div class="text-[24px] font-bold">{{ countObj.orderCount }}</div>
					</div>
				</div>
				<div class="flex items-center justify-start">
					<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">成交金额</div>
						<div class="text-[24px] font-bold">{{ countObj.dealAmount }}</div>
					</div>
				</div>
				<div class="flex items-center justify-start">
					<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">客单价</div>
						<div class="text-[24px] font-bold">{{ countObj.eachAmount }}</div>
					</div>
				</div>
			</div>
			<pieChart :initialData="pieChartData" />
			<lineChart :initialData="lineChartData" />
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="分商品订单统计报表" name="first">
					<el-row class="mb-[10px]">
						<el-col :span="24">
							<el-radio-group v-model="state.queryForm.categoryId" @change="getDataList">
								<el-radio-button :label="a.name" :value="a.id" v-for="(a, i) of goodsCategoryList" :key="i" />
							</el-radio-group>
						</el-col>
					</el-row>
					<el-row class="mb-[10px]">
						<el-col :span="18" class="flex">
							<el-radio-group v-model="state.queryForm.type" @change="getDataList">
								<el-radio-button label="全部" :value="1" />
								<el-radio-button label="近七天" :value="2" />
								<el-radio-button label="近30天" :value="3" />
							</el-radio-group>
							<el-date-picker
								class="mx-[10px]"
								v-model="daterangeTableTime"
								:clearable="false"
								@change="changeTableTime"
								type="daterange"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="YYYY-MM-DD"
							/>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
							<el-button type="primary" icon="Plus" @click="handleExport2">导出</el-button>
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
						<el-table-column label="序号" type="index" width="60" align="center" />
						<el-table-column label="商品主图" prop="image">
							<template #default="scope">
								<el-image class="w-[100px] h-[100px]" :src="scope.row.image" fit="cover" />
							</template>
						</el-table-column>
						<el-table-column label="商品名" prop="name" show-overflow-tooltip />
						<el-table-column label="所属商户" prop="businessName" />
						<el-table-column label="订单总量" prop="orderCount" />
						<el-table-column label="取消订单数" prop="cancelCount" />
						<el-table-column label="完成订单数" prop="doneCount" />
						<el-table-column label="待支付订单数" prop="waitPayCount" />
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="每日订单统计报表" name="second">
					<el-row class="mb-[10px]">
						<el-col :span="12">
							<el-button type="primary" icon="Plus" @click="handleExport">导出</el-button>
						</el-col>
						<el-col :span="12" class="text-right">
							<el-date-picker
								class="mr-[10px]"
								v-model="daterangeTableTime"
								:clearable="false"
								@change="changeTableTime"
								type="daterange"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="YYYY-MM-DD"
							/>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
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
						<el-table-column label="序号" type="index" width="60" align="center" />
						<el-table-column label="订单总数" prop="orderCount" show-overflow-tooltip />
						<el-table-column label="成交金额" prop="dealAmount" />
						<el-table-column label="客单价" prop="eachAmount" />
						<el-table-column label="取消订单数" prop="cancelCount" />
						<el-table-column label="完成订单数" prop="doneCount" />
						<el-table-column label="待支付订单数" prop="waitPayCount" />
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts" name="productsStatic">
import dayjs from 'dayjs';
import type { TabsPaneContext } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { orderStatisticsApi, orderReportApi, orderGoodsReportApi, goodsCategoryApi } from '/@/api/culture/dataReports';
import pieChart from './pieChart.vue';
import lineChart from './lineChart.vue';
import imageUrl from '/@/assets/imgs/tip.png';

const daterangeTime = ref([dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')]);
const queryForm = reactive({
	startDate: daterangeTime.value[0],
	endDate: daterangeTime.value[1],
});
const changeTime = (val: any) => {
	queryForm.startDate = val[0];
	queryForm.endDate = val[1];
};

const countObj = ref({
	orderCount: 0,
	dealAmount: 0,
	eachAmount: 0,
});
const pieChartData = ref();
const lineChartData = ref();
const getStaticDataList = async () => {
	const params = {
		startDate: queryForm.startDate,
		endDate: queryForm.endDate,
	};
	try {
		const res = await orderStatisticsApi(params);
		countObj.value = {
			orderCount: res.data.orderCount,
			dealAmount: res.data.dealAmount,
			eachAmount: res.data.eachAmount,
		};
		pieChartData.value = {
			cancel: res.data.cancel,
			done: res.data.done,
			waitPay: res.data.waitPay,
		};
		const resultInfos = res.data?.resultInfos || {};
		lineChartData.value = {
			hour: resultInfos.map((item: any) => `${item.hour}:00`),
			orderCount: resultInfos.map((item: any) => item.orderCount),
			paidCount: resultInfos.map((item: any) => item.paidCount),
			cancelCount: resultInfos.map((item: any) => item.cancelCount),
			afterSaleCount: resultInfos.map((item: any) => item.afterSaleCount),
		};
	} catch (error) {
		console.error('获取图表数据失败:', error);
	}
};
const daterangeTableTime = ref();
const changeTableTime = (val: any) => {
	state.queryForm.startDate = val[0];
	state.queryForm.endDate = val[1];
};

const handleExport = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/tracomps-admin/api/admin/platform/statistics/order/report/export', params, '每日订单统计报表.xlsx');
};

const handleExport2 = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/tracomps-admin/api/admin/platform/statistics/order/goods/report/export', params, '分商品订单统计报表.xlsx');
};

const activeName = ref('first');
const handleClick = (tab: TabsPaneContext) => {
	state.queryForm = {};
	state.queryForm.type = 1;
	daterangeTableTime.value = [];
	if (tab.props.name === 'first') {
		state.pageList = orderGoodsReportApi;
	} else {
		state.pageList = orderReportApi;
	}
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: orderGoodsReportApi,
	queryForm: {
		type: 1,
	},
	dataList: [],
	isPage: false,
});
const resetQuery = () => {
	state.queryForm = {};
	state.queryForm.type = 1; // 全部
	daterangeTableTime.value = [];
	getDataList();
};
const goodsCategoryList = ref();
const getGoodsCategory = async () => {
	const res = await goodsCategoryApi({});
	goodsCategoryList.value = res.data;
};
const handleReset = () => {
	daterangeTime.value = [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')];
	queryForm.startDate = daterangeTime.value[0];
	queryForm.endDate = daterangeTime.value[1];
	getStaticDataList();
};

onMounted(() => {
	getGoodsCategory();
	getStaticDataList();
});
const { getDataList, downBlobFile, tableStyle } = useTable(state);
</script>
