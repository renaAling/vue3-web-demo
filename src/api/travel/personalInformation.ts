import request from '/@/utils/request';

// 用户信息分页
export const getUserPage = (params?: Object) => {
	return request({
		url: '/ride/cdMetroUserBind/getUserPage',
		method: 'get',
		params,
	});
};

// 出行子系统后台-列表查询常见问题信息表
export const commonQuestionsPage = (params?: Object) => {
	return request({
		url: '/ride/commonQuestions/getPage',
		method: 'get',
		params,
	});
};

export function commonQuestionsAdd(data: Object) {
  return request({
    url: '/ride/commonQuestions/add',
    method: 'post',
    data,
  });
}

export function commonQuestionsUpdate(data: Object) {
  return request({
    url: '/ride/commonQuestions/update',
    method: 'put',
    data,
  });
}

export const delCommonQuestions = (id: String) => {
	return request({
		url: `/ride/commonQuestions/del?id=${id}`,
		method: 'delete',
		data: id,
	});
}

// 会员中心用-出行子系统用-根据uid查询出行行程
export function getUserRidePageApi(params?: Object) {
	return request({
		url: `/uac/userCenter/getUserRidePage`,
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