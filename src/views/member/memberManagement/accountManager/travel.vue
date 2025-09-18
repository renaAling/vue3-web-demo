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
				<el-form-item label="状态" prop="unionId">
					<el-select @change="changeStatus" v-model="state.queryForm.level" style="width: 220px" placeholder="选择状态" clearable>
						<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-row>
		</el-form>
		<el-table
			:data="state.dataList"
			v-loading="state.loading"
			row-key="id"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			height="200"
		>
			<el-table-column prop="inTradeTime" label="时间" show-overflow-tooltip></el-table-column>
			<el-table-column prop="inStationName" label="进站" shinStationNameow-overflow-tooltip></el-table-column>
			<el-table-column prop="outStationName" label="出站" shinStationNameow-overflow-tooltip></el-table-column>
			<el-table-column prop="orderType" label="状态" show-overflow-tooltip>
				<template #default="{ row }">
					<el-tag v-if="row.orderType == '00'">正常</el-tag>
					<el-tag v-if="row.orderType == '01'">强制扣费</el-tag>
					<el-tag v-if="row.orderType == '02'">撤销</el-tag>
					<el-tag v-if="row.orderType == '03'">补登</el-tag>
					<el-tag v-if="row.orderType == '04'">退款</el-tag>
					<el-tag v-if="row.orderType == '08'">混匹正常扣费</el-tag>
					<el-tag v-if="row.orderType == '09'">混匹无需扣费</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="totalAmount" label="金额" show-overflow-tooltip></el-table-column>
		</el-table>
		<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
	</div>
</template>

<script lang="ts" name="rechargeForm" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getTripRecordForMember } from '/@/api/member/memberManagement/accountManager';
import { useMessage } from '/@/hooks/message';

const props = defineProps<{
	unionId: string;
}>();
const queryRef = ref();
const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};
const statusList = ref([
	{ value: '00', label: '正常' },
	{ value: '01', label: '强制扣费' },
	{ value: '02', label: '撤销' },
	{ value: '03', label: '补登' },
	{ value: '04', label: '退款' },
	{ value: '08', label: '混匹正常扣费' },
	{ value: '09', label: '混匹无需扣费' },
]);
const timeData = ref<any[]>([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { unionId: '' },
	dataList: [],
	pageList: getTripRecordForMember,
});

const { tableStyle, sizeChangeHandle, currentChangeHandle, getDataList } = useTable(state);

onMounted(() => {
	state.queryForm.unionId = props.unionId;
});

watch(
	() => timeData.value,
	(val) => {
		if (val) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);
// 清空搜索条件
const resetQuery = () => {
	console.log('state', state.queryForm);
	queryRef.value.resetFields();
	getDataList();
};
// const getList = async (unionId: string) => {};
// const changeTime = () => {
// 	getDataList();
// };
const changeStatus = () => {
	getDataList();
};

defineExpose({
	// getList,
});
</script>
<style lang="scss" scoped>
.travel {
	background: var(--el-color-white);
	border-radius: 4px;
	border: 1px solid var(--el-border-color-light, #ebeef5);
	padding: 10px;
}
</style>
