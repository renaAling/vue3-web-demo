import request from '/@/utils/request';
// 公共前缀
const prefix = '/activity';
// 分页查询活动方案信息表
export function getAuditPage(params?: object) {
	return request({
		url: prefix + '/activitySchemePlan/getAuditPage',
		method: 'get',
		params,
	});
}

// 审核活动方案详情(已审核带审核信息)
export function getUpdateDetail(params?: object) {
	return request({
		url: prefix + '/activitySchemePlan/update',
		method: 'put',
		data: params,
	});
}
// 审核活动方案信息表
export function getActivitySchemePlanAudit(params?: object) {
	return request({
		url: prefix + '/activitySchemePlan/audit',
		method: 'post',
		data: params,
	});
}
// 分页查询活动方案信息表
export function getAuditDetail(id?: number) {
	return request({
		url: prefix + `/activitySchemePlan/getAuditDetail?id=${id}`,
		method: 'get',
	});
}

// 分页查询活动方案审核信息
export function getAuditPageNum() {
	return request({
		url: prefix + '/activitySchemePlan/getAuditPageNum',
		method: 'get',
	});
}
