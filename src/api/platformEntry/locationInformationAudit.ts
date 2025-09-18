import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';
// 分页查询场所审核列表
export function getAuditPage(params?: object) {
	return request({
		url: prefix + '/platformPlace/getAuditPage',
		method: 'get',
		params,
	});
}

// 审核场所信息表
export function getPlatformPlaceAudit(params?: object) {
	return request({
		url: prefix + '/platformPlace/audit',
		method: 'put',
		data: params,
	});
}
