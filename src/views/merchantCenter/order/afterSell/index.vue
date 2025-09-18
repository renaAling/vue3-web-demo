<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="售后单号" prop="orderCode">
						<el-input placeholder="请输入售后单号" v-model="state.queryForm.orderCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="支付单号" prop="orderCode">
						<el-input placeholder="请输入支付单号" v-model="state.queryForm.orderCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="商家ID" prop="merchantCode">
						<el-input placeholder="请输入商家ID" v-model="state.queryForm.merchantCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="门店ID" prop="storeCode">
						<el-input placeholder="请输入门店ID" v-model="state.queryForm.storeCode" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="售后状态" prop="refundStatus">
						<el-select v-model="state.queryForm.refundStatus" default-first-option clearable style="width: 230px">
							<el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="退款时间" prop="refundTime">
						<el-date-picker
							v-model="refundTime"
							type="datetimerange"
							range-separator="-"
							style="width: 400px"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							clearable
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
					<el-button plain @click="handleDownload" class="ml10" icon="download" type="primary"> 下载 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="售后单号" prop="refundCode" />
				<el-table-column label="支付单号" prop="orderCode" />
				<el-table-column label="商家" prop="merchantName" show-overflow-tooltip />
				<el-table-column label="门店" prop="storeName" show-overflow-tooltip>
					<template #default="{ row }">
						<div>{{ row.storeName }}</div>
						<div>{{ row.storeCode }}</div>
					</template>
				</el-table-column>
				<el-table-column label="退款时间" prop="refundTime" />
				<el-table-column label="售后状态" prop="refundStatus">
					<template #default="{ row }">
						<span v-if="row.refundStatus === 1">退款中</span>
						<span v-else-if="row.refundStatus === 2">已退款</span>
						<span v-else>已关闭</span>
					</template>
				</el-table-column>
				<el-table-column label="微信支付退回（元）" prop="wechatReturnedAmount" />
				<el-table-column label="员工卡余额退回（元）" prop="cardReturnedAmount" />
				<el-table-column label="退款总额（元）" prop="refundTotalAmount" />
				<el-table-column label="操作" width="240">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('detail', row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="outletList" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getSellList } from '/@/api/goodStore/afterSell';
import { downFileAddTask } from '/@/utils/other';
import { useMessageBox } from '/@/hooks/message';
import router from '/@/router';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const refundTime = ref([]);

watch(
	() => refundTime.value,
	(val) => {
		if (!val) {
			state.queryForm.refundTimeStart = '';
			state.queryForm.refundTimeEnd = '';
		} else {
			state.queryForm.refundTimeStart = val[0];
			state.queryForm.refundTimeEnd = val[1];
		}
	}
);
// 售后状态枚举
const orderStatusList = ref([
	{
		label: '退款中',
		value: 1,
	},
	{
		label: '已退款',
		value: 2,
	},
	{
		label: '已关闭',
		value: 3,
	},
]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getSellList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	refundTime.value = [];
	state.queryForm.refundTimeStart = '';
	state.queryForm.refundTimeEnd = '';
	getDataList();
};

const handleCommand = async (command: Table.Command, row: any) => {
	switch (command) {
		case 'detail':
			formDialogRef.value.openDialog(row);
			break;
	}
};

const handleDownload = async () => {
	const { orderCode, merchantCode, storeCode, refundStatus } = state.queryForm;
	const query = {
		orderCode: orderCode,
		merchantCode: merchantCode,
		storeCode: storeCode,
		refundStatus: refundStatus,
		refundTimeStart: refundTime.value && refundTime.value.length > 0 ? refundTime.value[0] : null,
		refundTimeEnd: refundTime.value && refundTime.value.length > 0 ? refundTime.value[1] : null,
	};

	const { code } = await downFileAddTask('/mall/refundManage/export', query);
	if (code === 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
		router.push('/downloadCenter');
	}
};
</script>
