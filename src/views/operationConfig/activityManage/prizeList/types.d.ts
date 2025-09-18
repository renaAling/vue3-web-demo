// 基础信息form
export interface modelTypes {
	name: string | null;
	activityTime: string | null;
	identityTypes: string[] | null;
	type: string[] | null;
	lotteryNum: boolean;
	lotteryNum2: boolean;
	dailyCount: string | null;
	firstCount: string | null;

	awardType: string | null;
	imageUrl: string;
	[key: string]: string | number | boolean | string[] | null | undefined;
}

export interface StatusType {
	[key: number | string]: string | undefined;
}
