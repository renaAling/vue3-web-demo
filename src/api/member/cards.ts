import request from '/@/utils/request';

// 会员复购统计查询
export const cardPage = (params: Object) => {
	return request({
		url: '/uac/card/apply/page',
		method: 'get',
		params,
	});
};
// 会员卡新增
export const cardApplyAdd = (data: Object) => {
	return request({
		url: '/uac/card/apply/add',
		method: 'post',
		data,
	});
};
// 会员卡修改
export const cardApplyUpdate = (data: Object) => {
	return request({
		url: '/uac/card/apply/update',
		method: 'put',
		data,
	});
};
// 详情
export const cardApplyDetail = (params: Object) => {
	return request({
		url: '/uac/card/apply/get',
		method: 'get',
		params,
	});
};
// 审核
export const cardApplyAudit = (data: Object) => {
	return request({
		url: '/uac/card/apply/audit',
		method: 'post',
		data,
	});
};
export const cardApplyCancel = (data: Object) => {
	return request({
		url: '/uac/card/apply/cancel',
		method: 'post',
		data,
	});
};

// 会员卡发行
export const cardIssue = (params: Object) => {
	return request({
		url: '/uac/card/page',
		method: 'get',
		params,
	});
};
// 详情
export const cardDetail= (params: Object) => {
	return request({
		url: '/uac/card/get',
		method: 'get',
		params,
	});
};
export const cardAdd= (data: Object) => {
	return request({
		url: '/uac/card/add',
		method: 'post',
		data,
	});
};
export const cardUpdate= (data: Object) => {
	return request({
		url: '/uac/card/update',
		method: 'put',
		data,
	});
};
// 申请单列表
export const applyList= (params: Object) => {
	return request({
		url: '/uac/card/apply/getApplyInfo',
		method: 'get',
		params,
	});
};
// 用户申请记录
export const cardApplyRecords= (params: Object) => {
	return request({
		url: '/uac/card/user/page',
		method: 'get',
		params,
	});
};
// 会员卡信息表
export const userCardPage= (params: Object) => {
	return request({
		url: '/uac/card/log/page',
		method: 'get',
		params,
	});
};

export const cardRightsPage= (params: Object) => {
	return request({
		url: '/uac/card/right/log/page',
		method: 'get',
		params,
	});
};
// 作废
export const cardUserUpdate= (data: Object) => {
	return request({
		url: '/uac/card/user/update',
		method: 'put',
		data,
	});
};
