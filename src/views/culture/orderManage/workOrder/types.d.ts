// 物流信息数据类型
export interface LogisticsInfoType {
	logisticsNumber: String;
	shipperName: String;
	platform: String;
	deliveryTime: String;
	config?: Blob;
}
export interface StatusType {
	[key: number | string]: string | undefined;
}
