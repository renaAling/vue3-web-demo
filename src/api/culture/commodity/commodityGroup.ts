import request from '/@/utils/request';
import { handleBlobFile } from '/@/utils/other';
const isMerchant = import.meta.env.VITE_IS_MERCHANT;
console.log('isMerchant==============', isMerchant)

// 分组列表
export function groupPageApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/group/page',
		method: 'get',
		params,
	});
}
//  商品列表

export function productLstApi(params: object) {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/list' 
	: '/tracomps-admin/api/admin/platform/product/list';
	return request({
		url,
		method: 'GET',
		params,
	});
}
// 新增分组
export function groupAddApi(params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/group/add',
		method: 'post',
		data: params,
	});
}
// 编辑分组
export function updateApi(params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/group/update',
		method: 'put',
		data: params,
	});
}
//
// 通过id查询
export function getByIdApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/group/getById?id=${id}`,
		method: 'get',
	});
}
// 删除分组
export function groupDel(id: Number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/group/del?id=${id}`,
		method: 'delete',
	});
}
// 后台管理-获取分组商品列表
export function getProductInfoPageApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/group/middle/getProductInfoList',
		method: 'get',
		params,
	});
}

// 后台管理-批量添加分组商品
export function batchAddApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/group/middle/batchAdd',
		method: 'post',
		data: params,
	});
}

// 后台管理-批量移除分组商品
export function batchDelApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/group/middle/batchDel',
		method: 'post',
		data: params,
	});
}
