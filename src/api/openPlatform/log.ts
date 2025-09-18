import request from '/@/utils/request';
// 公共前缀
const prefix = '/open';

/**
 * 管理端接口
 */
// 调用日志 -> 列表接口
export function getContactsInfoList(params?: object) {
	return request({
		url: prefix + '/interfaceLog/page',
		method: 'get',
		params,
	});
}

/**
 * 开发者端接口
 */
// 调用日志 -> 列表接口
export function getDeveloperContactsInfoList(params?: object) {
	return request({
		url: prefix + '/interfaceLog/listPage',
		method: 'get',
		params,
	});
}
