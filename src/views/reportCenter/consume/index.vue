<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="日期" prop="searchTime">
						<el-date-picker
							v-model="searchTime"
							@change="changeSearchTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							style="width: 240px"
							:disabled-date="disabledDate"
						/>
					</el-form-item>
					<el-form-item label="用户类型" prop="userType">
						<el-select v-model="state.queryForm.userType" style="width: 240px" placeholder="请选择" clearable>
							<el-option v-for="item in staffStatus" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="业务类型" prop="businessType">
						<el-select v-model="state.queryForm.businessType" style="width: 240px" placeholder="请选择" clearable>
							<el-option v-for="item in queryForm.levelArr" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<el-form class="flex justify-between mb-[10px]" style="vertical-align: middle">
					<el-form-item label="统计维度" prop="level" style="margin-bottom: 0px" class="mr-10 ml-[10px]">
						<el-radio-group v-model="checkList" class="ml-4" @change="changeCheckList">
							<el-radio v-for="item in statisticsList" :key="item.value" :label="item.label" size="large"></el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column v-if="checkList === '日期' || !isCheckDimension" prop="date" label="日期" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="checkList === '用户类型' || !isCheckDimension" label="用户类型" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.userType === 1">普通用户</span>
						<span v-if="row.userType === 2">员工</span>
					</template>
				</el-table-column>
				<el-table-column v-if="checkList === '业务类型' || !isCheckDimension" prop="businessType" label="业务类型" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.businessType === 0">助农商城</span>
						<span v-if="row.businessType === 1">好店商城</span>
						<span v-if="row.businessType === 2">广告投放</span>
						<span v-if="row.businessType === 3">文创商城</span>
						<span v-if="row.businessType === 4">自有商城</span>
						<span v-if="row.businessType === 5">积分商城</span>
					</template>
				</el-table-column>
				<el-table-column prop="tradeUserNum" label="用户交易数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="tradeNum" label="交易笔数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="tradePrice" label="交易金额" show-overflow-tooltip></el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberConsumeReport } from '../../../api/reportCenter';
const queryRef = ref();
const showSearch = ref(true);
const searchTime = ref<any[]>([]);
const checkList = ref<string>();
const isCheckDimension = ref<boolean>(false);
onMounted(() => {
	// state.queryForm.dateDimension = true;
	// state.queryForm.userTypeDimension = false;
	// state.queryForm.businessTypeDimension = false;
});
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberConsumeReport, // H
	descs: [],
});
interface StateItem {
	value: number;
	label: string;
}
// interface LevelObj {
// 	level: string;
// 	levelName: string;
// 	[str: string]: any;
// }

interface QueryForm {
	stateArr: StateItem[];
	levelArr: StateItem[];
}
const statisticsList = reactive<StateItem[]>([
	{
		value: 1,
		label: '日期',
	},
	{
		value: 2,
		label: '用户类型',
	},
	{
		value: 3,
		label: '业务类型',
	},
]);
watch(
	() => checkList.value,
	() => {
		if (checkList.value === '日期') state.queryForm.dateDimension = true;
		else {
			state.queryForm.dateDimension = false;
			// setDefaultSearchTimeWeek();
		}
		if (checkList.value === '用户类型') state.queryForm.userTypeDimension = true;
		else state.queryForm.userTypeDimension = false;
		if (checkList.value === '业务类型') state.queryForm.businessTypeDimension = true;
		else state.queryForm.businessTypeDimension = false;
		getDataList();
	}
);
watch(
	() => searchTime.value,
	(val) => {
		console.log('val', val);
		if (val) {
			state.queryForm.dateStart = val[0];
			state.queryForm.dateEnd = val[1];
		} else {
			state.queryForm.dateStart = '';
			state.queryForm.dateEnd = '';
		}
	}
);
const changeCheckList = () => {
	if (checkList.value) isCheckDimension.value = true;
	else isCheckDimension.value = false;
};
// 组织可选列表
const queryForm = reactive<QueryForm>({
	stateArr: [
		{
			value: 1,
			label: '正常',
		},
		{
			value: 2,
			label: '冻结',
		},
	],
	levelArr: [
	{
			value: 0,
			label: '助农商城',
		},
		{
			value: 1,
			label: '好店商城',
		},
		{
			value: 2,
			label: '广告投放',
		},
		{
			value: 3,
			label: '文创商城',
		},
		{
			value: 4,
			label: '自有商城',
		},
		{
			value: 5,
			label: '积分商城',
		},
	],
});
const staffStatus = ref([
	{
		value: '1',
		label: '普通用户',
	},
	{
		value: '2',
		label: '员工',
	},
]);

// 页面加载后设置默认日期
onMounted(() => {
	setDefaultSearchTimeWeek();
	state.queryForm.userState = '1';
	// state.queryForm.level = 1;
});
// 禁用今日之后的日期以及超过一个月之前的日期
const disabledDate = (time: any) => {
	const today = new Date(); // 当前日期
	const oneMonthAgo = new Date(); // 一个月前的日期
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

	// 禁用今日之后的日期以及超过一个月之前的日期
	return time.getTime() > today.getTime() || time.getTime() < oneMonthAgo.getTime();
};
// 动态计算最近一周的日期范围
const setDefaultSearchTimeWeek = () => {
	const end = new Date(); // 当前日期
	const start = new Date(); // 开始日期
	start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	searchTime.value = [formatDate(start), formatDate(end)];
	console.log('默认日期', searchTime.value);
	state.queryForm.dateStart = formatDate(start);
	state.queryForm.dateEnd = formatDate(end);
	// getDataList()
};
// 设置默认日期为最近一个月（从一个月前的今天到今天）
const setDefaultSearchTimeMonth = () => {
	const today = new Date(); // 当前日期
	const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 结束日期为今天

	// 开始日期为一个月前的今天
	let startDate = new Date(today);
	startDate.setMonth(startDate.getMonth() - 1);

	// 确保设置的时间是零点，避免时区问题影响显示
	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(0, 0, 0, 0);

	// 设置默认选中的日期范围
	searchTime.value = [formatDate(startDate), formatDate(endDate)];

	// 如果需要同步到其他状态管理中
	state.queryForm.dateStart = formatDate(startDate);
	state.queryForm.dateEnd = formatDate(endDate);
};
const formatDate = (dateString: any) => {
	// 创建一个新的Date对象
	const date = new Date(dateString);

	// 获取年、月、日
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1，并确保是两位数
	const day = String(date.getDate()).padStart(2, '0'); // 确保是两位数

	// 返回格式化后的日期字符串
	return `${year}-${month}-${day}`;
};

const changeSearchTime = (val: any) => {
	if (!val) {
		state.queryForm.dateStart = '';
		state.queryForm.dateEnd = '';
	}
	getDataList();
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	setDefaultSearchTimeWeek();
	checkList.value = '';
	state.queryForm.userState = '1';
	state.queryForm.dateDimension = false;
	state.queryForm.userTypeDimension = false;
	state.queryForm.businessTypeDimension = false;
	isCheckDimension.value = false;
	getDataList();
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
