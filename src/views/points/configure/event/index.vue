<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb8 flex items-center">
				<div>
					<el-button type="primary" icon="plus" @click="formDialogRef.openDialog()"> 新增事件 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column label="事件名称" prop="name" />
				<el-table-column label="适用渠道" prop="channelName" />
				<el-table-column label="适用类型" prop="applyStatus">
					<template #default="scope">
						<dict-tag :options="eventType" :value="scope.row.applyStatus" />
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" />
				<el-table-column label="状态" prop="createTime">
					<template #default="scope">
						<el-switch v-model="scope.row.status" :active-value="2" :inactive-value="1" :before-change="() => beforeChange(scope.row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作人" prop="createBy" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList()"></formDialog>
	</div>
</template>

<script lang="ts" setup name="pointsGrant">
import { eventPageList, eventUpdateStatus } from '/@/api/points/config';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 表单
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: eventPageList,
	queryForm: {},
	dataList: [],
});
const eventType = ref([
	{
		label: '积分发放',
		value: '1',
		elTagType: '',
	},
	{
		label: '积分使用',
		value: '2',
		elTagType: '',
	},
	{
		label: '积分过期',
		value: '5',
		elTagType: '',
	},
	{
		label: '积分回退-退增',
		value: '3',
		elTagType: '',
	},
	{
		label: '积分回退- 退减',
		value: '4',
		elTagType: '',
	},
	{
		label: '积分冻结',
		value: '6',
		elTagType: '',
	},
	{
		label: '积分解冻',
		value: '7',
		elTagType: '',
	},
	{
		label: '积分冻结扣减',
		value: '8',
		elTagType: '',
	}
]);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const beforeChange = async (row: any) => {
	const msg = row.status == '1' ? '确定要启用该事件吗?' : '确定要禁用该事件吗?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		let changeStatus: any;
		if (row.status == 1) changeStatus = 2;
		if (row.status == 2) changeStatus = 1;
		const params = {
			status: changeStatus,
			eventCode: row.eventCode,
		};
		await eventUpdateStatus(params);
		useMessage().success('操作成功');
		getDataList();
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
<style lang="scss" scoped></style>
