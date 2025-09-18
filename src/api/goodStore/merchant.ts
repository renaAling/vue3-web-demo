import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取商户列表
export function merchantPage(params?: object) {
	return request({
		url: prefix + '/merchant/page',
		method: 'get',
		params,
	});
}
// 商户列表无分页
export function merchantList(params?: Object) {
	return request({
		url: `${prefix}/merchant/getList`,
		method: 'get',
		params,
	});
}
// 地铁站点查询
export function getSubwayList(params?: Object) {
	return request({
		url: `${prefix}/subway/getSubwayList`,
		method: 'get',
		params,
	});
}

// 更新门店排序
export function storeUpdateSortApi(data?: Object) {
	return request({
		url: `${prefix}/store/updateSort`,
		method: 'post',
		data,
	});
}
// 商家配置
export function merchantConfig(data?: object) {
	return request({
		url: prefix + '/merchant/saveOrUpdate',
		method: 'post',
		data,
	});
}
export function updateIsReminder(data?: object) {
	return request({
		url: prefix + '/merchant/updateIsReminder',
		method: 'put',
		data,
	});
}

// 删除
export function merchantDel(id: any) {
	return request({
		url: `${prefix}/merchant/del?id=${id}`,
		method: 'delete',
	});
}
// 启用禁用

export function merchantUpdateStatus(data?: object) {
	return request({
		url: `${prefix}/merchant/updateStatus`,
		method: 'put',
		data,
	});
}
// 详情

export function merchantDetail(id: any) {
	return request({
		url: `${prefix}/merchant/getDetailById?id=${id}`,
		method: 'get',
	});
}

// 门店
// 列表
export function storePage(params?: Object) {
	return request({
		url: `${prefix}/store/page`,
		method: 'get',
		params,
	});
}
// 门店配置
export function storeConfig(data?: Object) {
	return request({
		url: `${prefix}/store/saveOrUpdate`,
		method: 'post',
		data,
	});
}
// 门店详情
export function storeDetail(id: any) {
	return request({
		url: `${prefix}/store/getDetailById?id=${id}`,
		method: 'get',
	});
}
// 门店显示与否
export function storeUpdateDisplayStatus(data?: object) {
	return request({
		url: `${prefix}/store/updateStatus`,
		method: 'put',
		data,
	});
}

// 删除
export function storeDel(id: any) {
	return request({
		url: `${prefix}/store/del?id=${id}`,
		method: 'delete',
	});
}
// 门店解绑商家
export function storeUnbind(id: any) {
	return request({
		url: `${prefix}/store/unbind?id=${id}`,
		method: 'get',
	});
}
export function storebind(data?: object) {
	return request({
		url: `${prefix}/store/bind`,
		method: 'put',
		data,
	});
}

// 短信验证码
export function getSmsCode(mobile: any) {
	return request({
		url: `${prefix}/mobile/${mobile}`,
		method: 'get',
	});
}

// 地图站点数据
export function subwayList() {
	return request({
		url: `${prefix}/line/getSubway`,
		method: 'get',
	});
}

// 商家角色列表

export const merchantRoles = () => {
	return request({
		url: '/mall/gsMerchantUser/getMerchantRoles',
		method: 'get',
	});
};
export const getCategoryList = () => {
	return request({
		url: '/mall/category/getCategory',
		method: 'get',
	});
};

// 结账管理
// 结账列表
export function checkoutPage(params?: Object) {
	return request({
		url: `${prefix}/merchantCheckout/page`,
		method: 'get',
		params,
	});
}
//新增结账
export function checkoutAdd(data?: Object) {
	return request({
		url: `${prefix}/merchantCheckout/add`,
		method: 'post',
		data,
	});
}
//编辑结账
export function checkoutUpdate(data?: Object) {
	return request({
		url: `${prefix}/merchantCheckout/update`,
		method: 'put',
		data,
	});
}
// 结账详情
export function checkoutDetail(id: any) {
	return request({
		url: `${prefix}/merchantCheckout/get?id=${id}`,
		method: 'get',
	});
}

// 结账管理-查询
export function checkOutList(params: object) {
	return request({
		url: `${prefix}/merchantCheckout/list`,
		method: 'get',
		params,
	});
}

// 结账管理-新增
export function checkOutAdd(params: object) {
	return request({
		url: `${prefix}/merchantCheckout/add`,
		method: 'post',
		data: params,
	});
}

// 结账管理-保存编辑
export function checkOutUpdate(params: object) {
	return request({
		url: `${prefix}/merchantCheckout/update`,
		method: 'put',
		data: params,
	});
}

// 结账方式
export function checkOutUpdateStatus(params: object) {
	return request({
		url: `${prefix}/merchantCheckout/updateStatus`,
		method: 'post',
		data: params,
	});
}

// 新增-修改门店营业时间
export function addAndEdit(params: object) {
	return request({
		url: `${prefix}/wdBusinessHours/addAndEdit`,
		method: 'post',
		data: params,
	});
}

// 查询-通过门店编码查询营业时间
export function getByCode(params: object) {
	return request({
		url: `${prefix}/wdBusinessHours/getByCode`,
		method: 'get',
		params,
	});
}

// 查询平台门店业务配置信息
export function getBusinessManage(storeCode: string) {
	return request({
		url: `${prefix}/store/getReminder?storeCode=${storeCode}`,
		method: 'get',
	});
}

// 实时修改平台门店业务配置
export function updatePlatformStoreReminder(data: object) {
	return request({
		url: `${prefix}/store/updateReminder`,
		method: 'put',
		data: data,
	});
}
// 推荐门店 平台
export const updateRecommendStatus = (data: object) => {
	return request({
		url: `${prefix}/store/updateRecommendStatus`,
		method: 'put',
		data,
	});
};