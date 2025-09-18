// 基础信息form
export interface basicInfoTypes {
	productCode: number | null;
	name: string;
	intro?: string;
	operatorCode: string;
	imageUrls: any[];
}

export interface standardsTypes {
	skuName: string;
	publicationFee: number;
	productionCost: number;
	minPurchase: number;
	inventory: number;
	skuImageUrl?: string;
}

export interface StatusType {
	[key: number | string]: string | undefined;
}
