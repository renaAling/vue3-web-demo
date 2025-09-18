import request from '/@/utils/request';
// 公共前缀
const prefix = '/open';

// 管理端：应用管理 -> 应用管理列表 -> 列表接口
export function getApplicationList(params: object) {
	return request({
		url: prefix + '/appInfo/listPage',
		method: 'get',
		params,
	});
}

// 开发者端：应用管理 -> 应用管理列表 -> 列表接口
export function getDeveloperApplicationList(params: object) {
	return request({
		url: prefix + '/appInfo/developer/listPage',
		method: 'get',
		params,
	});
}

// 应用管理 -> 应用管理列表 -> 新建应用
export function addApplication(data: object) {
	return request({
		url: prefix + '/appInfo/add',
		method: 'post',
		data,
	});
}

// 应用管理 -> 应用管理列表 -> 更新应用
export function updateApplication(data: object) {
	return request({
		url: prefix + '/appInfo/update',
		method: 'post',
		data,
	});
}

// 应用管理 -> 列表 -> 删除指定应用
export function deleteApplication(id: string) {
	return request({
		url: prefix + `/appInfo/del?id=${id}`,
		method: 'post',
	});
}

// 应用管理 -> 列表 -> 查询详情
export function getApplicationDetail(id: string) {
	return request({
		url: prefix + `/appInfo/detail?id=${id}`,
		method: 'get',
	});
}

// 应用管理 -> 详情 -> 根据id重置密钥对
export function resetkeyPair(id: string) {
	return request({
		url: prefix + `/appInfo/resetKeyPair?id=${id}`,
		method: 'post',
	});
}

// 应用管理 -> 详情 -> 接口授权 -> 更新接口授权状态
export function updateInterfaceStatus(data: object) {
	return request({
		url: prefix + `/appInterfaceAuthorize/changeStatus`,
		method: 'post',
		data,
	});
}

// 应用管理 -> 详情 -> 接口授权 -> 查询列表
export function getInterfaceAuthList(params: string) {
	return request({
		url: prefix + `/appInterfaceAuthorize/getAvailableInterface`,
		method: 'get',
		params,
	});
}

// 应用管理 -> 详情 -> 接口授权 -> 添加授权
export function addInterfaceAuth(data: object) {
	return request({
		url: prefix + `/appInterfaceAuthorize/add`,
		method: 'post',
		data,
	});
}
