<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="发送人" prop="name">
						<el-input placeholder="请输入问题名称" maxlength="30" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="渠道" prop="type">
						<el-select v-model="state.queryForm.type" placeholder="请选择状态" default-first-option clearable>
							<el-option v-for="(value, key) in typelist" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="时间" prop="time">
						<el-date-picker
							v-model="timeData"
							type="daterange"
							range-separator="-"
							:disabled-date="disabledDate"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="标题" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="消息内容" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="发送人" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="发送渠道" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="发送场景" show-overflow-tooltip></el-table-column>
				<el-table-column label="状态" prop="merchantName" width="200">
					<template #default="{ row }"> </template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMemberGroupPage } from '/@/api/member/memberGroup';
const timeData = ref<string[]>([]);
const typelist = ref<any[]>();

const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};

watch(
	() => timeData.value,
	(val) => {
		if (val.length > 0) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getMemberGroupPage,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const queryRef = ref();
const showSearch = ref(true);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeData.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
</script>
