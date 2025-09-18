<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-row>
						<el-form-item label="时间">
							<el-date-picker
								v-model="time"
								type="daterange"
								range-separator="-"
								start-placeholder="请选择开始时间"
								end-placeholder="请选择结束时间"
								value-format="YYYY-MM-DD"
								style="width: 380px"
							/>
						</el-form-item>
						<el-form-item label="支付渠道" label-width="68px">
							<el-select placeholder="请选择" v-model="state.queryForm.paymentMethod" style="width: 180px">
								<el-option v-for="(item, key) in paymentMethodMaps" :key="key" :label="item" :value="key"></el-option>
							</el-select>
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
				<el-table-column prop="paymentSerialNumber" label="支付流水号" />
				<el-table-column prop="orderNumber" label="订单号">
					<template #default="scope">
						<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.orderNumber)">{{ scope.row.orderNumber }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="paymentTime" label="支付时间" />
				<el-table-column prop="phone" label="用户手机号" />
				<el-table-column prop="paymentChannel" label="支付渠道" />
				<el-table-column prop="transactionStatus" label="交易状态">
					<template #default="{ row }">
						<el-tag>{{ row.transactionStatus }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="paymentAmount" label="支付金额" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="payStatements">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { downBlobFile } from '/@/utils/other';
import { orderPaymentList } from '/@/api/culture/statics';
const router = useRouter();
const time = ref([]);
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: orderPaymentList,
	queryForm: {},
	dataList: [],
});

const paymentMethodMaps = {
	1: '微信支付',
	8: '员工卡余额',
	3: '账户余额',
	4: '积分抵扣',
	5: '储值账户',
};
const handleGoDetail = (orderNo: string) => {
	router.push({
		path: '/culture/orderManage/orderList/orderDetail',
		query: {
			orderNo,
		},
	});
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
	state.queryForm.paymentMethod = '';
	getDataList();
};
// 导出
const exportExcel = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/pay/trade/exportMallTradeOrderPage', params, '支付统计流水表.xlsx');
};
</script>
<style lang="scss" scoped></style>
