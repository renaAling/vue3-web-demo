import request from '/@/utils/request';


/**
 * 文创邀请有礼
 * @param params
 */
// 邀请有礼列表
export function inviteList(params:Object) {
    return request({
      url: '/activity/invite_rule/page',
      method: 'get',
      params,
    });
  }
   // 邀请有礼新增
   export function inviteAdd(data:Object) {
    return request({
      url: '/activity/invite_rule/add',
      method: 'post',
      data,
    });
  }
   // 邀请有礼修改
   export function inviteUpdate(data:Object) {
    return request({
      url: '/activity/invite_rule/update',
      method: 'put',
      data,
    });
  }
  // 删除
  export function inviteDelete(id:string) {
    return request({
      url: `/api/admin/inviteActivity/del`,
      method: 'delete',
      params: { id }
    });
  }
  // 详情
  export function inviteDetail(id:string) {
    return request({
      url: `/activity/invite_rule/get`,
      method: 'get',
      params: {id},
    });
  }
  // 修改为默认活动
  export function inviteDefault(id:string) {
    return request({
      url: `/activity/invite_rule/deft_status_change?id=${id}`,
      method: 'put',
    });
  }
  // 参与记录
  export function inviteRecordList(params:Object) {
    return request({
      url: '/activity/invite_record/page',
      method: 'get',
      params,
    });
  }
  // 导出
  export function inviteRecordExport(params:Object) {
    return request({
      url: '/activity/invite_record/export',
      method: 'get',
      params,
      responseType: 'blob',
    });
  }
  
// ------------- 731 -------------
// 自有商城后台-分页查询邀请有礼活动规则表
export function inviteActivityList(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/inviteActivity/page',
    method: 'get',
    params,
  });
}

// 新增邀请有礼活动规则表
export function inviteActivityAdd(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/inviteActivity/add',
    method: 'post',
    data,
  });
}

// 修改邀请有礼活动规则表
export function inviteActivityUpdate(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/inviteActivity/update',
    method: 'put',
    data,
  });
}

// 通过id查询邀请有礼活动规则表
export function inviteActivityDetail(id: string) {
  return request({
    url: '/tracomps-admin/api/admin/inviteActivity/get',
    method: 'get',
    params: { id },
  });
}

// 参与记录
export function pageInviteRecord(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/inviteRecord/page',
    method: 'get',
    params,
  });
}

// 删除
export function inviteActivityDelete(id:string) {
  return request({
    url: '/tracomps-admin/api/admin/inviteActivity/del',
    method: 'delete',
    params: { id }
  });
}