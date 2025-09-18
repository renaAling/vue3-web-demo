import request from '/@/utils/request';

/**
 * 身份编码列表信息
 * @param pram
 */
export function getCodeList() {
	return request({
		url: `/tracomps-admin/api/admin/merchant/empIdentity/getCodeList`,
		method: 'get',
	});
}

/**
 * 获取vip对应身份
 * @param pram
 */
export function vipListAll() {
	return request({
		url: `/tracomps-admin/api/admin/platform/vipIdentity/listAll`,
		method: 'put',
	});
}

/**
 * 修改vip身份
 * @param pram
 */
export function vipUpdateOrSave(params: object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/vipIdentity/updateOrSave`,
		method: 'put',
		data: params,
	});
}
