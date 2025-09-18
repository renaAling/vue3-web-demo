import request from '/@/utils/request';

// 优惠券分页查询
export const pageMemberCouponPage = (params?: Object) => {
	return request({
		url: '/uac/memberCoupon/page',
		method: 'get',
		params,
	});
};
// 新增会员中心优惠券信息表新增
export const pageMemberCouponAdd = (params?: Object) => {
	return request({
		url: '/uac/memberCoupon/add',
		method: 'post',
		data: params,
	});
};
// 修改会员中心优惠券信息表编辑
export const pageMemberCouponUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberCoupon/update',
		method: 'put',
		data: params,
	});
};
// 通过id逻辑删除会员中心优惠券信息表
export const pageMemberCouponDel = (id: number) => {
	return request({
		url: `/uac/memberCoupon/del?id=${id}`,
		method: 'delete',
	});
};

// 优惠券发放-会员中心优惠券发放日志分页列表
export const pageMemberCouponIssueLogPage = (params?: Object) => {
	return request({
		url: '/uac/memberCouponIssueLog/page',
		method: 'get',
		params,
	});
};
// 优惠券发放-优惠券类型下拉列表查询
export const pageMemberCoupongetList = () => {
	return request({
		url: '/uac/memberCoupon/getList',
		method: 'get',
	});
};
//优惠券发行-通过用户id获取手机号和昵称
export const getUserCenterByUnionId = (unionId: string) => {
	return request({
		url: `/uac/memberCoupon/getUserInfoByUnionIdForMember?unionId=${unionId}`,
		method: 'get',
	});
};

// 优惠券发放-B端-优惠券发放
export const pageMemberCouponIssueLogGrantCoupon = (params: any) => {
	return request({
		url: `/uac/memberCouponIssueLog/grantCoupon`,
		method: 'post',
		data: params,
	});
};

// 优惠券发放-优惠券发放详情
export const pageMemberCouponIssueLogGet = (params: any) => {
	return request({
		url: `/uac/memberCouponUserInfo/getPageDetailByIssueCode`,
		method: 'get',
		params,
	});
};
//  优惠券核销-分页查询会员中心用户优惠券明细信息表
export const pageMemberCouponUserInfoPage = (params?: Object) => {
	return request({
		url: '/uac/memberCouponUserInfo/page',
		method: 'get',
		params,
	});
};
// 优惠券核销-B端-核销优惠券
export const pageMemberCouponWriteOff = (params?: Object) => {
	return request({
		url: '/uac/memberCouponUserInfo/writeOffCouponByCode',
		method: 'put',
		data: params,
	});
};

// 下载-根据发放批次编码分页查询发放批次明细信息表
export const downloadDistributeDetails = (issueCode?: string) => {
	return request({
		url: `/uac/memberCouponUserInfo/downloadDistributeDetails?issueCode=${issueCode}`,
		method: 'get',
	});
};
