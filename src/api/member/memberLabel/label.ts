import request from '/@/utils/request';

// 分页查询
export const getMemberSignPage = (params?: Object) => {
	return request({
		url: '/uac/memberSign/page',
		method: 'get',
		params,
	});
};

// 列表查询
export const getMemberSignList = (params?: Object) => {
	return request({
		url: '/uac/memberSign/getList',
		method: 'get',
		params,
	});
};

// 新增会员中心会员标签信息表
export const postMemberSignAdd = (params?: Object) => {
	return request({
		url: '/uac/memberSign/add',
		method: 'post',
		data: params,
	});
};

// 修改修改会员中心会员标签信息表
export const putMemberSignUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberSign/update',
		method: 'put',
		data: params,
	});
};

// 通过id逻辑删除会员中心会员分组信息表
export const deleteMemberSignDel = (id: string) => {
	return request({
		url: `/uac/memberSign/del?id=${id}`,
		method: 'delete',
	});
};

// 新增会员标签用-下拉查询列表标签分类表(数据库写死不可更改)
export const getMemberSignCategoryList = () => {
	return request({
		url: '/uac/memberSignCategory/getList',
		method: 'get',
	});
};
