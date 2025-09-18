<template>
	<div>
		<el-dialog title="中奖名单" ref="myDialog" v-model="visible" draggable width="60%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item label="奖品名称：" prop="name" class="custom-width">
					<el-input v-model="model.name" placeholder="请输入活动名称" clearable maxlength="30" />
				</el-form-item>
				<el-form-item label="奖品图片：" prop="imageUrl" class="custom-width">
					<upload-img v-model:imageUrl="model.imageUrl" dir="activity"></upload-img>
				</el-form-item>
				<el-form-item label="中奖概率：" prop="name" class="custom-width">
					<el-input v-model="model.name" placeholder="请输入活动名称" clearable maxlength="30" />
				</el-form-item>
				<el-form-item label="奖品数量：" prop="name" class="custom-width">
					<el-input v-model="model.name" placeholder="请输入活动名称" clearable maxlength="30" />
				</el-form-item>
				<el-form-item label="每日投放：" prop="name" class="custom-width">
					<el-input v-model="model.name" placeholder="请输入活动名称" clearable maxlength="30" />
				</el-form-item>
				<footer class="footer">
					<el-button type="primary" @click="submitForm(formRef)" :disabled="isDisabled" :loading="loading">保存</el-button>
					<el-button @click="handleCancel">取消</el-button>
				</footer>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getWinningList } from '/@/api/operationConfig/firstPage';
import { modelTypes } from './types';
const emit = defineEmits(['refresh']);

const visible = ref(false);
const myDialog = ref(null);
const formRef = ref<FormInstance>();

const scopeId = ref<string | null>('');

const model = ref<modelTypes>({
	name: '',
	activityTime: '',
	identityTypes: [],
	type: [],
	lotteryNum: false,
	lotteryNum2: false,
	dailyCount: null,
	firstCount: null,
	awardType: null,
	imageUrl: '',
});

const formRules = reactive<FormRules>({
	name: [{ required: true, message: '请输入活动名称' }],
	imageUrl: [{ required: true, message: '请上传奖品图片' }],
	identityTypes: [{ required: true, message: '请至少选择一个对象' }],
	awardType: [{ required: true, message: '请选择领奖方式' }],
});
//  table hook
const { tableStyle } = useTable(state);

const openDialog = async (id: string | null) => {
	try {
		let res = await getWinningList();
		state.dataList = res.data;
		visible.value = true;
	} catch (err) {
		console.log('err', err);
	}
};
const closeMyDialog = () => {
	visible.value = false;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
