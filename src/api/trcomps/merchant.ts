import request from '/@/utils/request';
// 公共前缀
const prefix = '/tracomps-admin/api/admin';

/**
 * 商户 列表
 */
export function merchantListApi(params?: Object) {
	return request({
		url: `${prefix}/platform/merchant/list`,
		method: 'get',
		params,
	});
}
/**
 * 商户 关闭
 */
export function merchantCloseApi(id?: string) {
	return request({
		url: `${prefix}/platform/merchant/close/${id}`,
		method: 'post',
	});
}

/**
 * 商户 开启
 */
export function merchantOpenApi(id?: string) {
	return request({
		url: `${prefix}/platform/merchant/open/${id}`,
		method: 'post',
	});
}

/**
 * 商户分类 全部列表
 */
export function merchantCategoryAllListApi() {
	return request({
		url: `${prefix}/platform/merchant/category/all/list`,
		method: 'get',
	});
}

/**
 * 店铺类型 全部列表
 */
export function merchantTypeAllListApi() {
	return request({
		url: `${prefix}/platform/merchant/type/all/list`,
		method: 'get',
	});
}

/**
 * 渠道 列表
 */
export function channelListApi(params?: Object) {
	return request({
		url: `${prefix}/merchant/channel/list`,
		method: 'get',
		params,
	});
}

/**
 * 商户 详情
 */
export function merchantDetailApi(id?: string) {
	return request({
		url: `${prefix}/platform/merchant/detail/${id}`,
		method: 'get',
	});
}

/**
 * 商户 添加
 */
export function merchantAddApi(data?: Object) {
	return request({
		url: `${prefix}/platform/merchant/saveMerchant`,
		method: 'post',
		data,
	});
}

/**
 * 商户 编辑
 */
export function merchantUpdateApi(data?: Object) {
	return request({
		url: `${prefix}/platform/merchant/updateMerchant`,
		method: 'post',
		data,
	});
}

/**
 * 渠道商家 列表
 */
export function channelMerchantListApi(params?: Object) {
	return request({
		url: `${prefix}/merchant/channel/merchant/getByChannelId`,
		method: 'get',
		params,
	});
}

// 查询供应商渠道
export function getChannel(params?: Object) {
	return request({
		url: `${prefix}/merchant/channel/getChannel`,
		method: 'get',
		params,
	});
}
// 商品调价
export function priceAdjustment(data?: object) {
	return request({
		url: prefix + '/platform/merchant/priceAdjustment',
		method: 'post',
		data,
	});
}
/**---------------------------------------------------------------------------------------------- */
