import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';

// 分页查询
export function getPlatformMerchantPage(params?: object) {
	return request({
		url: prefix + '/platformMerchant/page',
		method: 'get',
		params,
	});
}

// 审核入驻商家信息表
export function getPlatformCategoryAudit(params?: object) {
	return request({
		url: prefix + '/platformMerchant/audit',
		method: 'put',
		data:params,
	});
}

// 修改数字对接系统信息表
// export function getPlatformDigitalSystemUpdate(params?: object) {
// 	return request({
// 		url: prefix + '/platformDigitalSystem/update',
// 		method: 'put',
// 		data: params,
// 	});
// }

// // 新增数字对接系统信息表
// export function getPlatformDigitalSystemAdd(params?: object) {
// 	return request({
// 		url: prefix + '/platformDigitalSystem/add',
// 		method: 'post',
// 		data: params,
// 	});
// }
