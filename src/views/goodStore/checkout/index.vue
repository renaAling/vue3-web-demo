<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-if="!isMerchant">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="商家ID" prop="merchantCode" v-if="!isMerchant">
						<el-input placeholder="请输入商家ID查询" v-model="state.queryForm.merchantCode" clearable />
					</el-form-item>
					<el-form-item label="商家名称" prop="merchantName">
						<el-input placeholder="请输入门店名称查询" v-model="state.queryForm.merchantName" clearable />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row v-if="!isMerchant">
				<div class="mb8" style="width: 100%">
					<el-button @click="configDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">新建</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" fixed="left" />
				<el-table-column label="结账方式" prop="name" />
				<el-table-column label="商家" prop="merchantName" show-overflow-tooltip v-if="!isMerchant">
					<template #default="{ row }">
						<div>{{ row.merchantName }}</div>
						<div>{{ row.merchantCode }}</div>
					</template>
				</el-table-column>
				<el-table-column label="支付优惠" prop="paymentDiscount">
					<template #default="{ row }">
						<div>{{ row.paymentDiscount != '1' ? (Number(row.paymentDiscount) * 10).toFixed(3) + '折' : '无优惠' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="结算折扣" prop="settlementDiscount">
					<template #default="{ row }">
						<div>{{ row.settlementDiscount ? (Number(row.settlementDiscount) * 10).toFixed(3) + '折' : '无折扣' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="规则" prop="ruleType" v-if="isMerchant">
					<template #default="{ row }">
						<div>{{ row.ruleType == 1 ? `每人每天可用次数为${row.availableTimes || 0}次` : `每人每天最多支付${row.availableAmount || 0}` }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="140">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="configDialogRef.openDialog(row.id)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 门店配置  -->
		<config-dialog @refresh="getDataList()" ref="configDialogRef" />
	</div>
</template>

<script lang="ts" name="gs-checkout" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { checkoutPage } from '/@/api/goodStore/merchant';
import { Session } from '/@/utils/storage';
// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
// 判断是否为好店-商家
const isMerchant = computed(() => (Session.getTenant()=== '1817759704625901569' ? true : false));
const queryRef = ref();

// 定义变量内容
const configDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: checkoutPage,
	queryForm: {},
	dataList: [],
	descs: ['create_time'],
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
