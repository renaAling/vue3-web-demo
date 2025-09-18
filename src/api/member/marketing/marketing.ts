import request from '/@/utils/request';

// 分页查询会员系统营销模板信息表
export const pageMemberMarketingTemplatePage = (params?: Object) => {
	return request({
		url: '/uac/memberMarketingTemplate/page',
		method: 'get',
		params,
	});
};

// 新增会员系统营销模板信息表
export const postMemberMarketingTemplateAddApi = (params?: Object) => {
	return request({
		url: '/uac/memberMarketingTemplate/add',
		method: 'post',
		data: params,
	});
};

// 修改会员系统营销模板信息表
export const putMemberMarketingTemplateUpdateApi = (params?: Object) => {
	return request({
		url: '/uac/memberMarketingTemplate/update',
		method: 'put',
		data: params,
	});
};

// 分页查询会员营销推送通知信息记录表-推送类型：1:自动推送2:手动推送
export const pageMemberMarketingPushLogPage = (params?: Object) => {
	return request({
		url: '/uac/memberMarketingPushLog/page',
		method: 'get',
		params,
	});
};

// 新增会员手动营销推送
export const postMemberMarketingPushLogAdd = (params?: Object) => {
	return request({
		url: '/uac/memberMarketingPushLog/add',
		method: 'post',
		data: params,
	});
};

// 通过id查看会员营销推送通知信息记录表
export const pageMemberMarketingPushLogGetApi = (id?: string) => {
	return request({
		url: `/uac/memberMarketingPushLog/get?id=${id}`,
		method: 'get',
	});
};

// 支持模糊查询获取所有会员标签(绑定会员下拉使用)
export const getMemberSignListaApi = (params?: Object) => {
	return request({
		url: `/uac/memberSign/getList`,
		method: 'get',
		params,
	});
};

// 支持模糊查询获取所有会员分组(绑定会员下拉使用)
export const getMemberGroupListApi = (params?: Object) => {
	return request({
		url: `/uac/memberGroup/getList`,
		method: 'get',
		params,
	});
};

// 下拉查询会员系统营销模板信息表
export const getMemberMarketingTemplateApi = (params?: Object) => {
	return request({
		url: `/uac/memberMarketingTemplate/getList`,
		method: 'get',
		params,
	});
};

// 下载手动推送日志-推送日志ID要传-pushType传1
// export const pageMemberMarketingPushLogExport = (params?: Object) => {
// 	return request({
// 		url: '/uac/memberMarketingPushLog/export',
// 		method: 'get',
// 		params,
// 	});
// };
