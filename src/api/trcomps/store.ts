import request from '/@/utils/request';
// 公共前缀
const prefix = '/tracomps-admin/api/admin/platform';

// 门店列表
export function storePageApi(params?: Object) {
	return request({
		url: `${prefix}/store/page`,
		method: 'get',
		params,
	});
}
// 更新门店状态
export function storeUpdateStatusApi(data?: Object) {
	return request({
		url: `${prefix}/store/updateStatus`,
		method: 'post',
		data,
	});
}

// 门店绑定商铺
export function storeBindApi(data?: Object) {
	return request({
		url: `${prefix}/store/bind`,
		method: 'put',
		data,
	});
}

// 门店解绑商铺
export function storeUnbindApi(params?: Object) {
	return request({
		url: `${prefix}/store/unbind`,
		method: 'get',
		params,
	});
}

// 更新门店排序
export function storeUpdateSortApi(data?: Object) {
	return request({
		url: `${prefix}/store/updateSort`,
		method: 'post',
		data,
	});
}

// 保存和更新门店
export function storeSaveOrUpdateApi(data?: Object) {
	return request({
		url: `${prefix}/store/saveOrUpdate`,
		method: 'post',
		data,
	});
}

// 导入门店
export function storeImportApi(data?: Array<any>) {
	return request({
		url: `${prefix}/store/import`,
		method: 'post',
		data,
	});
}

// 获取门店详情
export function storeDetailApi(id?: any) {
	return request({
		url: `${prefix}/store/getDetailById?id=${id}`,
		method: 'post',
	});
}

// 删除
export function storeDelApi(id?: any) {
	return request({
		url: `${prefix}/store/del?id=${id}`,
		method: 'delete',
	});
}
// 门店品类
export const getCategoryApi = () => {
	return request({
		url: `${prefix}/category/getCategory`,
		method: 'get',
	});
};

// 非渠道商家列表
export const notChannelMerchantApi = (params?: Object) => {
	return request({
		url: `${prefix}/merchant/getNotChannelMerchant`,
		method: 'get',
		params,
	});
};

// 获取地铁线路
export const subwayListApi = () => {
	return request({
		url: `${prefix}/line/getSubway`,
		method: 'get',
	});
};

// 获取地铁站点
export const subwayLikeListApi = () => {
	return request({
		url: `${prefix}/subway/getSubwayLike`,
		method: 'get',
	});
};
// 推荐门店 奇票
export const updateRecommendStatusApi = (data: object) => {
	return request({
		url: `${prefix}/store/updateRecommendStatus`,
		method: 'put',
		data,
	});
};