<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<el-row>
				<el-col :span="12" class="text-[16px] font-bold">商品统计报表</el-col>
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
						<div class="text-[14px] text-[#666]">商品销量（件）</div>
						<div class="text-[24px] font-bold">{{ countObj.salesCount }}</div>
					</div>
				</div>
				<div class="flex items-center justify-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">销售额（万元）</div>
						<div class="text-[24px] font-bold">{{ countObj.salesAmount }}</div>
					</div>
				</div>
				<div class="flex items-center justify-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">库存周转率（%）</div>
						<div class="text-[24px] font-bold">{{ countObj.inventoryTurnover }}</div>
					</div>
				</div>
				<div class="flex items-center justify-center">
					<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
					<div class="ml-[20px]">
						<div class="text-[14px] text-[#666]">好评率（%）</div>
						<div class="text-[24px] font-bold">{{ countObj.praiseRate }}</div>
					</div>
				</div>
			</div>
			<lineChart :initialData="chartData" />
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) of tabsList" :key="index">
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
							<el-button type="primary" icon="Plus" @click="handleExport">导出</el-button>
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
						<el-table-column label="零售价" prop="price" />
						<el-table-column label="库存" prop="stock" />
						<el-table-column label="供应商" prop="merchantName" />
						<el-table-column label="销量" prop="salesCount" />
						<el-table-column label="销售额" prop="salesAmount" />
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts" name="productsStatic">
import dayjs from 'dayjs';
import type { TabsPaneContext } from 'element-plus';
import { downBlobFile } from '/@/utils/other';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { goodsStatisticsApi, goodsSalesStatisticsApi, goodsCategoryApi } from '/@/api/culture/dataReports';
import lineChart from './lineChart.vue';

import imageUrl from '/@/assets/imgs/tip.png';

const tabsList = [
	{
		label: '畅销商品排行',
		name: 'first',
	},
	{
		label: '滞销商品排行',
		name: 'second',
	},
];

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
const daterangeTableTime = ref();
const changeTableTime = (val: any) => {
	state.queryForm.startDate = val[0];
	state.queryForm.endDate = val[0];
};

const handleExport = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/tracomps-admin/api/admin/platform/statistics/goodsSalesExport', params, '商品统计报表.xlsx');
};

const activeName = ref('first');
const handleClick = (tab: TabsPaneContext) => {
	if (tab.props.name === 'first') {
		state.queryForm.sortType = 1;
	} else {
		state.queryForm.sortType = 2;
	}
	getDataList();
};

const countObj = ref({
	salesCount: 0,
	salesAmount: 0,
	inventoryTurnover: 0,
	praiseRate: 0,
});
const chartData = ref();
const getStaticDataList = async () => {
	const params = {
		startDate: queryForm.startDate,
		endDate: queryForm.endDate,
	};
	try {
		const res = await goodsStatisticsApi(params);
		countObj.value = {
			salesCount: res.data.salesCount,
			salesAmount: res.data.salesAmount,
			inventoryTurnover: res.data.inventoryTurnover,
			praiseRate: res.data.praiseRate,
		};
		const resultInfos = res.data.resultInfos;
		chartData.value = {
			date: resultInfos.map((item: any) => item.date),
			sales: resultInfos.map((item: any) => item.sales),
			amount: resultInfos.map((item: any) => item.amount),
			inventoryTurnover: resultInfos.map((item: any) => item.inventoryTurnover),
			praiseRate: resultInfos.map((item: any) => item.praiseRate),
		};
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
const goodsCategoryList = ref();
const getGoodsCategory = async () => {
	const res = await goodsCategoryApi({});
	goodsCategoryList.value = res.data;
};

onMounted(() => {
	getStaticDataList();
	getGoodsCategory();
});

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: goodsSalesStatisticsApi,
	queryForm: {
		sortType: 1, // 1-畅销排行榜，2-滞销排行榜
		type: 1, // 1-全部 2-近七天 3-近30天
	},
	dataList: [],
	isPage: false,
});
const resetQuery = () => {
	state.queryForm.type = 1;
	state.queryForm.startDate = '';
	state.queryForm.endDate = '';
	state.queryForm.categoryId = '';
	daterangeTableTime.value = [];
	getDataList();
};
const { getDataList, tableStyle } = useTable(state);
</script>
