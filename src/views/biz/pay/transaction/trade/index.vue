<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="search" ref="queryRef">
					<el-col :span="24">
						<el-form-item label="中台单号" prop="payOrderId" label-width="68px">
							<el-input placeholder="请输入中台单号" style="width: 180px" v-model="state.queryForm.payOrderId" />
						</el-form-item>
						<el-form-item label="第三方交易单号" prop="goodsOrderId" label-width="110px">
							<el-input placeholder="请输入第三方交易单号" style="width: 180px" v-model="state.queryForm.goodsOrderId" />
						</el-form-item>
						<el-form-item label="订单来源渠道" prop="tenantId">
							<el-select placeholder="请选择订单来源渠道" style="width: 180px" clearable v-model="state.queryForm.tenantId">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in channelType" />
							</el-select>
						</el-form-item>
						<el-form-item label="支付方式" prop="payType">
							<el-select placeholder="请选择支付方式" style="width: 180px" clearable v-model="state.queryForm.payType">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in payType" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="支付状态" prop="status">
							<el-select placeholder="请选择支付状态" style="width: 180px" clearable v-model="state.queryForm.status">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in paymentStatus" />
							</el-select>
						</el-form-item>
						<el-form-item label="订单创建时间" prop="roleName">
							<date-compents
								ref="createDate"
								@getDate="(val) => ([state.queryForm.createStartTime, state.queryForm.createEndTime] = val)"
							></date-compents>
						</el-form-item>
						<el-form-item label="订单支付时间" prop="roleName">
							<date-compents
								ref="paySuccDate"
								@getDate="(val) => ([state.queryForm.paySuccStartTime, state.queryForm.paySuccEndTime] = val)"
							></date-compents>
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
			<el-row class="mb8 flex justify-between items-center">
				<div class="text-[#4785ea]">
					查询结果：<span class="text-[#E6A23C]">{{ state.pagination?.total }}</span> 条, 已勾选：<span class="text-[#E6A23C]">{{
						selectObjs.length
					}}</span>
					条。
				</div>
				<div>
					<el-button type="primary" class="mr10" @click="exportExcelAll" v-if="!ObjectValuesEmpty"> 全部导出 </el-button>
					<el-button type="primary" @click="exportExcel" :disabled="!selectObjs.length"> 导出 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				@selection-change="handleSelectionChange"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				row-key="id" border
			>
				<el-table-column align="center" type="selection" :reserve-selection="true" width="40" />
				<el-table-column label="序号" fixed type="index" width="60" />
				<el-table-column label="用户Id" prop="userId" show-overflow-tooltip width="120" />
				<el-table-column label="用户名称" prop="userName" show-overflow-tooltip width="120" />
				<el-table-column label="手机号" prop="mobile" show-overflow-tooltip width="120" />
				<el-table-column label="中台单号" prop="payOrderId" show-overflow-tooltip width="120" />
				<el-table-column label="第三方交易单号" prop="goodsOrderId" show-overflow-tooltip width="140" />
				<el-table-column label="支付渠道单号" prop="channelOrderNo" show-overflow-tooltip width="120" />
				<el-table-column label="交易金额(元)" prop="amount" show-overflow-tooltip width="100" />
				<el-table-column label="订单渠道来源" prop="channelName" show-overflow-tooltip width="120" />
				<el-table-column label="支付商户号" prop="channelMchId" show-overflow-tooltip width="120" />
				<el-table-column label="收款商户名称" prop="channelMchName" show-overflow-tooltip width="120" />
				<el-table-column label="支付方式" prop="payType" show-overflow-tooltip width="120">
					<template #default="scope">
						<dict-tag :options="payType" :value="scope.row.payType"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="支付状态" prop="status" show-overflow-tooltip width="130">
					<template #default="scope">
						<dict-tag :options="paymentStatus" :value="scope.row.status"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="订单创建时间" prop="createTime" show-overflow-tooltip width="160" />
				<el-table-column label="订单支付时间" prop="paySuccTime" show-overflow-tooltip width="160" />
				<el-table-column label="备注" prop="extra" show-overflow-tooltip width="100" />
				<el-table-column label="操作" prop="remark" show-overflow-tooltip width="100" fixed="right">
					<template #default="scope">
						<el-button text type="primary" @click="refoundMoney(scope.row)" v-if="scope.row.refundStatus != 2 && scope.row.refundStatus != 1">
							退款
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- <refund-dialog @refresh="getDataList(false)" ref="refundDialogRef" /> -->
	</div>
</template>

<script lang="ts" name="systemPayTradeOrder" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, channelList, directRefund } from '/@/api/pay/trade';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { paymentStatus, payType } from '/@/hooks/enums';

// 引入组件
const RefundDialog = defineAsyncComponent(() => import('./refund.vue'));
const dateCompents = defineAsyncComponent(() => import('../../components/index.vue'));
const { t } = useI18n();
// 定义查询字典

// 定义变量内容
const refundDialogRef = ref();
// 搜索变量
const queryRef = ref();
const paySuccDate = ref();
const createDate = ref();
const showSearch = ref(true);
const channelType = ref([]) as any;
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
const ObjectValuesEmpty = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

const getChannelList = () => {
	channelList().then((res) => {
		channelType.value = res.data.map((item: any) => {
			return { value: item.tenantId, label: item.name, elTagType: '' };
		});
	});
};
getChannelList();

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

const exportExcelAll = () => {
	downBlobFile('/pay/trade/exportAll', Object.assign(state.queryForm), '交易流水.xlsx');
};

const exportExcel = () => {
	downBlobFile('/pay/trade/exportScreen', { payOrderIds: selectObjs.value }, '交易流水.xlsx');
};

// 退款
const refoundMoney = async (data: any) => {
	try {
		await useMessageBox().confirm('确认要对该笔订单进行退款?');
	} catch {
		return;
	}
	try {
		await directRefund(data.payOrderId);
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const search = () => {
	ObjectValuesEmpty.value = areAllObjectValuesEmpty(state.queryForm);
	getDataList();
};

const areAllObjectValuesEmpty = (obj: any) => {
	if (obj == null || typeof obj !== 'object') {
		throw new TypeError('Expected an object');
	}
	const isEmpty = (value: any) => {
		if (value === undefined || value === null) return true;
		if (typeof value === 'string' && value.trim() === '') return true;
		if (typeof value === 'number' && Number.isNaN(value)) return true;
		if (Array.isArray(value) && value.length === 0) return true;
		if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return true;
		return false;
	};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (!isEmpty(obj[key])) {
				return false; // 如果有任何属性值不为空，则返回 false
			}
		}
	}
	return true;
};

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value.resetFields();
	paySuccDate.value.resetField();
	createDate.value.resetField();
	// 清空多选
	selectObjs.value = [];
	ObjectValuesEmpty.value = areAllObjectValuesEmpty(state.queryForm);
	nextTick(() => {
		getDataList();
	});
};

// 多选事件
const handleSelectionChange = (objs: { payOrderId: string }[]) => {
	selectObjs.value = objs.map(({ payOrderId }) => payOrderId);
	multiple.value = !objs.length;
};
</script>
