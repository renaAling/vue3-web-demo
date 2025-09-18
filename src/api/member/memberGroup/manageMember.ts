import request from '/@/utils/request';

// 会员管理-账户管理分页查询
export const getmemberUserPage = (params?: Object) => {
	return request({
		url: '/uac/memberInfo/memberUserPage',
		method: 'get',
		params,
	});
};

// 保存用户新分组信息
export const saveOrUpdateUserInfos = (params?: Object) => {
	return request({
		url: '/uac/memberGroupInfo/saveOrUpdateUserInfos',
		method: 'post',
		data: params,
	});
};

// 根据uid获得用户分组名称和编码信息
export const getUserInfos = (uid?: string) => {
	return request({
		url: `/uac/memberGroupInfo/getUserInfos?uid=${uid}`,
		method: 'get',
	});
};

// 支持模糊查询获取所有会员分组(绑定会员下拉使用)
export const getMemberGroupList = (name?: string) => {
	return request({
		url: `/uac/memberGroup/getList?name=${name}`,
		method: 'get',
	});
};
