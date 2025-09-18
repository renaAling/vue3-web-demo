import request from '/@/utils/request';

// 会员管理-账户管理分页查询
export const getmemberUserPage= (params?: Object) => {
	return request({
		url: '/uac/memberInfo/memberUserPage',
		method: 'get',
		params,
	});
};

// 后台-会员等级下拉列表
export const getLevelList = (params?: Object) => {
	return request({
		url: '/uac/memberLevel/getLevelList',
		method: 'get',
		params,
	});
};

// 后台-会员等级-根据unionId直接调整等级
export const changeLevelByUnionIdApi = (params?: Object) => {
	return request({
		url: '/uac/userLevel/changeLevelByUnionId',
		method: 'post',
		params,
	});
};
