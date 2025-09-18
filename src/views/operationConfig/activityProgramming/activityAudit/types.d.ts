// 基础信息form
export interface modelTypes {
	name: string | null;
	activityTime: string | null;
	identityTypes: string[] | null;
	everyDayLotteryNumRule: boolean;
	dayNum: string | null;
	firstLotteryNumRule: boolean;
	originNum: string | null;
	getPersonalLotteryNumRule: boolean;
	buyPrice: string | null;
	limitNum: string | null;
	maxNum: string | null;
	friendHelpLotteryNumRule: boolean;
	shareNum: string | null;
	shareMaxNum: string | null;
	maxWinRule: boolean;
	limitWin: string | null;
	prizeWay: string | null;
	prizeWayInfo: string | null;
	imageUrl: string;
	[key: string]: string | number | boolean | string[] | null | undefined | object;
}

export interface StatusType {
	[key: number | string]: string | undefined;
}
