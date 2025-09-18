<template>
	<div>
		<!-- <el-drawer v-model="dialogVisible" :direction="direction" size="1000px" :before-close="handleClose"> -->
			<div class="layout-padding w-full">
		<div class="layout-padding-auto layout-padding-view">
			<div v-if="orderDatalist" v-loading="loading" class="detail-box">
						<div class="my-2 flex justify-start cursor-pointer back-icon" @click="router.back()">
					<div class="flex icon">
						<el-icon :size="22"><ArrowLeftBold /></el-icon>
					</div>
					<div class="ml-2">返回</div>
				</div>
				<div class="detailHead">
					<div class="full">
						<div class="order_icon">
							<el-icon color="#fff" size="30"><List /></el-icon>
						</div>
						<div class="text">
							<div class="title flex-row">{{ statusMap[orderDatalist.type ?? 0] }} </div> 
							<div>
								<span class="mr20">订单号：{{ orderDatalist.orderNo }}</span>
							</div>
						</div>
					</div>
					<ul class="list">
						<li class="item">
							<div class="title">订单状态</div>
							<!-- <div class="color-warning">
								<span v-if="orderDatalist.refundStatus === 3">已退款</span>
								<span v-else-if="orderDatalist.shippingType == 1 && orderDatalist.status == 1">待收货</span>
								<span v-else-if="orderDatalist.shippingType == 2 && orderDatalist.status == 1">待核销</span>
								<span v-else>{{ orderStatusFilters[orderDatalist.status ?? 0] }}</span>
							</div> -->
							<div class="color-warning" v-if="orderDatalist.shippingType == 3">
								<span v-if="orderDatalist.status === 0">待支付</span>
								<span v-if="orderDatalist.status === 1">待发放</span>
								<span v-if="orderDatalist.status === 2">发放中</span>
								<span v-if="orderDatalist.status === 6">已完成</span>
								<span v-if="orderDatalist.status === 9">已取消</span>
								<span v-if="orderDatalist.status === 10">已退款</span>
							</div>
							<div class="color-warning" v-if="orderDatalist.shippingType == 5">
								<span v-if="orderDatalist.status === 0">待支付</span>
								<span v-if="orderDatalist.status === 1">待取件</span>
								<span v-if="orderDatalist.status === 2">配送中</span>
								<span v-if="orderDatalist.status === 6">已完成</span>
								<span v-if="orderDatalist.status === 9">已取消</span>
								<span v-if="orderDatalist.status === 10">已退款</span>
							</div>
							<div class="color-warning" v-if="orderDatalist.shippingType == 1">
								<span v-if="orderDatalist.status === 0">待支付</span>
								<span v-if="orderDatalist.status === 1">待发货</span>
								<span v-if="orderDatalist.status === 2">部分发货</span>
								<span v-if="orderDatalist.status === 4">待收货</span>
								<span v-if="orderDatalist.status === 5">已收货</span>
								<span v-if="orderDatalist.status === 6">已完成</span>
								<span v-if="orderDatalist.status === 9">已取消</span>
								<span v-if="orderDatalist.status === 10">已退款</span>
							</div>
							<div class="color-warning" v-if="orderDatalist.shippingType === 2">
								<span v-if="orderDatalist.status === 0">待支付</span>
								<span v-if="orderDatalist.status === 1">待备货</span>
								<span v-if="orderDatalist.status === 2">备货中</span>
								<span v-if="orderDatalist.status === 3">待核销</span>
								<span v-if="orderDatalist.status === 6">已完成</span>
								<span v-if="orderDatalist.status === 9">已取消</span>
								<span v-if="orderDatalist.status === 10">已退款</span>
								<!-- 快递发货和自提核销 -->
								<!-- <span class="notStartTag tag-background" v-if="row.refundStatus === 3">已退款</span>
							<span class="tag-background doingTag" v-else-if="row.status === 1 && row.shippingType === 1">待发货</span>
							<span class="tag-background doingTag" v-else-if="row.status === 1 && row.shippingType === 2">待核销</span>
							<span class="tag-background" :class="row.status < 5 ? 'doingTag' : 'endTag'" v-else>{{ orderStatusFilters[row.status] }}</span> -->
							</div>
						</li>
						<li class="item">
							<div class="title">实际支付</div>
							<div>¥ {{ orderDatalist.payPrice || '0.0' }}</div>
						</li>
						<li class="item">
							<div class="title">支付方式</div>
							<div>{{ orderDatalist.payType }}</div>
						</li>
						<li class="item">
							<div class="title">创建时间</div>
							<div>{{ orderDatalist.createTime || '-' }}</div>
						</li>
					</ul>
				</div>
				<el-tabs type="border-card" v-model="activeName">
					<el-tab-pane label="订单信息" name="detail">
						<div class="detailSection" style="border: none">
							<div class="title">用户信息</div>
							<ul class="list">
								<li class="item">
									<div class="tips">用户名称：</div>
									<div class="value">{{ orderDatalist.nikeName }} | {{ orderDatalist.uid }}</div>
								</li>
								<li class="item">
									<div class="tips">用户电话：</div>
									<div class="value">{{ orderDatalist.phone }}</div>
								</li>
							</ul>
						</div>
						<div v-show="orderDatalist.shippingType < 2" class="detailSection">
							<div class="title">收货信息</div>
							<ul class="list">
								<li class="item">
									<div class="tips">收货人：</div>
									<div class="value">
										{{ orderDatalist.realName }}
									</div>
								</li>
								<li class="item">
									<div class="tips">收货电话：</div>
									<div class="value">
										{{ orderDatalist.userPhone }}
									</div>
								</li>
								<li class="item">
									<div class="tips">收货地址：</div>
									<div class="value">
										{{ orderDatalist.userAddress }}
									</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div class="title">订单信息</div>
							<ul class="list">
								<li class="item">
									<div class="tips">商品总价：</div>
									<div class="value">{{ orderDatalist.proTotalPrice }}</div>
								</li>
								<li class="item">
									<div class="tips">商品总数：</div>
									<div class="value">{{ orderDatalist.totalNum }}</div>
								</li>
								<li class="item">
									<div class="lang">优惠券优惠：</div>
									<div class="value">{{ orderDatalist.couponPrice }}</div>
								</li>
								<!-- <li class="item">
                  <div class="lang">平台优惠金额：</div>
                  <div class="value">{{ orderDatalist.platCouponPrice }}</div>
                </li> -->
								<li class="item">
									<div class="tips">支付状态：</div>
									<div class="value">{{ orderDatalist.paid ? '已支付' : '未支付' }}</div>
								</li>
								<li class="item">
									<div class="tips">实际支付：</div>
									<div class="value">{{ orderDatalist.payPrice || '0.0' }}</div>
								</li>
								<li class="item">
									<div class="lang">分销优惠金额：</div>
									<div class="value">{{ orderDatalist.distributorCouponPrice || '0.0' }}</div>
								</li>
								<!-- <li class="item">
                  <div class="lang">商户优惠金额：</div>
                  <div class="value">{{ orderDatalist.merCouponPrice || '0.0' }}</div>
                </li> -->
								<li class="item">
									<div class="lang">员工优惠金额：</div>
									<div class="value">￥{{ orderDatalist.svipDiscountPrice || '0.0' }}</div>
								</li>
								<li class="item">
									<div class="tips">支付邮费：</div>
									<div class="value">{{ orderDatalist.payPostage }}</div>
								</li>
								<li class="item">
									<div class="tips">赠送积分：</div>
									<div class="value">{{ orderDatalist.payPrice || 0 }}</div>
								</li>
								<li class="item">
									<div class="lang">积分金额：</div>
									<div class="value">
										￥{{ orderDatalist.scorePrice ? (orderDatalist.scorePrice / 100).toFixed(2) : '0.0' }}
										<span>({{ orderDatalist.scorePrice || 0 }}积分)</span>
									</div>
								</li>
								<li class="item">
									<div class="tips">支付方式：</div>
									<div class="value">{{ orderDatalist.payType }}</div>
								</li>
								<li class="item">
									<div class="tips">配送方式：</div>
									<div class="value">{{ orderDatalist.shippingType === 1 ? '邮寄' : '门店自提' }}</div>
								</li>
								<li class="item">
									<div class="lang">支付时间：</div>
									<div class="value">{{ orderDatalist.payTime || '-' }}</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div class="title">买家留言</div>
							<ul class="list">
								<li class="item">
									<div>{{ orderDatalist.userRemark || '-' }}</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div class="title">商家备注</div>
							<ul class="list">
								<li class="item">
									<div>{{ orderDatalist.merchantRemark || '-' }}</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div>
								<div class="title">物流信息</div>
								<div v-if="Number(orderDatalist.status) > 2">
									<ul class="list">
										<li class="item">
											<div class="tips">快递公司：</div>
											<div class="value" v-if="orderDatalist.invoiceResponses.length > 0">
												{{ orderDatalist.invoiceResponses[0].expressName ? orderDatalist.invoiceResponses[0].expressName : '-' }}
											</div>
											<div class="value" v-else>-</div>
										</li>
										<li class="item">
											<div class="tips">物流单号：</div>
											<div class="value" v-if="orderDatalist.invoiceResponses.length > 0">
												{{ orderDatalist.invoiceResponses[0].trackingNumber ? orderDatalist.invoiceResponses[0].trackingNumber : '-' }}
											</div>
											<div class="value" v-else>-</div>
										</li>
									</ul>
									<ul class="list mt-5" v-if="orderDatalist.invoiceResponses.length > 0">
										<li class="" style="display: flex">
											<div class="tips">配送状态：</div>
											<div class="value">
												<div>
													<!-- class="expressageTime" -->
													<span>2025-06-23 09:24:24</span>&nbsp&nbsp&nbsp<span>快件已发往成都华阳中通速递天府新区分拣中心</span>
												</div>
												<div>
													<span>2025-06-23 09:24:24</span>&nbsp&nbsp&nbsp<sapn
														>快件已转至广州仓广州仓广州仓广州仓广州仓广州仓，预计6月24日24:00点前送达</sapn
													>
												</div>
											</div>
										</li>
									</ul>
								</div>
								<div v-else>-</div>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="商品信息" name="goods">
						<el-table
							border
							class="mt20"
							:data="orderDatalist.orderDetailList"
							:cell-style="{ textAlign: 'left' }"
							:header-cell-style="{ textAlign: 'left', background: '#e7eefd', color: '#515a6e' }"
						>
							<el-table-column label="商品信息" min-width="360" :show-overflow-tooltip="true">
								<template #default="{ row }">
									<div class="acea-row row-middle">
										<div class="demo-image__preview mr15 line-heightOne">
											<el-image :src="row.image" :preview-src-list="[row.image]" />
										</div>
										<div style="width: 408px">
											<div class="line1 mb10">{{ row.productName }}</div>
											<div style="color: #909399">规格：{{ row.sku }}</div>
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="商品原价" min-width="90">
								<template #default="{ row }">
									<div class="acea-row row-middle">
										<div class="line1">
											{{ calculatePrice(row.payPrice, row.scorePrice) }}
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="现金" prop="payPrice" min-width="60" />
							<el-table-column label="积分" prop="scorePrice" min-width="120">
								<template #default="{ row }">
									<div>
										<div>{{ row.scorePrice || 0 }}</div>
										<div>({{ row.scorePrice ? (row.scorePrice / 100).toFixed(2) : '0.00' }}元)</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="活动优惠" prop="distributorCouponPrice" min-width="90" />
							<el-table-column label="优惠券" prop="couponPrice" min-width="90" />
							<el-table-column label="购买数量" min-width="90">
								<template #default="{ row }">
									<div class="acea-row row-middle">
										<div class="line1">
											{{ row.payNum }}
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="发货数量" min-width="90">
								<template #default="{ row }">
									<div class="acea-row row-middle">
										<div class="line1">
											{{ row.deliveryNum }}
										</div>
									</div>
								</template>
							</el-table-column>
							<!-- <el-table-column label="售后数量" min-width="90">
                <template #default="{ row }">
                  <div class="acea-row row-middle">
                    <div class="line1 mb10 line-heightOne">退款中：{{ row.applyRefundNum }}</div>
                    <div class="line1 line-heightOne">退款成功：{{ row.refundNum }}</div>
                  </div>
                </template>
              </el-table-column> -->
						</el-table>
					</el-tab-pane>
					<el-tab-pane v-if="orderDatalist?.status > 1 && orderDatalist?.status < 9 && orderDatalist?.type < 5" label="发货记录" name="delivery">
						<div v-if="orderDatalist.shippingType === 1 && InvoiceList.length">
							<template v-for="item in InvoiceList">
								<el-table
									border
									class="mt20"
									:data="item.detailList"
									:cell-style="{ textAlign: 'left' }"
									:header-cell-style="{ textAlign: 'left', background: '#e7eefd', color: '#515a6e' }"
								>
									<el-table-column min-width="400">
										<template slot="header" #default="{ row }">
											<span>{{ item.expressName + ':' + item.trackingNumber }}</span>
											<span class="ml30">{{ item.createTime }}</span>
										</template>
										<template #default2="{ row }">
											<div class="acea-row row-middle">
												<div class="demo-image__preview mr15">
													<el-image :src="row.image" :preview-src-list="[row.image]" />
												</div>
												<div>
													<div class="line1 mb10 color-text line-heightOne">{{ row.productName }}</div>
													<div class="line1 color-909399 line-heightOne">规格：{{ row.sku }}</div>
												</div>
											</div>
										</template>
									</el-table-column>
									<el-table-column width="90">
										<template slot="header" #default="{ row }">
											<a @click="openLogistics(item.id, item.expressName)">物流查询 </a>
										</template>
										<template #default2="{ row }">
											<div class="acea-row row-middle">
												<div class="line1 font12 color-text">X {{ row.num }}</div>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</div>
						<div v-if="orderDatalist.shippingType === 2">
							<div class="detailSection">
								<ul class="list">
									<!--                  <li class="item">-->
									<!--                    <div>门店自提：</div>-->
									<!--                  </li>-->
									<li class="item">
										<div>核销员名称：</div>
										<div class="value">{{ orderDatalist.clerkName }} | {{ orderDatalist.clerkId }}</div>
									</li>
								</ul>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="售后记录" name="operationLog">
						<el-table
							border
							class="mt20 orderDetailList"
							:data="refundTableList"
							:cell-style="{ textAlign: 'left' }"
							:header-cell-style="{ textAlign: 'left', background: '#e7eefd', color: '#515a6e' }"
						>
							<el-table-column label="售后单号" prop="refundOrderNo" :show-overflow-tooltip="true" />
							<el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" />
							<el-table-column label="状态" prop="attrValueId" :show-overflow-tooltip="true">
								<template #default="{ row }">
									<span>{{ refundStatusList[row.refundStatus] }}</span>
								</template>
							</el-table-column>
							<el-table-column label="审核人" prop="auditName" :show-overflow-tooltip="true" />
							<el-table-column label="审核时间" prop="auditTime" :show-overflow-tooltip="true" />
							<el-table-column label="审核结果" prop="auditResult" :show-overflow-tooltip="true">
								<template #default="{ row }">
									<span v-if="row.auditResult == true">通过</span>
									<span v-if="row.auditResult == false">不通过</span>
								</template>
							</el-table-column>
							<el-table-column label="退款金额" prop="refundPrice" :show-overflow-tooltip="true" />
							<el-table-column label="回退积分" prop="refundScorePrice" :show-overflow-tooltip="true" />
							<el-table-column label="审核说明" prop="refundReason" :show-overflow-tooltip="true" />
							<el-table-column label="操作" prop="attrValueId">
								<template #default="{ row }">
									<a @click="toPath(row)">查看详情</a>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="操作日志" name="refundDetail">
						<el-table
							class="mt20 orderDetailList"
							:data="orderDatalist.orderStatusList"
							border
							:cell-style="{ textAlign: 'left' }"
							:header-cell-style="{ textAlign: 'left', background: '#e7eefd', color: '#515a6e' }"
						>
							<el-table-column label="序号" type="index" width="60" :show-overflow-tooltip="true" />
							<el-table-column label="操作" prop="changeType" :show-overflow-tooltip="true">
								<template #default="{ row }">
									<div>
										<span v-if="row.changeType == 'create'">创建订单</span>
										<span v-if="row.changeType == 'pay'">支付</span>
										<span v-if="row.changeType == 'express'">发货</span>
										<span v-if="row.changeType == 'fictitious'">虚拟发货</span>
										<span v-if="row.changeType == 'receipt'">收货</span>
										<span v-if="row.changeType == 'evaluation'">评价订单</span>
										<span v-if="row.changeType == 'fulfilled'">完成</span>
										<span v-if="row.changeType == 'edit'">编辑</span>
										<span v-if="row.changeType == 'cancel'">取消</span>
										<span v-if="row.changeType == 'remove'">删除订单</span>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="操作时间" prop="createTime" :show-overflow-tooltip="true" />
							<el-table-column label="操作人类型" prop="operatorType" :show-overflow-tooltip="true">
								<template #default="{ row }">
									<span v-if="row.operatorType == 1">终端用户</span>
									<span v-if="row.operatorType == 2">后台管理账号</span>
								</template>
							</el-table-column>
							<el-table-column label="操作人电话" prop="auditName" :show-overflow-tooltip="true" />
						</el-table>
					</el-tab-pane>
				</el-tabs>
			</div>
			
		</div>
	</div>
			
		<!-- </el-drawer> -->
		<el-dialog v-if="orderDatalist" title="提示" :visible.sync="modal2" width="600px">
			<div class="logistics acea-row row-top">
				<div class="logistics_img"><img src="/@/assets/imgs/expressi.jpg" /></div>
				<div class="logistics_cent">
					<span class="mb10">物流公司：{{ expressName }}</span>
					<span>物流单号：{{ resultInfo.number }}</span>
					<span v-show="resultInfo.courierPhone">快递站：{{ resultInfo.courierPhone }}</span>
					<span v-show="resultInfo.courierPhone">快递员电话：{{ resultInfo.courierPhone }}</span>
				</div>
			</div>
			<div class="acea-row row-column-around trees-coadd">
				<div class="scollhide">
					<el-timeline :reverse="reverse">
						<el-timeline-item v-for="(item, i) in result" :key="i">
							<p class="time" v-text="item.time"></p>
							<p class="content" v-text="item.status"></p>
						</el-timeline-item>
					</el-timeline>
				</div>
			</div>
			<template #footer>
				<el-button type="primary" @click="modal2 = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { getLogisticsInfoApi, orderInvoiceListApi, orderDetailApi, refundOrderDetailApi } from '/@/api/culture/order';
import { onBeforeRouteUpdate, RouteLocation, useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
interface OrderDetailProps {
	orderNo?: string;
}
interface OrderDetail {
	type: number;
	shippingType: number;
	status: number;
	refundStatus?: number;
	payPrice?: string | number;
	payType?: string;
	createTime?: string;
	nikeName?: string;
	uid?: string;
	phone?: string;
	realName?: string;
	userPhone?: string;
	userAddress?: string;
	proTotalPrice?: string;
	totalNum?: number;
	couponPrice?: string;
	paid?: boolean;
	payPostage?: string;
	scorePrice?: number;
	svipDiscountPrice?: string;
	distributorCouponPrice?: string;
	merCouponPrice?: string;
	userRemark?: string;
	merchantRemark?: string;
	clerkName?: string;
	clerkId?: string;
	orderNo?: string;
	orderDetailList?: any[];
	refundDetailList?: any[];
	invoiceResponses: any[];
	expressName?: string;
	expressCode?: string;
	trackingNumber?: string;
	payTime?: string;
	orderStatusList?: any[];
}
interface InvoiceItem {
	expressName: string;
	trackingNumber: string;
	createTime: string;
	detailList: any[];
	id: string;
}
interface ResultInfo {
	number: string;
	courierPhone?: string;
	records: any[];
}
interface ResultItem {
	time: string;
	status: string;
}

const props = withDefaults(defineProps<OrderDetailProps>(), {
	orderNo: '0',
});

const activeName = ref('detail');
const direction = ref('rtl');
const reverse = ref(true);
const dialogVisible = ref(false);
const orderDatalist = ref<OrderDetail>({
	type: 0,
	shippingType: 0,
	status: 0,
	refundStatus: 0,
	payPrice: '0.0',
	payType: '',
	createTime: '',
	nikeName: '',
	uid: '',
	phone: '',
	realName: '',
	userPhone: '',
	userAddress: '',
	proTotalPrice: '0.0',
	totalNum: 0,
	couponPrice: '0.0',
	paid: false,
	payPostage: '0.0',
	scorePrice: 0,
	svipDiscountPrice: '0.0',
	distributorCouponPrice: '0.0',
	merCouponPrice: '0.0',
	userRemark: '',
	merchantRemark: '',
	clerkName: '',
	clerkId: '',
	orderNo: '',
	orderDetailList: [],
	refundDetailList: [],
	invoiceResponses: [], //物流信息
	orderStatusList: [], //操作日志
	expressName: '',
	expressCode: '',
	trackingNumber: '',
	payTime: '',
});
const loading = ref(false);
const modal2 = ref(false);
const result = ref<ResultItem[]>([]);
const resultInfo = ref<ResultInfo>({
	number: '',
	records: [],
});
const InvoiceList = ref<InvoiceItem[]>([]);
const expressName = ref('');
const refundTableList = ref([]);
const statusMap = {
	0: '普通订单',
	1: '视频号订单',
	2: '秒杀订单',
};
const refundStatusList = ref({
	0: '待审核',
	1: '商家拒绝',
	2: '退款中',
	3: '已退款',
	4: '用户退货',
	5: '商家待收货',
	6: '已撤销',
});
const orderStatusFilters = ref({
	0: '待支付',
	1: '待发货',
	2: '部分发货',
	4: '待收货',
	5: '已收货',
	6: '已完成',
	9: '已取消',
	10: '已退款',
});

onMounted(() => {
	activeName.value = 'detail';
	const orderNo = route.query.orderNo;
	console.log('route.query.orderNo', route.query.orderNo)
	getDetail(orderNo);
	getOrderInvoiceList(orderNo);

});

const handleClose = () => {
	dialogVisible.value = false;
};
const openLogistics = (id, expressName) => {
	expressName.value = expressName;
	getOrderData(id);
	modal2.value = true;
};
// 获取订单物流信息
const getOrderData = (id) => {
	getLogisticsInfoApi(id).then((res) => {
		console.log('res', res);
		resultInfo.value = res.data;
		result.value = res.records;
	});
};
// 获取订单发货单列表
const getOrderInvoiceList = (id) => {
	orderInvoiceListApi(id)
		.then((res) => {
			InvoiceList.value = res.data;
		})
		.catch(() => {});
};
const toPath = (row) => {
	router.push({ path: `/culture/orderManage/workOrder/index`, query: { refundOrderNo: row.refundOrderNo } });
};
const getDetail = async (id) => {
	loading.value = true;
	try {
		const res = await orderDetailApi({ orderNo: id });
		console.log('reas', res);
		orderDatalist.value = res.data;
		refundTableList.value = res.data.refundDetailList;
		activeName.value = 'detail';
		loading.value = false;
	} catch (error) {
		orderDatalist.value = {
			type: 0,
			shippingType: 0,
			status: 0,
			refundStatus: 0,
			payPrice: '0.0',
			payType: '',
			createTime: '',
			nikeName: '',
			uid: '',
			phone: '',
			realName: '',
			userPhone: '',
			userAddress: '',
			proTotalPrice: '0.0',
			totalNum: 0,
			couponPrice: '0.0',
			paid: false,
			payPostage: '0.0',
			scorePrice: 0,
			svipDiscountPrice: '0.0',
			distributorCouponPrice: '0.0',
			merCouponPrice: '0.0',
			userRemark: '',
			merchantRemark: '',
			clerkName: '',
			clerkId: '',
			orderNo: '',
			orderDetailList: [],
			refundDetailList: [],
			invoiceResponses: [],
			payTime: '',
		};
		loading.value = false;
	}
};
// 计算总价 = 价格 + 积分换算
const calculatePrice = (price, score) => {
	const p = price || 0;
	const s = score ? score / 100 : 0;
	return (p + s).toFixed(2);
};

// 必须显式暴露方法和变量给父组件访问
defineExpose({ getDetail, getOrderInvoiceList, dialogVisible });
</script>

<style scoped lang="scss">
.detail-box {
	overflow-y: auto;
	.back-icon {
	font-size: 20px;
	.el-icon {
		height: 100%;
	}
}
}
::v-deep .el-tabs__content {
	padding: 0 20px !important;
}
.detailSection {
	padding: 25px 15px !important;
}
::v-deep .el-table th.el-table__cell > .cell,
::v-deep.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
	padding-left: 15px;
}
.InvoiceList {
	::v-deep.el-collapse-item__header {
		font-size: 12px;
		color: #606266;
	}
}

.wrapper {
	background-color: #fff;
	margin-top: 7px;
	padding: 10px 12px;
	&-num {
		font-size: 10px;
		color: #999999;
	}

	&-title {
		color: #666666;
		font-size: 12px;
	}

	&-img {
		width: 60px;
		height: 60px;
		margin-right: 10px;
		border-radius: 7px;
		overflow: hidden;
		margin-bottom: 10px;

		image {
			width: 100%;
			height: 100%;
		}

		&:nth-child(5n) {
			margin-right: 0;
		}
	}
}

.demo-drawer__content {
	padding: 0 30px;
}

.demo-image__preview {
	display: inline-block;
	.el-image {
		width: 50px;
		height: 50px;
	}
}

.logistics {
	align-items: center;
	padding: 10px 0px;
	.logistics_img {
		width: 45px;
		height: 45px;
		margin-right: 12px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.logistics_cent {
		span {
			display: block;
			font-size: 12px;
		}
	}
}

.trees-coadd {
	width: 100%;
	height: 400px;
	border-radius: 4px;
	overflow: hidden;
	.scollhide {
		width: 100%;
		height: 100%;
		overflow: auto;
		margin-left: 18px;
		padding: 10px 0 10px 0;
		box-sizing: border-box;
		.content {
			font-size: 12px;
		}

		.time {
			font-size: 12px;
			color: #2d8cf0;
		}
	}
}

.description {
	&-term {
		display: table-cell;
		padding-bottom: 5px;
		line-height: 20px;
		width: 50%;
		font-size: 12px;
		color: #606266;
	}
	::v-deep .el-divider--horizontal {
		margin: 12px 0 !important;
	}
}
.detailHead {
	padding: 0 24px 24px 35px;

	.headerBox {
		align-items: flex-start;
	}

	.full {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.order_icon {
			width: 60px;
			height: 60px;
			border-radius: 6px;
			background-color: #0256ff;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.iconfont {
			color: #fff;
			font-size: 35px;

			&.sale-after {
				color: #90add5;
			}
		}

		.text {
			align-self: center;
			flex: 1;
			min-width: 0;
			padding-left: 12px;
			font-size: 13px;
			color: #606266;

			.title {
				margin-bottom: 10px;
				font-weight: 500;
				font-size: 16px;
				line-height: 16px;
				color: rgba(0, 0, 0, 0.85);
			}

			.order-num {
				padding-top: 10px;
				white-space: nowrap;
			}
		}
	}

	.list {
		display: flex;
		margin-top: 20px;
		overflow: hidden;
		list-style: none;
		padding: 0;

		.item {
			flex: none;
			width: 200px;
			font-size: 14px;
			line-height: 14px;
			color: rgba(0, 0, 0, 0.85);

			.title {
				margin-bottom: 12px;
				font-size: 13px;
				line-height: 13px;
				color: #666666;
			}

			.value1 {
				color: #f56022;
			}

			.value2 {
				color: #1bbe6b;
			}

			.value3 {
				color: #0256ff;
			}

			.value4 {
				color: #6a7b9d;
			}

			.value5 {
				color: #f5222d;
			}
		}
	}
}
.detailSection {
	::v-deep .el-table__row {
		padding-left: 15px !important;
	}

	padding: 25px 0;
	border-top: 1px dashed #eeeeee;

	.mt-16 {
		margin-top: -16px;
	}

	.title {
		padding-left: 10px;
		border-left: 3px solid #0256ff;
		font-size: 15px;
		line-height: 15px;
		color: #303133;
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		padding: 0;
	}

	.lang {
		width: 100px;
		text-align: right;
	}

	.tips {
		width: 78px;
		text-align: right;
		font-size: 13px;
		color: #606266;
	}

	.item {
		flex: 0 0 calc(100% / 3);
		display: flex;
		margin-top: 16px;
		font-size: 13px;
		color: #606266;

		&:nth-child(3n + 1) {
			padding-right: 20px;
		}

		&:nth-child(3n + 2) {
			padding-right: 20px;
			//  padding-left: 10px;
		}

		&:nth-child(3n + 3) {
			//  padding-left: 20px;
		}
	}

	.value {
		flex: 1;
		color: #303133;

		image {
			display: inline-block;
			width: 40px;
			height: 40px;
			margin: 0 12px 12px 0;
			vertical-align: middle;
		}
	}

	.item.pic {
		display: flex;

		img {
			width: 80px;
			height: 80px;
		}
	}
}
.padBox {
	padding: 25px 35px !important;
}
:deep(.el-drawer__body) {
	width: 100%;
	height: 100%;
	overflow: auto;
	padding: 30px 0;
}
.showHeader {
	:deep(.el-drawer__body) {
		padding: 15px 0;
	}
	:deep(.el-drawer__header) {
		display: flex;
		margin-bottom: 5px !important;
	}
	.demo-drawer_title {
		font-size: 18px !important;
	}
}
:deep(.el-drawer__header) {
	display: none;
}
.expressageTime {
	text-align: right;
}
</style>
