<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 管理模式下页面效果 -->
			<ManageModeContentCenter v-if="modeView === 'admin'" />
			<!-- 用户模式下页面效果 -->
			<UserModeContentCenter v-if="modeView === 'user'" />
		</div>
	</div>
</template>

<script setup lang="ts" name="portal-content-center">
import pinia from '/@/stores';
import { usePortalList } from '/@/stores/portal';
import { Session } from '/@/utils/storage';
// 是否是管理模式
const { modeView } = storeToRefs(usePortalList(pinia));
// 内容中心-管理模式页面组件
const ManageModeContentCenter = defineAsyncComponent(() => import('./components/manageMode.vue'));
// 内容中心-用户模式页面组件
const UserModeContentCenter = defineAsyncComponent(() => import('./components/userMode.vue'));

onMounted(() => {
	const adminModel = Session.get('adminModel');
	modeView.value = adminModel ? adminModel : 'user';
	console.log('modeView', modeView.value);
});
</script>
<style lang="scss" scoped></style>
