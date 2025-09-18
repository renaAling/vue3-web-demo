import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';

// 分页查询结算管理信息表
export function getPlatformSettlementPage(params?: object) {
	return request({
		url: prefix + '/platformSettlement/page',
		method: 'get',
		params,
	});
}
// 通过id逻辑删除结算管理信息表
export function getPlatformSettlementDel(id?: number) {
	return request({
		url: prefix + `/platformSettlement/del?id=${id}`,
		method: 'delete',
	});
}

// 通过id查询
export function getPlatformSettlementGet(id?: number) {
	return request({
		url: prefix + `/platformSettlement/get?id=${id}`,
		method: 'get',
	});
}

// 通过id查询-商家信息下拉
export function getPlatformMerchantList() {
	return request({
		url: prefix + `/platformMerchant/getList`,
		method: 'get',
	});
}

// 新增结算管理信息表
export function getPlatformSettlementAdd(params?: object) {
	return request({
		url: prefix + '/platformSettlement/add',
		method: 'post',
		data: params,
	});
}

// 修改结算管理信息表
export function getPlatformSettlementUpdate(params?: object) {
	return request({
		url: prefix + '/platformSettlement/update',
		method: 'put',
		data: params,
	});
}
