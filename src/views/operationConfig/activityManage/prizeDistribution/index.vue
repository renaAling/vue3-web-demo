<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				ref="tableRef"
			>
				<el-table-column label="活动ID" prop="id" />
				<el-table-column label="活动名称" prop="name" />
				<el-table-column label="开始时间" prop="startTime" />
				<el-table-column label="结束时间" prop="endTime" />
				<el-table-column label="活动类型" prop="type">
					<template #default="{ row }">
						<span>即时开奖</span>
					</template>
				</el-table-column>
				<el-table-column label="启用状态" prop="status">
					<template #default="{ row }">
						<span v-if="row.status === 1">已发布</span>
						<span v-if="row.status === 2">已停用</span>
					</template>
				</el-table-column>
				<el-table-column label="中奖名单">
					<template #default="{ row }">
						<el-button type="primary" link @click="goToWinningList(row.code)">点击查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="config-first-page" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { TabsPaneContext } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getActivityList } from '/@/api/operationConfig/lotteryManage';
const router = useRouter();

// 定义变量内容
const configDialogRef = ref();
const tableRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getActivityList,
	dataList: [],
	loading: false,
});
//  table hook
const { currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 跳转到活动参与日志页面
const goToWinningList = (code: string) => {
	router.push(`/operationConfig/activityManage/prizeDistribution/winningList?activityCode=${code}`);
};
</script>
<style lang="scss" scoped>
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
