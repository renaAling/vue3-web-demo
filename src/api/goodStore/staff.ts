import request from '/@/utils/request';
// 公共前缀
const prefix = '/mall';

// 获取员工列表
export function getStaffList(params?: object) {
	return request({
		url: prefix + '/gs_staff/page',
		method: 'get',
		params,
	});
}

// 删除指定员工
export function deleteStaff(id: number) {
	return request({
		url: prefix + `/gs_staff/delStaff?id=${id}`,
		method: 'delete',
	});
}

// 获取商户列表
export function fetchMerchantList() {
	return request({
		url: prefix + '/gs_staff/getMerchantScope',
		method: 'get',
	});
}

// 获取门店列表
export function getStoreList(params?: object) {
	return request({
		url: prefix + '/store/getStoreByMerchantCode',
		method: 'get',
		params,
	});
}

// 获取岗位列表
export function fetchRoleList() {
	return request({
		url: prefix + '/gs_staff/getRolesPost',
		method: 'get',
	});
}

// 新增/编辑员工信息
export function saveOrUpdateStaffInfo(data?: object) {
	return request({
		url: prefix + '/gs_staff/saveOrUpdate',
		method: 'post',
		data,
	});
}

// 员工信息详情
export function staffDetail(id: string) {
	return request({
		url: prefix + `/gs_staff/getStaffDetail?id=${id}`,
		method: 'get',
	});
}

// 启用/禁用 用户
export function switchUser(data: any) {
	return request({
		url: prefix + `/gsMerchantUser/isEnable`,
		method: 'post',
		data,
	});
}
