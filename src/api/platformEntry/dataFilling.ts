import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';

// 新增入驻商家信息表
export function getPlatformMerchantAdd(params?: object) {
	return request({
		url: prefix + '/platformMerchant/add',
		method: 'post',
		data: params,
	});
}

// 门店品类下拉
export function getPlatformCategoryArr() {
	return request({
		url: prefix + '/platformCategory/getList',
		method: 'get',
	});
}

// 后台查询省市区树结构
export function getTreeList() {
	return request({
		url: '/mall/district/getTree',
		method: 'get',
	});
}

// 图片上传接口
export function uploadImage(formData?: object) {
	return request({
		url: '/admin/sys-file/uploadC',
		method: 'post',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
	});
}