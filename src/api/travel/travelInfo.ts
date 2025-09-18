import request from '/@/utils/request';

// 出行子系统后台-分页查询公共交通站点信息表
export function getPublicTransportStationsApi(params?: Object) {
	return request({
		url: `/ride/publicTransportStations/page`,
		method: 'get',
		params,
	});
}

// 出行子系统后台-通过id查询共交通站点信息表
export function getPublicTransportStationsGetApi(id: any) {
	return request({
		url: `/ride/publicTransportStations/get?id=${id}`,
		method: 'get',
	});
}

// 出行子系统后台-修改公共交通站点信息表
export function putPublicTransportStationsUpdateApi(params?: Object) {
	return request({
		url: `/ride/publicTransportStations/update`,
		method: 'put',
		data: params,
	});
}

// 出行子系统后台-分页查询地铁站信息
export function getSubwayStationPageApi(params?: Object) {
	return request({
		url: `/ride/subwayStation/page`,
		method: 'get',
		params,
	});
}

// 出行子系统后台-通过id查询地铁站信息
export function getSubwayStationGetApi(id: any) {
	return request({
		url: `/ride/subwayStation/gett?id=${id}`,
		method: 'get',
	});
}
// 出行子系统后台-修改地铁站站内图
export function putSubwayStationUpdateMapApi(params?: Object) {
	return request({
		url: `/ride/subwayStation/updateMap`,
		method: 'put',
		data: params,
	});
}
// 出行子系统后台-通过id逻辑删除地铁站信息表
export function putSubwayStationDelMapApi(id: any) {
	return request({
		url: `/ride/subwayStation/del?id=${id}`,
		method: 'delete',
	});
}
// 出行子系统后台-新增地铁站信息
export function postSubwayStationAddApi(params?: Object) {
	return request({
		url: `/ride/subwayStation/add`,
		method: 'post',
		data: params,
	});
}

// 出行子系统后台-修改地铁站信息
export function putSubwayStationUpdateApi(params?: Object) {
	return request({
		url: `/ride/subwayStation/update`,
		method: 'put',
		data: params,
	});
}

// 出行子系统后台-通过id查询地铁站信息
export function gettSubwayStationGetApi(id: any) {
	return request({
		url: `/ride/subwayStation/get?id=${id}`,
		method: 'get',
	});
}

// 出行子系统后台-分页查询地铁站点周边数据维护信息表
export function gettSubwayStationAroundPageApi(params?: Object) {
	return request({
		url: `/ride/subwayStationAround/page`,
		method: 'get',
		params,
	});
}

// 出行子系统后台-通过id查询
export function gettSubwayStationAroundGetApi(id: any) {
	return request({
		url: `/ride/subwayStationAround/get?id=${id}`,
		method: 'get',
	});
}
// 出行子系统后台-通过id逻辑删除地铁站点周边数据维护信息表
export function putSubwayStationAroundDelMapApi(id: any) {
	return request({
		url: `/ride/subwayStationAround/del?id=${id}`,
		method: 'delete',
	});
}
// 出行子系统后台-修改地铁站点周边数据维护信息表
export function putSubwayStationAroundUpdateApi(params?: Object) {
	return request({
		url: `/ride/subwayStationAround/update`,
		method: 'put',
		data: params,
	});
}
// 出行子系统后台-公共交通站点管理同步高德热数据
export function postSyncPublicStationsApi(params?: Object) {
	return request({
		url: `/ride/sync/stations/sync/publicStations`,
		method: 'post',
		params,
	});
}

// 出行子系统后台-地铁站点周边设施同步高德热数据
export function postSyncSubwayStationAroundApi(params?: Object) {
	return request({
		url: `/ride/sync/stations/sync/subwayStationAround`,
		method: 'post',
		params,
	});
}

// 根据ipoCode拉取单个公共交通站点信息热数据回显
export function getStationDetailApi(ipoCode: any) {
	return request({
		url: `/ride/sync/stations/stationDetail/${ipoCode}`,
		method: 'get',
	});
}

// 根据ipoCode拉取单个地铁站周边设施信息热数据回显
export function getAroundDetailApi(ipoCode: any) {
	return request({
		url: `/ride/sync/stations/aroundDetail/${ipoCode}`,
		method: 'get',
	});
}

