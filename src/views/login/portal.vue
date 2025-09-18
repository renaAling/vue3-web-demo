<template>
	<div class="select-none">
		<div class="tenant">
			<!--  租户选择 -->
			<!-- <tenant /> -->
		</div>
		<!-- <img :src="bg" class="wave" /> -->
		<div class="login-container">
			<div class="img">
				<!-- <img :src="!themeConfig.background ? illustration : baseURL + themeConfig.background" /> -->
			</div>
			<div class="login-box">
				<div class="login-form">
					<div class="my-3 text-6xl font-semibold">{{ globalTitle }}</div>
					<span class="tips">请使用已登记备案手机账号登录</span>
					<div class="flex justify-center self-center">
						<div class="p-12 bg-white mx-auto rounded-3xl w-96">
							<div class="space-y-0">
								<register v-if="loginType === LoginTypeEnum.REGISTER" @change="changeLoginType" />
								<password v-if="loginType === LoginTypeEnum.PASSWORD" @signInSuccess="signInSuccess" @change="changeLoginType" />
								<mobile v-if="loginType === LoginTypeEnum.MOBILE" @signInSuccess="signInSuccess" @change="changeLoginType" />
								<expire v-if="loginType === LoginTypeEnum.EXPIRE" :username="username" @change="changeLoginType" />
								<!-- <div class="flex items-center justify-center space-x-2 my-5">
									<span class="h-px w-16 bg-gray-100"></span>
									<span class="text-gray-300 font-normal">or</span>
									<span class="h-px w-16 bg-gray-100"></span>
								</div>
								<social @signInSuccess="signInSuccess" /> -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTenantConfig } from '/@/stores/tenantConfig';
import pinia from '/@/stores';
const stores = useTenantConfig(pinia);

import { NextLoading } from '/@/utils/loading';
// import bg from '/@/assets/login/portal-logo-bg.jpg';
// import miniQr from '/@/assets/login/mini_qr.png';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { LoginTypeEnum } from '/@/api/login';
import { merchantRoles } from '/@/api/goodStore/merchant';
import { useGoodStoreList } from '/@/stores/goodStore';
const { tenantConfig } = storeToRefs(stores);


const currentTenantId = Session.getTenant(); 

const globalTitle = typeof tenantConfig.value[currentTenantId] === 'object' && tenantConfig.value[currentTenantId] !== null
  ? tenantConfig.value[currentTenantId].name
  : tenantConfig.value[currentTenantId];
// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'));
// const Social = defineAsyncComponent(() => import('./component/social.vue'));
const Register = defineAsyncComponent(() => import('./component/register.vue'));
const Expire = defineAsyncComponent(() => import('./component/expire.vue'));
const Tenant = defineAsyncComponent(() => import('./component/tenant.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
const isMerchant = computed(() => (Session.getTenant() === '1817759704625901569' ? true : false));
const isPortal = computed(() => (Session.getTenant() === '1853370696281276417' ? true : false));

const storesRoutesList = useGoodStoreList(pinia);
// 登录方式
const loginType = ref(LoginTypeEnum.PASSWORD);
// 用户名
const username = ref('');
interface MerchantListResponse {
	data: any; // 这里根据实际情况定义 data 的具体类型
	code: number;
}
// 修改登录类型
const changeLoginType = (type: LoginTypeEnum, name?: string) => {
	loginType.value = type;
	if (name) {
		username.value = name;
	}
};

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	// 添加 loading，防止第一次进入界面时出现短暂空白
	NextLoading.start();
	if (isMerchant.value) {
		// 好店-商家
		const { data, code } = await getMerchantList();
		if (code === 0) {
			storesRoutesList.setMerchantList(data);
			Session.set('roleIds', data[0]?.roleIds || '');
			const merchantId = data[0]?.id || 0;
			const merchantCode = data[0]?.merchantCode || 0;
			Session.set('merchantId', merchantId);
			Session.set('merchantCode', merchantCode);
		}
	}
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().warning('抱歉，您没有登录权限');
		Session.clear();
		if (isPortal.value) {
			// 门户
			router.push('/portalNoAuthority');
		} else {
			router.push('/noAuthority');
		}
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxis(new Date());
		// eslint-disable-next-line no-console
		console.log('route.query', route.query);
		if (route.query?.redirect) {

			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {

			router.push('/');
		}
		// 登录成功提示
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);
		NextLoading.done();
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
// 页面加载时
onMounted(() => {
	NextLoading.done();
});
</script>
<style lang="scss" scoped>
.select-none {
	width: 100vw;
	background: url('/@/assets/login/portal-logo-bg.jpg') no-repeat center center;
	background-size: cover;
}
.login-form {
	height: 500px;
	background: #fff;
	border-radius: 14px;
}
.tips {
	color: #999999;
	font-size: 15px;
}
</style>
