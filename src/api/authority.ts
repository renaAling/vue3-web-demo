import request from '/@/utils/request';
// 获取组织信息列表
export const deptList = () => {
	return request({
		url: '/uac/deptHierarchy/getTree',
		method: 'get',
	});
};
// 获取部门信息
export const channelList = () => {
	return request({
		url: '/uac/userChannelConfig/getBackendSubSystemList',
		method: 'get',
	});
};
// 获取子系统
export const systemList = () => {
	return request({
		url: 'uac/ups/subSystemConfig/getList',
		method: 'get',
	});
};
// 获取用户已有的系统权限列表
export const userChannelList = (params?: Object) => {
	return request({
		url: '/uac/userChannel/getSubSystemListByUnionId',
		method: 'get',
		params,
	});
};
// 获取用户详情列表
export const pageList = (params?: Object) => {
	return request({
		url: '/uac/userCenter/userPermissionPage',
		method: 'get',
		params,
	});
};
// 新建后台权限
export const createAuthorty = (obj: Object) => {
	return request({
		url: '/uac/userCenter/addPermission',
		method: 'post',
		data: obj,
	});
};
// 删除权限
export const delAuthorty = (id: String) => {
	return request({
		url: `/uac/userCenter/permissionDel/${id}`,
		method: 'delete',
	});
};

// 获取权限详情
export const getAuthortyDetail = (id: String) => {
	return request({
		url: `/uac/userCenter/permissionDetail/${id}`,
		method: 'get',
	});
};
// 更新权限后台
export const putAuthorty = (obj: Object) => {
	return request({
		url: '/uac/userCenter/updatePermission',
		method: 'put',
		data: obj,
	});
};
