<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="产生时间" prop="time">
						<el-date-picker
							v-model="time"
							type="daterange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD"
							clearable
							style="width: 300px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary"> 查询 </el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="接口名称" prop="interfaceName" width="200" show-overflow-tooltip />
				<el-table-column label="接口路径" prop="uri" width="200" show-overflow-tooltip />
				<el-table-column label="请求方式" prop="requestMethod" width="200" show-overflow-tooltip />
				<el-table-column label="调用时间" prop="requestTime" width="200" show-overflow-tooltip />
				<el-table-column label="接口状态" prop="status" width="200" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.status === 1">上线</span>
						<span v-else-if="row.status === 2">下线</span>
					</template>
				</el-table-column>
				<el-table-column label="版本" prop="version" width="200" show-overflow-tooltip />
				<el-table-column label="平均响应时间" prop="consumedTime" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.consumedTime }}ms</span>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getContactsInfoList } from '/@/api/openPlatform/log';

// 搜索变量
const queryRef = ref();
const time = ref([]);

watch(
	() => time.value,
	(val) => {
		if (val && val.length === 2) {
			// 确保 val 是一个包含两个元素的数组
			state.queryForm.startTime = `${val[0]} 00:00:00`; // 格式化开始时间
			state.queryForm.endTime = `${val[1]} 23:59:59`; // 格式化结束时间
		} else {
			// 如果 val 为空或格式不正确，重置 startTime 和 endTime
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		time: '',
	},
	pageList: getContactsInfoList,
	dataList: [],
	descs: ['time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	time.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
</script>
