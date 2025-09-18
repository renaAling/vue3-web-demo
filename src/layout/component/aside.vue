<template>
	<div class="h100" v-show="!isTagsViewCurrenFull" :style="{ '--menu-item-margin': themeConfig.isCollapse ? '5px' : '20px' }">
		<el-aside class="layout-aside" :class="setCollapseStyle" v-if="setShowAside">
			<Logo v-if="setShowLogo" />
			<el-scrollbar class="flex-auto" ref="layoutAsideScrollbarRef" @mouseenter="onAsideEnterLeave(true)" @mouseleave="onAsideEnterLeave(false)">
				<Vertical :menuList="state.menuList" />
			</el-scrollbar>
			<div class="layout-aside-footer" v-if="isPortal || isPortalInit">
				<div class="layout-aside-footer-box">
					<el-menu default-active="2" class="el-menu-vertical-demo">
						<el-tooltip class="box-item" effect="dark" :content="modeText" placement="right" v-auth="'management_mode'" v-if="themeConfig.isCollapse">
							<el-menu-item index="1" @click="handleSwitchMode">
								<img class="img" src="/@/assets/imgs/moshi.png" alt="" />
							</el-menu-item>
						</el-tooltip>
						<el-menu-item index="1" @click="handleSwitchMode" v-auth="'management_mode'" v-else>
								<img class="img" src="/@/assets/imgs/moshi.png" alt="" />
								<span>{{ modeText }}</span>
						</el-menu-item>

						<!-- <el-sub-menu index="2" v-if="!themeConfig.isCollapse">
							<template #title>
								<img class="img mr-5 active"
									:src="userInfos?.user?.avatar || 'https://gdsh-oss.duomixing.com:9086/rls/b/portal/default_avatar.png'" />
								<span>{{ userInfos?.user?.name || '账户名' }}</span>
							</template>
							<el-menu-item index="2-1" @click="modifyInfo">修改信息</el-menu-item>
							<el-menu-item index="2-2" @click="logOut">退出登录</el-menu-item>
						</el-sub-menu>
						<el-popover class="box-item" v-else placement="right">
							<template #reference>
								<el-menu-item index="2">
									<img class="img mr-5 active"
										:src="userInfos?.user?.avatar || 'https://gdsh-oss.duomixing.com:9086/rls/b/portal/default_avatar.png'" />
								</el-menu-item>
							</template>
							<el-menu-item index="2-1" @click="modifyInfo">修改信息</el-menu-item>
							<el-menu-item index="2-2" @click="logOut">退出登录</el-menu-item>
						</el-popover> -->
					</el-menu>
				</div>
			</div>
			<div class="layout-aside-footer" v-if="userInfos.isManagementModeMenu && isMall">
				<div class="layout-aside-footer-box">
					<el-menu default-active="2" class="el-menu-vertical-demo">
						<el-tooltip class="box-item" effect="dark" :content="modeText" placement="right" v-auth="'management_mode'" v-if="themeConfig.isCollapse">
							<el-menu-item index="1" @click="handleSwitchMode">
								<img class="img" src="/@/assets/imgs/moshi.png" alt="" />
							</el-menu-item>
						</el-tooltip>
						<el-menu-item index="1" @click="handleSwitchMode" v-auth="'management_mode'" v-else>
							<img class="img" src="/@/assets/imgs/moshi.png" alt="" /> <span>{{ modeText }}</span>
						</el-menu-item>
					</el-menu>
				</div>
			</div>
		</el-aside>
	</div>
</template>

<script setup lang="ts" name="layoutAside">
import { computed, defineAsyncComponent, onBeforeMount, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import mittBus from '/@/utils/mitt';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useUserInfo } from '/@/stores/userInfo';
import router from '/@/router';
import { ElMessageBox } from 'element-plus';
import { logout } from '/@/api/login';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';

const storesUser = useUserInfo();
import { usePortalList } from '/@/stores/portal';
const portalList = usePortalList(pinia);
const { userInfos } = storeToRefs(storesUser);

// 是否是管理模式
const { modeView } = storeToRefs(usePortalList(pinia));
const route = useRoute();
// 引入组件
const Logo = defineAsyncComponent(() => import('/@/layout/logo/index.vue'));
const Vertical = defineAsyncComponent(() => import('/@/layout/navMenu/vertical.vue'));
const { locale } = useI18n();
// 定义变量内容
const layoutAsideScrollbarRef = ref();
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const storesTagsViewRoutes = useTagsViewRoutes();
const { routesList } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const state = reactive<AsideState>({
	menuList: [],
	clientWidth: 0,
});
const portalId = ref('1853370696281276417');
const isPortal = computed(() => (Session.getTenant() == portalId.value ? true : false));
// console.log('isPortal', isPortal.value);

const mallIdList = ref([
	'1891678024273887233',
	'1891680610875998209',
	'1815608904948617218',
	'1925082852790239233',
	'1922165158034145281',
	'1922166211546841089',
	'1922177185280557058',
	'1922177651909459970',
	'1924405083223752706',
	'1924405741414907905',
	'1925074881528070146',
	'1925075171367059458',
	'1955172500933574657',
	'1855880243516456961',
	'1952919039072403458',
	'1955903831963467777',
	'1963773220574330882',
]);
const isMall = computed(() => (mallIdList.value.includes(Session.getTenant()) ? true : false));

// 设置菜单展开/收起时的宽度
const setCollapseStyle = computed(() => {
	const { layout, isCollapse, menuBar } = themeConfig.value;
	const asideBrTheme = ['#FFFFFF', '#FFF', '#fff', '#ffffff'];
	const asideBrColor = asideBrTheme.includes(menuBar) ? 'layout-el-aside-br-color' : '';
	// 判断是否是手机端
	if (state.clientWidth <= 1000) {
		if (isCollapse) {
			document.body.setAttribute('class', 'el-popup-parent--hidden');
			const asideEle = document.querySelector('.layout-container') as HTMLElement;
			const modeDivs = document.createElement('div');
			modeDivs.setAttribute('class', 'layout-aside-mobile-mode');
			asideEle.appendChild(modeDivs);
			modeDivs.addEventListener('click', closeLayoutAsideMobileMode);
			return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-open'];
		} else {
			// 关闭弹窗
			closeLayoutAsideMobileMode();
			return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-close'];
		}
	} else {
		return [
			asideBrColor,
			layout === 'columns'
				? isCollapse
					? 'layout-aside-pc-1'
					: locale.value === 'en'
					? 'layout-aside-pc-250'
					: 'layout-aside-pc-220'
				: isCollapse
				? 'layout-aside-pc-64'
				: locale.value === 'en'
				? 'layout-aside-pc-250'
				: 'layout-aside-pc-220',
		];
	}
});

// 设置是否显示左侧菜单栏
const setShowAside = computed(() => {
	let { layout } = themeConfig.value;
	if (layout !== 'classic') {
		return true;
	}
	// 首页不显示侧边栏
	return route.path !== '/home';
});

// 设置显示/隐藏 logo
const setShowLogo = computed(() => {
	let { layout, isShowLogo } = themeConfig.value;
	return (isShowLogo && layout === 'defaults') || (isShowLogo && layout === 'columns');
});

// 关闭移动端蒙版
const closeLayoutAsideMobileMode = () => {
	const el = document.querySelector('.layout-aside-mobile-mode');
	el?.setAttribute('style', 'animation: error-img-two 0.3s');
	setTimeout(() => {
		el?.parentNode?.removeChild(el);
	}, 300);
	const clientWidth = document.body.clientWidth;
	if (clientWidth < 1000) themeConfig.value.isCollapse = false;
	document.body.setAttribute('class', '');
};
// 设置/过滤路由（非静态路由/是否显示在菜单中）
const setFilterRoutes = () => {
	if (themeConfig.value.layout === 'columns') return false;
	state.menuList = filterRoutesFun(routesList.value);
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
// 设置菜单导航是否固定（移动端）
const initMenuFixed = (clientWidth: number) => {
	state.clientWidth = clientWidth;
};
// 鼠标移入、移出
const onAsideEnterLeave = (bool: Boolean) => {
	let { layout } = themeConfig.value;
	if (layout !== 'columns') return false;
	if (!bool) mittBus.emit('restoreDefault');
	stores.setColumnsMenuHover(bool);
};

let adminModel = ref(Session.get('adminModel') === 'admin');
const modeText = computed(() => (adminModel.value ? '退出管理模式' : '管理模式'));
const handleSwitchMode = () => {
	adminModel.value = !adminModel.value;
	const mode = adminModel.value ? 'admin' : 'user';

	Session.set('adminModel', mode);
	initBackEndControlRoutes();
	portalList.setModeView(mode);
};
// 修改信息
const modifyInfo = () => {
	router.push('/portal/personal/detail');
};
// 退出登录
const logOut = () => {
	ElMessageBox({
		closeOnClickModal: false,
		closeOnPressEscape: false,
		title: '提示',
		message: '此操作将退出登录, 是否继续?',
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		buttonSize: 'default',
		beforeClose: (action: string, instance: any, done: () => void) => {
			if (action === 'confirm') {
				instance.confirmButtonLoading = true;
				instance.confirmButtonText = '退出中';
				setTimeout(() => {
					done();
					setTimeout(() => {
						instance.confirmButtonLoading = false;
					}, 300);
				}, 700);
			} else {
				done();
			}
		},
	})
		.then(async () => {
			// 关闭全部的标签页
			mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 3, ...router }));
			// 调用后台接口
			await logout();
			// 清除缓存/token等
			Session.clear();
			// 使用 reload 时，不需要调用 resetRoute() 重置路由
			window.location.replace('/');
			// window.location.reload();
		})
		.catch(() => {});
};
// 页面加载前
onBeforeMount(() => {
	initMenuFixed(document.body.clientWidth);
	setFilterRoutes();
	// 此界面不需要取消监听(mittBus.off('setSendColumnsChildren))
	// 因为切换布局时有的监听需要使用，取消了监听，某些操作将不生效
	mittBus.on('setSendColumnsChildren', (res: MittMenu) => {
		state.menuList = res.children;
	});
	mittBus.on('setSendClassicChildren', (res: MittMenu) => {
		let { layout, isClassicSplitMenu } = themeConfig.value;
		if (layout === 'classic' && isClassicSplitMenu) {
			state.menuList = [];
			state.menuList = res.children;
		}
	});
	mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
		setFilterRoutes();
	});
	mittBus.on('layoutMobileResize', (res: LayoutMobileResize) => {
		initMenuFixed(res.clientWidth);
		closeLayoutAsideMobileMode();
	});
});
// 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
watch(themeConfig.value, (val) => {
	if (val.isShowLogoChange !== val.isShowLogo) {
		if (layoutAsideScrollbarRef.value) layoutAsideScrollbarRef.value.update();
	}
});
// 监听 pinia 值的变化，动态赋值给菜单中
watch(
	pinia.state,
	(val) => {
		let { layout, isClassicSplitMenu } = val.themeConfig.themeConfig;
		if (layout === 'classic' && isClassicSplitMenu) return false;
		setFilterRoutes();
	},
	{
		deep: true,
	}
);
const isPortalInit = ref(false);
watch(
	() => route.query,
	(val) => {
		isPortalInit.value = (val.tenantIdTarget === portalId.value || !val.tenantIdTarget) && Session.getTenant() == portalId.value ? true : false;
		// console.log('路由变化了===============', val);
	}
);
</script>
<style lang="scss" scoped>
.layout-aside-footer {
	display: flex;
	justify-content: center;

	.img {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		margin-right: 20px;

		&.active {
			background: #4785ea;
		}
	}

	.layout-aside-footer-box-item {
		display: flex;
		align-items: center;
		padding: 33px 0;
		font-size: 14px;
		font-weight: normal;
		line-height: 22px;
		letter-spacing: normal;
		cursor: pointer;
		color: #333333;
	}

	.el-menu-vertical-demo {
		background: transparent;

		.el-menu {
			background-color: transparent !important;
		}
	}

	:deep(.el-sub-menu__title) {
		margin: var(--menu-item-margin);
	}
}
</style>
