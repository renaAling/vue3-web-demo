// 支付状态
const paymentStatus = [
	{
		label: '待支付',
		value: '1',
		elTagType: '',
	},
	{
		label: '支付成功',
		value: '2',
		elTagType: '',
	},
	{
		label: '支付失败',
		value: '3',
		elTagType: '',
	},
	{
		label: '已关闭',
		value: '4',
		elTagType: '',
	},
	{
		label: '已完成',
		value: '5',
		elTagType: '',
	},
];

// 支付方式
const payType = [
	{
		label: '微信小程序',
		value: '1',
		elTagType: '',
	},
	{
		label: '微信app支付',
		value: '2',
		elTagType: '',
	},
	{
		label: '支付宝app支付',
		value: '3',
		elTagType: '',
	},
	{
		label: '支付宝小程序支付',
		value: '4',
		elTagType: '',
	},
	{
		label: '微信内h5支付',
		value: '5',
		elTagType: '',
	},
	{
		label: '账户中心-钱包支付',
		value: '8',
		elTagType: '',
	},
	{
		label: '0元订单',
		value: '0',
		elTagType: '',
	},
];

const refundStatus = [
	{
		label: '退款中',
		value: '1',
		elTagType: '',
	},
	{
		label: '退款成功',
		value: '2',
		elTagType: '',
	},
	{
		label: '退款失败',
		value: '3',
		elTagType: '',
	},
	{
		label: '退款完成',
		value: '4',
		elTagType: '',
	},
];
// 用户角色列表
const userRoleList = [
	{
		label: '内部员工',
		value: 'IE-7vxi5klDG1',
	},
	{
		label: '学生',
		value: 'STU-6apstoz2',
	},
	{
		label: '委外员工',
		value: 'Outs-1u8kM3',
	},
	{
		label: '普通用户',
		value: 'RU-78Eu4km4',
	},
];

const typeList = ref([
	{
		label: '微信',
		value: '1',
		elTagType: '',
	},
	{
		label: '支付宝',
		value: '4',
		elTagType: '',
	},
	{
		label: '会员钱包',
		value: '8',
		elTagType: '',
	},
]);

const typeLists = ref([
	{
		label: '微信',
		value: '1',
		elTagType: '',
	},
	{
		label: '支付宝',
		value: '2',
		elTagType: '',
	},
	{
		label: '会员钱包',
		value: '3',
		elTagType: '',
	},
]);

export { paymentStatus, payType, refundStatus, userRoleList, typeList, typeLists };
