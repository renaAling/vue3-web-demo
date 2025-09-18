<template>
	<div class="home">
		<!-- <div v-if="pageLoading">
      <el-main>
        <el-card shadow="never">
          <el-skeleton :rows="1"></el-skeleton>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px;">
          <el-skeleton></el-skeleton>
        </el-card>
      </el-main>
    </div>
    <widgets/> -->
		<div class="content">
			<img src="/@/assets/imgs/home-bg.png" alt="" />
			<div class="title">欢迎使用{{ globalTitle }}</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="dashboard">
// const Widgets = defineAsyncComponent(() => import('./widgets/index.vue'));
// const pageLoading = ref(true);
import { useTenantConfig } from '/@/stores/tenantConfig';

// 读取 pinia 默认语言
import { storeToRefs } from 'pinia';
import pinia from '/@/stores';
import { Session } from '/@/utils/storage';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();

const route = useRoute();
const stores = useTenantConfig(pinia);
const { tenantConfig } = storeToRefs(stores);
// const currentTenantId = import.meta.env.VITE_TENANT_ID; 
const currentTenantId = Session.getTenant();
// const globalTitle = import.meta.env.VITE_GLOBAL_TITLE;
const globalTitle = tenantConfig.value[currentTenantId];

// const isShowWorkBenchImage = computed(() => {
// 	return currentTenantId == 1815608904948617218 || currentTenantId == 1844555183493136386 || currentTenantId == 1857000132515905537;
// });

// onMounted(() => {
// 	console.log('当前路由====================================', route.query);
// 	const {jumpLink} = route.query;
// 	const path = jumpLink ?  decodeURIComponent(jumpLink as string) : '/home'
// 	router.replace(path).then(() => {
//     // 强制刷新页面
//     window.location.reload();
//   });
// });
</script>
<style lang="scss" scoped>
.home {
	padding: 20px;

	.content {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background-color: #fff;
		border-radius: 12px;
		padding: 100px 296px;

		img {
			margin-bottom: 34px;
		}

		.title {
			font-size: 38px;
			font-weight: bold;
			color: #333333;
		}
	}
}
</style>
