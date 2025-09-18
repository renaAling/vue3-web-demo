// 发布消息弹窗类型
export interface ReleaseMsgTypes {
	id?: string | number;
	publishStatus: string | number;
	publishTime: string;
}
// 新增/编辑消息弹窗类型
export interface MsgConfigTypes {
	id?: string | number;
	title: string;
	content: string;
	type: string | number;
}

export interface StatusType {
	[key: number | string]: string | undefined;
}
export interface StatusListType {
	value: number;
	label: string;
	index?: number;
}
