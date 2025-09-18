export interface TopicTypes {
	jumpUrl?: string;
	type: number;
	imageUrl: string;
	spuName?: string;
	spuCode?: string;
	jumpUrlEx?: string;
	configProductList?: Array<{
		spuCode?: string;
		spuName?: string;
		label?: string;
		value?: number | string;
	}>;
}
export interface DictsTypes {
	label: string;
	value: number | string;
}
