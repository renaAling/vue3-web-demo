import request from '/@/utils/request';
const prefix = '/tracomps-admin/api/admin/platform/product';

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
export function getMediaSalesList(params?: Object) {
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
export function mediaDelete(id: string) {
	return request({
		url: `${prefix}/del?id=${id}`,
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
export function mediaStatusUpdate(data: object) {
	return request({
		url: prefix + '/updateStatus',
		method: 'put',
		data,
	});
}

/**
 * 详情更新状态接口
 *
 * @param {object} formData - 表单内容
 * @returns null 此接口不返回任何内容
 */
export function mediaDetailSaveOrUpdate(formData: object) {
	return request({
		url: prefix + '/saveOrUpdate',
		method: 'post',
		data: formData,
	});
}

/**
 * 预览接口
 *
 * @param {string | number} id - 唯一标识
 * @returns null 此接口不返回任何内容
 */
export function previewMediaDetail(id: string) {
	return request({
		url: prefix + `/preview?id=${id}`,
		method: 'get',
	});
}

/**
 * 详情接口
 *
 * @param {string | number} id - 唯一标识
 * @returns null 此接口不返回任何内容
 */
export function getMediaDetail(id: string) {
	return request({
		url: prefix + `/getAdminDetailById?id=${id}`,
		method: 'get',
	});
}

/**
 * 运营商列表接口
 */
export function getAllServiceProvidersList() {
	return request({
		url: `/tracomps-admin/api/admin/platform/operator/getList`,
		method: 'get',
	});
}
