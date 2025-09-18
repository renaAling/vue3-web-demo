export interface ApiItem {
	createBy?: string;
	createTime?: string;
	delFlag?: boolean;
	doc?: string | null | undefined;
	id: string;
	interfaceId?: string;
	interfaceName: string;
	remark?: null | string;
	requestMethod: string;
	status?: number;
	updateBy?: string;
	updateTime?: string;
	uri?: string;
	version?: string;
}
export interface SdkItem {
	id: string;
	sdkName: string;
	sdkVersion?: string;
	sdkDoc?: string | null | undefined;
	sdkRemark?: string | null;
	sdkFileId?: string | null | number;
	sdkFileName: string;
	sdkFileSize?: string;
	sdkFileUrl?: string;
	sdkFileType?: string;
	sdkFileExtName?: string | null;
	sdkStatus?: number;
	createTime?: string;
	createBy?: string;
	updateTime?: string;
	updateBy?: string;
	delFlag?: boolean;
}

export interface InterfaceIndex {}
