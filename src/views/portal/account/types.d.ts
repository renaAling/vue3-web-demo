export interface DeptObj {
	deptCode: string;
	deptName: string;
	childNode: any[];
}
export interface ChannelObj {
	code: string;
	name: string;
}
export interface QueryForm {
	deptArr: DeptObj[];
	channelArr: ChannelObj[];
}
export interface DeptObj {
	deptCode: string;
	deptName: string;
	childNode: any[];
}
export interface ChannelObj {
	tenantId: string;
	name: string;
	disable?: boolean;
}
export interface QueryForm {
	deptArr: DeptObj[];
	channelArr: ChannelObj[];
}
export interface DataForm {
	avatar: string;
	mobile: string;
	name: string;
	password: string;
	unionId?: string;
	lastLoginTime?: string;
	channelCodes: string[];
}
export interface permissionType {
	code?: string;
	tenantId?: string;
	name: string;
	isEdit: boolean;
	isAdmin: boolean;
	id?: string;
	name: string;
}
// 编辑
export interface TypeEdit {
	isBase: boolean; // 基础信息是否编辑
	isAuthority: boolean; // 权限信息是否编辑
}
