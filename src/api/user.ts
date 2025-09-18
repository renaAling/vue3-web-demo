import request from '/@/utils/request';

export const list = () => {
	return request({
		url: '/admin/user/list',
		method: 'get',
	});
};
export const pageList = (params?: Object) => {
	return request({
		url: '/uac/userCenter/page',
		method: 'get',
		params,
	});
};
export const freezeUser = (obj: Object) => {
	return request({
		url: '/uac/userCenter/freeze',
		method: 'post',
		data: obj,
	});
};
export const getUserDetail = (id: String) => {
	return request({
		url: `/uac/userCenter/${id}`,
		method: 'get',
	});
};
// 注销用户
export const bgLogout = (obj: Object) => {
	return request({
		url: '/uac/uacUser/bgLogout',
		method: 'post',
		data: obj,
	});
};
// 更新用户
export const putUser = (obj: Object) => {
	return request({
		url: '/uac/userCenter/updateUser',
		method: 'put',
		data: obj,
	});
};
export const delObj = (ids: Object) => {
	return request({
		url: '/admin/user',
		method: 'delete',
		data: ids,
	});
};

export function getDetails(obj: Object) {
	return request({
		url: '/admin/user/details',
		method: 'get',
		params: obj,
	});
}

export function validatePhone(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}
	getDetails({ phone: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('手机号已经存在'));
		} else {
			callback();
		}
	});
}
