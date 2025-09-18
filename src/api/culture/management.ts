import request from '/@/utils/request';

// 管理模式所有接口
// 主题商城列表
export function themeMallPage(params: Object) {
    return request({
      url: '/tracomps-admin/api/admin/themeMall/page',
      method: 'get',
      params,
    });
  }
   // 主题商城新增
   export function themeMallAdd(data: Object) {
    return request({
      url: '/tracomps-admin/api/admin/themeMall/add',
      method: 'post',
      data,
    });
  }
   // 主题商城修改
   export function themeMallUpdate(data: Object) {
    return request({
      url: '/tracomps-admin/api/admin/themeMall/update',
      method: 'put',
      data,
    });
  }
  // 详情
  export function themeMallDetail(id:string) {
    return request({
      url: '/tracomps-admin/api/admin/themeMall/get',
      method: 'get',
      params: { id },
    });
  }
  // 修改为默认活动
  export function inviteDefault(id:string) {
    return request({
      url: `/activity/invite_rule/deft_status_change?id=${id}`,
      method: 'put',
    });
  }