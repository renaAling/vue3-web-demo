import request from '/@/utils/request';

// 列表
export function getCultureUserList(params?: Object) {
	return request({
		url: '/mall/userManage/getUsersPage',
		method: 'get',
		params,
	});
}

// 详情接口-获取除地址信息以外的信息
export function getDetails(params?: Object) {
	return request({
		url: '/mall/userManage/getUserDetails',
		method: 'get',
		params,
	});
}

// 详情接口-获取地址信息列表，带分页
export function getUserManageAddressPage(params?: Object) {
	return request({
		url: '/mall/userManage/getUserManageAddressPage',
		method: 'get',
		params,
	});
}
// 消费列表
export function getUserConsumerInfo(params?: Object) {
	return request({
		url: '/mall/userManage/getUserConsumerInfo',
		method: 'get',
		params,
	});
}
