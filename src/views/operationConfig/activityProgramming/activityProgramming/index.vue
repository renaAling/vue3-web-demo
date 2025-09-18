<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="活动名称" prop="schemeName">
						<el-input placeholder="请输入活动名称" maxlength="50" style="width: 220px" v-model="state.queryForm.schemeName" clearable />
					</el-form-item>
					<el-form-item label="活动时间" prop="searchTime">
						<el-date-picker
							v-model="searchTime"
							@change="changeSearchTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item label="活动状态" prop="status">
						<el-select v-model="state.queryForm.status" style="width: 220px" placeholder="选择活动状态" clearable>
							<el-option v-for="item in staffStatus" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb20">
				<div style="width: 100%">
					<el-button @click="handleCommand('add')" type="primary">新建活动方案</el-button>
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
				<el-table-column label="活动名称" prop="schemeName" show-overflow-tooltip />
				<el-table-column label="开始时间" prop="startTime" show-overflow-tooltip />
				<el-table-column label="结束时间" prop="endTime" show-overflow-tooltip />
				<el-table-column label="状态" prop="status" show-overflow-tooltip>
					<template #default="{ row }">
						<el-tag class="ml-2" v-if="row.status == 1" type="info">待审核</el-tag>
						<el-tag class="ml-2" v-if="row.status == 2" type="warning">审核中</el-tag>
						<el-tag class="ml-2" v-if="row.status == 3" type="success">审核通过</el-tag>
						<el-tag class="ml-2" v-if="row.status == 4" type="danger">审核驳回</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="最后操作人" prop="lastOperator" show-overflow-tooltip />
				<el-table-column label="审核说明" prop="auditDescription" show-overflow-tooltip />
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button type="primary" v-if="row.status == 1 || row.status == 4" link @click="handleCommand('submit', row)">提交审核</el-button>
						<el-button type="primary" v-if="row.status == 1 || row.status == 4" link @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" v-if="row.status == 3" link @click="handleCommand('see', row)">查看</el-button>
						<el-button
							type="primary"
							v-if="row.status == 1 || row.status == 3 || row.status == 4"
							style="color: red"
							link
							@click="handleCommand('delete', row)"
							>删除</el-button
						>
						<el-button type="primary" v-if="row.status == 2" style="color: #e6a543" link @click="handleCommand('revocation', row)">撤销</el-button>
						<!-- <el-button type="primary" link @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" link @click="handleCommand('delete', row)">删除</el-button>
						<el-button type="primary" v-if="row.status === 1" link @click="handleCommand('disable', row)">停用</el-button>
						<el-button type="primary" v-if="row.status === 2" link @click="handleCommand('enable', row)">发布</el-button>
						<el-button type="primary" link @click="handleCommand('copyLink', row)">复制链接</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 配置配置  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getActivitySchemePlanPage, getActivitySchemePlanDelete, getActivitySchemePlanUpdate } from '/@/api/operationConfig/activityProgramming';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

// 定义变量内容
const formDialogRef = ref();
const tableRef = ref();
// const router = useRouter();
const searchTime = ref([]);
const queryRef = ref();
const staffStatus = ref([
	{
		value: '1',
		label: '待审核',
	},
	{
		value: '2',
		label: '审核中',
	},
	{
		value: '3',
		label: '审核通过',
	},
	{
		value: '4',
		label: '审核驳回',
	},
]);
watch(
	() => searchTime.value,
	(val) => {
		if (val) {
			if (val[0] && val[1]) {
				state.queryForm.startTime = val[0] + ' 00:00:00';
				state.queryForm.endTime = val[1] + ' 23:59:59';
			} else {
				state.queryForm.startTime = '';
				state.queryForm.endTime = '';
			}
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getActivitySchemePlanPage,
	dataList: [],
	loading: false,
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 操作项
const handleCommand = async (type: string, row?: any) => {
	console.log('formDialogRef', formDialogRef.value);
	console.log('row', row);
	switch (type) {
		case 'add': //新增
			formDialogRef.value.openDialog(row, type);
			// router.push('/operationConfig/activityProgramming/activityProgramming/config');
			break;
		case 'edit': // 编辑
			formDialogRef.value.openDialog(row, type);
			// router.push(`/operationConfig/activityProgramming/activityProgramming/config?type=edit&activityCode=${row.code}`);
			break;
		case 'see': // 查看
			formDialogRef.value.openDialog(row, type);
			// router.push(`/operationConfig/activityProgramming/activityProgramming/config?type=edit&activityCode=${row.code}`);
			break;
		case 'delete': //删除
			try {
				await useMessageBox().confirm(`请确认是否删除当前活动方案？`, '删除方案');
			} catch {
				return;
			}
			try {
				await getActivitySchemePlanDelete(Number(row.id));
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'submit': // 提交审核
			try {
				await useMessageBox().confirm('请确认是否提交审核？', '提交审核');
			} catch {
				return;
			}
			try {
				await getActivitySchemePlanUpdate({ id: row.id, saveOrAudit: 2 });
				useMessage().success('提交审核成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'revocation': // 撤销
			try {
				await useMessageBox().confirm('请确认是否撤销当前活动方案？', '撤销方案');
			} catch {
				return;
			}
			try {
				// const { id } = row;
				// await statusUpdate({ id, status: 1 });
				await getActivitySchemePlanUpdate({ id: row.id, saveOrAudit: 1 });
				useMessage().success('已撤销');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
	}
};

const changeSearchTime = (val: any) => {
	if (!val) {
		state.queryForm.startTime = '';
		state.queryForm.endTime = '';
	}
	getDataList();
};

// 清空搜索条件;
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
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
