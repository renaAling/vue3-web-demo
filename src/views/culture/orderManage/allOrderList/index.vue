<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- <el-row>
				<el-form size="small" inline label-position="right" :model="state.queryForm" @keyup.enter="getDataList" @submit.native.prevent ref="queryRef">
					<el-form-item label="订单类型：">
						<el-select v-model="state.queryForm.type" clearable size="small" placeholder="请选择" class="selWidth" @change="handleSearchList">
							<el-option v-for="(item, i) in fromType" :key="i" :label="item.text" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="时间选择：">
						<el-date-picker
							v-model="timeVal"
							value-format="yyyy-MM-dd"
							format="yyyy-MM-dd"
							size="small"
							type="daterange"
							placement="bottom-end"
							placeholder="自定义时间"
							@change="onchangeTime"
							class="selWidth"
						/>
					</el-form-item>
					<el-form-item label="订单编号：" label-width="66px">
						<el-input
							v-model.trim="state.queryForm.orderNo"
							placeholder="请输入订单编号"
							class="selWidth"
							size="small"
							clearable
							@keyup.enter.native="handleSearchList"
						/>
					</el-form-item>
					<el-form-item label="商户名称：">
						<merchant-name @getMerId="getMerId" :merIdChecked="state.queryForm.merId"></merchant-name>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="handleSearchList">查询</el-button>
						<el-button size="small" @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row> -->
		</div>
	</div>
</template>
<script lang="ts" setup>
// import { BasicTableProps, useTable } from '/@/hooks/table';
// import { isWriteOffFun } from '/@/utils/tools'
// import { getOrderList, orderSendAdd, batchOutBound } from '/@/api/culture/orderManage';
// const tableFroms = ref({
// 	status: 'all',
// 	dateLimit: '',
// 	orderNo: '',
// 	page: 1,
// 	limit: 20,
// 	merId: null,
// 	type: '',
// 	orderBy: 1,
// });
// const options = ref([
// 	{
// 		value: 0,
// 		label: '全部',
// 	},
// 	{
// 		value: 2,
// 		label: '商城订单',
// 	},
// 	{
// 		value: 1,
// 		label: '视频号订单',
// 	},
// ]);
// const RefuseVisible = ref(false);
// const RefuseData = ref({});
// const orderNo = ref('');
// const refundVisible = ref(false);
// const refundData = ref({});
// const dialogVisibleJI = ref(false);
// const tableDataLog = ref({
// 	data: [],
// 	total: 0,
// });
// const tableFromLog = ref({
// 	page: 1,
// 	limit: 10,
// 	orderNo: 0,
// });
// const LogLoading = ref(false);
// const isCreate = ref(1);
// const editData = ref(null);
// const dialogVisible = ref(false);
// const tableData = ref({
// 	data: [],
// 	total: 0,
// });
// const listLoading = ref(true);
// const tableFrom = ref(Object.assign({}, tableFroms));
// const orderChartType = ref({});
// const timeVal = ref([]);
// const fromList = ref(this.$constants.fromList);
// const fromType: [{ value: ''; text: '全部' }, { value: '0'; text: '普通' }, { value: '1'; text: '视频号' }, { value: '2'; text: '秒杀' }];
// const selectionList = ref([]);
// const ids = ref('');
// const orderids = ref('');
// const cardLists = ref([]);
// const isWriteOff = ref(isWriteOffFun());
// const proType = ref(0);
// const active = ref(false);
// const card_select_show = ref(false);
// const checkAll = ref(false);
// const checkedCities = ref(['订单编号', '商户名称', '用户昵称', '实际支付', '支付方式', '订单状态', '下单时间']);
// const columnData = ref(['订单编号', '商户名称', '用户昵称', '实际支付', '支付方式', '订单状态', '下单时间']);
// const isIndeterminate = ref(true);

// const state: BasicTableProps = reactive<BasicTableProps>({
// 	pageList: getOrderList,
// 	queryForm: {},
// 	dataList: [],
// });

// const // 具体日期
// 	onchangeTime = (e) => {
// 		timeVal.value = e;
// 		this.tableFrom.dateLimit = e ? timeVal.value.join(',') : '';
// 		this.tableFrom.page = 1;
// 		this.getList();
// 		this.getOrderStatusNum();
// 	};
</script>
