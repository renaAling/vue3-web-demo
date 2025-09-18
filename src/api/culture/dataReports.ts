import request from '/@/utils/request';

export function userStatisticsApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/statistics/user/statistics',
    method: 'GET',
    params,
  });
}

export function goodsStatisticsApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/statistics/goods/statistics',
    method: 'GET',
    params,
  });
}

export function orderStatisticsApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/statistics/order/statistics',
    method: 'GET',
    params,
  });
}

export function goodsSalesStatisticsApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/statistics/goodsSales/statistics',
    method: 'GET',
    params,
  });
}

// 查询一级品类
export function goodsCategoryApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/statistics/product/goods/category',
    method: 'GET',
    params,
  });
}

// 导出
export function goodsSalesExport(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/statistics/goodsSalesExport',
		method: 'GET',
		params,
	});
}

// 订单
export function orderReportApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/statistics/order/report',
    method: 'GET',
    params,
  });
}

export function orderGoodsReportApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/statistics/order/goods/report',
    method: 'GET',
    params,
  });
}