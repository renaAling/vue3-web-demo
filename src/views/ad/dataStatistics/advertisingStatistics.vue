<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item label="广告位选择">
						<el-select v-model="state.queryForm.adSpaceCode" placeholder="请选择">
							<el-option :label="item.name" :value="item.code" v-for="(item, index) in advertisingList" :key="index" />
						</el-select>
					</el-form-item>
					<el-form-item label="选择日期">
						<el-date-picker
							v-model="daterangeTime"
							:clearable="false"
							@change="changeTime"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="adSpaceCode"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="adSpaceName" label="广告位名称" />
				<el-table-column prop="pageDesc" label="广告位简介" />
				<el-table-column prop="exposure" label="总PV" />
				<el-table-column prop="view" label="总UV" />
				<el-table-column label="操作" fixed="right" width="240">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleDetail(row, '1')">广告位详细数据</el-button>
						<el-button text type="primary" @click="handleDetail(row, '2')">广告详细数据</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="advertisingSpaceDialog" title="广告位详细数据">
			<el-table
				:data="state1.dataList"
				v-loading="state1.loading"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="statDate" label="统计日期" />
				<el-table-column prop="adSpaceName" label="广告位名称" />
				<el-table-column prop="exposure" label="单日PV" />
				<el-table-column prop="view" label="单日UV" />
			</el-table>
			<pagination @current-change="currentChangeHandle1" @size-change="sizeChangeHandle1" v-bind="state1.pagination" />
		</el-dialog>
		<el-dialog v-model="advertisingDialog" title="广告详细数据">
			<el-table
				:data="state2.dataList"
				v-loading="state2.loading"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="statDate" label="统计日期" />
				<el-table-column prop="adCode" label="广告投放ID/定向推送计划ID" width="200" />
				<el-table-column prop="exposure" label="单日PV" />
				<el-table-column prop="view" label="单日UV" />
			</el-table>
			<pagination @current-change="currentChangeHandle2" @size-change="sizeChangeHandle2" v-bind="state2.pagination" />
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="advertisingStatistics">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { advertSpaceList, adSpaceStatistics, adSpaceData, adData } from '/@/api/ad/advertise';

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};
const advertisingSpaceDialog = ref(false);
const advertisingDialog = ref(false);

const advertisingList = ref();
const getAdvertisingList = async () => {
	const res = await advertSpaceList({ type: 1 });
	advertisingList.value = res.data;
};

// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: adSpaceStatistics,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const state1: BasicTableProps = reactive<BasicTableProps>({
	pageList: adSpaceData,
	queryForm: {},
	dataList: [],
});
const { getDataList: getDataList1, currentChangeHandle: currentChangeHandle1, sizeChangeHandle: sizeChangeHandle1 } = useTable(state1);

const state2: BasicTableProps = reactive<BasicTableProps>({
	pageList: adData,
	queryForm: {},
	dataList: [],
});
const { getDataList: getDataList2, currentChangeHandle: currentChangeHandle2, sizeChangeHandle: sizeChangeHandle2 } = useTable(state2);

const handleDetail = (row: any, type: string) => {
	if (type === '1') {
		state1.dataList = [];
		advertisingSpaceDialog.value = true;
		state1.queryForm.adSpaceCode = row.adSpaceCode;
		getDataList1();
	} else {
		state2.dataList = [];
		advertisingDialog.value = true;
		state2.queryForm.adSpaceCode = row.adSpaceCode;
		getDataList2();
	}
};
// 清空搜索条件
const resetQuery = () => {
	daterangeTime.value = [];
	state.queryForm = {};
	getDataList();
};

onMounted(() => {
	getAdvertisingList();
});
</script>

<style scoped lang="scss"></style>
