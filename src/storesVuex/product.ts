import { ActionContext } from 'vuex';
import { productCategoryApi, brandListAllApi } from '/@/api/culture/product/product';
import { storeCategoryAllApi } from '/@/api/culture/merchant/classify';
import { shippingTemplatesList } from '/@/api/culture/logistics';

// 定义 state 的类型
interface ProductState {
	adminProductClassify: any[];
	productBrand: any[];
	merProductClassify: any[];
	shippingTemplates: any[];
}
const state = {
	// 平台商品分类
	adminProductClassify: (() => {
		const data = localStorage.getItem('adminProductClassify');
		return data ? JSON.parse(data) : [];
	})(),
	// 商品品牌
	productBrand: (() => {
		const data = localStorage.getItem('productBrand');
		return data ? JSON.parse(data) : [];
	})(),
	// 商户商品分类
	merProductClassify: (() => {
		const data = localStorage.getItem('merProductClassify');
		return data ? JSON.parse(data) : [];
	})(),
	// 运费模板
	shippingTemplates: (() => {
		const data = localStorage.getItem('shippingTemplates');
		return data ? JSON.parse(data) : [];
	})(),
};

const mutations = {
	SET_AdminProductClassify: (state: ProductState, adminProductClassify: any[]) => {
		state.adminProductClassify = adminProductClassify;
		localStorage.setItem('adminProductClassify', JSON.stringify(changeNodes(adminProductClassify)));
		if (!adminProductClassify.length) localStorage.removeItem('adminProductClassify');
	},
	SET_MerProductClassify: (state: ProductState, merProductClassify: any[]) => {
		state.merProductClassify = merProductClassify;
		if (!merProductClassify.length) localStorage.removeItem('merProductClassify');
	},
	SET_ProductBrand: (state: ProductState, productBrand: any[]) => {
		state.productBrand = productBrand;
		localStorage.setItem('productBrand', JSON.stringify(productBrand));
		if (!productBrand.length) localStorage.removeItem('productBrand');
	},
	SET_ShippingTemplates: (state: ProductState, shippingTemplates: any[]) => {
		state.shippingTemplates = shippingTemplates;
		if (!shippingTemplates.length) localStorage.removeItem('shippingTemplates');
	},
};

const actions = {
	/** 平台商品分类 **/
	getAdminProductClassify({ commit, dispatch }: ActionContext<ProductState, any>) {
		return new Promise((resolve, reject) => {
			productCategoryApi()
				.then(async (res) => {
					commit('SET_AdminProductClassify', changeNodes(res));
					resolve(res);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** 商品品牌 **/
	getMerProductBrand({ commit }: ActionContext<ProductState, any>) {
		return new Promise((resolve, reject) => {
			brandListAllApi()
				.then(async (res) => {
					commit('SET_ProductBrand', res);
					resolve(res);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** 商户商品分类 **/
	getMerProductClassify({ commit }: ActionContext<ProductState, any>, data: any) {
		return new Promise((resolve, reject) => {
			storeCategoryAllApi(data.merId)
				.then(async (res) => {
					const list = res.data || res;
					commit('SET_MerProductClassify', changeNodes(list));
					localStorage.setItem('merProductClassify', JSON.stringify(changeNodes(list)));
					resolve(res);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	/** 运费模板 **/
	getShippingTemplates({ commit }: ActionContext<ProductState, any>, data: any) {
		return new Promise((resolve, reject) => {
			shippingTemplatesList({
				merId: data?.merId,
				keywords: '',
				page: 1,
				limit: 9999,
			})
				.then(async (res) => {
					commit('SET_ShippingTemplates', res.records);
					localStorage.setItem('shippingTemplates', JSON.stringify(res.records));
					resolve(res);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
};

const getters = {
	adminProductClassify: (state: ProductState) => state.adminProductClassify,
	productBrand: (state: ProductState) => state.productBrand,
	merProductClassify: (state: ProductState) => state.merProductClassify,
	shippingTemplates: (state: ProductState) => state.shippingTemplates,
};

/** tree去除 childList=[] 的结构**/
const changeNodes = function (data: any[]) {
	if (data.length > 0) {
		for (var i = 0; i < data.length; i++) {
			if (data[i].isShow === false) {
				data[i].disabled = true;
			}
			if (!data[i].childList || data[i].childList.length < 1) {
				data[i].childList = undefined;
			} else {
				changeNodes(data[i].childList);
			}
		}
	}
	return data;
};

// Vuex 4.0 导出方式
export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
	changeNodes,
};
