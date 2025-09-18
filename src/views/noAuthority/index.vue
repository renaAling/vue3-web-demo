<template>
	<div class="layout-padding content">
		<div class="content_main bg-white">
			<div class="content_main_img"></div>
			<div class="content_main_text">账号暂无权限，请联系权限管理相关人员</div>
			<el-button plain @click="toLogin" type="primary"> 切换账号登录 </el-button>
		</div>
	</div>
</template>

<script lang="ts" name="noAuthority" setup>
import router from '/@/router';

const toLogin = () => {
	router.replace({ name: 'staticRoutes.login' });
};
</script>
<style lang="scss" scoped>
.content {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 60px;
}
.content_main {
	width: 500px;
	height: 300px;
	text-align: center;
	.content_main_img {
		background-image: url('/@/assets/noAuthority.png');
		width: 218px;
		height: 200px;
		margin: 0 auto;
	}
	.content_main_text {
		color: #3d3d3d;
		font-size: 18px;
	}
}
</style>
