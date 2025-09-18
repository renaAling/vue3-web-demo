import request from '/@/utils/request';
const prefix = '/mall';

export function supplierPageApi(params?: Object) {
	return request({
		url: prefix + '/supplier_manage/page',
		method: 'get',
		params,
	});
}

// 新增供应商
export function addSupplierApi(data?: Object) {
	return request({
		url: prefix + '/supplier_manage/add',
		method: 'post',
		data,
	});
}

// 编辑供应商
export function updateSupplierApi(data?: Object) {
	return request({
		url: prefix + '/supplier_manage/update',
		method: 'put',
		data,
	});
}

// 删除供应商
export function delSupplierApi(params?: Object) {
	return request({
		url: prefix + '/supplier_manage/del',
		method: 'delete',
		params,
	});
}
