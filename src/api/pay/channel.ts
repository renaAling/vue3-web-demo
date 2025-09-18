import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/pay/channel/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/pay/channel',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/pay/channel/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/pay/channel',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/pay/channel',
		method: 'put',
		data: obj,
	});
}

export function pageList(query?: Object) {
	return request({
		url: '/pay/channel/getList',
		method: 'get',
		params: query,
	});
}

export function updateStatus(obj?: Object) {
	return request({
		url: '/pay/channel/updateStatus',
		method: 'put',
		data: obj,
	});
}

export function channelAdd(obj?: Object) {
	return request({
		url: '/pay/channel/add',
		method: 'post',
		data: obj,
	});
}

export function channelList(query?: Object) {
	return request({
		url: '/pay/channel/getList',
		method: 'get',
		params: query,
	});
}
