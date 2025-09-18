import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取商家列表
export function getMerchantList() {
	return request({
		url: prefix + '/merchant/getMerchantFilterInfo',
		method: 'get',
	});
}
