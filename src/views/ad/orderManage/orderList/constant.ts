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

// 支付状态
export const payStatusMap: StatusType = {
	0: '未支付',
	1: '已支付',
};

// 工单状态
export const workOrderStatusMap: StatusType = {
	1: '待排期',
	2: '待排期确认',
	3: '素材待上传',
	4: '素材待审核',
	5: '审核不通过',
	6: '待上刊',
	7: '上刊待确认',
	8: '已上刊',
	9: '已拒绝',
	10: '已关闭',
};

// 退款状态
export const refundStatusMap: StatusType = {
	0: '未退款',
	1: '申请中',
	2: '部分退款',
	3: '已退款',
};

// 支付渠道
// export const paymentWayMap: StatusType = {
// 	1: '微信支付',
// 	2: '支付宝支付',
// 	3: '余额支付',
// };

// 售后工单状态
export const afterSaleStatusMap: StatusType = {
	0: '待审核',
	1: '已驳回',
	2: '退款中',
	3: '已完成',
	6: '用户取消',
};
