import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取库存管理列表
export function getInventoryList(params?: object) {
	return request({
		url: prefix + '/wdInventoryManage/page',
		method: 'get',
		params,
	});
}

// 获取库存明细详情
export function getInventoryDetail(logCode: string) {
	return request({
		url: prefix + `/wdInventoryManage/get?logCode=${logCode}`,
		method: 'get',
	});
}

// 获取对应门店的商品信息列表
export function getCurrentMerchantProducts(params?: object) {
	return request({
		url: prefix + '/wdSaleManageDetail/page',
		method: 'get',
		params,
	});
}

// 新增入库/出库记录
export function saveInOrOutInventoryRecords(data: object) {
	return request({
		url: prefix + '/wdInventoryManage/updateInventory',
		method: 'post',
		data,
	});
}

// /wdInventoryManage/updateInventory

// // 根据商家code查询对应商品列表
// export function getProductByMerchantCode(merchantCode?: string) {
// 	return request({
// 		url: prefix + `/wdProduct/getByMerchantCode?merchantCode=${merchantCode}`,
// 		method: 'get',
// 	});
// }

// // 获取对应商品库存信息
// export function getCurrentProductInfoList(spuCode?: string) {
// 	return request({
// 		url: prefix + `/wdProductSku/getSkuBySpuCode?spuCode=${spuCode}`,
// 		method: 'get',
// 	});
// }

// // 发布商品
// export function publishProducts(data?: object) {
// 	return request({
// 		url: prefix + '/wdSaleManage/publish',
// 		method: 'post',
// 		data,
// 	});
// }

// // 删除指定商品
// export function delProduct(saleCode: string) {
// 	return request({
// 		url: prefix + `/wdSaleManage/del?saleCode=${saleCode}`,
// 		method: 'delete',
// 	});
// }

// // 更新上/下架状态
// export function updateStatus(data: object) {
// 	return request({
// 		url: prefix + '/wdSaleManage/updateStatus',
// 		method: 'post',
// 		data,
// 	});
// }

// // 批量更新上/下架状态
// export function batchUpdateStatus(data: object) {
// 	return request({
// 		url: prefix + '/wdSaleManage/updateStatusBatch',
// 		method: 'post',
// 		data,
// 	});
// }

// // 批量删除
// export function batchDelete(data: object) {
// 	return request({
// 		url: prefix + `/wdSaleManage/delBatch`,
// 		method: 'post',
// 		data,
// 	});
// }
