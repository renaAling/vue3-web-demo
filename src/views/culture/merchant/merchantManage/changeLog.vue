<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="changeContent" label="变更内容" show-overflow-tooltip />
				<el-table-column prop="originalContent" label="原内容" show-overflow-tooltip />
				<el-table-column prop="newContent" label="新内容" />
				<el-table-column prop="operatorAccount" label="操作账号" />
				<el-table-column prop="operationTime" label="操作时间" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getBusinessChangeLog } from '/@/api/culture/merchant/merchantManage';

const route = useRoute();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getBusinessChangeLog,
	queryForm: {
    businessCode: route.query.businessCode as string,
  },
	dataList: [],
});

const { currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style lang="scss" scoped></style>
