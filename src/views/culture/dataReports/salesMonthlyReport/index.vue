<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="title">查询报表</div>
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="报表日期" prop="paymentTime">
						<el-date-picker
							v-model="paymentTime"
							@change="changeTime"
							type="monthrange"
							range-separator="-"
							start-placeholder="开始月份"
							end-placeholder="结束月份"
							value-format="YYYY-MM-DD"
							style="width: 270px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				row-key="orderCode"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" width="40" align="center" />
				<el-table-column label="报表" prop="name" />
				<el-table-column label="生成时间" prop="createTime" width="600" />
				<el-table-column label="操作" width="200" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('detail', row)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getOrderList } from '/@/api/culture/saleManage';

const selectedOrderIds = ref([]);
const orderIds = ref([]);

// 搜索变量
const queryRef = ref();
const paymentTime = ref([]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getOrderList,
	queryForm: {
		type: '2',
	},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
watch(
	() => paymentTime.value,
	(val) => {
		if (val) {
			state.queryForm.dateStart = val[0];
			state.queryForm.dateEnd = val[1];
		} else {
			state.queryForm.dateStart = '';
			state.queryForm.dateEnd = '';
		}
	}
);
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [];
	state.queryForm.dateStart = '';
	state.queryForm.dateEnd = '';
	getDataList();
};

const handleCommand = (command: string, row: any) => {
	switch (command) {
		case 'detail':
			window.open(row.fileUrl);
			break;
	}
};
const changeTime = (val: any) => {
	if (!val) {
		state.queryForm.dateStart = '';
		state.queryForm.dateEnd = '';
	}
	getDataList();
};
</script>

<style lang="scss" scoped>
.isPay,
.refundAmount {
	color: #4785ea;
}

.title {
	margin-bottom: 16px;
	margin-top: 10px;
	color: #1d2129;
	font-size: 20px;
	font-weight: 600;
}
</style>
