import request from '/@/utils/request';
// 公共前缀
const prefix = '/activity';

// 分页查询活动方案信息表
export function getActivitySchemePlanPage(params?: object) {
	return request({
		url: prefix + '/activitySchemePlan/page',
		method: 'get',
		params,
	});
}

// 删除活动方案信息表
export function getActivitySchemePlanDelete(id?: number) {
	return request({
		url: prefix + `/activitySchemePlan/delete?id=${id}`,
		method: 'delete',
	});
}
// 新增活动方案信息表
export function getActivitySchemePlanAdd(params?: object) {
	return request({
		url: prefix + '/activitySchemePlan/add',
		method: 'post',
		data: params,
	});
}

// 编辑修改活动方案信息表
export function getActivitySchemePlanUpdate(params?: object) {
	return request({
		url: prefix + '/activitySchemePlan/update',
		method: 'put',
		data: params,
	});
}

// 通过方案编码查询方案附件信息
export function getBySchemeCode(schemeCode?: string) {
	return request({
		url: prefix + `/activitySchemeAttachment/getBySchemeCode?schemeCode=${schemeCode}`,
		method: 'get',
	});
}
