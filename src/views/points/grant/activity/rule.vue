<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="邀请拉新" name="invite">
					<el-table
						:data="state.dataList1"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column label="平台名称" prop="name" />
						<el-table-column label="单次邀请积分奖励" prop="inviteRewardValue" />
						<el-table-column label="每日邀请次数上限" prop="dailyInviteLimit">
							<template #default="scope">
								{{ scope.row.dailyInviteLimit == 0 ? '无' : scope.row.dailyInviteLimit }}
							</template>
						</el-table-column>
						<el-table-column label="邀请次数上限" prop="totalInviteLimit">
							<template #default="scope">
								{{ scope.row.totalInviteLimit == 0 ? '无' : scope.row.totalInviteLimit }}
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template #default="{ row }">
								<el-button type="primary" link @click="toSetInvite(row.id)">设置</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="签到任务" name="sign">
					<el-table
						:data="state.dataList2"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column label="平台名称" prop="name" />
						<el-table-column label="启用/禁用" prop="status">
							<template #default="scope">
								<el-switch
									v-model="scope.row.status"
									:active-value="true"
									style="--el-switch-on-color: #13ce66"
									:inactive-value="false"
									:before-change="() => beforeChange(scope.row, 'sign')"
								/>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template #default="{ row }">
								<el-button type="primary" link @click="toSetSign(row)">设置</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="积分活动" name="activity">
					<div class="mb-5">
						<el-button icon="plus" type="primary" @click="handleEdit()"> 新增 </el-button>
					</div>
					<el-table
						:data="state.dataList3"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column type="index" label="序号" width="60" />
						<el-table-column label="图标" prop="logoUrl">
							<template #default="{ row }">
								<el-image v-if="row.logoUrl" style="width: 60px; height: 60px" :src="row.logoUrl" />
								<span v-else>-</span>
							</template>
						</el-table-column>
						<el-table-column label="任务名称" prop="taskName" />
						<el-table-column label="任务规则" prop="rule" />
						<el-table-column label="发放积分" prop="growthValue" />
						<el-table-column label="跳转地址" prop="jumpPath" />
						<el-table-column label="状态" prop="taskStatus">
							<template #default="scope">
								<el-switch
									v-model="scope.row.taskStatus"
									:active-value="1"
									style="--el-switch-on-color: #13ce66"
									:inactive-value="2"
									:before-change="() => beforeChange(scope.row, 'growth')"
								/>
							</template>
						</el-table-column>
						<el-table-column label="创建时间" prop="createTime" />
						<el-table-column label="操作">
							<template #default="{ row }">
								<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>
		<formDialog ref="formDialogRef" @refresh="getInviteList"></formDialog>
		<signFormDialog ref="signFormDialogRef" @refresh="getSignInList"></signFormDialog>
		<activityFormDialog ref="activityFormDialogRef" @refresh="getActivityList"></activityFormDialog>
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { TabsPaneContext } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { inviteList, signInPlatformList, signInPlatformStatus, getGrowthListApi, growthInUpdate } from '/@/api/points/grant';
// 引入组件
const formDialog = defineAsyncComponent(() => import('./inviteForm.vue'));
const signFormDialog = defineAsyncComponent(() => import('./signForm.vue'));
const activityFormDialog = defineAsyncComponent(() => import('./activityForm.vue'));
const formDialogRef = ref();
const signFormDialogRef = ref();
const activityFormDialogRef = ref();

const activeName = ref('invite');
// 发放渠道
// 事件列表
const state: BasicTableProps = reactive<BasicTableProps>({
	dataList1: [],
	dataList2: [],
	dataList3: [],
});

const handleClick = (tab: TabsPaneContext) => {
	// 切换tab
	if (tab.paneName == 'invite') {
		getInviteList();
	} else if (tab.paneName == 'sign') {
		getSignInList();
	} else {
		getActivityList();
	}
};

const toSetInvite = (id: string) => {
	formDialogRef.value.openDialog(id);
};
const toSetSign = (row) => {
	signFormDialogRef.value.openDialog(row);
};
//  table hook
const { tableStyle } = useTable(state);

const beforeChange = async (row: any, type: string) => {
	const msg = !row.taskStatus ? '确定要启用该数据吗?' : '确定要禁用该数据吗?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		let changeStatus: any;
		if (row.taskStatus == 1) changeStatus = 2;
		else changeStatus = 1;
		const params = {
			taskStatus: changeStatus,
			id: row.id,
		};
		if (type == 'sign') await signInPlatformStatus(params);
		else if (type == 'growth') await growthInUpdate(params);
		useMessage().success('操作成功');
		getSignInList();
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const getInviteList = () => {
	inviteList().then((res) => {
		state.dataList1 = res.data;
	});
};
const getSignInList = () => {
	signInPlatformList().then((res) => {
		state.dataList2 = res.data;
	});
};

const getActivityList = () => {
	getGrowthListApi().then((res) => {
		state.dataList3 = res.data;
	});
};
getInviteList();

const handleEdit = (row?: any) => {
	if (row) activityFormDialogRef.value.openDialog(row);
	else activityFormDialogRef.value.openDialog();
};
</script>
<style lang="scss" scoped></style>
