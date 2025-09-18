import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取商品列表
export function pageList(params?: object) {
	return request({
		url: prefix + '/wdProduct/page',
		method: 'get',
		params,
	});
}

// 批量删除
export function delBatch(params?: object) {
	return request({
		url: prefix + '/wdProduct/delBatch',
		method: 'post',
		data: params,
	});
}

// 批量上下架
export function updateStatusBatch(params?: object) {
	return request({
		url: prefix + '/wdProduct/updateStatusBatch',
		method: 'post',
		data: params,
	});
}

// 排序
export function wdProductSort(params?: object) {
	return request({
		url: prefix + '/wdProduct/sort',
		method: 'post',
		data: params,
	});
}

// 新增商品
export function wdProductAdd(params?: object) {
	return request({
		url: prefix + '/wdProduct/add',
		method: 'post',
		data: params,
	});
}

// 修改商品
export function wdProductUpdate(params?: object) {
	return request({
		url: prefix + '/wdProduct/update',
		method: 'put',
		data: params,
	});
}

// 详情
export function wdProductGet(params?: object) {
	return request({
		url: prefix + '/wdProduct/get',
		method: 'get',
		params,
	});
}

// 查询商家列表
export function merchantgetList(params?: object) {
	return request({
		url: prefix + '/merchant/getList',
		method: 'get',
		params,
	});
}

// 查询商品分组列表
export function commoditygetList(merchantCode?: string) {
	return request({
		url: prefix + `/wdGroup/getGroupListByMerchantCode?merchantCode=${merchantCode}`,
		method: 'get',
	});
}
// 新增商品分组
export function wdGroupAdd(params?: object) {
	return request({
		url: prefix + '/wdGroup/add',
		method: 'post',
		data: params,
	});
}
// 标签列表
export function tagManageSelect(params?: object) {
	return request({
		url: prefix + '/tag_manage/select',
		method: 'get',
		params,
	});
}
