import request from '/@/utils/request';

// 卡密库分页列表
export function cdkeyPageApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/cdkey/library/page/list',
		method: 'get',
		params,
	});
}

// 新增卡密库
export function cdkeySaveApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/cdkey/library/save`,
		method: 'post',
		data: params,
	});
}

// 修改卡密库
export function cdkeyUpdateApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/cdkey/library/update`,
		method: 'post',
		data: params,
	});
}

// 删除卡密库
export function cdkeyDeleteApi(id: any) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/cdkey/library/delete/${id}`,
		method: 'post',
	});
}


// 卡密分页列表
export function cardPageApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/card/secret/page/list',
		method: 'get',
		params,
	});
}

// 新增卡密
export function cardSaveApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/card/secret/save`,
		method: 'post',
		data: params,
	});
}

// 修改卡密
export function cardUpdateApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/card/secret/update`,
		method: 'post',
		data: params,
	});
}

// 删除卡密
export function cardDeleteApi(id: any) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/card/secret/delete/${id}`,
		method: 'post',
	});
}

// 批量删除卡密
export function cardBatchDeleteApi(params: Object) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/card/secret/batch/delete`,
		method: 'post',
		data: params,
	});
}


