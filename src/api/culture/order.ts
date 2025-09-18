import request from '/@/utils/request';
const isMerchant = import.meta.env.VITE_IS_MERCHANT;
console.log('isMerchant', isMerchant);
/**
 * 订单 列表
 */
export function orderListApi(data: Object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/order/orderList' : '/tracomps-admin/api/admin/platform/order/orderList';
	return request({
		url,
		method: 'post',
		data,
	});
}

/**
 * 备货单列表
 */
export function stockingListApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/stocking/getListPage`,
		method: 'post',
		data,
	});
}

/**
 * 订单 列表 获取各状态数量
 */
export function orderStatusNumApi(params: Object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/order/status/num' : '/tracomps-admin/api/admin/platform/order/status/num';
	return request({
		url,
		method: 'get',
		params,
	});
}

/**
 * 订单 列表 数据统计
 */
export function orderListDataApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/store/order/list/data',
		method: 'get',
		params,
	});
}
/**
 * 订单 删除
 */
export function orderDeleteApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/store/order/delete',
		method: 'get',
		params,
	});
}

/**
 * 订单 编辑
 */
export function orderUpdateApi(data: Object, params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/store/order/update',
		method: 'post',
		data,
		params,
	});
}

/**
 * 订单 记录
 */
export function orderLogApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/store/order/status/list',
		method: 'get',
		params,
	});
}

/**
 * 订单 详情
 */
export function orderDetailApi(params: Object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/order/info' : '/tracomps-admin/api/admin/platform/order/info';
	return request({
		url,
		method: 'get',
		params,
	});
}

/**
 * 订单 备注
 */
export function orderMarkApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/store/order/mark',
		method: 'post',
		params,
	});
}

/**
 * 订单 发货
 */
export function orderSendApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/store/order/send',
		method: 'post',
		data,
	});
}

/**
 * 订单 拒绝退款
 */
export function orderRefuseApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/store/order/refund/refuse',
		method: 'get',
		params,
	});
}

/**
 * 订单 立即退款
 */
export function orderRefundApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/store/order/refund',
		method: 'get',
		params,
	});
}

/**
 * 订单 核销订单
 * @param prams
 */
export function writeUpdateApi(vCode: number) {
	return request({
		url: `/tracomps-admin/api/admin/store/order/writeUpdate/${vCode}`,
		method: 'get',
	});
}

/**
 * 订单 核销码查询待核销订单
 * @param prams
 */
export function writeConfirmApi(vCode: number) {
	return request({
		url: `/tracomps-admin/api/admin/store/order/writeConfirm/${vCode}`,
		method: 'get',
	});
}

/**
 * 订单 统计 头部数据
 */
export function orderStatisticsApi() {
	return request({
		url: `/tracomps-admin/api/admin/store/order/statistics`,
		method: 'get',
	});
}

/**
 * 核销订单 月列表数据
 */
export function statisticsDataApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/store/order/statisticsData`,
		method: 'get',
		params,
	});
}

/**
 * 一键改价
 */
export function updatePriceApi(data: Object) {
	return request({
		url: `admin/store/order/update/price`,
		method: 'post',
		data,
	});
}

/**
 *订单统计详情
 */
export function orderTimeApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/store/order/time`,
		method: 'get',
		params,
	});
}

/**
 *面单默认配置信息
 */
export function sheetInfoApi() {
	return request({
		url: `/tracomps-admin/api/admin/store/order/sheet/info`,
		method: 'get',
	});
}

/**
 *平台端订单物流详情
 */
export function getLogisticsInfoApi(invoiceId: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/order/get/${invoiceId}/logistics/info`,
		method: 'get',
	});
}

/**
 *视频号物流公司
 */
export function companyGetListApi() {
	return request({
		url: `/tracomps-admin/api/admin/pay/component/delivery/company/get/list`,
		method: 'get',
	});
}

/**
 *视频号物流公司
 */
export function videoSendApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/store/order/video/send`,
		method: 'post',
		data,
	});
}

/**
 *打印小票
 */
export function orderPrint(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/yly/print/${id}`,
		method: 'get',
	});
}

/**
 *退款列表
 */
export function refundListApi(params: Object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/refund/order/list' : '/tracomps-admin/api/admin/platform/refund/order/list';
	return request({
		url,
		method: 'get',
		params,
	});
}

/**
 *平台备注退款订单
 */
export function refundMarkApi(data: Object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/refund/order/mark' : '/tracomps-admin/api/admin/platform/refund/order/mark';
	return request({
		url,
		method: 'post',
		data,
	});
}

/**
 *获取退款订单各状态数量
 */
export function refundStatusNumApi(params: Object) {
	const url = isMerchant
		? '/tracomps-admin/api/admin/merchant/refund/order/status/num'
		: '/tracomps-admin/api/admin/platform/refund/order/status/num';
	return request({
		url,
		method: 'GET',
		params,
	});
}

/**
 * 获取订单发货单列表
 * @param orderNo 订单号
 */
export function orderInvoiceListApi(orderNo: number) {
	const url = isMerchant
		? `/tracomps-admin/api/admin/merchant/order/${orderNo}/invoice/list`
		: `/tracomps-admin/api/admin/platform/order/${orderNo}/invoice/list`;
	return request({
		url,
		method: 'get',
	});
}

/**
 * 平台端退款订单详情
 * @param refundOrderNo 订单号
 */
export function refundOrderDetailApi(refundOrderNo: number) {
	const url = isMerchant
		? `/tracomps-admin/api/admin/merchant/refund/order/detail/${refundOrderNo}`
		: `/tracomps-admin/api/admin/platform/refund/order/detail/${refundOrderNo}`;
	return request({
		url,
		method: 'get',
	});
}

/**
 * 平台端退款订单详情
 * @param params 对象
 */
export function orderExcelApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/export/ownMallExport`,
		method: 'get',
		params,
		responseType: 'blob',
	});
}

/**
 * 平台强制退款
 * @param refundOrderNo
 * @returns {*}
 */
export function orderRefundCompulsoryApi(refundOrderNo: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/refund/order/compulsory/refund/${refundOrderNo}`,
		method: 'post',
	});
}

/**
 * 订单细节详情列表（发货使用）
 * @param orderNo 订单号
 */
export function orderProDetailApi(orderNo: number) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/order/${orderNo}/detail/list`,
		method: 'get',
	});
}

export function orderDetailList(data: any) {
	return isMerchant
		? request({
				url: `/tracomps-admin/api/admin/merchant/order/${data.orderNo}/detail/list`,
				method: 'get',
		  })
		: request({
				url: '/tracomps-admin/api/admin/platform/order/detail/list',
				method: 'post',
				data,
		  });
}

/**
 * 审核售后
 */
export function auditAfterSaleApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/refund/order/audit`,
		method: 'post',
		data,
	});
}

/**
 * 后台管理-运营审核
 */
export function operatorAuditApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/refund/order/operator/audit`,
		method: 'post',
		data,
	});
}

// 后台管理-添加物流信息
export function expressInfoApi(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/refund/order/add/express/info',
		method: 'post',
		data,
	});
}
