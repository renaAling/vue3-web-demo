import request from '/@/utils/request';


/**
 * 获取预约看房记录列表
 */
export const getHouseList = (data: any) => {
  return request({
    url: '/business/visit/message/page',
    method: 'get',
    params: data,
  });
};

/**
 * 预约看房导出
 */
export const exportHouse = (params: any) => {
  return request({
    url: '/business/visit/message/export',
    method: 'get',
    params,
    responseType: 'blob',
  });
};
