import request from '/@/utils/request';

// 会员系统后台-会员储值账户变动明细表分页查询通用接口-外面表格用
export const getMemberUserStoredLogUserPage = (params?: Object) => {
	return request({
		url: '/uac/memberUserStoredLog/userPage',
		method: 'get',
		params,
	});
};

// 会员系统后台-会员储值账户变动明细表分页查询通用接口
export const getMemberUserStoredLogPage = (params?: Object) => {
	return request({
		url: '/uac/memberUserStoredLog/page',
		method: 'get',
		params,
	});
};

// 通过id查询
export const getMemberUserStoredLogGet = (id?: string) => {
	return request({
		url: `/uac/memberUserStoredLog/get?id=${id}`,
		method: 'get',
	});
};

// 新增会员储值账户变动明细表
export const getMemberUserStoredLogAdd = (params?: Object) => {
	return request({
		url: '/uac/memberUserStoredLog/add',
		method: 'post',
		data:params,
	});
};