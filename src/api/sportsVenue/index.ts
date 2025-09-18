import request from '/@/utils/request';

// 用户分页
export function appEmployeePageApi(params: Object) {
  return request({
    url: '/stadium/app/employee/page',
    method: 'GET',
    params,
  });
}

// 加入-移出黑名单
export function appEmployeeUpdateApi(data: Object) {
  return request({
    url: '/stadium/app/employee/update',
    method: 'PUT',
    data,
  });
}

export function appEmployeeInfoApi(userId: String) {
	return request({
		url: `/stadium/app/employee/get?userId=${userId}`,
		method: 'GET',
	});
}

// 账号分页
export function employeePageApi(params: Object) {
  return request({
    url: '/stadium/admin/employee/page',
    method: 'GET',
    params,
  });
}

export function employeeUpdateApi(data: Object) {
  return request({
    url: '/stadium/admin/employee/update',
    method: 'PUT',
    data,
  });
}

export function employeeAddApi(data: Object) {
  return request({
    url: '/stadium/admin/employee/add',
    method: 'POST',
    data,
  });
}

export function employeeInfoApi(userId: String) {
	return request({
		url: `/stadium/admin/employee/get?userId=${userId}`,
		method: 'GET',
	});
}

export function deleteEmployeeApi(id: String) {
  return request({
    url: `/stadium/admin/employee/del?id=${id}`,
    method: 'DELETE',
  });
}

// 根据guid/员工号/手机号获取其他信息
export function queryUserTestApi(data: Object) {
  return request({
    url: '/mall/walletUser/queryUserTest',
    method: 'POST',
    data,
  });
}

// 场馆模块
export function stadiumPageApi(params: Object) {
  return request({
    url: '/stadium/stadium/page',
    method: 'GET',
    params,
  });
}

export function stadiumAddApi(data: Object) {
  return request({
    url: '/stadium/stadium/add',
    method: 'POST',
    data,
  });
}

export function stadiumUpdateApi(data: Object) {
  return request({
    url: '/stadium/stadium/update',
    method: 'PUT',
    data,
  });
}

export function stadiumInfoApi(code: String) {
	return request({
		url: `/stadium/stadium/get?code=${code}`,
		method: 'GET',
	});
}

export function deleteStadium(code: String) {
	return request({
		url: `/stadium/stadium/del?code=${code}`,
		method: 'DELETE',
	});
}

export function stadiumUpdateSortApi(data: Object) {
  return request({
    url: '/stadium/stadium/updateSort',
    method: 'POST',
    data,
  });
}

export function stadiumSiteLabelApi(stadiumCode: String) {
	return request({
		url: `/stadium/stadium/config/getListByStadiumCode?stadiumCode=${stadiumCode}`,
		method: 'GET',
	});
}

export function stadiumSiteDetailApi(params: Object) {
	return request({
		url: '/stadium/stadium/site/detail/getDetail',
		method: 'GET',
    params
	});
}

// 订单模块
export function orderPageApi(params: Object) {
  return request({
    url: '/stadium/order/page',
    method: 'GET',
    params,
  });
}

export function stadiumSiteDetailCodeApi(stadiumSiteDetailCode: String) {
	return request({
		url: `/stadium/order/getByStadiumSiteDetailCode?stadiumSiteDetailCode=${stadiumSiteDetailCode}`,
		method: 'GET',
	});
}

export function orderDetailApi(orderCode: String) {
	return request({
		url: `/stadium/order/get?orderCode=${orderCode}`,
		method: 'GET',
	});
}

export function confirmAttendanceApi(orderCode: String) {
	return request({
		url: `/stadium/order/confirm/attendance?orderCode=${orderCode}`,
		method: 'GET',
	});
}

export function cancelOrderApi(orderCode: String) {
	return request({
		url: `/stadium/order/cancel?orderCode=${orderCode}`,
		method: 'GET',
	});
}

export function getByKeyApi() {
	return request({
		url: `/stadium/system/config/getByKey?key=WAITING_STARTED_ORDER_MAX_LIMIT`,
		method: 'GET',
	});
}

export function updateConfigApi(data: Object) {
  return request({
    url: '/stadium/system/config/update',
    method: 'PUT',
    data,
  });
}

export function siteUpdateStatusApi(data: Object) {
  return request({
    url: '/stadium/stadium/site/detail/updateStatus',
    method: 'POST',
    data,
  });
}
