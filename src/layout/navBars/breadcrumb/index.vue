<template>
	<div class="layout-navbars-breadcrumb-index">
		<Logo v-if="setIsShowLogo" />
		<Breadcrumb />
		<Horizontal :menuList="state.menuList" v-if="isLayoutTransverse" />
		<!-- <div class="user">
			<PortalUser v-if="(isPortal || isPortalInit)" />
			<User v-else />
		</div> -->
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbIndex">
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import mittBus from '/@/utils/mitt';
import { Session } from '/@/utils/storage';

// 引入组件
const Breadcrumb = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/breadcrumb.vue'));
const User = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/user.vue'));
// 门户
const PortalUser = defineAsyncComponent(() => import('/@/layout/navBars/portalUser.vue'));

const Logo = defineAsyncComponent(() => import('/@/layout/logo/index.vue'));
const Horizontal = defineAsyncComponent(() => import('/@/layout/navMenu/horizontal.vue'));

// 定义变量内容
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { routesList } = storeToRefs(stores);
const route = useRoute();
const state = reactive({
	menuList: [] as RouteItems,
});
// const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
const portalId = ref('1853370696281276417');
// 门户
const isPortal = computed(() => (Session.getTenant() == portalId.value ? true : false)) || false;
console.log('当前租户ID', Session.getTenant());
// console.log('成都轨道生活智慧服务平台index', isPortal.value);
// 设置 logo 显示/隐藏
const setIsShowLogo = computed(() => {
	let { isShowLogo, layout } = themeConfig.value;
	return (isShowLogo && layout === 'classic') || (isShowLogo && layout === 'transverse');
});
// 设置是否显示横向导航菜单
const isLayoutTransverse = computed(() => {
	let { layout, isClassicSplitMenu } = themeConfig.value;
	return layout === 'transverse' || (isClassicSplitMenu && layout === 'classic');
});
// 设置/过滤路由（非静态路由/是否显示在菜单中）
const setFilterRoutes = () => {
	let { layout, isClassicSplitMenu } = themeConfig.value;
	if (layout === 'classic' && isClassicSplitMenu) {
		state.menuList = delClassicChildren(filterRoutesFun(routesList.value));
		const resData = setSendClassicChildren(route.path);
		mittBus.emit('setSendClassicChildren', resData);
	} else {
		state.menuList = filterRoutesFun(routesList.value);
	}
};
// 设置了分割菜单时，删除底下 children
const delClassicChildren = <T extends ChilType>(arr: T[]): T[] => {
	arr.map((v: T) => {
		if (v.children) delete v.children;
	});
	return arr;
};
// 路由过滤递归函数
const filterRoutesFun = <T extends RouteItem>(arr: T[]): T[] => {
	return arr
		.filter((item: T) => !item.meta?.isHide)
		.map((item: T) => {
			item = Object.assign({}, item);
			if (item.children) item.children = filterRoutesFun(item.children);
			return item;
		});
};
// 传送当前子级数据到菜单中
const setSendClassicChildren = (path: string) => {
	const currentPathSplit = path.split('/');
	let currentData: MittMenu = { children: [] };
	filterRoutesFun(routesList.value).map((v: RouteItem, k: number) => {
		if (v.path === `/${currentPathSplit[1]}`) {
			v['k'] = k;
			currentData['item'] = { ...v };
			currentData['children'] = [{ ...v }];
			if (v.children) currentData['children'] = v.children;
		}
	});
	return currentData;
};
// 页面加载时
onMounted(() => {
	setFilterRoutes();
	mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
		setFilterRoutes();
	});
});
// 页面卸载时
onUnmounted(() => {
	mittBus.off('getBreadcrumbIndexSetFilterRoutes', () => {});
});
const isPortalInit = ref(false);
watch(
	() => route.query,
	(val) => {
		isPortalInit.value = (val.tenantIdTarget === portalId.value || !val.tenantIdTarget) && Session.getTenant() ==  portalId.value ? true : false;
		// console.log('成都轨道生活智慧服务平台index-watch', isPortalInit.value);
	}
);
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-index {
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: var(--next-bg-topBar);
	border-bottom: 1px solid var(--next-border-color-light);
}
.background {
	background: #4785EA;
	box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
}
.border-bottom-none {
	border-bottom: 0
}
</style>
