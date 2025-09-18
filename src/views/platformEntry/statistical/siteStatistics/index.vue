<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="变动时间" prop="date">
						<el-date-picker v-model="state.queryForm.date" type="month" value-format="YYYY-MM-DD" placeholder="选择变动时间" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
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
				<el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
				<el-table-column prop="date" label="账单日期" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="账单名称" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" min-width="60" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" @click="handleDown(row)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getPlatformStatisticsPage } from '/@/api/platformEntry/statistical';
const queryRef = ref();
const handleDown = (row?: any) => {
	const link = document.createElement('a');
	link.style.display = 'none';
	link.href = row.downloadUrl;
	link.setAttribute('download', row.name);
	document.body.appendChild(link);
	link.click();
};
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { type: 1 },
	pageList: getPlatformStatisticsPage, // H
	descs: [],
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style scoped></style>
