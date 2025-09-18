import request from '/@/utils/request';

// 后台-会员等级分页查询
export const getMemberLevelPage = (params?: Object) => {
	return request({
		url: '/uac/memberLevel/getList',
		method: 'get',
		params,
	});
};

// 新增会员等级分级
export const postInsertMemberLevelAdd = (params?: Object) => {
	return request({
		url: '/uac/memberLevel/insertMemberLevel',
		method: 'post',
		data: params,
	});
};

// 根据id单个更新会员等级分级-降低成长值后涉及全量用户自动升级算法
export const postInsertMemberLevelUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberLevel/updateMemberLevel',
		method: 'post',
		data: params,
	});
};
