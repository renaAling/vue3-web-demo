import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';
// 分页查询
export function getPlatformLabelPage(params?: object) {
	return request({
		url: prefix + '/platformLabel/page',
		method: 'get',
		params,
	});
}

// 新增站点主题标签信息表
export function getPlatformLabelAdd(params?: object) {
	return request({
		url: prefix + '/platformLabel/add',
		method: 'post',
		data: params,
	});
}

// 新增站点主题标签信息表
export function getPlatformLabelDetail(id: number) {
	return request({
		url: prefix + `/platformLabel/get?id=${id}`,
		method: 'get',
	});
}
// 修改站点主题标签信息表
export function getPlatformLabelUpdate(params?: object) {
	return request({
		url: prefix + '/platformLabel/update',
		method: 'put',
		data: params,
	});
}

// 新增站点主题标签信息表
export function getPlatformLabelDel(id: number) {
	return request({
		url: prefix + `/platformLabel/del?id=${id}`,
		method: 'delete',
	});
}
