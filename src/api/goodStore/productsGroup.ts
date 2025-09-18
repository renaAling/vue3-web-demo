import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取分组列表
export function pageList(params?: object) {
	return request({
		url: prefix + '/wdGroup/page',
		method: 'get',
		params,
	});
}

// 排序
export function upDateSort(params?: object) {
	return request({
		url: prefix + '/wdGroup/sort',
		method: 'post',
		data: params,
	});
}

// 新增分组
export function wdGroupAdd(params?: object) {
	return request({
		url: prefix + '/wdGroup/add',
		method: 'post',
		data: params,
	});
}

// 修改分组
export function wdGroupUpdate(params?: object) {
	return request({
		url: prefix + '/wdGroup/update',
		method: 'put',
		data: params,
	});
}

// 查询详情
export function wdGroupGetDetail(params?: object) {
	return request({
		url: prefix + '/wdGroup/getDetail',
		method: 'get',
		params,
	});
}

// 删除
export function wdGroupDel(params?: object) {
	return request({
		url: prefix + '/wdGroup/del',
		method: 'delete',
		params,
	});
}

// 启用/禁用
export function wdGroupUpdateStatus(params?: object) {
	return request({
		url: prefix + '/wdGroup/updateStatus',
		method: 'post',
		data: params,
	});
}

// 查询分组下的商品
export function getSpuByGroupCode(id?: object) {
	return request({
		url: prefix + '/wdProductGroup/getSpuByGroupCode?groupCode=' + id,
		method: 'get',
	});
}

// 查询全部商品
export function getByMerchantCode(id?: object) {
	return request({
		url: prefix + '/wdProduct/getByMerchantCode?merchantCode=' + id,
		method: 'get',
	});
}

// 关联商品
export function wdGroupRelate(params?: object) {
	return request({
		url: prefix + '/wdProductGroup/relate',
		method: 'post',
		data: params,
	});
}
