

import request from '/@/utils/request';
const prefix = '/tracomps-admin';

/**
 * @description diy 新增
 */
export function pagediySaveApi(data) {
  return request({
    url: '/tracomps-admin/api/admin/platform/pagediy/save',
    method: 'post',
    data,
  });
}

/**
 * @description diy 列表
 */
export function pagediyListApi(params) {
  return request({
    url: '/tracomps-admin/api/admin/platform/pagediy/list',
    method: 'get',
    params,
  });
}

/**
 * @description diy 详情
 */
export function pagediyInfoApi(id:any) {
  return request({
    url: `/tracomps-admin/api/admin/platform/pagediy/info/${id}`,
    method: 'get',
  });
}

/**
 * @description diy 修改
 */
export function pagediyUpdateApi(data) {
  return request({
    url: `/tracomps-admin/api/admin/platform/pagediy/update`,
    method: 'post',
    data,
  });
}

/**
 * @description diy 设置商城首页
 */
export function pagediySetdefaultApi(id) {
  return request({
    url: `/tracomps-admin/api/admin/platform/pagediy/setdefault/${id}`,
    method: 'get',
  });
}

/**
 * 查询已经设置的首页diy 模版id
 * @returns {*}
 */
export function pagediyGetSetHome() {
  return request({
    url: `/tracomps-admin/api/admin/platform/pagediy/getdefault`,
    method: 'get',
  });
}

/**
 * 获取小程序二维码
 * @returns {*}
 */
export function wechatQrcodeApi(data) {
  return request({
    url: `/tracomps-admin/api/admin/platform/wechat/get/qrcode`,
    method: 'post',
    data,
  });
}

/**
 * DIY 模版名称更新
 * @returns {*}
 */
export function pagediyUpdatenameApi(data) {
  return request({
    url: `/tracomps-admin/api/admin/platform/pagediy/updatename`,
    method: 'post',
    data,
  });
}

// 皮肤管理
export function skinListApi(params) {
  return request({
    url: '/tracomps-admin/api/admin/platform/skin/page',
    method: 'get',
    params,
  });
}
// 新增
export function skinSaveApi(data) {
  return request({
    url: prefix + '/api/admin/platform/skin/add',
    method: 'post',
    data,
  });
}
// 修改
export function skinUpdateApi(data) {
  return request({
    url: prefix + '/api/admin/platform/skin/update',
    method: 'put',
    data,
  });
}
// 详情
export function skinInfoApi(id) {
  return request({
    url: `/tracomps-admin/api/admin/platform/skin/get?id=${id}`,
    method: 'get',
  });
}
// 删除
export function skinDeleteApi(params) {
  return request({
    url: prefix + '/api/admin/platform/skin/del',
    method: 'delete',
    params
  });
}
//启用
export function skinChangeStatusApi(params) {
  return request({
    url: `/tracomps-admin/api/admin/platform/skin/change_status`,
    method: 'get',
    params
  });
}
// 检测当前皮肤是否绑定商品
export function checkSkinBindProductApi(params) {
  return request({
    url: prefix + '/api/admin/platform/skin/check_is_on_sale',
    method: 'get',
    params
  });
}


// 装修 - 自定义页面列表
export function loadPageDiyListApi(params) {
  return request({
    url: prefix + '/api/admin/platform/pagediy/list',
    method: 'get',
    params,
  });
}
// 装修 - 自定义页面列表删除
export function deletePageDiyApi(params) {
  return request({
    url: prefix + '/api/admin/platform/pagediy/delete', 
    method: 'get',
    params,
  });
}

// 链接列表
export function linkListApi(params) {
  return request({
    url: prefix + '/api/admin/platform/pagelink/list',
    method: 'get',
    params,
  });
}
// 链接新增
export function linkAddApi(data:any) {
  return request({
    url: prefix + '/api/admin/platform/pagelink/save',
    method: 'post',
    data,
  });
}
//链接编辑
export function linkUpdateApi(data:any) {
  return request({
    url: prefix + '/api/admin/platform/pagelink/update',
    method: 'post',
    data,
  });
}
//链接删除
export function linkDelApi(code:any) {
  return request({
    url: prefix + '/api/admin/platform/pagelink/delete',
    method: 'delete',
    params: { code },
  });
}
// 分类查询
export function linkClassListApi() {
  return request({
    url: prefix + '/api/admin/platform/pagecategory/cache/tree',
    method: 'get',
  });
}
// 链接新增
export function linkClassAddApi(data:any) {
  return request({
    url: prefix + '/api/admin/platform/pagecategory/save',
    method: 'post',
    data,
  });
}
//链接编辑
export function linkClassUpdateApi(data:any) {
  return request({
    url: prefix + '/api/admin/platform/pagecategory/update',
    method: 'post',
    data,
  });
}
//链接删除
export function linkClassDelApi(code:any) {
  return request({
    url: prefix + '/api/admin/platform/pagecategory/delete',
    method: 'delete',
    params: { code },
  });
}