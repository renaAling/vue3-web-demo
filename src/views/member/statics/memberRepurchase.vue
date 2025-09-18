<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-row>
						<el-form-item label="时间维度" prop="type" label-width="68px">
							<el-select placeholder="请选择" v-model="state.queryForm.type" style="width: 180px" @change="changeTime">
								<el-option v-for="(item, key) in typeList" :key="key" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="时间" prop="time">
							<el-date-picker
								v-if="state.queryForm.type == 1 || state.queryForm.type == 2"
								v-model="time"
								type="daterange"
								range-separator="-"
								start-placeholder="请选择开始时间"
								end-placeholder="请选择结束时间"
								value-format="YYYY-MM-DD"
								style="width: 380px"
							/>
							<el-date-picker
								v-if="state.queryForm.type == 3"
								v-model="time"
								type="monthrange"
								range-separator="-"
								start-placeholder="请选择开始时间"
								end-placeholder="请选择结束时间"
								value-format="YYYY-MM-DD"
								style="width: 380px"
							/>
						</el-form-item>
						<el-form-item label="所属地区" prop="area">
							<el-select placeholder="请选择" v-model="state.queryForm.area" clearable style="width: 180px">
								<el-option v-for="(item, key) in cityList" :key="key" :label="item" :value="item"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-row class="mb8 flex justify-start items-center">
				<div>
					<el-button type="primary" icon="download" @click="exportExcel"> 导出 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" label="序号" width="100" align="center" />
				<el-table-column label="时间" prop="time" />
				<el-table-column label="所属地区" prop="area" />
				<el-table-column label="消费频次" prop="avgOrdersPerUser" />
				<el-table-column label="平均客单价" prop="avgAmountPerUser" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="memberRepurchase">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { areaListForRebuy, reBuyReportPage } from '/@/api/member/statics';
import { downBlobFile } from '/@/utils/other';

// 搜索变量
const queryRef = ref();
const time = ref([]);
const cityList = ref([]);
const multipleSelection = ref<any[]>([]);
watch(
	() => time.value,
	(val) => {
		if (val?.length > 0) {
			if (state.queryForm.type == 2) {
				console.log('aaaa', val);
				const startDate = new Date(val[0]);
				const endDate = new Date(val[1]);
				const fullWeeks = getCoveredWeeks(startDate, endDate);
				console.log('完整周：', fullWeeks);
				if (fullWeeks.length > 1) {
					state.queryForm.timeStart = fullWeeks[0][0] + ' 00:00:00';
					state.queryForm.timeEnd = fullWeeks[fullWeeks.length - 1][1] + ' 23:59:59';
				} else {
					state.queryForm.timeStart = fullWeeks[0][0] + ' 00:00:00';
					state.queryForm.timeEnd = fullWeeks[0][1] + ' 23:59:59';
				}
			} else {
				state.queryForm.timeStart = val[0] + ' 00:00:00';
				state.queryForm.timeEnd = val[1] + ' 23:59:59';
			}
		} else {
			state.queryForm.timeStart = '';
			state.queryForm.timeEnd = '';
		}
	}
);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: reBuyReportPage,
	queryForm: {
		type: '1',
	},
	dataList: [],
});
const typeList = [
	{
		label: '每天',
		value: '1',
	},
	{
		label: '每周',
		value: '2',
	},
	{
		label: '每月',
		value: '3',
	},
];
onMounted(() => {
	getTree();
});
const changeTime = (val: any) => {
	getTree();
	getDataList();
};
// 获取行政区树形结构数据
const getTree = async () => {
	let res = await areaListForRebuy({ type: state.queryForm.type });
	cityList.value = res.data;
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	time.value = [];
	state.queryForm.timeStart = '';
	state.queryForm.timeEnd = '';
	getDataList();
};
const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val;
};
// 导出
const exportExcel = async () => {
	let ids = '';
	if (multipleSelection.value?.length > 0) {
		console.log('multipleSelection.value', multipleSelection.value);
		ids = multipleSelection.value.map((item: any) => item.id).join(',');
	}
	const params = { ...state.queryForm, ids };
	downBlobFile('/uac/re/buy/report/export', params, '会员复购统计报表.xlsx');
};

const getCoveredWeeks = (startDateStr: any, endDateStr: any) => {
	const weeks = [];

	const startDate = new Date(startDateStr);
	const endDate = new Date(endDateStr);

	// 获取某个日期所在周的周一
	function getMonday(date: any) {
		const day = date.getDay(); // 0=周日，1=周一 ...
		const diff = day === 0 ? -6 : 1 - day; // 调整为周一
		const monday = new Date(date);
		monday.setDate(date.getDate() + diff);
		return monday;
	}

	// 获取某个日期所在周的周日
	function getSunday(date: any) {
		const day = date.getDay(); // 0=周日
		const diff = day === 0 ? 0 : 7 - day; // 如果是周日则不加天数
		const sunday = new Date(date);
		sunday.setDate(date.getDate() + diff);
		return sunday;
	}

	// 第一个周一和最后一个周日
	const firstMonday = getMonday(startDate);
	const lastSunday = getSunday(endDate);

	let currentMonday = new Date(firstMonday);

	while (currentMonday <= lastSunday) {
		const currentSunday = new Date(currentMonday);
		currentSunday.setDate(currentMonday.getDate() + 6);

		weeks.push([formatDate(currentMonday), formatDate(currentSunday)]);

		currentMonday = new Date(currentMonday);
		currentMonday.setDate(currentMonday.getDate() + 7);
	}

	return weeks;
};

// 格式化为 YYYY-MM-DD
const formatDate = (date: any) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};
</script>
<style lang="scss" scoped></style>
