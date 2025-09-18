<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="title">查询对账单</div>
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="查询日期" prop="paymentTime">
						<el-date-picker
							v-model="paymentTime"
							:clearable="false"
							@change="changeTime"
							type="daterange"
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
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleDownload" icon="download" type="primary" :disabled="!state.pagination?.total">导出报表</el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				row-key="orderCode"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<!-- <el-table-column type="index" width="40" align="center" /> -->
				<el-table-column label="时间区间" prop="date" width="180" />
				<el-table-column label="支付订单数" prop="paymentCount" />
				<el-table-column label="支付金额" prop="paymentAmount" />
				<el-table-column label="商品金额" prop="goodsAmount" />
				<el-table-column label="邮费金额" prop="shippingCost" />
				<el-table-column label="退款订单数" prop="refundCount" />
				<el-table-column label="退款金额" prop="refundAmount" />
				<el-table-column label="退款商品金额" prop="refundGoodsAmount" />
				<el-table-column label="退款运费金额" prop="refundShippingCost" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { culturalList, culturalExcelExport } from '/@/api/culture/saleManage';
import { useMessageBox } from '/@/hooks/message';
import { formatDate } from '/@/utils/formatTime';
const router = useRouter();

// 搜索变量
const queryRef = ref();
const paymentTime = ref([] as any);

onMounted(() => {
	paymentTime.value = [formatDate(new Date(), 'YYYY-mm-dd'), formatDate(new Date(), 'YYYY-mm-dd')];
	nextTick(() => {
		getDataList();
	});
});

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: culturalList,
	queryForm: {},
	dataList: [],
	createdIsNeed: false,
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

const handleDownload = async () => {
	const res = await culturalExcelExport(state.queryForm);
	if (res.code == 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
		router.push('/downloadCenter');
	}
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [formatDate(new Date(), 'YYYY-mm-dd'), formatDate(new Date(), 'YYYY-mm-dd')];
	state.queryForm.dateStart = formatDate(new Date(), 'YYYY-mm-dd');
	state.queryForm.dateEnd = formatDate(new Date(), 'YYYY-mm-dd');
	getDataList();
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
