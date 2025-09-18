import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取售后列表
export function getSellList(params?: object) {
	return request({
		url: prefix + '/refundManage/page',
		method: 'get',
		params,
	});
}

// 获取售后详情
export function sellDetail(id: string) {
	return request({
		url: prefix + `/refundManage/getDetail?id=${id}`,
		method: 'get',
	});
}
// 售后下载
export function downLoadRefundExcel(params?: object) {
	return request({
		url: prefix + '/refundManage/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
}
