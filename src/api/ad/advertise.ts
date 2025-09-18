import request from '/@/utils/request';
import { ApiResponse } from 'axios';

// 广告位管理分页查询接口
export function advertSpacePage(params?: Object) {
  return request({
    url: '/advertise/adSpace/page',
    method: 'GET',
    params,
  });
}

export function advertSpaceList(params?: Object) {
  return request({
    url: '/advertise/adSpace/getList',
    method: 'GET',
    params,
  });
}

export function adSpaceDetail(code?: string) {
	return request({
		url: '/advertise/adSpace/get',
		method: 'GET',
		params: { code },
	});
}

export function adSpaceUpdate(data?: Object) {
	return request({
		url: '/advertise/adSpace/update',
		method: 'PUT',
		data,
	});
}

// 广告投放
export function advertPublishPage(params?: Object) {
  return request({
    url: '/advertise/publish/page',
    method: 'GET',
    params,
  });
}

export function adPublishApply(data?: Object): Promise<ApiResponse> {
	return request({
		url: '/advertise/publish/apply',
		method: 'POST',
		data,
	});
}

export function adPublishUpdate(data?: Object): Promise<ApiResponse> {
	return request({
		url: '/advertise/publish/update',
		method: 'PUT',
		data,
	});
}

export function adPublishDetail(code?: string) {
	return request({
		url: '/advertise/publish/get',
		method: 'GET',
		params: { code },
	});
}

export function adUpdatePublishStatus(data?: Object) {
	return request({
		url: '/advertise/publish/updatePublishStatus',
		method: 'PUT',
		data,
	});
}

// 推送模型
export function advertPushModelPage(params?: Object) {
  return request({
    url: '/advertise/pushModel/page',
    method: 'GET',
    params,
  });
}
export function advertPushModelList(params?: Object) {
  return request({
    url: '/advertise/pushModel/getList',
    method: 'GET',
    params,
  });
}
export function adPushModelDetail(code?: string) {
	return request({
		url: '/advertise/pushModel/get',
		method: 'GET',
		params: { code },
	});
}

export function adPushModelAdd(data?: Object) {
	return request({
		url: '/advertise/pushModel/add',
		method: 'POST',
		data,
	});
}

export function adPushModelUpdate(data?: Object) {
	return request({
		url: '/advertise/pushModel/update',
		method: 'PUT',
		data,
	});
}

// 推送计划
export function advertPushPlanPage(params?: Object) {
  return request({
    url: '/advertise/pushPlan/page',
    method: 'GET',
    params,
  });
}
export function adPushPlanDetail(code?: string) {
	return request({
		url: '/advertise/pushPlan/get',
		method: 'GET',
		params: { code },
	});
}

export function adPushPlanAdd(data?: Object) {
	return request({
		url: '/advertise/pushPlan/add',
		method: 'POST',
		data,
	});
}

export function adPushPlanUpdate(data?: Object) {
	return request({
		url: '/advertise/pushPlan/update',
		method: 'PUT',
		data,
	});
}

// 素材管理-用户端根据文件id获取广告列表
export function getInfosByFileIds(params?: Object) {
  return request({
    url: '/advertise/publish/infosByFileIds',
    method: 'GET',
    params,
  });
}

// 广告统计
export function adSpaceStatistics(params?: Object) {
  return request({
    url: '/advertise/ad/event/track/adSpace/statistics',
    method: 'GET',
    params,
  });
}

export function adSpaceData(params?: Object) {
  return request({
    url: '/advertise/ad/event/track/adSpace/data',
    method: 'GET',
    params,
  });
}

export function adData(params?: Object) {
  return request({
    url: '/advertise/ad/event/track/ad/data',
    method: 'GET',
    params,
  });
}

export function homeStatistics(params?: Object) {
  return request({
    url: '/advertise/ad/event/track/homeStatistics',
    method: 'GET',
    params,
  });
}

// 后台-同步标签
export const adPublishRefresh = () => {
	return request({
		url: '/advertise/publish/refresh',
		method: 'GET',
	});
};