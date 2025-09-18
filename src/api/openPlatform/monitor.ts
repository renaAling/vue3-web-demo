import request from '/@/utils/request';
// 公共前缀
const prefix = '/open';

/**
 * 管理端接口
 */

// 运维监控 -> 预警中心 -> 列表接口
export function getWarningCenterList(params: object) {
	return request({
		url: prefix + '/interfaceAlert/page',
		method: 'get',
		params,
	});
}

// 运维监控 -> 资源监控 -> 根据appId查询对应资源接口列表
export function getAppMonitorInfoList(params?: object) {
	return request({
		url: prefix + '/appInfoMonitor/page',
		method: 'get',
		params,
	});
}

// 运维监控 -> 资源监控 -> 根据appId和interfaceId查询对应的吞吐量折线图数据
export function getTpsLineChartById(data: any) {
	return request({
		url: prefix + `/appInfoMonitor/getTpsLineChartById?appId=${data.appId}&interfaceId=${data.interfaceId}`,
		method: 'post',
	});
}

// 运维监控 -> 资源监控 -> 根据appId和interfaceId查询对应的平均响应时间折线图数据
export function getMsLineChartById(data: any) {
	return request({
		url: prefix + `/appInfoMonitor/getConsumedTimeLineChartById?appId=${data.appId}&interfaceId=${data.interfaceId}`,
		method: 'post',
	});
}

/**
 * 开发者端接口
 */
// 运维监控 -> 预警中心 -> 列表接口
export function getDeveloperWarningCenterList(params: object) {
	return request({
		url: prefix + '/interfaceAlert/listPage',
		method: 'get',
		params,
	});
}
// 运维监控 -> 资源监控 -> 根据appId查询对应资源接口列表
export function getDeveloperAppMonitorInfoList(params?: object) {
	return request({
		url: prefix + '/appInfoMonitor/listPage',
		method: 'get',
		params,
	});
}

// 运维监控 -> 资源监控 -> 根据appId和interfaceId查询对应的吞吐量折线图数据
export function getDeveloperTpsLineChartById(data: any) {
	return request({
		url: prefix + `/appInfoMonitor/getTpsLineChartById?appId=${data.appId}&interfaceId=${data.interfaceId}`,
		method: 'post',
	});
}

// 运维监控 -> 资源监控 -> 根据appId和interfaceId查询对应的平均响应时间折线图数据
export function getDeveloperMsLineChartById(data: any) {
	return request({
		url: prefix + `/appInfoMonitor/getConsumedTimeLineChartById?appId=${data.appId}&interfaceId=${data.interfaceId}`,
		method: 'post',
	});
}
