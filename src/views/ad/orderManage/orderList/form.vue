<template>
	<div>
		<el-form class="custom-form" :model="basicInfoForm" label-width="100px" v-loading="loading" ref="formRef">
			<!-- 基础信息 -->
			<el-card>
				<p class="title">基础信息</p>
				<el-row :getter="24">
					<el-col :span="8">
						<el-form-item label="订单号：">
							<span>{{ basicInfoForm.orderNo }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="订单状态：">
							<span>{{ orderStatusMap[basicInfoForm.status] }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="下单时间：">
							<span>{{ basicInfoForm.createTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :getter="24">
					<el-col :span="8">
						<el-form-item label="下单账号：">
							<span>{{ basicInfoForm.mobile }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="完成时间：" v-if="basicInfoForm.finishTime">
							<span>{{ basicInfoForm.finishTime }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<!-- 订单商品 -->
			<el-card>
				<p class="title">订单商品</p>
				<el-table
					border
					:data="basicInfoForm.orderDetails"
					v-loading="state.loading"
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
					class="table-product"
				>
					<el-table-column label="SKU" prop="sku" />
					<el-table-column label="规格图" prop="image" width="150">
						<template #default="scope">
							<el-image style="width: 100px; height: 100px" :src="scope.row.image" />
						</template>
					</el-table-column>
					<el-table-column label="媒体名称" prop="productName" />
					<el-table-column label="规格" prop="skuName" />
					<el-table-column label="运营商" prop="supplierName" />
					<el-table-column label="天数" prop="payNum" />
					<el-table-column label="单价" prop="price" />
					<el-table-column label="总价" prop="payPrice" />
				</el-table>
				<div class="price-right">上刊制作费:￥{{ Number(basicInfoForm.orderDetails[0]?.productionCost) }}元</div>
				<div class="price-right">订单总金额:￥{{ Number(basicInfoForm.payPrice) }}元</div>
			</el-card>
			<!-- 投放期望 -->
			<el-card>
				<p class="title">投放期望</p>
				<el-row :getter="24">
					<el-col :span="8">
						<el-form-item label="联系人：">
							<span>{{ basicInfoForm.contacts || '——' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系电话：">
							<span>{{ basicInfoForm.contactNumber || '——' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="投放时间：">
							<span>{{ basicInfoForm.placementTime || '——' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :getter="24">
					<el-col :span="24">
						<el-form-item label="期望说明：">
							<span>{{ basicInfoForm.description || '——' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<!-- 投放工单 -->
			<el-card v-if="basicInfoForm.status !== 0">
				<p class="title">投放工单</p>
				<el-row :getter="24">
					<el-col :span="8">
						<el-form-item label="工单编号：">
							<span>{{ basicInfoForm.workOrderNo || '——' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="工单状态：">
							<span>{{ workOrderStatusMap[basicInfoForm.workOrderStatus] || '——' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-button type="primary" @click="goToWorkOrderDetail(basicInfoForm.workOrderNo)">查看工单详情</el-button>
					</el-col>
				</el-row>
			</el-card>
			<!-- 支付信息 -->
			<el-card v-if="basicInfoForm.status !== 0">
				<p class="title">支付信息</p>
				<el-row :getter="12">
					<el-col :span="6">
						<el-form-item label="支付渠道：">
							<span>{{ basicInfoForm.payType || '——' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="支付时间：">
							<span>{{ basicInfoForm.payTime || '——' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :getter="12">
					<el-col :span="6">
						<el-form-item label="支付单号：">
							<span>{{ basicInfoForm.payNo || '——' }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="支付金额：">
							<span>￥{{ Number(basicInfoForm.payPrice).toFixed(2) || '——' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<el-card>
				<p class="title">售后记录</p>
				<el-table
					border
					:data="state.dataList"
					v-loading="state.loading"
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column label="售后单号" prop="refundOrderNo" />
					<el-table-column label="创建时间" prop="createTime" />
					<el-table-column label="状态" prop="refundStatus">
						<template #default="{ row }">
							<span>{{ afterSaleStatusMap[row.refundStatus] }}</span>
						</template>
					</el-table-column>
					<el-table-column label="审核人" prop="auditName">
						<template #default="{ row }">{{ row.auditName || '——' }}</template>
					</el-table-column>
					<el-table-column label="审核时间" prop="auditTime">
						<template #default="{ row }">{{ row.auditTime || '——' }}</template>
					</el-table-column>
					<el-table-column label="审核结果" prop="auditResult">
						<template #default="{ row }">
							<span v-if="row.auditResult == true">通过</span>
							<span v-else-if="row.auditResult == false">驳回</span>
							<span v-else>——</span>
						</template>
					</el-table-column>
					<el-table-column label="退款金额（元）" prop="refundPrice" width="140" />
					<el-table-column label="审核说明" prop="refundReason">
						<template #default="{ row }">{{ row.refundReason || '——' }}</template>
					</el-table-column>
					<el-table-column label="操作" width="120">
						<template #default="{ row }">
							<el-button type="primary" link @click="goToDetailPage(row)">查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</el-card>
		</el-form>
		<footer class="footer">
			<el-button @click="handleCancel">取消</el-button>
		</footer>
	</div>
</template>

<script setup lang="ts" name="cultureProductsForm">
import { reactive, ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getOrderDetail } from '/@/api/ad/orderManage';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { orderStatusMap, afterSaleStatusMap, workOrderStatusMap } from './constant';

import type { FormInstance, FormRules, ElNotification, ElMessageBox } from 'element-plus';
import { refundOrderPage } from '/@/api/ad/afterSellOrder';

const router = useRouter();

const formRef = ref<FormInstance>();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: refundOrderPage,
	queryForm: {
		orderType: 8,
		orderNo: router.currentRoute.value.query.orderNo,
	},
	dataList: [],
});
//  table hook
const { tableStyle, currentChangeHandle, sizeChangeHandle } = useTable(state);
const loading = ref(false);
const basicInfoForm = ref({
	orderNo: '',
	status: 0,
	createTime: '',
	userName: '',
	mobile: '',
	finishTime: '',
	orderDetails: [] as any,
	contacts: '',
	contactNumber: '',
	placementTime: '',
	description: '',
	workOrderNo: '',
	workOrderStatus: '',
	payType: '',
	payTime: '',
	payNo: '',
	payPrice: '',
});

// 取消
const handleCancel = () => {
	router.push('/ad/orderManage/orderList/index');
};

const getOrderDetailData = async (orderNo: any) => {
	try {
		const { code, data, msg } = await getOrderDetail(orderNo);
		loading.value = false;
		if (code === 0) {
			basicInfoForm.value = data;
		} else {
			useMessage().error(msg);
			router.push('/ad/orderManage/orderList/index');
			loading.value = false;
		}
	} catch (error: any) {
		useMessage().error(error.msg);
		router.push('/ad/orderManage/orderList/index');
		loading.value = false;
	}
};

// 售后详情
const goToDetailPage = (row: any) => {
	router.push({
		path: '/ad/orderManage/afterSalesList/form',
		query: {
			orderNo: row.orderNo,
			refundOrderNo: row.refundOrderNo,
		},
	});
};

// 跳转到对应工单详情
const goToWorkOrderDetail = (workOrderNo: string) => {
	router.push({
		path: `/ad/orderManage/adPlacement/form`,
		query: { workOrderCode: workOrderNo },
	});
};

onMounted(() => {
	loading.value = true;
	const orderNo = router.currentRoute.value.query.orderNo;
	getOrderDetailData({ orderNo });
});
</script>
<style lang="scss">
.custom-form {
	padding: 20px 20px 0;

	.el-card {
		margin-bottom: 20px;
	}

	.title {
		font-size: 20px;
		font-weight: 500;
		line-height: 28px;
		color: #1d2129;
		margin-bottom: 16px;
	}

	.table-product {
		margin-bottom: 30px;
	}

	.price-right {
		text-align: right;
		margin-bottom: 20px;
	}
}

.footer {
	text-align: center;

	.el-button {
		width: 68px;
	}
}
</style>
