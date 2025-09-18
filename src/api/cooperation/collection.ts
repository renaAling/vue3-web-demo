import request from '/@/utils/request';

export function bizMessagePageApi(params: Object) {
  return request({
    url: '/business/biz/message/page',
    method: 'GET',
    params,
  });
}

export function bizConfigPageApi(params: Object) {
  return request({
    url: '/business/biz/config/page',
    method: 'GET',
    params,
  });
}

export function bizConfigUpdateApi(data: Object) {
  return request({
    url: '/business/biz/config/update',
    method: 'PUT',
    data,
  });
}

export function bizConfigInfoApi(code: String) {
	return request({
		url: `/business/biz/config/get?code=${code}`,
		method: 'GET',
	});
}
