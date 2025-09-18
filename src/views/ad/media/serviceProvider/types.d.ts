// 运营商数据接口
export interface Supplier {
	code?: string;
	name: string;
	remark?: string;
	[key: string]: string | number | undefined;
}
// 供应商员工数据接口
export interface SupplierUser {
	id: string;
	xm: string;
	sjh: string;
	js: string;
	status: string;
}
