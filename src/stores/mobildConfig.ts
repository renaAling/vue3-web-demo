import { defineStore } from 'pinia';
import { ref } from 'vue';

export type DiyState = {
	configName: string;
	pageTitle: string;
	pageName: string;
	pageShow: number;
	pageColor: number;
	pagePic: number;
	pageColorPicker: string;
	pageTabVal: number;
	pagePicUrl: string;
	returnAddress: string;
	titleColor: string;
	titleBgColor: string;
	defaultArray: Record<string, ComponentConfig>;
	pageFooter: FooterConfig;
};

export type ComponentConfig = {
	id: string;
	timestamp: number;
	isShow?: boolean;
	[key: string]: any;
};

export type FooterConfig = {
	status: {
		title: string;
		status: number | string;
		menuList: any[];
	};
	[key: string]: any;
};

export type DiyActions = {
	FOOTER(data: { title: string; name: string }): void;
	UPDATESHOW(data: { num: string }): void;
	ADDARRAY(data: { num: string; val: ComponentConfig }): void;
	DELETEARRAY(data: { num: string }): void;
	ARRAYREAST(key: string): void;
	defaultArraySort(data: { list: { id: string; num: string }[]; oldIndex?: number; newIndex: number; element?: any }): void;
	UPDATEARR(data: { val: ComponentConfig }): void;
	SETCONFIGNAME(name: string): void;
	SETEMPTY(): void;
	UPTITLE(val: string): void;
	UPNAME(val: string): void;
	UPSHOW(val: number): void;
	UPCOLOR(val: number): void;
	UPPIC(val: number): void;
	UPPICKER(val: string): void;
	UPRADIO(val: number): void;
	UPPICURL(val: string): void;
	UPPReturnAddress(val: string): void;
	UPPTitleColor(val: string): void;
	UPPTitleBgColor(val: string): void;
	footUpdata(data: FooterConfig): void;
	footStatus(data: number | string): void;
	footPageUpdata(data: FooterConfig): void;
	titleUpdata(data: string): void;
	nameUpdata(data: string): void;
	showUpdata(data: number): void;
	colorUpdata(data: number): void;
	picUpdata(data: number): void;
	pickerUpdata(data: string): void;
	radioUpdata(data: number): void;
	picurlUpdata(data: string): void;
	returnAddressUpdata(data: string): void;
	titleBgColorUpdata(data: string): void;
	titleColorUpdata(data: string): void;
	getData(data: any): Promise<void>;
};
export const mobildConfig = defineStore('diy', {
	state: (): DiyState => ({
		configName: '',
		pageTitle: '',
		pageName: '模板',
		pageShow: 1,
		pageColor: 0,
		pagePic: 0,
		pageColorPicker: '#f5f5f5',
		pageTabVal: 0,
		pagePicUrl: '',
		returnAddress: '',
		titleColor: '#000000',
		titleBgColor: '#fff',
		defaultArray: {},
		pageFooter: {
			status: {
				title: '',
				status: '', // 补充缺失字段
				menuList: [],
			},
		},
	}),
	actions: {
		FOOTER(data: { title: string; name: string }) {
			this.pageFooter.status.title = data.title;
			this.pageFooter.menuList[2] = data.name;
		},

		UPDATESHOW(data: { num: string }) {
			if (this.defaultArray[data.num]) {
				this.defaultArray[data.num].isShow = !this.defaultArray[data.num].isShow;
			}
		},

		ADDARRAY(data: { num: string; val: ComponentConfig }) {
			data.val.id = 'id' + data.val.timestamp;
			this.defaultArray[data.num] = data.val;
		},

		DELETEARRAY(data: { num: string }) {
			delete this.defaultArray[data.num];
		},

		ARRAYREAST(key: string) {
			delete this.defaultArray[key];
		},

		defaultArraySort(data: { list: { id: string; num: string }[]; oldIndex?: number; newIndex: number; element?: any }) {
			let newArr = Object.keys(this.defaultArray).map((key) => this.defaultArray[key]);

			newArr = newArr.map((el) => {
				const found = data.list.find((item) => el.id === item.id);
				if (found) {
					el.timestamp = parseInt(found.num); // 假设 num 是字符串数字
				}
				return el;
			});

			if (data.oldIndex !== undefined) {
				const temp = newArr[data.oldIndex];
				newArr[data.oldIndex] = newArr[data.newIndex];
				newArr[data.newIndex] = temp;
			} else if (data.element && data.element.data?.().defaultConfig) {
				newArr.splice(data.newIndex, 0, data.element.data().defaultConfig);
			}

			const newObj: Record<string, ComponentConfig> = {};
			newArr.forEach((item) => {
				if (item.id) {
					newObj[item.timestamp] = item;
				}
			});

			this.defaultArray = newObj;
		},

		UPDATEARR(data: { val: ComponentConfig }) {
			for (const key in this.defaultArray) {
				if (this.defaultArray[key].id === data.val.id) {
					this.defaultArray[key] = data.val;
					break;
				}
			}
		},

		SETCONFIGNAME(name: string) {
			this.configName = name;
		},

		SETEMPTY() {
			this.defaultArray = {};
		},

		UPTITLE(val: string) {
			this.pageTitle = val;
		},

		UPNAME(val: string) {
			this.pageName = val;
		},

		UPSHOW(val: number) {
			this.pageShow = val;
		},

		UPCOLOR(val: number) {
			this.pageColor = val;
		},

		UPPIC(val: number) {
			this.pagePic = val;
		},

		UPPICKER(val: string) {
			this.pageColorPicker = val;
		},

		UPRADIO(val: number) {
			this.pageTabVal = val;
		},

		UPPICURL(val: string) {
			this.pagePicUrl = val;
		},

		UPPReturnAddress(val: string) {
			this.returnAddress = val;
		},

		UPPTitleColor(val: string) {
			this.titleColor = val;
		},

		UPPTitleBgColor(val: string) {
			this.titleBgColor = val;
		},

		footUpdata(data: FooterConfig) {
			this.pageFooter = JSON.parse(JSON.stringify(data));
		},

		footStatus(data: number | string) {
			if (this.pageFooter.status) {
				this.pageFooter.status.status = data;
			}
		},

		footPageUpdata(data: FooterConfig) {
			this.pageFooter = data;
		},

		titleUpdata(data: string) {
			this.pageTitle = data;
		},

		nameUpdata(data: string) {
			this.pageName = data;
		},

		showUpdata(data: number) {
			this.pageShow = data;
		},

		colorUpdata(data: number) {
			this.pageColor = data;
		},

		picUpdata(data: number) {
			this.pagePic = data;
		},

		pickerUpdata(data: string) {
			this.pageColorPicker = data;
		},

		radioUpdata(data: number) {
			this.pageTabVal = data;
		},

		picurlUpdata(data: string) {
			this.pagePicUrl = data;
		},

		returnAddressUpdata(data: string) {
			this.returnAddress = data;
		},

		titleBgColorUpdata(data: string) {
			this.titleBgColor = data;
		},

		titleColorUpdata(data: string) {
			this.titleColor = data;
		},

		async getData(data: any): Promise<void> {
			// 示例异步方法，可扩展
			return Promise.resolve();
		},
	},
});
// /**
//  * diy自定义组件
//  * */
// export default {
//   namespaced: true,
//   state: {
//     configName: '',
//     pageTitle: '',
//     pageName: '模板',
//     pageShow: 1,
//     pageColor: 0,
//     pagePic: 0,
//     pageColorPicker: '#f5f5f5',
//     pageTabVal: 0,
//     pagePicUrl: '',
//     returnAddress: '',
//     titleColor: '#000000',
//     titleBgColor: '#fff',
//     // 已知组件列表默认数据 数组
//     defaultArray: {},
//   },
//   mutations: {
//     FOOTER(state: { pageFooter: { status: { title: any; }; menuList: any[]; }; }, data: { title: any; name: any; }) {
//       state.pageFooter.status.title = data.title;
//       state.pageFooter.menuList[2] = data.name;
//     },
//     /**
//      * 隐藏组件，更新数据显示值
//      * @constructor
//      */
//     UPDATESHOW(state: { defaultArray: { [x: string]: { isShow: any; }; }; }, data: { num: string | number; }) {
//       state.defaultArray[data.num].isShow = !state.defaultArray[data.num].isShow;
//     },
//     /**
//      * @description 默认配置push到数组里面
//      * @param {Object} state vuex state
//      * @param {Object} data
//      * 把默认数据添加到默认数组里面，解耦重复组件公用一条配置的问题
//      */
//     ADDARRAY(state: { defaultArray: { [x: string]: any; }; }, data: { val: { id: string; timestamp: string; }; num: string | number; }) {
//       data.val.id = 'id' + data.val.timestamp;
//       state.defaultArray[data.num] = data.val;
//     },
//     /**
//      * @description 删除列表第几个默认数据
//      * @param {Object} state vuex state
//      * @param {Object} data 数据
//      */
//     DELETEARRAY(state: { defaultArray: { [x: string]: any; }; }, data: { num: string | number; }) {
//       let tempObj = delete state.defaultArray[data.num];
//     },
//     /**
//      * @description 删除列表第几个默认数据
//      * @param {Object} state vuex state
//      * @param {Object} data 数据
//      */
//     ARRAYREAST(state: { defaultArray: { [x: string]: any; }; }, data: string | number) {
//       let tempObj = delete state.defaultArray[data];
//     },
//     /**
//      * @description 数组排序
//      * @param {Object} state vuex state
//      * @param {Object} data 位置index记录
//      */
//     defaultArraySort(state: { defaultArray: {}; }, data: { list: any[]; oldIndex: undefined; newIndex: number; element: { data: () => { (): any; new(): any; defaultConfig: any; }; }; }) {
//       let newArr = objToArr(state.defaultArray);
//       let sortArr = [];
//       let newObj: { [key: string]: any } = {};
//       function objToArr(data: { [x: string]: any; }) {
//         let obj = Object.keys(data);
//         let m = obj.map((key) => data[key]);
//         return m;
//       }
//       function swapArray(arr: any[], index1: number, index2: number) {
//         let oldObj = {};
//         let newObj = {};
//         let active = 0;
//         arr.forEach((el: { id: string; timestamp: string; }, index: any) => {
//           if (!el.id) {
//             el.id = 'id' + el.timestamp;
//           }
//           data.list.forEach((item: { id: any; num: any; }, j: any) => {
//             if (el.id == item.id) {
//               el.timestamp = item.num;
//             }
//           });
//         });
//         return arr;
//       }
//       if (data.oldIndex != undefined) {
//         sortArr = JSON.parse(JSON.stringify(swapArray(newArr, data.newIndex, data.oldIndex)));
//       } else {
//         newArr.splice(data.newIndex, 0, data.element.data().defaultConfig);
//         sortArr = JSON.parse(JSON.stringify(swapArray(newArr, 0, 0)));
//       }
//       for (let i = 0; i < sortArr.length; i++) {
//         newObj[sortArr[i].timestamp] = sortArr[i];
//       }
//       state.defaultArray = Object.assign({}, newObj);
//     },
//     /**
//      * @description 更新数组某一组数据
//      * @param {Object} state vuex state
//      * @param {Object} data
//      */
//     UPDATEARR(state: { defaultArray: { [x: string]: any; }; }, data: { val: { id: any; }; }) {
//       for (var k in state.defaultArray) {
//         if (state.defaultArray[k].id == data.val.id) {
//           state.defaultArray[k] = data.val;
//         }
//       }
//       let value = Object.assign({}, state.defaultArray);
//       state.defaultArray = value;
//     },
//     /**
//      * @description 保存组件名称
//      * @param {Object} state vuex state
//      * @param {string} data
//      */
//     SETCONFIGNAME(state: { configName: any; }, name: any) {
//       state.configName = name;
//     },
//     /**
//      * @description 默认组件清空
//      * @param {Object} state vuex state
//      * @param {string} data
//      */
//     SETEMPTY(state: { defaultArray: {}; }, name: any) {
//       state.defaultArray = {};
//     },
//     UPTITLE(state: { pageTitle: any; }, val: any) {
//       state.pageTitle = val;
//     },
//     UPNAME(state: { pageName: any; }, val: any) {
//       state.pageName = val;
//     },
//     UPSHOW(state: { pageShow: any; }, val: any) {
//       state.pageShow = val;
//     },
//     UPCOLOR(state: { pageColor: any; }, val: any) {
//       state.pageColor = val;
//     },
//     UPPIC(state: { pagePic: any; }, val: any) {
//       state.pagePic = val;
//     },
//     UPPICKER(state: { pageColorPicker: any; }, val: any) {
//       state.pageColorPicker = val;
//     },
//     UPRADIO(state: { pageTabVal: any; }, val: any) {
//       state.pageTabVal = val;
//     },
//     UPPICURL(state: { pagePicUrl: any; }, val: any) {
//       state.pagePicUrl = val;
//     },
//     UPPReturnAddress(state: { returnAddress: any; }, val: any) {
//       state.returnAddress = val;
//     },
//     UPPTitleColor(state: { titleColor: any; }, val: any) {
//       state.titleColor = val;
//     },
//     UPPTitleBgColor(state: { titleBgColor: any; }, val: any) {
//       state.titleBgColor = val;
//     },
//     /**
//      * @description 更新foot菜单配置
//      * @param {Object} state vuex state
//      * @param {string} data
//      */
//     footUpdata(state: { pageFooter: never[]; }, data: any) {
//       state.pageFooter = [];
//       state.pageFooter = data;
//     },
//     /**
//      * @description 更新foot自定义开关
//      * @param {Object} state vuex state
//      * @param {string} data
//      */
//     footStatus(state: { pageFooter: { status: { status: any; }; }; }, data: any) {
//       state.pageFooter.status.status = data;
//     },
//     /**
//      * @description 更新foot配置
//      * @param {Object} state vuex state
//      * @param {string} data
//      */
//     footPageUpdata(state: { pageFooter: any; }, data: any) {
//       state.pageFooter = data;
//     },
//     /**
//      * @description 更新title配置
//      * @param {Object} state vuex state
//      * @param {string} data
//      */
//     titleUpdata(state: { pageTitle: any; }, data: any) {
//       state.pageTitle = data;
//     },
//     /**
//      * @description 更新name配置
//      * @param {Object} state vuex state
//      * @param {string} data
//      */
//     nameUpdata(state: { pageName: any; }, data: any) {
//       state.pageName = data;
//     },
//     //
//     showUpdata(state: { pageShow: any; }, data: any) {
//       state.pageShow = data;
//     },
//     colorUpdata(state: { pageColor: any; }, data: any) {
//       state.pageColor = data;
//     },
//     picUpdata(state: { pagePic: any; }, data: any) {
//       state.pagePic = data;
//     },
//     /**
//      * @description 更新页面背景色
//      * @param {Object} state vuex state
//      * @param {string} data
//      */
//     pickerUpdata(state: { pageColorPicker: any; }, data: any) {
//       state.pageColorPicker = data;
//     },
//     radioUpdata(state: { pageTabVal: any; }, data: any) {
//       state.pageTabVal = data;
//     },
//     picurlUpdata(state: { pagePicUrl: any; }, data: any) {
//       state.pagePicUrl = data;
//     },
//     /**
//      * 更新页面设置中返回地址
//      * @param state
//      * @param data
//      */
//     returnAddressUpdata(state: { returnAddress: any; }, data: any) {
//       state.returnAddress = data;
//     },
//     /**
//      * 更新页面设置中顶部颜色
//      * @param state
//      * @param data
//      */
//     titleBgColorUpdata(state: { titleBgColor: any; }, data: any) {
//       state.titleBgColor = data;
//     },
//     /**
//      * 更新页面设置中顶部颜色
//      * @param state
//      * @param data
//      */
//     titleColorUpdata(state: { titleColor: any; }, data: any) {
//       state.titleColor = data;
//     },
//   },
//   actions: {
//     getData({ commit }: any, data: any) {},
//   },
// };
