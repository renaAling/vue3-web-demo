import request from '/@/utils/request';
// 获取业务数据
export function getBusinessStatistics(params?: object) {
	return request({
		url: '/business/goodShopStatistics/businessInfoStatistics',
		method: 'get',
		params,
	});
}
// 财务报表

// 渠道报表
export function merchantFinanceReport(params?: object) {
	return request({
		url: '/mall/merchantFinanceReport/page',
		method: 'get',
		params,
	});
}
export function merchantReportPage(params?: object) {
	return request({
		url: '/tracomps-admin/merchantReport/page',
		method: 'get',
		params,
	});
}
