<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form class="ml10" :inline="true" :model="state.queryForm" @keyup.enter="search" ref="queryRef">
					<el-col :span="24">
						<el-form-item label="交易日期" prop="transactionDate">
							<el-date-picker
								v-model="state.queryForm.transactionDate"
								type="date"
								placeholder="请选择"
								:disabled-date="disabledDate"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
						<el-form-item label="对账批次" prop="reconciliationLot">
							<el-input placeholder="请输入对账批次" style="width: 180px" maxlength="30" v-model="state.queryForm.reconciliationLot" />
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
			<el-row class="mb16 ml10">
				<el-radio-group v-model="state.queryForm.type" @change="handleChange">
					<el-radio-button label="1">微信</el-radio-button>
					<el-radio-button label="4">支付宝</el-radio-button>
					<el-radio-button label="8">会员钱包</el-radio-button>
				</el-radio-group>
			</el-row>
			<el-table
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				row-key="id" border
			>
				<el-table-column label="序号" fixed type="index" width="60" />
				<el-table-column label="对账批次" prop="reconciliationLot" show-overflow-tooltip width="120" />
				<el-table-column label="交易日期" prop="transactionDate" show-overflow-tooltip width="160" />
				<el-table-column label="对账总笔数" prop="channelOrderNo" show-overflow-tooltip>
					<template #default="scope">
						<div class="flex items-center justify-center">
							<dict-tag :options="typeList" :value="scope.row.type"></dict-tag>
							<span>：</span>
							<span>{{ scope.row.channelTotalTransactions }}笔</span>
						</div>
						<div>中台：{{ scope.row.platformTotalTransactions }}笔</div>
					</template>
				</el-table-column>
				<el-table-column label="对账总金额" prop="channelOrderNo" show-overflow-tooltip>
					<template #default="scope">
						<div class="flex items-center justify-center">
							<dict-tag :options="typeList" :value="scope.row.type"></dict-tag>
							<div>：</div>
							<div>{{ scope.row.channelTotalAmount }}元</div>
						</div>
						<div>中台：{{ scope.row.platformTotalAmount }}元</div>
					</template>
				</el-table-column>
				<el-table-column label="对账差错结果" prop="channelOrderNo" show-overflow-tooltip>
					<template #default="scope">
						<div>{{ scope.row.channelReconciliationResult }}</div>
						<div>{{ scope.row.platformReconciliationResult }}</div>
					</template>
				</el-table-column>
				<el-table-column label="状态" prop="statusName" show-overflow-tooltip width="120" />
				<el-table-column label="操作" prop="remark" show-overflow-tooltip width="160" fixed="right">
					<template #default="scope">
						<el-button text type="primary" @click="downExcel(scope.row)"> 下载 </el-button>
						<el-button text type="primary" @click="toPath(scope.row)" v-if="scope.row != 2"> 差错明细 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemPayTradeOrder" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList, reconciliationExport } from '/@/api/pay/finance';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { typeList } from '/@/hooks/enums';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
// 定义查询字典

// 搜索变量
const queryRef = ref();
const showSearch = ref(true);

const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: '1',
	},
	pageList: pageList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

const search = () => {
	getDataList();
};

const downExcel = (item: any) => {
	const params = {
		type: state.queryForm.type,
		transactionDate: item.transactionDate,
		reconciliationLot: item.reconciliationLot,
	};
	reconciliationExport(params).then((res) => {
		router.push('/downloadCenter');
	});
};

const toPath = (item: any) => {
	router.push({ path: '/biz/pay/finance/reconciliation/errorDetail', query: { date: item.transactionDate, type: item.type } });
};

const handleChange = () => {
	getDataList();
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
<style scoped lang="scss">
::v-deep {
	.el-radio-button__inner {
		border-left: 1px solid #dcdfe6;
		border-radius: 0 !important;
	}

	.el-radio-button {
		margin-right: 20px;
	}
}
</style>
