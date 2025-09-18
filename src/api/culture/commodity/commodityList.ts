import request from '/@/utils/request';
const isMerchant = import.meta.env.VITE_IS_MERCHANT;
console.log('isMerchantmeta.env', isMerchant);
//  商品列表

export function productLstApi(params: object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/product/list' : '/tracomps-admin/api/admin/platform/product/list';
	return request({
		url,
		method: 'GET',
		params,
	});
}
/**
 * 商品详情
 * @param pram
 */
export function productDetailApi(id: number) {
	const url = isMerchant ? `/tracomps-admin/api/admin/merchant/product/getInfo/${id}` : `/tracomps-admin/api/admin/platform/product/info/${id}`;
	return request({
		url,
		method: 'GET',
	});
}
/**
 * 商品强制下架
 * @param pram
 */
export function offShellApi(params: any) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/product/batch/down' : '/tracomps-admin/api/admin/platform/product/force/down';
	const obj = { idList: params.idList.join(',') }; //平台端用逗号隔开，商户端传数组
	return request({
		url,
		method: 'post',
		data: isMerchant ? params : obj,
	});
}

/**
 * 商品上架
 * @param pram
 */
export function onShellApi(params: object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/product/batch/up' : '/tracomps-admin/api/admin/platform/product/batch/up';
	return request({
		url,
		method: 'post',
		data: params,
	});
}

/**
 * 商品列表 表头数量
 */
export function productHeadersApi(params: object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/product/tabs/headers' : '/tracomps-admin/api/admin/platform/product/tabs/headers';
	return request({
		url,
		method: 'GET',
		params,
	});
}
/**
 * 商品列表 导出
 * @param pram
 */
export function productExcelApi(params: object) {
	return request({
		url: `/tracomps-admin/api/admin/export/excel/product`,
		method: 'get',
		params,
	});
}
/**
 * 修改商品
 * @param pram
 */
export function updateProductApi(params: object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/update`,
		method: 'post',
		data: params,
	});
}
/**
 * 商户 列表
 */
export function merchantListApi(params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/merchant/list',
		method: 'get',
		params,
	});
}
/**
 * @description 商户端物流运费模板列表
 */
export function getShippingTemplatesList(id?: any) {
	const data = {
		merId: id ? id : '',
		keywords: '',
		current: 1,
		size: 9999,
	};
	return request({
		url: '/tracomps-admin/api/admin/merchant/shipping/templates/list',
		method: 'get',
		params: { ...data },
	});
}

/**
 * 保障服务 列表
 * @param pram
 */
export function guaranteeListApi(params?: object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/guarantee/list`,
		method: 'get',
		params,
	});
}
export function merProductClassify(merId: number) {
	return request({
		url: `/tracomps-admin/api/admin/merchant/store/product/category/cache/tree/${merId}`,
		method: 'GET',
	});
}
// 皮肤管理
export function skinListApi(params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/skin/page',
		method: 'get',
		params,
	});
}
/**
 * 编辑商品
 * @param pram
 */
export function productUpdateApi(params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/product/platUpdate',
		method: 'post',
		data: params,
	});
}
/**
 * 新增商品
 * @param pram
 */
export function productCreateApi(params: object) {
	const url = isMerchant ? '/tracomps-admin/api/admin/merchant/product/save' : '/tracomps-admin/api/admin/platform/product/save';
	return request({
		url,
		method: 'POST',
		data: params,
	});
}
// /**
//  * 商品可用优惠券列表
//  * @param pram
//  */
// export function productCouponListApi(params: object) {
// 	return request({
// 		url: '/tracomps-admin/api/admin/platform/coupon/product/usable/list',
// 		method: 'get',
// 		params,
// 	});
// }
/**
 * 优惠券 可发送优惠券列表
 * @param pram
 */
export function canSendListApi(params: object) {
	return request({
		url: '/tracomps-admin/api/admin/platform/coupon/can/send/list',
		method: 'get',
		params,
	});
}
/**
 * 商品分类 分类缓存树
 * @param pram
 */
export function productCategoryApi(params?: object) {
	const url = isMerchant
		? '/tracomps-admin/api/admin/merchant/plat/product/category/cache/tree'
		: '/tracomps-admin/api/admin/platform/product/category/cache/tree';
	return request({
		url,
		method: 'GET',
		params,
	});
}
/**
 * 品牌缓存列表(全部)
 * @param pram
 */
export function brandListAllApi() {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/brand/cache/list`,
		method: 'get',
	});
}
/**
 * 商品审核
 * @param pram
 */
export function productAuditApi(params: object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/audit`,
		method: 'post',
		data: params,
	});
}
/**
 * 平台端批量商品审核
 * @returns {*}
 */
export function productBatchAuditApi(params: object) {
	return request({
		url: `/tracomps-admin/api/admin/platform/product/batch/audit`,
		method: 'post',
		data: params,
	});
}
/**
 * 图片上传
 * @param data
 */
export function fileImageApi(data: any, params: any) {
	return request({
		url: '/tracomps-admin/api/admin/platform/upload/image',
		method: 'post',
		params,
		data,
	});
}

/** tree去除 childList=[] 的结构**/
export function changeNodes(data: any) {
	if (data.length > 0) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].isShow === false) {
				data[i].disabled = true;
			}
			if (!data[i].childList || data[i].childList.length < 1) {
				data[i].childList = undefined;
			} else {
				changeNodes(data[i].childList);
			}
		}
	}
	return data;
	// return request({
	// 	url: `/tracomps-admin/api/admin/merchant/store/product/category/cache/tree/${merId}`,
	// 	method: 'GET',
	// });
}

/**
 *替换安全域名
 */
export function setDomain(url: string) {
	url = url ? url.toString() : '';
	// 正则替换存在的转义符
	url = url.replace(/\\/g, '');
	url = window.location.protocol === 'https:' ? url.replace('http://', 'https://') : url;
	if (url.startsWith('src="')) {
		url = url.replaceAll('src="', '');
	}
	if (url.startsWith('//img') && window.location.protocol === 'https:') {
		url = url.replace('//img', 'https://img');
	}
	return url;
}
/**
 *过滤富文本中的 img 相对路径访问
 */
export function replaceImgSrcHttps(content: any) {
	return content.replaceAll('src="//', 'src="https://');
}
/**
 *  供应链全境富文本图片处理
 * @param data 拿到的数组
 */
export function objToRichText(data: any) {
	// <p><img src=\"https://oss.duomixing.com/rls/b/qy9YaANav1xSMEeYHyXf.png\" alt=\"\" data-href=\"\" style=\"\"/><img src=\"https://oss.duomixing.com/rls/b/4aAc3La6Wyoe4iZGYucn.png\" alt=\"\" data-href=\"\" style=\"\"/></p>
	if (data.length > 0) {
		let content = '<p>';
		data.forEach((item: any) => {
			content += `<img src=\"${item}" alt=\"\" data-href=\"\" style=\"\"/>`;
		});
		return content + '</p>';
	} else {
		return '';
	}
}
// 商品上架
export function onShell(data: any) {
	const url = isMerchant ? `/tracomps-admin/api/admin/merchant/product/up/${data.id}` : `/tracomps-admin/api/admin/platForm/product/up/${data.id}`;
	return request({
		url,
		method: 'post',
	});
}
// 商品下架
export function offShell(data: any) {
	const url = isMerchant
		? `/tracomps-admin/api/admin/merchant/product/down/${data.id}`
		: `/tracomps-admin/api/admin/platForm/product/down/${data.id}`;
	return request({
		url,
		method: 'post',
	});
}
// 提交审核
export function submitAudit(data: any) {
	return request({
		url: `tracomps-admin/api/admin/merchant/product/submit/audit`,
		method: 'post',
		data,
	});
}

// 未关联卡密库列表
export function cdkeListApi(params?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/merchant/cdkey/library/unrelated/list',
		method: 'get',
		params,
	});
}

// 供应链-查询封装商品信息
export function getSpuInfoApi(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/supplyChain/getSpuInfo',
		method: 'post',
		data,
	});
}

// 供应链-同步三方图片数据查询spu商品详情
export function getSpuBySpuIdApi(data?: Object) {
	return request({
		url: '/tracomps-admin/api/admin/supplyChain/getSpuBySpuId',
		method: 'post',
		data,
	});
}