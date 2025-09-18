import request from '/@/utils/request';
import { handleBlobFile } from '/@/utils/other';
/**
 * @description: 订单管理模块
 */
// 列表
export function getOrderList(params?: Object) {
	return request({
		url: '/mall/order/getBackendPage',
		method: 'get',
		params,
	});
}

// 批量发货-导出失败记录
export function exportFailRecords(url: any, data: any, fileName: string) {
	return request({
		url: '/mall/order/export',
		method: 'post',
		data,
		responseType: 'blob',
	}).then((response) => {
		handleBlobFile(response, fileName);
	});
}

// 批量出库
export function batchOutBound(data?: Object) {
	return request({
		url: `/mall/order/outBound`,
		method: 'post',
		data,
	});
}

// 详情
export function getOrderDetail(params?: object) {
	return request({
		url: '/mall/order/getBackendDetail',
		method: 'get',
		params,
	});
}

// 订单详情专用查询省市区区域列表接口
export function getProvinceCityDistrictTree() {
	return request({
		url: '/mall/district/getTreeList',
		method: 'get',
	});
}

// 修改收货地址
export function updateAddress(data?: object) {
	return request({
		url: '/mall/orderDetail/updateDeliveryAddress',
		method: 'put',
		data,
	});
}

// 物流发货
export function orderSendAdd(data?: object) {
	return request({
		url: '/mall/orderLogistics/add',
		method: 'post',
		data,
	});
}

// 修改订单详情的物流单号接口
export function orderCodeUpdate(data?: object) {
	return request({
		url: '/mall/orderLogistics/update',
		method: 'put',
		data,
	});
}

/**
 * @description: 售后工单模块
 */
//列表
export function refundList(params?: Object) {
	return request({
		url: '/mall/afterSale/getAfterSalePage',
		method: 'get',
		params,
	});
}
// 详情
export function refundDetail(params?: object) {
	return request({
		url: '/mall/afterSale/getWorkOrderDetails',
		method: 'get',
		params,
	});
}
// 重新发起
export function refundRestart(data?: object) {
	return request({
		url: '/mall/afterSale/restart',
		method: 'post',
		data,
	});
}
// 审核工单
export function refundApprove(data?: object) {
	return request({
		url: '/mall/afterSale/auditWorkOrder',
		method: 'post',
		data,
	});
}
// 售后原因列表
export function queryReasonList(params?: object) {
	return request({
		url: '/mall/afterSale/queryReasonList',
		method: 'get',
		params,
	});
}
// 发起售后
export function backendApply(data?: object) {
	return request({
		url: '/mall/afterSale/backendApply',
		method: 'post',
		data,
	});
}
