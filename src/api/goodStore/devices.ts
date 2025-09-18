import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取设备列表
export function getDevicesList(params?: object) {
	return request({
		url: prefix + '/wdPrinter/page',
		method: 'get',
		params,
	});
}

// 更新设备启用/禁用状态
export function updateDeviceStatus(data: object) {
	return request({
		url: prefix + '/wdPrinter/updateStatus',
		method: 'post',
		data,
	});
}

// 获取汇总商家列表
export function getMerchantList(params?: object) {
	return request({
		url: prefix + '/merchant/getList',
		method: 'get',
		params,
	});
}

// 根据对应的商家code查询其门店列表
export function getStoreListByMerchantCode(params?: object) {
	return request({
		url: prefix + '/store/getStoreByMerchantCode',
		method: 'get',
		params,
	});
}

// 获取设备品牌列表
export function getBrandList() {
	return request({
		url: prefix + '/wdPrinter/getBrandList',
		method: 'get',
	});
}

// 根据设备品牌获取对应的关联设备信息
export function getDeviceInfo(brandName: string) {
	return request({
		url: prefix + `/wdPrinter/getListByBrand/${brandName}`,
		method: 'get',
	});
}

// 根据关联设备sn码获取剩余设备信息
export function getRestDeviceInfo(sn: string) {
	return request({
		url: prefix + `/wdPrinter/printerInfoDetail/${sn}`,
		method: 'get',
	});
}

// 新增/更新设备
export function saveOrUpdateDevice(data?: object) {
	return request({
		url: prefix + '/wdPrinter/saveOrUpdate',
		method: 'post',
		data,
	});
}

// 设备详情
export function getDeviceDetail(printerCode: string) {
	return request({
		url: prefix + `/wdPrinter/detail?printerCode=${printerCode}`,
		method: 'get',
	});
}

// 删除指定设备
export function delDevice(printerCode: string) {
	return request({
		url: prefix + `/wdPrinter/del?printerCode=${printerCode}`,
		method: 'delete',
	});
}
