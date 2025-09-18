// 网点数据接口
export interface OutletParams {
	code?: null | string;
	name: string;
	identityCodes: Array<string>;
	businessHours?: string;
	remark?: string;
	imageUrl?: string;
	contactName?: string;
	contactTelephone?: string;
	districtCode: string;
	address: string;
	longitude: number;
	latitude: number;
	// type?: Array<string>;
}
