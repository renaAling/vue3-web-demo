<template>
	<div class="layout-padding">
		<div class="flex justify-between align-center mb-4">
			<p class="title">活动内容信息管理</p>
			<el-button icon="plus" @click="handleCommand('add')" type="primary">新建内容</el-button>
		</div>
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="活动状态" prop="status">
						<el-select v-model="state.queryForm.status" clearable @change="getDataList">
							<el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="活动分组" prop="groupCode">
						<el-select v-model="state.queryForm.groupCode" clearable @change="getDataList">
							<el-option v-for="item in groupCodeOptionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="活动标题" prop="activityTitle">
						<el-input placeholder="请输入活动标题" maxlength="50" style="width: 220px" v-model="state.queryForm.activityTitle" clearable />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				ref="tableRef"
			>
				<el-table-column label="活动标题" prop="activityTitle" show-overflow-tooltip />
				<el-table-column label="最新发布时间" prop="latestPublishTime" show-overflow-tooltip />
				<el-table-column label="首次发布时间" prop="firstPublishTime" show-overflow-tooltip />
				<el-table-column label="操作人" prop="updateBy" show-overflow-tooltip />
				<el-table-column label="状态" prop="status" show-overflow-tooltip>
					<template #default="{ row }">
						<el-tag v-if="row.status === 2">未发布</el-tag>
						<el-tag v-if="row.status === 1" type="success">已发布</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="所属分组" prop="groupName" show-overflow-tooltip />
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" v-if="row.status === 1" style="color: #e6a543" link @click="handleCommand('cancelEnable', row)"
							>取消发布</el-button
						>
						<el-button type="primary" v-if="row.status === 1" link @click="handleCommand('copyLink', row)">复制链接</el-button>
						<el-button type="primary" v-if="row.status === 2" style="color: #7ac953" link @click="handleCommand('enable', row)">发布</el-button>
						<el-button type="primary" link @click="handleCommand('see', row)">预览</el-button>
						<el-button type="primary" link @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" style="color: red" link @click="handleCommand('delete', row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
		<details-dialog @refresh="getDataList()" ref="detailsDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getActivityInfoPage, getGroupList, getActivityInfoDel, getActivityInfoUpdate } from '/@/api/operationConfig/activityInformation';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const DetailsDialog = defineAsyncComponent(() => import('./details.vue'));

// 定义变量内容
const formDialogRef = ref();
const detailsDialogRef = ref();
const tableRef = ref();
const queryRef = ref();

onMounted(() => {
	// 获取活动分组
	getGroupCodeOptionList();
	// getGroupList
});

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getActivityInfoPage,
	dataList: [],
	loading: false,
});
const optionList = [
	{ label: '已发布', value: 1 },
	{ label: '未发布', value: 2 },
];
const groupCodeOptionList = ref();
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const getGroupCodeOptionList = async () => {
	try {
		const { code, data } = await getGroupList();
		if (code === 0) {
			groupCodeOptionList.value = [];
			data.forEach((item: any) => {
				groupCodeOptionList.value.push({
					label: item.groupName,
					value: item.code,
				});
			});
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 操作项
const handleCommand = async (type: string, row?: any) => {
	switch (type) {
		case 'add':
			formDialogRef.value.openDialog(row, type);
			break;
		case 'edit': // 编辑
			formDialogRef.value.openDialog(row, type);
			break;
		case 'see': // 预览
			detailsDialogRef.value.openDialog(row, type);
			break;
		case 'enable': // 发布
			try {
				await useMessageBox().confirm('请确认是否发布活动？', '发布活动');
			} catch {
				return;
			}

			try {
				// const { id } = row;
				await getActivityInfoUpdate({ id: row.id, status: 1 });
				useMessage().success('已发布');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'cancelEnable': // 取消发布
			try {
				await useMessageBox().confirm('请确认是否取消发布活动？', '取消发布活动');
			} catch {
				return;
			}
			try {
				// const { id } = row;
				await getActivityInfoUpdate({ id: row.id, status: 2 });
				useMessage().success('已取消');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'copyLink':
			try {
				const link = `/pages_activity/activitySquare/detail?id=${row.id}`;
				await navigator.clipboard.writeText(link);
				useMessage().success('已复制活动链接到剪贴板');
			} catch (err: any) {
				console.error('Failed to copy text: ', err);
			}
			break;
		case 'delete':
			try {
				await useMessageBox().confirm(`请确认是否删除当前活动？`, '删除活动');
			} catch {
				return;
			}
			try {
				await getActivityInfoDel(Number(row.id));
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
	}
};
// 清空搜索条件;
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
<style lang="scss" scoped>
.title {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: #1d2129;
	// margin-bottom: 16px;
}
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
