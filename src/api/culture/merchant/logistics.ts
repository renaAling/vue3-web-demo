import request from '/@/utils/request';

/**
 * @description 全部物流公司
 */
export function expressAllApi(params) {
  return request({
    url: '/tracomps-admin/api/admin/merchant/express/all',
    method: 'get',
    params,
  });
}

/**
 * @description 物流运费模板列表
 */
export function shippingTemplatesList(data) {
  return request({
    url: '/tracomps-admin/api/admin/merchant/shipping/templates/list',
    method: 'get',
    params: { ...data },
  });
}

/**
 * @description 物流运费模板详情
 */
export function templateDetailApi(data) {
  return request({
    url: `/tracomps-admin/api/admin/merchant/shipping/templates/info/${data.id}`,
    method: 'get',
  });
}

/**
 * @description 物流运费模板新增
 */
export function shippingSave(data) {
  return request({
    url: '/tracomps-admin/api/admin/merchant/shipping/templates/save',
    method: 'post',
    data,
  });
}

/**
 * @description 物流运费模板更新
 */
export function shippingUpdate(data) {
  return request({
    url: '/tracomps-admin/api/admin/merchant/shipping/templates/update',
    method: 'post',
    data,
  });
}

/**
 * @description 物流运费模板删除
 */
export function shippingDetete(data) {
  return request({
    url: `/tracomps-admin/api/admin/merchant/shipping/templates/delete/${data.id}`,
    method: 'POST',
  });
}

/**
 * @description 城市列表
 */
export function cityListTree() {
  return request({
    url: '/tracomps-admin/api/admin/merchant/city/region/city/tree',
    method: 'get',
  });
}

/**
 * @description 查询物流公司面单模板
 */
export function exportTempApi(params) {
  return request({
    url: '/tracomps-admin/api/admin/merchant/express/template',
    method: 'get',
    params,
  });
}

/**
 * @description 商户物流公司默认开关
 */
export function expressDefaultAwitchApi(id) {
  return request({
    url: `/tracomps-admin/api/admin/merchant/express/default/switch/${id}`,
    method: 'post',
  });
}

/**
 * @description 商户物流公司删除
 */
export function expressDeleteApi(id) {
  return request({
    url: `/tracomps-admin/api/admin/merchant/express/delete/${id}`,
    method: 'post',
  });
}

/**
 * @description 商户物流公司开关
 */
export function expressOpenSwitchApi(id) {
  return request({
    url: `/tracomps-admin/api/admin/merchant/express/open/switch/${id}`,
    method: 'post',
  });
}

/**
 * @description 商户关联物流公司
 */
export function expressRelateApi(data) {
  return request({
    url: `/tracomps-admin/api/admin/merchant/express/relate`,
    method: 'post',
    data,
  });
}

/**
 * @description 商户物流公司分页列表
 */
export function expressPageApi(params) {
  return request({
    url: `/tracomps-admin/api/admin/merchant/express/search/page`,
    method: 'GET',
    params,
  });
}
