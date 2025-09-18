import request from '/@/utils/request';

// 列表
export function getPickupSiteList(params?: Object) {
	return request({
		url: '/mall/pickup_site/page',
		method: 'get',
		params,
	});
}

// 停用启用
export function statusUpdate(data: any) {
	return request({
		url: '/mall/pickup_site/updateStatus',
		method: 'put',
		data,
	});
}

// 删除
export function siteDelete(id: string) {
	return request({
		url: `/mall/pickup_site/del?id=${id}`,
		method: 'delete',
	});
}

// 详情
export function pickupSiteSaveOrUpdate(formData?: object) {
	return request({
		url: '/mall/pickup_site/saveOrUpdate',
		method: 'post',
		data: formData,
	});
}

// 详情
export function getPickupSiteDetail(id?: string) {
	return request({
		url: `/mall/pickup_site/getDetailById?id=${id}`,
		method: 'get',
	});
}

export function getLocationInfo(address?: string) {
	return request({
		url: `https://apis.map.qq.com/ws/geocoder/v1/?address=${address}&key=QL3BZ-C75LZ-N6JXW-TB6MK-FYHA6-LRFDK&output=jsonp`,
		method: 'get',
	});
}
