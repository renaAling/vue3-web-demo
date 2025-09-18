import request from '/@/utils/request';
// 公共前缀
const prefix = '/open';

// 开发者申请信息接入接口
export function accessDeveloperInfo(data: object) {
	return request({
		url: prefix + '/contactsInfo/addNew',
		method: 'post',
		data,
	});
}

// 开发者申请信息列表
export function getContactsInfoList(params?: object) {
	return request({
		url: prefix + '/contactsInfo/page',
		method: 'get',
		params,
	});
}

// 开发者申请信息 修改信息状态
export function updateApproveStatus(data: object) {
	return request({
		url: prefix + '/contactsInfo/updateStatus',
		method: 'post',
		data,
	});
}
