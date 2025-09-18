import request from '/@/utils/request';

// 获取外部机构树
export const getUserOutOrganizationTree = () => {
	return request({
		url: '/uac/userOutOrganization/tree',
		method: 'get',
	});
};

// 删除外部机构树
export const deleteUserOutOrganizationDel = (id: string) => {
	return request({
		url: `/uac/userOutOrganization/del?id=${id}`,
		method: 'delete',
	});
};

// 新增外部机构树
export const postUserOutOrganizationAdd = (params?: Object) => {
	return request({
		url: `/uac/userOutOrganization/add`,
		method: 'post',
		data: params,
	});
};
// 编辑外部机构树
export const putUserOutOrganizationUpdate = (params?: Object) => {
	return request({
		url: `/uac/userOutOrganization/update`,
		method: 'put',
		data: params,
	});
};

// 获取餐食机构树
export const getMealsCompanyTree = () => {
	return request({
		url: '/uac/userEmployee/getMealsCompanyTree',
		method: 'get',
	});
};
