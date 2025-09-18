<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="search" ref="queryRef">
					<el-col :span="24">
						<el-form-item label="中台单号" prop="payOrderId" label-width="68px">
							<el-input placeholder="请输入中台单号" style="width: 180px" v-model="state.queryForm.payOrderId" />
						</el-form-item>
						<el-form-item label="中台退款单号" prop="refundOrderId">
							<el-input placeholder="请输入中台退款单号" style="width: 180px" v-model="state.queryForm.refundOrderId" />
						</el-form-item>
						<!-- <el-form-item label="订单渠道" prop="tenantId">
							<el-select placeholder="请选择订单渠道" style="width: 180px" clearable v-model="state.queryForm.tenantId">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in channelType" />
							</el-select>
						</el-form-item> -->
						<el-form-item label="退款状态" prop="status">
							<el-select placeholder="请选择退款状态" style="width: 180px" clearable v-model="state.queryForm.status">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in refundStatus" />
							</el-select>
						</el-form-item>
						<el-form-item label="退回账户" prop="payType">
							<el-select placeholder="请选择退款账户" style="width: 180px" clearable v-model="state.queryForm.payType">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in payType" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="退款操作时间" prop="roleName">
							<date-compents
								ref="dateName"
								@getDate="(val) => ([state.queryForm.createStartTime, state.queryForm.createEndTime] = val)"
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
				<el-table-column label="中台退款单号" prop="refundOrderId" show-overflow-tooltip width="140" />
				<el-table-column label="第三方退款单号" prop="mchRefundNo" show-overflow-tooltip width="140" />
				<el-table-column label="支付渠道退款单号" prop="channelRefundOrderNo" show-overflow-tooltip width="140" />
				<el-table-column label="退款金额(元)" prop="refundAmount" show-overflow-tooltip width="100" />
				<!-- <el-table-column label="订单来源渠道" prop="channelName" show-overflow-tooltip width="120" /> -->
				<el-table-column label="支付商户号" prop="channelMchId" show-overflow-tooltip width="120" />
				<el-table-column label="收款商户名称" prop="channelMchName" show-overflow-tooltip width="120" />
				<el-table-column label="退款状态" prop="status" show-overflow-tooltip width="120">
					<template #default="scope">
						<dict-tag :options="refundStatus" :value="scope.row.status"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="退回账户" prop="payType" show-overflow-tooltip width="120">
					<template #default="scope">
						<dict-tag :options="payType" :value="scope.row.payType"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="退款操作时间" prop="createTime" show-overflow-tooltip width="160" />
				<el-table-column label="备注" prop="remark" show-overflow-tooltip width="100" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemPayTradeOrder" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, channelList } from '/@/api/pay/refund';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { payType, refundStatus } from '/@/hooks/enums';

// 引入组件
const dateCompents = defineAsyncComponent(() => import('../../components/index.vue'));
const { t } = useI18n();
// 定义查询字典

// 搜索变量
const queryRef = ref();
const dateName = ref();
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
	downBlobFile('/pay/refund/exportAll', Object.assign(state.queryForm), '退款流水.xlsx');
};

const exportExcel = () => {
	downBlobFile('/pay/refund/exportScreen', { refundOrderIds: selectObjs.value }, '退款流水.xlsx');
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
	dateName.value.resetField();
	// 清空多选
	selectObjs.value = [];
	ObjectValuesEmpty.value = areAllObjectValuesEmpty(state.queryForm);
	nextTick(() => {
		getDataList();
	});
};

// 多选事件
const handleSelectionChange = (objs: { refundOrderId: string }[]) => {
	selectObjs.value = objs.map(({ refundOrderId }) => refundOrderId);
	multiple.value = !objs.length;
};
</script>
