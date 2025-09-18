// 商家数据接口
interface Item {
	img: string;
}
export interface Store {
	storeImageUrl?: string;
	mapPointImage?: string;
	logoUrl: string;
	storeName: string;
	headImages?: Item[];
	subwayCode?: string;
	aptitude?: Item[];
	address: string;
	longitude?: number;
	latitude?: number;
	businessHours?: string;
	categoryCode?: string;
	mobile?: string;
	jumpUrl?: string;
	status?: number;
	[key: string]: any;
}
export interface Address {
	label?: string | undefined;
	value?: (number | string) | undefined;
	address?: string | undefined;
	latitude?: number | undefined;
	longitude?: number | undefined;
	province?: string | undefined;
	city?: string | undefined;
	district?: string | undefined;
}
interface Category {
	label: string;
	value: string;
	children?: Category[];
	[key: string]: any;
}
interface Subway {
	label: string;
	value: string;
	children?: Subway[];
	[key: string]: any;
}
interface Merchant {
	label?: string;
	value?: string;
	type?: number;
	[key: string]: any;
}

interface SubwayLines {
	subwayCode: string;
	subwayName: string;
	longitude: string;
	latitude: string;
	mapImageUrl?: string | undefined;
}
