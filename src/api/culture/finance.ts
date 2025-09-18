import request from '/@/utils/request';

export function invoiceInfoListApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/invoiceInfo/page',
    method: 'GET',
    params,
  });
}

export function invoiceInfoDetailApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/invoiceInfo/get',
    method: 'GET',
    params,
  });
}

export function uploadInvoiceInfoApi(data: Object) {
  return request({
    url: '/tracomps-admin/api/admin/invoiceInfo/upload',
    method: 'PUT',
    data,
  });
}

export function ownMallPayChannelReportApi(params: Object) {
  return request({
    url: '/tracomps-admin/ownMallPayChannelReport/page',
    method: 'GET',
    params,
  });
}

export function getPaymentTransactionApi(params: Object) {
  return request({
    url: '/pay/trade/getPaymentTransaction',
    method: 'GET',
    params,
  });
}

export function ownMallPayBusinessReportApi(params: Object) {
  return request({
    url: '/tracomps-admin/ownMallPayBusinessReport/page',
    method: 'GET',
    params,
  });
}

export function ownMallPayMerchantReportApi(params: Object) {
  return request({
    url: '/tracomps-admin/ownMallPayMerchantReport/page',
    method: 'GET',
    params,
  });
}

export function distributionMonthBillApi(params: Object) {
  return request({
    url: '/tracomps-admin/api/admin/distributionMonthBill/page',
    method: 'GET',
    params,
  });
}