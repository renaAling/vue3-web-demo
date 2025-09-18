import request from '/@/utils/request';

// 分页查询统一账户中心员工信息表
export const getAllRole = (params?: Object) => {
	return request({
		url: '/uac/memberInfo/getAllRole',
		method: 'get',
		params,
	});
};

export const pageList = (params: Object) => {
	return request({
		url: '/admin/role/page',
		method: 'get',
		params,
	});
};
