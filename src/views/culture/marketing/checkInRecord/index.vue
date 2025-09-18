<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="用户手机号">
						<el-input v-model.trim="state.queryForm.mobile" placeholder="请输入用户手机号" clearable></el-input>
					</el-form-item>
					<el-form-item label="打卡日期">
						<el-date-picker
							v-model="daterangeTime"
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
			<el-table
				:data="state.dataList"
				v-loading="stateForm.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" min-width="50" />
				<el-table-column prop="unionId" label="打卡用户ID" />
				<el-table-column prop="mobile" label="打卡用户手机号" />
				<el-table-column prop="checkInDate" label="打卡时间" />
				<el-table-column prop="allNum" label="是否合规">
					<template #default>
						<span>合规</span>
					</template>
				</el-table-column>
				<el-table-column prop="allNum" label="累计打卡天数(天)" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>
<script lang="ts" setup name="merchantReconciliation">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { checkInUserLogPage } from '/@/api/culture/marketing';

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: checkInUserLogPage,
	queryForm: {},
	dataList: [],
});

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const stateForm = reactive({
	loading: false,
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	daterangeTime.value = [];
	getDataList();
};
</script>

<style scoped lang="scss"></style>
