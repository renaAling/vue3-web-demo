import request from '/@/utils/request';

// 出行子系统后台-用户信息分页
export function getCdMetroUserBindUserPageApi(params?: Object) {
	return request({
		url: `/ride/cdMetroUserBind/getUserPage`,
		method: 'get',
		params,
	});
}

// 会员中心用-出行子系统用-根据uid查询出行行程
export function getTripRecordForMemberApi(params?: Object) {
	return request({
		url: `/ride/cdMetroOrderRecord/getTripRecord`,
		method: 'get',
		params,
	});
}

// 出行子系统后台-乘车积分分页查询
export function getScoreFlowForRideApi(params?: Object) {
	return request({
		url: `/score/score_welfare_account_log/getScoreFlowForRide`,
		method: 'get',
		params,
	});
}