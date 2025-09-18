import request from '/@/utils/request';

// 分销列表
export const pageList = (params?: Object) => {
    return request({
        url: '/tracomps-admin/api/admin/platform/retail/store/people/list',
        method: 'get',
        params,
    });
};

// 推广人
export const subList = (params?: Object) => {
    return request({
        url: '/tracomps-admin/api/admin/platform/retail/store/sub/user/list',
        method: 'get',
        params,
    });
};

// 推广订单列表
export const orderList = (params?: Object) => {
    return request({
        url: '/tracomps-admin/api/admin/platform/retail/store/promotion/order/list',
        method: 'get',
        params,
    });
};

// 分销设置详情
export const configApi = (params?: Object) => {
    return request({
        url: '/tracomps-admin/api/admin/platform/retail/store/config/get',
        method: 'get',
        params,
    });
};

// 分销修改
export const configUpdateApi = (params?: Object) => {
    return request({
        url: '/tracomps-admin/api/admin/platform/retail/store/config/save',
        method: 'post',
        data:params,
    });
};

// 分销折扣列表
export const discountPage = (params?: Object) => {
    return request({
        url: '/tracomps-admin/discount_config/page',
        method: 'get',
        params,
    });
};


// 新增分销折扣
export const discountAdd = (params?: Object) => {
    return request({
        url: '/tracomps-admin/discount_config/add',
        method: 'post',
        data:params,
    });
};

// 修改分销折扣
export const discountUpdate = (params?: Object) => {
    return request({
        url: '/tracomps-admin/discount_config/update',
        method: 'put',
        data:params,
    });
};

// 查询
export const discountDetail = (params?: Object) => {
    return request({
        url: '/tracomps-admin/discount_config/get',
        method: 'get',
        params,
    });
};

// 删除
export const discountDel = (params?: Object) => {
    return request({
        url: '/tracomps-admin/discount_config/del',
        method: 'delete',
        params,
    });
};