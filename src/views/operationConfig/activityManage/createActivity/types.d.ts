// 基础信息form
export interface modelTypes {
	code: string | null;
	name: string | null;
	activityTime: string | null;
	identityTypes: string[] | null;
	everyDayLotteryNumRule: boolean;
	dayNum: string | null;
	firstLotteryNumRule: boolean;
	originNum: string | null;
	friendHelpLotteryNumRule: boolean;
	shareNum: string | null;
	shareMaxNum: string | null;
	maxWinRule: boolean;
	limitWin: string | null;
	receiveWay: number | null;
	receiveOffLines: Array<{
		address: string;
		mobiles: string;
	}>;
	receiveQrCode: string | null;
	[key: string]: string | number | boolean | string[] | null | undefined | object;
}

export interface prizeModelTypes {
	name: string | null;
	activityCode: string | null;
	type: number | null;
	imgUrl?: string | null;
	odds: string | null;
	totalNum?: string | null;
	dayNum?: string | null;
	[key: string]: string | number | boolean | string[] | null | undefined | object;
}

export interface pageConfigTypes {
	headImg: string | null;
	backgroundImg: string | null;
	insideColor: string | null;
	outsideColor: string | null;
	leftBtnImg: string | null;
	pointerImg: string | null;
	rightBtnImg: string | null;
	ruleImg: string | null;

	[key: string]: string | number | boolean | string[] | null | undefined | object;
}

export interface StatusType {
	[key: number | string]: string | undefined;
}
