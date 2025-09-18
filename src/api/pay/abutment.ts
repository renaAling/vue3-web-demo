import request from '/@/utils/request';

export function pageList(query?: Object) {
	return request({
		url: '/pay/platform/getList',
		method: 'get',
		params: query,
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/pay/platform/del',
		method: 'delete',
		data: ids,
	});
}

export function updateStatus(obj?: Object) {
	return request({
		url: '/pay/platform/updateStatus',
		method: 'put',
		data: obj,
	});
}

export function platformAdd(obj?: Object) {
	return request({
		url: '/pay/platform/add',
		method: 'post',
		data: obj,
	});
}
