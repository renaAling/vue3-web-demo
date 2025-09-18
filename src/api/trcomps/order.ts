import request from '/@/utils/request';
// 公共前缀
const prefix = '/tracomps-admin/api/admin';

/**
 * 获取订单列表 列表
 */
export function orderPageApi(params?: Object) {
	return request({
		url: `${prefix}/merchant/order/list`,
		method: 'get',
		params,
	});
}

/**
 * 订单详情
 */
export function orderInfosApi(orderNo?: any) {
	return request({
		url: `${prefix}/merchant/order/info?orderNo=${orderNo}`,
		method: 'get',
	});
}

/**
 * 退款
 */
export function orderRefundApi(data?: Object) {
	return request({
		url: `${prefix}/merchant/order/direct/refund`,
		method: 'post',
		data,
	});
}
