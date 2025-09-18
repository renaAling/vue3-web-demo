import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';
// 分页查询平台入驻设备报修记录表
export function getPlatformDeviceRepairPage(params?: object) {
	return request({
		url: prefix + '/platformDeviceRepair/page',
		method: 'get',
		params,
	});
}

// 处理设备
export function getPlatformDeviceHandle(params?: object) {
	return request({
		url: prefix + '/platformDeviceRepair/handle',
		method: 'put',
		data: params,
	});
}
