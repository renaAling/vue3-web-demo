import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';
// 场所用-地铁站点模糊搜索-附近站点
export function getSubwayLike() {
	return request({
		url: prefix + '/platformPlaceSubway/getSubwayLike',
		method: 'get',
	});
}
// 下拉查询-新增场所用-站点主题标签
export function getList() {
	return request({
		url: prefix + '/platformLabel/getList',
		method: 'get',
	});
}
// 下拉查询-下拉查询-编辑场所用
export function getUpdateList() {
	return request({
		url: prefix + '/platformLabel/getUpdateList',
		method: 'get',
	});
}
// 新增场所用-下拉列表-已对接数字化系统
export function getPlatformDigitalSystemList() {
	return request({
		url: prefix + '/platformDigitalSystem/list',
		method: 'get',
	});
}
// 新增场所信息表
export function postPlatformPlaceAdd(params?: object) {
	return request({
		url: prefix + '/platformPlace/add',
		method: 'post',
		data: params,
	});
}
// 编辑
export function postPlatformPlaceUpdate(params?: object) {
	return request({
		url: prefix + '/platformPlace/update',
		method: 'put',
		data: params,
	});
}
// 通过id逻辑删除场所信息表
export function getPlatformPlaceDel(id: number) {
	return request({
		url: prefix + `/platformPlace/del?id=${id}`,
		method: 'delete',
	});
}
// 分页查询已通过场所列表-分页查询未审核、已驳回、已撤回场所列表
export function getPassPage(params?: any) {
	const url = params.active == 1 ? '/platformPlace/getPassPage' : '/platformPlace/getNotPassPage';
	return request({
		url: prefix + url,
		method: 'get',
		params,
	});
}

// 通过id查询
export function getplatformPlaceDetail(id: number) {
	return request({
		url: prefix + `/platformPlace/get?id=${id}`,
		method: 'get',
	});
}
