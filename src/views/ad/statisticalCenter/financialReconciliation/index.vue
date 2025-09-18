<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="查询类型" prop="searchType">
						<el-select v-model="searchType" clearable @change="changeTypeSearch">
							<el-option v-for="(item, key) in searchFieldType" :key="key" :label="item.label" :value="item.type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="查询时间" prop="searchTime">
						<el-date-picker
							v-model="searchTime"
							@change="changeSearchTime"
							:type="searchType"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" width="40" align="center" />
				<el-table-column label="报表" prop="name" />
				<el-table-column label="生成时间" prop="createTime" />
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleExport(row)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-financialReconciliation">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { advertReportPage } from '/@/api/ad/afterSellOrder';

// 搜索变量
const queryRef = ref();
const searchTime = ref([]);
const searchFieldType = ref([
	{ type: 'daterange', label: '日', code: 1 },
	{ type: 'monthrange', label: '月', code: 2 },
]);
const searchType = ref('daterange');
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: advertReportPage,
	queryForm: {
		businessType: 2,
		type: searchType.value === 'daterange' ? 1 : 2,
	},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	searchType.value = 'daterange';
	state.queryForm.dateStart = '';
	state.queryForm.dateEnd = '';
	getDataList();
};
const changeTypeSearch = (val: any) => {
	state.queryForm.type = val === 'daterange' ? 1 : 2;
	getDataList();
};
watch(
	() => searchTime.value,
	(val) => {
		if (val) {
			state.queryForm.dateStart = val[0];
			state.queryForm.dateEnd = val[1];
		} else {
			state.queryForm.dateStart = '';
			state.queryForm.dateEnd = '';
		}
	}
);
const changeSearchTime = (val: any) => {
	if (!val) {
		state.queryForm.dateStart = '';
		state.queryForm.dateEnd = '';
	}
	getDataList();
};

// 下载财务报表
const handleExport = async (row: any) => {
	if (row.fileUrl) {
		const link = document.createElement('a');
		link.href = row.fileUrl;
		document.body.appendChild(link);
		link.click();
		window.setTimeout(() => {
			document.body.removeChild(link);
		}, 0);
	}
};
</script>
<style lang="scss" scoped></style>
