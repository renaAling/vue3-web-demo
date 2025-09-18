import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/pay/trade/getPage',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/pay/trade',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/pay/trade/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/pay/trade',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/pay/trade',
		method: 'put',
		data: obj,
	});
}

export function channelList(query?: string) {
	return request({
		url: '/pay/platform/getListName',
		method: 'get',
		params: query,
	});
}

// 退款
export function directRefund(query?: object) {
	return request({
		url: '/pay/trade/directRefund?payOrderId=' + query,
		method: 'post',
	});
}
