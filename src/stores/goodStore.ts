import { defineStore } from 'pinia';
// 好店系统
export const useGoodStoreList = defineStore('goodStore', {
	state: (): GoodStoreListState => ({
		merchantList: [],
	}),
	actions: {
		async setMerchantList(data: Array<string>) {
			this.merchantList = data;
		},
	},
});
