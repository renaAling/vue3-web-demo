import request from '/@/utils/request';

// 积分流水统计
export const getFlow = (params?: Object) => {
	return request({
		url: '/score/score_welfare_account_log/getFlow',
		method: 'get',
		params,
	});
};
// 导出积分流水统计
export const exportFlow = (params?: Object) => {
	return request({
		url: '/score/score_welfare_account_log/exportFlow',
		method: 'get',
		params,
	});
}

// 积分存量统计
// export const getFlow = (params?: Object) => {
// 	return request({
// 		url: '/score/accountLog/getFlow',
// 		method: 'get',
// 		params,
// 	});
// };