<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb20">
				<div style="width: 100%">
					<el-button @click="handleCommand('add')" type="primary">新建活动</el-button>
				</div>
			</el-row>
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
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" link @click="handleCommand('delete', row)">删除</el-button>
						<el-button type="primary" v-if="row.status === 1" link @click="handleCommand('disable', row)">停用</el-button>
						<el-button type="primary" v-if="row.status === 2" link @click="handleCommand('enable', row)">发布</el-button>
						<el-button type="primary" link @click="handleCommand('copyLink', row)">复制链接</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 配置配置  -->
		<config-dialog @refresh="getDataList()" ref="configDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getActivityList, statusUpdate, activityDelete } from '/@/api/operationConfig/lotteryManage';
// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));

// 定义变量内容
const configDialogRef = ref();
const tableRef = ref();
const router = useRouter();
const copied = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getActivityList,
	dataList: [],
	loading: false,
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 操作项
const handleCommand = async (type: string, row?: any) => {
	switch (type) {
		case 'add':
			router.push('/operationConfig/activityManage/createActivity/form');
			break;
		case 'edit': // 编辑
			router.push(`/operationConfig/activityManage/createActivity/form?type=edit&activityCode=${row.code}`);
			break;
		case 'enable': // 发布
			try {
				await useMessageBox().confirm('请确认是否发布活动？', '发布活动');
			} catch {
				return;
			}

			try {
				const { id } = row;
				await statusUpdate({ id, status: 1 });
				useMessage().success('已发布');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'disable': // 停用
			try {
				await useMessageBox().confirm(`请确认是否停用活动？`, '停用活动');
			} catch {
				return;
			}

			try {
				const { id } = row;
				await statusUpdate({ id, status: 2 });
				useMessage().success('已停用');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'delete':
			try {
				await useMessageBox().confirm(`请确认是否删除当前活动？`, '删除活动');
			} catch {
				return;
			}
			try {
				await activityDelete({ id: row.id });
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'copyLink':
			try {
				await navigator.clipboard.writeText(`/pages_activity/lotteryDrawing/index?activityCode=${row.code}`);
				useMessage().success('已复制链接到剪贴板');
			} catch (err: any) {
				console.error('Failed to copy text: ', err);
			}
			break;
	}
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
