import request from '/@/utils/request';
// 公共前缀
const prefix = '';

// 商品分组 -> 列表查询
export function getGoodsGroupList(params?: object) {
	return request({
		url: prefix + '',
		method: 'get',
		params,
	});
}
// 商品分组 -> 启用/禁用分组
// 商品分组 -> 新增分组
// 商品分组 -> 更新分组
// 商品分组 -> 删除指定分组
// 商品分组 -> 关联选中商品

// // 批量上架
// export function batchUp(params?: object) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/product/batch/up',
// 		method: 'post',
// 		data: params,
// 	});
// }

// // 批量下架
// export function batchDown(params?: object) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/product/batch/down',
// 		method: 'post',
// 		data: params,
// 	});
// }

// // 批量删除
// export function batchRecycle(params?: object) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/product/batch/delete',
// 		method: 'post',
// 		data: params,
// 	});
// }

// // 获取商品详情
// export function productInfo(ids?: string) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/product/info/' + ids,
// 		method: 'get',
// 	});
// }

// // 修改排序
// export function updateSort(params?: object) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/product/updateSort',
// 		method: 'post',
// 		data: params,
// 	});
// }

// // 分租下拉
// export function groupList(params?: object) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/plat/product/brand/cache/list',
// 		method: 'get',
// 		params,
// 	});
// }

// // 商品修改
// export function updateGoods(params?: object) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/product/newUpdate',
// 		method: 'post',
// 		data: params,
// 	});
// }

// // 刷新第三方拉取商品
// export function refreshList(params?: object) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/product/refresh',
// 		method: 'get',
// 		params,
// 	});
// }

// // 刷新时间
// export function getRefreshTime(params?: object) {
// 	return request({
// 		url: prefix + '/api/admin/merchant/product/getRefreshTime',
// 		method: 'get',
// 		params,
// 	});
// }
