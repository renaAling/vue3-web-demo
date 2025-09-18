import { RouteRecordRaw } from 'vue-router';
import { routerList } from '/@/hooks/roterPath';
import { tr } from 'element-plus/es/locale';
const currentTenantId = import.meta.env.VITE_TENANT_ID;
/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
	interface RouteMeta {
		isLink?: string;
		isHide?: boolean;
		isAuth?: boolean;
		isKeepAlive?: boolean;
		isAffix?: boolean;
		isIframe?: boolean;
		roles?: string[];
		icon?: string;
	}
}
/**
 * 定义静态路由（默认路由）
 * 前端添加路由，请在此处加
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/home',
		name: '工作台',
		component: () => import('/@/views/home/index.vue'),
		meta: {
			isLink: '',
			// isHide: routerList[currentTenantId] ? true : false,
			isHide: true,
			isKeepAlive: true,
			isAffix: true,
			isIframe: false,
			icon: 'iconfont icon-shouye',
		},
	},
	{
		path: '/personal',
		name: 'router.personal',
		component: () => import('/@/views/admin/system/user/personal.vue'),
		meta: {
			isHide: true,
		},
	},
	{
		path: '/downloadCenter',
		name: 'router.downlaodCenter',
		component: () => import('/@/views/downLoadCenter/index.vue'),
		meta: {
			isHide: true,
		},
	},
	{
		path: '/transfer',
		name: '中转页',
		component: () => import('/@/views/transfer/index.vue'),
		meta: {
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'staticRoutes.login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			isAuth: false,
		},
	},
	{
		path: '/portalLogin',
		name: '门户登录页',
		component: () => import('/@/views/login/portal.vue'),
		meta: {
			isAuth: false,
		},
	},
	{
		path: '/noAuthority',
		name: 'staticRoutes.noAuthority',
		component: () => import('/@/views/noAuthority/index.vue'),
		meta: {
			isAuth: false,
		},
	},
	{
		path: '/authredirect',
		name: 'staticRoutes.authredirect',
		component: () => import('/@/views/login/component/authredirect.vue'),
		meta: {
			isAuth: false,
		},
	},
	// 门户首页
	// {
	// 	path: '/portalHome',
	// 	name: '门户首页',
	// 	component: () => import('/@/views/portal/home/index.vue'),
	// 	meta: {
	// 		isAuth: false,
	// 	},
	// },
	// 门户消息
	{
		path: '/portalNews',
		name: '门户消息',
		component: () => import('/@/views/portal/news/index.vue'),
		meta: {
			isAuth: false,
		},
	},
	// 门户消息
	{
		path: '/portal/personal/detail',
		name: '门户个人中心',
		component: () => import('/@/views/portal/personal/edit.vue'),
		meta: {
			isAuth: false,
		},
	},
	// 平台入驻-单独链接-填写提报资料
	{
		path: '/platformEntry',
		name: '填写提报资料',
		component: () => import('/@/views/platformEntry/dataFilling/index.vue'),
		meta: {
			isAuth: false,
		},
	},
	// 页面装修
	// {
	// 	path: '/culture/decoration/pageConfig/creatDevise/:id/:type',
	// 	name: '页面装修',
	// 	component: () => import('/@/views/culture/decoration/pageConfig/creatDevise.vue'),
	// 	meta: {
	// 		isAuth: false,
	// 		isHide: true
	// 	},
	// },
];

/**
 * 定义404、401界面
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'staticRoutes.notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'staticRoutes.noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			isHide: true,
		},
	},
];

/**
 *  基础性路由
 *
 * 所有节点都是挂载此节点下
 */
export const baseRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: routerList[currentTenantId] ? routerList[currentTenantId] : '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [],
	},
];
