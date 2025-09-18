import request from '/@/utils/request';
// 公共前缀
const prefix = '/open';

// 开发者管理 -> 开发者列表 -> 分页列表查询
export function getDeveloperList(params: object) {
	return request({
		url: prefix + '/appDeveloper/page',
		method: 'get',
		params,
	});
}

// 开发者管理 -> 开发者列表 -> 切换启用/停用接口
export function updateDeveloperStatus(data: object) {
	return request({
		url: prefix + `/appDeveloper/updateStatus`,
		method: 'post',
		data,
	});
}
