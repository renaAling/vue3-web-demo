import { Business } from './../../views/goodStore/business/types.d';
import request from '/@/utils/request';
// 公共前缀
const prefix = '/activity';

// 活动列表查询接口 活动管理、活动派发、活动统计列表页共用接口
export function getActivityList(params: object) {
	return request({
		url: prefix + '/lotteryInfo/page',
		method: 'get',
		params,
	});
}

// 创建活动 -> 创建活动接口
export function createActivity(data: object) {
	return request({
		url: prefix + '/lotteryInfo/add',
		method: 'post',
		data,
	});
}

// 创建活动 -> 更新活动接口
export function updateActivity(data: object) {
	return request({
		url: prefix + '/lotteryInfo/update',
		method: 'post',
		data,
	});
}

// 创建活动 -> 活动详情接口
export function activityDetail(code: string) {
	return request({
		url: prefix + `/lotteryInfo/getBackendDetail?code=${code}`,
		method: 'get',
	});
}

// 创建活动 -> 奖品配置 -> 列表
export function getPrizeList(params: object) {
	return request({
		url: prefix + '/lotteryAward/backendList',
		method: 'get',
		params,
	});
}

// 创建活动 -> 奖品配置 -> 删除奖品
export function prizeDel(id: string) {
	return request({
		url: prefix + `/lotteryAward/del?id=${id}`,
		method: 'delete',
	});
}

// 创建活动 -> 奖品配置 -> 查询剩余中奖概率
export function getSurplusOdds(params: any) {
	return request({
		url: prefix + `/lotteryAward/getOddsByActivityCode`,
		method: 'get',
		params,
	});
}

// 创建活动 -> 奖品配置 -> 新建奖品
export function createPrize(data: object) {
	return request({
		url: prefix + '/lotteryAward/add',
		method: 'post',
		data,
	});
}

// 创建活动 -> 更新奖品信息接口
export function updatePrize(data: object) {
	return request({
		url: prefix + '/lotteryAward/update',
		method: 'put',
		data,
	});
}

// 创建活动 -> 奖品详情接口
export function getPrizeInfoDetail(prizeCode: string) {
	return request({
		url: prefix + `/lotteryAward/getBackendDetail?prizeCode=${prizeCode}`,
		method: 'get',
	});
}

// 创建活动 -> 页面配置 -> 页面配置保存
export function createOrUpdatePageConfig(data: object) {
	return request({
		url: prefix + '/lotteryInfo/addOrModifyImages',
		method: 'post',
		data,
	});
}

// 创建活动 -> 页面配置 -> 页面配置详情
export function pageConfigDetail(code: string) {
	return request({
		url: prefix + `/lotteryInfo/getImageConfig?code=${code}`,
		method: 'get',
	});
}

// 活动管理 -> 更新活动状态接口
export function statusUpdate(data: object) {
	return request({
		url: prefix + '/lotteryInfo/updateStatus',
		method: 'put',
		data,
	});
}

// 活动管理 -> 删除活动
export function activityDelete(params: object) {
	return request({
		url: prefix + '/lotteryInfo/del',
		method: 'delete',
		params,
	});
}

// 活动统计 -> 参与日志列表查询接口
export function activityLotteryNumLogs(params?: object) {
	return request({
		url: prefix + '/lotteryNumLog/page',
		method: 'get',
		params,
	});
}

// 活动统计 -> 访问统计列表查询接口(埋点统计)
export function getAccessStatistics(params: object) {
	return request({
		url: '/business/eventTrack/getStatistics',
		method: 'get',
		params,
	});
}

// 活动统计 -> 参与统计列表查询接口
export function getLotteryNumLogStatistics(params: object) {
	return request({
		url: prefix + '/lotteryNumLog/getStatistics',
		method: 'get',
		params,
	});
}

// 活动统计 -> 抽奖统计列表查询接口
export function getLotteryUserInfoStatistics(params: object) {
	return request({
		url: prefix + '/lotteryUserInfo/getStatistics',
		method: 'get',
		params,
	});
}

// 活动统计 -> 奖品信息统计列表查询接口
export function getLotteryAwardStatistics(params: object) {
	return request({
		url: prefix + '/lotteryAward/getStatistics',
		method: 'get',
		params,
	});
}

// 奖品派发 -> 中奖名单查询接口
export function getWinningList(params: object) {
	return request({
		url: prefix + '/lotteryUserInfo/page',
		method: 'get',
		params,
	});
}
