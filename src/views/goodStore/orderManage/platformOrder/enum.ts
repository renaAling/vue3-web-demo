interface StatusType {
	[key: number | string]: string | undefined;
}

// 业务类型
export const orderTypeMap: StatusType = {
	1: '到店支付',
	2: '网订店取',
};

// 订单状态
export const orderStatusMap: StatusType = {
	1: '待支付',
	2: '已完成',
	3: '已退款',
	4: '已取消',
	5: '订餐成功',
};

// 支付方式
export const payTypeMap: StatusType = {
	1: '微信小程序',
	6: '员工卡支付',
};

// 退款状态
export const refundStatusMap: StatusType = {
	1: '未退款',
	2: '部分退款',
	3: '已退款',
};

// 退款类型
export const refundTypeMap: StatusType = {
	1: '后台退款',
	2: '小程序退款',
};

export const couponCategory: StatusType = {
	1: '店铺',
	2: '商品',
	3: '通用',
	4: '品类',
	5: '品牌',
	6: '跨店',
};
