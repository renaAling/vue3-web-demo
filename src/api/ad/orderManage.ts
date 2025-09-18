import request from '/@/utils/request';
// 定义接口公共前缀
const prefix = '/tracomps-admin/api/admin/platform/order';

/**
 * 列表查询接口
 *
 * @param {string | number} current - 页码,示例值(1)
 * @param {string | number} size - 单页数量,示例值(10)
 * @param {string} orderNo - 订单号
 * @param {string} spuName - 媒体名称
 * @param {string} status - 订单状态
 * @param {string} workOrderId - 工单号
 * @param {string} mobile - 下单手机号码
 * @param {string} startTime - 下单时间起始
 * @param {string} endTime - 下单时间结束
 * @param {string} paymentStartTime - 订单支付时间起始
 * @param {string} paymentEndTime - 订单支付时间结束
 * @returns null 此接口不返回任何内容
 */
export function getOrdersList(params?: Object) {
	return request({
		url: prefix + '/getAdOrderPage',
		method: 'get',
		params,
	});
}

/**
 * 详情接口
 *
 * @param {string} orderNo - 订单号
 * @returns null 此接口不返回任何内容
 */
export function getOrderDetail(orderNo: string) {
	return request({
		url: prefix + `/getAdOrderDtail`,
		method: 'get',
		params: orderNo,
	});
}

/**
 * 发起售后接口
 *
 * @param {string} orderNo - 订单号
 * @param {string} refundReasonWap - 售后类型
 * @param {string} refundReasonWapExplain - 售后原因
 * @returns null 此接口不返回任何内容
 */
export function applyAfterSale(data?: Object) {
	return request({
		url: prefix + `/applyAfterSale`,
		method: 'post',
		data,
	});
}

// 订单详情专用查询省市区区域列表接口
export function getProvinceCityDistrictTree() {
	return request({
		url: '/mall/district/getTreeList',
		method: 'get',
	});
}

// 修改收货地址
export function updateAddress(data?: object) {
	return request({
		url: '/mall/orderDetail/updateDeliveryAddress',
		method: 'put',
		data,
	});
}

// 物流发货
export function orderSendAdd(data?: object) {
	return request({
		url: '/mall/orderLogistics/add',
		method: 'post',
		data,
	});
}

// 修改订单详情的物流单号接口
export function orderCodeUpdate(data?: object) {
	return request({
		url: '/mall/orderLogistics/update',
		method: 'put',
		data,
	});
}

/**
 * @description: 售后工单模块
 */
//列表
export function refundList(params?: Object) {
	return request({
		url: '/mall/afterSale/getAfterSalePage',
		method: 'get',
		params,
	});
}
// 详情
export function refundDetail(params?: object) {
	return request({
		url: '/mall/afterSale/getWorkOrderDetails',
		method: 'get',
		params,
	});
}
// 重新发起
export function refundRestart(data?: object) {
	return request({
		url: '/mall/afterSale/restart',
		method: 'post',
		data,
	});
}
// 审核工单
export function refundApprove(data?: object) {
	return request({
		url: '/mall/afterSale/auditWorkOrder',
		method: 'post',
		data,
	});
}
// 售后原因列表
export function queryReasonList(params?: object) {
	return request({
		url: '/mall/afterSale/queryReasonList',
		method: 'get',
		params,
	});
}
// 发起售后
export function backendApply(data?: object) {
	return request({
		url: '/mall/afterSale/backendApply',
		method: 'post',
		data,
	});
}
