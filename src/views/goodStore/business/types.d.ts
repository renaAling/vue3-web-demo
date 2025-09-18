// 商家数据接口
export interface Business {
	logo: string;
	id?: string;
	merchantName: string;
	type?: number | string;
	supperMobile?: string;
	description?: string;
	mobileCode: string;
	status?: string;
	[key: string]: string | number | undefined;
}
