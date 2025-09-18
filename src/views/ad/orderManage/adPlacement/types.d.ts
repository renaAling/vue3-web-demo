//详情数据类型
export interface basicInfoTypes {
	tfqw: Array<any>;
	ddbk: Array<any>;
	tfpq: Array<any>;
	adImages: Array<any>;
	uploadTime: string;
	skqr: Array<any>;
	adDescription: String;
	auditTime: string;
	auditUser: string;
	auditDescription: string;
	auditFiles: Array<any>;
	orderCode: String;
	workOrderCode: String;
	status: number;
	publishFiles: Array<any>;
	gdtk?: Array<any>;
	shsm?: Array<any>;
	compOrderCode?: string;
	refundOrderCode?: string;
}
// 关闭工单
export interface orderCloseInfoTypes {
	closeMsg: string;
}
// 工单审核
interface OrderApplyInfoMap {
	auditDescription: string;
	auditFile: { img: string }[];
	[key: string]: any; // 添加字符串索引签名
	auditResult: Boolean;
}
export interface StatusType {
	[key: number | string]: string | undefined;
}
