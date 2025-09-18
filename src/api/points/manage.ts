import request from '/@/utils/request';
// 积分福利总览(按日期)-后台管理接口
export const dataOverview = (params?: Object) => {
	return request({
		url: '/score/statistics/dataOverview',
		method: 'get',
		params,
	});
};

// 积分福利总览(只看今日)-后台管理接口
export const dataOverviewByToday = (params?: Object) => {
	return request({
		url: '/score/statistics/dataOverviewByToday',
		method: 'get',
		params,
	});
};

// 积分福利发放总览
export const grantOverviewByToday = (params?: Object) => {
	return request({
		url: '/score/statistics/grantOverviewByToday',
		method: 'get',
		params,
	});
};

// 积分福利使用总览
export const deductionOverviewByToday = (params?: Object) => {
	return request({
		url: '/score/statistics/deductionOverviewByToday',
		method: 'get',
		params,
	});
};

// 积分福利用户列表查询
export const accountList = (params?: Object) => {
	return request({
		url: '/score/account/page',
		method: 'get',
		params,
	});
};

export const exportAccountPage = (params?: Object) => {
	return request({
		url: '/score/account/exportAccountPage',
		method: 'get',
		params,
	});
};

export const exportAccountPageFilter = (params?: Object) => {
	return request({
		url: '/score/account/exportAccountPageByFilter',
		method: 'get',
		params,
	});
};

// 用户状态切换
export const accountUpdateStatus = (params?: Object) => {
	return request({
		url: '/score/account/updateStatus',
		method: 'post',
		data: params,
	});
};

// 积分福利用户流水详情
export const accountDetailList = (params?: Object) => {
	return request({
		url: '/score/account/accountDetail',
		method: 'get',
		params,
	});
};

export const exportAccountDetail = (params?: Object) => {
	return request({
		url: '/score/account/exportAccountDetail',
		method: 'get',
		params,
	});
};

// 发放流水-后台接口
export const getGrantFlowList = (params?: Object) => {
	return request({
		url: '/score/score_welfare_account_log/getGrantFlow',
		method: 'get',
		params,
	});
};

// 发放流水-导出
export const exportGrantFlow = (params?: Object) => {
	return request({
		url: '/score/score_welfare_account_log/exportGrantFlow',
		method: 'get',
		params,
	});
};

// 使用流水-列表
export const getDeductionFlow = (params?: Object) => {
	return request({
		url: '/score/score_welfare_account_log/getDeductionFlow',
		method: 'get',
		params,
	});
};

// 使用流水-导出
export const exportDeductionFlow = (params?: Object) => {
	return request({
		url: '/score/score_welfare_account_log/exportDeductionFlow',
		method: 'get',
		params,
	});
};

// 根据用户信息查询
export const getUserInfoByUidMobile = (params?: Object) => {
	return request({
		url: '/uac/userCenter/getUserInfoByUidMobile',
		method: 'get',
		params,
	});
};

// 手动操作积分
export const manualGrant = (params?: Object) => {
	return request({
		url: '/score/event/manualGrant',
		method: 'post',
		data: params,
	});
};

// 渠道列表
export const channelList = (params?: Object) => {
	return request({
		url: '/score/channel/list',
		method: 'get',
		params,
	});
};

// 渠道名称联动事件接口
export const channelNameAndEventNameList = (params?: Object) => {
	return request({
		url: '/score/event/getEventNamesByChannel',
		method: 'get',
		params,
	});
};

// 平台消费使用规则查询
export const platformRuleList = () => {
	return request({
		url: '/score/usageConfig/list',
		method: 'get',
	});
};
// 平台消费使用规则编辑
export const platformRuleUpdate = (params?: Object) => {
	return request({
		url: '/score/usageConfig/update',
		method: 'put',
		data: params,
	});
};

// 积分使用分页查询
export const getTaskPage = (params?: Object) => {
	return request({
		url: '/score/welfare/task/page',
		method: 'get',
		params,
	});
};
// 新增积分福利子系统使用任务信息表
export const getTaskAdd = (params?: Object) => {
	return request({
		url: '/score/welfare/task/add',
		method: 'post',
		data: params,
	});
};
// 修改积分福利子系统使用任务信息表
export const getTaskUpdate = (params?: Object) => {
	return request({
		url: '/score/welfare/task/update',
		method: 'put',
		data: params,
	});
};

// 积分使用-通过id查询
export const getTaskGetApi = (id?: string) => {
	return request({
		url: `/score/welfare/task/get?id=${id}`,
		method: 'get',
	});
};

// 积分使用 -全局统一配置信息表-列表查询
export const getUsageConfigList = (params?: Object) => {
	return request({
		url: '/score/usageConfig/list',
		method: 'get',
		params,
	});
};

// 积分使用 -全局统一配置信息表-列表查询
export const getUsageConfigUpdate = (params?: Object) => {
	return request({
		url: '/score/usageConfig/update',
		method: 'put',
		data: params,
	});
};
