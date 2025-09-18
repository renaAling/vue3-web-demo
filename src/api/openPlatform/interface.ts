import request from '/@/utils/request';
// 公共前缀
const prefix = '/open';

// 接口管理 -> 接口列表 -> 分页列表查询
export function getInterfaceList(params: object) {
	return request({
		url: prefix + '/appInterface/page',
		method: 'get',
		params,
	});
}

// 文档中心
export function getDocInterfaceList(params: object) {
	return request({
		url: prefix + '/appInterface/selectDoc',
		method: 'get',
		params,
	});
}

// 接口管理 -> 接口列表 -> 删除指定接口
export function deleteInterface(id: string) {
	return request({
		url: prefix + `/appInterface/del?id=${id}`,
		method: 'post',
	});
}

// 接口管理 -> 接口列表 -> 新增接口
export function addInterface(data: object) {
	return request({
		url: prefix + `/appInterface/add`,
		method: 'post',
		data,
	});
}

// 接口管理 -> 接口列表 -> 更新接口
export function updateInterface(data: object) {
	return request({
		url: prefix + `/appInterface/update`,
		method: 'post',
		data,
	});
}

// 接口管理 -> 接口列表 -> 详情接口
export function getInterfaceDetail(id: string) {
	return request({
		url: prefix + `/appInterface/detail?id=${id}`,
		method: 'get',
	});
}

// 接口管理 -> 接口列表 -> 新增请求/响应参数接口
export function addParams(data: object) {
	return request({
		url: prefix + `/appInterfaceParam/add`,
		method: 'post',
		data,
	});
}

// 接口管理 -> 接口列表 -> 更新请求/响应参数接口
export function updateParams(data: object) {
	return request({
		url: prefix + `/appInterfaceParam/update`,
		method: 'post',
		data,
	});
}

// 接口管理 -> 接口列表 -> 通过id获取对应的请求/响应参数详情
export function getParamsDetail(id: string) {
	return request({
		url: prefix + `/appInterfaceParam/get?id=${id}`,
		method: 'get',
	});
}

// 接口管理 -> 接口列表 -> 通过id获取对应的请求/响应参数详情
export function deleteParams(id: string) {
	return request({
		url: prefix + `/appInterfaceParam/del?id=${id}`,
		method: 'post',
	});
}

// 接口管理 -> 接口列表 -> 通过id查询对应的markdown文档字符串内容
export function getMarkdownString(id: string) {
	return request({
		url: prefix + `/appInterface/retrieveDocById?id=${id}`,
		method: 'get',
	});
}

// 接口管理 -> 接口列表 -> 接口黑名单列表
export function getBlackList(params: object) {
	return request({
		url: prefix + `/appInterfaceAuthorize/blacklist`,
		method: 'get',
		params,
	});
}

// 接口管理 -> 接口列表 -> 接口白名单列表
export function getWhiteList(params: object) {
	return request({
		url: prefix + `/appInterfaceAuthorize/whitelist`,
		method: 'get',
		params,
	});
}
