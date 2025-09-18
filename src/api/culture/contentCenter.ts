import request from '/@/utils/request';
const prefix = '/tracomps-admin';

//频道查询
export function channelPage(params?: Object) {
	return request({
		url: prefix + '/api/admin/newsColumn/page',
		method: 'get',
		params,
	});
}
// 频道排序
export function channelSequence(data?: Object) {
	return request({
		url: prefix + '/api/admin/newsColumn/updateSequence',
		method: 'put',
		data,
	});
}

// 删除频道
export function delChannel(params?: Object) {
	return request({
		url: prefix + '/api/admin/newsColumn/del',
		method: 'delete',
		params,
	});
}
// 编辑频道
export function updateChannel(data?: Object) {
	return request({
		url: prefix + '/api/admin/newsColumn/update',
		method: 'put',
		data,
	});
}

// 新增频道
export function addChannel(data?: Object) {
	return request({
		url: prefix + '/api/admin/newsColumn/add',
		method: 'post',
		data,
	});
}

//频道详情
export function channelDetail(params?: Object) {
	return request({
		url: prefix + '/api/admin/newsColumn/get',
		method: 'get',
		params,
	});
}

// 删除内容
export function delContent(params?: Object) {
	return request({
		url: prefix + '/api/admin/newsArticle/del',
		method: 'delete',
		params,
	});
}

//内容查询
export function contentPage(params?: Object) {
	return request({
		url: prefix + '/api/admin/newsArticle/page',
		method: 'get',
		params,
	});
}
// 内容排序
export function contentSequence(data?: Object) {
	return request({
		url: prefix + '/api/admin/newsArticle/updateSequence',
		method: 'put',
		data,
	});
}

//自有商城后台-上下架文章
export function updateArticleStatus(data?: Object) {
	return request({
		url: prefix + '/api/admin/newsArticle/publish',
		method: 'put',
		data,
	});
}

// 自有商城后台-查询文章用-栏目下拉列表
export function searchParamsAllChannel() {
	return request({
		url: prefix + '/api/admin/newsColumn/getAllColumns',
		method: 'get',
	});
}
// 新增内容
export function addContent(data?: Object) {
	return request({
		url: prefix + '/api/admin/newsArticle/add',
		method: 'post',
		data,
	});
}
//自有商城后台-通过id查询文章内容信息表
export function contentDetail(params?: Object) {
	return request({
		url: prefix + '/api/admin/newsArticle/get',
		method: 'get',
		params,
	});
}
// 自有商城后台-修改文章内容信息表
export function updateContent(data?: Object) {
	return request({
		url: prefix+'/api/admin/newsArticle/update',
		method: 'put',
		data,
	});
}

// 自有商城后台-新增文章用-栏目下拉列表
export function getUpdateArticleChannelList() {
	return request({
		url: prefix + '/api/admin/newsColumn/getColumns',
		method: 'get',
	});
}
