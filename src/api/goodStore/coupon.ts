import request from '/@/utils/request';
import { handleBlobFile } from '/@/utils/other';

// 获取使用人群和范围
export const getUserScope = () => {
	return request({
		url: '/mall/coupon/getCodeList',
		method: 'get',
	});
};

// 优惠券分页查询
export const pageCouponPage = (params?: Object) => {
	return request({
		url: '/mall/coupon/page',
		method: 'get',
		params,
	});
};
// 新增优惠券信息表新增
export const pageCouponAdd = (params?: Object) => {
	return request({
		url: '/mall/coupon/add',
		method: 'post',
		data: params,
	});
};
// 修改优惠券信息表编辑
export const pageCouponUpdate = (params?: Object) => {
	return request({
		url: '/mall/coupon/update',
		method: 'put',
		data: params,
	});
};
// 通过id逻辑删除优惠券信息表
export const pageCouponDel = (id: number) => {
	return request({
		url: `/mall/coupon/del?id=${id}`,
		method: 'delete',
	});
};
// 通过id查询优惠券信息表详情
export const couponDetail = (id: number) => {
	return request({
		url: `/mall/coupon/get?id=${id}`,
		method: 'get',
	});
};

// 优惠券发放-优惠券发放日志分页列表
export const pageCouponIssueLogPage = (params?: Object) => {
	return request({
		url: '/mall/coupon_distribute/page',
		method: 'get',
		params,
	});
};
// 优惠券发放-优惠券类型下拉列表查询
export const pageCoupongetList = () => {
	return request({
		url: '/mall/coupon/list',
		method: 'get',
	});
};
//优惠券发行-通过用户id获取手机号和昵称
export const getUserCenterByUnionId = (unionId: string) => {
	return request({
		url: `/mall/coupon_distribute/getUserInfo?unionId=${unionId}`,
		method: 'get',
	});
};

// 优惠券发放-B端-优惠券发放
export const pageCouponIssueLogGrantCoupon = (params: any) => {
	return request({
		url: `/mall/coupon_distribute/grantCoupon`,
		method: 'post',
		data: params,
	});
};

// 优惠券发放-优惠券发放详情
export const pageCouponIssueLogGet = (params: any) => {
	return request({
		url: `/mall/coupon_distribute/get`,
		method: 'get',
		params,
	});
};
//  优惠券核销-分页查询用户优惠券明细信息表
export const pageCouponUserInfoPage = (params?: Object) => {
	return request({
		url: '/mall/coupon_sub/page',
		method: 'get',
		params,
	});
};
// 优惠券核销-B端-核销优惠券
export const pageCouponWriteOff = (params?: Object) => {
	return request({
		url: '/uac/CouponUserInfo/writeOffCouponByCode',
		method: 'put',
		data: params,
	});
};
// 下载
export const downloadDistribute = (data: Object, fileName: string) => {
	return request({
		url: '/mall/coupon_distribute/excel',
		method: 'post',
		data,
		responseType: 'blob',
	}).then((res) => {
		handleBlobFile(res, fileName);
});
};
// 发放详情

export const couponSubDetail = (params?: Object) => {
	return request({
		url: '/mall/coupon_sub/detail',
		method: 'get',
		params,
	});
};
// 优惠券发放-优惠券发放日志导出
export const downloadRecord = (params: Object, fileName: string) => {
	return request({
		url: `/mall/coupon_sub/excel`,
		method: 'get',
		params,
		responseType: 'blob',
	}).then((res) => {
		handleBlobFile(res, fileName);
});
};