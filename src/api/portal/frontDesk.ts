import request from '/@/utils/request';

// 门户子系统后台-查询全部服务分类信息表
export function getUpsBannerServicesClassListApi(params?: Object) {
	return request({
		url: '/uac/upsBannerServicesClass/getList',
		method: 'get',
		params,
	});
}

// 门户子系统后台-根据banner位置查询
export function getByLocationTypeApi(params?: Object) {
	return request({
		url: '/uac/upsOperationBanner/getByLocationType',
		method: 'get',
		params,
	});
}

// 门户子系统后台-身份编码列表信息
export function getEmpCodeListApi(params?: Object) {
	return request({
		url: '/uac/upsEmpIdentity/getEmpCodeList',
		method: 'get',
		params,
	});
}

// 门户子系统后台-新增运营banner配置信息
export function postupsOperationBannerAddApi(params?: Object) {
	return request({
		url: '/uac/upsOperationBanner/add',
		method: 'post',
		data: params,
	});
}

// 门户子系统后台-新增运营banner配置信息
export function putupsOperationBannerUpdateApi(params?: Object) {
	return request({
		url: '/uac/upsOperationBanner/update',
		method: 'put',
		data: params,
	});
}

// 门户子系统后台-通过id查询banner信息
export function getUsOperationBannerGetByIdApi(params?: Object) {
	return request({
		url: '/uac/upsOperationBanner/getById',
		method: 'get',
		params,
	});
}

// 门户子系统后台-删除运营banner配置信息
export function deleteUsOperationBannerDelApi(id?: any) {
	return request({
		url: `/uac/upsOperationBanner/del?id=${id}`,
		method: 'delete',
	});
}

// 门户子系统后台-修改运营banner顺序
export function putUpdateSequenceApi(params?: Object) {
	return request({
		url: '/uac/upsOperationBanner/updateSequence',
		method: 'put',
		data: params,
	});
}

// 门户子系统后台-修改运营配置状态
export function putUpdateStatusApi(params?: Object) {
	return request({
		url: '/uac/upsOperationBanner/updateStatus',
		method: 'put',
		data: params,
	});
}

// 门户子系统后台-新增门户子系统前台管理全部服务分类信息表
export function postClassAddApi(params?: Object) {
	return request({
		url: '/uac/upsBannerServicesClass/add',
		method: 'post',
		data: params,
	});
}

// 门户子系统后台-修改门户子系统前台管理全部服务分类信息表
export function putClassUpdateApi(params?: Object) {
	return request({
		url: '/uac/upsBannerServicesClass/update',
		method: 'put',
		data: params,
	});
}

// 门户子系统后台-通过id查询
export function getClassGetByIdApi(id?: any) {
	return request({
		url: `/uac/upsBannerServicesClass/get?id=${id}`,
		method: 'get',
	});
}
// 门户子系统后台-通过id逻辑删除门户子系统前台管理全部服务分类信息表
export function deleteClassDelApi(id?: any) {
	return request({
		url: `/uac/upsBannerServicesClass/del?id=${id}`,
		method: 'delete',
	});
}