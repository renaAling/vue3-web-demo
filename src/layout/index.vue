<template>
	<component :is="layouts[themeConfig.layout]" />
</template>

<script setup lang="ts" name="layout">
import { onBeforeMount, onUnmounted, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { Local, Session } from '/@/utils/storage';
import mittBus from '/@/utils/mitt';
// 引入组件
const layouts: any = {
	defaults: defineAsyncComponent(() => import('/@/layout/main/defaults.vue')),
	classic: defineAsyncComponent(() => import('/@/layout/main/classic.vue')),
	transverse: defineAsyncComponent(() => import('/@/layout/main/transverse.vue')),
	columns: defineAsyncComponent(() => import('/@/layout/main/columns.vue')),
};

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
	if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout);
	const clientWidth = document.body.clientWidth;
	if (clientWidth < 1000) {
		themeConfig.value.isCollapse = false;
		mittBus.emit('layoutMobileResize', {
			layout: 'defaults',
			clientWidth,
		});
	} else {
		mittBus.emit('layoutMobileResize', {
			layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
			clientWidth,
		});
	}
};
const router = useRouter();
// 返回首页
const backHome = async () => {
	const token = Session.getToken();
	const tenantId = Session.getTenant();
	const jumpLink = encodeURIComponent('/portal/home/index');
	//const jumpLink = encodeURIComponent('/home');
	const tenantIdTarget = "1853370696281276417";
	router.push({ path: '/transfer', query: { tenantId, token, jumpLink, tenantIdTarget } });
};
const handlePopState = (e: { state: { current: string; forward: string | string[]; }; }) => {
	if (e.state.current == '/portal/home/index' && e.state.forward.includes('/transfer')) {
		backHome()
	}
}

// 页面加载前
onBeforeMount(() => {
	onLayoutResize();
	window.addEventListener('resize', onLayoutResize);
	// 监听浏览器的返回按钮事件 popstate
	window.addEventListener('popstate', handlePopState);
});
// 页面卸载时
onUnmounted(() => {
	window.removeEventListener('resize', onLayoutResize);
	// 移除浏览器的返回按钮事件 popstate
	window.removeEventListener('popstate', handlePopState);
});
</script>
