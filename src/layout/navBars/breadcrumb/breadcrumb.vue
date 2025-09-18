<template>
	<div v-if="isShowBreadcrumb" class="layout-navbars-breadcrumb" :class="!isPortal && !isPortalInit ? '' : 'justify-between'">
		<div class="flex items-center">
			<SvgIcon
				class="layout-navbars-breadcrumb-icon"
				:name="themeConfig.isCollapse ? 'ele-Expand' : 'ele-Fold'"
				:size="16"
				@click="onThemeConfigChange"
			/>
			<div class="pl4" v-if="isPortal || isPortalInit">
				<div class="time pr15">{{ moreTime }}</div>
				<div class="date pr15 pb9">{{ date }} {{ week }}</div>
			</div>
		</div>
		<!-- 系统导航栏 -->
		<div v-if="!isPortal && !isPortalInit" class="navigate-list">
			<el-dropdown class="navigate" :show-timeout="70" :hide-timeout="50" v-for="(item, index) in systemListData" :key="index">
				<div class="title" @click="backHome(item)">
					<div class="mr-2" :class="isMall && item.showTitle ? 'mall' : ''">
						<span v-if="isMall && index === 0" class="mr-2">自有商城</span><span>{{ item.groupName }} </span>
					</div>
					<el-icon class="el-icon--right" :color="isMall && item.showTitle ? '#666' : '#303133'">
						<ele-ArrowDown v-if="(item.sysInfos ?? []).length > 0" />
					</el-icon>
				</div>
				<template #dropdown v-if="(item.sysInfos ?? []).length > 0">
					<el-dropdown-menu>
						<el-dropdown-item
							v-for="ele in item.sysInfos"
							:command="ele.id"
							:key="ele.id"
							@click="handleJump(ele)"
							:disabled="ele.tenantId == Session.getTenant()"
						>
							<div class="flex items-center sys">
								{{ ele.name }}
							</div>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<div class="flex items-center user_info">
				<span v-if="isPortal || isPortalInit">你好！{{ userInfos?.user?.nickname }}</span>
				<img :src="userInfos?.user?.avatar || defaultAvatar" class="layout-navbars-portal-user-link-photo photo_img" />
				<!-- <el-icon class="el-icon--right">
						<ele-ArrowDown />
					</el-icon> -->
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="personal">修改信息</el-dropdown-item>
					<el-dropdown-item divided command="logOut">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumb">
import { reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { onBeforeRouteUpdate, RouteLocation, useRoute, useRouter } from 'vue-router';
import { Local, Session } from '/@/utils/storage';
import other from '/@/utils/other';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useRoutesList } from '/@/stores/routesList';
import { checkPermission, getOwnMallList, getSysEntranceList } from '/@/api/portal';
import { useMessage } from '/@/hooks/message';
import { useUserInfo } from '/@/stores/userInfo';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { logout } from '/@/api/login';
import mittBus from '/@/utils/mitt';
import defaultAvatar from '/@/assets/imgs/user.png';

const userStores = useUserInfo();
const { userInfos } = storeToRefs(userStores);
const { t } = useI18n();
import pinia from '/@/stores';

// 定义变量内容
// const currentTenantId = import.meta.env.VITE_TENANT_ID;
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
const systemName = computed(() => import.meta.env.VITE_GLOBAL_TITLE);
const portalId = ref('1853370696281276417');
const isPortal = computed(() => (Session.getTenant() == portalId.value ? true : false)) || false;
console.log('当前租户ID', Session.getTenant());
// console.log('门户子系统breadcrumb', isPortal.value);
const timer = ref();
const date = ref(''); //年月日
const moreTime = ref(''); //时分秒
const week = ref(''); // 周几
// 当前是否属于商城
const isMall = ref(false);
let mallList: { groupName: string; sysInfos: any; showTitle?: boolean }[] = [];
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { routesList } = storeToRefs(stores);
const route = useRoute();
const router = useRouter();
import { useTenantConfig } from '/@/stores/tenantConfig';
const store = useTenantConfig(pinia); // useTenantConfig 获取租户信息
const { tenantConfig } = storeToRefs(store);
const currentTenantId = import.meta.env.VITE_TENANT_ID;

const state = reactive<BreadcrumbState>({
	breadcrumbList: [],
	routeSplit: [],
	routeSplitFirst: '',
	routeSplitIndex: 1,
});
interface SystemItem {
	id: string;
	//   name: string;
	groupName?: string | null;
	showTitle?: boolean;
	sysInfos?: Array<{
		id: string;
		name: string;
		groupId: string;
		groupName?: string | null;
		imageUrl: string;
		tenantId?: string;
		jumpLink?: string;
		requestUrl?: string;
	}>;
}

const systemListData = ref<SystemItem[]>([]);
// 动态设置经典、横向布局不显示
const isShowBreadcrumb = computed(() => {
	initRouteSplit(route);
	const { layout, isBreadcrumb } = themeConfig.value;
	if (layout === 'classic' || layout === 'transverse') return false;
	else return isBreadcrumb ? true : false;
});
interface tenantMap {
	[key: string]: string;
}
const mallMenuConfig = ref<tenantMap>({});
// 返回首页
const backHome = async (item: any) => {
	if (!item.backHome) return;
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
//获取当前时间
const formateDate = () => {
	const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	const time = new Date();
	// const year = time.getFullYear()
	const month = complement(time.getMonth() + 1);
	const day = complement(time.getDate());
	const hour = complement(time.getHours());
	const minute = complement(time.getMinutes());
	week.value = days[time.getDay()];
	// const second = complement(time.getSeconds())
	moreTime.value = `${hour}:${minute}`;
	date.value = `${month}月${day}日`;
};
const complement = (value: number): string => {
	return value < 10 ? `0${value}` : value.toString();
};
// 获取系统导航数据
const getEntranceList = async () => {
	try {
		const { code, data, msg } = await getSysEntranceList();
		if (code === 0) {
			const res = await getOwnMallList();
			if (res.code === 0) {
				mallMenuConfig.value = res.data.reduce((acc: tenantMap, item: tenantMap) => {
					acc[item.tenantId] = item.name;
					return acc;
				}, {});
				const mallIds = res.data.map((item: any) => item.tenantId);
				isMall.value = mallIds.includes(Session.getTenant());
				mallList = [
					{
						groupName:
							typeof tenantConfig.value[currentTenantId] === 'object' && tenantConfig.value[currentTenantId] !== null
								? tenantConfig.value[currentTenantId].name
								: tenantConfig.value[currentTenantId],
						showTitle: true,
						sysInfos: res.data.map((item: any) => {
							return {
								...item,
							};
						}),
					},
				];
			}
			const homePage = [
				{
					groupName: '首页',
					showTitle: true,
					backHome: true,
				},
			];
			if (isMall.value) {
				let list = [];
				list = [...mallList, ...homePage, ...data];
				systemListData.value = list;
				console.log('自有商城=============', systemListData.value);
			} else {
				systemListData.value = data;
			}
		}
	} catch (error) {
		console.log(error);
	}
};
// 面包屑点击时
const onBreadcrumbClick = (v: RouteItem) => {
	const { redirect, path } = v;
	if (redirect) router.push(redirect);
	else router.push(path);
};
// 跳转其他系统
const handleJump = async (item: any) => {
	const token = Session.getToken();
	const tenantId = Session.getTenant();
	const jumpLink = item.jumpLink ? item.jumpLink : '/home';
	const tenantIdTarget = item.tenantId;
	try {
		const { code, msg } = await checkPermission({ tenantId: tenantIdTarget });
		if (code === 0) {
			// router.push({ path:'/transfer',query: {tenantId,token, jumpLink, tenantIdTarget}});
			const requestUrl = item.domainUrl + '/#' + jumpLink;
			// const  requestUrl ='http://192.168.8.123:8001/home';
			const url = requestUrl + '?token=' + token + '&tenantId=' + tenantId;
			window.open(url, '_blank');
		} else {
			useMessage().error(msg);
		}
	} catch (error) {
		useMessage().error('暂无访问权限，请联系管理员');
	}
};
// 展开/收起左侧菜单点击
const onThemeConfigChange = () => {
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
	setLocalThemeConfig();
};
// 存储布局配置
const setLocalThemeConfig = () => {
	Local.remove('themeConfig');
	Local.set('themeConfig', themeConfig.value);
};
// 处理面包屑数据
const getBreadcrumbList = (arr: RouteItems) => {
	// console.log('state.routeSplit', state.routeSplit)
	// console.log('state.breadcrumbList前', arr);
	arr.forEach((item: RouteItem) => {
		state.routeSplit.forEach((v: string, k: number, arrs: string[]) => {
			if (state.routeSplitFirst === item.path) {
				state.routeSplitFirst += `/${arrs[state.routeSplitIndex]}`;
				!state.breadcrumbList.includes(item) && state.breadcrumbList.push(item);
				state.routeSplitIndex++;
				if (item.children) getBreadcrumbList(item.children);
			}
		});
	});
	// console.log('state.breadcrumbList后', state.breadcrumbList);
};

// 当前路由字符串切割成数组，并删除第一项空内容
const initRouteSplit = (toRoute: RouteLocation) => {
	let path = toRoute.path;
	if (!themeConfig.value.isBreadcrumb) return false;
	state.breadcrumbList = [routesList.value[0]];
	state.routeSplit = path.split('/');
	state.routeSplit.shift();
	//   state.routeSplitFirst = `/${state.routeSplit[0]}/${state.routeSplit[1]}`;
	state.routeSplitFirst = `/${state.routeSplit[0]}`;
	state.routeSplitIndex = 1;
	getBreadcrumbList(routesList.value);
	state.breadcrumbList.push(route);
	// console.log('======================', state.breadcrumbList)
	// 首页或异常页只显示第一个
	const singlePages = ['router.home', '找不到此页面', '分组管理', '系统入口'];
	const routeName = toRoute.name as string;
	if (singlePages.includes(routeName)) {
		state.breadcrumbList.splice(0, state.breadcrumbList.length - 1);
	} else if (state.breadcrumbList.length > 0) {
		state.breadcrumbList[state.breadcrumbList.length - 1].meta.tagsViewName = other.setTagsViewNameI18n(<RouteToFrom>route);
	}
};
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
				window.location.replace('/');
				// window.location.reload();
			})
			.catch(() => {});
	} else if (path === 'personal') {
		// router.push('/portalPersonal');
		// router.push('/portal/personal/detail');
		router.push({ path: '/portal/personal/detail', query: { type: 'personal' } });
	} else {
		router.push(path);
	}
};
// 页面加载时
onMounted(() => {
	initRouteSplit(route);
	getEntranceList();
	//创建定时器1秒执行一次
	timer.value = setInterval(() => {
		formateDate();
	}, 1000);
});
//取消定时器
onBeforeUnmount(() => {
	clearInterval(timer.value); //清除定时器
});
// 路由更新时
onBeforeRouteUpdate((to) => {
	initRouteSplit(to);
});
const isPortalInit = ref(false);
watch(
	() => route.query,
	(val) => {
		isPortalInit.value = (val.tenantIdTarget === portalId.value || !val.tenantIdTarget) && Session.getTenant() == portalId.value ? true : false;
		// console.log('门户子系统breadcrumb-watch', isPortalInit.value);
	}
);
</script>

<style scoped lang="scss">
@font-face {
	font-family: 'MyCustomFontDin';
	src: url('/@/assets/font/D-DIN-PRO-700-Bold.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
}
.time {
	font-family: 'MyCustomFontDin', sans-serif;
	font-size: 30px;
	font-weight: bold;
	color: #1a1a1a;
	margin-right: 28rpx;
}
.date {
	font-size: 24rpx;
	color: #1a1a1a;
}
.layout-navbars-breadcrumb {
	flex: 1;
	height: inherit;
	display: flex;
	align-items: center;
	box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.12);
	background: #fff;
	border-bottom: 1px solid #e4e7ed;
	.layout-navbars-breadcrumb-icon {
		cursor: pointer;
		font-size: 18px;
		color: var(--next-bg-topBarColor);
		height: 100%;
		width: 40px;
		opacity: 0.8;

		&:hover {
			opacity: 1;
		}
	}

	.layout-navbars-breadcrumb-span {
		display: flex;
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}

	.layout-navbars-breadcrumb-iconfont {
		font-size: 14px;
		margin-right: 5px;
	}

	:deep(.el-breadcrumb__separator) {
		opacity: 0.7;
		color: var(--next-bg-topBarColor);
	}

	:deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) {
		font-weight: unset !important;
		color: var(--next-bg-topBarColor);

		&:hover {
			color: var(--el-color-primary) !important;
		}
	}
}
.sys-name {
	width: 200px;
	color: #303133;
	font-size: 14px;
	font-weight: bold;
}
.navigate-list {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	.navigate {
		padding: 14px 24px;
		margin-right: 20px;
	}
}
.title {
	display: flex;
	align-items: center;
	font-size: 14px;
	font-weight: 500;
	line-height: 22px;
	color: #303133;
	// color: #fff;
	// .img {
	// 	width: 16px;
	// 	height: 15px;
	// 	margin-right: 8px;

	// }
	.mall {
		color: #666666;
	}
}
.sys {
	.img {
		width: 16px;
		height: 15px;
		margin-right: 8px;
	}
}
::v-deep .el-dropdown-menu__item {
	line-height: 44px;
}
::v-deep .el-scrollbar {
	max-height: 500px;
	overflow: auto;
}
.fc-w {
	color: #fff;
}
.user_info {
	color: #1a1a1a;
	font-size: 36rpx;
	padding-right: 15px;
}
.photo_img {
	width: 26px;
	height: 27px;
	border-radius: 50%;
	// background: #4785EA;
}
</style>
