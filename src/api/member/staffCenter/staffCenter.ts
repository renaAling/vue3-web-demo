import request from '/@/utils/request';

// 分页查询统一账户中心员工信息表
export const getUserEmployee = (params?: Object) => {
	return request({
		url: '/uac/userEmployee/page',
		method: 'get',
		params,
	});
};
// 新增统一账户中心员工信息表外部用户
export const getUserEmployeeAdd = (params?: Object) => {
	return request({
		url: '/uac/userEmployee/add',
		method: 'post',
		data: params,
	});
};
// 修改统一账户中心员工信息表
export const getUserEmployeeUpdate = (params?: Object) => {
	return request({
		url: '/uac/userEmployee/update',
		method: 'put',
		data: params,
	});
};
// 获取外部机构树
export const getUserOutOrganizationTree = () => {
	return request({
		url: '/uac/userOutOrganization/tree',
		method: 'get',
	});
};

// 通过id查询
export const getUserInfoByUidMobile = (id: string) => {
	return request({
		url: `/uac/userEmployee/get?id=${id}`,
		method: 'get',
	});
};
// 会员系统后台-日志-外部员工详情-根据用户手机号日志分页查询
export const getStaffLogPageApi = (params?: Object) => {
	return request({
		url: `/uac/memberInfo/getStaffLogPage`,
		method: 'get',
		params,
	});
};

// 会员管理-通过手机号查询员工信息详情
export const getMemberStaffInfoByMobilApi = (mobile?: string) => {
	return request({
		url: `/uac/memberInfo/memberStaffInfoByMobile?mobile=${mobile}`,
		method: 'get',
	});
};

// 会员管理-通过手机号查询员工信息详情
export const getWalletFlowForMemberApi = (params?: Object) => {
	return request({
		url: `/mall/walletUser/walletFlowForMember`,
		method: 'get',
		params,
	});
};
// 获取餐食机构树
export const getMealsCompanyTree = () => {
	return request({
		url: '/uac/userEmployee/getMealsCompanyTree',
		method: 'get',
	});
};
