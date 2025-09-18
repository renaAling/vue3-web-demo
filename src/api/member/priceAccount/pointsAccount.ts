import request from '/@/utils/request';

// 积分福利用户列表查询-会员系统会调用
export const getAccountPage = (params?: Object) => {
	return request({
		url: '/score/account/page',
		method: 'get',
		params,
	});
};

// 会员系统调用-获取用户基本信息ByUnionId
export const getDetailForMemberApi = (unionId?: string) => {
	return request({
		url: `/score/account/getDetailForMember?unionId=${unionId}`,
		method: 'get',
	});
};

// 积分流水统计-后台接口-会员会调用-会员账户详情传unionId
export const getFlowPage = (params?: Object) => {
	return request({
		url: '/score/score_welfare_account_log/getFlow',
		method: 'get',
		params,
	});
};
