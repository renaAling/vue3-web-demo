<template>
	<div>
		<el-drawer v-model="drawerVisible" :direction="direction" size="1000px" :before-close="handleClose">
			<div v-loading="loading">
				<div class="detailHead">
					<div class="acea-row row-between headerBox">
						<div class="full">
							<div class="order_icon">
								<el-icon color="#fff" size="30"><List /></el-icon>
							</div>
							<div class="text">
								<div class="title">退款订单</div>
								<div>
									<span class="mr20">退款单号：{{ refundInfo.refundOrderNo }}</span>
								</div>
							</div>
						</div>
						<!-- 审核 -->
						<div class="acea-row row-center-wrapper">
							<!-- 审核 -->
							<div v-if="refundInfo.refundStatus === 0" class="acea-row row-center-wrappe mr14">
								<el-button
									type="primary"
									@click="
										() => {
											handleApprovedReview('success');
										}
									"
									>审核</el-button
								>
							</div>
							<el-button @click.native="onOrderMark(refundInfo)">订单备注</el-button>
							<el-button type="primary" v-if="refundInfo.refundStatus == 0" @click.native="openExpressage(refundInfo)">填入退货快递单号</el-button>
						</div>
					</div>

					<ul class="list">
						<li class="item">
							<div class="title">退款状态</div>
							<div class="color-warning" v-if="refundInfo.refundStatus == 0">待运营审核</div>
							<div class="color-warning" v-if="refundInfo.refundStatus == 1">审核未通过</div>
							<div class="color-warning" v-if="refundInfo.refundStatus == 2">退款中</div>
							<div class="color-warning" v-if="refundInfo.refundStatus == 3">已退款</div>
							<!-- <div class="color-warning" v-if="refundInfo.refundStatus == 4">用户退货</div> -->
							<!-- <div class="color-warning" v-if="refundInfo.refundStatus == 5">商家待收货</div> -->
							<div class="color-warning" v-if="refundInfo.refundStatus == 6">已撤销</div>
							<div class="color-warning" v-if="refundInfo.refundStatus == 7">待财务审核</div>
						</li>
						<li class="item">
							<div class="title">退款金额</div>
							<div v-if="refundInfo.refundStatus == 0"><!--待审核状态不展示退款金额--></div>
							<div v-else>¥ {{ refundInfo.refundPrice || '0.0' }}</div>
						</li>
						<li class="item">
							<div class="title">实付金额</div>
							<div>{{ refundInfo.payPrice }}</div>
						</li>
						<li class="item">
							<div class="title">创建时间</div>
							<div>{{ refundInfo.orderInfoVo ? refundInfo.orderInfoVo.createTime : '' }}</div>
						</li>
					</ul>
				</div>
				<el-tabs type="border-card" v-model="activeName">
					<el-tab-pane label="申请信息" name="apply">
						<div class="afterSaleApply">
							<el-row :gutter="20">
								<el-col :span="12">
									<span class="lable">售后类型：</span>
									<span v-if="refundInfo.afterSalesType == 1">仅退款</span>
									<span v-if="refundInfo.afterSalesType == 2">退货退款</span>
									<span v-if="refundInfo.afterSalesType == 3">维修</span>
									<span v-if="refundInfo.afterSalesType == 4">退换货</span>
								</el-col>
								<el-col :span="12">
									<span class="lable">申请原因：</span>
									<span class="value">{{ refundInfo.refundReasonWapExplain }}</span>
								</el-col>
							</el-row>
							<el-row :gutter="20" class="mt-5">
								<el-col :span="24">
									<div class="flex">
										<div>凭证图片：</div>
										<div v-if="refundInfo.refundReasonWapImg">
											<el-image
												v-for="(item, index) in refundInfo.refundReasonWapImg.split(',')"
												:key="`img${index}`"
												:src="item"
												:preview-src-list="[item]"
												style="width: 120px; height: 120px"
												class="mr-1 imageList"
											></el-image>
										</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-tab-pane>
					<el-tab-pane label="售后信息" name="refund">
						<div class="detailSection" style="border: none" v-if="false">
							<div class="title">退款商品</div>
							<ul class="list">
								<li class="item row-middle" v-for="(item, index) in refundInfo.orderDetails" :key="index">
									<div class="image mr10">
										<el-image :src="item.image" :preview-src-list="[item.image]" style="width: 40px; height: 40px"></el-image>
									</div>
									<div>
										<div class="text666 mb10 productName line-height-15">{{ item.productName }}</div>
										<div class="text999">
											<span>{{ item.sku }}</span
											><span class="ml30">售价：￥{{ item.price }}</span>
										</div>
									</div>
								</li>
							</ul>
						</div>
						<div class="detailSection" v-if="refundInfo.refundStatus > 0">
							<div class="title">运营审核</div>
							<ul class="list">
								<li class="item">
									<div class="lang">审核结果：</div>
									<div class="value">
										{{ refundInfo.operatorAuditResult !== null ? (refundInfo.operatorAuditResult ? '同意' : '不同意') : '' }}
									</div>
								</li>
								<li class="item">
									<div class="lang">审核意见：</div>
									<div class="value">{{ refundInfo.operatorRefundReason }}</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div class="title">退款明细</div>
							<ul class="list">
								<li class="item">
									<div class="lang">商品退款：</div>
									<div class="value">{{ refundInfo.refundGoodsPrice }}</div>
								</li>
								<li class="item">
									<div class="lang">运费退款：</div>
									<div class="value">{{ refundInfo.refundFreightFee }}</div>
								</li>
								<li class="item">
									<div class="lang">积分退款：</div>
									<div class="value">{{ refundInfo.refundScorePrice }}</div>
								</li>
								<li class="item">
									<div class="lang">快递公司：</div>
									<div class="value">{{ refundInfo.expressName }}</div>
								</li>
								<li class="item">
									<div class="lang">快递单号：</div>
									<div class="value">{{ refundInfo.trackingNumber }}</div>
								</li>
							</ul>
						</div>
						<div class="detailSection" v-if="refundInfo.refundStatus !== 0 && refundInfo.refundStatus !== 7">
							<div class="title">财务审核</div>
							<ul class="list">
								<li class="item">
									<div class="lang">审核结果：</div>
									<div class="value">
										{{ refundInfo.auditResult !== null ? (refundInfo.auditResult ? '同意' : '不同意') : '' }}
									</div>
								</li>
								<li class="item">
									<div class="lang">审核意见：</div>
									<div class="value">{{ refundInfo.refundReason }}</div>
								</li>
							</ul>
						</div>
						<!-- 退款流程信息-->
						<div class="detailSection">
							<div class="title">退款流程信息</div>
							<div class="detail-centent acea-row">
								<div>
									<!-- <el-steps
										direction="vertical"
										:active="refundInfo.promoterType === 'merchant' ? 2 : refundInfo.statusList && refundInfo.statusList.length"
										finish-status="success"
									></el-steps> -->
									<!--  操作类型：apply-申请退款，audit-商家审核，returning-商品退回，receiving-商家确认收货，refund-退款，compulsory-平台强制退款,revoke-撤销-->
									<el-steps
										direction="vertical"
										:active="refundInfo.refundStatus == 0 || refundInfo.refundStatus == 7 ? 1 : refundInfo.refundStatus"
										finish-status="success"
									>
										<el-step :title="`提交申请-${refundInfo.promoterType == 'user' ? '用户' : '后台/管理员'}`">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>

										<!-- refundInfo.promoterType -->
										<el-step
											title="商家审核-商家"
											v-if="refundInfo.refundStatus === 0 && refundInfo.refundStatus === 7 && refundInfo.refundStatus !== 6"
										>
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step title="审核未通过-商家" v-if="refundInfo.refundStatus === 1 && refundInfo.refundStatus !== 6">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step
											title="退款中-商家"
											v-if="refundInfo.refundStatus >= 2 && refundInfo.refundStatus !== 7 && refundInfo.refundStatus !== 6"
										>
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step
											title="已退款-商家"
											v-if="refundInfo.refundStatus >= 2 && refundInfo.refundStatus !== 7 && refundInfo.refundStatus !== 6"
										>
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step title="已撤销" v-if="refundInfo.refundStatus === 6">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<!-- <el-step title="提交申请-用户">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step title="商家审核-商家" v-if="refundInfo.refundStatus === 0 && refundInfo.refundStatus === 7">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step title="审核未通过-商家" v-if="refundInfo.refundStatus === 1">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step title="退款中-商家" v-if="refundInfo.refundStatus  2">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step title="已退款-商家">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step> -->

										<!-- <el-step title="直接退款-商家" v-if="refundInfo.promoterType === 'merchant'">
											<template #default>
												<div class="mb10">
													{{ refundInfo.refundTime }}
												</div>
											</template>
										</el-step>
										<el-step
											title="申请退款-用户"
											v-if="
												refundInfo.statusList && refundInfo.statusList.length && refundInfo.statusList.find((item:any) => item.changeType === 'apply')
											"
										>
											<template #default>
												<div class="mb10">
													{{ refundInfo.statusList.filter((item: any) => item.changeType === 'apply')[0].createTime }}
												</div>
												<div class="refundReasonWap">
													<div class="acea-row">
														<div class="detail-term" style="width: 58%">
															<span class="detail-infoTitle">退款原因：</span><span class="detail-info">{{ refundInfo.refundReasonWap }}</span>
														</div>
													</div>
													<div class="detail-term acea-row">
														<span class="detail-infoTitle">备注说明：</span>
														<div class="detail-info" style="width: 600px">
															{{ filterEmpty(refundInfo.refundReasonWapExplain) }}
														</div>
													</div>
													<div class="detail-term">
														<div class="acea-row">
															<span class="detail-infoTitle">退款凭证：</span>

															<div v-if="refundInfo.refundReasonWapImg">
																<el-image
																	v-for="(item, index) in refundInfo.refundReasonWapImg.split(',')"
																	:key="index"
																	style="width: 60px; height: 60px"
																	:src="item"
																	class="mr10"
																	:preview-src-list="refundInfo.refundReasonWapImg.split(',')"
																></el-image>
															</div>
															<div v-else>-</div>
														</div>
													</div>
												</div>
											</template>
										</el-step>
										<el-step
											title="商家审核-商家"
											v-if="
												refundInfo.statusList && refundInfo.statusList.length && refundInfo.statusList.find((item:any) => item.changeType === 'audit')
											"
										>
											<template #default>
												<div v-if="refundInfo.statusList && refundInfo.statusList.length">
													<div class="mb10">
														{{
															refundInfo.statusList.filter((item: any) => item.changeType === 'audit').length
																? refundInfo.statusList.filter((item: any) => item.changeType === 'audit')[0].createTime
																: ''
														}}
													</div>
													<div v-if="refundInfo.refundStatus > 0" class="refundReasonWap">
														<div class="detail-term">
															<span class="detail-infoTitle">审核结果：</span
															><span class="detail-info">{{
																refundInfo.refundStatus === 1 && refundInfo.statusList.length === 2 ? '拒绝退款' : '同意退款'
															}}</span>
														</div>
														<div v-if="refundInfo.refundStatus === 1 && refundInfo.statusList.length === 2" class="detail-term">
															<span class="detail-infoTitle">拒绝原因：</span>
															<span class="detail-info">{{ filterEmpty(refundInfo.refundReason) }}</span>
														</div>
														<div v-if="refundInfo.returnGoodsType === 1 && refundInfo.refundStatus !== 1" class="detail-term">
															<div>
																<span class="detail-infoTitle">退货地址：</span>
																<span class="detail-info">{{ refundInfo.receiverAddressDetail }}</span>
															</div>
															<div>
																<span class="detail-infoTitle"></span>
																<span class="detail-info">{{ refundInfo.receiver }} {{ refundInfo.receiverPhone }}</span>
															</div>
														</div>
													</div>
												</div>
											</template>
										</el-step>
										<el-step
											title="商品退回信息-用户"
											v-if="
												refundInfo.statusList && refundInfo.statusList.length && refundInfo.statusList.find((item:any) => item.changeType === 'returning')
											"
										>
											<template #default>
												<div v-if="refundInfo.statusList && refundInfo.statusList.length">
													<div class="mb10">
														{{ refundInfo.statusList.filter((item: any) => item.changeType === 'returning')[0].createTime }}
													</div>
													<div v-if="refundInfo.returnGoodsType === 1" class="refundReasonWap">
														<div class="acea-row">
															<div class="detail-term" style="width: 58%">
																<span class="detail-infoTitle">物流公司：</span><span class="detail-info">{{ refundInfo.expressName }}</span>
															</div>
															<div class="detail-term">
																<span class="detail-infoTitle">物流单号：</span>
																<span class="detail-info">{{ refundInfo.trackingNumber }}</span>
															</div>
														</div>
														<div class="detail-term">
															<div>
																<span class="detail-infoTitle">联系电话：</span>
																<span class="detail-info">{{ refundInfo.telephone }}</span>
															</div>
														</div>
													</div>
													<div v-if="refundInfo.returnGoodsType === 2" class="refundReasonWap">
														<div class="detail-term">
															<div>
																<span class="detail-infoTitle">联系电话：</span>
																<span class="detail-info">{{ refundInfo.telephone }}</span>
															</div>
														</div>
													</div>
												</div>
											</template>
										</el-step>
										<el-step
											title="商家确认收货-商家"
											v-if="
												refundInfo.refundStatus !== 1 &&
												refundInfo.refundStatus !== 6 &&
												refundInfo.statusList &&
												refundInfo.statusList.length &&
												refundInfo.statusList.find((item:any) => item.changeType === 'receiving')
											"
										>
											<template #default>
												<div class="mb10" v-if="refundInfo.statusList && refundInfo.statusList.length">
													{{
														refundInfo.statusList.filter((item: any) => item.changeType === 'receiving').length
															? refundInfo.statusList.filter((item: any) => item.changeType === 'receiving')[0].createTime
															: ''
													}}
												</div>
											</template>
										</el-step>
										<el-step
											title="商品拒绝收货-商家"
											v-if="
												refundInfo.statusList &&
												refundInfo.statusList.length &&
												refundInfo.statusList.find((item:any) => item.changeType === 'rejectionGoods')
											"
										>
											<template #default>
												<div class="mb10" v-if="refundInfo.statusList && refundInfo.statusList.length">
													{{ refundInfo.statusList.filter((item: any) => item.changeType === 'rejectionGoods')[0].createTime }}
												</div>
												<div v-if="refundInfo.refundStatus > 0" class="refundReasonWap">
													<div class="detail-term">
														<span class="detail-infoTitle">审核结果：</span
														><span class="detail-info">{{ refundInfo.refundStatus === 1 ? '拒绝退款' : '同意退款' }}</span>
													</div>
													<div v-if="refundInfo.refundStatus === 1" class="detail-term">
														<span class="detail-infoTitle">拒绝原因：</span>
														<span class="detail-info">{{ filterEmpty(refundInfo.refundReason) }}</span>
													</div>
													<div v-if="refundInfo.returnGoodsType === 1 && refundInfo.refundStatus !== 1" class="detail-term">
														<div>
															<span class="detail-infoTitle">退货地址：</span>
															<span class="detail-info">{{ refundInfo.receiverAddressDetail }}</span>
														</div>
														<div>
															<span class="detail-infoTitle"></span>
															<span class="detail-info">{{ refundInfo.receiver }} {{ refundInfo.receiverPhone }}</span>
														</div>
													</div>
												</div>
											</template>
										</el-step>
										<el-step
											title="已撤销"
											v-if="
												refundInfo.refundStatus === 6 &&
												refundInfo.statusList &&
												refundInfo.statusList.length &&
												refundInfo.statusList.find((item:any) => item.changeType === 'revoke')
											"
										>
											<template #default>
												<div class="mb10" v-if="refundInfo.statusList && refundInfo.statusList.length">
													{{
														refundInfo.statusList.filter((item: any) => item.changeType === 'revoke').length
															? refundInfo.statusList.filter((item: any) => item.changeType === 'revoke')[0].createTime
															: ''
													}}
												</div>
											</template>
										</el-step>
										<el-step
											title="平台强制退款成功"
											v-if="
												refundInfo.statusList &&
												refundInfo.statusList.length &&
												refundInfo.statusList.find((item:any) => item.changeType === 'compulsory')
											"
										>
											<template #default>
												<div class="mb10" v-if="refundInfo.statusList && refundInfo.statusList.length">
													{{
														refundInfo.statusList.filter((item: any) => item.changeType === 'compulsory').length
															? refundInfo.statusList.filter((item: any) => item.changeType === 'compulsory')[0].createTime
															: ''
													}}
												</div>
											</template>
										</el-step>
										<el-step
											:title="refundInfo.promoterType === 'user' ? '退款成功' : '退款成功-商家直接退款'"
											v-if="
												refundInfo.refundStatus !== 1 &&
												refundInfo.refundStatus !== 6 &&
												refundInfo.statusList &&
												refundInfo.statusList.length &&
												refundInfo.statusList.find((item:any) => item.changeType === 'refund')
											"
										>
											<template #default>
												<div class="mb10" v-if="refundInfo.statusList && refundInfo.statusList.length">
													{{
														refundInfo.statusList.filter((item: any) => item.changeType === 'refund').length
															? refundInfo.statusList.filter((item: any) => item.changeType === 'refund')[0].createTime
															: ''
													}}
												</div>
											</template>
										</el-step>
										<el-step
											title="商家审核-商家"
											v-if="
												refundInfo.refundStatus !== 1 &&
												refundInfo.refundStatus !== 2 &&
												refundInfo.refundStatus !== 6 &&
												refundInfo.refundStatus === 0
											"
										>
										</el-step>
										<el-step
											title="商品退回信息-用户"
											v-if="
												refundInfo.refundStatus !== 1 &&
												refundInfo.refundStatus !== 2 &&
												refundInfo.refundStatus !== 6 &&
												refundInfo.afterSalesType === 2 &&
												(refundInfo.refundStatus === 0 || refundInfo.refundStatus === 4)
											"
										>
										</el-step>
										<el-step
											title="商家确认收货-商家"
											v-if="
												refundInfo.refundStatus !== 1 &&
												refundInfo.refundStatus !== 2 &&
												refundInfo.refundStatus !== 6 &&
												refundInfo.afterSalesType === 2 &&
												(refundInfo.refundStatus === 0 || refundInfo.refundStatus === 4 || refundInfo.refundStatus === 5)
											"
										>
										</el-step>
										<el-step
											:title="refundInfo.promoterType === 'user' ? '退款成功' : '退款成功-商家直接退款'"
											v-if="
												refundInfo.refundStatus !== 1 &&
												refundInfo.refundStatus !== 6 &&
												(refundInfo.refundStatus === 0 ||
													refundInfo.refundStatus === 2 ||
													refundInfo.refundStatus === 4 ||
													refundInfo.refundStatus === 5)
											"
										>
										</el-step> -->
									</el-steps>
								</div>
							</div>
						</div>
						<div class="detailSection">
							<div class="title">平台备注</div>
							<ul class="list">
								<li class="item">
									<div>{{ filterEmpty(refundInfo.platformRemark) }}</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div class="title">商家备注</div>
							<ul class="list">
								<li class="item">
									<div>{{ filterEmpty(refundInfo.merRemark) }}</div>
								</li>
							</ul>
						</div>
					</el-tab-pane>
					<el-tab-pane label="订单信息" name="detail" v-if="refundInfo.orderInfoVo">
						<div class="detailSection">
							<div class="title">用户信息</div>
							<ul class="list">
								<li class="item">
									<div class="lang">用户昵称：</div>
									<div class="value">
										<span class="mr5">{{ refundInfo.orderInfoVo.nickname }}</span>
										<span class="mr5"> | </span>
										<span>{{ refundInfo.orderInfoVo.uid }}</span>
									</div>
								</li>
								<li class="item">
									<div class="lang">用户电话：</div>
									<div class="value">{{ refundInfo.orderInfoVo.phone }}</div>
								</li>
							</ul>
						</div>
						<div v-show="refundInfo.orderInfoVo.shippingType < 3" class="detailSection">
							<div class="title">配送信息</div>
							<ul class="list">
								<li class="item">
									<div class="lang">配送方式：</div>
									<div class="value">{{ refundInfo.orderInfoVo.shippingType === 1 ? '快递' : '门店自提' }}</div>
								</li>
								<li class="item">
									<div class="lang">收货电话：</div>
									<div class="value">{{ filterEmpty(refundInfo.orderInfoVo.userPhone) }}</div>
								</li>
								<li class="item">
									<div class="lang">收货人：</div>
									<div class="value">{{ filterEmpty(refundInfo.orderInfoVo.realName) }}</div>
								</li>
							</ul>
							<div class="userAddress acea-row">
								<div class="lang">收货地址：</div>
								<div class="value">{{ filterEmpty(refundInfo.orderInfoVo.userAddress) }}</div>
							</div>
						</div>
						<div class="detailSection">
							<div class="title">订单信息</div>
							<ul class="list">
								<li class="item">
									<div class="lang">订单号：</div>
									<div class="value">{{ refundInfo.orderInfoVo.orderNo }}</div>
								</li>
								<li class="item">
									<div class="lang">商品总数：</div>
									<div class="value">{{ refundInfo.orderInfoVo.totalNum }}</div>
								</li>
								<li class="item">
									<div class="lang">支付状态：</div>
									<div class="value">{{ refundInfo.orderInfoVo.paid ? '已支付' : '未支付' }}</div>
								</li>
								<li class="item">
									<div class="lang">支付方式：</div>
									<div class="value">{{ refundInfo.orderInfoVo.payType }}</div>
								</li>
								<li class="item">
									<div class="lang">订单状态：</div>
									<div class="value textE93323">
										<span v-if="refundInfo.orderInfoVo.refundStatus === 3">已退款</span>
										<div v-else>
											<span v-if="refundInfo.orderInfoVo.status == 0">待支付</span>
											<span v-if="refundInfo.orderInfoVo.status == 1">待备货</span>
											<span v-if="refundInfo.orderInfoVo.status == 2">备货中</span>
											<span v-if="refundInfo.orderInfoVo.status == 3">待核销</span>
											<span v-if="refundInfo.orderInfoVo.status == 4">待收货</span>
											<span v-if="refundInfo.orderInfoVo.status == 5">已收货</span>
											<span v-if="refundInfo.orderInfoVo.status == 6">已完成</span>
											<span v-if="refundInfo.orderInfoVo.status == 9">已取消</span>
											<span v-if="refundInfo.orderInfoVo.status == 10">已退款</span>
										</div>
									</div>
								</li>
								<li class="item">
									<div class="lang">已发货数量：</div>
									<div class="value">{{ refundInfo.orderInfoVo.deliveryNum }}</div>
								</li>
								<li class="item">
									<div class="lang">创建时间：</div>
									<div class="value">{{ refundInfo.orderInfoVo.createTime }}</div>
								</li>
								<li class="item">
									<div class="lang">支付时间：</div>
									<div class="value">{{ refundInfo.orderInfoVo.payTime }}</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div class="title">订单明细</div>
							<ul class="list">
								<li class="item">
									<div class="lang">商品总价：</div>
									<div class="value">￥{{ refundInfo.orderInfoVo.proTotalPrice }}</div>
								</li>
								<li class="item">
									<div class="lang">优惠券优惠：</div>
									<div class="value">￥{{ refundInfo.orderInfoVo.platCouponPrice || 0 }}</div>
								</li>
								<!-- <li class="item">
                  <div class="lang">平台优惠金额：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.platCouponPrice }}</div>
                </li> -->
								<li class="item">
									<div class="lang">赠送积分：</div>
									<div class="value">{{ refundInfo.orderInfoVo.payPrice || 0 }}</div>
								</li>
								<li class="item">
									<div class="lang">实际支付：</div>
									<div class="value">￥{{ refundInfo.orderInfoVo.payPrice }}</div>
								</li>
								<li class="item">
									<div class="lang">分销优惠金额：</div>
									<div class="value">{{ refundInfo.orderInfoVo.distributorCouponPrice || 0 }}</div>
								</li>
								<li class="item">
									<div class="lang">员工优惠金额：</div>
									<div class="value">￥{{ refundInfo.orderInfoVo.svipDiscountPrice || 0 }}</div>
								</li>
								<li class="item">
									<div class="lang">支付邮费：</div>
									<div class="value">￥{{ refundInfo.orderInfoVo.payPostage }}</div>
								</li>
								<li class="item">
									<div class="lang">积分金额：</div>
									<div class="value">
										￥{{ refundInfo.orderInfoVo.scorePrice ? (refundInfo.orderInfoVo.scorePrice / 100).toFixed(2) : 0 }}
										<span>({{ refundInfo.orderInfoVo.scorePrice || 0 }}积分)</span>
									</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div class="title">用户备注</div>
							<ul class="list">
								<li class="item">
									<div class="value productName">{{ filterEmpty(refundInfo.orderInfoVo.userRemark) }}</div>
								</li>
							</ul>
						</div>
						<div class="detailSection">
							<div class="title">商家备注</div>
							<ul class="list">
								<li class="item">
									<div class="value productName">{{ filterEmpty(refundInfo.orderInfoVo.merchantRemark) }}</div>
								</li>
							</ul>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-drawer>
		<el-dialog title="审核退款单" v-model="afterSalesDialog" width="600px" v-loading="loadingAfterSales" :show-close="false" @close="closeAfter">
			<el-form ref="afterSales" :model="afterForm" :rules="afterRules" label-width="120px" @submit.native.prevent>
				<el-form-item label="退款中心" prop="refundAmountType">
					<div style="display: flex; align-items: center">
						<el-radio-group v-model="afterForm.refundAmountType" class="mt3" style="width: 190px">
							<el-radio :label="1">全额退款</el-radio>
							<el-radio :label="2">部分退款</el-radio>
						</el-radio-group>
					</div>
				</el-form-item>
				<el-form-item label="支付现金：">
					<span style="color: #fba66a">{{ refundPriceInfo.payPrice }}</span>
					<p>
						<span style="color: red"
							>当前可退金额：￥{{ refundPriceInfo.totalPrice }}
							<span>，积分可退{{ refundPriceInfo.scorePrice || 0 }}</span>
						</span>
					</p>
				</el-form-item>
				<el-form-item label="商品金额" prop="refundGoodsPrice" v-if="afterForm.refundAmountType == 2">
					<div style="display: flex; align-items: center">
						<el-input-number
							v-model.trim="afterForm.refundGoodsPrice"
							placeholder="请输入金额"
							clearable
							:max="refundPriceInfo.goodsPrice"
							type="number"
							:precision="2"
							:step="0.01"
							:min="0"
							style="width: 190px"
						/>
						<div class="ml20 tips">商品可退金额:{{ refundPriceInfo.goodsPrice ? refundPriceInfo.goodsPrice : 0 }}</div>
					</div>
				</el-form-item>
				<el-form-item v-if="afterForm.refundAmountType == 2" label="积分退款">
					<div style="display: flex; align-items: center">
						<el-input-number
							v-model.trim="afterForm.refundScorePrice"
							placeholder="请输入积分"
							clearable
							type="number"
							:precision="0"
							:min="0"
							:max="refundPriceInfo.scorePrice || 0"
							style="width: 190px"
						/>
						<div class="ml20 tips">积分可退:{{ refundPriceInfo.scorePrice || 0 }}</div>
					</div>
				</el-form-item>
				<el-form-item label="运费退款" prop="refundFreightFee" v-if="afterForm.refundAmountType == 2">
					<div style="display: flex; align-items: center">
						<el-input-number
							v-model.trim="afterForm.refundFreightFee"
							placeholder="请输入金额"
							clearable
							type="number"
							:precision="2"
							:step="0.01"
							:min="0"
							:max="refundPriceInfo.postageFee"
							style="width: 190px"
						/>
						<div class="ml20 tips">运费可退金额:{{ refundPriceInfo.postageFee ? refundPriceInfo.postageFee : 0 }}</div>
					</div>
				</el-form-item>
				<el-form-item label="合计退款" prop="refundPrice">
					<div>
						{{ afterForm.refundAmountType === 1 ? (refundPriceInfo.totalPrice ? refundPriceInfo.totalPrice : 0) : refundMoney }}
						<span
							>&emsp14;+&emsp14;
							<i v-if="afterForm.refundAmountType === 1">{{ refundPriceInfo.scorePrice || 0 }}</i>
							<i v-if="afterForm.refundAmountType === 2">{{ afterForm.refundScorePrice || 0 }}</i>
							积分
						</span>
					</div>
				</el-form-item>
				<el-form-item label="审核说明" prop="reason">
					<el-input type="textarea" maxlength="100" show-word-limit v-model.trim="afterForm.reason" placeholder="请输入审核说明" clearable />
				</el-form-item>
				<el-form-item label="审核意见" prop="auditType">
					<el-radio-group v-model="afterForm.auditType">
						<el-radio label="success">通过</el-radio>
						<el-radio label="refuse">驳回</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="closeAfter">取 消</el-button>
					<el-button type="primary" @click="onAfterSales">确 定</el-button>
				</div>
			</template>
		</el-dialog>
		<el-dialog v-model="dialogFormVisible" title="退款单备注" width="600px" ref="dialogFormVisibleRef">
			<el-form :model="form" ref="ruleFormRef" :rules="rules">
				<el-form-item label="备注:" :label-width="60" prop="remark">
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
		<el-dialog v-model="dialogExpressageFormVisible" title="填入退货快递单号" width="600px" ref="dialogExpressageFormVisibleRef">
			<el-form :model="expressageForm" ref="expressageFormRef" :rules="expressageRules">
				<el-form-item label="快递公司：" prop="expressName">
					<el-select v-model="form.expressName" filterable style="width: 100%" clearable>
						<el-option v-for="(item, i) in express" :value="item.name" :key="i" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="快递单号：" prop="trackingNumber">
					<el-input v-model="form.trackingNumber" placeholder="请输入快递单号" style="width: 100%" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetExpressageForm(expressageFormRef)">取消</el-button>
					<el-button type="primary" @click="submitExpressageForm(expressageFormRef)"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import {
	orderRefundCompulsoryApi,
	expressInfoApi,
	refundMarkApi,
	refundOrderDetailApi,
	auditAfterSaleApi,
	operatorAuditApi,
} from '/@/api/culture/order';
import { getRefundPrice } from '/@/api/culture/cultureOrder';
import { expressPageApi } from '/@/api/culture/logistics';
import { useMessage, useMessageBox } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
const drawerVisible = ref(false);
const refundOrderNo = ref<any>();
const express = ref<any[]>([]);
const dialogExpressageFormVisibleRef = ref<any>();
const dialogFormVisible = ref<boolean>(false);
const dialogExpressageFormVisible = ref<boolean>(false);
const afterSales = ref<any>();
const form = ref<any>({
	telephone: '',
	refundOrderNo: '',
	expressName: '',
	trackingNumber: '',
});
const expressageForm = ref<any>({
	refundOrderNo: '',
	remark: '',
});
const ruleFormRef = ref<FormInstance>();
const expressageFormRef = ref<FormInstance>();
const rules = reactive<FormRules<any>>({
	remark: [
		{
			required: true,
			message: '请输入退款单备注',
			trigger: 'blur',
		},
	],
});
const expressageRules = reactive<FormRules<any>>({});
// 打开弹窗
const openDetail = (orderNo: any) => {
	getList();
	refundOrderNo.value = orderNo;
	drawerVisible.value = true;
	getRefundOrderDetail(orderNo);
};

// 物流公司列表
const getList = () => {
	expressPageApi({
		keywords: '',
		current: 1,
		size: 1200,
		openStatus: true,
	}).then((res) => {
		console.log('res', res);
		express.value = res.data.records;
		express.value.map((item) => {
			if (item.isDefault) form.value.expressCode = item.code;
		});
	});
};
// 定义 emits
const emit = defineEmits<{
	(e: 'onClosedrawerVisible'): void;
	(e: 'getReviewSuccessful'): void;
	(e: 'compulsoryReturnSuccess'): void;
	(e: 'getDataList'): void;
}>();

// Refs for data
const dialogVisible = ref(false);
const loadingBtn = ref(false);
const activeName = ref('apply');
const direction = ref('rtl');
const reverse = ref(true);
const orderDatalist = ref<Record<string, any>>({});
const loading = ref(false);
const modal2 = ref(false);
const result = ref<[]>([]);
const resultInfo = ref<Record<string, any>>({});
const refundInfo = ref<Record<string, any>>({});
const afterSalesDialog = ref(false);
const loadingAfterSales = ref(false);
const imageList = ref<any[]>([
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
	'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
]);
// 表单数据
const afterForm = ref({
	auditType: '',
	refundPrice: '',
	reason: '',
	refundAmountType: 1,
	refundFreightFee: 0,
	refundGoodsPrice: 0,
	refundScorePrice: 0,
});

// 验证规则
const afterRules = {
	reason: [{ required: true, message: '请输入售后原因', trigger: ['blur', 'change'] }],
	auditType: [{ required: true, message: '请选择审核意见', trigger: ['blur', 'change'] }],
};

const refundPriceInfo = ref<Record<string, any>>({});

// 合计金额计算
const refundMoney = computed(() => {
	const freight = afterForm.value.refundFreightFee || 0;
	const goods = afterForm.value.refundGoodsPrice || 0;
	return freight + goods;
});

// 获取退款金额
const getMoney = () => {
	if (afterForm.value.refundAmountType === 1) {
		return refundPriceInfo.value.totalPrice ?? 0;
	} else {
		return refundMoney.value;
	}
};

// 获取积分退款
const getRefundScore = () => {
	if (afterForm.value.refundAmountType === 1) {
		return refundPriceInfo.value.scorePrice ?? 0;
	} else {
		return afterForm.value.refundScorePrice || 0;
	}
};

// 关闭抽屉
const handleClose = () => {
	drawerVisible.value = false;
	emit('getDataList');
};

// 关闭售后弹窗
const closeAfter = () => {
	afterSalesDialog.value = false;
	// 假设 $refs.afterSales.resetFields 是一个方法，这里需要手动处理表单重置
	afterForm.value = {
		auditType: '',
		refundPrice: '',
		reason: '',
		refundAmountType: 1,
		refundFreightFee: 0,
		refundGoodsPrice: 0,
		refundScorePrice: 0,
	};
};
// 公共过滤器
const filterEmpty = (val) => {
	let _result = '-';
	if (!val) {
		return _result;
	}
	_result = val;
	return _result;
};

// 备注操作
const onOrderMark = (row: any) => {
	console.log('row', row);
	form.value.refundOrderNo = '';
	form.value.refundOrderNo = row.refundOrderNo;
	dialogFormVisible.value = true;
	// const platformRemark = refundInfo.value.platformRemark || '';
	// // 模拟 $modalPrompt 方法
	// const newRemark = prompt('退款单备注', platformRemark);
	// if (newRemark !== null) {
	// 	refundMarkApi({ remark: newRemark, refundOrderNo: refundOrderNo.value }).then(() => {
	// 		alert('操作成功');
	// 	});
	// }
};

const openExpressage = (row: any) => {
	Object.assign(form.value, {
		telephone: '',
		orderNo: '',
		expressName: '',
		trackingNumber: '',
	});
	console.log('row', row);
	form.value.telephone = row.telephone;
	form.value.refundOrderNo = row.refundOrderNo;
	dialogExpressageFormVisible.value = true;
};

// 提交售后审核
const onAfterSales = async () => {
	// 这里模拟 validate
	const valid = afterForm.value.auditType && afterForm.value.reason;
	if (!valid) {
		useMessage().error('请填写完整表单信息');
		return;
	}
	if (refundInfo.value.refundStatus == 7) {
		if (
			afterForm.value.refundAmountType === 2 &&
			afterForm.value.auditType === 'success' &&
			!afterForm.value.refundGoodsPrice &&
			!afterForm.value.refundScorePrice &&
			!afterForm.value.refundFreightFee
		) {
			alert('请输入商品/运费金额');
			return;
		}

		const text = `确认对售后单${refundOrderNo.value}${
			afterForm.value.auditType === 'success' ? `同意退款${getMoney()}元+${getRefundScore()}积分` : '驳回'
		}的审核`;
		try {
			await useMessageBox().confirm(text);
			approvedApi();
		} catch {
			return;
		}
	} else {
		approvedApi();
	}
};

// 审核请求
const approvedApi = async () => {
	loadingAfterSales.value = true;
	const params = {
		refundOrderNo: refundOrderNo.value,
		...afterForm.value,
		refundPrice: refundMoney.value,
	};
	try {
		const { code, data, msg } = refundInfo.value.refundStatus == 0 ? await operatorAuditApi(params) : await auditAfterSaleApi(params);
		console.log('aaaaddddd', code, data, msg);
		if (code == 0) {
			useMessage().success(`审核售后成功`);
			closeAfter();
			emit('getReviewSuccessful');
			await getRefundOrderDetail(refundOrderNo.value);
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loadingAfterSales.value = false;
	}
};

// 审核同意
const handleApprovedReview = (str?: string) => {
	console.log('refundInfo.value', refundInfo.value);
	if (refundInfo.value.returnGoodsType !== 1) {
		getRefundPrice(refundInfo.value.orderInfoVo?.orderNo).then((res) => {
			console.log('aaaaa', res);
			if (res) {
				refundPriceInfo.value = res.data;
			}
			afterSalesDialog.value = true;
			console.log('');
		});
	} else {
		dialogVisible.value = true;
	}
};

// 获取订单退款信息
const getRefundOrderDetail = async (id: any) => {
	loading.value = true;
	try {
		const { code, data, msg } = await refundOrderDetailApi(id);
		if (code === 0) {
			refundInfo.value = data;
			loading.value = false;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
		loading.value = false;
	}
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

const submitExpressageForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', expressageForm.value);
			try {
				const { code, msg } = await expressInfoApi(form.value);
				if (code === 0) {
					useMessage().success('操作成功');
					resetExpressageForm(expressageFormRef.value);
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
	// getRefundOrderDetail(refundOrderNo.value);
	dialogFormVisible.value = false;
};
const resetExpressageForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	dialogExpressageFormVisible.value = false;
	formEl.resetFields();
	Object.assign(form.value, {
		telephone: '',
		orderNo: '',
		expressName: '',
		trackingNumber: '',
	});
	// getRefundOrderDetail(refundOrderNo.value);
};
// 强制退款
// const handlerCompulsoryReturn = (refundInfoParam: Record<string, any>) => {
// 	const confirmText = `确定强制退款【${refundInfoParam.refundPrice}】退款单，此操作不可逆，请慎重确认后再操作`;
// 	if (confirm(confirmText)) {
// 		orderRefundCompulsoryApi(refundInfoParam.refundOrderNo).then(() => {
// 			emit('compulsoryReturnSuccess');
// 		});
// 	}
// };

// 暴露变量
defineExpose({
	openDetail,
});
</script>
<style scoped lang="scss">
.order_icon {
	width: 60px;
	height: 60px;
	border-radius: 6px;
	background-color: #0256ff;
	display: flex;
	justify-content: center;
	align-items: center;
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
.acea-row {
	display: -webkit-box;
	display: -moz-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-lines: multiple;
	-moz-box-lines: multiple;
	-o-box-lines: multiple;
	-webkit-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	/* 辅助类 */
}
.acea-row.row-between {
	-webkit-box-pack: justify;
	-moz-box-pack: justify;
	-o-box-pack: justify;
	-ms-flex-pack: justify;
	-webkit-justify-content: space-between;
	justify-content: space-between;
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
.tips {
	color: rgb(245, 108, 108);
}
.userAddress {
	width: 100%;
	margin-top: 16px;
	font-size: 13px;
	color: #666;
}

.productName {
	width: 633px;
}

.detail-centent {
	margin-top: 16px;
}

::v-deep .el-step__main {
	margin-bottom: 30px !important;
}

::v-deep .el-step__title {
	font-size: 14px !important;
}

.flow-path {
	margin-bottom: 70px;
}

.refundReasonWap {
	width: 720px;
	height: auto;
	padding: 10px 25px 0 0;
	border-radius: 14px;
	background-color: #f3f8fe;
	overflow: hidden;
}

.image {
	width: 40px;
	height: 40px;
	border-radius: 4px;
	overflow: hidden;
}

.refund {
	&-title {
		font-size: 17px;
		color: #333333;
		font-weight: 600;
	}

	&-orderNo {
		font-size: 14px;
		color: #333333;
	}

	&-price {
		margin-right: 100px;
	}
}
:deep(.el-drawer__header) {
	display: none;
}
.afterSaleApply {
	.lable {
		font-size: 14px;
		line-height: 14px;
		color: rgba(0, 0, 0, 0.85);
	}
	.value {
		margin-bottom: 12px;
		font-size: 13px;
		line-height: 13px;
		color: #666666;
	}
}

.imageList {
	border-radius: 4px;
}
</style>
<style scoped>
::v-deep(.el-step__icon-inner) {
	font-size: 20px !important;
}
</style>
