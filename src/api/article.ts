import request from '/@/utils/request';

/**
 * 删除文章
 * @param id
 * @constructor
 */
export function DelArticle(id: any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/article/delete/${id}`,
		method: 'post',
	});
}

/**
 * 文章详情
 * @param id
 * @constructor
 */
export function InfoArticle(id: any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/article/info/${id}`,
		method: 'get',
	});
}

/**
 * 文章列表
 * @param pram
 * @constructor
 */
export function ListArticle(pram: any) {
	const data = {
		author: pram.author,
		cid: pram.cid,
		page: pram.page,
		limit: pram.limit,
		title: pram.title,
	};
	return request({
		url: '/tracomps-admin/api/admin/platform/article/list',
		method: 'GET',
		params: data,
	});
}

/**
 * 新增文章
 * @param pram
 * @constructor
 */
export function AddArticle(pram: any) {
	const data = {
		author: pram.author,
		cid: pram.cid,
		content: pram.content,
		cover: pram.cover,
		isBanner: pram.isBanner,
		isHot: pram.isHot,
		sort: pram.sort,
		synopsis: pram.synopsis,
		title: pram.title,
		url: pram.url,
	};
	return request({
		url: '/tracomps-admin/api/admin/platform/article/save',
		method: 'post',
		data: data,
	});
}

/**
 * 更新文章
 * @param pram
 * @constructor
 */
export function UpdateArticle(pram: any) {
	const data = {
		author: pram.author,
		cid: pram.cid,
		content: pram.content,
		cover: pram.cover,
		isBanner: pram.isBanner,
		isHot: pram.isHot,
		sort: pram.sort,
		synopsis: pram.synopsis,
		title: pram.title,
		id: pram.id,
	};
	return request({
		url: '/tracomps-admin/api/admin/platform/article/update',
		method: 'post',
		data,
	});
}

/**
 * 新增文章分类
 * @param data
 * @constructor
 */
export function articleCategoryAddApi(data: any) {
	return request({
		url: '/tracomps-admin/api/admin/platform/article/category/add',
		method: 'post',
		data,
	});
}

/**
 * 删除文章分类
 * @param data
 * @constructor
 */
export function articleCategoryDelApi(row: any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/article/category/delete/${row.id}`,
		method: 'post',
	});
}

/**
 * 文章分类分页列表
 * @constructor
 */
export function articleCategoryListApi() {
	return request({
		url: `/tracomps-admin/api/admin/platform/article/category/list`,
		method: 'get',
	});
}

/**
 * 修改文章分类
 * @param data
 * @constructor
 */
export function articleCategoryUpdateApi(data: any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/article/category/update`,
		method: 'post',
		data,
	});
}

/**
 * 文章开关
 * @param data
 */
export function articleSwitchApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/article/switch/${id}`,
		method: 'post',
	});
}

/**
 * 文章分类开关
 * @param data
 */
export function articleCategorySwitchApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/article/category/switch/${id}`,
		method: 'post',
	});
}
