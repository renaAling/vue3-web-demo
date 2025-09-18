<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-row>
						<el-form-item label="退款订单号" prop="refundNumber" label-width="90px">
							<el-input v-model.trim="state.queryForm.refundNumber" placeholder="请输入退款单号" />
						</el-form-item>
						<el-form-item label="关联支付流水号" prop="payOrderId" label-width="110px">
							<el-input v-model.trim="state.queryForm.payOrderId" placeholder="请输入关联支付流水号" />
						</el-form-item>
						<el-form-item label="退款原因" prop="reason" label-width="90px">
							<el-select placeholder="请选择" v-model="state.queryForm.reason" style="width: 180px">
								<el-option v-for="(item, key) in refundReasonMap" :key="key" :label="item" :value="item"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="时间" prop="time" label-width="90px">
							<el-date-picker
								v-model="time"
								type="daterange"
								range-separator="-"
								start-placeholder="请选择开始时间"
								end-placeholder="请选择结束时间"
								value-format="YYYY-MM-DD"
								style="width: 300px"
							/>
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
			>
				<el-table-column prop="refundNumber" label="退款订单号" />
				<el-table-column prop="refundSerialNumber" label="关联支付流水号" />
				<el-table-column prop="refundTime" label="退款时间" />
				<el-table-column prop="refundAmount" label="退款金额" />
				<el-table-column prop="refundReason" label="退款原因" />
				<el-table-column prop="refundChannel" label="退款渠道" />
				<el-table-column prop="refundStatus" label="处理状态">
					<template #default="{ row }">
						<el-tag>{{ row.refundStatus }}</el-tag>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="refundStatements">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { downBlobFile } from '/@/utils/other';
import { orderRefundList } from '/@/api/culture/statics';
const time = ref([]);
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: orderRefundList,
	queryForm: {},
	dataList: [],
});
const refundReasonMap = {
	1: '7天无理由',
	2: '商品与页面描述不符',
	3: '少件/发错货/未收到货',
	4: '商品质量/故障',
};
watch(
	() => time.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.startTime = val[0];
			state.queryForm.endTime = val[1];
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	time.value = [];
	getDataList();
};
// 导出
const exportExcel = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/pay/refund/exportMallRefundOrderPage', params, '退款流水统计表.xlsx');
};
</script>
<style lang="scss" scoped></style>
