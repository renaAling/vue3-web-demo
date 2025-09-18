<template>
	<div>
		<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :show-close="false">
			<el-card>
				<el-form @submit.prevent :model="model" v-loading="loading" ref="formRef" label-width="100px" :rules="formRules">
					<el-form-item label="选择商家" prop="merchantCode">
						<el-select v-model="model.merchantCode" clearable :disabled="scopeId" filterable>
							<el-option v-for="(item, key) in merchantList" :key="key" :label="item.merchantName" :value="item.merchantCode"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="分组图标">
						<upload-img v-model:image-url="model.imageUrl" />
					</el-form-item>
					<el-form-item label="分组名称" prop="groupName">
						<el-input v-model="model.groupName" type="text" placeholder="请输入分组名称" maxlength="50" show-word-limit clearable />
					</el-form-item>
					<el-form-item label="分组描述">
						<el-input v-model="model.remark" type="textarea" placeholder="请输入分组描述" maxlength="200" show-word-limit clearable />
					</el-form-item>
				</el-form>
			</el-card>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { wdGroupAdd, wdGroupGetDetail, wdGroupUpdate } from '/@/api/goodStore/productsGroup';
import { fetchMerchantList } from '/@/api/goodStore/staff';

const emit = defineEmits(['refresh']);
const dialogVisible = ref(false);
const dialogTitle = ref('新增分组');
const formRef = ref();
const scopeId = ref<string | null>('');
const merchantList = ref<any>([]);
const loading = ref(false);
const model = ref<any>({
	merchantCode: '',
	imageUrl: '',
	groupName: '',
	remark: '',
});

//   表单校验规则
const formRules = reactive<FormRules>({
	merchantCode: [{ required: true, message: '请选择商家' }],
	groupName: [{ required: true, message: '请输入分组名称' }],
});

const getMerchantList = () => {
	fetchMerchantList().then((res) => {
		if (res.code === 0) {
			merchantList.value = res.data;
		}
	});
};

const openDialog = async (id: string | null) => {
	getMerchantList();
	scopeId.value = id;
	if (id) {
		dialogTitle.value = '编辑分组';
		try {
			const { code, data } = await wdGroupGetDetail({ groupCode: id });
			if (code === 0) {
				const detail = Object.assign(data);
				model.value = detail;
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
	dialogVisible.value = true;
	nextTick(() => {});
};

const closeMyDialog = () => {
	dialogVisible.value = false;
};
const onSubmit = async () => {
	const valid = await formRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		scopeId.value ? await wdGroupUpdate(model.value) : await wdGroupAdd(model.value);
		useMessage().success('编辑成功');
		dialogVisible.value = false;
		resetForm(formRef.value);
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		merchantCode: '',
		imageUrl: '',
		groupName: '',
		remark: '',
	};
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	// if (scopeId.value) return resetForm(formEl);
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

<style scoped lang="scss">
.map-input {
	height: 456px;
}

.map {
	width: 715px;
	height: 366px;
}

.add-img {
	width: 150px;
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background-color: transparent;
	border: 1px dashed #cdd0d6;
	border-radius: 8px;
	cursor: pointer;
	margin-left: 10px;

	.icon-plus {
		width: 24px;
		height: 24px;
	}
}

.box {
	position: relative;

	.del {
		position: absolute;
		width: 1em;
		height: 1em;
		top: 0;
		right: 0;
	}
}
</style>
<style>
.popper-select {
	:is(li)[aria-haspopup='true'] {
		.el-checkbox {
			display: none;
		}
	}
}
</style>
