import request from '/@/utils/request';

// 出行子系统后台-通过类型查询当前url配置
export function getInterfaceConfigGetUrlApi(params?: Object) {
	return request({
		url: `/ride/interfaceConfig/getUrl`,
		method: 'get',
		params,
	});
}

// 出行子系统后台-修改地铁三方接口配置url
// 接口类型：1.列车运行表、2.列车时刻表、3.列车运行实时信息、4.列车拥挤详情、5.强冷强弱 6.出战信息图
export function putInterfaceConfigUpdateApi(data?: Object) {
	return request({
		url: `/ride/interfaceConfig/update`,
		method: 'put',
		data,
	});
}

// 出行子系统后台-分页查询配置日志
export function getInterfaceConfigGetLogPageApi(params?: Object) {
	return request({
		url: `/ride/interfaceConfig/getLogPage`,
		method: 'get',
		params,
	});
}
