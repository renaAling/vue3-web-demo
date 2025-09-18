// TODO: 文创商品相关接口
import request from '/@/utils/request';

// 获取供应商列表
export function getSupplierList() {
	return request({
		url: '/mall/supplier/getList',
		method: 'get',
	});
}
// 获取三方票卡列表
export function getCulturalCardList() {
	return request({
		url: '/mall/culturalCard/list',
		method: 'get',
	});
}

// 商品保存或者更新
export function productSaveOrUpdate(data?: Object) {
	return request({
		url: '/mall/product/saveOrUpdate',
		method: 'post',
		data,
	});
}

// 商品分页查询
export function getProductsList(params?: Object) {
	return request({
		url: '/mall/product/page',
		method: 'get',
		params,
	});
}

// 上下架商品接口
export function updateProductsStatus(data?: Object) {
	return request({
		url: '/mall/product/updateStatus',
		method: 'put',
		data,
	});
}

// 删除商品接口
export function deleteProduct(id?: string) {
	return request({
		url: `/mall/product/del?id=${id}`,
		method: 'delete',
	});
}

// 预览接口
export function previewProductDetail(id?: string) {
	return request({
		url: `/mall/product/preview?id=${id}`,
		method: 'get',
	});
}

// 详情接口
export function getDetail(id?: string) {
	return request({
		url: `/mall/product/getAdminDetailById?id=${id}`,
		method: 'get',
	});
}
//专题
export function specialConfig(data?: Object) {
	return request({
		url: 'mall/special_config/saveOrUpdate',
		method: 'post',
		data,
	});
}
// 专题预览
export function specialConfigPreview() {
	return request({
		url: `/mall/special_config/preview`,
		method: 'get',
	});
}
// 站内商品

export function productList(params: object) {
	return request({
		url: `/mall/product/getList`,
		method: 'get',
		params,
	});
}
