// 结账数据接口
export interface AccountType {
	roleInfos: Array<RoleType>;
	mobile: '';
	nickName: '';
	[key: string]: any;
}
// 供应商数据接口
interface RoleType {
	roleName: string | undefined;
	roleId: string | undefined;
}
