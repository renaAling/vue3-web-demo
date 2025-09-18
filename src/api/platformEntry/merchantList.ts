import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';

// 分页查询
export function getPlatformMerchantPage(params?: object) {
	return request({
		url: prefix + '/platformMerchant/page',
		method: 'get',
		params,
	});
}

// 新增入驻商家信息表
export function getPlatformMerchantAdd(params?: object) {
	return request({
		url: prefix + '/platformMerchant/add',
		method: 'post',
		data: params,
	});
}

// 修改入驻商家信息表
export function getPlatformMerchantUpdate(params?: object) {
	return request({
		url: prefix + '/platformMerchant/update',
		method: 'put',
		data: params,
	});
}

// 门店品类下拉
export function getPlatformCategoryArr() {
	return request({
		url: prefix + '/platformCategory/getList',
		method: 'get',
	});
}

// 通过id逻辑删除入驻商家信息表
export function getPlatformMerchantDel(id?: number) {
	return request({
		url: prefix + `/platformMerchant/del?id=${id}`,
		method: 'delete',
	});
}

// 修改数字对接系统信息表
export function getPlatformMerchantGet(id?: number) {
	return request({
		url: prefix + `/platformMerchant/get?id=${id}`,
		method: 'get',
	});
}

// // 新增数字对接系统信息表
// export function getPlatformDigitalSystemAdd(params?: object) {
// 	return request({
// 		url: prefix + '/platformDigitalSystem/add',
// 		method: 'post',
// 		data: params,
// 	});
// }
