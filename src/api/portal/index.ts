import request from '/@/utils/request';
const prefix = '/admin/ups';

// 子系统列表
export function sysConfigList(params?: Object) {
	return request({
		url: '/uac/ups/subSystemConfig/getList',
		method: 'get',
		params,
	});
}
// 入口详情
export function entranceDetail(params?: Object) {
	return request({
		url: prefix + '/entrance/getById',
		method: 'get',
		params,
	});
}
// 新增分组
export function addEntrance(data?: Object) {
	return request({
		url: prefix + '/entrance/add',
		method: 'post',
		data,
	});
}
// 编辑入口
export function updateEntrance(data?: Object) {
	return request({
		url: prefix + '/entrance/update',
		method: 'put',
		data,
	});
}
// 入口列表
export function entranceList(params?: Object) {
	return request({
		url: prefix + '/entrance/page',
		method: 'get',
		params,
	});
}
// 入口列表排序
export function entranceSequence(data?: Object) {
	return request({
		url: prefix + '/entrance/updateSequence',
		method: 'put',
		data,
	});
}
// 入口启用
export function enabledEntrance(data?: Object) {
	return request({
		url: prefix + '/entrance/updateIsEnabled',
		method: 'put',
		data,
	});
}
// 入口删除
export function delEntrance(params?: Object) {
	return request({
		url: prefix + '/entrance/del',
		method: 'delete',
		params,
	});
}
// 入口权限校验
export function checkPermission(params?: Object) {
	return request({
		url: prefix + '/entrance/checkPermission',
		method: 'get',
		params,
	});
}
// 新增
export function addGroup(data?: Object) {
	return request({
		url: prefix + '/group/add',
		method: 'post',
		data,
	});
}
// 编辑
export function updateGroup(data?: Object) {
	return request({
		url: prefix + '/group/update',
		method: 'put',
		data,
	});
}
// 删除
export function delGroup(params?: Object) {
	return request({
		url: prefix + '/group/del',
		method: 'delete',
		params,
	});
}
// 更新顺序

export function updateSequence(data?: Object) {
	return request({
		url: prefix + '/group/updateSequence',
		method: 'put',
		data,
	});
}
// 列表
export function groupList(params?: Object) {
	return request({
		url: prefix + '/group/getList',
		method: 'get',
		params,
	});
}
//分组详情
export function groupDetail(params?: Object) {
	return request({
		url: prefix + '/group/getById',
		method: 'get',
		params,
	});
}
// 门户首页列表

export function getSysEntranceList(params?: Object) {
	return request({
		url: prefix + '/entrance/getSysEntrances',
		method: 'get',
		params,
	});
}
// 账户列表
export function getAccountPage(params?: Object) {
	return request({
		url: '/uac/ups/account/getAccountPage',
		method: 'get',
		params,
	});
}
// 新增
export function createAccount(data: Object) {
	return request({
		url: '/uac/ups/account/createAccount',
		method: 'post',
		data,
	});
}
export function updateAccount(data: Object) {
	return request({
		url: '/uac/ups/account/updateAccount',
		method: 'post',
		data,
	});
}
// 详情
export function getAccountDetails(params: Object) {
	return request({
		url: '/uac/ups/account/getAccountDetails',
		method: 'get',
		params,
	});
}
// 删除系统权限
export function delSysPermission(data: Object) {
	return request({
		url: '/uac/ups/account/delSysPermission',
		method: 'post',
		data,
	});
}
// 添加系统权限
export function addSysPermission(data: Object) {
	return request({
		url: '/uac/ups/account/addSysPermission',
		method: 'post',
		data,
	});
}
// 频道栏目
//频道查询
export function channelPage(params?: Object) {
	return request({
		url: prefix + '/ups_channel/page',
		method: 'get',
		params,
	});
}
export function allChannel(params?: Object) {
	return request({
		url: prefix + '/ups_channel/allChannel',
		method: 'get',
		params,
	});
}
// 新增频道
export function addChannel(data?: Object) {
	return request({
		url: prefix + '/ups_channel/add',
		method: 'post',
		data,
	});
}
// 编辑频道
export function updateChannel(data?: Object) {
	return request({
		url: prefix + '/ups_channel/update',
		method: 'put',
		data,
	});
}
// 删除频道
export function delChannel(params?: Object) {
	return request({
		url: prefix + '/ups_channel/del',
		method: 'delete',
		params,
	});
}
//频道详情
export function channelDetail(params?: Object) {
	return request({
		url: prefix + '/ups_channel/get',
		method: 'get',
		params,
	});
}
// 频道排序
export function channelSequence(data?: Object) {
	return request({
		url: prefix + '/ups_channel/updateSequence',
		method: 'put',
		data,
	});
}
// 查询频道栏目级联列表
export function getChannelCascadeList(params?: Object) {
	return request({
		url: prefix + '/ups_channel/getCascadeChannels',
		method: 'get',
		params,
	});
}
// 内容
//内容查询
export function contentPage(params?: Object) {
	return request({
		url: '/admin/ups_article/page',
		method: 'get',
		params,
	});
}
// 新增内容
export function addContent(data?: Object) {
	return request({
		url: '/admin/ups_article/add',
		method: 'post',
		data,
	});
}
// 编辑内容
export function updateContent(data?: Object) {
	return request({
		url: '/admin/ups_article/update',
		method: 'put',
		data,
	});
}
// 删除内容
export function delContent(params?: Object) {
	return request({
		url: '/admin/ups_article/del',
		method: 'delete',
		params,
	});
}
// 内容排序
export function contentSequence(data?: Object) {
	return request({
		url: '/admin/ups_article/updateSequence',
		method: 'put',
		data,
	});
}
//内容详情
export function contentDetail(params?: Object) {
	return request({
		url: '/admin/ups_article/get',
		method: 'get',
		params,
	});
}

//内容详情
export function updateArticleStatus(data?: Object) {
	return request({
		url: '/admin/ups_article/publish',
		method: 'put',
		data,
	});
}

// 首页文章

export function homePageArticle(params?: Object) {
	return request({
		url: '/admin/ups_article/homePageArticle',
		method: 'get',
		params,
	});
}

// 获取文章管理内栏目列表
export function searchParamsAllChannel() {
	return request({
		url: prefix + '/ups_channel/getAllChannel',
		method: 'get',
	});
}

// 获取新增文章内的栏目列表
export function getUpdateArticleChannelList() {
	return request({
		url: prefix + '/ups_channel/getChannel',
		method: 'get',
	});
}
// 授权头部列表
export function getAuthorizedHeaders(params?: Object) {
	return request({
		url: prefix + '/entrance/authorizedHeaders',
		method: 'get',
		params,
	});
}
// 已注册人员表
export function getAccountList(params?: Object) {
	return request({
		url: '/uac/ups/account/getAccountList',
		method: 'get',
		params,
	});
}
// 批量授权
export function batchSysPermission(data: Object) {
	return request({
		url: '/uac/ups/account/batchSysPermission',
		method: 'post',
		data,
	});
}

// 启用/停用账号
export function updateAccountStatus(data?: Object) {
	return request({
		url: '/uac/ups/account/updateAccountState',
		method: 'post',
		data,
	});
}

// 获取用户模式下的站内消息
export function getUserModeMessageList(query?: Object) {
	return request({
		url: '/admin/sysMessage/getPageByUser',
		method: 'get',
		params: query,
	});
}

// 用户模式-单条消息已读
export function readSingleMessage(msgId?: string) {
	return request({
		url: `/admin/sysMessage/readMark?msgId=${msgId}`,
		method: 'post',
	});
}

// 获取管理模式下的站内消息
export function getManageModeMessageList(query?: Object) {
	return request({
		url: '/admin/sysMessage/getPage',
		method: 'get',
		params: query,
	});
}

// 管理模式下的站内消息-新增消息
export function addMessage(data?: Object) {
	return request({
		url: '/admin/sysMessage/add',
		method: 'post',
		data,
	});
}

// 管理模式下的站内消息-编辑消息
export function updateMessage(data?: Object) {
	return request({
		url: '/admin/sysMessage/update',
		method: 'post',
		data,
	});
}

// 管理模式下的站内消息-消息详情
export function messageDetail(id?: string) {
	return request({
		url: `/admin/sysMessage/getMessageById?id=${id}`,
		method: 'get',
	});
}

// 管理模式下的站内消息-发布消息
export function publishMessage(data?: Object) {
	return request({
		url: `/admin/sysMessage/publish`,
		method: 'post',
		data,
	});
}

// 管理模式下的站内消息-删除消息
export function delMessage(id?: string) {
	return request({
		url: `/admin/sysMessage/del?id=${id}`,
		method: 'delete',
	});
}

// 用户模式下的站内消息-一键已读
export function readAllMessage() {
	return request({
		url: `/admin/sysMessage/readAll`,
		method: 'post',
	});
}

// 用户模式下的内容中心-获取栏目列表
export function getChannels() {
	return request({
		url: `/admin/ups/ups_channel/getChannel`,
		method: 'get',
	});
}

// 用户模式下的内容中心-获取指定栏目下的文章列表
export function getArticles(params?: Object) {
	return request({
		url: `/admin/ups_article/published`,
		method: 'get',
		params,
	});
}
// 子系统排序
export function updateSubSystemSequence(data?: Object) {
	return request({
		url: '/admin/ups/entrance/updateSequence',
		method: 'put',
		data,
	});
}
// 获取随机商户租户ID
export function getRandomTenantInfo() {
	return request({
		url: '/uac/ups/subSystemConfig/ownMall/tenantInfo',
		method: 'get',
	});
}
export function getOwnMallList() {
	return request({
		url: '/uac/ups/subSystemConfig/ownMall/getList',
		method: 'get',
	});
}