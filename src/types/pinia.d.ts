/**
 * pinia 类型定义
 */

// 用户信息
declare interface UserInfosState<T = any> {
	userInfos: {
		authBtnList: string[];
		photo: string;
		roles: string[];
		time: number;
		userName: string;
		[key: string]: T;
	};
}
// 用户可见角色列表
declare interface UserRoleState<T = any> {
	userRoleList: T[];
}

// 路由缓存列表
declare interface KeepAliveNamesState {
	keepAliveNames: string[];
	cachedViews: string[];
}

// 后端返回原始路由(未处理时)
declare interface RequestOldRoutesState {
	requestOldRoutes: string[];
}

// TagsView 路由列表
declare interface TagsViewRoutesState<T = any> {
	tagsViewRoutes: T[];
	isTagsViewCurrenFull: Boolean;
	favoriteRoutes: T[];
}

// 路由列表
declare interface RoutesListState<T = any> {
	routesList: T[];
	isColumnsMenuHover: Boolean;
	isColumnsNavHover: Boolean;
}
declare interface GoodStoreListState<T = any> {
	merchantList: T[];
}
declare interface portalState {
	homeActive: Boolean;
	newsActive: Boolean;
	setActive: Boolean;
	modeView: string;
	systemList: T[];
}
// 布局配置
declare interface ThemeConfigState {
	themeConfig: {
		isDrawer: boolean;
		primary: string;
		topBar: string;
		topBarColor: string;
		isTopBarColorGradual: boolean;
		menuBar: string;
		menuBarColor: string;
		menuBarActiveColor: string;
		isMenuBarColorGradual: boolean;
		columnsMenuBar: string;
		columnsMenuBarColor: string;
		isColumnsMenuBarColorGradual: boolean;
		isColumnsMenuHoverPreload: boolean;
		isCollapse: boolean;
		isUniqueOpened: boolean;
		isFixedHeader: boolean;
		isFixedHeaderChange: boolean;
		isClassicSplitMenu: boolean;
		isLockScreen: boolean;
		lockScreenTime: number;
		isShowLogo: boolean;
		isShowLogoChange: boolean;
		isBreadcrumb: boolean;
		isTagsview: boolean;
		isBreadcrumbIcon: boolean;
		isTagsviewIcon: boolean;
		isCacheTagsView: boolean;
		isSortableTagsView: boolean;
		isShareTagsView: boolean;
		isFooter: boolean;
		isGrayscale: boolean;
		isInvert: boolean;
		isIsDark: boolean;
		isWartermark: boolean;
		// isChat: boolean;
		wartermarkText: string;
		quickLinkNum: number;
		tagsStyle: string;
		animation: string;
		columnsAsideStyle: string;
		columnsAsideLayout: string;
		layout: string;
		isRequestRoutes: boolean;
		globalTitle: string;
		globalI18n: string;
		globalComponentSize: string;
		footerAuthor: string;
		background?: string;
		miniQr?: string;
	};
}

// 交易组件公共换成的数据
declare interface TrcompsListState<T = any> {
	merchantClassify: T[];
	merchantType: T[];
	channelList: T[];
}

declare interface manageModeState {
	isManageMode: Boolean;
}
// declare interface TenantConfig {
// 	[key: string]: string;
//   }
declare interface TenantConfig {
	[key: string]:
		| string
		| {
				name: string;
				isMerchant: boolean;
				isMall?: boolean;
				isLink?: string;
		  };
}

declare interface TenantConfigState {
	tenantConfig: TenantConfig;
}
