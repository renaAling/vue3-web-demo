import request from '/@/utils/request';
// 公共前缀
const prefix = '/activity';

// 分页查询活动分组表
export function getActivityInfoGroupPage(params?: object) {
	return request({
		url: prefix + '/activityInfoGroup/page',
		method: 'get',
		params,
	});
}
// 修改活动分组表(含单独修改状态)
export function getActivityInfoGroupUpdate(params?: object) {
	return request({
		url: prefix + '/activityInfoGroup/update',
		method: 'put',
		data: params,
	});
}

// 新增活动分组表
export function getActivityInfoGroupAdd(params?: object) {
	return request({
		url: prefix + '/activityInfoGroup/add',
		method: 'post',
		data: params,
	});
}
// 删除分组的判断
export function getActivityInfoGroupDelJudge(id?: number) {
	return request({
		url: prefix + `/activityInfoGroup/delJudge?id=${id}`,
		method: 'get',
	});
}
// 通过id逻辑删除活动分组表
export function getActivityInfoGroupDel(id?: number) {
	return request({
		url: prefix + `/activityInfoGroup/del?id=${id}`,
		method: 'delete',
	});
}

// 分页查询活动分组表
export function getActivityInfoPage(params?: object) {
	return request({
		url: prefix + '/activityInfo/page',
		method: 'get',
		params,
	});
}

// 后台—分组列表查询(含已删除，未发布)
export function getGroupList() {
	return request({
		url: prefix + '/activityInfoGroup/getGroupList',
		method: 'get',
	});
}
// 后台—新建信息内容分组列表查询(不含已删除，未发布)
export function getGroupListForAddInfo() {
	return request({
		url: prefix + '/activityInfoGroup/getGroupListForAddInfo',
		method: 'get',
	});
}
// 通过id逻辑删除活动信息表
export function getActivityInfoDel(id?: number) {
	return request({
		url: prefix + `/activityInfo/del?id=${id}`,
		method: 'delete',
	});
}
// 新增活动信息表
export function getActivityInfoAdd(params?: object) {
	return request({
		url: prefix + '/activityInfo/add',
		method: 'post',
		data: params,
	});
}
// 修改活动信息表(含修改发布状态)
export function getActivityInfoUpdate(params?: object) {
	return request({
		url: prefix + '/activityInfo/update',
		method: 'put',
		data: params,
	});
}
