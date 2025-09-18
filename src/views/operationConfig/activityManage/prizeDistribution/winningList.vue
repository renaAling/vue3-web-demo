<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb10">
				<el-button plain @click="handleDownload" icon="download" type="primary" :disabled="state.dataList && state.dataList.length == 0"
					>记录下载
				</el-button>
			</el-row>
			<el-table
				border
				ref="tableRef"
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="昵称" prop="nickName" width="130">
					<template #default="{ row }">
						<span v-if="row.nickName">{{ row.nickName }}</span>
						<span v-else>——</span>
					</template>
				</el-table-column>
				<el-table-column label="手机号" prop="mobile" />
				<el-table-column label="获得奖品	" prop="prizeName" />
				<el-table-column label="中奖时间" prop="winTime" />
				<el-table-column label="核销状态" prop="status">
					<template #default="{ row }">
						<span v-if="row.status === 1">未中奖</span>
						<span v-if="row.status === 2">未领奖</span>
						<span v-if="row.status === 3">已领奖</span>
					</template>
				</el-table-column>
				<el-table-column label="说明" prop="remark">
					<template #default="{ row }">
						<span v-if="row.remark">{{ row.remark }}</span>
						<span v-else>——</span>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { downFileAddTask } from '/@/utils/other';
import { useMessageBox } from '/@/hooks/message';
import { getWinningList } from '/@/api/operationConfig/lotteryManage';
const route = useRoute();
const router = useRouter();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getWinningList,
	queryForm: {
		activityCode: route.query.activityCode,
	},
	loading: false,
});
//  table hook
const { currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 下载参与日志记录
const handleDownload = async () => {
	const { activityCode } = state.queryForm;
	const query = {
		activityCode,
	};

	const { code } = await downFileAddTask('/activity/lotteryUserInfo/exportAll', query);
	if (code === 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
		router.push('/downloadCenter');
	}
};
</script>
