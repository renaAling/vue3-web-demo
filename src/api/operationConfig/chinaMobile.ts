import request from '/@/utils/request';
// 公共前缀
const prefix = '/open';

// 获取中国移动积分兑换流水列表
export function getCMCCData(params?: object) {
	return request({
		url: prefix + '/cmcc/page',
		method: 'get',
		params,
	});
}

// 查看用户手机号
export function viewUserPhoneNumber(params?: object) {
	return request({
		url: prefix + '/cmcc/getPhone',
		method: 'get',
		params,
	});
}
