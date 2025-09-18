import { ActionContext } from 'vuex';
import * as merchant from '/@/api/culture/merchant';
// 定义 state 类型（可选）
interface MerchantState {
	merchantClassify: any[];
	merchantType: any[];
}
const state: MerchantState = {
	merchantClassify: JSON.parse(localStorage.getItem('merchantClassify')) || [] /** 商户分类 **/,
	merchantType: JSON.parse(localStorage.getItem('merchantType')) || [] /** 商户类型 **/,
};

const mutations = {
	SET_MerchantClassify: (state: MerchantState, merchantClassify: any[]) => {
		state.merchantClassify = merchantClassify;
		if (!merchantClassify.length) localStorage.removeItem('merchantClassify');
	},
	SET_MerchantType: (state: MerchantState, merchantType: any) => {
		state.merchantType = merchantType;
		if (!merchantType.length) localStorage.removeItem('merchantType');
	},
};

const actions = {
	/** 商户全部分类  **/
	getMerchantClassify({ commit }: ActionContext<MerchantState, any>) {
		return new Promise((resolve, reject) => {
			merchant
				.merchantCategoryAllListApi()
				.then(async (res) => {
					commit('SET_MerchantClassify', res);
					localStorage.setItem('merchantClassify', JSON.stringify(res));
					resolve(res);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** 商户全部类型 **/
	getMerchantType({ commit }: ActionContext<MerchantState, any>) {
		return new Promise((resolve, reject) => {
			merchant
				.merchantTypeAllListApi()
				.then(async (res) => {
					commit('SET_MerchantType', res);
					localStorage.setItem('merchantType', JSON.stringify(res));
					resolve(res);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
};

/** tree去除 childList=[] 的结构**/
const changeNodes = function (data: any[]) {
	if (data.length > 0) {
		for (var i = 0; i < data.length; i++) {
			if (!data[i].childList || data[i].childList.length < 1) {
				data[i].childList = undefined;
			} else {
				changeNodes(data[i].childList);
			}
		}
	}
	return data;
};
const getters = {
	merchantClassify: (state: MerchantState) => state.merchantClassify,
	merchantType: (state: MerchantState) => state.merchantType,
};
export default {
	namespaced: true,
	state,
	mutations,
	getters,
	actions,
	changeNodes,
};
