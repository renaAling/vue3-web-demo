<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="售后单号" label-width="80px" prop="refundOrderNo">
						<el-input
							v-model.trim="state.queryForm.refundOrderNo"
							placeholder="请输入售后单号"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						>
						</el-input>
					</el-form-item>
					<el-form-item label="订单编号" label-width="80px" prop="orderNo">
						<el-input
							v-model.trim="state.queryForm.orderNo"
							placeholder="请输入订单号"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<el-form-item label="快递单号" label-width="80px" prop="trackingNumber">
						<el-input
							v-model.trim="state.queryForm.trackingNumber"
							placeholder="请输入快递单号"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<el-form-item label="用户手机号" label-width="90px" prop="telephone">
						<el-input
							v-model.trim="state.queryForm.telephone"
							placeholder="请输入用户手机号"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<el-form-item label="供应商名称" label-width="90px" prop="merId">
						<el-select v-model="state.queryForm.merId" clearable placeholder="请选择" class="selWidth" @change="handleSearchList">
							<el-option v-for="(item, index) in selectMerId" :key="index" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item label="发起时间" label-width="80px" prop="dateLimit">
						<el-date-picker
							v-model="state.queryForm.dateLimit"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item label="退款时间" label-width="80px" prop="refundDateLimit">
						<el-date-picker
							v-model="state.queryForm.refundDateLimit"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearchList">查询</el-button>
						<el-button @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="exports" type="primary">记录导出</el-button>
				</div>
			</el-row>
			<el-tabs class="list-tabs" v-model="state.queryForm.refundStatus" @tab-change="handleSearchList">
				<!-- 这里要改值 -->
				<el-tab-pane name="9" :label="`全部(${orderChartType.all || 0})`"></el-tab-pane>
				<el-tab-pane name="0" :label="`待运营审核(${orderChartType.await || 0})`"></el-tab-pane>
				<el-tab-pane name="7" :label="`待财务审核(${orderChartType.financialNum || 0})`"></el-tab-pane>
				<el-tab-pane name="2" :label="`退款中(${orderChartType.refunding || 0})`"></el-tab-pane>
				<el-tab-pane name="6" :label="`已撤销(${orderChartType.revoke || 0})`"></el-tab-pane>
				<el-tab-pane name="1" :label="`审核未通过(${orderChartType.reject || 0})`"></el-tab-pane>
				<el-tab-pane name="3" :label="`已退款(${orderChartType.refunded || 0})`"></el-tab-pane>
			</el-tabs>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="售后单号" min-width="185">
					<template #default="scope">
						<div class="acea-row">
							<span v-show="scope.row.type === 1" class="iconfont icon-shipinhao mr5" style="color: #f6ae02"></span>
							<span style="display: block" v-text="scope.row.refundOrderNo" />
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="orderNo" label="订单编号" min-width="180">
					<template #default="scope">
						<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="expressName" label="快递公司" min-width="180" />
				<el-table-column prop="trackingNumber" label="快递单号" min-width="180" />
				<el-table-column prop="userNickName" label="用户昵称" min-width="180" />
				<el-table-column prop="telephone" label="用户手机号" min-width="180" />
				<el-table-column prop="createTime" label="申请时间" min-width="150" />
				<el-table-column prop="afterSalesType" label="售后类型" min-width="150">
					<template #default="scope">
						<span v-if="scope.row.afterSalesType == 1">仅退款</span>
						<span v-if="scope.row.afterSalesType == 2">退货退款</span>
						<span v-if="scope.row.afterSalesType == 3">维修</span>
						<span v-if="scope.row.afterSalesType == 4">退换货</span>
					</template>
				</el-table-column>
				<el-table-column prop="refundReasonWap" label="售后原因" min-width="150" />
				<el-table-column prop="refundPrice" label="退款金额（元）" min-width="100">
					<template #default="scope">
						<span>{{ scope.row.refundStatus == 0 ? '' : scope.row.refundPrice }}</span>
					</template>
				</el-table-column>
				<el-table-column label="售后状态" min-width="120">
					<template #default="scope">
						<el-tag v-if="scope.row.refundStatus == 0">待运营审核</el-tag>
						<el-tag v-if="scope.row.refundStatus == 1">审核未通过</el-tag>
						<el-tag v-if="scope.row.refundStatus == 2">退款中</el-tag>
						<el-tag v-if="scope.row.refundStatus == 3">已退款</el-tag>
						<el-tag v-if="scope.row.refundStatus == 6">已撤销</el-tag>
						<el-tag v-if="scope.row.refundStatus == 7">待财务审核</el-tag>
					</template>
				</el-table-column>
				<el-table-column width="170" fixed="right">
					<template #header>
						<p>
							<span style="padding-right: 5px">操作</span>
							<i class="el-icon-setting" @click="handleAddItem"></i>
						</p>
					</template>
					<template #default="scope">
						<el-button link type="primary" @click="onOrderDetails(scope.row.refundOrderNo)">详情</el-button>
						<el-button link type="primary" @click="onOrderMark(scope.row)">备注</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogFormVisible" title="退款单备注" ref="dialogFormVisibleRef">
			<el-form :model="form" ref="ruleFormRef" :rules="rules">
				<el-form-item label="备注" :label-width="60" prop="remark">
					<el-input v-model="form.remark" type="textarea" placeholder="请输入退款单备注" rows="5" autocomplete="off" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
		<!--退款详情-->
		<RefundOrderDetail ref="orderDetailRef" @getDataList="getDataList"></RefundOrderDetail>
	</div>
</template>

<script lang="ts" setup name="orderManage-refundList">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { cultureRefundExport, merchantListApi } from '/@/api/culture/cultureOrder';
import { refundStatusNumApi, refundListApi, refundMarkApi } from '/@/api/culture/order';
import { useMessage } from '/@/hooks/message';
import { handleBlobFile } from '/@/utils/other';
import type { FormInstance, FormRules } from 'element-plus';

const route = useRoute();
const router = useRouter();
const RefundOrderDetail = defineAsyncComponent(() => import('./refundOrderDetail.vue'));
const orderDetailRef = ref() as any;
const timeVal = ref<any>([]);
const refundVal = ref<any>([]);
const selectMerId = ref<any>([]);
const orderChartType = ref<any>({});
const queryRef = ref();
const card_select_show = ref(false);
const refundOrderNo = ref<string>(''); //退款单号
const checkedCities = ['退款单号', '订单编号', '用户昵称', '退款金额', '售后状态', '售后类型', '退货类型', '强制退款', '创建时间'];
const dialogFormVisible = ref<boolean>(false);
const form = ref<any>({
	refundOrderNo: '',
	remark: '',
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<any>>({
	remark: [
		{
			required: true,
			message: '请输入退款单备注',
			trigger: 'blur',
		},
	],
});
onMounted(() => {
	if (route.query.refundOrderNo) {
		state.queryForm.refundOrderNo = route.query.refundOrderNo;
		state.queryForm.refundStatus = '9';
	}
	// state.dataList
	getMerIDList();
	getOrderStatusNum();
	// if (route.query.refundOrderNo) {
	// 	onOrderDetails(state.dataList[0]);
	// }
});
// 具体日期
const onchangeTime = (e: any) => {
	if (e) {
		timeVal.value = e;
		state.queryForm.dateLimit = e[0] + ',' + e[1];
	} else state.queryForm.dateLimit = '';
	console.log('state.queryForm.dateLimit', state.queryForm.dateLimit);
	getDataList();
	getOrderStatusNum();
};
// const onchangeRefundTime = (e: any) => {
// 	console.log('onchangeRefundTime', e);
// 	if (e) {
// 		refundVal.value = e;
// 		state.queryForm.refundDateLimit = e[0] + ',' + e[1];
// 	} else {
// 		state.queryForm.refundDateLimit = '';
// 	}
// 	getDataList();
// 	getOrderStatusNum();
// };

const getMerIDList = async () => {
	const obj = {
		current: 1,
		size: 1000,
	};
	try {
		const { data, code, msg } = await merchantListApi(obj);
		if (code === 0) {
			console.log('data', data);
			selectMerId.value = data.records;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const handleAddItem = () => {
	card_select_show.value = !card_select_show.value;
};
// 获取各状态数量
const getOrderStatusNum = async () => {
	let params = Object.assign({}, state.queryForm);
	delete params.page;
	delete params.limit;
	delete params.refundStatus;
	try {
		const { data, code, msg } = await refundStatusNumApi(params);
		if (code === 0) {
			orderChartType.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
	// refundStatusNumApi(data).then((res) => {
	// 	orderChartType.value = res;
	// });
};
const handleGoDetail = (orderNo: string) => {
	router.push({
		path: '/culture/orderManage/orderList/orderDetail',
		query: {
			orderNo,
		},
	});
};
// 详情
const onOrderDetails = (orderNo: string) => {
	refundOrderNo.value = orderNo;
	console.log('orderDetailRef', orderDetailRef.value);
	orderDetailRef.value.openDetail(orderNo);
};

// 备注
const onOrderMark = (row: any) => {
	dialogFormVisible.value = true;
	form.value.refundOrderNo = row.refundOrderNo;
	//   this.$modalPrompt('textarea', '退款单备注', row.platformRemark).then((V) => {
	//     refundMarkApi({ remark: V, refundOrderNo: row.refundOrderNo }).then(() => {
	//       this.$message.success('操作成功');
	//       this.getList();
	//     });
	//   });
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!');
			try {
				const { code, data, msg } = await refundMarkApi(form.value);
				if (code === 0) {
					useMessage().success('操作成功');
					resetForm(ruleFormRef.value);
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	getDataList();
	getOrderStatusNum();
	dialogFormVisible.value = false;
};
const resetQuery = () => {
	console.log('重置', queryRef.value);
	queryRef.value.resetFields();
	timeVal.value = [];
	state.queryForm.dateLimit = '';
	state.queryForm.refundDateLimit = '';
	selectMerId.value = [];
	refundVal.value = [];
	getMerIDList();
	getDataList();
	getOrderStatusNum();
};

const handleSearchList = () => {
	getDataList();
	getOrderStatusNum();
};

const exports = () => {
	let data = {
		dateLimit: state.queryForm.dateLimit,
		orderNo: state.queryForm.orderNo,
		refundStatus: state.queryForm.refundStatus,
		type: state.queryForm.type,
		refundDateLimit: state.queryForm.refundDateLimit,
		refundOrderNo: state.queryForm.refundOrderNo,
	};
	cultureRefundExport(data).then((res) => {
		handleBlobFile(res, '退款记录.xlsx');
		// window.open(res.fileName);
	});
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: refundListApi,
	queryForm: {
		refundStatus:'9'
	},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
