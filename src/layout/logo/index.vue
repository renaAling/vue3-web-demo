<template>
	<!-- <div class="layout-logo" v-if="setShowLogo" @click="backHome">
		<span :style="{ color: setFontColor }">{{ themeConfig.globalTitle }}</span>
	</div>
	<div class="layout-logo-size" v-else @click="onThemeConfigChange">
		<img :src="logoMini" class="layout-logo-size-img" />
	</div> -->
	<div class="layout-logo-size mb-7" @click="onThemeConfigChange">
		<img :src="logoMini" class="layout-logo-size-img" />
	</div>
</template>

<script setup lang="ts" name="layoutLogo">
import { useThemeConfig } from '/@/stores/themeConfig';
import logoMini from '/@/assets/imgs/logo_white.png';
import router from '/@/router';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const baseTenantId = computed(() => import.meta.env.VITE_TENANT_ID);
const isPortal = computed(() => (Session.getTenant() === '1853370696281276417' ? true : false));
// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
	let { isCollapse, layout } = themeConfig.value;
	return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
});

const currentTenantId = import.meta.env.VITE_TENANT_ID;

// 设置 title 的显示颜色。根据布局模式自动显示
const setFontColor = computed(() => {
	let { layout } = themeConfig.value;
	// 如果是文创系统
	if (currentTenantId == 1815608904948617218 || currentTenantId == 1857000132515905537) {
		return '#FFFFFF';
	} else {
		return layout === 'classic' || layout === 'transverse' ? `var(--next-bg-topBarColor)` : 'var(--el-color-primary)';
	}
});

// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
	// 禁止收起
	if (themeConfig.value.layout === 'transverse') return false;
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
};
const backHome = () => {
	router.push('/');
};
</script>

<style scoped lang="scss">
.layout-logo {
	width: 220px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	font-size: 16px;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;

	span {
		white-space: nowrap;
		display: inline-block;
		font-size: 21.5px;
		font-weight: 700;
		white-space: nowrap;
	}

	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}
}

.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;

	&-img {
		width: 90px;
		height: 42px;
		margin: auto;
	}

	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
