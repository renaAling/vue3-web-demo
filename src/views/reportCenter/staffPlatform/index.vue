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
				<el-table-column prop="date" label="日期" show-overflow-tooltip></el-table-column>
				<el-table-column prop="totalUser" label="累计员工数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="newUser" label="新增员工数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="activeUser" label="活跃员工数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="visitNum" label="访问次数" show-overflow-tooltip></el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getmMmberStaffUserReport } from '../../../api/reportCenter';
const showSearch = ref(true);
const queryRef = ref();
// 禁用今天之后的日期
const disabledDate = (time: any) => {
	return time.getTime() > Date.now();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.date = '';
	getDataList();
};
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getmMmberStaffUserReport, // H
	descs: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
