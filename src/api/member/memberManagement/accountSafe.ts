import request from '/@/utils/request';

// 账户安全-账户交易日志分页查询
export const getMemberTradeLogPage = (params?: Object) => {
	return request({
		url: '/uac/memberInfo/getMemberTradeLogPage',
		method: 'get',
		params,
	});
};

// 分页查询账号登录日志
export const getUserLoginLogPage = (params?: Object) => {
	return request({
		url: '/uac/userLoginLog/page',
		method: 'get',
		params,
	});
};

// 会员系统后台-日志-账户安全-账户修改日志分页查询
export const getMemberSysLogPageApi = (params?: Object) => {
	return request({
		url: '/uac/memberInfo/getMemberSysLogPage',
		method: 'get',
		params,
	});
};