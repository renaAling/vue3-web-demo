import request from '/@/utils/request';

// 分页查询分组信息表
export const getMemberGroupPage = (params?: Object) => {
	return request({
		url: '/uac/memberGroup/page',
		method: 'get',
		params,
	});
};

// 新增会员中心会员分组信息表
export const postMemberGroupAdd = (params?: Object) => {
	return request({
		url: '/uac/memberGroup/add',
		method: 'post',
		data: params,
	});
};

// 修改会员中心会员分组信息表
export const putMemberGroupUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberGroup/update',
		method: 'put',
		data: params,
	});
};

// 通过id逻辑删除会员中心会员分组信息表
export const deleteMemberGroupDel = (id: string) => {
	return request({
		url: `/uac/memberGroup/del?id=${id}`,
		method: 'delete',
	});
};
