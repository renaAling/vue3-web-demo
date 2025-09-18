import request from '/@/utils/request';

/**
 * @description 分页获取自提点列表
 */
export function pickupListApi(params) {
	return request({
		url: '/tracomps-admin/api/admin/platform/pickup_site/page',
		method: 'get',
		params,
	});
}

/**
 * @description 自提点详情
 */
export function pickupDetailApi(params) {
	return request({
		url: `/tracomps-admin/api/admin/platform/pickup_site/getDetailById`,
		method: 'get',
		params,
	});
}

/**
 * @description 更新自提点状态
 */
export function updatePickupStatusApi(data) {
	return request({
		url: '/tracomps-admin/api/admin/platform/pickup_site/updateStatus',
		method: 'put',
		data,
	});
}

/**
 * @description 保存或者更新自提点信息
 */
export function savePickupApi(data) {
	return request({
		url: '/tracomps-admin/api/admin/platform/pickup_site/saveOrUpdate',
		method: 'post',
		data,
	});
}

/**
 * @description 删除自提点
 */
export function deletePickupApi(params) {
	return request({
		url: `/tracomps-admin/api/admin/platform/pickup_site/del`,
		method: 'delete',
		params,
	});
}

/**
 * @description 分页获取自提点列表
 */
export function userRoleApi() {
	return request({
		url: '/tracomps-admin/api/admin/merchant/empIdentity/getCodeList',
		method: 'get',
	});
}

/**
 * @description 获取城市列表
 */
export function cityListTree() {
	return request({
		url: '/tracomps-admin/api/admin/merchant/city/region/city/tree',
		method: 'get',
	});
}
