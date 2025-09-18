import request from '/@/utils/request';

// 商户详情同步
export function getNewInfo(data?: Object) {
	return request({
		url: `/note/store/fetchStationByPoiCodeInfo`,
		method: 'post',
    data
	});
}
// 出行子系统后台-下拉查询成都市行政区划表
export function getRegionCodeListApi() {
	return request({
		url: `/ride/region_code/getList`,
		method: 'get',
	});
}

// 下拉列表-查询地铁线路信息表
export function getSubwayLineListApi(name?: any) {
	return request({
		url: `/ride/subway_line/page?name=${name}`,
		method: 'get',
	});
}

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

// 商圈设置列表
export function getBusinessAreaPageApi(params?: Object) {
	return request({
		url: '/note/business/area/page',
		method: 'GET',
		params,
	});
}

// 设置半径
export function BusinessAreaOperationApi(data?: Object) {
	return request({
		url: '/note/business/area/operation/radius',
		method: 'POST',
		data,
	});
}

// 达人列表
export function getExpertPageApi(params?: Object) {
	return request({
		url: '/note/expert/page',
		method: 'GET',
		params,
	});
}

export function expertAddApi(data?: Object) {
	return request({
		url: '/note/expert/add',
		method: 'POST',
		data,
	});
}

// 根据手机号查询
export function getByMobileApi(mobile: string) {
	return request({
		url: `/uac/userChannel/getByMobile?mobile=${mobile}`,
		method: 'GET',
	});
}

export function expertUpdateStatusApi(data?: Object) {
	return request({
		url: '/note/expert/updateStatus',
		method: 'POST',
		data,
	});
}

// 达人日志列表
export function getExpertLogPageApi(params?: Object) {
	return request({
		url: '/note/expert/log/page',
		method: 'GET',
		params,
	});
}

// 粉丝分页
export function getUserFollowPageApi(params?: Object) {
	return request({
		url: '/note/user/follow/page',
		method: 'GET',
		params,
	});
}

// 笔记列表
export function getExpertNotesPageApi(params?: Object) {
	return request({
		url: '/note/expert/notes/page',
		method: 'GET',
		params,
	});
}

export function expertNotesStatusApi(data?: Object) {
	return request({
		url: '/note/expert/notes/update/openStatus',
		method: 'PUT',
		data,
	});
}

export function expertNotesDetailApi(code: string) {
	return request({
		url: `/note/expert/notes/detail?code=${code}`,
		method: 'GET',
	});
}

// 分页查询敏感词
export function getSensitivePageApi(params?: Object) {
	return request({
		url: '/note/sensitive/words/page',
		method: 'GET',
		params,
	});
}

export function sensitiveAddApi(data?: Object) {
	return request({
		url: '/note/sensitive/words/add',
		method: 'POST',
		data,
	});
}

export function sensitiveUpdateApi(data?: Object) {
	return request({
		url: '/note/sensitive/words/update',
		method: 'PUT',
		data,
	});
}

export function sensitiveWordsDelApi(id: any) {
	return request({
		url: `/note/sensitive/words/del?id=${id}`,
		method: 'DELETE',
	});
}

// 自动审核列表
export function automaticReviewPageApi(params?: Object) {
	return request({
		url: '/note/comment/automaticReviewPage',
		method: 'GET',
		params,
	});
}

export function commentDetailApi(id: string) {
	return request({
		url: `/note/comment/get?id=${id}`,
		method: 'GET',
	});
}

export function commentAuditApi(data?: Object) {
	return request({
		url: '/note/comment/audit',
		method: 'PUT',
		data,
	});
}

// 活动分页
export function activityPageApi(params?: Object) {
	return request({
		url: '/note/activity/page',
		method: 'GET',
		params,
	});
}

export function activityUpdateStatusApi(data?: Object) {
	return request({
		url: '/note/activity/updateStatus',
		method: 'PUT',
		data,
	});
}

export function activityAddApi(data?: Object) {
	return request({
		url: '/note/activity/add',
		method: 'POST',
		data,
	});
}

export function activityUpdateApi(data?: Object) {
	return request({
		url: '/note/activity/update',
		method: 'PUT',
		data,
	});
}

export function activityDetailApi(code: string) {
	return request({
		url: `/note/activity/get?code=${code}`,
		method: 'GET',
	});
}

// 报名列表
export function activityEnrollPageApi(params?: Object) {
	return request({
		url: '/note/activity/enroll/page',
		method: 'GET',
		params,
	});
}

// 活动统计
export function dailyStatisticsPageApi(params?: Object) {
	return request({
		url: '/note/daily/statistics/page',
		method: 'GET',
		params,
	});
}

// 活动评论
export function commentPageApi(params?: Object) {
	return request({
		url: '/note/comment/page',
		method: 'GET',
		params,
	});
}

export function commentUpdateShowApi(data?: Object) {
	return request({
		url: '/note/comment/updateShow',
		method: 'PUT',
		data,
	});
}

// 用户评论配置列表
export function userCommentPageApi(params?: Object) {
	return request({
		url: '/note/user/comment/config/page',
		method: 'GET',
		params,
	});
}

export function userCommentUpdateStatusApi(data?: Object) {
	return request({
		url: '/note/user/comment/config/updateStatus',
		method: 'PUT',
		data,
	});
}

export function userCommentDelApi(id: any) {
	return request({
		url: `/note/user/comment/config/del?id=${id}`,
		method: 'DELETE',
	});
}

export function userCommentAddApi(data?: Object) {
	return request({
		url: '/note/user/comment/config/add',
		method: 'POST',
		data,
	});
}

export function userCommentUpdateApi(data?: Object) {
	return request({
		url: '/note/user/comment/config/update',
		method: 'PUT',
		data,
	});
}

export function userCommentDetailApi(id: string) {
	return request({
		url: `/note/user/comment/config/get?id=${id}`,
		method: 'GET',
	});
}

// 达人评论
export function merchantCommentPageApi(params?: Object) {
	return request({
		url: '/note/comment/merchant/comment/page',
		method: 'GET',
		params,
	});
}

export function commentDelApi(id: any) {
	return request({
		url: `/note/comment/del?id=${id}`,
		method: 'DELETE',
	});
}

export function commentAddApi(data?: Object) {
	return request({
		url: '/note/comment/add',
		method: 'POST',
		data,
	});
}

// 获取用户评论配置
export function getCommentConfigApi() {
	return request({
		url: '/note/user/comment/config/getCommentConfig',
		method: 'GET',
	});
}

// 商户口碑
export function storePageApi(params?: Object) {
	return request({
		url: '/note/store/page',
		method: 'GET',
		params,
	});
}

// 获取所有地铁站
export function subwayStationApi(params?: Object) {
	return request({
		url: '/ride/subwayStation/getStations',
		method: 'GET',
		params,
	});
}

// 获取所有关联商家
export function getAreaStoreListApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/store/getAreaStoreList',
		method: 'GET',
		params,
	});
}

// 商户管理
export function getStorePageApi(params?: Object) {
	return request({
		url: '/note/store/page',
		method: 'GET',
		params,
	});
}

export function storeAddApi(data?: Object) {
	return request({
		url: '/note/store/add',
		method: 'POST',
		data,
	});
}

export function storeUpdateApi(data?: Object) {
	return request({
		url: '/note/store/updateByIpoCode',
		method: 'PUT',
		data,
	});
}

export function storeDetailApi(ipoCode: string) {
	return request({
		url: `/note/store/get?ipoCode=${ipoCode}`,
		method: 'GET',
	});
}

export function storeUpdateTopApi(data?: Object) {
	return request({
		url: '/note/store/updateTop',
		method: 'PUT',
		data,
	});
}

export function fetchStationByPoiCodeApi(data?: Object) {
	return request({
		url: '/note/store/fetchStationByPoiCode',
		method: 'POST',
		data,
	});
}

export function storeUpdateScoreApi(data?: Object) {
	return request({
		url: '/note/store/updateScore',
		method: 'PUT',
		data,
	});
}

// 安全统计
export function getRiskLogCountApi(params?: Object) {
	return request({
		url: '/note/risk/log/count',
		method: 'GET',
		params,
	});
}

export function getRiskLogSubwayApi(params?: Object) {
	return request({
		url: '/note/risk/log/subway/count',
		method: 'GET',
		params,
	});
}

export function getRiskListApi(params?: Object) {
	return request({
		url: '/note/risk/log/risk/list',
		method: 'GET',
		params,
	});
}

// 获取默认统一设置商圈范围
export function getAreaRadiusApi(params?: Object) {
	return request({
		url: '/note/business/area/radius',
		method: 'GET',
		params,
	});
}