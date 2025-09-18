import request from '/@/utils/request';
// 公共前缀
const prefix = '/open';

// SDK管理 -> SDK列表 -> 分页列表查询
export function getSdkList(params: object) {
	return request({
		url: prefix + '/sdkInfo/page',
		method: 'get',
		params,
	});
}

// 文档中心
export function getDocSdkList(params: object) {
	return request({
		url: prefix + '/sdkInfo/selectDoc',
		method: 'get',
		params,
	});
}

// SDK管理 -> SDK列表 -> 切换启用/停用接口
export function updateSdkStatus(data: object) {
	return request({
		url: prefix + `/sdkInfo/updateStatus`,
		method: 'post',
		data,
	});
}

// SDK管理 -> SDK列表 -> 详情
export function getSdkDetailInfo(id: string) {
	return request({
		url: prefix + `/sdkInfo/get?id=${id}`,
		method: 'get',
	});
}

// SDK管理 -> 编辑 -> 更新SDK信息
export function updateSdk(data: object) {
	return request({
		url: prefix + `/sdkInfo/update`,
		method: 'post',
		data,
	});
}

// SDK管理 -> md文档 -> 更新md文档
export function updateSdkDoc(data: object) {
	return request({
		url: prefix + `/sdkInfo/updateDoc`,
		method: 'post',
		data,
	});
}
