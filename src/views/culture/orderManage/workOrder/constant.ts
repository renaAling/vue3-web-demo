import { StatusType } from './types';
// 售后工单状态
export const afterSaleStatusMap: StatusType = {
	1: '待审核',
	2: '用户取消',
	3: '已驳回',
	4: '退款中',
	5: '已完成',
};
// 退款状态
export const refundStatusMap: StatusType = {
	1: '退款中',
	2: '退款失败',
	3: '退款成功',
};

// 订单状态
export const orderStatusMap: StatusType = {
	1: '待支付',
	2: '已取消',
	3: '待发货/待取货',
	4: '待收货',
	5: '已完成',
	6: '已退款',
};

// 发货状态
export const shippingStatusMap: StatusType = {
	1: '待出库',
	2: '已出库',
	3: '已发货',
};
