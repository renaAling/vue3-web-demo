import request from '/@/utils/request';

// 列表
export function getCultureUserList(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/ownMallUserController/page',
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
export function getUserManageAddress(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/ownMallUserController/getUserAddressList',
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

// 优惠券持有情况
export function getUserCoupon(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/ownMallUserController/getCouponPage',
		method: 'get',
		params,
	});
}

// 用户积分持有情况
export function getUserScoreInfo(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/ownMallUserController/getUserScoreInfo',
		method: 'get',
		params,
	});
}

export function getUserGroupPage(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userGroup/page',
		method: 'get',
		params,
	});
}

export function addUserGroup(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userGroup/add',
		method: 'POST',
		data,
	});
}

export function editUserGroup(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userGroup/update',
		method: 'PUT',
		data,
	});
}

export function userGroupDetail(id: any) {
	return request({
		url: `/tracomps-admin/api/admin/userGroup/get?id=${id}`,
		method: 'GET',
	});
}

export function deleteUserGroup(id: String) {
	return request({
		url: `/tracomps-admin/api/admin/userGroup/del?id=${id}`,
		method: 'DELETE',
	});
}

// 用户标签
export function getUserLabelPage(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userLabel/page',
		method: 'get',
		params,
	});
}

export function getUserLabelListApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userLabel/getList',
		method: 'get',
		params,
	});
}

export function getUserLabelInfoPage(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userLabelInfo/page',
		method: 'get',
		params,
	});
}

export function addUserLabel(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userLabel/add',
		method: 'POST',
		data,
	});
}

export function editUserLabel(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userLabel/update',
		method: 'PUT',
		data,
	});
}

export function deleteUserLabel(id: String) {
	return request({
		url: `/tracomps-admin/api/admin/userLabel/del?id=${id}`,
		method: 'DELETE',
	});
}

export function saveOrUpdateUserLabelInfos(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userLabelInfo/saveOrUpdateUserLabelInfos',
		method: 'POST',
		data,
	});
}

export function getUserLabelInfosDetail(unionId: string) {
	return request({
		url: `/tracomps-admin/api/admin/userLabelInfo/getUserLabelInfos?unionId=${unionId}`,
		method: 'GET',
	});
}

// 用户分组列表
export function getUserInfoPage(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userGroupInfo/page',
		method: 'get',
		params,
	});
}

export function saveOrUpdateUserGroupInfos(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userGroupInfo/saveOrUpdateUserGroupInfos',
		method: 'POST',
		data,
	});
}

export function getUserGroupInfosDetail(unionId: string) {
	return request({
		url: `/tracomps-admin/api/admin/userGroupInfo/getUserGroupInfos?unionId=${unionId}`,
		method: 'GET',
	});
}

export function getUserGroupListApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/userGroup/getList',
		method: 'get',
		params,
	});
}
