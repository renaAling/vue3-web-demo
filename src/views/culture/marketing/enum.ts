interface StatusType {
	[key: number | string]: string | undefined;
}


export const couponCategory: StatusType = {
	1: '店铺',
	2: '商品',
	3: '通用',
	4: '品类',
	5: '品牌',
	6: '供应商',
};
export const receiveType: StatusType = {
	1: '用户领取',
	2: '商品赠送券',
	3: '平台活动使用',
  };

  export const selfTypeFilter: StatusType = {
    true: '自营',
    false: '非自营',
  }