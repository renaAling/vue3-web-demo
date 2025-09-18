<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="code"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="name" label="广告产品名称" />
				<el-table-column prop="code" label="广告位ID" />
				<el-table-column prop="pageDesc" label="所处页面说明" />
				<el-table-column prop="formatDesc" label="素材格式及尺寸说明" show-overflow-tooltip />
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleEdit(row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="advertising">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { advertSpacePage } from '/@/api/ad/advertise';

const router = useRouter();
// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: advertSpacePage,
	queryForm: {},
	dataList: [],
});
const handleEdit = (row: any) => {
	router.push({ path: '/ad/material/edit', query: { code: row.code } });
};
const { currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>

<style scoped lang="scss"></style>
