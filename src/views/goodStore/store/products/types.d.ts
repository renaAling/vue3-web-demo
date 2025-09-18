// 供应商数据接口
export interface Supplier {
	id?: string;
	name: string;
	contactName: string;
	contactTelephone: string;
	csTelephone: string;
	afterSalesAddress: string;
	remark?: string;
	spsjs?: number;
	spuNum?: number;
	orderNUm?: string;
	afterSaleNum?: string;
	status?: string;
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
