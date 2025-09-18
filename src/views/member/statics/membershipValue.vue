<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-row>
						<el-form-item label="时间维度" prop="type" label-width="68px">
							<el-select placeholder="请选择" v-model="state.queryForm.type" style="width: 180px" @change="changeTime">
								<el-option v-for="(item, key) in typeList" :key="key" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="分组名称" prop="groupName" label-width="68px">
							<el-input placeholder="请输入分组名称" v-model="state.queryForm.groupName" />
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-row class="mb8 flex justify-start items-center">
				<div>
					<el-button type="primary" icon="download" @click="exportExcel"> 导出 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" label="序号" width="100" align="center" />
				<el-table-column label="时间" prop="time" />
				<el-table-column label="分组名称" prop="groupName" />
				<el-table-column label="会员数量" prop="memberNum" />
				<el-table-column label="R均值（购买时间）" prop="meanTime" />
				<el-table-column label="F均值（消费频率）" prop="consumeAvg" />
				<el-table-column label="M均值（消费金额）" prop="amountAvg" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="membershipValue">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getProvinceCityDistrictTree } from '/@/api/culture/common';
import { valuePage } from '/@/api/member/statics';
import { downBlobFile } from '/@/utils/other';

// 搜索变量
const queryRef = ref();
const time = ref([]);
const provinceCityDistrictTreeList = ref([]);
const multipleSelection = ref<any[]>([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: valuePage,
	queryForm: {
		type: '1',
	},
	dataList: [],
});
const typeList = [
	{
		label: '每天',
		value: '1',
	},
	{
		label: '每周',
		value: '2',
	},
	{
		label: '每月',
		value: '3',
	},
];
watch(
	() => time.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.timeStart = val[0];
			state.queryForm.timeEnd = val[1];
		} else {
			state.queryForm.timeStart = '';
			state.queryForm.timeEnd = '';
		}
	}
);
onMounted(() => {
	getTree();
});

const changeTime = (val: any) => {
	getTree();
	getDataList();
};
// 获取行政区树形结构数据
const getTree = async () => {
	let res = await getProvinceCityDistrictTree();
	provinceCityDistrictTreeList.value = res.data;
};

const handleSelectionChange = (val: any[]) => {
	multipleSelection.value = val;
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.timeStart = '';
	state.queryForm.timeEnd = '';
	time.value = [];
	getDataList();
};

// 导出
const exportExcel = async () => {
	let ids = '';
	if (multipleSelection.value?.length > 0) {
		console.log('multipleSelection.value', multipleSelection.value);
		ids = multipleSelection.value.map((item: any) => item.id).join(',');
	}
	const params = { ...state.queryForm, ids };
	downBlobFile('/uac/value/statistics/report/export', params, '会员价值分析报表.xlsx');
};
</script>
<style lang="scss" scoped></style>
