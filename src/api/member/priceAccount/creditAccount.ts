import request from '/@/utils/request';

// 会员系统后台-会员授信账户变动明细表分页查询通用接口-外面列表用
export const getMemberUserCreditLogUserPage = (params?: Object) => {
	return request({
		url: '/uac/memberUserCreditLog/userPage',
		method: 'get',
		params,
	});
};

// 会员系统后台-会员授信账户变动明细表分页查询通用接口
export const getMemberUserCreditLogPage = (params?: Object) => {
	return request({
		url: '/uac/memberUserCreditLog/page',
		method: 'get',
		params,
	});
};

// 通过id查询
export const getMemberUserCreditLogGet = (id?: string) => {
	return request({
		url: `/uac/memberUserCreditLog/get?id=${id}`,
		method: 'get',
	});
};

// 新增会员授信账户变动明细表
export const getMemberUserCreditLogAdd = (params?: Object) => {
	return request({
		url: '/uac/memberUserCreditLog/add',
		method: 'post',
		data: params,
	});
};
