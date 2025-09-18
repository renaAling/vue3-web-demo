import request from '/@/utils/request';

// 用户列表-后台-会员等级下拉列表
export const getLevelList = () => {
	return request({
		url: '/uac/memberLevel/getLevelList',
		method: 'get',
	});
};
// 用户列表-会员用户管理-分页查询
export const pageMemberList = (params?: Object) => {
	return request({
		url: '/uac/memberInfo/memberUserPage',
		method: 'get',
		params,
	});
};
// 用户列表-会员管理详情ByUnionId
export const getMemberDetail = (id: String) => {
	return request({
		url: `/uac/memberInfo/memberDetail/${id}`,
		method: 'get',
	});
};
// 用户列表-编辑会员用户信息
export const upDateAvatarAndNickNameByUnionId = (params: any) => {
	return request({
		url: '/uac/memberInfo/upDateAvatarAndNickNameByUnionId',
		method: 'post',
		data: params,
	});
};
//用户列表-后台-通过手机号查询员工信息详情
export const getMemberStaffInfoByMobile = (mobile: string) => {
	return request({
		url: `/uac/memberInfo/memberStaffInfoByMobile?mobile=${mobile}`,
		method: 'get',
	});
};
//用户列表-后台-会员详情员工流水
export const getMemberStaffWalletFlow = (params?: Object) => {
	return request({
		url: '/mall/walletUser/walletFlowForMember',
		method: 'get',
		params,
	});
};
// 用户列表-成长值明细
export const getPageByUnionId = (params?: Object) => {
	return request({
		url: '/uac/memberGrowthLog/pageByUnionId',
		method: 'get',
		params,
	});
};
//用户列表-获取用户积分明细数据
export const getFindScoreFlowByUnionId = (params: any) => {
	return request({
		url: `/score/score_welfare_account_log/findScoreFlowByUnionId`,
		method: 'get',
		params,
	});
};
//用户列表-获取用户登录信息明细表
export const getPageForMember = (params: any) => {
	return request({
		url: `/uac/userLoginLog/getPageForMember`,
		method: 'get',
		params,
	});
};
//用户列表-会员等级详情
export const getUserLevelInfoByUnionId = (unionId: string) => {
	return request({
		url: `/uac/userLevel/getUserLevelInfoByUnionId?unionId=${unionId}`,
		method: 'get',
	});
};
// 用户列表-新增会员中心会员家庭信息表
export const postMemberFamilyAdd = (params: Object) => {
	return request({
		url: '/uac/memberFamily/add',
		method: 'post',
		data: params,
	});
};
// 用户列表-修改会员中心会员家庭信息表
export const postMemberFamilyUpdate = (params: Object) => {
	return request({
		url: '/uac/memberFamily/update',
		method: 'put',
		data: params,
	});
};
// 用户列表-通过id逻辑删除会员中心会员家庭信息表
export const deleteMemberFamilyDel = (id: number) => {
	return request({
		url: `/uac/memberFamily/del?id=${id}`,
		method: 'delete',
	});
};

// 获取会员成长列表
export const getGrowthList = () => {
	return request({
		url: '/uac/memberGrowthManage/getGrowthList',
		method: 'get',
	});
};

// 会员标签-获取会员标签列表
export const pageLabelList = (params?: Object) => {
	return request({
		url: '/uac/memberSign/page',
		method: 'get',
		params,
	});
};
// 会员分组-获取会员分组列表
export const pageGroupList = (params?: Object) => {
	return request({
		url: '/uac/memberGroup/page',
		method: 'get',
		params,
	});
};
// 会员分组-新增会员中心会员分组信息表
export const pageGroupaAdd = (params?: Object) => {
	return request({
		url: '/uac/memberGroup/add',
		method: 'post',
		data: params,
	});
};
// 会员分组-编辑会员中心会员分组信息表
export const pageGroupaUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberGroup/update',
		method: 'put',
		data: params,
	});
};
// 会员分组-通过id逻辑删除会员中心会员分组信息表
export const pageGroupaDel = (id?: number) => {
	return request({
		url: `/uac/memberGroup/del?id=${id}`,
		method: 'delete',
	});
};
// 会员分组-分页查询会员分组与用户关联信息表
export const pageMemberGroupInfoPage = (params?: Object) => {
	return request({
		url: `/uac/memberGroupInfo/page`,
		method: 'get',
		params,
	});
};
// 会员分组-通过id逻辑删除会员分组与用户关联信息表
export const pageMemberGroupInfoDel = (id?: number) => {
	return request({
		url: `/uac/memberGroupInfo/del?id=${id}`,
		method: 'delete',
	});
};
// 优惠券发行-会员中心用户基本信息查询ByUnionId
export const getUserInfoByUnionIdForMember = (unionId?: string) => {
	return request({
		url: `/uac/memberCoupon/getUserInfoByUnionIdForMember?unionId=${unionId}`,
		method: 'get',
	});
};
// 会员分组-通过id添加手机号
export const pageMemberGroupInfoUpDate = (params?: Object) => {
	return request({
		url: '/uac/memberGroupInfo/upDate',
		method: 'post',
		data: params,
	});
};
// 会员分组-批量导入会员分组信息
export const pageMemberGroupInfoImport = (params?: Object) => {
	return request({
		url: '/uac/memberGroupInfo/import',
		method: 'post',
		data: params,
	});
};
// 会员标签-获取会员标签分页查询
export const pageSignList = (params?: Object) => {
	return request({
		url: '/uac/memberSign/page',
		method: 'get',
		params,
	});
};
// 会员标签-新增会员中心会员标签信息表
export const pageSignAdd = (params?: Object) => {
	return request({
		url: '/uac/memberSign/add',
		method: 'post',
		data: params,
	});
};
// 会员标签-通过id添加手机号
export const pageMemberSignInfoUpDate = (params?: Object) => {
	return request({
		url: '/uac/memberSignInfo/upDate',
		method: 'post',
		data: params,
	});
};
// 会员标签-编辑会员中心会员分组信息表
export const pageSignUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberSign/update',
		method: 'put',
		data: params,
	});
};
// 会员标签-通过id逻辑删除会员中心会员标签信息表
export const pageSignInfoDel = (id?: number) => {
	return request({
		url: `/uac/memberSign/del?id=${id}`,
		method: 'delete',
	});
};
// 会员标签-分页查询会员中心标签与用户关联信息表
export const pageMemberSignInfoPage = (params?: Object) => {
	return request({
		url: `/uac/memberSignInfo/page`,
		method: 'get',
		params,
	});
};
// 会员标签-通过id逻辑删除会员中心标签与用户关联信息表
export const pageMemberSignInfoDel = (id?: number) => {
	return request({
		url: `/uac/memberSignInfo/del?id=${id}`,
		method: 'delete',
	});
};
// /member/signConfig
// 签到配置-连续签到列表查询
export const pageMemberSignConfigList = (params?: Object) => {
	return request({
		url: `/uac/memberSignConfig/List`,
		method: 'get',
		params,
	});
};

// 签到配置-新增会员中心连续签到配置信息表
export const pageMemberSignConfigAdd = (params?: Object) => {
	return request({
		url: `/uac/memberSignConfig/add`,
		method: 'post',
		data: params,
	});
};
// 签到配置-修改会员中心连续签到配置信息表
export const pageMemberSignConfigUpdate = (params?: Object) => {
	return request({
		url: `/uac/memberSignConfig/update`,
		method: 'put',
		data: params,
	});
};
// 签到配置-修改会员中心连续签到配置信息表
export const pageMemberSignConfigDel = (id?: number) => {
	return request({
		url: `/uac/memberSignConfig/del?id=${id}`,
		method: 'delete',
	});
};

// 会员等级-会员等级分页查询
export const getMemberLevelist = (params?: Object) => {
	return request({
		url: '/uac/memberLevel/page',
		method: 'get',
		params,
	});
};

// 会员等级-新增Or更新会员等级
export const getMemberLeveSaveOrUpdate = (params?: Object) => {
	return request({
		url: '/uac/memberLevel/saveOrUpdate',
		method: 'post',
		data: params,
	});
};
// 会员等级-成长值管理查询
export const getMemberGrowthManageGrowthList = () => {
	return request({
		url: '/uac/memberGrowthManage/getGrowthList',
		method: 'get',
	});
};




// 旧
export const pageList = (params?: Object) => {
	return request({
		url: '/uac/userCenter/memberUserPage',
		method: 'get',
		params,
	});
};
// 会员用户新建
// 旧
export const createMemberUser = (obj: Object) => {
	return request({
		url: '/uac/userCenter/saveMemberUser',
		method: 'post',
		data: obj,
	});
};
// 列表
export const groupPage = (params?: Object) => {
	return request({
		url: '/uac/memberGroup/page',
		method: 'get',
		params,
	});
};
// 新增
export const addGroup = (obj?: Object) => {
	return request({
		url: '/uac/memberGroup/addGroup',
		method: 'post',
		data: obj,
	});
};
// 编辑
export const updateGroup = (obj?: Object) => {
	return request({
		url: '/uac/memberGroup/updateGroup',
		method: 'put',
		data: obj,
	});
};
//删除
export const delGroup = (id: String) => {
	return request({
		url: `/uac/memberGroup/delete/${id}`,
		method: 'delete',
	});
};
// 签到配置
// 查询
export const getSignConfig = (params?: Object) => {
	return request({
		url: '/uac/memberSignConfig/getSignConfig',
		method: 'get',
		params,
	});
};
// 编辑
export const updateSignConfig = (obj?: Object) => {
	return request({
		url: '/uac/memberSignConfig/updateSignConfig',
		method: 'post',
		data: obj,
	});
};
// 删除
export const delSignConfig = (id: String) => {
	return request({
		url: `/uac/memberSignConfig/delete/${id}`,
		method: 'delete',
	});
};

// 子系统id列表-账号管理-详情ByUnionId
export const getUserCenter = (unionId: String) => {
	return request({
		url: `/uac/userCenter/${unionId}`,
		method: 'get',
	});
};
