// 财务统计相关接口
import request from '/@/utils/request';

// 自有商城后台-获取当前积分抵扣配置表
export function getScorePayConfigApi() {
	return request({
		url: '/tracomps-admin/api/admin/scorePayConfig/getScorePayConfig',
		method: 'get',
	});
}
// 自有商城后台-修改自有商城积分抵扣配置表
export function updateScorePayConfigApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/scorePayConfig/updateScorePayConfig',
		method: 'put',
		data: params,
	});
}
