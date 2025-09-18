import request from '/@/utils/request';

// 会员类型
export function memberPageApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/paid/member/page',
		method: 'GET',
		params,
	});
}

export function memberListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/paid/member/list',
		method: 'GET',
		params,
	});
}

export function addMemberCardApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/paid/member/card/add',
    method: 'POST',
    data,
  });
}

export function editMemberCardApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/platform/paid/member/card/edit',
    method: 'POST',
    data,
  });
}


export function switchMemberCardApi(id: String) {
  return request({
    url: `/tracomps-admin/api/admin/platform/paid/member/card/switch/${id}`,
    method: 'POST',
  });
}

export function deleteMemberCardApi(id: String) {
  return request({
    url: `/tracomps-admin/api/admin/platform/paid/member/card/delete/${id}`,
    method: 'POST',
  });
}

// 会员权益
export function benefitPageApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/paid/member/benefit/page',
		method: 'GET',
		params,
	});
}

export function switchBenefitApi(data: object) {
  return request({
    url: '/tracomps-admin/api/admin/paid/member/benefit/updateStatus',
    method: 'PUT',
    data
  });
}

export function deleteBenefitApi(id: String) {
  return request({
    url: `/tracomps-admin/api/admin/paid/member/benefit/del?id=${id}`,
    method: 'DELETE',
  });
}

export function getBenefitInfoApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/paid/member/benefit/get?id=${id}`,
		method: 'GET',
	});
}

export function addBenefitApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/paid/member/benefit/add',
    method: 'POST',
    data,
  });
}

export function editBenefitApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/paid/member/benefit/update',
    method: 'PUT',
    data,
  });
}

// 优惠券列表
export function couponListApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/coupon/can/send/list',
		method: 'GET',
		params,
	});
}

// 会员卡密
export function paidMemberCdkeyPageApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/paidMemberCdkey/page',
		method: 'GET',
		params,
	});
}

export function paidMemberCdkeyInfoApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/paidMemberCdkey/get?id=${id}`,
		method: 'GET',
	});
}

export function paidMemberCdkeyDetailApi(id:any) {
	return request({
		url: `/tracomps-admin/api/admin/paidMemberCdkey/getDetail?id=${id}`,
		method: 'GET',
	});
}

export function addPaidMemberCdkeyApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/paidMemberCdkey/add',
    method: 'POST',
    data,
  });
}

export function editPaidMemberCdkeyApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/paidMemberCdkey/update',
    method: 'PUT',
    data,
  });
}

export function switchPaidMemberCdkeyApi(data: object) {
  return request({
    url: '/tracomps-admin/api/admin/paidMemberCdkey/updateStatus',
    method: 'PUT',
    data
  });
}

export function deletePaidMemberCdkeyApi(id: String) {
  return request({
    url: `/tracomps-admin/api/admin/paidMemberCdkey/del?id=${id}`,
    method: 'DELETE',
  });
}

// 会员记录
export function getOrderPageApi(params: Object) {
	return request({
		url: '/tracomps-admin/api/admin/paidMemberUser/getOrderPage',
		method: 'GET',
		params,
	});
}
