import { StatusType } from './types';

// 订单状态
export const orderStatusMap: StatusType = {
	0: '待支付',
	1: '待排期',
	4: '待上刊',
	5: '上刊中',
	6: '已完成',
	9: '已取消',
};

// 售后工单状态
export const afterSaleStatusMap: StatusType = {
	0: '待审核',
	1: '已驳回',
	2: '退款中',
	3: '已完成',
	6: '用户取消',
};

// 退款状态
export const refundStatusMap: StatusType = {
	2: '退款中',
	// 2: '退款失败',
	3: '退款成功',
};

// 发货状态
export const shippingStatusMap: StatusType = {
	1: '待出库',
	2: '已出库',
	3: '已发货',
};
