import request from '/@/utils/request';

// 会员中心后台-成长值管理查询
export const getMemberGrowthManageGrowthList = (params?: Object) => {
	return request({
		url: '/uac/memberGrowthManage/getGrowthList',
		method: 'get',
		params,
	});
};

// 会员中心后台-新增成长值管理
export const postMemberGrowthManageAdd = (params?: Object) => {
	return request({
		url: '/uac/memberGrowthManage/add',
		method: 'post',
		data: params,
	});
};

// 会员中心后台-编辑成长值管理
export const postMemberGrowthManageUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberGrowthManage/update',
		method: 'post',
		data: params,
	});
};

// 会员中心后台-通过id查询成长值管理
export const getMemberGrowthManageGet = (params?: Object) => {
	return request({
		url: '/uac/memberGrowthManage/get',
		method: 'get',
		data: params,
	});
};

// App-小程序签到隐藏配置获取
export const getHideConfigApi = () => {
	return request({
		url: '/uac/memberSignSwitch/get',
		method: 'get',
	});
};

// 修改会员签到开关
export const putMemberSignSwitchUpdateApi = (params?: Object) => {
	return request({
		url: '/uac/memberSignSwitch/update',
		method: 'put',
		data: params,
	});
};

// 新增或编辑会员中心系统签到配置信息表
export const postSaveOrUpdateApi = (params?: Object) => {
	return request({
		url: '/uac/memberSignConfig/saveOrUpdate',
		method: 'post',
		data: params,
	});
};

// 会员中心连续签到列表查询
export const getMemberSignConfigList = () => {
	return request({
		url: '/uac/memberSignConfig/List',
		method: 'get',
	});
};

