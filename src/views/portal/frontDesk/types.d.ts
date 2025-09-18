// 首页配置数据接口
export interface FirstPageTypes {
	name: string;
	imageUrl: string;
	jumpType: any;
	jumpUrl: string;
	jumpNewUrl: string;
	[key: string]: any;
	identityCodes: Array<any>;
}
export interface StatusType {
	[key: number | string]: string | undefined;
}
export interface StatusListType {
	value: number;
	label: string;
	index?: number;
}

interface Product {
	label: string;
	value: string | number;
}

interface Store {
	label: string;
	value: string | number;
	id?: number;
}
