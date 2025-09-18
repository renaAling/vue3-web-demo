import request from '/@/utils/request';

// 账户列表
export function culturalBackUserList(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/culturalBackUsers/page',
		method: 'get',
		params,
	});
}

// 账户新增
export function culturalBackUserAdd(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/culturalBackUsers/create',
		method: 'post',
		data,
	});
}

// 账户编辑
export function culturalBackUserUpdate(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/culturalBackUsers/update',
		method: 'put',
		data,
	});
}
// 账户起停用
export function culturalBackUserIsEnable(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/culturalBackUsers/isEnable',
		method: 'post',
		data,
	});
}
// 手机号查询
export function culturalBackUserQueryMobile(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/culturalBackUsers/queryMobile',
		method: 'get',
		params,
	});
}
// 查询用户角色
export function culturalBackUserQueryRole(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/culturalBackUsers/getRolesInfo',
		method: 'get',
		params,
	});
}
// 账户详情

export function culturalBackUserDetail(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/culturalBackUsers/getDetail',
		method: 'get',
		params,
	});
}
// 删除

export function culturalBackUserDel(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/culturalBackUsers/delById',
		method: 'delete',
		params,
	});
}
// 校验个人信息是否可以更改
export function culturalPersonalCheck(data?: Object) {
	return request({
		url: '/mall/culturalBackUsers/personal/editCheck',
		method: 'put',
		data,
	});
}

// 查询极速退款状态
export function quickRefundConfig() {
	return request({
		url: '/tracomps-admin/api/admin/platform/refundConfig/getQuickConfig',
		method: 'get',
	});
}

// 极速退款接口
export function quickRefund(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/refundConfig/update',
		method: 'put',
		data,
	});
}
