<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="投放计划名称">
						<el-input placeholder="请输入" v-model="state.queryForm.name" />
					</el-form-item>
					<el-form-item label="投放计划ID">
						<el-input placeholder="请输入" v-model="state.queryForm.code" />
					</el-form-item>
					<el-form-item label="推送时间">
						<el-date-picker
							v-model="daterangeTime"
							:clearable="false"
							@change="changeTime"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
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
				<el-table-column prop="code" label="定向推送计划ID" />
				<el-table-column prop="name" label="推送计划名称" />
				<el-table-column prop="spaceName" label="推送广告位" />
				<el-table-column prop="modelCode" label="推送模型ID" />
				<el-table-column prop="modelName" label="推送模型名称" />
				<el-table-column prop="startTime" label="新增时间">
					<template #default="scope">
						<span>{{ dayjs(scope.row.startTime).format('YYYY-MM-DD') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleDetail(row)">设置</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="targetedPushPlan">
import dayjs from 'dayjs';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { advertPushPlanPage } from '/@/api/ad/advertise';

const router = useRouter();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: advertPushPlanPage,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleDetail = (row?: any) => {
	router.push({ path: '/ad/advertisingPush/pushPlanDetail', query: { code: row.code } });
};
const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
</script>

<style scoped lang="scss"></style>
