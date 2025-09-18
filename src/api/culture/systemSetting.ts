import request from '/@/utils/request';

/**
 * 文件上传
 * @param data
 */
export function fileFileApi(data: object, params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/upload/file',
		method: 'POST',
		params,
		data,
	});
}

// 文件系统上传
export function sysUploadFileApi(data: object, params: object) {
	return request({
		url: '/admin/sys-file/upload',
		method: 'POST',
		params,
		data,
	});
}

/**
 * 图片上传
 * @param data
 */
export function fileImageApi(data: object, params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/upload/image',
		method: 'POST',
		params,
		data,
	});
}

/**
 * 图片列表
 * @param data
 */
export function fileListApi(params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/attachment/list',
		method: 'get',
		params,
	});
}

/**
 * 图片列表 删除图片
 * @param data
 */
export function fileDeleteApi(id: any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/attachment/delete`,
		method: 'post',
		data: { ids: id },
	});
}

/**
 * 图片列表 移動分類
 * @param data
 */
export function attachmentMoveApi(data: object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/attachment/move`,
		method: 'post',
		data,
	});
}

/**
 * 微信开放平台上传素材
 * @param data
 */
export function wechatUploadApi(data: object, params: object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/wechat/open/media/upload`,
		method: 'post',
		data,
		params,
	});
}
