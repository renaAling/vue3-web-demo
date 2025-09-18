import request from '/@/utils/request';

// 会员系统后台-平台用户(有交易的用户)管理分页
export const getConsumeUsersForMember = (params?: Object) => {
	return request({
		url: '/uac/userCenter/getConsumeUsersForMember',
		method: 'get',
		params,
	});
};
// 会员系统后台-平台用户消费信息
export const getConsumeInfo = (unionId: string) => {
	return request({
		url: `/uac/userCenter/getConsumeInfo?unionId=${unionId}`,
		method: 'get',
	});
};
// 会员系统后台-平台用户消费信息
export const getOrderProductInfo = (params?: Object) => {
	return request({
		url: '/uac/userCenter/getOrderProductInfo',
		method: 'get',
		params,
	});
};

// 会员系统后台-平台用户消费信息
export const getUserAddressListApi = (unionId?: string) => {
	return request({
		url: `/tracomps-front/api/front/address/getUserAddressList?unionId=${unionId}`,
		method: 'get',
	});
};
