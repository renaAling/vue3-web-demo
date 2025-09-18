// 供应商数据接口
export interface Merchant {
	staffCode?: string;
	staffName: string;
	mobile: string;
	merchantCode: any;
	scope: number;
	roleId: string;
	storeCodes: string[];
}
// 供应商员工数据接口
export interface SupplierUser {
	id: string;
	xm: string;
	sjh: string;
	js: string;
	status: string;
}
