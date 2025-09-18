<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="30%" :before-close="resetForm">
			<div class="tips">
				<div>您将从同步最新数据</div>
				<div>同步期间请勿重复操作,以免导致数据异常</div>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<!-- <el-button @click="resetForm">取消</el-button> -->
					<el-button type="primary" @click="submitForm">立即同步 </el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ref } from 'vue';
import { ElForm } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { fetchStationByPoiCodeApi } from '/@/api/note/noteInfo';

const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('数据同步');
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const openDialog = () => {
	visible.value = true;
};
const submitForm = async () => {
  const res = await fetchStationByPoiCodeApi();
  try {
    if (res?.ok) {
      useMessage().success(res.msg || '操作成功');
      emit('refresh');
      visible.value = false;
    } else {
      useMessage().error(res.msg);
    }
  } catch (error) {
    console.log(error);
  }
};
const resetForm = () => {
	emit('refresh');
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.tips {
	width: 100%;
	margin: auto;
	text-align: center;
}
.dialog-footer {
	width: 100%;
	margin: auto;
	text-align: center;
}
</style>
