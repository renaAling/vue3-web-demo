<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="search">
					<el-col :span="24">
						<el-form-item label="交易单号" prop="rechargeStream" label-width="68px">
							<el-input placeholder="请输入交易单号" style="width: 180px" v-model="state.queryForm.rechargeStream" />
						</el-form-item>
						<el-form-item label="第三方交易单号" prop="thirdRechargeStream" label-width="110px">
							<el-input placeholder="请输入第三方交易单号" style="width: 180px" v-model="state.queryForm.thirdRechargeStream" />
						</el-form-item>
						<el-form-item label="订单渠道" prop="accountType">
							<el-select placeholder="请选择订单渠道" style="width: 180px" clearable v-model="state.queryForm.accountType">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in rechargeType" />
							</el-select>
						</el-form-item>
						<el-form-item label="订单状态" prop="accountType">
							<el-select placeholder="请选择订单状态" style="width: 180px" clearable v-model="state.queryForm.accountType">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in rechargeType" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="支付方式" prop="accountType">
							<el-select placeholder="请选择支付方式" style="width: 180px" clearable v-model="state.queryForm.accountType">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in rechargeType" />
							</el-select>
						</el-form-item>
						<el-form-item label="支付状态" prop="accountType">
							<el-select placeholder="请选择支付状态" style="width: 180px" clearable v-model="state.queryForm.accountType">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in rechargeType" />
							</el-select>
						</el-form-item>
						<el-form-item label="订单创建时间" prop="roleName">
							<el-date-picker
								v-model="state.queryForm.transactionTimeBegin"
								value-format="YYYY-MM-DD"
								style="width: 180px"
								type="date"
								placeholder="开始时间"
								:disabled-date="disabledBenginDate"
							/>
							<span class="mx-2">-</span>
							<el-date-picker
								v-model="state.queryForm.transactionTimeEnd"
								value-format="YYYY-MM-DD"
								style="width: 180px"
								type="date"
								placeholder="结束时间"
								:disabled-date="disabledEndDate"
							/>
						</el-form-item>
						<el-form-item label="订单支付时间" prop="roleName">
							<el-date-picker
								v-model="state.queryForm.transactionTimeBegin"
								value-format="YYYY-MM-DD"
								style="width: 180px"
								type="date"
								placeholder="开始时间"
								:disabled-date="disabledBenginDate"
							/>
							<span class="mx-2">-</span>
							<el-date-picker
								v-model="state.queryForm.transactionTimeEnd"
								value-format="YYYY-MM-DD"
								style="width: 180px"
								type="date"
								placeholder="结束时间"
								:disabled-date="disabledEndDate"
							/>
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
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="download" type="primary" class="float-right" @click="exportExcel"> 导出表格 </el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="rechargeStream" label="流水号" width="160" show-overflow-tooltip></el-table-column>
				<el-table-column prop="thirdRechargeStream" label="第三方交易流水号" width="170" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userId" label="用户ID" width="180" show-overflow-tooltip></el-table-column>
				<el-table-column prop="username" label="用户姓名" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userJobNumber" label="工号" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机号" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="transactionNumber" label="交易金额(元)" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cardAccount" label="交易后餐补账户余额(元)" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cashAccount" label="交易后现金账户余额(元)" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleName" label="支出账户" width="100" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="rechargeType" :value="scope.row.accountType"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column prop="merchantNumber" label="商户号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="transactionTime" label="交易时间" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="notes" label="备注" show-overflow-tooltip></el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="reportFlowList">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义变量内容
const queryRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: undefined,
});

const rechargeType = ref([
	{
		label: '餐补账户',
		value: '1',
		elTagType: '',
	},
	{
		label: '现金账户',
		value: '2',
		elTagType: '',
	},
]);

const search = () => {
	if (
		!(
			(state.queryForm.transactionTimeBegin && state.queryForm.transactionTimeEnd) ||
			(!state.queryForm.transactionTimeBegin && !state.queryForm.transactionTimeEnd)
		)
	) {
		return useMessage().error('请完整选择开始/结束时间！');
	}
	getDataList();
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

const exportExcel = () => {
	if (state.pagination?.total && state.pagination?.total >= 100000) {
		const msg = `当前数据超过10万条,仅能导出前10万条,其余数据请您分批次导出`;
		ElMessageBox.confirm(msg, '系统提示', {
			confirmButtonText: '确认导出',
			type: 'warning',
		}).then(() => {
			downBlobFile('/admin/transaction/getExcel', Object.assign(state.queryForm), '交易流水.xlsx');
		});
	} else {
		downBlobFile('/admin/transaction/getExcel', Object.assign(state.queryForm), '交易流水.xlsx');
	}
};

const disabledBenginDate = computed(() => {
	return (time: any) => {
		if (!state.queryForm.transactionTimeEnd) return false; // 如果没有设置开始日期，则不限制结束日期
		const eddDateValue = new Date(state.queryForm.transactionTimeEnd);
		const startDateLimit = new Date(eddDateValue);
		startDateLimit.setMonth(startDateLimit.getMonth() - 3); // 90天后的日期作为限制
		// 禁用开始日期之前的日期和90天后的日期
		return time.getTime() > eddDateValue.getTime() || time.getTime() < startDateLimit.getTime();
	};
});

// 根据开始日期动态计算结束日期的禁用日期
const disabledEndDate = computed(() => {
	return (time: any) => {
		if (!state.queryForm.transactionTimeBegin) return false; // 如果没有设置开始日期，则不限制结束日期
		const startDateValue = new Date(state.queryForm.transactionTimeBegin);
		const endDateLimit = new Date(startDateValue);
		endDateLimit.setMonth(endDateLimit.getMonth() + 3); // 90天后的日期作为限制
		// 禁用开始日期之前的日期和90天后的日期
		return time.getTime() < startDateValue.getTime() || time.getTime() > endDateLimit.getTime();
	};
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.transactionTimeBegin = '';
	state.queryForm.transactionTimeEnd = '';
	getDataList();
};
</script>
