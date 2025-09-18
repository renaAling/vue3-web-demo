import request from '/@/utils/request';
// 后台管理-根据协议分组编码查询
export const getListByGroupCode = (params?: Object) => {
	return request({
		url: '/admin/agreement/getListByGroupCode',
		method: 'get',
		params,
	});
};

export const updateProtocol = (params?: Object) => {
	return request({
		url: '/admin/agreement/batch/updateProtocol',
		method: 'put',
		data: params,
	});
};

// 添加协议
export const addProtocol = (params?: Object) => {
	return request({
		url: '/admin/agreement/addProtocol',
		method: 'post',
		data: params,
	});
};
// 积分后台管理-添加协议
export const addProtocolByScore = (params?: Object) => {
	return request({
		url: '/admin/agreement/addProtocolByScore',
		method: 'post',
		data: params,
	});
};
// 后台管理-根据协议Id查询
export const getByProtocolId = (params?: Object) => {
	return request({
		url: '/admin/agreement/getByProtocolId',
		method: 'get',
		params,
	});
};

// 单个编辑
export const updateSingleProtocol = (params?: Object) => {
	return request({
		url: '/admin/agreement/updateProtocol',
		method: 'put',
		data: params,
	});
};

// 积分后台管理-编辑协议
export const updateProtocolByScore = (params?: Object) => {
	return request({
		url: '/admin/agreement/updateProtocolByScore',
		method: 'put',
		data: params,
	});
};

// 删除
export const detAgreement = (id?: string) => {
	return request({
		url: `/admin/agreement/${id}`,
		method: 'delete',
	});
};
// 获取协议版本号
export const getAgreementVersion = (params?: Object) => {
	return request({
		url: '/admin/agreement/getVersion',
		method: 'get',
		params
	});
}
// 分页查询协议
export const getAgreementList = (params?: Object) => {
	return request({
		url: '/admin/agreement/getPageByGroupCode',
		method: 'get',
		params
	});
}

// 分页查询协议
export const getPageByGroupCodeByScore = (params?: Object) => {
	return request({
		url: '/admin/agreement/getPageByGroupCodeByScore',
		method: 'get',
		params
	});
}