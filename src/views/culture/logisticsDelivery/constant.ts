import { StatusType } from './types';
// 订单状态
export const orderStatusMap: StatusType = {
	1: '待支付',
	2: '已取消',
	3: '待发货/待取货',
	4: '待收货',
	5: '已完成',
	6: '已退款',
};

//收货方式
export const receiveWayMap: StatusType = {
	1: '邮寄',
	2: '自提',
	4: '扫码购',
};
// 支付方式
export const paymentWayMap: StatusType = {
	1: '微信小程序',
	2: '微信APP',
	3: '支付宝APP',
	4: '支付宝小程序',
};

// 下单身份
export const isStaffMap: StatusType = {
	true: '员工',
	false: '非员工',
};

// 收货方式
export const logisticsTypeMap: StatusType = {
	1: '邮寄',
	2: '网点自提',
	4: '扫码购',
	5: '虚拟发货',
};

export const shippingStatusTypeMap: StatusType = {
	1: '待出库',
	2: '已出库',
	3: '已发货',
};
