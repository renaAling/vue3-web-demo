import request from '/@/utils/request';

// 商户列表
export function getBusinessPage(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/business/page',
		method: 'get',
		params,
	});
}
// 自由商城后台-分页查询商户支付方式表
export function getGetBusinessPayListApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/businessPay/getList',
		method: 'get',
		params,
	});
}
// 自有商城后台-设置商户默认支付方式
// export function postSetDefaultApi(params?: Object) {
// 	return request({
// 		url: '/tracomps-admin/api/admin/businessPayMiddle/setDefault',
// 		method: 'post',
// 		params,
// 	});
// }
// 商户 -通过code查询
export function getBusinessGet(code: string) {
	return request({
		url: `/tracomps-admin/api/admin/business/get?code=${code}`,
		method: 'get',
	});
}
// 修改商户表
export function getBusinessUpdate(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/business/update',
		method: 'put',
		data: params,
	});
}
// 设置商户默认支付方式
export function postSetDefaultApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/businessPayMiddle/setDefault',
		method: 'post',
		data: params,
	});
}
// 查询汇总商家信息
export function getPayConfig(payType?: number) {
	return request({
		url: `/pay/payConfig/getList?payType=${payType}`,
		method: 'get',
	});
}

// 支付渠道列表
export function getBusinessPay() {
	return request({
		url: '/tracomps-admin/api/admin/businessPay/getList',
		method: 'get',
	});
}

// 分页查询商户变更日志表
export function getBusinessChangeLog(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/businessChangeLog/page',
		method: 'get',
		params,
	});
}

// 批量冻结、解冻商户
export function batchUpdateReviewStatus(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/business/batchUpdateReviewStatus',
		method: 'put',
		data: params,
	});
}
