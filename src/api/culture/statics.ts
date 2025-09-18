// 财务统计相关接口
import request from '/@/utils/request';

// 列表
export function orderPaymentList(params?: Object) {
	return request({
		url: '/pay/trade/getMallTradeOrderPage',
		method: 'get',
		params,
	});
}
export function orderRefundList(params?: Object) {
	return request({
		url: '/pay/refund/getMallRefundOrderPage',
		method: 'get',
		params,
	});
}

