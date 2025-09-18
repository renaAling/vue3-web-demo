<template>
	<div>
		<el-dialog title="发布" ref="myDialog" v-model="visible" draggable width="40%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item prop="publishStatus">
					<el-radio-group v-model="model.publishStatus">
						<el-radio :label="item.code" v-for="(item, index) in releaseTypeList" :key="index">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item prop="publishTime" v-if="model.publishStatus == 2">
					<el-date-picker :disabled-date="disabledDate" 
					:disabled-hours="disabledHours"
    				:disabled-minutes="disabledMinutes" 
					v-model="model.publishTime" type="datetime" placeholder="请选择发布时间" value-format="YYYY-MM-DD HH:mm:ss" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">发布</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ReleaseMsgTypes } from '../types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { publishMessage } from '/@/api/portal/index';

const emit = defineEmits(['refresh']);
const releaseTypeList = ref<any[]>([
	{
		name: '立即发布',
		code: 1,
	},
	{
		name: '定时发布',
		code: 2,
	},
]);

const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const loading = ref(false);
const model = ref<ReleaseMsgTypes>({
	id: '',
	publishStatus: 1,
	publishTime: '',
});
const disabledDate = (time: Date) => {
     const today = new Date();
	 return time.getTime() < today.getTime() -1 * 24 * 3600 * 1000;
};
const disabledHours = () => {
  const now = new Date();
  const selectedDate = new Date(model.value.publishTime);

  // 如果不是今天，不禁用任何小时
  if (
    selectedDate.getFullYear() !== now.getFullYear() ||
    selectedDate.getMonth() !== now.getMonth() ||
    selectedDate.getDate() !== now.getDate()
  ) {
    return [];
  }

  const Hours: number[] = [];
  for (let i = 0; i < 24; i++) {
    if (i < now.getHours()) {
      Hours.push(i); // 禁用当前小时之前的小时
    }
  }
  return Hours;
};
const disabledMinutes = () => {
  const now = new Date();
  const selectedDate = new Date(model.value.publishTime);

  // 如果不是今天 或者 不是当前小时，则不禁用任何分钟
  if (
    selectedDate.toDateString() !== now.toDateString() ||
    selectedDate.getHours() !== now.getHours()
  ) {
    return [];
  }

  const Minutes: number[] = [];
  for (let i = 0; i < 60; i++) {
    if (i < now.getMinutes()) {
      Minutes.push(i); // 禁用当前分钟之前的所有分钟
    }
  }
  return Minutes;
};
// const SelectTime = ref<[Date, Date]>([
//     new Date(),
//     new Date(),
// ])
 
// function ChangeSelectTime() {
//     console.log(SelectTime.value);
// }
// //禁用日期
// function disabledDate(time: { getTime: () => number }) {
//     const today = new Date();
//     return time.getTime() > today.getTime();
// }
// //禁用小时
// function disabledHours() {
//     const Hours: number[] = [];
//     if (new Date(SelectTime.value[0]).getTime() > Date.now()) return Hours;
//     for (let i = 0; i < 24; i++) {
//         if (new Date().getHours() >= i) continue;
//         Hours.push(i);
//     }
//     return Hours;
// };
// //禁用分
// function disabledMinutes() {
//     const Minutes: number[] = [];
//     if (new Date(SelectTime.value[0]).getTime() > Date.now()) return Minutes;
//     for (let i = 0; i < 60; i++) {
//         if (new Date().getMinutes() >= i) continue;
//         Minutes.push(i);
//     }
//     return Minutes;
// };
const formRules = reactive<FormRules>({
	publishStatus: [{ required: true, message: '请选择发布类型' }],
	publishTime: [{ required: true, message: '请选择发布时间' }],
});
const openDialog = async (id: string | number) => {
	model.value.id = id;
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	loading.value = true;
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				const params = {
					...model.value,
				};
				const { code, msg } = await publishMessage(params);
				loading.value = false;
				if (code === 0) {
					useMessage().success(`发布成功`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
				loading.value = false;
			}
		} else {
			loading.value = false;
			return false;
		}
	});
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = { publishStatus: 1, publishTime: '' };
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm(formEl);
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
