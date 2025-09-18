import { defineStore } from 'pinia';
import * as productApi from '/@/api/culture/product';
import * as merchantApi from '/@/api/culture/merchant';
import * as logisticsApi from '/@/api/culture/logistics';

// types.ts
export interface ProductCategory {
	id: number;
	pid?: number;
	label?: string;
	value?: number | string;
	title?: string;
	name?: string;
	isShow?: boolean;
	disabled?: boolean;
	childList?: ProductCategory[];
}

export interface ProductBrand {
	id: number;
	brandName: string;
}

export interface ShippingTemplate {
	id: number;
	name: string;
}

function changeNodes(data: ProductCategory[]): ProductCategory[] {
	if (data.length > 0) {
		for (let i = 0; i < data.length; i++) {
			if (data[i].isShow === false) {
				data[i].disabled = true;
			}
			if (!data[i].childList || data[i].childList.length < 1) {
				delete data[i].childList;
			} else {
				changeNodes(data[i].childList);
			}
		}
	}
	return data;
}

export const useProductStore = defineStore('product', {
	state: (): {
		adminProductClassify: ProductCategory[];
		productBrand: ProductBrand[];
		merProductClassify: ProductCategory[];
		shippingTemplates: ShippingTemplate[];
	} => ({
		adminProductClassify: localStorage.getItem('adminProductClassify') ? JSON.parse(localStorage.getItem('adminProductClassify')!) : [],
		productBrand: localStorage.getItem('productBrand') ? JSON.parse(localStorage.getItem('productBrand')!) : [],
		merProductClassify: localStorage.getItem('merProductClassify') ? JSON.parse(localStorage.getItem('merProductClassify')!) : [],
		shippingTemplates: localStorage.getItem('shippingTemplates') ? JSON.parse(localStorage.getItem('shippingTemplates')!) : [],
	}),
	actions: {
		async getAdminProductClassify() {
			try {
				const res = await productApi.productCategoryApi();
				const formatted = changeNodes(res);
				this.adminProductClassify = formatted;
				localStorage.setItem('adminProductClassify', JSON.stringify(formatted));
				if (!formatted.length) localStorage.removeItem('adminProductClassify');
			} catch (error) {
				console.error('获取平台商品分类失败:', error);
				throw error;
			}
		},
		async getMerProductBrand() {
			try {
				const res = await productApi.brandListAllApi();
				this.productBrand = res;
				localStorage.setItem('productBrand', JSON.stringify(res));
				if (!res.length) localStorage.removeItem('productBrand');
			} catch (error) {
				console.error('获取商品品牌失败:', error);
				throw error;
			}
		},
		async getMerProductClassify(merId: number) {
			try {
				const res = await merchantApi.storeCategoryAllApi(merId);
				const formatted = changeNodes(res);
				this.merProductClassify = formatted;
				localStorage.setItem('merProductClassify', JSON.stringify(formatted));
				if (!formatted.length) localStorage.removeItem('merProductClassify');
			} catch (error) {
				console.error('获取商户商品分类失败:', error);
				throw error;
			}
		},
		async getShippingTemplates(merId?: number) {
			try {
				const res = await logisticsApi.shippingTemplatesList({
					merId,
					keywords: '',
					page: 1,
					limit: 9999,
				});
				this.shippingTemplates = res.records;
				localStorage.setItem('shippingTemplates', JSON.stringify(res.records));
				if (!res.records.length) localStorage.removeItem('shippingTemplates');
			} catch (error) {
				console.error('获取运费模板失败:', error);
				throw error;
			}
		},
	},
});
