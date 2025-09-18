<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-row>
						<el-form-item label="时间维度" prop="timeType" label-width="68px">
							<el-select placeholder="请选择" v-model="state.queryForm.timeType" style="width: 180px" @change="timeTypeChange">
								<el-option v-for="(item, key) in typeList" :key="key" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="时间" prop="time">
							<el-date-picker
								v-if="state.queryForm.timeType == 1"
								v-model="time"
								type="daterange"
								range-separator="-"
								start-placeholder="请选择开始时间"
								end-placeholder="请选择结束时间"
								value-format="YYYY-MM-DD"
								style="width: 380px"
							/>
							<el-date-picker
								v-if="state.queryForm.timeType == 2"
								v-model="time"
								type="monthrange"
								range-separator="-"
								start-placeholder="请选择开始时间"
								end-placeholder="请选择结束时间"
								value-format="YYYY-MM-DD"
								style="width: 380px"
							/>
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
				<el-table-column label="时间" prop="reportDate">
					<template #default="{ row }">
						<span v-if="state.queryForm.timeType == 1" type="primary">{{ row.reportDate }}</span>
						<div v-if="state.queryForm.timeType == 2">
							<span v-if="row.reportDate">{{ row.reportDate.split('-')[0] }}-{{ row.reportDate.split('-')[1] }}</span>
							<span v-else>-</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="注册会员数" prop="registeredMemberNum" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="register">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { memberRegisterReport } from '/@/api/member/statics';
import { downBlobFile } from '/@/utils/other';
const time = ref([]);
// 搜索变量
const queryRef = ref();
const multipleSelection = ref<any[]>([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: memberRegisterReport,
	queryForm: {
		timeType: '1',
	},
	dataList: [],
});
const typeList = [
	{
		label: '每天',
		value: '1',
	},
	{
		label: '每月',
		value: '2',
	},
];
watch(
	() => time.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.startTime = val[0];
			state.queryForm.endTime = val[1];
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);
const timeTypeChange = () => {
	getDataList();
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	time.value = [];
	getDataList();
};
const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val;
};
// 导出
const exportExcel = async () => {
	let ids = [];
	if (multipleSelection.value?.length > 0) {
		console.log('multipleSelection.value', multipleSelection.value);
		ids = multipleSelection.value.map((item: any) => item.id);
	}
	const params = { ...state.queryForm, ids };
	downBlobFile('/uac/memberRegisterReport/export', params, '注册量统计报表.xlsx');
};
</script>
<style lang="scss" scoped></style>
