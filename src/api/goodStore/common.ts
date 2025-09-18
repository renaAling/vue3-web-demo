import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取门店类型
export function getGoodStoreInfo(formData?: object) {
	return request({
		url: prefix + '/admin/sys-file/upload',
		method: 'post',
		data: formData,
	});
}

// 获取门店列表
export function getGoodStoreList(formData?: object) {
	return request({
		url: '/admin/sys-file/upload',
		method: 'post',
		data: formData,
	});
}

// 获取员工岗位列表
export function getJobsList(formData?: object) {
	return request({
		url: '/admin/sys-file/upload',
		method: 'post',
		data: formData,
	});
}
