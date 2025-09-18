<template>
	<div class="travel">
		<el-form :model="state.queryForm" ref="queryRef" :inline="true">
			<el-row>
				<el-form-item label="时间" prop="time">
					<el-date-picker
						v-model="timeData"
						type="daterange"
						range-separator="-"
						:disabled-date="disabledDate"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						value-format="YYYY-MM-DD"
					/>
				</el-form-item>
				<el-form-item>
					<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-row>
		</el-form>
		<div class="mb-5">积分总余额：{{ currentScore || 0 }}</div>
		<el-table
			:data="dataList"
			v-loading="loading"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			height="300"
		>
			<el-table-column type="index" label="序号" width="60" show-overflow-tooltip></el-table-column>
			<el-table-column prop="handleTime" label="发放时间" show-overflow-tooltip></el-table-column>
			<el-table-column prop="changeScore" label="发放积分" shinStationNameow-overflow-tooltip></el-table-column>
			<el-table-column prop="channelName" label="发放渠道" shinStationNameow-overflow-tooltip></el-table-column>
			<el-table-column prop="eventName" label="事件" shinStationNameow-overflow-tooltip></el-table-column>
			<el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
		</el-table>
		<el-pagination
			background
			layout="total, sizes, prev, pager, next, jumper"
			:page-sizes="[10, 20, 50, 100, 200]"
			:total="total"
			:page-size="pageSize"
			:current-page="currentPage"
			@size-change="handleSizeChange"
			@current-change="handlePageChange"
		></el-pagination>
		<!-- <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" /> -->
	</div>
</template>

<script lang="ts" name="rechargeForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getScoreFlowForRideApi } from '/@/api/travel/personalInformation';

const props = defineProps<{
	unionId: string;
}>();
const queryRef = ref();
const dataList = ref<any[]>([]);
const loading = ref<boolean>(false);
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const currentScore = ref<number>(0);
const timeData = ref<any[]>([]);
const queryForm = ref<any>({
	unionId: '',
	startTime: '',
	endTime: '',
});
const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
	dataList: [],
});

const { tableStyle } = useTable(state);

onMounted(() => {
	queryForm.value.unionId = props.unionId;
	getDataList();
});

watch(
	() => timeData.value,
	(val) => {
		if (val.length > 0) {
			queryForm.value.startTime = val[0] + ' 00:00:00';
			queryForm.value.endTime = val[1] + ' 23:59:59';
		} else {
			queryForm.value.startTime = '';
			queryForm.value.endTime = '';
		}
	}
);

const getDataList = async () => {
	const params = {
		...queryForm.value,
		pageNum: currentPage.value,
		pageSize: pageSize.value,
	};
	const res = await getScoreFlowForRideApi(params);
	currentScore.value = res.data.currentScore || 0;
	dataList.value = res.data.page.records;
	total.value = res.data.page.total;
};
// 清空搜索条件
const resetQuery = () => {
	timeData.value = [];
	queryRef.value.resetFields();
	queryForm.value.startTime = '';
	queryForm.value.endTime = '';
	getDataList();
};

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getDataList();
};
const handlePageChange = (page: number) => {
	currentPage.value = page;
	getDataList();
};
</script>
<style lang="scss" scoped>
.travel {
	background: var(--el-color-white);
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	padding: 10px;
}
</style>
