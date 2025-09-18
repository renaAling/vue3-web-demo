<template>
	<el-dialog v-model="centerDialogVisible" title="专题预览" width="430" height="932" align-center>
		<div v-for="(item, index) in dataForm" :key="index">
			<img :src="item.imageUrl.includes('http') ? item.imageUrl : baseURL + item.imageUrl" class="w-full h-full img" />
		</div>
	</el-dialog>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { TopicTypes } from './types';

const centerDialogVisible = ref(false);
const dataForm = ref<TopicTypes[]>([{ jumpUrl: '', type: 2, imageUrl: '' }]);
const baseURL = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);

const openDialog = (res?: TopicTypes[]) => {
	centerDialogVisible.value = true;
	if (res) {
		dataForm.value = res;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
