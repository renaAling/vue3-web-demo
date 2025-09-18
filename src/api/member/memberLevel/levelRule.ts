import request from '/@/utils/request';

// 查询最新等级规则
export const getMemberLevelRuleGet = (params?: Object) => {
	return request({
		url: '/uac/memberLevelRule/get',
		method: 'get',
		params,
	});
};

// 分页查询历史版本规则
export const getMemberLevelPage = (params?: Object) => {
	return request({
		url: '/uac/memberLevelRule/page',
		method: 'get',
		params,
	});
};

// 根据id查询历史等级规则
export const getMemberLevelGetById = (id?: number) => {
	return request({
		url: `/uac/memberLevelRule/getById?id=${id}`,
		method: 'get',
	});
};

// 新增(编辑)会员等级规则表
export const getMemberLevelAdd = (params?: Object) => {
	return request({
		url: '/uac/memberLevelRule/add',
		method: 'post',
		data: params,
	});
};
