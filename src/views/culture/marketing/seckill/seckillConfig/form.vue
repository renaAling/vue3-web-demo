<template>
	<el-dialog :close-on-click-modal="false" :title="(form.id ? '编辑' : '新增') + '秒杀时段'" width="450" draggable
		v-model="visible">
		<el-form :model="form" label-width="110px" :rules="dataRules" ref="dataFormRef" v-loading="loading">
			<el-form-item label="标题" prop="name">
				<el-input placeholder="请输入" style="width: 280px" clearable v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="时间范围" prop="dateTime">
				<el-time-picker v-model="form.dateTime" is-range range-separator="-" start-placeholder="开始时间"
					end-placeholder="结束时间" value-format="HH:mm" style="width: 180px" />
			</el-form-item>
			<el-form-item label="是否开启" prop="status">
				<el-radio-group v-model="form.status">
					<el-radio :label="1">开启</el-radio>
					<el-radio :label="0">关闭</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText')
					}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="seckillConfigForm" setup>
import { useMessage } from '/@/hooks/message';
import { seckillIntervalAddApi, seckillIntervalUpdateApi } from '/@/api/culture/marketing';

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	name: null,
	status: 1,
	dateTime: [],
});

const dataRules = ref({
	name: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
	dateTime: [{ required: true, message: '时间范围不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '是否启用不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row) => {
	visible.value = true;
	nextTick(() => {
		dataFormRef.value.resetFields();
	});
	if (row) {
		Object.assign(form, row);
		form.dateTime = [row.startTime, row.endTime];
	}
};

const emit = defineEmits(['refresh']);
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => { });
	if (!valid) return false;
	const params = {
		...form,
		startTime: form.dateTime[0],
		endTime: form.dateTime[1],
	};
	try {
		form.id ? await seckillIntervalUpdateApi(params) : await seckillIntervalAddApi(params);
		useMessage().success('操作成功');
		visible.value = false;
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
