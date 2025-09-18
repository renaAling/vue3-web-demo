import { StatusType, StatusListType } from './types';

export const configTypes: StatusType = {
	1: '首页banner',
	2: '首页金刚区',
	11: '首页魔方区',
	3: '首页列表区',
	4: '好店banner',
	5: '文创专题',
	6: '二维码落地页',
	7: '支付结果页推荐',
	9: '广告banner',
	10: '广告投放首页',
};

export const jumpTypes: StatusListType[] = [
	{ value: 1, label: '不跳转' },
	{ value: 2, label: '跳转H5' },
	{ value: 3, label: '跳转微信小程序内部页面' },
	{ value: 4, label: '跳转其他微信小程序' },
	{ value: 5, label: '文创商城' },
	{ value: 6, label: '好店系统' },
	{ value: 7, label: '跳转微信公众号' },
];

export const jumpTypeMap: { [key: string]: number | undefined } = {
	'5': 5,
	'6': 6,
};
