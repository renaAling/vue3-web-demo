<template>
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					row-key="id"
					border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="系统名称" prop="sysUserName" />
					<el-table-column label="角色数" prop="roleCount" />
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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
import { getAllRole } from '/@/api/member/backendUsers/role';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';
import listDetail from './details.vue';

const listDetailRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getAllRole,
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
const handleEdit = (row: any) => {
	listDetailRef.value.show(row);
	type.value = 'detail';
};
</script>
<style lang="scss" scoped></style>
