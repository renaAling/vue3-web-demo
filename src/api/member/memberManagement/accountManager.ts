import request from '/@/utils/request';

// 会员管理-账户管理分页查询
export const getMemberUserPage = (params?: Object) => {
	return request({
		url: '/uac/memberInfo/memberUserPage',
		method: 'get',
		params,
	});
};

// 后台-会员等级下拉列表
export const getLevelList = () => {
	return request({
		url: '/uac/memberLevel/getLevelList',
		method: 'get',
	});
};

// 会员管理-账户详情ByUnionId
export const getMemberDetail = (unionId?: string) => {
	return request({
		url: `/uac/memberInfo/memberDetail/${unionId}`,
		method: 'get',
	});
};

// 会员管理-通过uid修改用户头像和昵称
export const upDateAvatarAndNickNameByUnionId = (params?: Object) => {
	return request({
		url: `/uac/memberInfo/upDateAvatarAndNickNameByUnionId`,
		method: 'post',
		data: params,
	});
};
// 子系统id列表-账号管理-详情ByUnionId
export const getUserCenter = (unionId: String) => {
	return request({
		url: `/uac/userCenter/${unionId}`,
		method: 'get',
	});
};

// 用户列表-会员管理详情ByUnionId
export const getMemberInfoMemberDetail = (unionId: String) => {
	return request({
		url: `/uac/memberInfo/memberDetail/${unionId}`,
		method: 'get',
	});
};

// 后台-（会员系统用）根据unionId查询用户积分流水
export const getScoreFlowByUnionIdForMember = (params?: Object) => {
	return request({
		url: `/score/score_welfare_account_log/getScoreFlowByUnionIdForMember`,
		method: 'get',
		params,
	});
};

// 新增会员中心会员家庭信息表
export const postMemberFamilyAdd = (params?: Object) => {
	return request({
		url: `/uac/memberFamily/add`,
		method: 'post',
		data: params,
	});
};

// 修改会员中心会员家庭信息表
export const putMemberFamilyUpdate = (params?: Object) => {
	return request({
		url: `/uac/memberFamily/update`,
		method: 'put',
		data: params,
	});
};

// 通过id逻辑删除会员中心会员家庭信息表
export const deleteMemberFamilyDel = (id: number) => {
	return request({
		url: `/uac/memberFamily/del?id=${id}`,
		method: 'delete',
	});
};

// 会员中心用-根据uid查询出行行程
export const getTripRecordForMember = (params?: Object) => {
	return request({
		url: `/ride/cdMetroOrderRecord/getTripRecordForMember`,
		method: 'get',
		data: params,
	});
};

// 后台-(会员中心详情调用)钱包流水明细
export const getWalletFlowForMember = (params?: Object) => {
	return request({
		url: `/mall/walletUser/walletFlowForMember`,
		method: 'get',
		params,
	});
};

// 会员管理-通过手机号查询员工信息详情
export const getMemberStaffInfoByMobile = (mobile?: Object) => {
	return request({
		url: `/uac/memberInfo/memberStaffInfoByMobile?mobile=${mobile}`,
		method: 'get',
	});
};

// 会员系统后台-会员储值账户变动明细表分页查询通用接口
export const getMemberUserStoredLogPage = (params?: Object) => {
	return request({
		url: '/uac/memberUserStoredLog/page',
		method: 'get',
		params,
	});
};
// 会员系统后台-会员授信账户变动明细表分页查询通用接口
export const getMemberUserCreditLogPage = (params?: Object) => {
	return request({
		url: '/uac/memberUserCreditLog/page',
		method: 'get',
		params,
	});
};

// 会员系统后台-平台用户-消费信息
export const getConsumeInfoApi = (unionId?: string) => {
	return request({
		url: `/uac/userCenter/getConsumeInfo?unionId=${unionId}`,
		method: 'get',
	});
};

// 会员系统后台-调用外部接口-给餐食用户充值物理卡
export const synRechargeOrSynCashRechargeApi = (params?: Object) => {
	return request({
		url: `/uac/userEmployee/synRechargeOrSynCashRecharge`,
		method: 'post',
		data: params,
	});
};

// 会员系统后台-会员用户详情tab页-日志记录-1.登录2.注册3.子系统认证4.交易-分页查询
export const getLogByUserApi = (params?: Object) => {
	return request({
		url: '/uac/memberInfo/getLogByUser',
		method: 'get',
		params,
	});
};
