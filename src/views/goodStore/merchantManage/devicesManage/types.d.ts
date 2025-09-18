export interface modelTypes {
	merchantCode: string | null;
	storeCode: string | null;
	brand: string | null;
	sn: string | null;
	name: string | null;
	type: number | null;
	num: number | null;
	remark: string | null;
	printerKey: string | null;
	[key: string]: string | number | boolean | string[] | null | undefined | object;
}
