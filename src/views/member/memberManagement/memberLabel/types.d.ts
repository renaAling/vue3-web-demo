export interface StateItem {
	value: string;
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