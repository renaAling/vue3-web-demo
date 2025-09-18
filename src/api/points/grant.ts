import request from '/@/utils/request';

// 黑名单列表
export const getBlacklist = (params?: Object) => {
    return request({
        url: '/score/black/page',
        method: 'get',
        params,
    });
};

// 新增黑名单
export const blackAdd = (params?: Object) => {
    return request({
        url: '/score/black/add',
        method: 'post',
        data: params,
    });
};
// 修改黑名单
export const blackUpdate = (params?: Object) => {
    return request({
        url: '/score/black/update',
        method: 'put',
        data: params,
    });
};
// 全部导出黑名单
export const blackExport = (params?: Object) => {
    return request({
        url: '/score/black/export',
        method: 'get',
        params,
    });
};
// 部分导出黑名单
export const blackExportFilter = (params?: Object) => {
    return request({
        url: '/score/black/exportByFilter',
        method: 'get',
        params,
    });
};
// 删除黑名单
export const blackDel = (id: string) => {
    return request({
        url: '/score/black/del/',
        method: 'delete',
        params: { id }
    });
};
// 通过id查询黑名单
export const blackGet = (params?: Object) => {
    return request({
        url: '/score/black/get',
        method: 'get',
        params,
    });
};

// 第三方渠道查询
export const thirdConfigList = (params?: Object) => {
    return request({
        url: '/score/thirdConfig/page',
        method: 'get',
        params,
    });
};

// 修改第三方渠道
export const thirdConfigUpdate = (params?: Object) => {
    return request({
        url: '/score/thirdConfig/update',
        method: 'put',
        data:params,
    });
};
// 第三方渠道详情
export const thirdConfigDetail = (id?: string) => {
    return request({
        url: '/score/thirdConfig/get',
        method: 'get',
        params: { id },
    });
};
// 白名单列表
export const whiteList = (params?: Object) => {
    return request({
        url: '/score/thirdWhite/page',
        method: 'get',
        params,
    });
};

// 白名单配置
export const whiteConfig = (params?: Object) => {
    return request({
        url: '/score/thirdWhite/saveOrUpdate',
        method: 'post',
        data:params,
    });
};

// 拉新邀请列表
export const inviteList = () => {
    return request({
        url: '/score/inviteConfig/list',
        method: 'get',
        params: {},
    });
}
//拉新邀请详情
export const inviteDetail = (id?: string) => {
    return request({
        url: '/score/inviteConfig/get',
        method: 'get',
        params: { id },
    });
}
// 拉新邀请修改
export const inviteUpdate = (params?: Object) => {
    return request({
        url: '/score/inviteConfig/update',
        method: 'put',
        data: params,
    });
}
// 签到列表
export const signInList = () => {
    return request({
        url: '/score/signConfig/getSignConfig',
        method: 'get',
        params: {},
    });
}
//签到详情
export const signInDetail = (params?: Object) => {
    return request({
        url: '/score/signConfig/getSignConfig',
        method: 'get',
        params,
    });
}
// 签到修改
export const signInUpdate = (params?: Object) => {
    return request({
        url: '/score/signConfig/saveOrUpdate',
        method: 'post',
        data: params,
    });
}
// 签到平台列表
export const signInPlatformList = () => {
    return request({
        url: '/score/signPlatform/list',
        method: 'get',
        params: {},
    });
}
// 签到平台启用停用
export const signInPlatformStatus = (params: Object) => {
    return request({
        url: '/score/signPlatform/updateStatus',
        method: 'put',
        data: params,
    });
}

// 平台消费规则列表
export const consumeRuleList = (params?: Object) => {
    return request({
        url: '/score/consumeConfig/list',
        method: 'get',
        params,
    });
}
//平台消费规则详情
export const consumeRuleDetail = (id?: string) => {
    return request({
        url: '/score/consumeConfig/get',
        method: 'get',
        params: { id },
    });
}
// 平台消费规则修改
export const consumeRuleUpdate = (params?: Object) => {
    return request({
        url: '/score/consumeConfig/update',
        method: 'put',
        data: params,
    });
}

// 积分后台-成长值管理查询
export const getGrowthListApi = () => {
    return request({
        url: '/score/scoreWelfareGrowthManage/getGrowthList',
        method: 'get',
        params: {},
    });
}

// 积分后台-新增成长值管理
export const growthInAdd = (params?: Object) => {
    return request({
        url: '/score/scoreWelfareGrowthManage/add',
        method: 'post',
        data: params,
    });
}

// 积分后台-编辑成长值管理
export const growthInUpdate = (params?: Object) => {
    return request({
        url: '/score/scoreWelfareGrowthManage/update',
        method: 'post',
        data: params,
    });
}

//积分后台-通过id查询成长值管理
export const growthDetailApi = (id?: string) => {
    return request({
        url: '/score/scoreWelfareGrowthManage/get',
        method: 'get',
        params: { id },
    });
}