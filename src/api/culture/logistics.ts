import request from '/@/utils/request';
const isMerchant = import.meta.env.VITE_IS_MERCHANT;
console.log('isMerchant', isMerchant)
/**
 * @description 全部物流公司
 */
export function expressAllApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/express/all',
		method: 'get',
		params,
	});
}

/**
 * @description 商户关联物流公司
 */
export function expressRelateApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/express/relate`,
		method: 'post',
		data,
	});
}

/**
 * @description 商户物流公司分页列表
 */
export function expressPageApi(params: Object) {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/express/search/page' 
	: '/tracomps-admin/api/admin/platform/express/list';
	return request({
		url,
		method: 'GET',
		params,
	});
}

/**
 * @description 查询物流公司面单模板
 */
export function exportTempApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/express/template',
		method: 'get',
		params,
	});
}

// 城市列表
export function cityList(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/system/city/list',
		method: 'get',
		params: { ...data },
	});
}

// 城市列表
export function cityListTree() {
	return request({
		url: '/tracomps-admin/api/admin/system/city/list/tree',
		method: 'get',
	});
}

// 城市修改状态
export function updateStatus(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/system/city/update/status',
		method: 'post',
		params: { ...data },
	});
}

// 城市修改
export function cityUpdate(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/system/city/update',
		method: 'post',
		params: { ...data },
	});
}

// 城市详情
export function cityInfo(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/system/city/info',
		method: 'get',
		params: { ...data },
	});
}

// 物流公司列表
export function expressList(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/express/list',
		method: 'get',
		params: { ...data },
	});
}

// 同步物流公司
export function expressSyncApi() {
	return request({
		url: '/tracomps-admin/api/admin/platform/express/sync/express',
		method: 'post',
	});
}

// 物流公司修改状态
export function expressUpdateShow(data: any) {
	const url = isMerchant 
	? `/tracomps-admin/api/admin/merchant/express/open/switch/${data.id}` 
	: '/tracomps-admin/api/admin/platform/express/update/show';
	return request({
		url,
		method: 'post',
		data,
	});
}

// 物流公司 编辑
export function expressUpdate(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/express/update',
		method: 'post',
		data,
	});
}

// 新增物流公司
export function expressSave(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/express/save',
		method: 'post',
		params: { ...data },
	});
}

// 删除物流公司
export function expressDelete(data: Object) {
	const url = isMerchant 
	? '/tracomps-admin/api/admin/merchant/express/delete' 
	: '/tracomps-admin/api/admin/platform/express/delete';
	return request({
		url,
		method: 'GET',
		params: { ...data },
	});
}

/**
 * @description 商户端物流运费模板列表
 */
export function shippingTemplatesList(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/shipping/templates/list',
		method: 'get',
		params: { ...data },
	});
}

// 物流运费模板详情
export function templateDetailApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/express/shipping/templates/info',
		method: 'get',
		params: { ...data },
	});
}

// 物流运费模板包邮
export function shippingFree(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/express/shipping/free/list',
		method: 'get',
		params: { ...data },
	});
}

// 物流运费模板不包邮
export function shippingRegion(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/express/shipping/region/list',
		method: 'get',
		params: { ...data },
	});
}

// 物流运费模板新增
export function shippingSave(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/express/shipping/templates/save',
		method: 'post',
		data: data,
	});
}

// 物流运费模板更新
export function shippingUpdate(data: Object, id: any) {
	return request({
		url: '/tracomps-admin/api/admin/express/shipping/templates/update',
		method: 'post',
		data: data,
		params: { ...id },
	});
}

// 物流运费模板删除
export function shippingDetete(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/express/shipping/templates/delete',
		method: 'get',
		params: data,
	});
}

// 物流公司详情
export function expressInfo(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/express/info',
		method: 'get',
		params: { ...data },
	});
}
// 设为默认
export function expressDefaultSwitch(data: any) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/express/default/switch/${data.id}`,
		method: 'post',
	});
}

// ----------------- 710需求 --------------------
// 新增物流公司
export function expressAddApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/express/add',
		method: 'post',
		data,
	});
}

// 修改显示开关
export function expressUpdateShowApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/express/update/show',
		method: 'post',
		data,
	});
}

// 物流公司详情
export function expressInfoApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/express/info',
		method: 'get',
		params: { ...data },
	});
}

// 物流公司删除
export function expressDelApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/express/del',
		method: 'delete',
		params: data,
	});
}