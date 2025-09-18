import request from '/@/utils/request';
// 公共前缀
const prefix = '/tracomps-admin';

// 获取商品列表
export function pageList(params?: object) {
	return request({
		url: prefix + '/api/admin/platform/refund/order/list',
		method: 'get',
		params,
	});
}

// 获取商品列表
export function orderInfo(id?: string) {
	return request({
		url: prefix + '/api/admin/platform/refund/order/detail/' + id,
		method: 'get',
	});
}

// 导出excel
export function afterSaleExcel(params?: object) {
	return request({
		url: prefix + '/api/admin/platform/export/afterSale/excels',
		method: 'get',
		params,
	});
}
