<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer mb-4">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="时间">
						<el-date-picker
							v-model="daterangeTime"
							@change="changeTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button type="primary" @click="handleExport">导出</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="date" label="时间" show-overflow-tooltip />
				<el-table-column prop="exposure" label="PV(页面浏览量)" />
				<el-table-column prop="view" label="UV(独立访客数)" />
				<el-table-column prop="collectNum" label="收藏" />
				<el-table-column prop="shareNum" label="分享" />
				<el-table-column prop="signingNum" label="报名" />
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { dailyStatisticsPageApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';

const route = useRoute();
const router = useRouter();
const stores = travelCommunalData();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		activityCode: route.query.code as string,
	},
	pageList: dailyStatisticsPageApi,
});

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle, downBlobFile } = useTable(state);

onMounted(async () => {
});
// 导出
const handleExport = () => {
	downBlobFile('/note/daily/statistics/export', { ...state.queryForm }, '活动统计导出.xlsx');
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	daterangeTime.value = [];
	state.queryForm = {};
	state.queryForm.activityCode = route.query.code as string;
	getDataList();
};
</script>
