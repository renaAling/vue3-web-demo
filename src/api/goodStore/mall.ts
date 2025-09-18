import request from '/@/utils/request';
const prefix = '/mall';

export function getWeekDataApi(params?: Object) {
	return request({
		url: prefix + '/food_calendar/query',
		method: 'get',
		params,
	});
}

export function getProductDataApi(params?: Object) {
	return request({
		url: prefix + '/food_calendar/product_data',
		method: 'get',
		params,
	});
}

export function addWeekFoodApi(data?: Object) {
	return request({
		url: prefix + '/food_calendar/add',
		method: 'post',
		data,
	});
}

export function updateWeekFoodApi(data?: Object) {
	return request({
		url: prefix + '/food_calendar/update',
		method: 'put',
		data,
	});
}


// 采购单所有流程状态
export function pruchaseFlowStatusApi(params?: Object) {
	return request({
		url: prefix + '/purchase_manage/getStatus',
		method: 'get',
		params,
	});
}

// 采购单列表分页查询
export function loadPurchasePageApi(params?: Object) {
	return request({
		url: prefix + '/purchase_manage/page',
		method: 'get',
		params,
	});
}

// 新增采购单
export function addPurchaseApi(data?: Object) {
	return request({
		url: prefix + '/purchase_manage/add',
		method: 'post',
		data,
	});
}
// 修改采购单
export function updatePurchaseApi(data?: Object) {
	return request({
		url: prefix + '/purchase_manage/update',
		method: 'put',
		data,
	});
}
// 删除采购单
export function deletePurchaseApi(params?: Object) {
	return request({
		url: prefix + '/purchase_manage/del',
		method: 'delete',
		params,
	});
}


// 采购单关联门店列表
export function loadStoreListApi(params?: Object) {
	return request({
		url: prefix + '/purchase_manage/storeSelect',
		method: 'get',
		params,
	});
}

// 采购单关联供应商列表
export function loadSupplierListApi(params?: Object) {
	return request({
		url: prefix + '/supplier_manage/getSupplier',
		method: 'get',
		params,
	});
}

// 商品sku分页查询
export function loadProductPageApi(params?: Object) {
	return request({
		url: prefix + '/purchase_manage/skuPage',
		method: 'get',
		params,
	});
}

// 通过id查询采购单详情
export function getPurchaseDetailApi (params?: Object) {
	return request({
		url: prefix + '/purchase_manage/get',
		method: 'get',
		params,
	});
};

// 采购单提交审核
export function auditPurchaseApi (params?: Object) {
	return request({
		url: prefix + '/purchase_manage/submitAudit',
		method: 'get',
		params,
	});
};
// 采购完成提交
export function auditPurchaseComplete (params?: Object) {
	return request({
		url: prefix + '/purchase_manage/completeAudit',
		method: 'get',
		params,
	});
};
// 采购完成入库提交
export function auditPurchaseStorageApi (params?: Object) {
	return request({
		url: prefix + '/purchase_manage/storageData',
		method: 'get',
		params,
	});
};


// 采购单审批列表
export function loadPurchaseAuditPageApi(params?: Object) {
	return request({
		url: prefix + '/purchase_audit/page',
		method: 'get',
		params,
	});
}

// 采购单审批
export function updatePurchaseAuditApi(params?: Object) {
	return request({
		url: prefix + '/purchase_audit/audit',
		method: 'get',
		params,
	});
}

// 采购审批状态
export function purchaseAuditStatusApi(params?: Object) {
	return request({
		url: prefix + '/purchase_audit/getStatus',
		method: 'get',
		params,
	});
}

// 采购单导出
export function purchaseExportApi(params?: Object) {
	return request({
		url: prefix + '/purchase_manage/excel',
		method: 'get',
		params,
	});
}
