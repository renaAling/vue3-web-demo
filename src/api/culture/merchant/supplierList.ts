import request from '/@/utils/request';

// 列表
export function getOrderList(params?: Object) {
	return request({
		url: '/mall/order/getBackendPage',
		method: 'get',
		params,
	});
}

// 供应商管理列表
export function merchantListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/list',
		method: 'get',
		params,
	});
}

// 供应商列表表头数
export function merHeaderNumApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/list/header/num`,
		method: 'get',
		params,
	});
}

// 商户分类-下拉
export function merchantCategoryAllListApi() {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/category/all/list',
		method: 'get',
	});
}

// 店铺类型-下拉
export function merchantTypeListApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/type/list',
		method: 'get',
		params,
	});
}

/**
 * 商户 修改商户手机号
 */
export function merchantupdatePhoneApi(params?: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/update/phone`,
		method: 'post',
		data: params,
	});
}
/**
 * 商户 修改复制商品数量
 */
export function merchantCopyNumApi(params?: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/update/copy/product/num`,
		method: 'post',
		data: params,
	});
}
// 商户 推荐开关
export function merchantSwitchApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/recommend/switch/${id}`,
		method: 'post',
	});
}

// 重置商户密码
export function merRsetPasswordApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/reset/password/${id}`,
		method: 'post',
	});
}
// 商户关闭
export function merchantCloseApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/close/${id}`,
		method: 'post',
	});
}
// 商户开启
export function merchantOpenApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/open/${id}`,
		method: 'post',
	});
}

//商户添加
export function merchantAddApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/add',
		method: 'post',
		data: params,
	});
}

// 商户 编辑
export function merchantUpdateApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/update',
		method: 'post',
		data: params,
	});
}

// 商户详情
export function merchantDetailApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/detail/${id}`,
		method: 'get',
	});
}

