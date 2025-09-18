<template>
	<div class="layout-padding" style="width: 100%">
		<div class="autolayout-padding layout-padding-view">
			<div class="my-5 flex align-center justify-start cursor-pointer" @click="toForward">
				<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
			</div>
			<div class="addTitle m-5">会员卡申请</div>
			<div style="width: 600px; margin-left: 50px">
				<el-form :model="form" label-width="150px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
					<el-form-item label="发行方" prop="publishUser">
						<el-input placeholder="请输入发行方" clearable v-model="form.publishUser" maxlength="30"></el-input>
					</el-form-item>
					<el-form-item label="会员卡名称" prop="cardName">
						<el-input placeholder="请输入会员卡名称" clearable v-model="form.cardName" maxlength="30"></el-input>
					</el-form-item>
					<el-form-item label="发行数量" prop="publishNum">
						<el-input-number v-model="form.publishNum" :step="1" :min="1" step-strictly />
					</el-form-item>
					<el-form-item label="权益说明" prop="rightsDescription">
						<el-input placeholder="请输入权益说明" :rows="3" type="textarea" v-model="form.rightsDescription" maxlength="100"></el-input>
					</el-form-item>
					<el-form-item label="详细权益规则" prop="benefitRules">
						<upload-img v-model:image-url="form.benefitRules" />
					</el-form-item>
					<el-form-item label="线下申请单" prop="offlineRequisition">
						<upload-img v-model:image-url="form.offlineRequisition" />
					</el-form-item>
				</el-form>
				<div class="flex align-center justify-center mt-10">
					<span class="dialog-footer">
						<el-button @click="resetForm">取消</el-button>
						<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="membershipCardApplicationAdd">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { cardApplyAdd, cardApplyUpdate } from '/@/api/member/cards';
// 定义变量内容
const emit = defineEmits(['changeType', 'refresh']);
const dataFormRef = ref();
const loading = ref(false);
// 提交表单数据
const form = reactive({
	id: '',
	publishUser: '',
	cardName: '',
	publishNum: '',
	rightsDescription: '',
	benefitRules: '',
	offlineRequisition: '',
});

// 定义校验规则
const dataRules = ref({
	publishUser: [{ required: true, message: '发行方不能为空', trigger: 'blur' }],
	cardName: [{ required: true, message: '会员卡名称不能为空', trigger: 'blur' }],
	publishNum: [{ required: true, message: '发行数量不能为空', trigger: 'blur' }],
	rightsDescription: [{ required: true, message: '权益说明不能为空', trigger: 'blur' }],
	benefitRules: [{ required: true, message: '详细权益规则不能为空', trigger: 'blur' }],
	offlineRequisition: [{ required: true, message: '线下申请单不能为空', trigger: 'blur' }],
});

// 关闭弹窗
const resetForm = () => {
	useMessageBox()
		.confirm('是否取消新增?')
		.then(async () => {
			dataFormRef.value.resetFields();
			emit('changeType');
		})
		.catch(() => {});
};
// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, data, msg } = form.id ? await cardApplyUpdate(form) : await cardApplyAdd(form);
		if (code === 0) {
			emit('changeType');
			emit('refresh');
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const toForward = () => {
	useMessageBox()
		.confirm('是否取消新增?')
		.then(async () => {
			dataFormRef.value.resetFields();
			emit('changeType');
		})
		.catch(() => {});
};
</script>
<style lang="scss" scoped>
.layout-padding {
	height: 100%;
	.boxSizing {
		box-sizing: border-box;
		margin-bottom: 10px;
	}
}
.addTitle {
	font-size: 20px;
	font-weight: 600;
	color: #000;
}
.back-icon {
	font-size: 20px;
	.el-icon {
		height: 100%;
	}
}

.avatar {
	margin-left: 25px;
	height: 84px;
	width: 84px;
}
.content-title {
	font-size: 14px;
	font-weight: bold;
	line-height: 22px;
	color: #3d3d3d;
	padding-left: 16px;
	position: relative;
	margin-top: 9px;
	margin-bottom: 9px;
	&::before {
		content: '';
		width: 8px;
		height: 20px;
		border-radius: 2px;
		background-color: #165dff;
		position: absolute;
		left: 0;
	}
}
.el_edit {
	margin-right: 10px;
}
</style>
