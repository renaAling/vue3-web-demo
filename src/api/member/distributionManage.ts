import request from '/@/utils/request';

// 分销等级分页
export const distributionLevelConfigPage = (params?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/distributionLevelConfig/page',
		method: 'get',
		params,
	});
};

// 分销等级列表
export const distributionLevelConfigList = (params?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/distributionLevelConfig/getAllList',
		method: 'get',
		params,
	});
};

export const distributionLevelConfigAdd = (data?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/distributionLevelConfig/add',
		method: 'post',
		data,
	});
};

export const distributionLevelConfigUpdate = (data?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/distributionLevelConfig/update',
		method: 'put',
		data,
	});
};

// 修改分销等级状态
export const distributionLevelConfigUpdateStatus = (data?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/distributionLevelConfig/updateStatus',
		method: 'post',
		data,
	});
};

// 修改返俑设置
export const updateBrokerage = (data?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/distributionLevelConfig/updateBrokerage',
		method: 'put',
		data,
	});
};

// 通过code查询详情
export const levelConfigDetail = (code: String) => {
	return request({
		url: `/tracomps-admin/api/admin/distributionLevelConfig/get?code=${code}`,
		method: 'get',
	});
};

// 分销等级删除
export const distributionLevelConfigDel = (levelCode: number) => {
	return request({
		url: `/tracomps-admin/api/admin/distributionLevelConfig/del?levelCode=${levelCode}`,
		method: 'delete',
	});
};

// 分销员列表分页
export const pageUserDistribution = (params?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/userDistribution/page',
		method: 'get',
		params,
	});
};

// 获取分销员列表
export const pageUserList = () => {
	return request({
		url: '/tracomps-admin/api/admin/userDistribution/getAllList',
		method: 'get',
	});
};

export const discountUserDetail = (id: String) => {
	return request({
		url: `/tracomps-admin/api/admin/userDistribution/get?id=${id}`,
		method: 'get',
	});
};

// 新增分销员
export const discountUserAdd = (data?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/userDistribution/add',
		method: 'post',
		data,
	});
};

export const discountUserUpdate = (data?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/userDistribution/update',
		method: 'put',
		data,
	});
};

export const discountUserUpdateStatus = (data?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/userDistribution/updateStatus',
		method: 'put',
		data,
	});
};

// 获取关联用户
export const getByPhone = (phone: String) => {
	return request({
		url: `/tracomps-admin/api/admin/platform/user/getByPhone/${phone}`,
		method: 'get',
	});
};

// 查询所有返俑列表（返俑流水）
export const promotionOrder = (data?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/platform/retail/store/promotion/order/getAll',
		method: 'post',
		data,
	});
};

// 查询所有返俑列表（返俑月账单）
export const distributionMonthBill = (params?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/distributionMonthBill/page',
		method: 'get',
		params,
	});
};

// 导出所有返俑列表（返俑月账单）
export const distributionMonthBillExport = (params?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/distributionMonthBill/export',
		method: 'get',
		params,
	});
};

// 历史推广
export const pageUserHistorySpread = (params?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/userDistribution/historySpread',
		method: 'get',
		params,
	});
};

// 返俑明细
export const pageUserBrokerageDetail = (params?: Object) => {
	return request({
		url: '/tracomps-admin/api/admin/userDistribution/brokerageDetail',
		method: 'get',
		params,
	});
};
