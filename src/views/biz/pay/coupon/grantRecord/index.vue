<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="search" ref="queryRef">
					<el-col :span="24">
						<el-form-item label="用户Id" prop="userId">
							<el-input placeholder="请输入用户Id" style="width: 180px" v-model="state.queryForm.userId" />
						</el-form-item>
						<el-form-item label="绑定手机号" prop="mobile">
							<el-input placeholder="请输入绑定手机号" style="width: 180px" v-model="state.queryForm.mobile" />
						</el-form-item>
						<el-form-item label="卡券编码" prop="couponCode">
							<el-input placeholder="请输入卡券编码" style="width: 180px" v-model="state.queryForm.couponCode" />
						</el-form-item>
						<el-form-item label="发放平台" prop="issuingPlatformType">
							<el-select placeholder="请选择发放平台" style="width: 180px" clearable v-model="state.queryForm.issuingPlatformType">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in typeLists" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="发放时间" prop="roleName">
							<date-compents
								ref="createDate"
								@getDate="(val) => ([state.queryForm.issuingTimeStartTime, state.queryForm.issuingTimeEndTime] = val)"
							></date-compents>
						</el-form-item>
						<el-form-item label="发放状态" prop="issuingStatus">
							<el-select placeholder="请选择发放状态" style="width: 180px" clearable v-model="state.queryForm.issuingStatus">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in couponStatusList" />
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
					<el-button type="primary" class="mr10" @click="exportExcelAll"> 导出 </el-button>
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
				<el-table-column label="序号" fixed type="index" width="60" />
				<el-table-column label="用户Id" prop="userId" show-overflow-tooltip width="120" />
				<el-table-column label="用户名称" prop="userName" show-overflow-tooltip width="100" />
				<el-table-column label="绑定手机号" prop="mobile" show-overflow-tooltip width="120" />
				<el-table-column label="卡券编码" prop="couponCode" show-overflow-tooltip width="120" />
				<el-table-column label="卡券金额(元)" prop="amount" show-overflow-tooltip width="100" />
				<el-table-column label="发放平台" prop="issuingPlatformTypeName" show-overflow-tooltip width="120" />
				<el-table-column label="发放时间" prop="issuingTime" show-overflow-tooltip width="160" />
				<el-table-column label="发放状态" prop="issuingStatusName" show-overflow-tooltip width="120" />
				<el-table-column label="" prop="couponValidityDate" show-overflow-tooltip width="160">
					<template #header>
						<div>卡券有效</div>
						<div>截止日期</div>
					</template>
				</el-table-column>
				<el-table-column label="操作人" prop="operator" show-overflow-tooltip width="100" />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemPayTradeOrder" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageDiscount, pageDiscountExport } from '/@/api/pay/finance';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { typeLists } from '/@/hooks/enums';

// 引入组件
const dateCompents = defineAsyncComponent(() => import('../../components/index.vue'));
const { t } = useI18n();
// 定义查询字典

// 搜索变量
const router = useRouter();
const queryRef = ref();
const createDate = ref();
const showSearch = ref(true);
const couponStatusList = ref([
	{
		label: '成功',
		value: '1',
		elTagType: '',
	},
	{
		label: '失败',
		value: '2',
		elTagType: '',
	},
]);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageDiscount,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

const exportExcelAll = () => {
	pageDiscountExport(state.queryForm).then((res) => {
		router.push('/downloadCenter');
	});
};

const search = () => {
	// if (
	// 	!(
	// 		(state.queryForm.transactionTimeBegin && state.queryForm.transactionTimeEnd) ||
	// 		(!state.queryForm.transactionTimeBegin && !state.queryForm.transactionTimeEnd)
	// 	)
	// ) {
	// 	return useMessage().error('请完整选择开始/结束时间！');
	// }
	getDataList();
};

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value.resetFields();
	createDate.value.resetField();
	nextTick(() => {
		getDataList();
	});
};
</script>
