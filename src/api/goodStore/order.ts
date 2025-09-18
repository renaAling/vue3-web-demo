import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取订单列表
export function getOrderList(params?: object) {
	return request({
		url: prefix + '/payment_order/page',
		method: 'get',
		params,
	});
}

// 获取订单详情
export function orderDetail(orderCode: string) {
	return request({
		url: prefix + `/payment_order/getDetail?orderCode=${orderCode}`,
		method: 'get',
	});
}

// 订单下载接口
export function downLoadOrderExcel(params?: object) {
	return request({
		url: prefix + '/payment_order/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
}

// 撤销订单
export function cancelOrder(data?: object) {
	return request({
		url: prefix + '/pay/payRefund',
		method: 'post',
		data,
	});
}

// 查询网订店取订单剩余金额
export function getRestAmount(orderCode: string) {
	return request({
		url: prefix + `/payment_order/getRefundAmount?orderCode=${orderCode}`,
		method: 'get',
	});
}

// 网订店取订单退款
export function refundOrder(data: object) {
	return request({
		url: prefix + `/refundManage/refund`,
		method: 'post',
		data,
	});
}
