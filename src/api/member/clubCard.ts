import request from '/@/utils/request';

// 会员卡管理-会员卡申请列表页
export const getMemberCardApplyPage = (params?: Object) => {
	return request({
		url: '/uac/memberCard/applyPage',
		method: 'get',
		params,
	});
};

// 会员卡管理-查询会员卡管理模式下拉选项
export const getMemberCardModeGetInfos = () => {
	return request({
		url: '/uac/memberCardMode/getInfos',
		method: 'get',
	});
};

// 会员卡管理-申请制卡-用户信息查询
export const getMemberCardQueryUser = (params: any) => {
	return request({
		url: '/uac/memberCard/applyCard/queryUser',
		method: 'get',
		params,
	});
};

// 会员卡管理-申请制卡-添加
export const getMemberCardInsertCard = (params: any) => {
	return request({
		url: '/uac/memberCard/insertCard',
		method: 'post',
		data: params,
	});
};

// 会员卡管理-会员卡审核列表页
export const getMemberCardAuditPage = (params?: Object) => {
	return request({
		url: '/uac/memberCard/auditPage',
		method: 'get',
		params,
	});
};
// 会员卡管理-会员卡-审核
export const getMemberCardAudit = (params?: Object) => {
	return request({
		url: '/uac/memberCard/audit',
		method: 'post',
		data: params,
	});
};

// 会员卡管理-会员卡-撤回申请
export const getMemberCardRevoke = (params?: Object) => {
	return request({
		url: '/uac/memberCard/revoke',
		method: 'post',
		data: params,
	});
};

// 会员卡管理-会员卡-申请-再次申请
export const getMemberCardApplyCard = (params?: Object) => {
	return request({
		url: '/uac/memberCard/applyCard',
		method: 'post',
		data: params,
	});
};

// 会员卡管理-通过id查询(再次申请弹窗回显)
export const getMemberCardGet = (id: number) => {
	return request({
		url: `/uac/memberCard/get?id=${id}`,
		method: 'get',
	});
};

// 会员卡管理-删除
export const getMemberCardDel = (id: number) => {
	return request({
		url: `/uac/memberCard/del?id=${id}`,
		method: 'delete',
	});
};

// 会员卡管理-制卡列表页
export const getMemberCardProgressPage = (params?: Object) => {
	return request({
		url: `/uac/memberCard/cardProgressPage`,
		method: 'get',
		params,
	});
};
// 会员卡管理-制卡列表-更新状态
// export const getMemberCardUpdateStatus = (params?: Object) => {
// 	return request({
// 		url: `/uac/memberCard/updateStatus`,
// 		method: 'put',
// 		data: params,
// 	});
// };
// 会员卡管理-入库绑定卡号
export const getMemberCardInbound = (params?: Object) => {
	return request({
		url: '/uac/memberCard/Inbound',
		method: 'post',
		data: params,
	});
};

// 会员卡管理-卡片管理
export const getMemberCardCardPage = (params?: Object) => {
	return request({
		url: '/uac/memberCard/cardPage',
		method: 'get',
		params,
	});
};

// 会员卡管理-卡片申领取
export const getMemberCardReceive = (params?: Object) => {
	return request({
		url: '/uac/memberCard/receive',
		method: 'post',
		data: params,
	});
};
