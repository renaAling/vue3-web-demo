import request from '/@/utils/request';
/**
 * 店铺类型 列表
 */
export function merchantTypeListApi(params:Object) {
    return request({
      url: '/tracomps-admin/api/admin/platform/merchant/type/list',
      method: 'get',
      params,
    });
  }
  
  /**
   * 店铺类型 全部列表
   */
  export function merchantTypeAllListApi() {
    return request({
      url: '/tracomps-admin/api/admin/platform/merchant/type/all/list',
      method: 'get',
    });
  }
  
  /**
   * 店铺类型 添加
   */
  export function merchantTypeAddApi(params:Object) {
    return request({
      url: '/tracomps-admin/api/admin/platform/merchant/type/add',
      method: 'post',
      data:params,
    });
  }
  
  /**
   * 店铺类型 编辑
   */
  export function merchantTypeUpdateApi(params:Object) {
    return request({
      url: '/tracomps-admin/api/admin/platform/merchant/type/update',
      method: 'post',
      data:params,
    });
  }
  
  /**
   * 店铺类型 删除
   */
  export function merchantTypeDeleteApi(id:number) {
    return request({
      url: `/tracomps-admin/api/admin/platform/merchant/type/delete/${id}`,
      method: 'post',
    });
  }