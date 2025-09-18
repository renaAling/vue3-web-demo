<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="售后单号" prop="refundOrderNo">
						<el-input placeholder="请输入单号" v-model="state.queryForm.refundOrderNo" clearable style="width: 240px" maxlength="50" />
					</el-form-item>
					<el-form-item label="订单编号" prop="orderNo">
						<el-input placeholder="请输入订单编号" v-model="state.queryForm.orderNo" clearable style="width: 240px" maxlength="50" />
					</el-form-item>
					<el-form-item label="商家名称" prop="merchantCode">
						<el-select
							v-model="state.queryForm.merchantCode"
							filterable
							remote
							reserve-keyword
							style="width: 240px"
							placeholder="请输入关键字查询搜索"
							:remote-method="(val: string) => getMerchantsList(val)"
							:loading="loading"
						>
							<el-option v-for="item in merchantsList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="门店名称" prop="storeCode">
						<el-select
							v-model="state.queryForm.storeCode"
							filterable
							remote
							reserve-keyword
							style="width: 240px"
							placeholder="请输入关键字查询搜索"
							:remote-method="(val: string) => getStoreList(val)"
							:loading="loading"
						>
							<el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="退款状态" prop="refundStatus">
						<el-select v-model="state.queryForm.refundStatus" default-first-option clearable style="width: 240px">
							<el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="售后类型" prop="type">
						<el-select v-model="state.queryForm.type" default-first-option clearable style="width: 240px">
							<el-option v-for="(item, index) in refundType" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间" prop="dateLimit">
						<el-date-picker
							v-model="createTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
							@change="craetDate"
						/>
					</el-form-item>
					<el-form-item label="退款时间" prop="refundDateLimit">
						<el-date-picker
							v-model="refundTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
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
					<el-button @click="handleDownload" class="ml10" icon="download" type="primary"> 下载 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="售后单号" prop="refundOrderNo" show-overflow-tooltip />
				<el-table-column label="订单编号" prop="orderNo" show-overflow-tooltip />
				<el-table-column label="售后类型" prop="refundStatus">
					<template #default="{ row }">
						<dict-tag :options="refundType" :value="row.type"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="商家" prop="merName" show-overflow-tooltip />
				<el-table-column label="门店" prop="storeName" show-overflow-tooltip>
					<!-- <template #default="{ row }">
						<div>{{ row.storeName }}</div>
						<div>{{ row.storeCode }}</div>
					</template> -->
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip />
				<el-table-column label="退款时间" prop="refundTime" show-overflow-tooltip />
				<el-table-column label="退款状态" prop="refundStatus">
					<template #default="{ row }">
						<dict-tag :options="orderStatusList" :value="row.refundStatus"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="退款方式" prop="paymentMethod">
					<template #default="{ row }">
						<dict-tag :options="payTypeList" :value="row.paymentMethod"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="退款金额" prop="refundPrice" />
				<el-table-column label="操作">
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
import { pageList, afterSaleExcel } from '/@/api/goodStore/afterSales';
import { downBlobFile } from '/@/utils/other';
import { merchantListApi } from '/@/api/trcomps/merchant';
import { storePageApi } from '/@/api/trcomps/store';
import { useMessage, useMessageBox } from '/@/hooks/message';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义变量内容
const formDialogRef = ref();
const router = useRouter();
// 搜索变量
const queryRef = ref();
const refundTime = ref([]);
const createTime = ref([]);
const merchantsList = ref<
	Array<{
		label?: string;
		value?: number | string;
	}>
>([]);
const storeList = ref<
	Array<{
		label?: string;
		value?: number | string;
	}>
>([]);

const loading = ref(false);
let keywords: any;
const getMerchantsList = async (query: string | undefined) => {
	if (keywords === query) return;
	keywords = query;
	loading.value = true;
	try {
		const params = {
			keywords: query,
			page: 1,
			limit: 20,
		};
		const { data, code, msg } = await merchantListApi(params);
		loading.value = false;
		if (code === 0) {
			const list = data?.records?.map((item: any) => {
				return {
					label: item.name,
					value: item.merchantCode,
				};
			});
			merchantsList.value = list;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		console.log('err', err);
		useMessage().error(err.msg);
	}
};
let storekeywords: any;
const getStoreList = async (query: string | undefined) => {
	if (storekeywords === query) return;
	storekeywords = query;
	loading.value = true;
	try {
		const params = {
			storeName: query,
			page: 1,
			limit: 20,
		};
		const { data, code, msg } = await storePageApi(params);
		loading.value = false;
		if (code === 0) {
			const list = data?.records?.map((item: any) => {
				return {
					label: item.storeName,
					value: item.storeCode,
				};
			});
			storeList.value = list;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 售后状态枚举
const orderStatusList = ref([
	{
		label: '待审核',
		value: '0',
		elTagType: '',
	},
	{
		label: '商家拒绝',
		value: '1',
		elTagType: '',
	},
	{
		label: '退款中',
		value: '2',
		elTagType: '',
	},
	{
		label: '已退款',
		value: '3',
		elTagType: '',
	},
	{
		label: '用户退货',
		value: '4',
		elTagType: '',
	},
	{
		label: '商家待收货',
		value: '5',
		elTagType: '',
	},
	{
		label: '已撤销',
		value: '6',
		elTagType: '',
	},
]);

const payTypeList = ref([
	{
		label: '微信',
		value: '1',
		elTagType: '',
	},
	{
		label: '支付宝',
		value: '2',
		elTagType: '',
	},
	{
		label: '员工卡',
		value: '8',
		elTagType: '',
	},
]);

const refundType = ref([
	{
		label: '后台退款',
		value: '1',
		elTagType: '',
	},
	{
		label: '渠道退款',
		value: '2',
		elTagType: '',
	},
]);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList,
	queryForm: {
		orderType: 7,
	},
});

const craetDate = (val: any) => {
	console.log(val);
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

watch([() => refundTime.value, () => createTime.value], (val) => {
	state.queryForm.dateLimit = val[1].join(',');
	state.queryForm.refundDateLimit = val[0].join(',');
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	refundTime.value = [];
	createTime.value = [];
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
	afterSaleExcel(state.queryForm).then((res) => {
		router.push('/downloadCenter');
	});
};
</script>
