import { StatusType } from './types';
// 投放工单状态
export const afterSaleStatusMap: StatusType = {
	1: '待排期',
	2: '排期待确认',
	3: '素材待上传',
	4: '素材待审核',
	5: '审核不通过',
	6: '待上刊',
	7: '上刊待确认',
	8: '已上刊',
	// 9: '已拒绝',
	10: '已关闭',
};
// 确认方式
export const confirmTypeMap: StatusType = {
	1: '手动确认',
	2: '超时自动确认',
};
// 补款退款状态
export const payStatusMap: StatusType = {
	2: '需补款',
	3: '需退款',
	1: '无需处理',
};
// 弹窗类型
export const dialogTypeMap: StatusType = {
	1: '关闭工单',
	2: '拒绝并退款',
	3: '广告排期',
	4: '素材审核通过',
	5: '素材审核不通过',
};
// 退款状态
// 0-待审核，1-商家拒绝，2-退款中，3-已退款，4-用户退货，5-商家待收货，6-已撤销
export const refundStatusMap: StatusType = {
	0: '待审核',
	1: '商家拒绝',
	2: '退款中',
	3: '已退款',
	4: '用户退货',
	5: '商家待收货',
	6: '已撤销',
};
// 表单规则
export const formRules: any = ref({
	orderCloseFormRules: {
		closeMsg: [{ required: true, message: '请输入操作说明', trigger: 'blur' }],
	},
	orderRefundFormRules: {
		refundResult: [{ required: true, message: '请选择退款原因', trigger: 'blur' }],
	},
	orderConfirmFormRules: {
		publishTime: [{ required: true, message: '请输入投放时间', trigger: 'blur' }],
		publishDescription: [{ required: true, message: '请输入投放说明', trigger: 'blur' }],
		type: [{ required: true, message: '请补款退款', trigger: 'blur' }],
		price: [{ required: false, message: '请输入补退款金额', trigger: 'blur' }],
	},
	orderApplyFormRules: {
		auditDescription: [{ required: true, message: '请输入审核说明', trigger: 'blur' }],
		auditFile: [{ required: true, message: '请上传素材', trigger: 'blur' }],
	},
});
