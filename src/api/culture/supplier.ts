// 供应商相关接口
import request from '/@/utils/request';

// 列表
export function supplierList(params?: Object) {
	return request({
		url: '/mall/supplier/page',
		method: 'get',
		params,
	});
}
// 新增
export function supplierAdd(data?: Object) {
	return request({
		url: '/mall/supplier/add',
		method: 'post',
		data,
	});
}
// 修改
export function supplierUpdate(data: any) {
	return request({
		url: '/mall/supplier/update',
		method: 'put',
		data,
	});
}
// 删除
export function supplierDel(id: any) {
	return request({
		url: `/mall/supplier/delete?id=${id}`,
		method: 'delete',
	});
}
// 详情
export function supplierGet(id: any) {
	return request({
		url: `/mall/supplier/getById?id=${id}`,
		method: 'get',
	});
}
// 停用启用
export function statusUpdate(data: any) {
	return request({
		url: '/mall/supplier/updateStatus',
		method: 'put',
		data,
	});
}

//  查询关联数量
export function getRelatedById(id: any) {
	return request({
		url: `/mall/supplier/getRelatedById?id=${id}`,
		method: 'get',
	});
}
