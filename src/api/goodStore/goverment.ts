import request from '/@/utils/request';
// 公共前缀
const prefix = '/tracomps-admin';

// 获取联名卡机构列表
export function pageList(params?: object) {
	return request({
		url: prefix + '/api/admin/merchant/product/qipiaoList',
		method: 'get',
		params,
	});
}

// 新增机构
export function addGoverment(params?: object) {
	return request({
		url: prefix + '/api/admin/merchant/product/newUpdate',
		method: 'post',
		data: params,
	});
}

// 获取商品详情
export function productInfo(ids?: string) {
	return request({
		url: prefix + '/api/admin/merchant/product/info/' + ids,
		method: 'get',
	});
}

// 商品修改
export function updateGoverment(params?: object) {
	return request({
		url: prefix + '/api/admin/merchant/product/newUpdate',
		method: 'post',
		data: params,
	});
}

// 删除指定机构
export function batchRecycle(params?: object) {
	return request({
		url: prefix + '/api/admin/merchant/product/batch/delete',
		method: 'post',
		data: params,
	});
}
