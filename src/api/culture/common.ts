// TODO: 公共接口
import request from '/@/utils/request';

// 图片上传接口
export function uploadImage(formData?: object) {
	return request({
		url: '/admin/sys-file/upload',
		method: 'post',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
	});
}

// 图片批量上传接口
export function batchUploadFiles(formData?: object) {
	return request({
		url: '/admin/sys-file/batch/upload',
		method: 'post',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
	});
}

// 获取省市区行政区接口
export function getProvinceCityDistrictTree() {
	return request({
		url: '/mall/district/getTree',
		method: 'get',
	});
}
