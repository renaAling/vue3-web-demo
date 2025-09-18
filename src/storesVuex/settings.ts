import { ActionContext } from 'vuex';
import Cache from '/@/utils/cache';

// 定义状态（State）接口
interface RootState {
	theme: string;
	sideTheme: boolean;
	topNav: boolean;
	showSettings: boolean;
	tagsView: boolean;
	fixedHeader: boolean;
	sidebarLogo: boolean;
	navIcon: boolean;
	frontDomain: string;
	mediaDomain: string;
}

// 默认设置值
const showSettings = true;
const tagsView = true;
const fixedHeader = true;
const sidebarLogo = true;
const topNav = true;
const sideTheme = true;
const navIcon = true;

// 从缓存中获取布局设置
const storageSetting = Cache.local.has('layout-setting') ? Cache.local.getJSON('layout-setting') : {};

// 初始化状态
const state: RootState = {
	theme: storageSetting.theme || '#409EFF',
	sideTheme: storageSetting.sideTheme !== undefined ? storageSetting.sideTheme : sideTheme,
	topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
	showSettings: showSettings,
	tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
	fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
	sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
	navIcon: storageSetting.navIcon === undefined ? navIcon : storageSetting.navIcon,
	frontDomain: localStorage.getItem('frontDomain') || '', // 移动端域名
	mediaDomain: localStorage.getItem('mediaDomain') || '', // 图片域名
};

// Mutations 类型声明
type MutationType = {
	CHANGE_SETTING: (state: RootState, payload: { key: keyof RootState; value: any }) => void;
	SET_FrontDomain: (state: RootState, frontDomain: string) => void;
	SET_mediaDomain: (state: RootState, mediaDomain: string) => void;
};

// Mutations 实现
const mutations: MutationType = {
	CHANGE_SETTING(state, { key, value }) {
		if (key in state) {
			state[key] = value;
		}
	},
	SET_FrontDomain(state, frontDomain) {
		state.frontDomain = frontDomain;
		if (frontDomain) {
			localStorage.setItem('frontDomain', frontDomain);
		} else {
			localStorage.removeItem('frontDomain');
		}
	},
	SET_mediaDomain(state, mediaDomain) {
		state.mediaDomain = mediaDomain;
		if (mediaDomain) {
			localStorage.setItem('mediaDomain', mediaDomain);
		} else {
			localStorage.removeItem('mediaDomain');
		}
	},
};

// Actions 类型声明
type ActionAugments = ActionContext<RootState, RootState>;
type Actions = {
	changeSetting({ commit }: ActionAugments, data: { key: keyof RootState; value: any }): void;
};

// Actions 实现
const actions: Actions = {
	changeSetting({ commit }, data) {
		commit('CHANGE_SETTING', data);
	},
};

// Getters 类型声明
type Getters = {
	frontDomain: (state: RootState) => string;
	mediaDomain: (state: RootState) => string;
};

// Getters 实现
const getters: Getters = {
	frontDomain: (state) => state.frontDomain,
	mediaDomain: (state) => state.mediaDomain,
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
// import { ActionContext } from 'vuex';
// import Cache from '/@/utils/cache';
// const showSettings = true;
// const tagsView = true;
// const fixedHeader = true;
// const sidebarLogo = true;
// const topNav = true;
// const sideTheme = true;
// const navIcon = true;

// // const { showSettings, tagsView, fixedHeader, sidebarLogo, topNav, sideTheme, navIcon } = defaultSettings;
// const storageSetting = Cache.local.has('layout-setting') ? Cache.local.getJSON('layout-setting') : '';
// const state = {
// 	theme: storageSetting.theme || '#409EFF',
// 	sideTheme: storageSetting.sideTheme || sideTheme,
// 	topNav: storageSetting.topNav === undefined ? topNav : storageSetting.topNav,
// 	showSettings: showSettings,
// 	tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
// 	fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
// 	sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
// 	navIcon: storageSetting.navIcon === undefined ? navIcon : storageSetting.navIcon,
// 	frontDomain: localStorage.getItem('frontDomain') || '', //移动端域名
// 	mediaDomain: localStorage.getItem('mediaDomain') || '', //图片域名
// };
// const mutations = {
// 	CHANGE_SETTING: (state, { key, value }) => {
// 		if (state.hasOwnProperty(key)) {
// 			state[key] = value;
// 		}
// 	},
// 	SET_FrontDomain(state, frontDomain) {
// 		state.frontDomain = frontDomain;
// 		localStorage.setItem('frontDomain', frontDomain);
// 		if (!frontDomain) localStorage.removeItem('frontDomain');
// 	},
// 	SET_mediaDomain(state, mediaDomain) {
// 		state.mediaDomain = mediaDomain;
// 		if (!mediaDomain) localStorage.removeItem('mediaDomain');
// 	},
// };

// const actions = {
// 	changeSetting({ commit }, data) {
// 		commit('CHANGE_SETTING', data);
// 	},
// };

// const getters = {
// 	frontDomain: (state: any) => state.frontDomain,
// 	mediaDomain: (state: any) => state.mediaDomain,
// };

// export default {
// 	namespaced: true,
// 	state,
// 	getters,
// 	mutations,
// 	actions,
// };
