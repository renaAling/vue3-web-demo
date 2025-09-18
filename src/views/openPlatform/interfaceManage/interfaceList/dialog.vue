<template>
	<el-dialog v-model="dialogVisible" :title="dialogTitle" width="410" align-center :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form ref="formRef" :model="form" :rules="formRules" label-width="auto">
			<el-form-item label="参数名称：" prop="paramName">
				<el-input v-model="form.paramName" placeholder="请输入参数名称" clearable maxlength="30" show-word-limit />
			</el-form-item>
			<el-form-item label="参数类型：" prop="paramType">
				<el-input v-model="form.paramType" placeholder="请输入参数类型" clearable maxlength="30" show-word-limit />
			</el-form-item>
			<el-form-item label="是否必填：" prop="required">
				<el-radio-group v-model="form.required">
					<el-radio :label="true">是</el-radio>
					<el-radio :label="false">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="参数说明：" prop="remark">
				<el-input v-model="form.remark" placeholder="请输入参数说明" clearable maxlength="300" show-word-limit type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleConfirm(formRef)">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { addParams, updateParams, getParamsDetail } from '/@/api/openPlatform/interface';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits(['refresh']);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const dialogTitle = ref('');
const currentType = ref(0);
const scopedId = ref(null);
const interfaceId = ref('');

const form = ref({
	paramName: '',
	paramType: '',
	required: true,
	remark: '',
	id: '',
});
const formRules = reactive<FormRules>({
	paramName: [{ required: true, message: '请输入参数名称', trigger: ['blur', 'change'] }],
	paramType: [{ required: true, message: '请输入参数类型', trigger: ['blur', 'change'] }],
	required: [
		{
			required: true,
			message: '请选择是否必填',
			trigger: 'change',
		},
	],
	remark: [{ required: true, message: '请输入参数说明', trigger: ['blur', 'change'] }],
});

const openDialog = (type: number, id: string, data?: any) => {
	dialogVisible.value = true;
	currentType.value = type;
	interfaceId.value = id;
	if (data) {
		dialogTitle.value = '编辑参数';
		scopedId.value = data.id;
		getParamsDetail(data.id)
			.then((res) => {
				console.log('res', res);
				const { code, msg, data } = res;
				if (code == 0) {
					form.value = { ...data };
				} else {
					console.log('msg', msg);
				}
			})
			.catch((err) => {
				console.log('err', err);
			});
	} else {
		scopedId.value = null;
		dialogTitle.value = '添加参数';
	}
};

const handleConfirm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid, fields) => {
		if (valid) {
			try {
				let params = {
					id: form.value.id,
					paramName: form.value.paramName,
					paramType: form.value.paramType,
					required: form.value.required,
					remark: form.value.remark,
					type: currentType.value,
					interfaceId: interfaceId.value,
				};
				console.log('params', params);
				const request = scopedId.value ? updateParams : addParams;
				const { code, msg, data } = await request(params);
				if (code === 0) {
					useMessage().success(`${scopedId.value ? '编辑成功' : '添加成功'}`);
					formEl.resetFields();
					dialogVisible.value = false;
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				console.log('err', err);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};

const handleCancel = () => {
	if (formRef.value) {
		formRef.value.resetFields();
	}
	dialogVisible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.banner {
	height: 300px;
	box-sizing: border-box;
	padding: 16px;
	margin-bottom: 8px;

	img {
		width: 100%;
		height: 100%;
	}
}

.desc {
	.price {
		color: #f5222d;
		margin-bottom: 12px;

		span {
			&:nth-child(2) {
				font-size: 32px;
			}
		}
	}

	.product-name {
		margin-bottom: 8px;
		font-size: 17px;
		font-weight: 500;
	}

	.sell-point {
		font-size: 14px;
		font-weight: 350;
		color: #86909c;
		margin-bottom: 20px;
	}

	.selected {
		font-size: 14px;
		font-weight: 500;
		color: #1d2129;
		margin-bottom: 8px;
	}

	.sku-list {
		border-radius: 4px;
		display: flex;
		width: 100%;
		padding: 4px;
		position: relative;
		border-bottom: 1px solid #f0f0f0;
		padding-bottom: 16px;
		margin-bottom: 16px;

		> div {
			background: #f5f5f5;
			width: 50px;
			height: 50px;
			margin-right: 8px;

			.img {
				width: 100%;
			}

			.selected-border {
				border: 2px solid #0256ff;
			}
		}

		&::after {
			position: absolute;
			content: '>';
			right: 0px;
			top: 25px;
			width: 6px;
			height: 8px;
			font-weight: 500;
		}
	}
}

.detail {
}
</style>
