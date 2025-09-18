<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="商户名称">
						<el-input placeholder="请输入商户名称" maxlength="30" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="商圈">
						<el-input placeholder="请输入商圈名称" maxlength="30" v-model="state.queryForm.subwayName" clearable />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="name" label="商户名称" />
				<el-table-column prop="storeType" label="商户类型">
					<template #default="{ row }">
						<el-tag v-if="row.storeType === 1">中餐厅</el-tag>
						<el-tag v-else-if="row.storeType === 2">外国餐厅</el-tag>
						<el-tag v-else-if="row.storeType === 3">快餐厅</el-tag>
						<el-tag v-else-if="row.storeType === 4">咖啡厅</el-tag>
						<el-tag v-else-if="row.storeType === 5">茶艺馆</el-tag>
						<el-tag v-else-if="row.storeType === 6">冷饮店</el-tag>
						<el-tag v-else-if="row.storeType === 7">糕饼店</el-tag>
						<el-tag v-else-if="row.storeType === 8">甜品店</el-tag>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="subwayName" label="商圈" />
				<el-table-column prop="score" label="评分" />
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleWeighted(row)">加权调整</el-button>
						<el-button text type="primary" @click="handleComment(row)">评论评价</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<weightedDialog ref="weightedDialogRef" @refresh="getDataList" />
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { storePageApi } from '/@/api/note/noteInfo';
// 引入组件
const weightedDialog = defineAsyncComponent(() => import('./weightedDialog.vue'));
const router = useRouter();
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: storePageApi,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
// 加权调整
const weightedDialogRef = ref();
const handleWeighted = (row: any) => {
	weightedDialogRef.value.openDialog(row);
};
// 评论评价
const handleComment = (row: any) => {
	router.push({
		path: '/note/consumptionMap/commentManage/merchantComments/commentStar',
		query: { ipoCode: row.ipoCode },
	});
};
</script>
