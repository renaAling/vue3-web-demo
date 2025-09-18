import request from '/@/utils/request';

export function productListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/list',
		method: 'GET',
		params,
	});
}

export function productInfoApi(id: String) {
  return request({
    url: `/tracomps-admin/api/admin/platform/product/info/${id}`,
    method: 'GET',
  });
}

export function saveProductApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/product/save',
    method: 'POST',
    data,
  });
}

export function updateProductApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/product/platUpdate',
    method: 'POST',
    data,
  });
}

export function updateStatusApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/product/updateStatus',
    method: 'PUT',
    data,
  });
}

export function productDeleteApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/product/del',
    method: 'DELETE',
    params
  });
}

export function groupBuyListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/groupBuy/page',
		method: 'GET',
		params,
	});
}

export function groupBuyTableApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/groupBuy/detail',
		method: 'GET',
		params,
	});
}