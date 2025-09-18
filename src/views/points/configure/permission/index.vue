<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="菜单管理" name="first">
					<menu-compents class="layout_box"></menu-compents>
				</el-tab-pane>
				<el-tab-pane label="角色管理" name="second">
					<roleCompents class="layout_box"></roleCompents>
				</el-tab-pane>
				<el-tab-pane label="用户管理" name="third">
					<userCompents class="layout_box"></userCompents>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup name="configurePermission">
import { Session } from '/@/utils/storage';
const menuCompents = defineAsyncComponent(() => import('../../../admin/system/menu/index.vue'));
const roleCompents = defineAsyncComponent(() => import('/@/views/admin/system/role/index.vue'));
const userCompents = defineAsyncComponent(() => import('/@/views/admin/system/user/index.vue'));

const activeName = ref('first');

onMounted(() => {
	activeName.value = 'first';
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	// 会员系统跳转其他平台授权使用的数据
	if (Session.get('authorization')) {
		const authorization = JSON.parse(Session.get('authorization'));
		if (authorization.isAuthorization) {
			activeName.value = authorization.activeName;
		}
	}
});
const handleClick = (pane, ev) => {};
</script>
<style lang="scss" scoped>
::v-deep {
	.el-tabs__content {
		height: 100vh;
	}
}
.layout_box {
	width: 100%;
	padding-left: 0 !important;
	padding-top: 0 !important;
}
</style>
