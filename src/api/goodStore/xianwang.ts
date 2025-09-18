import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 联名卡
export function cardUserList(params?: object) {
	return request({
		url: prefix + '/car_org_user/page',
		method: 'get',
		params,
	});
}
// 删除
export const delCard = (id: String) => {
	return request({
		url: `${prefix}/car_org_user/del?id=${id}`,
		method: 'delete',
	});
};
// 联名卡机构
export function cardOrgList(params?: object) {
	return request({
		url: prefix + '/car_org/page',
		method: 'get',
		params,
	});
}
// 新增
export function addCardOrg(data: object) {
	return request({
		url: prefix + '/car_org/add',
		method: 'post',
		data,
	});
}
// 编辑
export function editCardOrg(data: object) {
	return request({
		url: prefix + '/car_org/update',
		method: 'put',
		data,
	});
}
// 删除
export const delCardOrg = (id: String) => {
	return request({
		url: `${prefix}/car_org/del?id=${id}`,
		method: 'delete',
	});
};
// 标签管理
export function tagList(params?: object) {
	return request({
		url: prefix + '/tag_manage/page',
		method: 'get',
		params,
	});
}
// 新增标签
export function addTag(data: object) {
	return request({
		url: prefix + '/tag_manage/add',
		method: 'post',
		data,
	});
}
// 修改标签
export function editTag(data: object) {
	return request({
		url: prefix + '/tag_manage/update',
		method: 'put',
		data,
	});
}
// 删除标签
export const delTag = (id: String) => {
	return request({
		url: `${prefix}/tag_manage/del?id=${id}`,
		method: 'delete',
	});
}