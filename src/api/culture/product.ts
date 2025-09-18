import request from '/@/utils/request';

const isMerchant = import.meta.env.VITE_IS_MERCHANT;
console.log('isMerchant==============', isMerchant)
/**
 * 商品详情
 * @param pram
 */
export function productDetailApi(id:any) {
	const url = isMerchant 
	? `/tracomps-admin/api/admin/merchant/product/getInfo/${id}` 
	: `/tracomps-admin/api/admin/platform/product/info/${id}`;
	return request({
		url,
		method: 'GET',
	});
}

/**
 * 删除商品
 * @param pram
 */
export function productDeleteApi(id:any, type:any) {
	return request({
		url: `/tracomps-admin/api/admin/store/product/delete/${id}`,
		method: 'get',
		params: { type: type },
	});
}

/**
 * 商品列表 表头数量
 */
export function productHeadersApi(params: object) {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/tabs/headers' 
	: '/tracomps-admin/api/admin/platform/product/tabs/headers';
	return request({
		url,
		method: 'GET',
		params,
	});
}

/**
 * 商品列表
 * @param pram
 */
export function productLstApi(params:object) {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/list' 
	: '/tracomps-admin/api/admin/platform/product/list';
	return request({
		url,
		method: 'GET',
		params,
	});
}

/**
 * 商品审核
 * @param pram
 */
export function productAuditApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/audit`,
		method: 'post',
		data:params,
	});
}

/**
 * 修改虚拟销量
 * @param pram
 */
export function onChangeSalesApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/virtual/sales`,
		method: 'post',
		data:params,
	});
}

/**
 * 商品分类 分类缓存树
 * @param pram
 */
export function productCategoryApi() {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/category/cache/tree',
		method: 'GET',
	});
}
/**
 * 商品分类 列表
 * @param pram
 */
export function productCategoryListApi(params:object) {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/store/product/category/list' 
	: '/tracomps-admin/api/admin/platform/product/category/list';
	return request({
		url,
		method: 'GET',
		params,
	});
}
/**
 * 商品分类 新增
 * @param pram
 */
export function productCategoryAddApi(params:object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/category/add',
		method: 'post',
		data:params,
	});
}
/**
 * 商品分类 编辑
 * @param pram
 */
export function productCategoryUpdateApi(params:object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/category/update',
		method: 'post',
		data:params,
	});
}
/**
 * 商品分类 删除
 * @param pram
 */
export function productCategoryDeleteApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/category/delete/${id}`,
		method: 'post',
	});
}
/**
 * 商品分类 修改分类显示状态
 * @param pram
 */
export function productCategoryShowApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/category/update/show/${id}`,
		method: 'post',
	});
}

/**
 * 商品上架
 * @param pram
 */
export function putOnShellApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/store/product/putOnShell/${id}`,
		method: 'GET',
	});
}
/**
 * 商品强制下架
 * @param pram
 */
export function offShellApi(params:object) {
	const  url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/batch/down' 
	: '/tracomps-admin/api/admin/platform/product/force/down';
	return request({
		url,
		method: 'post',
		data:params,
	});
}

/**
 * 商品上架
 * @param pram
 */
export function onShellApi(params:object) {
	const  url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/batch/up' 
	: '/tracomps-admin/api/admin/platform/product/batch/up';
	return request({
		url,
		method: 'post',
		data:params,
	});
}

/**
 * 商品评论 列表
 * @param pram
 */
export function replyListApi(params:object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/reply/list',
		method: 'GET',
		params,
	});
}
/**
 * 商品评论 新增
 * @param pram
 */
export function replyCreatApi(params:object) {
	return request({
		url: '/tracomps-admin/api/admin/store/product/reply/save',
		method: 'POST',
		data:params,
	});
}
/**
 * 商品评论 编辑
 * @param pram
 */
export function replyEditApi(params:object) {
	return request({
		url: '/tracomps-admin/api/admin/store/product/reply/update',
		method: 'POST',
		data:params,
	});
}
/**
 * 商品评论 详情
 * @param pram
 */
export function replyInfoApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/store/product/reply/info/${id}`,
		method: 'GET',
	});
}
/**
 * 商品评论 删除
 * @param pram
 */
export function replyDeleteApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/reply/delete/${id}`,
		method: 'GET',
	});
}

/**
 * 商品评论 导出
 * @param pram
 */
export function productExportApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/export/excel/product`,
		method: 'get',
		params,
	});
}

/**
 * 商品复制 99Api
 * @param pram
 */
export function importProductApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/store/product/importProduct`,
		method: 'post',
		params,
	});
}

/**
 * 商品复制 一号通
 * @param pram
 */
export function copyProductApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/store/product/copy/product`,
		method: 'post',
		data:params,
	});
}

/**
 * 商品列表 导出
 * @param pram
 */
export function productExcelApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/export/excel/product`,
		method: 'get',
		params,
	});
}

/**
 * 商品列表 获取复制商品配置
 * @param pram
 */
export function copyConfigApi() {
	return request({
		url: `/tracomps-admin/api/admin/store/product/copy/config`,
		method: 'post',
	});
}

/**
 * 订单数据 导出
 * @param pram
 */
export function orderExcelApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/export/excel/order`,
		method: 'get',
		params,
	});
}

/**
 * 品牌 列表
 * @param pram
 */
export function brandListApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/list`,
		method: 'get',
		params,
	});
}

/**
 * 品牌缓存列表(全部)
 * @param pram
 */
export function brandListAllApi() {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/cache/list`,
		method: 'get',
	});
}

/**
 * 品牌 新增
 * @param pram
 */
export function brandAddApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/add`,
		method: 'post',
		data:params,
	});
}

/**
 * 品牌 编辑
 * @param pram
 */
export function brandUpdateApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/update`,
		method: 'post',
		data:params,
	});
}

/**
 * 品牌 删除
 * @param pram
 */
export function brandDeleteApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/delete/${id}`,
		method: 'post',
	});
}

/**
 * 品牌 修改品牌显示状态
 * @param pram
 */
export function brandShowApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/update/show/${id}`,
		method: 'post',
	});
}

/**
 * 保障服务 列表
 * @param pram
 */
export function guaranteeListApi(params?:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/list`,
		method: 'get',
		params,
	});
}

/**
 * 保障服务 新增
 * @param pram
 */
export function guaranteeAddApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/add`,
		method: 'post',
		data:params,
	});
}

/**
 * 保障服务 编辑
 * @param pram
 */
export function guaranteeUpdateApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/update`,
		method: 'post',
		data:params,
	});
}

/**
 * 保障服务 删除
 * @param pram
 */
export function guaranteeDeleteApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/delete/${id}`,
		method: 'post',
	});
}

/**
 * 保障服务 修改品牌显示状态
 * @param pram
 */
export function guaranteeShowApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/update/show/${id}`,
		method: 'post',
	});
}

/**
 * 修改商品
 * @param pram
 */
export function updateProductApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/update`,
		method: 'post',
		data:params,
	});
}

/**
 * 商品可用优惠券列表
 * @param pram
 */
export function productCouponListApi() {
	return request({
		url: '/tracomps-admin/api/admin/platform/coupon/product/usable/list',
		method: 'get',
	});
}

/**
 * 商品搜索分页列表（活动）
 * @param pram
 */
export function productActivityListApi(params:object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/activity/search/page',
		method: 'get',
		params,
	});
}

/**
 * 根据商品id集合查询商品列表
 * @param pram
 */
export function productListbyidsApi(ids:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/listbyids/${ids}`,
		method: 'get',
	});
}

/**
 * 商品标签列表
 * @param params 查询参数
 * @returns {*} 查询结果
 */
export function productTagListApi(params:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/list`,
		method: 'get',
		params: { ...params, keywords: encodeURI(params.keywords) },
	});
}

/**
 * 商品标签删除
 * @param id 待删除id
 * @returns {*}
 */
export function productTagDelete(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/delete/${id}`,
		method: 'get',
	});
}

/**
 * 商品标签详情
 * @param id
 * @returns {*}
 */
export function productTagInfoApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/info/${id}`,
		method: 'get',
	});
}

/**
 * 新增商品标签
 * @param data 待新增数据
 * @returns {*} 新增结果
 */
export function productTagAddApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/save`,
		method: 'post',
		data:params,
	});
}

/**
 * 编辑商品标签
 * @param data 待编辑数据
 * @returns {*} 新增结果
 */
export function productTagUpdateApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/update`,
		method: 'post',
		data:params,
	});
}

/**
 * 更新标签状态
 * @param id 标签id
 * @param status 标签状态
 * @returns {*}
 */
export function productTagStatusApi(id:any, status:any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/status/${id}/${status}`,
		method: 'get',
	});
}

/**
 * 平台端批量商品审核
 * @returns {*}
 */
export function productBatchAuditApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/batch/audit`,
		method: 'post',
		data:params,
	});
}

/**
 * 批量设置虚拟销量
 * @returns {*}
 */
export function productBatchVirtualSalesApi(params:object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/batch/set/virtual/sales`,
		method: 'post',
		data:params,
	});
}
/**
 * 新增商品
 * @param pram
 */
export function productCreateApi(params:object) {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/save' 
	: '/tracomps-admin/api/admin/platform/product/save';
	return request({
		url,
		method: 'POST',
		data:params,
	});
}

/**
 * 编辑商品
 * @param pram
 */
export function productUpdateApi(params:object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/platUpdate',
		method: 'POST',
		data:params,
	});
}
