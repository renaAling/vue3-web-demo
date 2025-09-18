<template>
	<div class="profile">
		<div class="tabs-web">
			<el-row :gutter="20">
				<el-col :span="8" class="mb20">
					<div class="flex justify-start items-center text-slate-500">
						<div class="text-left">会员等级:</div>
						<span class="ml-2 text-slate-700" v-if="dataForm.userLevelInfo.level">{{ 'LV' + dataForm.userLevelInfo.level }}</span>
						<span class="ml-2 text-slate-700" v-else>-</span>
					</div>
				</el-col>
				<el-col :span="8" class="mb20">
					<div class="flex justify-start items-center text-slate-500">
						<div class="text-left">会员卡号:</div>
						<span class="ml-2 text-slate-700">{{ dataForm.userLevelInfo.card ? dataForm.userLevelInfo.card : '-' }}</span>
					</div>
				</el-col>
				<el-col :span="8" class="mb20">
					<div class="flex justify-start items-center text-slate-500">
						<div class="text-left">成长值:</div>
						<span class="ml-2 text-slate-700">{{ dataForm.userLevelInfo.totalGrowthValue ? dataForm.userLevelInfo.totalGrowthValue : '-' }}</span>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8" class="mb20">
					<div class="flex justify-start items-center text-slate-500">
						<div class="text-left">会员分组:</div>
						<span class="ml-2 text-slate-700">{{ dataForm.groupNames ? dataForm.groupNames : '-' }}</span>
					</div>
				</el-col>
				<el-col :span="8" class="mb20">
					<div class="flex justify-start text-slate-500">
						<div class="text-left">会员分类:</div>
						<span v-if="dataForm.categoryNames">{{ dataForm.categoryNames }}</span>
						<!-- <div v-if="dataForm.categoryNames.length > 0">
							<span class="ml-4 text-[#1D2129;]" v-for="item in dataForm.categoryNames" :key="item">{{ item }}</span>
						</div> -->
						<span v-else>-</span>
					</div>
				</el-col>
				<el-col :span="8" class="mb20">
					<div class="flex justify-start items-center text-slate-500">
						<div class="text-left">会员标签:</div>
						<span v-if="dataForm.signNames">{{ dataForm.signNames }}</span>
						<!-- <div v-if="dataForm.signNames.length > 0">
							<span class="ml-4 text-[#1D2129;]" v-for="item in dataForm.signNames" :key="item">{{ item }}</span>
						</div> -->
						<span v-else>-</span>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="8" class="mb20">
					<div class="flex justify-start items-center text-slate-500">
						<div class="text-left">是否付费会员:</div>
						<span class="ml-2 text-slate-700">{{ dataForm.userLevelInfo.isPaidMember ? '是' : '否' }}</span>
					</div>
				</el-col>
				<el-col :span="8" class="mb20">
					<div class="flex justify-start items-center text-slate-500">
						<div class="text-left">升级时间:</div>
						<span class="ml-2 text-slate-700">{{ dataForm.userLevelInfo.upgradeTime ? dataForm.userLevelInfo.upgradeTime : '-' }}</span>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="tabs-table">
			<div class="text-[#4785ea] balance">
				积分余额：<span class="text-[#4785ea]">{{ props.score ? props.score : 0 }}</span>
			</div>
			<el-form :model="state.queryForm" ref="queryRef" :inline="true">
				<el-row>
					<el-form-item label="时间" prop="timeData">
						<el-date-picker
							v-model="timeData"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							style="width: 380px"
							@change="changeTime"
						/>
					</el-form-item>
				</el-row>
			</el-form>
			<el-table
				class=""
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				height="200"
			>
				<el-table-column prop="handleTime" label="时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="channelName" label="使用渠道" show-overflow-tooltip></el-table-column>
				<el-table-column prop="eventName" label="事件" show-overflow-tooltip></el-table-column>
				<el-table-column prop="scoreSerialNumber" label="流水号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="changeScore" label="使用积分" show-overflow-tooltip></el-table-column>
				<el-table-column prop="currentScore" label="积分余额" show-overflow-tooltip></el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<div class="tabs-table">
			<div class="text-[#4785ea] balance">
				储值余额：<span class="text-[#4785ea]" v-if="state1DataList?.length">{{ state1DataList[0].amountCurrent }}</span>
				<span class="text-[#4785ea]" v-else> 0</span>
			</div>
			<el-form :model="state1QueryForm" ref="queryRef" :inline="true">
				<el-row>
					<el-form-item label="时间" prop="storedValueTime">
						<el-date-picker
							v-model="storedValueTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							style="width: 380px"
							@change="changeTime1"
						/>
					</el-form-item>
				</el-row>
			</el-form>
			<el-table
				class="px-4"
				:data="state1DataList"
				v-loading="state1.loading"
				row-key="id"
				:cell-style="tableStyle1.cellStyle"
				:header-cell-style="tableStyle1.headerCellStyle"
				height="200"
			>
				<el-table-column prop="usageDate" label="时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="channel" label="使用渠道" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.channel == 1">轨道甄选</span>
						<sapn v-if="row.channel == 2">地铁文创</sapn>
						<span v-if="row.channel == 3">网订店取</span>
						<span v-if="row.channel == 4">到店支付</span>
						<span v-if="row.channel == 5">后台</span>
						<span v-if="row.channel == 6">用户端</span>
					</template>
				</el-table-column>
				<el-table-column prop="event" label="事件" show-overflow-tooltip></el-table-column>
				<el-table-column prop="transactionId" label="流水号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amountChange" label="使用金额	" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amountCurrent" label="储值余额" show-overflow-tooltip></el-table-column>
			</el-table>
			<el-pagination
				background
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="[1, 10, 20, 50, 100, 200]"
				:total="total"
				:page-size="pageSize"
				:current-page="currentPage"
				@size-change="handleSizeChange"
				@current-change="handlePageChange"
			></el-pagination>
			<!-- <pagination @size-change="sizeChangeHandle1" @current-change="currentChangeHandle1" v-bind="state1.pagination" /> -->
		</div>
		<div class="tabs-table">
			<div class="text-[#4785ea]">
				授信余额：<span class="text-[#4785ea]" v-if="state2DataList?.length > 0">{{ state2DataList[0].amountCurrent }}</span>
				<span class="text-[#4785ea]">0</span>
			</div>
			<el-form :model="state2QueryForm" ref="queryRef" :inline="true">
				<el-row>
					<el-form-item label="时间" prop="creditTime">
						<el-date-picker
							v-model="creditTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							style="width: 380px"
							@change="changeTime2"
						/>
					</el-form-item>
				</el-row>
			</el-form>
			<el-table
				class="px-4"
				:data="state2DataList"
				row-key="id"
				:cell-style="tableStyle2.cellStyle"
				:header-cell-style="tableStyle2.headerCellStyle"
				height="200"
			>
				<el-table-column prop="usageDate" label="时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="channel" label="使用渠道" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.channel == 1">轨道甄选</span>
						<sapn v-if="row.channel == 2">地铁文创</sapn>
						<span v-if="row.channel == 3">网订店取</span>
						<span v-if="row.channel == 4">到店支付</span>
						<span v-if="row.channel == 5">后台</span>
						<span v-if="row.channel == 6">用户端</span>
					</template>
				</el-table-column>
				<el-table-column prop="event" label="事件" show-overflow-tooltip></el-table-column>
				<el-table-column prop="transactionId" label="流水号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amountChange" label="使用金额" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amountCurrent" label="授信余额" show-overflow-tooltip></el-table-column>
			</el-table>
			<el-pagination
				background
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="[1, 10, 20, 50, 100, 200]"
				:total="totalState2"
				:page-size="pageSizeState2"
				:current-page="currentPageState2"
				@size-change="handleSizeChangeState2"
				@current-change="handlePageChangeState2"
			></el-pagination>
			<!-- <pagination @size-change="sizeChangeHandle2" @current-change="currentChangeHandle2" v-bind="state2.pagination" /> -->
		</div>
	</div>
</template>

<script lang="ts" name="rechargeForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	getScoreFlowByUnionIdForMember,
	getMemberInfoMemberDetail,
	getMemberUserStoredLogPage,
	getMemberUserCreditLogPage,
} from '/@/api/member/memberManagement/accountManager';
import { useMessage } from '/@/hooks/message';

// const groupNames = ref([]); //基础信息分组
// const signNames = ref([]); //基础信息标签
const dataForm = reactive({
	userLevelInfo: {},
	categoryNames: '',
	groupNames: '',
	score: 0,
	signNames: '',
});
// const score = ref<number>(0);
const timeData = ref<any[]>([]); //积分时间
const storedValueTime = ref<any[]>([]); //储值时间
const creditTime = ref<any[]>([]); // 授信时间

const state1DataList = ref<any[]>([]);
const state2DataList = ref<any[]>([]);
const state1QueryForm = ref<any>({});
const state2QueryForm = ref<any>({});
const total = ref(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const totalState2 = ref(0);
const currentPageState2 = ref<number>(1);
const pageSizeState2 = ref<number>(10);
const props = defineProps<{
	unionId: string;
	score: number;
}>();

onMounted(async () => {
	if (props?.unionId) {
		getDetail(props.unionId);
		state.queryForm.unionId = props.unionId;
		state1QueryForm.value.unionId = props.unionId;
		state2QueryForm.value.unionId = props.unionId;
		getDataList();
		getState1DataList();
		getState2DataList();
		// getDataList();
	}
});

watch(
	() => timeData.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

watch(
	() => storedValueTime.value,
	(val) => {
		if (val?.length > 0) {
			state1QueryForm.value.startTime = val[0] + ' 00:00:00';
			state1QueryForm.value.endTime = val[1] + ' 23:59:59';
		} else {
			state1QueryForm.value.startTime = '';
			state1QueryForm.value.endTime = '';
		}
	}
);

watch(
	() => creditTime.value,
	(val) => {
		if (val?.length > 0) {
			state2QueryForm.value.startTime = val[0] + ' 00:00:00';
			state2QueryForm.value.endTime = val[1] + ' 23:59:59';
		} else {
			state2QueryForm.value.startTime = '';
			state2QueryForm.value.endTime = '';
		}
	}
);

const handleSizeChange = (val: number) => {
	pageSize.value = val;
	getState1DataList();
};

const handlePageChange = (page: number) => {
	currentPage.value = page;
	getState1DataList();
};

const handleSizeChangeState2 = (val: number) => {
	pageSizeState2.value = val;
	getState2DataList();
};

const handlePageChangeState2 = (page: number) => {
	currentPageState2.value = page;
	getState2DataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
	pageList: getScoreFlowByUnionIdForMember,
	dataList: [],
});
const state1: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
	// pageList: getMemberUserStoredLogPage,
	dataList: [],
});
const state2: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
	// pageList: getMemberUserCreditLogPage,
	dataList: [],
});

const getState1DataList = async () => {
	try {
		const { code, data, msg } = await getMemberUserStoredLogPage(state1QueryForm.value);
		if (code === 0) {
			state1DataList.value = data.records;
			total.value = data.total;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const getState2DataList = async () => {
	try {
		const { code, data, msg } = await getMemberUserCreditLogPage(state2QueryForm.value);
		if (code === 0) {
			state2DataList.value = data.records;
			totalState2.value = data.total;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const { tableStyle: tableStyle1 } = useTable(state1);
const { tableStyle: tableStyle2 } = useTable(state2);

const changeTime = (val: string) => {
	state.queryForm.time = val;
	getDataList();
};

const changeTime1 = (val: string) => {
	getState1DataList();
};

const changeTime2 = (val: string) => {
	getState2DataList();
};

const getDetail = async (unionId: string) => {
	try {
		const { code, data, msg } = await getMemberInfoMemberDetail(unionId);
		if (code === 0) {
			// dataForm = data;
			Object.assign(dataForm, data.memberInfo);
			console.log('getDetail', data);
			// queryForm.levelArr = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

defineExpose({
	getDetail,
});
</script>

<style>
.profile {
	overflow: auto;
	height: 100%;
}
.tabs-web {
	background: var(--el-color-white);
	width: 100%;
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	overflow: hidden;
	padding: 20px 10px;
}
.tabs-table {
	background: var(--el-color-white);
	width: 100%;
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	overflow: hidden;
	padding: 10px 10px;
	margin-top: 10px;
}
.text-left {
	width: 90px;
	text-align: left;
}
.balance {
	padding: 10px 0;
}
</style>
