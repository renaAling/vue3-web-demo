import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/pay/refund/getPage',
		method: 'get',
		params: query,
	});
}

export function useRefundApi(obj?: Object) {
	return request({
		url: '/pay/refund',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/pay/refund/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/pay/refund',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/pay/refund',
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
