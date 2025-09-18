<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<Material type="image" mode="page" file-size="120px" :limit="-1" />
		</div>
	</div>
</template>

<script lang="ts" setup name="fileCenter">
const Material = defineAsyncComponent(() => import('/@/components/Resources/index.vue'));
</script>

<style lang="scss" scoped></style>
