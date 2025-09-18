<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="模型名称">
						<el-input placeholder="请输入" v-model="state.queryForm.name" />
					</el-form-item>
					<el-form-item label="模型ID">
						<el-input placeholder="请输入" v-model="state.queryForm.code" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-[10px]">
				<el-button type="primary" @click="handleDetail">新增</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="name" label="模型名称" />
				<el-table-column prop="code" label="模型ID" />
				<el-table-column prop="remark" label="模型备注" />
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleDetail(row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="pushModelManage">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { advertPushModelPage } from '/@/api/ad/advertise';

const router = useRouter();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: advertPushModelPage,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleDetail = (row?: any) => {
	router.push({ path: '/ad/advertisingPush/pushModelDetail', query: { code: row.code } });
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
</script>

<style scoped lang="scss"></style>
