import request from '/@/utils/request';

// 报表中心-平台用户
export const getMemberPlatFromReport = (params?: Object) => {
	return request({
		url: '/uac/memberLevelReport/getMemberPlatFromReport',
		method: 'get',
		params,
	});
};

// 报表中心-列表查询会员中心消费统计数据
export const getMemberConsumeReport = (params?: Object) => {
	return request({
		url: '/uac/memberConsumeReport/page',
		method: 'get',
		params,
	});
};
// 报表中心-等级统计信息表
export const getMemberLevelReport = (params?: Object) => {
	return request({
		url: '/uac/memberLevelReport/page',
		method: 'get',
		params,
	});
};
// 报表中心-员工用户
export const getmMmberStaffUserReport = (params?: Object) => {
	return request({
		url: '/uac/memberStaffUserReport/page',
		method: 'get',
		params,
	});
};