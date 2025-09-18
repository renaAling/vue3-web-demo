import request from '/@/utils/request';
// 公共前缀
const prefix = '/platform';

// 统计信息表
export function getPlatformStatisticsPage(params?: object) {
	return request({
		url: prefix + '/platformStatistics/page',
		method: 'get',
		params,
	});
}