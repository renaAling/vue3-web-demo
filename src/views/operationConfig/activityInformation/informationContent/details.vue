<template>
	<div>
		<el-dialog :title="title" ref="myDialog" v-model="visible" draggable width="25%" :close-on-click-modal="false">
			<div class="activity-title">{{ form.activityTitle }}</div>
			<el-tag class="my-3" v-if="form.type == '1'">线上活动</el-tag>
			<el-tag v-else class="my-3" type="success">线下活动</el-tag>
			<!--富文本内容-->
			<div v-html="form.activityContent"></div>
			<el-button class="mt-5" type="primary" style="width: 100%" v-if="form.type == '1'"> 立即参与 </el-button>
			<template #footer>
				<el-button @click="cancel">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="details-config">
import { ref } from 'vue';
const visible = ref(false);
const myDialog = ref(null);
const title = ref('');
const dialogType = ref('');
const form = ref<any>({
	activityTitle: '',
	groupName: '',
	type: '2',
	activityUrl: '',
	activityImg: '',
	activityContent: '',
});

const openDialog = async (row: object, type: string) => {
	dialogType.value = type;
	title.value = '活动详情';
	visible.value = true;
	console.log('row', row);
	Object.assign(form.value, row);
	// 	try {
	// 	let res = await getWinningList();
	// 	state.dataList = res.data;
	// } catch (err) {
	// 	console.log('err', err);
	// }
};
// const closeMyDialog = () => {
// 	visible.value = false;
// };
const cancel = () => {
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style lang="scss" scoped>
.activity-title {
	font-size: 18px;
	font-weight: 700;
}
</style>
