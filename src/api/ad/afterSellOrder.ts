import request from '/@/utils/request';
const prefix = '/tracomps-admin/api/admin/platform';

// 财务业务报表列表查询接口
export function advertReportPage(params?: Object) {
	return request({
		url: '/tracomps-admin/advertReport/page',
		method: 'get',
		params,
	});
}

// 投放工单列表
export function workOrderPage(params?: Object) {
	return request({
		url: prefix + '/workOrder/page',
		method: 'get',
		params,
	});
}
// 拒绝退款
export function workOrderRefund(data?: Object) {
	return request({
		url: prefix + '/workOrder/refund',
		method: 'post',
		data,
	});
}
// 关闭工单
export function workOrderClose(data?: Object) {
	return request({
		url: prefix + '/workOrder/close',
		method: 'post',
		data,
	});
}
// 工单排期
export function workOrderSchedule(data?: Object) {
	return request({
		url: prefix + '/workOrder/scheduling',
		method: 'post',
		data,
	});
}
// 上刊
export function workOrderPublish(data?: Object) {
	return request({
		url: prefix + '/workOrder/publish',
		method: 'post',
		data,
	});
}
// 素材审核
export function workOrderAudit(data?: Object) {
	return request({
		url: prefix + '/workOrder/auditWorkOrder',
		method: 'post',
		data,
	});
}
// 可退金额
export function workOrderPrice(orderCode?: string) {
	return request({
		url: `${prefix}/workOrder/price/${orderCode}`,
		method: 'get',
	});
}
// 工单明细
export function workOrderDetail(workOrderCode?: string) {
	return request({
		url: `${prefix}/workOrder/getWorkOrderDetail`,
		method: 'get',
		params: { workOrderCode },
	});
}
// 售后列表
export function refundOrderPage(params?: Object) {
	return request({
		url: prefix + '/refund/order/list',
		method: 'get',
		params,
	});
}
// 售后详情
export function refundOrderDetail(refundOrderNo: string) {
	return request({
		url: `${prefix}/refund/order/detail/${refundOrderNo}`,
		method: 'get',
	});
}
// 上刊确认
export function workOrderPublishConfirm(data?: Object) {
	return request({
		url: prefix + '/workOrder/publish',
		method: 'post',
		data,
	});
}

// 售后详情审核
export function refundApprove(data: object) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/refund/order/audit`,
		method: 'post',
		data,
	});
}
