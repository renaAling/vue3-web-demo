import request from '/@/utils/request';
import { handleBlobFile } from '/@/utils/other';
const isMerchant = import.meta.env.VITE_IS_MERCHANT;
console.log('isMerchant', isMerchant);
/**
 * 文创订单导出
 * @param prams
 */
export function orderOutBound(data: Object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/order/outBound' : '/tracomps-admin/api/admin/platform/order/outBound';
	return request({
		url,
		method: 'post',
		data,
	});
}

/**
 * 订单 售后列表
 * @param params
 */
export function refundOrderList(params: Object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/refund/order/list' : '/tracomps-admin/api/admin/platform/refund/order/list';
	return request({
		url,
		method: 'get',
		params,
	});
}

/**
 * 订单 备注
 * @param prams
 */
export function orderMarkApi(data: Object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/order/mark' : '/tracomps-admin/api/admin/platform/order/mark';
	return request({
		url,
		method: 'post',
		data,
	});
}

/**
 * 发起售后
 */
export function applyAfterSaleApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/order/applyAfterSale`,
		method: 'post',
		data,
	});
}

/**
 * 售后原因
 */
export function reasonApi() {
	// 客户端平台端都用一个接口获取
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/refund/order/reason' : '/tracomps-admin/api/admin/merchant/refund/order/reason';
	return request({
		url,
		method: 'get',
	});
}

/**
 * 文创发货
 * @param prams
 */
export function orderSendApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/order/send',
		method: 'post',
		data,
	});
}

/**
 * 下载批量发货失败信息
 */
export function exportFailRecords(data: Object, fileName: string) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/order/export`,
		method: 'post',
		data,
		responseType: 'blob',
	}).then((response) => {
		handleBlobFile(response, fileName);
	});
}

/**
 * 商户 列表
 */
export function merchantListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/list',
		method: 'get',
		params,
	});
}

/**
 * 售后导出
 * @param params
 */
export function cultureRefundExport(params: Object) {
	const url = isMerchant
		? '/tracomps-admin/api/admin/merchant/export/cultureRefundExport'
		: '/tracomps-admin/api/admin/platform/export/cultureRefundExport';
	return request({
		url,
		method: 'get',
		params,
		responseType: 'blob',
	});
}

/**
 * 管理后台-获取可退金额
 * @param params
 */
export function getRefundPrice(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/order/getRefundPrice/${id}`,
		method: 'get',
	});
}
// 商户端核销点
export function merchantPickupSiteList(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/pickup_site/page',
		method: 'get',
		params,
	});
}
// 订单核销
export function merchantOrderVerification(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/order/verification',
		method: 'post',
		data,
	});
}

// 修改订单发货信息
export function updateExpressApi(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/order/update/express',
		method: 'post',
		data,
	});
}

// 修改订单发货信息
export function orderCancelApi(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/order/cancel',
		method: 'post',
		data,
	});
}


