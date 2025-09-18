import request from '/@/utils/request';

// 会员复购统计查询
export const reBuyReportPage = (params: Object) => {
	return request({
		url: '/uac/re/buy/report/page',
		method: 'get',
		params,
	});
};
// 会员消费统计
export const consumePage = (params: Object) => {
	return request({
		url: '/uac/consume/statistics/Report/page',
		method: 'get',
		params,
	});
};
// 会员商品销量

export const salePage = (params: Object) => {
	return request({
		url: '/uac/sale/sort/report/page',
		method: 'get',
		params,
	});
};
// 会员价值分析
export const valuePage = (params: Object) => {
	return request({
		url: '/uac/value/statistics/report/page',
		method: 'get',
		params,
	});
};
// 销量统计总
export const consumeTotalPage = (params: Object) => {
	return request({
		url: '/uac/consume/statistics/Report/getStatistics',
		method: 'get',
		params,
	});
};
// 销售统计市区列表
export const areaListForSale = (params: Object) => {
	return request({
		url: '/uac/sale/sort/report/getAreaList',
		method: 'get',
		params,
	});
};
// 会员复购市区列表
export const areaListForRebuy = (params: Object) => {
	return request({
		url: '/uac/re/buy/report/getAreaList',
		method: 'get',
		params,
	});
};
// 会员等级统计
export const userLevelPage = () => {
	return request({
		url: '/uac/userLevel/getUserLevelReport',
		method: 'get',
		// params,
	});
};
// 注册会员统计
export const memberRegisterReport = (params: Object) => {
	return request({
		url: '/uac/memberRegisterReport/page',
		method: 'get',
		params,
	});
};