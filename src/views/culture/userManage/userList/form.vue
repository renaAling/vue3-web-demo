<template>
	<el-form class="p-[20px] pb-0" :model="userInfo" label-width="100px" v-loading="state.loading">
		<div @click="router.go(-1)" class="flex items-center cursor-pointer mb-[10px]">
			<el-icon class="mr-[4px]">
				<ArrowLeftBold />
			</el-icon>
			返回
		</div>
		<el-card shadow="never">
			<template #header>
				<span>用户基础信息</span>
			</template>
			<el-descriptions :column="4">
				<el-descriptions-item label="用户名称：">{{ userInfo.nickName }}</el-descriptions-item>
				<el-descriptions-item label="用户ID：">{{ userInfo.unionId }}</el-descriptions-item>
				<el-descriptions-item label="用户手机号：">{{ userInfo.mobile }}</el-descriptions-item>
				<el-descriptions-item label="注册时间：">{{ userInfo.createTime }}</el-descriptions-item>
				<el-descriptions-item label="最近登录：">{{ userInfo.lastLoginTime }}</el-descriptions-item>
			</el-descriptions>
		</el-card>
		<el-card shadow="never">
			<template #header>
				<span>收货地址</span>
			</template>
			<el-table border :data="addressList" :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column label="序号" type="index" width="60" />
				<el-table-column label="收货人" prop="realName" />
				<el-table-column label="手机号" prop="phone" />
				<el-table-column label="所在区域" prop="province">
					<template #default="{ row }">
						{{ `${row.province} - ${row.city} - ${row.district}` }}
					</template>
				</el-table-column>
				<el-table-column label="详细地址" prop="detail" />
			</el-table>
		</el-card>
		<el-card shadow="never">
			<template #header>
				<span>消费记录(订单明细)</span>
			</template>
			<el-tabs v-model="queryTab.status" @tab-click="handleClick">
				<el-tab-pane name="all" :label="`全部(${orderChartType?.all || 0})`"></el-tab-pane>
				<el-tab-pane name="unPaid" :label="`待支付(${orderChartType?.unPaid || 0})`"></el-tab-pane>
				<el-tab-pane name="notShipped" :label="`待发货/待核销(${orderChartType?.notShipped || 0})`"></el-tab-pane>
				<el-tab-pane name="inStock" :label="`部分发货(${orderChartType?.inStock || 0})`"></el-tab-pane>
				<el-tab-pane name="spike" :label="`待收货(${orderChartType?.spike || 0})`"></el-tab-pane>
				<el-tab-pane name="receiving" :label="`已收货(${orderChartType?.receiving || 0})`"></el-tab-pane>
				<!-- <el-tab-pane name="awaitVerification" :label="`待核销(${orderChartType.verification || 0})`"></el-tab-pane> -->
				<el-tab-pane name="complete" :label="`已完成(${orderChartType?.complete || 0})`"></el-tab-pane>
				<el-tab-pane name="canceled" :label="`已取消(${orderChartType?.canceled || 0})`"></el-tab-pane>
				<el-tab-pane name="refunded" :label="`已退款(${orderChartType?.refunded || 0})`"></el-tab-pane>
				<!-- <el-tab-pane name="deleted" :label="`已删除(${orderChartType.deleted || 0})`"></el-tab-pane> -->
			</el-tabs>
			<el-table border :data="tableData.data" row-key="orderNo" :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column label="订单编号" v-if="checkedCities.includes('订单编号')">
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
				<el-table-column prop="merName" label="供应商名称" v-if="checkedCities.includes('商户名称')" />
				<el-table-column label="支付现金" prop="payPrice" />
				<el-table-column label="使用积分" prop="scorePrice">
					<template #default="{ row }">
						<span>{{ row.scorePrice || 0 }}</span>
						<span v-if="row.scorePrice != null">({{ (row.scorePrice / 100).toFixed(2) }}元)</span>
					</template>
				</el-table-column>
				<el-table-column label="运费" prop="payPostage" />
				<el-table-column label="支付方式" prop="payType" v-if="checkedCities.includes('支付方式')" />
				<el-table-column label="订单状态">
					<template #default="{ row }">
						<div v-if="row.shippingType === 3">
							<!-- 线上卡密 -->
							<el-tag v-if="row.status === 0">待支付</el-tag>
							<el-tag v-if="row.status === 1">待发放</el-tag>
							<el-tag v-if="row.status === 2">发放中</el-tag>
							<el-tag v-if="row.status === 6">已完成</el-tag>
							<el-tag v-if="row.status === 9">已取消</el-tag>
							<el-tag v-if="row.status === 10">已退款</el-tag>
						</div>
						<div v-if="row.shippingType === 5">
							<!-- 同城配送 -->
							<el-tag v-if="row.status === 0">待支付</el-tag>
							<el-tag v-if="row.status === 1">待取件</el-tag>
							<el-tag v-if="row.status === 2">配送中</el-tag>
							<el-tag v-if="row.status === 6">已完成</el-tag>
							<el-tag v-if="row.status === 9">已取消</el-tag>
							<el-tag v-if="row.status === 10">已退款</el-tag>
						</div>
						<!-- 快递发货和自提核销 -->
						<div v-if="row.shippingType === 1 || row.shippingType === 2">
							<el-tag v-if="row.status === 0">待支付</el-tag>
							<el-tag v-if="row.status === 1 && row.shippingType === 1">待发货</el-tag>
							<el-tag v-if="row.status === 1 && row.shippingType === 2">待取货</el-tag>
							<el-tag v-if="row.status === 2">部分发货</el-tag>
							<el-tag v-if="row.status === 4">待收货</el-tag>
							<el-tag v-if="row.status === 5">已收货</el-tag>
							<el-tag v-if="row.status === 6">已完成</el-tag>
							<el-tag v-if="row.status === 9">已取消</el-tag>
							<el-tag v-if="row.status === 10">已退款</el-tag>
							<!-- <span class="notStartTag tag-background" v-if="row.refundStatus === 3">已退款</span>
							<span class="tag-background doingTag" v-else-if="row.status === 1 && row.shippingType === 1">待发货</span>
							<span class="tag-background doingTag" v-else-if="row.status === 1 && row.shippingType === 2">待核销</span>
							<span class="tag-background" :class="row.status < 5 ? 'doingTag' : 'endTag'" v-else>{{ orderStatusFilters[row.status] }}</span> -->
						</div>
					</template>
				</el-table-column>
				<el-table-column label="发货状态">
					<template #default="{ row }">
						<el-tag v-if="row.shippingStatus === 1">待出库</el-tag>
						<el-tag v-else-if="row.shippingStatus === 2">已出库</el-tag>
						<el-tag v-else-if="row.shippingStatus === 3">已发货</el-tag>
						<el-tag v-else-if="row.shippingStatus === 4">部分发货</el-tag>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="下单时间" v-if="checkedCities.includes('下单时间')" />
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand(row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="block">
				<el-pagination
					background
					:page-sizes="[20, 40, 60, 80]"
					:page-size="queryTab.size"
					:current-page="queryTab.current"
					layout="total, sizes, prev, pager, next, jumper"
					:total="tableData.total"
					@size-change="handleSizeChange"
					@current-change="pageChange"
				/>
			</div>
		</el-card>
		<el-card shadow="never">
			<template #header>
				<span>积分/优惠券持有情况</span>
			</template>
			<el-tabs v-model="activeName2">
				<el-tab-pane label="优惠券" name="first">
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column type="index" label="序号" width="60" />
						<el-table-column prop="name" label="优惠券名称" show-overflow-tooltip />
						<el-table-column prop="usageScope" label="使用范围" />
						<el-table-column prop="couponType" label="优惠券类型">
							<template #default="scope">
								<span>{{ scope.row.couponType === '1' ? '满减券' : '折扣券' }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="valueOrDiscount" label="面值(元)/折扣率(折)">
							<template #default="scope">
								<span v-if="scope.row.couponType === '1'">{{ scope.row.valueOrDiscount }}元</span>
								<span v-else>{{ scope.row.valueOrDiscount }}折</span>
							</template>
						</el-table-column>
						<el-table-column label="使用门槛(元)" prop="minPrice">
							<template #default="{ row }">
								<span>{{ row.minPrice == 0 ? '不限制' : row.minPrice }}</span>
							</template>
						</el-table-column>
						<el-table-column label="持有张数" prop="quantity" />
						<el-table-column label="有效期限" prop="validityPeriod" width="200" />
					</el-table>
					<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
				<el-tab-pane label="积分" name="second">
					<div class="flex justify-between m-[20px]">
						<div class="score-item">
							<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
							<div class="ml-[20px]">
								<div class="text-[14px] text-[#666]">已领取积分</div>
								<div class="text-[24px] font-bold">{{ scoreInfo?.receivedPoints || 0 }}</div>
							</div>
						</div>
						<div class="score-item">
							<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
							<div class="ml-[20px]">
								<div class="text-[14px] text-[#666]">已使用积分</div>
								<div class="text-[24px] font-bold">{{ scoreInfo?.usedPoints || 0 }}</div>
							</div>
						</div>
						<div class="score-item">
							<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
							<div class="ml-[20px]">
								<div class="text-[14px] text-[#666]">未使用积分</div>
								<div class="text-[24px] font-bold">{{ scoreInfo?.unusedPoints || 0 }}</div>
							</div>
						</div>
						<div class="score-item">
							<el-image class="w-[50px]" :src="imageUrl" fit="cover" />
							<div class="ml-[20px]">
								<div class="text-[14px] text-[#666]">已过期积分</div>
								<div class="text-[24px] font-bold">{{ scoreInfo?.expiredPoints || 0 }}</div>
							</div>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!--详情-->
		<DetailsForm ref="orderDetailRef" :orderNo="orderNo" />
	</el-form>
</template>

<script setup lang="ts" name="cultureProductsForm">
import type { TabsPaneContext } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { BasicFormDataType } from './types';
import { getDetails, getUserManageAddress, getUserCoupon, getUserScoreInfo } from '/@/api/culture/userManage';
import { orderListApi, orderStatusNumApi } from '/@/api/culture/order';

import imageUrl from '/@/assets/imgs/tip.png';
const DetailsForm = defineAsyncComponent(() => import('../../orderManage/orderList/components/orderDetail.vue'));

const router = useRouter();

const activeName2 = ref('first');
const route = useRoute();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getUserCoupon,
	dataList: [],
	queryForm: {
		unionId: route.query.unionId,
	},
});

const { currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const userInfo = ref<BasicFormDataType>({
	nickName: '',
	unionId: '',
	mobile: '',
	isStaff: null,
	createTime: '',
	lastLoginTime: '',
});

const handleClick = (tab: TabsPaneContext) => {
	queryTab.value.status = tab?.paneName;
	queryTab.value.current = 1;
	getOrderList();
	getOrderStatusNum();
};

const orderNo = ref('');
const orderDetailRef = ref();
const handleCommand = (row: any) => {
	const detailRef = orderDetailRef.value;
	if (detailRef) {
		detailRef.getDetail(row.orderNo);
		detailRef.getOrderInvoiceList(row.orderNo);
		detailRef.dialogVisible = true;
	}
};

// 除地址以外的用户详情
const getUserDetails = () => {
	getDetails({ unionId: route.query.unionId }).then((res) => {
		userInfo.value = res.data;
	});
};
// 获取收获地址列表
const addressList = ref([]);
const getUserManageAddressList = async () => {
	const res = await getUserManageAddress({ unionId: route.query.unionId });
	res?.ok && (addressList.value = res.data);
};
// 获取积分持有情况
const scoreInfo = ref();
const getUserScoreInfoList = async () => {
	const res = await getUserScoreInfo({ unionId: route.query.unionId });
	res?.ok && (scoreInfo.value = res.data);
};
// 订单
const queryTab = ref({
	status: 'all' as any,
	mobile: route.query.mobile,
	current: 1,
	size: 20,
	orderBy: 1,
});
const orderChartType = ref();
const getOrderStatusNum = () => {
	orderStatusNumApi({ mobile: route.query.mobile }).then((res: any) => {
		orderChartType.value = res.data;
	});
};
const checkedCities = ref(['订单编号', '商户名称', '实际支付', '支付方式', '订单状态', '发货状态', '下单时间']);
const orderRefundStatusFilter = {
	0: '未退款',
	1: '申请中',
	2: '部分退款',
	3: '已退款',
} as any;
const tableData = ref({
	data: [],
	total: 0,
});
const getOrderList = () => {
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
	console.log('queryTab.value', queryTab.value);
	const statusKey = queryTab.value.status as keyof typeof obj;
	const params = {
		...queryTab.value,
		status: obj[statusKey],
	};
	console.log('params', params);
	orderListApi(params)
		.then((res: any) => {
			tableData.value.data = res.data.records;
			tableData.value.total = res.data.total;
			const storedValue = localStorage.getItem('order_stroge');
			checkedCities.value = storedValue ? JSON.parse(storedValue) : checkedCities.value;
		})
		.catch(() => {});
};
const pageChange = (page: number) => {
	queryTab.value.current = page;
	getOrderList();
};
const handleSizeChange = (val: number) => {
	queryTab.value.size = val;
	getOrderList();
};

onMounted(async () => {
	getUserDetails();
	getUserManageAddressList();
	getUserScoreInfoList();
	getOrderStatusNum();
	getOrderList();
});
</script>
<style lang="scss" scoped>
.score-item {
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid #eee;
	padding: 20px 60px 20px 60px;
	color: #666;
}
.el-card {
	margin-bottom: 20px;
}
:deep(.el-card__header) {
	font-weight: bold;
}
:deep(.el-tabs--top) {
	margin-top: -20px;
}
</style>
