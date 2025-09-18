import request from '/@/utils/request';

export function pageList(query?: Object) {
	return request({
		url: '/pay/bill/getPage',
		method: 'get',
		params: query,
	});
}

// 账单下载
export function downloadBill(query?: Object) {
	return request({
		url: '/pay/trade/downloadBill',
		method: 'get',
		params: query,
	});
}
