import request from '/@/utils/request';
/**
 * 商户分类 列表
 */
export function merchantCategoryListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/category/list',
		method: 'get',
		params,
	});
}

/**
 * 商户分类 全部列表
 */
export function merchantCategoryAllListApi() {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/category/all/list',
		method: 'get',
	});
}

/**
 * 商户分类 添加
 */
export function merchantCategoryAddApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/category/add',
		method: 'post',
		data: params,
	});
}

/**
 * 商户分类 编辑
 */
export function merchantCategoryUpdateApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/category/update',
		method: 'post',
		data: params,
	});
}

/**
 * 商户分类 删除
 */
export function merchantCategoryDeleteApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/category/delete/${id}`,
		method: 'post',
	});
}
/**
 * 店铺类型 列表
 */
export function merchantTypeListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/type/list',
		method: 'get',
		params,
	});
}

/**
 * 店铺类型 全部列表
 */
export function merchantTypeAllListApi() {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/type/all/list',
		method: 'get',
	});
}

/**
 * 店铺类型 添加
 */
export function merchantTypeAddApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/type/add',
		method: 'post',
		data,
	});
}

/**
 * 店铺类型 编辑
 */
export function merchantTypeUpdateApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/type/update',
		method: 'post',
		data,
	});
}

/**
 * 店铺类型 删除
 */
export function merchantTypeDeleteApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/type/delete/${id}`,
		method: 'post',
	});
}

/**
 * 商户 列表
 */
export function merchantListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/list',
		method: 'get',
		params,
	});
}

/**
 * 商户 添加
 */
export function merchantAddApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/add',
		method: 'post',
		data,
	});
}

/**
 * 商户 编辑
 */
export function merchantUpdateApi(data: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/update',
		method: 'post',
		data,
	});
}

/**
 * 商户 关闭
 */
export function merchantCloseApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/close/${id}`,
		method: 'post',
	});
}

/**
 * 商户 详情
 */
export function merchantDetailApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/detail/${id}`,
		method: 'get',
	});
}

/**
 * 商户 开启
 */
export function merchantOpenApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/open/${id}`,
		method: 'post',
	});
}

/**
 * 商户 推荐开关
 */
export function merchantSwitchApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/recommend/switch/${id}`,
		method: 'post',
	});
}

/**
 * 商户 修改复制商品数量
 */
export function merchantCopyNumApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/update/copy/product/num`,
		method: 'post',
		data,
	});
}

/**
 * 商户 修改商户手机号
 */
export function merchantupdatePhoneApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/update/phone`,
		method: 'post',
		data,
	});
}

/**
 * 商户 权限规则菜单列表
 * @param pram
 */
export function menuMerListApi(params: any) {
	const data = {
		menuType: params.menuType, //菜单类型:M-目录，C-菜单，A-按钮
		name: params.name, //菜单名称
	};
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/menu/list`,
		method: 'get',
		params: data,
	});
}

/**
 * 商户 权限规则新增菜单
 * @param data
 */
export function menuMerAdd(data: Object) {
	let systemMenuRequest = data;
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/menu/add`,
		method: 'post',
		data: systemMenuRequest,
	});
}

/**
 * 商户 权限规则删除菜单
 * @param data
 */
export function menuMerDelete(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/menu/delete/${id}`,
		method: 'post',
	});
}

/**
 * 商户 权限规则菜单详情
 * @param data
 */
export function menuMerInfo(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/menu/info/${id}`,
		method: 'get',
	});
}

/**
 * 商户 权限规则菜单修改
 * @param data
 */
export function menuMerUpdate(data: Object) {
	let systemMenuRequest = data;
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/menu/update`,
		method: 'post',
		data: systemMenuRequest,
	});
}

/**
 * 权限规则修改菜单显示状态
 * @param data
 */
export function menuMerUpdateShowStatus(params: any) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/menu/update/show/${params.id}`,
		method: 'post',
	});
}

/**
 * 商户入驻分页列表
 * @param data
 */
export function merApplyListApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/apply/list`,
		method: 'get',
		params,
	});
}

/**
 * 商户入驻审核
 * @param data
 */
export function merApplyAuditApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/apply/audit`,
		method: 'post',
		data,
	});
}

/**
 * 商户入驻备注
 * @param data
 */
export function merApplyRemarkApi(data: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/apply/remark`,
		method: 'post',
		data,
	});
}

/**
 * 商户分页列表表头数量
 * @param data
 */
export function merHeaderNumApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/list/header/num`,
		method: 'get',
		params,
	});
}

/**
 * 重置商户密码
 * @param data
 */
export function merRsetPasswordApi(id: number) {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/reset/password/${id}`,
		method: 'post',
	});
}

/**
 * 可用分类商户列表
 * @param data
 */
export function merCategoryListApi() {
	return request({
		url: `/tracomps-admin/api/admin/platform/merchant/use/category/list`,
		method: 'get',
	});
}

/**
 * 商户端商品分类缓存树
 * @param pram
 */
export function storeCategoryAllApi(merId: number) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/store/product/category/cache/tree/${merId}`,
		method: 'GET',
	});
}

// 商城板块统计
export function loadMallPlateListApi() {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/model/getPage',
		method: 'get',
	});
}

// 修改板块显示状态
export function updateMallPlateStatusApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/model/updateDisplay',
		method: 'put',
		data: params,
	});
}

/**
 * 获取所有商城板块
 * @param {*} params
 * @returns
 */
export function getAllMallPlateApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/model/getAll',
		method: 'get',
		params,
	});
}

// 获取特定商户的板块
export function getMallPlateOfMerApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/model/getMerList',
		method: 'get',
		params,
	});
}

/**
 * 判断当前板块是否有商品上架
 */
export function validProductInMallPlateApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/validProduct',
		method: 'get',
		params,
	});
}
