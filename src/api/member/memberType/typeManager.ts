import request from '/@/utils/request';

// 获取会员分类树形结构
export const getMemberCategoryTree = () => {
	return request({
		url: '/uac/memberCategory/tree',
		method: 'get',
	});
};

// 新增会员分类表
export const postMemberCategoryAdd = (params?: Object) => {
	return request({
		url: '/uac/memberCategory/add',
		method: 'post',
		data: params,
	});
};
// 修改会员分类表
export const putMemberCategoryUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberCategory/update',
		method: 'put',
		data: params,
	});
};

// 通过id逻辑删除会员分类表
export const deleteMemberCategoryDel = (id: string) => {
	return request({
		url: `/uac/memberCategory/del?id=${id}`,
		method: 'delete',
	});
};

// 通过id查询
export const getMemberCategoryGet = (id: string) => {
	return request({
		url: `/uac/memberCategory/get?id=${id}`,
		method: 'get',
	});
};

// 支持模糊查询获取所有会员分类(绑定会员下拉使用)
export const getMemberCategoryGetList = (name: string) => {
	return request({
		url: `/uac/memberCategory/getList?name=${name}`,
		method: 'get',
	});
};

// 保存用户新分类信息
export const saveOrUpdateUserInfos = (params?: Object) => {
	return request({
		url: `/uac/memberCategoryInfo/saveOrUpdateUserInfos`,
		method: 'post',
		data: params,
	});
};

// 根据uid获得分类名称和编码信息
export const getMemberCategoryInfo = (uid: string) => {
	return request({
		url: `/uac/memberCategoryInfo/getUserInfos?uid=${uid}`,
		method: 'get',
	});
};
