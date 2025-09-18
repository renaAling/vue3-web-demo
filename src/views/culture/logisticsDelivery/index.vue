<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="queryForm" ref="queryRef">
					<el-form-item label="订单编号" prop="orderNo">
						<el-input
							class="selWidth"
							v-model.trim="queryForm.orderNo"
							placeholder="请输入订单编号"
							clearable
							@keyup.enter.native="handleSearchList"
						/>
					</el-form-item>
					<el-form-item label="订单类型" prop="type">
						<el-select v-model="queryForm.type" clearable placeholder="请选择订单类型" @change="handleSearchList" class="selWidth">
							<el-option v-for="(item, i) in fromType" :key="i" :label="item.text" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="下单手机号" prop="mobile">
						<el-input
							v-model.trim="queryForm.mobile"
							placeholder="请输入下单手机号"
							class="selWidth"
							clearable
							@keyup.enter.native="handleSearchList"
						/>
					</el-form-item>
					<el-form-item label="所属商户" prop="merId">
						<el-select v-model="queryForm.merId" clearable placeholder="请选择商户名称" class="selWidth" @change="handleSearchList">
							<el-option v-for="(item, index) in selectMerId" :key="index" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button @click="handleSearchList" icon="search" type="primary">查询</el-button>
						<el-button @click="handleReset" icon="Refresh">重置</el-button>
					</el-form-item>
					<el-tabs class="list-tabs mt14" v-model="queryForm.status" @tab-click="handleClick">
						<el-tab-pane name="all" :label="`全部(${orderChartType.all || 0})`"></el-tab-pane>
						<el-tab-pane name="unPaid" :label="`待支付(${orderChartType.unPaid || 0})`"></el-tab-pane>
						<el-tab-pane name="notShipped" :label="`待发货/待核销(${orderChartType.notShipped || 0})`"></el-tab-pane>
						<el-tab-pane name="inStock" :label="`部分发货(${orderChartType.inStock || 0})`"></el-tab-pane>
						<el-tab-pane name="spike" :label="`待收货(${orderChartType.spike || 0})`"></el-tab-pane>
						<el-tab-pane name="receiving" :label="`已收货(${orderChartType.receiving || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="awaitVerification" :label="`待核销(${orderChartType.verification || 0})`"></el-tab-pane> -->
						<el-tab-pane name="complete" :label="`已完成(${orderChartType.complete || 0})`"></el-tab-pane>
						<el-tab-pane name="canceled" :label="`已取消(${orderChartType.canceled || 0})`"></el-tab-pane>
						<el-tab-pane name="refunded" :label="`已退款(${orderChartType.refunded || 0})`"></el-tab-pane>
						<!-- <el-tab-pane name="deleted" :label="`已删除(${orderChartType.deleted || 0})`"></el-tab-pane> -->
					</el-tabs>
				</el-form>
			</el-row>
			<el-row>
				<div class="mt5" style="width: 100%">
					<el-button @click="exports">导出</el-button>
					<el-button type="primary" plain @click="excelUploadRef.show()">批量发货</el-button>
					<el-button type="primary" :disabled="!selectionList.length" @click="outBoundAll">批量出库</el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="tableData.data"
				v-loading="listLoading"
				row-key="orderNo"
				@selection-change="handleSelectionChange"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				class="mt20"
			>
				<el-table-column type="selection" width="50" />
				<el-table-column label="订单编号" min-width="220" v-if="checkedCities.includes('订单编号')">
					<template #default="{ row }">
						<div class="acea-row">
							<span v-show="row.type === 1" class="mr5 format_color">[视频号]</span>
							<span v-show="row.type === 2" class="mr5 format_color">[秒杀]</span>
							<span v-show="row.type === 5" class="mr5 format_color">[云盘]</span>
							<span v-show="row.type === 6" class="mr5 format_color">[卡密]</span>
							<span style="display: block" :class="parseInt(row.refundStatus) > 0 ? 'colorPrompt' : ''" v-text="row.orderNo" />
						</div>
						<span class="colorPrompt text_left" v-show="parseInt(row.refundStatus) > 0">
							{{ orderRefundStatusFilter[row.refundStatus] }}
						</span>
						<span v-show="row.isUserDel" class="colorPrompt text_left">用户已删除</span>
					</template>
				</el-table-column>
				<el-table-column prop="merName" label="商户名称" min-width="150" v-if="checkedCities.includes('商户名称')" />
				<el-table-column prop="nickname" label="用户昵称" min-width="150" v-if="checkedCities.includes('用户昵称')">
					<template #default="{ row }">
						<span :class="row.isLogoff == true ? 'colorPrompt' : ''">{{ row.nickname }}</span>
						<span :class="row.isLogoff == true ? 'colorPrompt' : ''" v-if="row.isLogoff == true">|</span>
						<span v-if="row.isLogoff == true" class="colorPrompt">(已注销)</span>
					</template>
				</el-table-column>
				<el-table-column label="支付现金" prop="payPrice" min-width="80" />
				<el-table-column label="使用积分" prop="scorePrice" min-width="110">
					<template #default="{ row }">
						<span>{{ row.scorePrice || 0 }}</span>
						<span v-if="row.scorePrice != null">（{{ (row.scorePrice / 100).toFixed(2) }}元）</span>
					</template>
				</el-table-column>
				<el-table-column label="运费" prop="payPostage" min-width="80" />
				<el-table-column label="支付方式" prop="payType" min-width="80" v-if="checkedCities.includes('支付方式')" />
				<el-table-column label="订单状态" min-width="100">
					<template #default="{ row }">
						<span class="notStartTag tag-background" v-if="row.refundStatus === 3">已退款</span>
						<span class="tag-background doingTag" v-else-if="row.status === 1 && row.shippingType === 1">待发货</span>
						<span class="tag-background doingTag" v-else-if="row.status === 1 && row.shippingType === 2">待核销</span>
						<span class="tag-background" :class="row.status < 5 ? 'doingTag' : 'endTag'" v-else>{{ orderStatusFilters[row.status] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="发货状态" min-width="100">
					<template #default="{ row }">
						<span class="tag-background doingTag" v-if="row.shippingStatus == 1">待出库</span>
						<span class="tag-background doingTag" v-else-if="row.shippingStatus == 2">已出库</span>
						<span class="tag-background doingTag" v-else-if="row.shippingStatus == 3">已发货</span>
						<span class="tag-background doingTag" v-else-if="row.shippingStatus == 4">部分发货</span>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="下单时间" min-width="140" v-if="checkedCities.includes('下单时间')" />
				<el-table-column label="操作" width="220" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('detail', row)"> 详情 </el-button>
						<el-button
							v-if="(row.status === 1 || row.status === 2) && parseFloat(row.refundStatus) < 3 && row.shippingType == '1'"
							type="primary"
							link
							@click="handleCommand('sendOrder', row)"
						>
							发货
						</el-button>
						<el-button v-if="row.afterSalesIsShow" type="primary" link @click="handleCommand('afterSales', row)"> 售后 </el-button>
						<el-button type="primary" link @click="handleCommand('orderMark', row)"> 备注 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination
					background
					:page-sizes="[20, 40, 60, 80]"
					:page-size="queryForm.size"
					:current-page="queryForm.current"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData.total"
					@size-change="handleSizeChange"
					@current-change="pageChange"
				/>
			</div>
		</div>

		<!-- 售后 -->
		<el-dialog title="发起售后" width="600px" v-loading="loadingAfterSales" :show-close="false" @close="closeAfter" v-model="afterSalesDialog">
			<el-form ref="afterSalesRef" :model="afterForm" :rules="afterRules" label-width="120px" @submit.native.prevent>
				<el-form-item label="售后类型" prop="refundReasonWap">
					<el-select v-model="afterForm.refundReasonWap" filterable style="width: 100%" placeholder="请选择售后类型">
						<el-option v-for="item in reasonList" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="原因说明" prop="refundReasonWapExplain">
					<el-input
						type="textarea"
						maxlength="200"
						show-word-limit
						v-model.trim="afterForm.refundReasonWapExplain"
						placeholder="请输入原因说明"
						clearable
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeAfter">取 消</el-button>
					<el-button type="primary" @click="onAfterSales(afterSalesRef)">确 定</el-button>
				</div>
			</template>
		</el-dialog>

		<!--详情-->
		<DetailsForm ref="orderDetailRef" :orderNo="orderNo" />

		<!-- 批量发货 -->
		<UploadExcel ref="excelUploadRef" @refreshDataList="handleSearchList"></UploadExcel>

		<!-- 发送货 -->
		<OrderSend ref="orderSendRef" :orderNo="orderNo" @submitFail="handleSearchList"></OrderSend>

		<!-- 导入 -->
		<upload-excel
			title="批量发货"
			@refreshDataList="handleSearchList"
			ref="excelUploadRef"
			:custom-temp-url="baseFileUrl + '/rls/b/rls/批量发货模板.xlsx'"
			url="/mall/order/import"
			:fileType="['xlsx', 'xls']"
		/>
	</div>
</template>

<script lang="ts" setup name="orderManage-orderList">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import type { TabsPaneContext, FormRules, FormInstance } from 'element-plus';
// import type { FormInstance, FormRules, UploadUserFile, UploadProps, UploadRequestOptions, UploadFile, UploadFiles } from 'element-plus';
import { getAllMallPlateApi } from '/@/api/culture/merchant';
import { orderListApi, orderStatusNumApi } from '/@/api/culture/order';
import { applyAfterSaleApi, reasonApi, merchantListApi, orderMarkApi, orderOutBound } from '/@/api/culture/cultureOrder';
import { showRemarkPrompt } from '/@/utils/promptUtils';

interface OrderChartType {
	all?: number;
	unPaid?: number;
	notShipped?: number;
	inStock?: number;
	spike?: number;
	receiving?: number;
	complete?: number;
	canceled?: number;
	refunded?: number;
}
interface Merchant {
	id: number | string;
	name: string;
}
const UploadExcel = defineAsyncComponent(() => import('./UploadExcel.vue'));
const DetailsForm = defineAsyncComponent(() => import('./components/orderDetail.vue'));
const OrderSend = defineAsyncComponent(() => import('./components/orderSend.vue'));
const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);

const router = useRouter();
const excelUploadRef = ref();
const orderDetailRef = ref();
const orderSendRef = ref();
const afterSalesRef = ref();
const orderRefundStatusFilter = {
	0: '未退款',
	1: '申请中',
	2: '部分退款',
	3: '已退款',
} as any;
const orderStatusFilters = {
	0: '待支付',
	1: '待发货',
	2: '部分发货',
	4: '待收货',
	5: '已收货',
	6: '已完成',
	9: '已取消',
	10: '已退款',
} as any;
// 搜索变量
const queryRef = ref();
const paymentTime = ref([]);
const orderTime = ref([]);
const plateList = ref<{ name: string; type: string | number }[]>([]);
const selectMerId = ref<Merchant[]>([]);
const reasonList = ref([]);
const orderChartType = ref<OrderChartType>({});
const listLoading = ref(false);
const loadingAfterSales = ref(false);
const afterSalesDialog = ref(false);
const checkedCities = ref(['订单编号', '商户名称', '用户昵称', '实际支付', '支付方式', '订单状态', '发货状态', '下单时间']);
const selectionList = ref([]);
const orderNo = ref('');
const fromType = ref([
	{ value: '0', text: '普通' },
	{ value: '1', text: '视频号' },
	{ value: '2', text: '秒杀' },
]);
const tableData = ref({
	data: [],
	total: 0,
});

const queryForm = ref({
	status: 'all' as any,
	dateLimit: '',
	orderNo: '',
	current: 5,
	size: 20,
	merId: null,
	type: '',
	orderBy: 1,
	paymentTimeStart: '',
	paymentTimeEnd: '',
	createTimeEnd: '',
	createTimeStart: '',
	mobile: '',
	isStaff: '',
	goodsType: '',
	shippingType: '',
});
const afterForm = ref({
	refundReasonWap: '',
	refundReasonWapExplain: '',
});
const isMerchant = computed(() => {
	return import.meta.env.VITE_IS_MERCHANT;
});
const afterRules = reactive<FormRules<any>>({
	refundReasonWap: [{ required: true, message: '选择售后类型', trigger: ['blur', 'change'] }],
	refundReasonWapExplain: [{ required: true, message: '输入原因说明', trigger: ['blur', 'change'] }],
});
const state: BasicTableProps = reactive<BasicTableProps>({});
//  table hook
const { tableStyle, downBlobFile } = useTable(state);

const pageChange = (page: number) => {
	queryForm.value.current = page;
	getList();
};
const handleSizeChange = (val: number) => {
	queryForm.value.size = val;
	getList();
};

const handleSearchList = () => {
	queryForm.value.current = 1;
	getList();
	getOrderStatusNum();
};
const handleClick = (tab: TabsPaneContext, event: Event) => {
	queryForm.value.status = tab?.paneName;
	queryForm.value.current = 1;
	getList();
	getOrderStatusNum();
};
const handleSelectionChange = (val: any) => {
	selectionList.value = val;
	console.log('selectionList', selectionList.value);
	// const data: any = [];
	// selectionList.value.map((item: any) => {
	// 	data.push(item.orderNo);
	// });
	// this.ids = data.join(',');
};

// 关闭售后弹窗
const closeAfter = () => {
	afterSalesDialog.value = false;
	afterSalesRef.value.resetFields();
};
// 确定发起售后
const onAfterSales = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid) => {
		if (valid) {
			(async () => {
				try {
					loadingAfterSales.value = true;
					const params = {
						orderNo: orderNo.value,
						...afterForm.value,
					};
					const { code, msg } = await applyAfterSaleApi(params);
					if (code === 0) {
						useMessage().success(`申请售后成功`);
						closeAfter();
						handleSearchList();
					} else {
						useMessage().error(msg);
					}
				} catch (err: any) {
					useMessage().error(err.msg);
				} finally {
					loadingAfterSales.value = false;
				}
			})();
		}
	});
};
const handleReset = () => {
	queryForm.value.dateLimit = '';
	queryForm.value.orderNo = '';
	queryForm.value.merId = null;
	queryForm.value.type = '';
	queryForm.value.paymentTimeStart = '';
	queryForm.value.paymentTimeEnd = '';
	queryForm.value.createTimeStart = '';
	queryForm.value.createTimeEnd = '';
	queryForm.value.mobile = '';
	queryForm.value.isStaff = '';
	queryForm.value.shippingType = '';
	paymentTime.value = [];
	orderTime.value = [];
	handleSearchList();
};
const getMerIDList = () => {
	const data = {
		current: 1,
		size: 1000,
	};
	merchantListApi(data).then((res) => {
		selectMerId.value = res.data.records;
	});
};

const getOrderStatusNum = () => {
	const { status, ...data } = queryForm.value;
	orderStatusNumApi(data).then((res: any) => {
		orderChartType.value = res.data;
	});
};
const getReason = () => {
	reasonApi().then((res) => {
		reasonList.value = res.data;
	});
};

// 列表
const getList = () => {
	listLoading.value = true;
	const obj = {
		all: '',
		unPaid: 0, // 未支付
		notShipped: 1, // 待备货
		inStock: 2, // 备货中
		spike: 4, // 待收货
		receiving: 5, // 已收货
		awaitVerification: 3, // 待核销
		complete: 6, // 已完成
		canceled: 9, // 已取消
		refunded: 10, // 已退款
		deleted: -1, // 已删除
	};

	console.log('queryForm.value', queryForm.value);
	const statusKey = queryForm.value.status as keyof typeof obj;
	const params = {
		...queryForm.value,
		status: obj[statusKey],
	};
	console.log('params', params);
	orderListApi(params)
		.then((res: any) => {
			tableData.value.data = res.data.records;
			tableData.value.total = res.data.total;
			listLoading.value = false;
			const storedValue = localStorage.getItem('order_stroge');
			checkedCities.value = storedValue ? JSON.parse(storedValue) : checkedCities.value;
		})
		.catch(() => {
			listLoading.value = false;
		});
};

watch(
	() => orderTime.value,
	(val) => {
		if (val) {
			queryForm.value.createTimeStart = val[0];
			queryForm.value.createTimeEnd = val[1];
		} else {
			queryForm.value.createTimeStart = '';
			queryForm.value.createTimeEnd = '';
		}
	}
);

watch(
	() => paymentTime.value,
	(val) => {
		if (val) {
			queryForm.value.paymentTimeStart = val[0];
			queryForm.value.paymentTimeEnd = val[1];
		} else {
			queryForm.value.paymentTimeStart = '';
			queryForm.value.paymentTimeEnd = '';
		}
	}
);

const getAllPlate = async () => {
	let params = {
		isShow: true,
	};
	const { code, data } = await getAllMallPlateApi(params);
	if (code === 0) {
		plateList.value = data.map((v: any) => {
			if (v.isShow === false) {
				v.name += '(已关闭)';
			}
			return v;
		});
	}
};

const changeOrderTime = (val: any) => {
	if (!val) {
		queryForm.value.createTimeStart = '';
		queryForm.value.createTimeEnd = '';
	}
	handleSearchList();
};
const changePaymentTime = (val: any) => {
	if (!val) {
		queryForm.value.paymentTimeStart = '';
		queryForm.value.paymentTimeEnd = '';
	}
	handleSearchList();
};

// 点击批量出库
const outBoundAll = () => {
	useMessageBox()
		.confirm('请确认是否批量出库', '批量出库')
		.then(() => {
			orderOutBound({ orderCodes: selectionList.value })
				.then(() => {
					useMessage().success('操作成功');
					getList();
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		})
		.catch(() => {});
};

// 导出
const exports = async () => {
	const obj = {
		all: '',
		unPaid: 0, // 未支付
		notShipped: 1, // 待备货
		inStock: 2, // 备货中
		spike: 4, // 待收货
		receiving: 5, // 已收货
		awaitVerification: 3, // 待核销
		complete: 6, // 已完成
		canceled: 9, // 已取消
		4: 9, // 已取消
		refunded: 10, // 已退款
		deleted: -1, // 已删除
	};
	type OrderStatusKey = keyof typeof obj;
	const statusKey = queryForm.value.status as OrderStatusKey;
	let data = {
		...queryForm.value,
		orderStatus: obj[statusKey],
		payTimeStart: queryForm.value.paymentTimeStart ? queryForm.value.paymentTimeStart + ' 00:00:00' : null,
		payTimeEnd: queryForm.value.paymentTimeEnd ? queryForm.value.paymentTimeEnd + ' 23:59:59' : null,
		createTimeStart: queryForm.value.createTimeStart ? queryForm.value.createTimeStart + ' 00:00:00' : null,
		createTimeEnd: queryForm.value.createTimeEnd ? queryForm.value.createTimeEnd + ' 23:59:59' : null,
	};
	const requestUrl = isMerchant.value 
	? 'tracomps-admin/api/admin/merchant/export/ownMallExport' 
	: '/tracomps-admin/api/admin/platform/export/ownMallExport';
	downBlobFile(requestUrl, Object.assign(data), '订单列表.xlsx');
};

const handleCommand = (command: Table.Command, row: any) => {
	orderNo.value = row.orderNo;
	switch (command) {
		case 'detail':
			const detailRef = orderDetailRef.value;
			if (detailRef) {
				detailRef.getDetail(row.orderNo);
				detailRef.getOrderInvoiceList(row.orderNo);
				detailRef.dialogVisible = true;
			}
			break;
		case 'sendOrder':
			const sendRef = orderSendRef.value;
			if (sendRef) {
				sendRef.getList();
				sendRef.orderProDetail(row.orderNo, row.merId);
				sendRef.modals = true;
			}
			break;
		case 'afterSales':
			afterSalesDialog.value = true;
			break;
		case 'orderMark':
			showRemarkPrompt().then((res) => {
				orderMarkApi({ remark: res, orderNo: orderNo.value }).then(() => {
					useMessage().success('操作成功');
					getList();
				});
			});
			break;
	}
};

onMounted(() => {
	getAllPlate();
	getMerIDList();
	getOrderStatusNum();
	getReason();
	getList();
});
</script>
<style lang="scss" scoped>
.selWidth {
	width: 260px !important;
}
.colorPrompt {
	color: #f56464;
}
.notStartTag {
	color: #f56464;
	border: 1px solid #f56464;
}
.tag-background {
	border-radius: 2px !important;
	background-color: #fff !important;
	padding: 2px 6px;
}
.doingTag {
	color: #ff7d00 !important;
	border: 1px solid #ff7d00 !important;
}
.endTag {
	color: #666666 !important;
	border: 1px solid #cccccc !important;
}
.acea-row {
	display: flex;
	flex-wrap: wrap;
	.format_color {
		color: #4785ea;
	}
}
.text_left {
	text-align: left;
	display: block;
}
</style>
