import { defineStore } from 'pinia';
import { merchantCategoryAllListApi, merchantTypeAllListApi, channelListApi } from '/@/api/trcomps/merchant';
// 好店系统
export const useTrcomps = defineStore('trcomps', {
	state: (): TrcompsListState => ({
		merchantClassify: [], // 商户全部分类
		merchantType: [],
		channelList: [], // 供应商渠道列表
	}),
	actions: {
		async setMerchantClassify() {
			return new Promise((resolve, reject) => {
				merchantCategoryAllListApi()
					.then((res) => {
						this.merchantClassify = res.data;
						resolve(res);
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		async setChannelListy() {
			return new Promise((resolve, reject) => {
				channelListApi()
					.then((res) => {
						// eslint-disable-next-line no-console
						console.log('res', res);
						this.channelList = res.data;
						resolve(res);
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		async setMerchantType() {
			return new Promise((resolve, reject) => {
				merchantTypeAllListApi()
					.then((res) => {
						// eslint-disable-next-line no-console
						console.log('res', res);
						this.merchantType = res.data;
						resolve(res);
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
	},
});
