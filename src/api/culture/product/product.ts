import request from '/@/utils/request';
const isMerchant = import.meta.env.VITE_IS_MERCHANT;
console.log('isMerchant', isMerchant)

// 定义通用分页参数接口
interface PaginationParams {
	page?: number;
	limit?: number;
}

// 商品详情接口返回值类型
interface ProductDetail {
	id: number;
	name: string;
	price: number;
	stock: number;
	// 根据实际接口返回字段补充
}

// 商品列表表头数量接口返回值类型
interface HeaderItem {
	count: number;
	type: string;
	title: string;
}

// 品牌列表接口返回值类型
interface BrandItem {
	id: number;
	name: string;
	logo: string;
	status: boolean;
	// 根据实际接口返回字段补充
}

// 商品分类树节点类型
interface CategoryTreeNode {
	id: number;
	name: string;
	parentId: number;
	children?: CategoryTreeNode[];
}

// 保障服务列表接口返回值类型
interface GuaranteeItem {
	id: number;
	name: string;
	description: string;
	status: boolean;
	// 根据实际接口返回字段补充
}

// 商品标签列表接口返回值类型
interface ProductTagItem {
	id: number;
	name: string;
	status: boolean;
	// 根据实际接口返回字段补充
}

/**
 * 商品详情
 * @param id - 商品ID
 */
export function productDetailApi(id: number): Promise<ProductDetail> {
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
 * @param id - 商品ID
 * @param type - 删除类型
 */
export function productDeleteApi(id: number, type: string): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/store/product/delete/${id}`,
		method: 'get',
		params: { type },
	});
}

/**
 * 商品列表 表头数量
 * @param params - 查询参数
 */
export function productHeadersApi(params: Record<string, any>): Promise<HeaderItem[]> {
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
 * @param params - 查询参数
 */
export function productLstApi(params: PaginationParams & Record<string, any>): Promise<any> {
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
 * @param data - 审核数据
 */
export function productAuditApi(data: Record<string, any>): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/audit`,
		method: 'post',
		data,
	});
}

/**
 * 修改虚拟销量
 * @param data - 销量数据
 */
export function onChangeSalesApi(data: { id: number; virtualSales: number }): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/virtual/sales`,
		method: 'post',
		data,
	});
}

/**
 * 商品分类 分类缓存树
 */
export function productCategoryApi(): Promise<CategoryTreeNode[]> {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/plat/product/category/cache/tree' 
	: '/tracomps-admin/api/admin/platform/product/category/cache/tree';
	return request({
		url,
		method: 'GET',
	});
}

/**
 * 商品分类 列表
 * @param params - 查询参数
 */
export function productCategoryListApi() {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/store/product/category/list' 
	: '/tracomps-admin/api/admin/platform/product/category/list';
	return request({
		url,
		method: 'GET',
	});
}

/**
 * 商品分类 新增
 * @param data - 分类数据
 */
export function productCategoryAddApi(data: { name: string; parentId: number }): Promise<any> {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/store/product/category/add' 
	: '/tracomps-admin/api/admin/platform/product/category/add';
	return request({
		url,
		method: 'post',
		data,
	});
}

/**
 * 商品分类 编辑
 * @param data - 分类数据
 */
export function productCategoryUpdateApi(data: { id: number; name: string }): Promise<any> {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/store/product/category/update' 
	: '/tracomps-admin/api/admin/platform/product/category/update';
	return request({
		url,
		method: 'post',
		data,
	});
}

/**
 * 商品分类 删除
 * @param id - 分类ID
 */
export function productCategoryDeleteApi(id: number): Promise<any> {
	const url = isMerchant 
	? `/tracomps-admin/api/admin/merchant/store/product/category/delete/${id}` 
	: `/tracomps-admin/api/admin/platform/product/category/delete/${id}`;
	return request({
		url,
		method: 'post',
	});
}

/**
 * 商品分类 修改分类显示状态
 * @param id - 分类ID
 */
export function productCategoryShowApi(id: number): Promise<any> {
	const url = isMerchant 
	? `/tracomps-admin/api/admin/merchant/store/product/category/update/show/${id}` 
	: `/tracomps-admin/api/admin/platform/product/category/update/show/${id}`;
	return request({
		url,
		method: 'post',
	});
}

/**
 * 商品上架
 * @param id - 商品ID
 */
export function putOnShellApi(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/store/product/putOnShell/${id}`,
		method: 'GET',
	});
}

/**
 * 商品强制下架
 * @param data - 下架数据
 */
export function offShellApi(data: { idList: string }): Promise<any> {
	const  url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/batch/down' 
	: '/tracomps-admin/api/admin/platform/product/force/down';
	return request({
		url,
		method: 'post',
		data,
	});
}

/**
 * 商品批量上架
 * @param data - 上架数据
 */
export function onShellApi(data: { idList: string }): Promise<any> {
	const  url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/batch/up' 
	: '/tracomps-admin/api/admin/platform/product/batch/up';
	return request({
		url,
		method: 'post',
		data,
	});
}

/**
 * 商品评论 列表
 * @param params - 查询参数
 */
export function replyListApi(params: PaginationParams & Record<string, any>): Promise<any> {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/reply/list',
		method: 'GET',
		params,
	});
}

/**
 * 商品评论 新增
 * @param data - 评论数据
 */
export function replyCreatApi(data: Record<string, any>): Promise<any> {
	return request({
		url: '/tracomps-admin/api/admin/store/product/reply/save',
		method: 'POST',
		data,
	});
}

/**
 * 商品评论 编辑
 * @param data - 评论数据
 */
export function replyEditApi(data: Record<string, any>): Promise<any> {
	return request({
		url: '/tracomps-admin/api/admin/store/product/reply/update',
		method: 'POST',
		data,
	});
}

/**
 * 商品评论 详情
 * @param id - 评论ID
 */
export function replyInfoApi(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/store/product/reply/info/${id}`,
		method: 'GET',
	});
}

/**
 * 商品评论 删除
 * @param id - 评论ID
 */
export function replyDeleteApi(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/reply/delete/${id}`,
		method: 'GET',
	});
}

/**
 * 商品评论 导出
 * @param params - 导出参数
 */
export function productExportApi(params: Record<string, any>): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/export/excel/product`,
		method: 'get',
		params,
	});
}

/**
 * 商品复制 99Api
 * @param params - 复制参数
 */
export function importProductApi(params: Record<string, any>): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/store/product/importProduct`,
		method: 'post',
		params,
	});
}

/**
 * 商品复制 一号通
 * @param data - 复制数据
 */
export function copyProductApi(data: Record<string, any>): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/store/product/copy/product`,
		method: 'post',
		data,
	});
}

/**
 * 商品列表 导出
 * @param params - 导出参数
 */
export function productExcelApi(params: Record<string, any>): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/export/excel/product`,
		method: 'get',
		params,
	});
}

/**
 * 商品列表 获取复制商品配置
 */
export function copyConfigApi(): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/store/product/copy/config`,
		method: 'post',
	});
}

/**
 * 订单数据 导出
 * @param params - 导出参数
 */
export function orderExcelApi(params: Record<string, any>): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/export/excel/order`,
		method: 'get',
		params,
	});
}

/**
 * 品牌 列表
 * @param params - 查询参数
 */
export function brandListApi(params: PaginationParams & Record<string, any>): Promise<BrandItem[]> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/list`,
		method: 'get',
		params,
	});
}

/**
 * 品牌缓存列表(全部)
 */
export function brandListAllApi(): Promise<BrandItem[]> {
	const url = isMerchant 
	? `/tracomps-admin/api/admin/merchant/plat/product/brand/cache/list` 
	: `/tracomps-admin/api/admin/platform/product/brand/cache/list`;
	return request({
		url,
		method: 'get',
	});
}

/**
 * 品牌 新增
 * @param data - 品牌数据
 */
export function brandAddApi(data: { name: string; logo: string }): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/add`,
		method: 'post',
		data,
	});
}

/**
 * 品牌 编辑
 * @param data - 品牌数据
 */
export function brandUpdateApi(data: { id: number; name: string; logo: string }): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/update`,
		method: 'post',
		data,
	});
}

/**
 * 品牌 删除
 * @param id - 品牌ID
 */
export function brandDeleteApi(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/delete/${id}`,
		method: 'post',
	});
}

/**
 * 品牌 修改品牌显示状态
 * @param id - 品牌ID
 */
export function brandShowApi(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/update/show/${id}`,
		method: 'post',
	});
}

/**
 * 保障服务 列表
 * @param params - 查询参数
 */
export function guaranteeListApi(params: PaginationParams & Record<string, any>): Promise<GuaranteeItem[]> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/list`,
		method: 'get',
		params,
	});
}

/**
 * 保障服务 新增
 * @param data - 保障服务数据
 */
export function guaranteeAddApi(data: { name: string; description: string }): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/add`,
		method: 'post',
		data,
	});
}

/**
 * 保障服务 编辑
 * @param data - 保障服务数据
 */
export function guaranteeUpdateApi(data: { id: number; name: string; description: string }): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/update`,
		method: 'post',
		data,
	});
}

/**
 * 保障服务 删除
 * @param id - 保障服务ID
 */
export function guaranteeDeleteApi(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/delete/${id}`,
		method: 'post',
	});
}

/**
 * 保障服务 修改显示状态
 * @param id - 保障服务ID
 */
export function guaranteeShowApi(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/update/show/${id}`,
		method: 'post',
	});
}

/**
 * 修改商品
 * @param data - 商品数据
 */
export function updateProductApi(data: Record<string, any>): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/update`,
		method: 'post',
		data,
	});
}

/**
 * 商品可用优惠券列表
 */
export function productCouponListApi(): Promise<any> {
	return request({
		url: '/tracomps-admin/api/admin/platform/coupon/product/usable/list',
		method: 'get',
	});
}

/**
 * 商品搜索分页列表（活动）
 * @param params - 查询参数
 */
export function productActivityListApi(params: PaginationParams & Record<string, any>): Promise<any> {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/activity/search/page',
		method: 'get',
		params,
	});
}

/**
 * 根据商品ID集合查询商品列表
 * @param ids - 商品ID集合
 */
export function productListbyidsApi(ids: string): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/listbyids/${ids}`,
		method: 'get',
	});
}

/**
 * 商品标签列表
 * @param params - 查询参数
 */
export function productTagListApi(params: PaginationParams & { keywords: string }): Promise<ProductTagItem[]> {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/list`,
		method: 'get',
		params: { ...params, keywords: encodeURI(params.keywords) },
	});
}

/**
 * 商品标签删除
 * @param id - 标签ID
 */
export function productTagDelete(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/delete/${id}`,
		method: 'get',
	});
}

/**
 * 商品标签详情
 * @param id - 标签ID
 */
export function productTagInfoApi(id: number): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/info/${id}`,
		method: 'get',
	});
}

/**
 * 新增商品标签
 * @param data - 标签数据
 */
export function productTagAddApi(data: { name: string }): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/save`,
		method: 'post',
		data,
	});
}

/**
 * 编辑商品标签
 * @param data - 标签数据
 */
export function productTagUpdateApi(data: { id: number; name: string }): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/update`,
		method: 'post',
		data,
	});
}

/**
 * 更新标签状态
 * @param id - 标签ID
 * @param status - 标签状态
 */
export function productTagStatusApi(id: number, status: boolean): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/producttag/status/${id}/${status}`,
		method: 'get',
	});
}

/**
 * 平台端批量商品审核
 * @param data - 审核数据
 */
export function productBatchAuditApi(data: Record<string, any>): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/batch/audit`,
		method: 'post',
		data,
	});
}

/**
 * 批量设置虚拟销量
 * @param data - 销量数据
 */
export function productBatchVirtualSalesApi(data: { ids: string; virtualSales: number }): Promise<any> {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/batch/set/virtual/sales`,
		method: 'post',
		data,
	});
}

/**
 * 新增商品
 * @param data - 商品数据
 */
export function productCreateApi(data: Record<string, any>): Promise<any> {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/product/save' 
	: '/tracomps-admin/api/admin/platform/product/save';
	return request({
		url,
		method: 'POST',
		data,
	});
}

/**
 * 编辑商品
 * @param data - 商品数据
 */
export function productUpdateApi(data: Record<string, any>): Promise<any> {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/platUpdate',
		method: 'POST',
		data,
	});
}
