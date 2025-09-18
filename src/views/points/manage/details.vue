<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<!-- <el-icon :size="24" @click="router.go(-1)" class="back-icon"><Back /></el-icon> -->
			<el-icon :size="24" @click="toForward" class="back-icon">
				<Back />
			</el-icon>
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="日期" prop="userId">
						<el-date-picker v-model="searchTime" @change="changeSearchTime" type="datetimerange"
							range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
							:default-time="[new Date(2000, 1, 1, 0, 0, 0),new Date(2000, 2, 1, 23, 59, 59)]"
							value-format="YYYY-MM-DD HH:mm:ss" style="width: 270px" :disabled-date="disabledDate" />
					</el-form-item>
					<el-form-item label="订单号" prop="businessNumber">
						<el-input placeholder="请输入订单号" style="width: 180px" v-model="state.queryForm.businessNumber" />
					</el-form-item>
					<el-form-item label="类型" prop="eventType">
						<el-select v-model="state.queryForm.eventType" clearable style="width: 180px">
							<el-option v-for="(item, key) in searchFieldType" :key="key" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8 flex justify-between items-center">
				<div class="text-[#4785ea]">
					当前积分：<span class="text-[#4785ea]" v-if="state.dataList?.length">{{ state.dataList[0].score }}</span>
					分
				</div>
				<div>
					<el-button type="primary" @click="exportExcel"> 导出 </el-button>
				</div>
			</el-row>
			<el-table :data="state.dataList" v-loading="state.loading" row-key="id" border 
				:cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column label="用户id" prop="unionId" />
				<el-table-column label="用户名称" prop="userName" />
				<el-table-column label="手机号" prop="mobile" />
				<el-table-column label="积分" prop="changeScore" />
				<el-table-column label="订单号" prop="businessNumber" />
				<el-table-column label="类型" prop="changeTypeName" />
				<el-table-column label="使用日期" prop="handleTime" />
				<el-table-column label="备注" prop="remark" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
				v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { accountDetailList, exportAccountDetail } from '/@/api/points/manage';
import { BasicTableProps, useTable } from '/@/hooks/table';

// 搜索变量
// const route = useRoute();
const router = useRouter();
// const { query } = route;
const queryRef = ref();
const searchTime = ref([]);
const searchFieldType = ref([
	{ value: '1', label: '积分发放' },
	{ value: '2', label: '积分使用' },
	{ value: '3', label: '退款发放' },
	{ value: '4', label: '退款扣减' },
	{ value: '5', label: '积分过期' },
]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: accountDetailList,
	queryForm: {},
	dataList: [],
});

const show = (id: string) => {
	state.queryForm.unionId = id;
	getDataList();
}

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const emit = defineEmits(['changeType'])
const toForward = () => {
	queryRef.value.resetFields();
	searchTime.value = []
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	emit('changeType')
}

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = []
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
// 导出
const exportExcel = () => {
	exportAccountDetail(state.queryForm).then(() => {
		router.push({ path: '/downloadCenter' });
	});
};

const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};

watch(
	() => searchTime.value,
	(val) => {
		if (val) {
			state.queryForm.startTime = val[0];
			state.queryForm.endTime = val[1];
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

const changeSearchTime = (val: any) => {
	if (!val) {
		state.queryForm.startTime = '';
		state.queryForm.endTime = '';
	}
};
defineExpose({
	show
})
</script>
<style lang="scss" scoped>
.back-icon {
	border: 1px solid #433e3ea3;
	padding: 1px;
	cursor: pointer;
	margin-bottom: 5px;
	color: #433e3ea3;
}
</style>
