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
				<el-table-column label="获取次数" prop="num">
					<template #default="{ row }">
						<span v-if="row.type === 5">-{{ row.num }}</span>
					</template>
				</el-table-column>
				<el-table-column label="获取方式" prop="type">
					<template #default="{ row }">
						<span v-if="row.type === 1">每天赠送</span>
						<span v-if="row.type === 2">初始赠送</span>
						<span v-if="row.type === 3">生单奖励</span>
						<span v-if="row.type === 4">好友助力</span>
						<span v-if="row.type === 5">抽奖消耗</span>
					</template>
				</el-table-column>
				<el-table-column label="获取时间" prop="createTime" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { downFileAddTask } from '/@/utils/other';
import { useMessageBox } from '/@/hooks/message';
import { activityLotteryNumLogs } from '/@/api/operationConfig/lotteryManage';
const route = useRoute();
const router = useRouter();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: activityLotteryNumLogs,
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

	const { code } = await downFileAddTask('/activity/lotteryNumLog/exportAll', query);
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
