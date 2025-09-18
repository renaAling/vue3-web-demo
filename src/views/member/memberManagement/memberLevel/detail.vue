<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				:data="dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="标识" width="220">
					<template #default="{row}">
						<img :src="row.logoUrl" width="30px" />
					</template>
				</el-table-column>
				<el-table-column prop="taskName" label="任务名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="rule" label="任务规则" show-overflow-tooltip></el-table-column>
				<el-table-column prop="growthValue" label="发放成长值" width="100"></el-table-column>
				<el-table-column prop="jumpPath" label="跳转地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskStatus" label="状态" width="60">
					<template #default="scope">
						<span v-if="scope.row.taskStatus == '2'">无效</span>
						<span class="text-green-400" v-else>有效</span>
					</template>
				</el-table-column>
			</el-table>
			<div class="mt-2 text-sm text-slate-500">* 当前页面仅支持查看成长值任务，若需修改任务信息请联系开发人员</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberGrowthManageGrowthList } from '../../../../api/member/member';

const dataList = ref([]);
onMounted(async () => {
	const { data } = await getMemberGrowthManageGrowthList();
	dataList.value = data;
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberGrowthManageGrowthList, // H
	descs: ['create_time'],
});

//  table hook
const { tableStyle } = useTable(state);
</script>
