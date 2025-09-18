import request from '/@/utils/request';

/**
 * @description: 销售日月报管理模块
 */
// 列表
export function getOrderList(params?: Object) {
	return request({
		url: '/mall/culturalReport/page',
		method: 'get',
		params,
	});
}

// 对账单列表
export function culturalList(params?: Object) {
	return request({
		url: '/business/cultural_finance_report/page',
		method: 'get',
		params,
	});
}

// 对账单导出
export function culturalExcelExport(params?: Object) {
	return request({
		url: '/business/cultural_finance_report/excelExport',
		method: 'get',
		params,
	});
}
