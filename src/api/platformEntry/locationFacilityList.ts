import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';
// 分页查询设备信息表
export function getPlatformDevicePage(params?: object) {
	return request({
		url: prefix + '/platformDevice/page',
		method: 'get',
		params,
	});
}

// 新增设备信息表
export function getPlatformDeviceAdd(params?: object) {
	return request({
		url: prefix + '/platformDevice/add',
		method: 'post',
		data: params,
	});
}
// 修改设备信息表
export function getPlatformDeviceUpdate(params?: object) {
	return request({
		url: prefix + '/platformDevice/update',
		method: 'put',
		data: params,
	});
}
// 报修设备
export function getPlatformDeviceRepair(params?: object) {
	return request({
		url: prefix + '/platformDeviceRepair/repair',
		method: 'put',
		data: params,
	});
}
// 下拉查询-新增设备用
export function geplatformPlaceList() {
	return request({
		url: prefix + '/platformPlace/List',
		method: 'get',
	});
}

// 通过id逻辑删除设备信息表
export function getPlatformDeviceDel(id: number) {
	return request({
		url: prefix + `/platformDevice/del?id=${id}`,
		method: 'delete',
	});
}
