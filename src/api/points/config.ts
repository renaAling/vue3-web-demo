import request from '/@/utils/request';
// 渠道列表
export const pageList = (params?: Object) => {
	return request({
		url: '/score/channel/page',
		method: 'get',
		params,
	});
};

// 新增渠道
export const channelAdd = (params?: Object) => {
	return request({
		url: '/score/channel/add',
		method: 'post',
		data: params,
	});
};

// 修改渠道状态
export const channelUpdateStatus = (params?: Object) => {
	return request({
		url: '/score/channel/updateStatus',
		method: 'post',
		data: params,
	});
};

// 事件列表
export const eventPageList = (params?: Object) => {
	return request({
		url: '/score/event/page',
		method: 'get',
		params,
	});
};

// 新增事件
export const eventAdd = (params?: Object) => {
	return request({
		url: '/score/event/add',
		method: 'post',
		data: params,
	});
};

// 修改事件状态
export const eventUpdateStatus = (params?: Object) => {
	return request({
		url: '/score/event/updateStatus',
		method: 'post',
		data: params,
	});
};
