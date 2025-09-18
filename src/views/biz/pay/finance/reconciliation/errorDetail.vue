<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="search" ref="queryRef">
					<el-col :span="24">
						<el-form-item label="对账批次" prop="reconciliationLot">
							<el-input placeholder="请输入对账批次" maxlength="30" style="width: 180px" v-model="state.queryForm.reconciliationLot" />
						</el-form-item>
						<el-form-item label="中台单号" prop="payOrderId">
							<el-input placeholder="请输入中台单号" maxlength="30" style="width: 180px" v-model="state.queryForm.payOrderId" />
						</el-form-item>
						<el-form-item label="第三方交易单号" prop="goodsOrderId">
							<el-input placeholder="请输入第三方交易单号" maxlength="30" style="width: 180px" v-model="state.queryForm.goodsOrderId" />
						</el-form-item>
						<el-form-item label="支付渠道单号" prop="channelOrderNo">
							<el-input placeholder="请输入支付渠道单号" maxlength="30" style="width: 180px" v-model="state.queryForm.channelOrderNo" />
						</el-form-item>
						<el-form-item label="处理状态" prop="processingStatus">
							<el-select placeholder="请选择处理状态" style="width: 180px" clearable v-model="state.queryForm.processingStatus">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in processingList" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button icon="search" type="primary" @click="search">
								{{ $t('common.queryBtn') }}
							</el-button>
							<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
			<el-row class="mb8 flex justify-end items-center">
				<div>
					<el-button type="primary" @click="exportExcelAll"> 导出 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				row-key="id" border
			>
				<!-- <el-table-column align="center" type="selection" :reserve-selection="true" width="40" /> -->
				<el-table-column label="序号" fixed type="index" width="60" />
				<el-table-column label="对账批次" prop="reconciliationLot" show-overflow-tooltip width="120" />
				<el-table-column label="中台单号" prop="payOrderId" show-overflow-tooltip width="120" />
				<el-table-column label="第三方交易单号" prop="goodsOrderId" show-overflow-tooltip width="140" />
				<el-table-column label="支付渠道单号" prop="channelOrderNo" show-overflow-tooltip width="140" />
				<el-table-column label="交易日期" prop="transactionDate" show-overflow-tooltip width="160" />
				<el-table-column label="交易类型" prop="transactionTypeName" show-overflow-tooltip width="120" />
				<el-table-column label="交易渠道" prop="channelTypeName" show-overflow-tooltip width="120" />
				<el-table-column label="对账金额(元)" prop="refundAmount" show-overflow-tooltip width="160">
					<template #default="scope">
						<div class="flex items-center justify-center">
							<dict-tag :options="typeList" :value="scope.row.channelType"></dict-tag>
							<div>：</div>
							<div>{{ scope.row.channelTotalAmount }}</div>
						</div>
						<div>中台：{{ scope.row.platformTotalAmount }}</div>
					</template>
				</el-table-column>
				<el-table-column label="对账结果" prop="reconciliationResult" show-overflow-tooltip width="120" />
				<el-table-column label="处理状态" prop="status" show-overflow-tooltip width="120">
					<template #default="scope">
						<dict-tag :options="processingList" :value="scope.row.processingStatus"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" prop="remark" show-overflow-tooltip width="100" fixed="right">
					<template #default="scope">
						<el-button text type="primary" @click="toPath(scope.row)">
							{{ scope.row.processingStatus == 2 ? '查看处理明细' : '去处理' }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemPayTradeOrder" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ErrorDetailsPage, exportErrorDetails } from '/@/api/pay/finance';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { typeList } from '/@/hooks/enums';

// 引入组件
const { t } = useI18n();
const router = useRouter();
const { query } = useRoute();
const processingList = ref([
	{
		label: '待处理',
		value: '1',
		elTagType: '',
	},
	{
		label: '已处理',
		value: '2',
		elTagType: '',
	},
]);
// 定义查询字典

// 搜索变量
const queryRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		transactionDate: query.date,
	},
	pageList: ErrorDetailsPage,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

const exportExcelAll = () => {
	const params = {
		type: query.type,
	};
	exportErrorDetails(params).then((res) => {
		router.push('/downloadCenter');
	});
};

const search = () => {
	getDataList();
};

// 退款
const toPath = async (data: any) => {
	router.push({ path: '/biz/pay/finance/reconciliation/errorHandling', query: { listInfo: JSON.stringify(data) } });
};

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value.resetFields();
	nextTick(() => {
		getDataList();
	});
};
</script>
