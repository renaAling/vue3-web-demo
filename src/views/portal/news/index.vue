<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 管理模式下页面效果 -->
			<ManageModeMessageNotify v-if="modeView === 'admin'" />
			<!-- 用户模式下页面效果 -->
			<UserModeMessageNotify v-if="modeView === 'user'" />
		</div>
	</div>
</template>

<script setup lang="ts" name="portal-news">
import pinia from '/@/stores';
import { usePortalList } from '/@/stores/portal';
import { Session } from '/@/utils/storage';
// 是否是管理模式
const { modeView } = storeToRefs(usePortalList(pinia));
// 站内消息-管理模式页面组件
const ManageModeMessageNotify = defineAsyncComponent(() => import('./components/manageMode.vue'));
// 站内消息-用户模式页面组件
const UserModeMessageNotify = defineAsyncComponent(() => import('./components/userMode.vue'));

onMounted(() => {
	const adminModel = Session.get('adminModel');
	modeView.value = adminModel ?  adminModel : 'user';
	console.log('modeView', modeView.value);
});
</script>
<style lang="scss" scoped></style>
