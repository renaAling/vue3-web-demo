<template>
	<div class="layout-navbars-breadcrumb-user" >
		<!-- 系统导航栏 -->
		 <!-- <el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" v-for="item in systemListData">
			<div class="title">
				{{ item.name }}
				<el-icon class="el-icon--right" :color="'#ffffff'">
					<ele-ArrowDown />
				</el-icon>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item v-for="ele in item.subSys"
						:command="ele.id"
						>{{ele.name}}</el-dropdown-item
					>
				</el-dropdown-menu>
			</template>
		 </el-dropdown> -->
		<!--  商家切换 -->
		<!-- <el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="onMerchantChange" v-if="isMerchant">
			<div class="layout-navbars-breadcrumb-user-icon">
				<el-icon>
					<SetUp />
				</el-icon>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item
						:command="item.merchantCode"
						v-for="(item, index) in merchantDataList"
						:key="index"
						:disabled="item.merchantCode == merchantCodeA"
						>{{ `${item.merchantName} (${item.merchantCode})` }}</el-dropdown-item
					>
				</el-dropdown-menu>
			</template>
		</el-dropdown> -->
		<!-- 首页 -->
		<!-- <div class="layout-navbars-portal-user-icon mr-3 cursor-pointer" @click="backHome">
			<img src="/@/assets/imgs/home.png" alt="">
		</div> -->
		<!-- 下载中心 -->
		<!-- <div class="layout-navbars-portal-user-icon mr-3" @click="onDownloadClick" v-if="baseTenantId != 1857000132515905537">
			<img src="/@/assets/imgs/down.png" alt="">
		</div> -->
		<!-- 消息中心 -->
		<!-- <div class="layout-navbars-portal-user-icon mr-3">
			<img src="/@/assets/imgs/news.png" alt="">
			<div class="msg_tips" v-if="isDot"></div>
		</div> -->
		<!-- <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<img :src="userInfos.user.avatar" class="layout-navbars-breadcrumb-user-link-photo mr5" />
				<el-icon class="el-icon--right" :color="'#ffffff'">
					<ele-ArrowDown />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="/home">{{ $t('user.dropdown1') }}</el-dropdown-item>
					<el-dropdown-item command="personal">{{ $t('user.dropdown2') }}</el-dropdown-item>
					<el-dropdown-item divided command="logOut">{{ $t('user.dropdown5') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<Search ref="searchRef" />
		<global-websocket uri="/admin/ws/info" v-if="websocketEnable" @rollback="rollback" />
		<personal-drawer ref="personalDrawerRef"></personal-drawer>
		<personal-cultural-drawer ref="personalCulturalDrawerRef"></personal-cultural-drawer> -->
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUser">
import { logout } from '/@/api/login';
import { ElMessage, ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/userInfo';
import { useThemeConfig } from '/@/stores/themeConfig';
import other from '/@/utils/other';
import mittBus from '/@/utils/mitt';
import { Local, Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { useMsg } from '/@/stores/msg';
import { fetchUserMessageList } from '/@/api/admin/message';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useGoodStoreList } from '/@/stores/goodStore';
import pinia from '/@/stores';
import { merchantRoles } from '/@/api/goodStore/merchant';
import { checkPermission } from '/@/api/portal';

// 引入组件
const GlobalWebsocket = defineAsyncComponent(() => import('/@/components/Websocket/index.vue'));
const UserNews = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/userNews.vue'));
const Search = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/search.vue'));
const PersonalDrawer = defineAsyncComponent(() => import('/@/views/admin/system/user/personal.vue'));
const PersonalCulturalDrawer = defineAsyncComponent(() => import('/@/views/culture/systemManage/user/personal.vue'));

const { locale, t } = useI18n();
const router = useRouter();
const stores = useUserInfo();
const storesThemeConfig = useThemeConfig();
const { userInfos } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const searchRef = ref();
const newsRef = ref();
const personalDrawerRef = ref();
const personalCulturalDrawerRef = ref();
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
// 好店-商家的租户ID
const isMerchant = computed(() => (Session.getTenant() === '1817759704625901569' ? true : false));
// 文创-租户ID
// const isCultural = computed(() => (Session.getTenant() === '1815608904948617218' ? true : false));
const merchantCode = Session.get('merchantCode');
const merchantCodeA = ref(merchantCode);
interface State {
	[key: string]: boolean | string;
	isScreenfull: boolean;
	disabledI18n: string;
	disabledSize: string;
}

const state = reactive<State>({
	isScreenfull: false,
	disabledI18n: 'zh-cn',
	disabledSize: 'large',
});
// 获取商户列表
const { merchantList } = storeToRefs(useGoodStoreList(pinia));
const merchantDataList = ref(merchantList);
const storesRoutesList = useGoodStoreList(pinia);
interface MerchantListResponse {
	data: any; // 这里根据实际情况定义 data 的具体类型
	code: number;
}
// 是否开启websocket
const websocketEnable = ref(import.meta.env.VITE_WEBSOCKET_ENABLE === 'true');

// 设置分割样式
// const layoutUserFlexNum = computed(() => {
// 	let num: string | number = '';
// 	const { layout, isClassicSplitMenu } = themeConfig.value;
// 	const layoutArr: string[] = ['defaults', 'columns'];
// 	if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
// 	else num = '';
// 	return num;
// });
// 全屏点击时
const onScreenfullClick = () => {
	if (!screenfull.isEnabled) {
		ElMessage.warning('暂不不支持全屏');
		return false;
	}
	screenfull.toggle();
	screenfull.on('change', () => {
		if (screenfull.isFullscreen) state.isScreenfull = true;
		else state.isScreenfull = false;
	});
};
// 布局配置 icon 点击时
const onLayoutSetingClick = () => {
	mittBus.emit('openSetingsDrawer');
};
// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
	if (path === 'logOut') {
		ElMessageBox({
			closeOnClickModal: false,
			closeOnPressEscape: false,
			title: t('user.logOutTitle'),
			message: t('user.logOutMessage'),
			showCancelButton: true,
			confirmButtonText: t('user.logOutConfirm'),
			cancelButtonText: t('user.logOutCancel'),
			buttonSize: 'default',
			beforeClose: (action, instance, done) => {
				if (action === 'confirm') {
					instance.confirmButtonLoading = true;
					instance.confirmButtonText = t('user.logOutExit');
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
				console.log('退出登录成功，正在刷新页面...', window.location.href);
				window.location.href = window.location.origin + window.location.pathname;
				// window.location.reload();
			})
			.catch(() => {});
	} else if (path === 'personal') {
		// 打开个人页面
		personalDrawerRef.value.open();
	} else if (path === 'personal-cultural') {
		// 文创-个人中心
		personalCulturalDrawerRef.value.open();
	} else {
		router.push(path);
	}
};
// 菜单搜索点击
const onSearchClick = () => {
	searchRef.value.openSearch();
};
//商户切换
const onMerchantChange = async (merchantCode: string) => {
	Session.set('merchantCode', merchantCode);
	const merchantId = merchantDataList.value.find((item: any) => item.merchantCode == merchantCode).id || 0;
	const roleIds = merchantDataList.value.find((item: any) => item.merchantCode == merchantCode).roleIds || 0;
	Session.set('merchantId', merchantId);
	const roleIdsString = roleIds.join(',');
	Session.set('roleIds', roleIdsString);
	merchantCodeA.value = Session.get('merchantCode');
	initBackEndControlRoutes();
	mittBus.emit('changeMerchantStoreList'); // 切换商户对应刷新商户门店列表信息
};
// 语言切换
const onLanguageChange = (lang: string) => {
	Local.remove('themeConfig');
	themeConfig.value.globalI18n = lang;
	Local.set('themeConfig', themeConfig.value);
	locale.value = lang;
	other.useTitle();
	initI18nOrSize('globalI18n', 'disabledI18n');
};
// 锁屏
const onLockClick = () => {
	themeConfig.value.isLockScreen = true;
	themeConfig.value.lockScreenTime = 0;
	Local.set('themeConfig', themeConfig.value);
};
// 跳转下载中心
const onDownloadClick = () => {
	router.push({path:'/downloadCenter', query:{type:'header'}});
};

// 初始化组件大小/i18n
const initI18nOrSize = (value: string, attr: string) => {
	state[attr] = Local.get('themeConfig')[value];
};

// 获取到消息
const rollback = (msg: string) => {
	useMsg().setMsg({ label: 'websocket消息', value: msg, time: formatAxis(new Date()) });
};

// 获取是否显示未读
const isDot = ref(false);
const getIsDot = () => {
	fetchUserMessageList({ category: '1', readFlag: '0' }).then((res) => {
		isDot.value = res.data.total !== 0;
	});
};
const hanadleSetMerchantList = async () => {
	const { data, code } = await getMerchantList();
	if (code === 0) {
		storesRoutesList.setMerchantList(data);
	}
};
const getMerchantList = () => {
	return new Promise((resolve, reject) => {
		merchantRoles().then((res) => {
			const { code } = res;
			if (code === 0) {
				resolve(res);
			} else {
				reject(res);
			}
		});
	}) as Promise<MerchantListResponse>;
};
// 返回首页
const backHome = async() => {
	const token = Session.getToken();
	const tenantId = Session.getTenant();
	// const jumpLink = encodeURIComponent('/portal/home/index');
	// const tenantIdTarget = "1853370696281276417";
	// router.push({ path:'/transfer',query: {tenantId,token, jumpLink, tenantIdTarget}});
	const domainUrl = import.meta.env.MODE.includes('pro') ? 'https://gdsh-portal.duomixing.com:9086' : 'https://rls-portal.linghzx.online';
	const requestUrl = domainUrl + '/#/portal/home/index';
			// const  requestUrl ='http://192.168.8.123:8001/home';
			const url = requestUrl + '?token=' + token + '&tenantId=' + tenantId;
			window.open(url, '_blank');
};
// 页面加载时
onMounted(() => {
	if (Local.get('themeConfig')) {
		initI18nOrSize('globalComponentSize', 'disabledSize');
		initI18nOrSize('globalI18n', 'disabledI18n');
	}

	getIsDot();
	isMerchant.value && hanadleSetMerchantList();
});

</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	// background: #4785EA;
	// box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;

		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}

	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;

		&:hover {
			background: var(--next-color-user-hover);

			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}

	:deep(.el-dropdown) {
		color: var(--next-bg-topBarColor);
	}

	:deep(.el-badge) {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}

	:deep(.el-badge__content.is-fixed) {
		top: 12px;
	}
}
</style>
