<template>
	<div class="content_center_manage_mode">
		<div class="tabs">
			<el-tabs v-model="activeIndex" type="card">
				<el-tab-pane v-for="(value, key) in configTypes" :label="value" :name="key" :key="key"></el-tab-pane>
			</el-tabs>
		</div>
		<ChannelManage v-if="activeIndex === '1'" />
		<ArticleManage v-else-if="activeIndex === '2'" />
	</div>
</template>

<script lang="ts" name="portal-content-center" setup>
import router from '/@/router';

// 动态引入组件
const ChannelManage = defineAsyncComponent(() => import('./channelManage.vue'));
const ArticleManage = defineAsyncComponent(() => import('./articleManage.vue'));

const configTypes = {
	1: '栏目管理',
	2: '文章管理',
};

// 定义变量内容
const activeIndex = ref('1');

onMounted(() => {
	const {active} = router.currentRoute.value.query;
	activeIndex.value = typeof active === 'string' ? active : '1';
});
</script>
<style lang="scss" scoped>
.content_center_manage_mode {
	.tabs {
		margin-bottom: 12px;
	}
	.group_box {
		.group_title {
			text-align: center;
			height: 44px;
			line-height: 44px;
			border-bottom: 1px solid #eee;
			font-size: 18px;
		}
		.item {
			width: 100%;
			padding: 10px 0;
			text-align: center;
			cursor: pointer;
			&:first-child {
				margin-top: 10px;
			}
			&.active {
				color: #4785ea;
				font-size: 20px;
				border-left: 4px solid;
			}
		}
	}
}
:deep(.el-tabs__header) {
	margin: 0px !important;
	.is-active {
		background-color: #4785ea !important;
		color: #fff !important;
	}
}
</style>
