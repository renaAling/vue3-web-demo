<template>
	<el-dialog :close-on-click-modal="false" title="更新" width="800" draggable v-model="visible">
		<div class="my-8">
			会员标签更新频率为每天00：00
		</div>
		<div class="my-8">
			包括标签：
		</div>
  <el-row class="mt-10" :gutter="20" justify="center">
	<el-col :span="8" v-for="(item, index) in selectType" :key="item" class="p-5 mr-4">
		<span>{{item.name}}</span>
		<el-icon @click="removeType(item,index)" class=" cursor-pointer mr-5">
			<Close />
		</el-icon>
	</el-col>
  </el-row>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeMyDialog">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="accountForm" setup>
import {  } from '/@/api/points/agreement';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);




// 打开弹窗
const openDialog = (row: any) => {
	visible.value = true;
	selectType.value = row.typeList;
};
const selectType = ref<any>([])
const removeType = (item: any,index: any) => {
	if(selectType.value.length == 1){
		useMessage().error('至少保留一个会员标签!');
		return
	}
    selectType.value.splice(index,1)
}


const closeMyDialog = () => {
	visible.value = false;
};



// 提交
const onSubmit = async () => {
	try {
		loading.value = true;
		//  await updateProtocolByScore(form)
		useMessage().success('操作成功');
		closeMyDialog();
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
