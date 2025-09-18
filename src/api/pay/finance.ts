import request from '/@/utils/request';

export function pageList(query?: Object) {
	return request({
		url: '/pay/reconciliation/getPage',
		method: 'get',
		params: query,
	});
}

// 下载对账信息及明细
export function reconciliationExport(query?: Object) {
	return request({
		url: '/pay/reconciliation/export',
		method: 'get',
		params: query,
	});
}

// 根据交易日期查询差错明细
export function ErrorDetailsPage(query?: Object) {
	return request({
		url: '/pay/reconciliationErrorDetails/page',
		method: 'get',
		params: query,
	});
}

export function exportErrorDetails(query?: Object) {
	return request({
		url: '/pay/reconciliationErrorDetails/exportErrorDetails',
		method: 'get',
		params: query,
	});
}

// 处理差错明细
export function handleError(query?: Object) {
	return request({
		url: '/pay/reconciliationHandleVoucher/handleError',
		method: 'post',
		data: query,
	});
}

// 差错处理回显
export function findVouchers(query?: Object) {
	return request({
		url: '/pay/reconciliationHandleVoucher/findVouchers',
		method: 'get',
		params: query,
	});
}

// 分页查询对账报表
export function getReconciliationPage(query?: Object) {
	return request({
		url: '/pay/report/getReconciliationPage',
		method: 'get',
		params: query,
	});
}

// 卡券状态分页查询联合优惠管理信息表
export function pageDiscount(query?: Object) {
	return request({
		url: '/pay/payJointDiscounts/page',
		method: 'get',
		params: query,
	});
}

// 卡券状态分页查询联合优惠管理信息表导出
export function pageDiscountExport(query?: Object) {
	return request({
		url: '/pay/payJointDiscounts/export',
		method: 'get',
		params: query,
	});
}
