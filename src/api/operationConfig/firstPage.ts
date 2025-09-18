import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';
// 首页配置列表
export function getByLocationType(params?: object) {
	return request({
		url: prefix + '/operationBanner/getByLocationType',
		method: 'get',
		params,
	});
}
// 新增
export function configAdd(data?: object) {
	return request({
		url: prefix + '/operationBanner/add',
		method: 'post',
		data,
	});
}
// 修改
export function configUpdate(data?: object) {
	return request({
		url: prefix + '/operationBanner/update',
		method: 'put',
		data,
	});
}

// 魔方区查询
export function configGetStyle(params?: object) {
	return request({
		url: prefix + '/operationStyle/getStyle',
		method: 'get',
		params,
	});
}
// 魔方区修改
export function configStyleUpdate(data?: object) {
	return request({
		url: prefix + '/operationStyle/update',
		method: 'post',
		data,
	});
}

// 详情
export function configDetail(params?: object) {
	return request({
		url: prefix + '/operationBanner/getById',
		method: 'get',
		params,
	});
}
// 删除
export function configDelete(id?: string) {
	return request({
		url: prefix + '/operationBanner/del?id=' + id,
		method: 'delete',
	});
}
// 停启用
export function configUpdateStatus(data?: object) {
	return request({
		url: prefix + '/operationBanner/updateStatus',
		method: 'put',
		data,
	});
}
// 排序
export function configUpdateSequence(data?: object) {
	return request({
		url: prefix + '/operationBanner/updateSequence',
		method: 'put',
		data,
	});
}
// 通过id查询广告配置列表
export function getAdManageList(id?: number) {
	return request({
		url: prefix + `/operationBanner/getById?id=${id}`,
		method: 'get',
	});
}

// 获取裂变抽奖活动列表接口
export function getLotteryList(id?: number) {
	return request({
		url: prefix + `/activityUser/activityList`,
		method: 'get',
	});
}

// 获取中奖名单
export function getWinningList(id?: number) {
	return request({
		url: prefix + `/activityUser/getWinners`,
		method: 'get',
	});
}

/**
 * @description: 获取门店信息
 * @param {
 * 		storeName 门店名称
 * }
 */
export function getStoreNameInfo(params?: object) {
	return request({
		url: prefix + '/store/getStoreNameInfo',
		method: 'get',
		params,
	});
}

/**
 * @description: 站内商品信息查询
 * @param {
 * 		spuName 商品名称
 * }
 */
export function getProductList(params?: object) {
	return request({
		url: prefix + '/product/getGoodsList',
		method: 'get',
		params,
	});
}
