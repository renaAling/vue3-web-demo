import Cookies from 'js-cookie';

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 * keys 系统所有的缓存key
 */
const keys: string[] = ['token', 'userInfo', 'tenantId', 'roleIds', 'merchantId', 'merchantCode'];

export const Local = {
	// 查看 v2.4.3版本更新日志
	setKey(key: string) {
		// @ts-ignore
		return `${__NEXT_NAME__}:${key}`;
	},
	// 设置永久缓存
	set<T>(key: string, val: T) {
		window.localStorage.setItem(Local.setKey(key), JSON.stringify(val));
	},
	// 获取永久缓存
	get(key: string) {
		let json = <string>window.localStorage.getItem(Local.setKey(key));
		return JSON.parse(json);
	},
	// 移除永久缓存
	remove(key: string) {
		window.localStorage.removeItem(Local.setKey(key));
	},
	// 移除全部永久缓存
	clear() {
		window.localStorage.clear();
	},
};
/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
	// 设置临时缓存
	set(key: string, val: any) {
		if (keys.includes(key)) {
			Cookies.set(key, val);
		}
		window.sessionStorage.setItem(key, JSON.stringify(val));
	},
	// 获取临时缓存
	get(key: string) {
		if (keys.includes(key)) return Cookies.get(key);
		let json = <string>window.sessionStorage.getItem(key);
		return JSON.parse(json);
	},
	// 移除临时缓存
	remove(key: string) {
		if (keys.includes(key)) return Cookies.remove(key);
		window.sessionStorage.removeItem(key);
	},
	// 移除全部临时缓存
	clear() {
		keys.forEach((key) => {
			Cookies.remove(key);
		});
		window.sessionStorage.clear();
	},
	// 获取当前存储的 token
	getToken() {
		return this.get('token');
	},
	// 获取当前的租户
	getTenant() {
		// return Session.get('tenantId');
		return Local.get('tenantId') ? Local.get('tenantId') : import.meta.env.VITE_TENANT_ID;
	},
	getTenantPortal() {
		return import.meta.env.VITE_TENANT_ID;
	},

	// 获取当前登录用户的商户ID
	getMerchantId() {
		return Session.get('merchantCode');
	},
};
