<template>
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="会员卡名称" prop="name">
							<el-input placeholder="请输入会员卡名称" clearable style="width: 180px" v-model="state.queryForm.name" />
						</el-form-item>
						<el-form-item label="发行方" prop="publisher">
							<el-input placeholder="请输入发行方" clearable style="width: 180px" v-model="state.queryForm.publisher" />
						</el-form-item>
						<el-form-item label="发行时间" prop="searchTime">
							<el-date-picker
								v-model="searchTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="YYYY-MM-DD"
								style="width: 270px"
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
					row-key="id"
					border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="会员卡名称" prop="name" />
					<el-table-column label="发行方" prop="publisher" />
					<el-table-column label="发行数量" prop="publishNum" />
					<el-table-column label="发行时间" prop="publishTime" />
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toDetails(row)">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="changeType"></listDetail>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { BasicTableProps, useTable } from '/@/hooks/table';
import listDetail from './details.vue';
import { cardIssue } from '/@/api/member/cards';

const listDetailRef = ref();
// 搜索变量
const queryRef = ref();
const searchTime = ref<string[]>([]);
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.publishStartTime = val[0] + ' 00:00:00';
			state.queryForm.publishEndTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.publishStartTime = '';
			state.queryForm.publishEndTime = '';
		}
	}
);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: cardIssue,
	queryForm: {},
	dataList: [],
});
let type = ref('list');

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const changeType = () => {
	type.value = 'list';
	getDataList();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.publishStartTime = '';
	state.queryForm.publishEndTime = '';
	searchTime.value = [];
	getDataList();
};
const toDetails = (row: any) => {
	listDetailRef.value.show(row);
	type.value = 'detail';
};
</script>
<style lang="scss" scoped></style>
