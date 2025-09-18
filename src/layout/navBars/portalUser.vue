<template>
	<div class="header flex flex-row justify-between items-center">
		<!-- <div class="title" v-if="props.showLogo">
			<img src="/@/assets/imgs/logo_mh.png" class="layout-logo-size-img" />
		</div> -->
		<div class="layout-navbars-portal-user">
			<!-- <div>
				<div class="time" >{{ moreTime }}</div>
				<div class="date">{{ date }} {{ week }}</div>
			</div> -->
			<!-- <div class="layout-navbars-portal-user-icon mr-3" :class="homeAcite ? 'active' : ''">
				<el-icon :size="20" @click="jummToHome" :color="homeAcite ? '#fff' : 'inherit'"><House /></el-icon>
			</div>
			<div class="layout-navbars-portal-user-icon mr-3" v-if="showSetting" :class="setAcite ? 'active' : ''">
				<el-icon :size="20" @click="jummToSetting" :color="setAcite ? '#fff' : 'inherit'"><Tools /></el-icon>
			</div>
			<div class="layout-navbars-portal-user-icon mr-3" :class="newsAcite ? 'active' : ''">
				<el-icon :size="20" @click="jummToNews" :color="newsAcite ? '#fff' : 'inherit'"><ele-Bell /></el-icon>
				<div class="msg_tips" v-if="isDot"></div>
			</div> -->
			<!-- <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
				<span class="layout-navbars-portal-user-link">
					<img :src="userInfos?.user?.avatar" class="layout-navbars-portal-user-link-photo mr5" />
					<el-icon class="el-icon--right">
						<ele-ArrowDown />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="personal">修改信息</el-dropdown-item>
						<el-dropdown-item divided command="logOut">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown> -->
			<!-- <personal-drawer ref="personalDrawerRef"></personal-drawer> -->
		</div>
	</div>
</template>

<script setup lang="ts" name="layout-portalUser">
import { logout } from '/@/api/login';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/userInfo';
import { useThemeConfig } from '/@/stores/themeConfig';
import mittBus from '/@/utils/mitt';
import { Local, Session } from '/@/utils/storage';
import { fetchUserMessageList } from '/@/api/admin/message';
import pinia from '/@/stores';
import { usePortalList } from '/@/stores/portal';
import { useRoutesList } from '/@/stores/routesList';
const timer = ref();
const date = ref(''); //年月日
const moreTime = ref(''); //时分秒
const week = ref(''); // 周几
// 引入组件
const PersonalDrawer = defineAsyncComponent(() => import('/@/views/admin/system/user/personal.vue'));

// 定义父组件传过来的值
const props = defineProps({
	showLogo: {
		type: Boolean,
		default: () => true,
	},
});
const { homeActive, newsActive, setActive } = storeToRefs(usePortalList(pinia));
const portalList = usePortalList(pinia);

const homeAcite = ref(homeActive);
const setAcite = ref(setActive);
const newsAcite = ref(newsActive);

const { t } = useI18n();
const router = useRouter();
const stores = useUserInfo();
const storesThemeConfig = useThemeConfig();
const { userInfos } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const personalDrawerRef = ref();
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
const storesRoute = useRoutesList();
const { routesList } = storeToRefs(storesRoute);
const showSetting = ref(false);
const handelShowSetting = () => {
	showSetting.value = routesList.value.some((item: any) => item.name === '设置')
};
const jummToSetting = () => {
	portalList.setSetActive();
	router.push('/portal/entrance/index');
};
const jummToHome = () => {
	portalList.setHomeActive();
	router.push('/portalHome');
	router.push('/');
};
const jummToNews = () => {
	portalList.setNewsActive();
	router.push('/portalNews');
};
// 设置分割样式
const layoutUserFlexNum = computed(() => {
	// let num: string | number = '';
	// const { layout, isClassicSplitMenu } = themeConfig.value;
	// const layoutArr: string[] = ['defaults', 'columns'];
	// if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
	// else num = '';
	return 2;
});
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
				window.location.replace('/');
				// window.location.reload();
			})
			.catch(() => {});
	} else if (path === 'personal') {
		// router.push('/portalPersonal');
		router.push('/portal/personal/detail');
	} else {
		router.push(path);
	}
};
// 初始化组件大小/i18n
const initI18nOrSize = (value: string, attr: string) => {
	state[attr] = Local.get('themeConfig')[value];
};

// 获取是否显示未读
const isDot = ref(false);
const getIsDot = () => {
	fetchUserMessageList({ readFlag: '0' }).then((res) => {
		isDot.value = res.data.total !== 0;
	});
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
//取消定时器
onBeforeUnmount(() => {
	clearInterval(timer.value); //清除定时器
});
// 页面加载时
onMounted(() => {
	if (Local.get('themeConfig')) {
		initI18nOrSize('globalComponentSize', 'disabledSize');
		initI18nOrSize('globalI18n', 'disabledI18n');
	}

	getIsDot();
	handelShowSetting();
	//创建定时器1秒执行一次
	timer.value = setInterval(() => {
		formateDate();
	}, 1000);
});
</script>

<style scoped lang="scss">
@font-face {
	font-family: 'MyCustomFontDin';
	src: url('/@/assets/font/D-DIN-PRO-700-Bold.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
}
.layout-navbars-portal-user-icon {
	position: relative;
	&:hover {
		background: #409eff9c !important;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		// ::v-deep.el-icon {
		// 	color: #fff;
		// }
	}
	&.active {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background: #409eff9c;
	}
}
.layout-navbars-portal-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;

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
		margin-right: 30px;
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
.msg_tips {
	position: absolute;
	top: 43%;
	right: 0;
	width: 8px;
	height: 8px;
	background: #f56c6c;
	border-radius: 50%;
}
.time {
	font-family: 'MyCustomFontDin', sans-serif;
	font-size: 30px; 
	font-weight: bold; 
	color:  #1A1A1A;
	margin-right: 28rpx;
}
.title {
	img {
		height: 37px;
	}
}
</style>
