import request from '/@/utils/request';

// 会员系统后台-后台用户管理分页
export const getBackendUsersForMember = (params?: Object) => {
	return request({
		url: '/uac/userCenter/getBackendUsersForMember',
		method: 'get',
		params,
	});
};

// 会员系统后台-新建后台用户-创建后会赋予全系统角色:调用门户一键赋予权限
export const addBackendUser = (params?: Object) => {
	return request({
		url: '/uac/userCenter/addBackendUser',
		method: 'post',
		data: params,
	});
};
// 会员系统后台-新建后台用户-创建后会赋予全系统角色:调用门户一键赋予权限
export const updateBackendUser = (params?: Object) => {
	return request({
		url: '/uac/userCenter/updateBackendUser',
		method: 'post',
		data: params,
	});
};
// 根据用户信息查询
export const getUserInfoByUidMobile = (params?: Object) => {
	return request({
		url: '/uac/userCenter/getUserInfoByUidMobile',
		method: 'get',
		params,
	});
};

// 会员系统后台-获取子渠道编码
export const getChannelConfigList = () => {
	return request({
		url: '/uac/userCenter/getChannelConfigList',
		method: 'get',
	});
};

// 会员系统后台-后台用户详情-授权系统及授权角色一览
export const getAuthorizationSystemInfos = (unionId: string) => {
	return request({
		url: `/uac/userCenter/getAuthorizationSystemInfos?unionId=${unionId}`,
		method: 'get',
	});
};

// 会员系统后台-会员中心修改后台用户(B-C端)个人密码-同步SysUser所有密码
export const changePasswordForBackendUser = (params?: Object) => {
	return request({
		url: `/uac/userCenter/changePasswordForBackendUser`,
		method: 'put',
		data: params,
	});
};

// 会员系统后台-日志-后台用户-根据uid日志记录(登录，权限变更，其他)分页查询
export const getMemberBackendUserLogPageApi = (params?: Object) => {
	return request({
		url: `/uac/memberInfo/getMemberBackendUserLogPage`,
		method: 'get',
		params,
	});
};
