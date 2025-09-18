<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<ManageModeContentCenter />
		</div>
	</div>
</template>

<script setup lang="ts" name="portal-content-center">
const ManageModeContentCenter = defineAsyncComponent(() => import('./components/manageMode.vue'));

</script>
<style lang="scss" scoped></style>
