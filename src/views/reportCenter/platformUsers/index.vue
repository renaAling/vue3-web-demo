<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="日期" prop="date">
						<el-date-picker
							v-model="state.queryForm.date"
							type="date"
							placeholder="请选择日期"
							:disabled-date="disabledDate"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
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
				<el-table-column prop="refDate" label="日期" show-overflow-tooltip></el-table-column>
				<el-table-column prop="visitTotal" label="累计用户数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="visitUvNew" label="新增用户数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="visitUv" label="活跃用户数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="visitPv" label="访问次数" show-overflow-tooltip></el-table-column>
			</el-table>

			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberPlatFromReport } from '../../../api/reportCenter';
const queryRef = ref();
const showSearch = ref(true);
// 禁用今天之后的日期
const disabledDate = (time: any) => {
	return time.getTime() > Date.now();
};
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberPlatFromReport, // H
	descs: [],
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.date = '';
	getDataList();
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
