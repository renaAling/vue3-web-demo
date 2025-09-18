import request from '/@/utils/request';

export const list = (params?: Object) => {
	return request({
		url: '/admin/role/list',
		method: 'get',
		params,
	});
};

export const pageList = (params?: Object) => {
	return request({
		url: '/admin/role/page',
		method: 'get',
		params,
	});
};

export const deptRoleList = () => {
	return request({
		url: '/admin/role/list',
		method: 'get',
	});
};

export const getObj = (id: string) => {
	return request({
		url: '/admin/role/details/' + id,
		method: 'get',
	});
};
export const getObjTenantId = (id: string, tenantId: string) => {
	return request({
		url: '/admin/role/details/' + id + '?tenantId=' + tenantId,
		method: 'get',
	});
};

export const getObjDetailsTenantId = (obj: object, tenantId: string) => {
	return request({
		url: '/admin/role/details?tenantId=' + tenantId,
		method: 'get',
		params: obj,
	});
};
export const getObjDetails = (obj: object) => {
	return request({
		url: '/admin/role/details',
		method: 'get',
		params: obj,
	});
};

export const addObj = (obj: Object, id?: string) => {
	let url = '/admin/role';
	if (id) {
		url = url + '?tenantId=' + id;
	}
	return request({
		url: url,
		method: 'post',
		data: obj,
	});
};
export const addObjTenantId = (obj: Object, id?: string) => {
	let url = '/admin/role/member/add?tenantId=' + id;
	return request({
		url: url,
		method: 'post',
		data: obj,
	});
};

export const putObj = (obj: Object) => {
	let url = '/admin/role';
	return request({
		url: url,
		method: 'put',
		data: obj,
	});
};
export const putObjTenantId = (obj: Object, id?: string) => {
	let url = '/admin/role/member/update?tenantId=' + id;
	return request({
		url: url,
		method: 'put',
		data: obj,
	});
};

export const delObj = (ids: Object) => {
	let url = '/admin/role';
	return request({
		url: url,
		method: 'delete',
		data: ids,
	});
};

export const delObjTenantId = (ids: Object, tenantId?: string) => {
	let url = '/admin/role/member/del?tenantId=' + tenantId;
	return request({
		url: url,
		method: 'delete',
		data: ids,
	});
};

export const permissionUpd = (roleId: string, menuIds: string) => {
	return request({
		url: '/admin/role/menu',
		method: 'put',
		data: {
			roleId: roleId,
			menuIds: menuIds,
		},
	});
};

export const updateRoleMenusByMemberApi = (roleId: string, menuIds: string, tenantId: string) => {
	return request({
		url: 'admin/role/updateRoleMenusByMember' + '?tenantId=' + tenantId,
		method: 'put',
		data: {
			roleId: roleId,
			menuIds: menuIds,
		},
	});
};
export const fetchRoleTree = (roleId: string, tenantId: string) => {
	let url = '/admin/menu/tree/' + roleId;
	if (tenantId) {
		url = url + '?tenantId=' + tenantId;
	}
	return request({
		url: url,
		method: 'get',
	});
};
// 会员用的
export const pageTreeList = (tenantId: string) => {
	return request({
		url: '/admin/menu/tree?tenantId=' + tenantId,
		method: 'get',
	});
};
export function validateRoleCode(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ roleCode: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('角色标识已经存在'));
		} else {
			callback();
		}
	});
}

export function validateRoleCodeTenantId(rule: any, value: any, callback: any, isEdit: boolean,tenantId: string) {
	if (isEdit) {
		return callback();
	}

	getObjDetailsTenantId({ roleCode: value }, tenantId).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('角色标识已经存在'));
		} else {
			callback();
		}
	});
}


export function validateRoleName(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ roleName: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('角色名称已经存在'));
		} else {
			callback();
		}
	});
}

export function validateRoleNameTenantId(rule: any, value: any, callback: any, isEdit: boolean, tenantId: string) {
	if (isEdit) {
		return callback();
	}

	getObjDetailsTenantId({ roleName: value }, tenantId).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('角色名称已经存在'));
		} else {
			callback();
		}
	});
}
