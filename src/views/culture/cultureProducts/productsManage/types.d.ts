// 基础信息form
export interface basicInfoTypes {
	spuCode: null;
	spuName: string;
	sellingPoint?: string;
	supplierCode: string;
	supplierName: string;
	imageUrls: any[];
	claimLink?: string;
	piece?: number | null;
}

export interface logisticsMethodsTypes {
	logisticsType: string[];
}

export interface productStandardsTypes {
	skuName: string;
	sellingPrice: number;
	employeePrice: number;
	inventory: number;
	skuImageUrl?: string;
	thirdSkuCode?: string; //虚拟商品三方票卡code
}
