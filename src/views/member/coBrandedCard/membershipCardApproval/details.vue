<template>
	<!-- 会员卡审核 -->
	<div class="layout-padding" style="width: 100%">
		<div class="-autolayout-padding layout-padding-view pl-10">
			<el-scrollbar>
				<div class="my-5 flex align-center justify-start cursor-pointer" @click="toForward">
					<el-icon :size="22" class="mt-1"><ArrowLeftBold /></el-icon><span class="ml-4 back-icon">返回</span>
				</div>
				<div class="m-5 flex" style="justify-content: space-between; width: 600px">
					<span class="addTitle">会员卡申请</span><span style="margin-left: 300px">{{ approveMap[form.applyStatus] }}</span>
				</div>
				<div style="width: 600px; margin-left: 50px">
					<el-form :model="form" label-width="150px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
						<el-form-item label="发行方" prop="publishUser">
							<el-input placeholder="请输入发行方" disabled clearable v-model="form.publishUser" maxlength="30"></el-input>
						</el-form-item>
						<el-form-item label="会员卡名称" prop="cardName">
							<el-input placeholder="请输入会员卡名称" disabled clearable v-model="form.cardName" maxlength="30"></el-input>
						</el-form-item>
						<el-form-item label="发行数量" prop="publishNum">
							<el-input-number v-model="form.publishNum" disabled :step="1" :min="1" step-strictly />
						</el-form-item>
						<el-form-item label="权益说明" prop="rightsDescription">
							<el-input placeholder="请输入权益说明" disabled :rows="3" type="textarea" v-model="form.rightsDescription" maxlength="30"></el-input>
						</el-form-item>
						<el-form-item label="详细权益规则" prop="benefitRules">
							<upload-img v-model:image-url="form.benefitRules" disabled />
						</el-form-item>
						<el-form-item label="线下申请单" prop="offlineRequisition">
							<upload-img v-model:image-url="form.offlineRequisition" disabled />
						</el-form-item>
						<el-form-item label="审批备注" prop="remark">
							<el-input v-model="form.remark" :rows="3" type="textarea" placeholder="请输入审批备注" maxlength="100" />
						</el-form-item>
					</el-form>
					<div class="flex align-center justify-center mt-10" v-if="form.applyStatus == '1'">
						<span class="dialog-footer">
							<el-button @click="onSubmit(4)" type="primary">通过</el-button>
							<el-button @click="onSubmit(3)" type="danger" :disabled="loading">拒绝</el-button>
						</span>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { useMessage } from '/@/hooks/message';
import { cardApplyAudit, cardApplyDetail } from '/@/api/member/cards';
// 定义变量内容
const emit = defineEmits(['refresh', 'changeType']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const isAdd = ref(true);
// 提交表单数据
const form = ref({
	publishUser: '',
	cardName: '', // 用户名
	publishNum: '',
	rightsDescription: '',
	benefitRules: '',
	offlineRequisition: '',
	applyStatus: '',
	id: '',
	remark: '',
});
const approveMap = ref<Record<string, string>>({
	'1': '已发起',
	'2': '已撤回',
	'3': '已驳回',
	'4': '已通过',
});
// 定义校验规则
const dataRules = ref({
	remark: [{ required: true, message: '审批备注不能为空', trigger: 'blur' }],
});

const show = (row: any) => {
	getDetailData(row.id);
};
const getDetailData = async (id: any) => {
	const res = await cardApplyDetail({ id });
	form.value = Object.assign(res.data, { id });
};
// 提交
const onSubmit = async (applyStatus: number) => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	const params = {
		id: form.value.id,
		applyStatus,
		remark: form.value.remark,
	};
	try {
		loading.value = true;
		const { code, data, msg } = await cardApplyAudit(params);
		if (code === 0) {
			console.log('aaa', data);
			dataFormRef.value.resetFields();
			getDetailData(params.id);
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
	dataFormRef.value.resetFields();
	emit('changeType');
	emit('refresh');
};
defineExpose({
	show,
});
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
