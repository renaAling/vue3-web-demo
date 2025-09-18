import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useKeepALiveNames } from '/@/stores/keepAliveNames';
import { useRoutesList } from '/@/stores/routesList';
import { Local, Session } from '/@/utils/storage';
import { staticRoutes, notFoundAndNoPower } from '/@/router/route';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { loginByFree } from '../api/login';
import { routerList } from '/@/hooks/roterPath';
import Cookies from 'js-cookie';

/**
 * 1、前端控制路由时：isRequestRoutes 为 false，需要写 roles，需要走 setFilterRoute 方法。
 * 2、后端控制路由时：isRequestRoutes 为 true，不需要写 roles，不需要走 setFilterRoute 方法），
 * 相关方法已拆解到对应的 `backEnd.ts` 与 `frontEnd.ts`（他们互不影响，不需要同时改 2 个文件）。
 * 特别说明：
 * 1、前端控制：路由菜单由前端去写（无菜单管理界面，有角色管理界面），角色管理中有 roles 属性，需返回到 userInfo 中。
 * 2、后端控制：路由菜单由后端返回（有菜单管理界面、有角色管理界面）
 */
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
// 好店-商家的租户ID
const isPortal = computed(() => (Session.getTenant() === '1853370696281276417' ? true : false));
console.log('isPortal', isPortal.value);
/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
export const router = createRouter({
	history: createWebHashHistory(),
	/**
	 * 说明：
	 * 1、notFoundAndNoPower 默认添加 404、401 界面，防止一直提示 No match found for location with path 'xxx'
	 * 2、backEnd.ts(后端控制路由)、frontEnd.ts(前端控制路由) 中也需要加 notFoundAndNoPower 404、401 界面。
	 *    防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
	 */
	routes: [...notFoundAndNoPower, ...staticRoutes],
});

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
	if (arr.length <= 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（baseRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
	if (arr.length <= 0) return false;
	const newArr: any = [];
	const cacheList: Array<string> = [];
	arr.forEach((v: any) => {
		// console.log('v=========================', v);
		if (v.path) {
			if (v.path === '/') {
				newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
			} else {
				// 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
				if (v.path.indexOf('/:') > -1) {
					v.meta['isDynamic'] = true;
					v.meta['isDynamicPath'] = v.path;
				}
				newArr[0].children.push({ ...v });
				// 存 name 值，keep-alive 中 include 使用，实现路由的缓存
				// 路径：/@/layout/routerView/parent.vue
				if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
					cacheList.push(v.name);
					const stores = useKeepALiveNames(pinia);
					stores.setCacheKeepAlive(cacheList);
				}
			}
		}
	});
	return newArr;
}

function hasPath(routesList: any, targetPath: string) {
	// 遍历每一个路由对象
	for (const route of routesList) {
		// 检查当前路由的 path
		if (route.path === targetPath) {
			return true; // 找到匹配的 path
		}
		// 如果当前路由有 children，递归检查
		if (route.children && Array.isArray(route.children)) {
			if (hasPath(route.children, targetPath)) {
				return true; // 在 children 中找到匹配的 path
			}
		}
	}
	return false; // 没有找到匹配的 path
}

// 路由加载前
router.beforeEach(async (to, from, next) => {
	console.log('aaa', to);
	NProgress.configure({ showSpinner: false });
	if (to.name) NProgress.start();
	const routerToken = computed(() => to.query.token); // 当前路由token
	const routerTenantId = computed(() => to.query.tenantId); // 当前租户ID
	// const tenantIdTarget =  computed(() => to.query.tenantIdTarget); // 目标租户ID
	// const pathTarget = computed(() => to.query.jumpLink); // 目标路由
	// if (routerToken.value) { 本系统内部玩各子系统
	// 	// 单点登录
	// 	const storesRoutesList = useRoutesList(pinia);
	// 	// console.log('routerToken旧', routerToken.value);
	// 	const res = await loginByFree(routerToken.value, routerTenantId.value, tenantIdTarget.value);
	// 	Session.set('token', res.access_token); // 目标token
	// 	Session.set('refresh_token', res.refresh_token);
	// 	Session.set('tenantId', tenantIdTarget.value);
	// 	Local.set('tenantId', tenantIdTarget.value);
	// 	Cookies.set('tenantId', tenantIdTarget.value);
	// 	// console.log('routerToken新', res.access_token);
	// 	storesRoutesList.setRoutesList([]);
	// 	const storesKeepALiveNames = useKeepALiveNames(pinia);
	// 	storesKeepALiveNames.setCacheKeepAlive([]);
	// 	next();
	// }
	if (routerToken.value) {
		// 各子系统自己玩
		// 单点登录
		console.log('routerToken', routerToken.value);
		const res = await loginByFree(routerToken.value, routerTenantId.value);
		Session.set('token', res.access_token);
		Session.set('refresh_token', res.refresh_token);
		// 会员系统跳转其他平台授权使用的数据
		if (to.query.isAuthorization) {
			Session.set('authorization', JSON.stringify(to.query));
		}
	}
	const token = Session.getToken();
	if (to.meta.isAuth !== undefined && !to.meta.isAuth) {
		next();
		NProgress.done();
	} else {
		console.log('to.path', to.path, 'to.query', to.query);
		if (!token) {
			const login = isPortal.value ? '/portalLogin' : '/login';
			next(`${login}?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
			Session.clear();
			NProgress.done();
		} else if (token && to.path === '/login') {
			const currentTenantId = import.meta.env.VITE_TENANT_ID;
			const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
			next(routerList[currentTenantId] ? routerList[currentTenantId] : redirectUrl || '/home');
			NProgress.done();
		} else {
			const storesRoutesList = useRoutesList(pinia);
			const { routesList } = storeToRefs(storesRoutesList);
			const redirectUrl = import.meta.env.VITE_REDIRECT_URL;
			const currentTenantId = import.meta.env.VITE_TENANT_ID;
			if (routesList.value.length === 0) {
				console.log('后端控制路由：路由数据初始化，防止刷新时丢失');
				// 后端控制路由：路由数据初始化，防止刷新时丢失
				await initBackEndControlRoutes();
				// const path = (pathTarget.value && typeof pathTarget.value === 'string') ? decodeURIComponent(pathTarget.value) : to.path;
				// console.log('pathTarget=============', path)
				// next({ path: path, query: to.query,replace: true });
				const isAdminModel = Session.get('isAdminModel');
				const adminModel = Session.get('adminModel');
				console.log('isAdminModel', isAdminModel);
				console.log('adminModel', adminModel);
				if (!isAdminModel && adminModel === 'admin') {
					console.log('进这个了');
					next(routerList[currentTenantId] ? routerList[currentTenantId] : redirectUrl || '/home');
				}
				console.log("to.path",to.path)
				console.log("redirectUrl",redirectUrl)
				if (to.path == '/home') {
					console.log('过来了')
					next({ path: redirectUrl, query: to.query });
				} else next({ path: to.path, query: to.query });
				return;
			} else {
				next();
			}
		}
	}
});

// 路由加载后
router.afterEach(() => {
	NProgress.done();
});

// 导出路由
export default router;
