// 商家数据接口
export interface Business {
	rectangleLogo: string; // 商户logo
	id?: string; // 商户ID
	name: string; // 商户名称
	categoryId?: number | string; // 商户类型
	phone?: string; // 管理端手机号
	description?: string;
	mobileCode?: string;
	isSwitch?: boolean;
	handlingFee?: number; // 手续费
	[key: string]: string | number | undefined;
}
export interface JustmentTypes {
	priceRatio: string;
	name?: string;
	id?: string;
	priceDir: Boolean;
}
