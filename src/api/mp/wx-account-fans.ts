/*
 *    Copyright (c) 2018-2025, rls All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: rls
 */

import request from '/@/utils/request';

export function fetchList(query) {
	return request({
		url: '/mp/wx-account-fans/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj) {
	return request({
		url: '/mp/wx-account-fans',
		method: 'post',
		data: obj,
	});
}

export function sync(appId) {
	return request({
		url: '/mp/wx-account-fans/sync/' + appId,
		method: 'post',
	});
}

export function getObj(id) {
	return request({
		url: '/mp/wx-account-fans/' + id,
		method: 'get',
	});
}

export function delObjs(id) {
	return request({
		url: '/mp/wx-account-fans/' + id,
		method: 'delete',
	});
}

export function putObj(obj) {
	return request({
		url: '/mp/wx-account-fans',
		method: 'put',
		data: obj,
	});
}

export function black(obj, appid) {
	return request({
		url: '/mp/wx-account-fans/black/' + appid,
		method: 'post',
		data: obj,
	});
}

export function unblack(obj, appid) {
	return request({
		url: '/mp/wx-account-fans/unblack/' + appid,
		method: 'post',
		data: obj,
	});
}
