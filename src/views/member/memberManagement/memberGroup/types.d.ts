export interface StateItem {
	value: number;
	label: string;
}
export interface LevelObj {
	level: string;
	levelName: string;
	[str: string]: any;
}
export interface QueryForm {
	stateArr: StateItem[];
	levelArr: LevelObj[];
}