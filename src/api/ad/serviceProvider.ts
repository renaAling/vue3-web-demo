import request from '/@/utils/request';
const prefix = '/tracomps-admin/api/admin/platform/operator';

/**
 * 列表查询接口
 *
 * @param {string | number} goodsType - 媒体的类型 1-网订店取，2-广告投放
 * @param {string | number} current - 页码,示例值(1)
 * @param {string | number} size - 单页数量,示例值(10)
 * @param {string | number} productCode - spu编码
 * @param {string} spuName - spu媒体名称
 * @param {string} operatorName - 运营商名称
 * @param {string | number} isShow - 媒体状态：1-下架，2-上架
 * @returns null 此接口不返回任何内容
 */
export function getServiceProvidersList(params?: Object) {
	return request({
		url: prefix + '/page',
		method: 'get',
		params,
	});
}

/**
 * 列表删除接口
 *
 * @param {string | number} id - 需要删除的媒体的唯一标识
 * @returns null 此接口不返回任何内容
 */
export function serviceProvidersDelete(id: string) {
	return request({
		url: `${prefix}/delete?id=${id}`,
		method: 'delete',
	});
}

/**
 * 列表更新状态接口
 *
 * @param {string | number} id - 唯一标识
 * @param {boolean} isShow - 是否上/下架
 * @returns null 此接口不返回任何内容
 */
export function serviceProvidersStatusUpdate(data: object) {
	return request({
		url: prefix + '/updateStatus',
		method: 'put',
		data,
	});
}

/**
 * 查询单个运营商是否关联的媒体数量
 *
 * @param {string | number} id - 唯一标识
 * @param {boolean} isShow - 是否上/下架
 * @returns null 此接口不返回任何内容
 */
export function getRelatedById(id: any) {
	return request({
		url: prefix + `/getRelatedById?id=${id}`,
		method: 'get',
	});
}

/**
 * 新增运营商接口
 *
 * @param {object} formData - 表单内容
 * @returns null 此接口不返回任何内容
 */
export function serviceProvidersAdd(formData: object) {
	return request({
		url: prefix + '/add',
		method: 'post',
		data: formData,
	});
}

/**
 * 更新运营商接口
 *
 * @param {object} formData - 表单内容
 * @returns null 此接口不返回任何内容
 */
export function serviceProvidersUpdate(formData: object) {
	return request({
		url: prefix + '/update',
		method: 'put',
		data: formData,
	});
}

/**
 * 运营商详情接口
 *
 * @param {object} formData - 表单内容
 * @returns null 此接口不返回任何内容
 */
export function serviceProvidersDetail(id: string) {
	return request({
		url: prefix + `/getById?id=${id}`,
		method: 'get',
	});
}
