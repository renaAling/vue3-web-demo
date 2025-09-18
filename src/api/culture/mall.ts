import request from '/@/utils/request';
const prefix = '/mall';

// 查询店铺 - 到店支付/网定店取
export function mallListApi(params: object) {
	return request({
		url: prefix + '/store/page',
		method: 'GET',
		params,
	});
}
