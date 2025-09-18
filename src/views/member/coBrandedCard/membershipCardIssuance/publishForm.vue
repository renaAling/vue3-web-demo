<template>
	<!-- 会员卡审核 -->
	<div class="layout-padding" style="width: 100%">
		<div class="-autolayout-padding layout-padding-view pl-10 pt-5">
			<el-scrollbar>
				<div class="my-5 flex align-center justify-start cursor-pointer" @click="toForward">
					<el-icon :size="22" class="mt-1"> <ArrowLeftBold /> </el-icon><span class="ml-4 back-icon">返回</span>
				</div>
				<div class="m-5 flex" style="justify-content: space-between; width: 600px">
					<span class="addTitle">发行会员卡</span>
				</div>
				<div style="width: 1000px; margin-left: 50px">
					<el-form :model="form" label-width="150px" ref="dataFormRef" :rules="dataRules" v-loading="loading">
						<el-form-item label="发行方" prop="publisher">
							<el-input placeholder="请输入发行方" clearable v-model="form.publisher" maxlength="30"></el-input>
						</el-form-item>
						<el-form-item label="会员卡名称" prop="name">
							<el-input placeholder="请输入会员卡名称" clearable v-model="form.name" maxlength="30"></el-input>
						</el-form-item>
						<el-form-item label="发行数量" prop="publishNum">
							<el-input-number v-model="form.publishNum" :step="1" :min="1" step-strictly />
						</el-form-item>
						<el-form-item label="号段前缀" prop="cardPre">
							<el-input
								placeholder="请输入号段前缀"
								clearable
								:disabled="!isAdd"
								oninput="value=value.replace(/^0|[^0-9]/g, '')"
								v-model="form.cardPre"
								maxlength="30"
							></el-input>
						</el-form-item>
						<el-form-item label="起始卡号" prop="firstCardId">
							<el-input placeholder="请输入起始卡号" :disabled="!isAdd" clearable v-model="form.firstCardId" maxlength="30"></el-input>
						</el-form-item>
						<el-form-item label="权益说明" prop="rightDescription">
							<el-input v-model="form.rightDescription" :rows="3" type="textarea" placeholder="请输入权益说明" maxlength="100" />
						</el-form-item>
						<el-form-item label="关联申请单" prop="applyCode">
							<el-select
								v-model="form.applyCode"
								multiple
								filterable
								remote
								reserve-keyword
								placeholder="请选择关联申请单"
								:remote-method="getApplyCodeData"
								:loading="loading"
							>
								<el-option v-for="(item, index) in applyCodeList" :key="index" :label="item.cardName" :value="item.code" />
							</el-select>
							<!-- <el-select v-model="form.applyCode" style="width: 100%" :disabled="!isAdd">
								<el-option v-for="(item, index) in applyCodeList" :key="index" :label="item.cardName" :value="item.code"></el-option>
							</el-select> -->
						</el-form-item>
						<el-form-item label="会员卡封面" prop="cover">
							<upload-img v-model:image-url="form.cover" />
						</el-form-item>
						<el-form-item label="发行时间" prop="publishTime">
							<el-date-picker v-model="form.publishTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
						</el-form-item>
					</el-form>
					<div class="flex align-center justify-center mt-10">
						<span class="dialog-footer">
							<el-button @click="resetForm">取消</el-button>
							<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
						</span>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup name="ad-businessReports">
import { applyList, cardAdd, cardDetail, cardUpdate } from '/@/api/member/cards';
import { useMessage } from '/@/hooks/message';
// 定义变量内容
const emit = defineEmits(['changeType', 'refresh', 'toDetails']);
const dataFormRef = ref();
const loading = ref(false);
const isAdd = ref(true);
const backDetails = ref(false); //判断返回位置
// 提交表单数据
const form = reactive({
	publisher: '',
	name: '',
	publishNum: '',
	cardPre: '',
	firstCardId: '',
	rightDescription: '',
	applyCode: '',
	cover: '',
	publishTime: '',
});
interface ApplyCodeItem {
	cardName: string | number;
	code: string;
}
const applyCodeList = ref<ApplyCodeItem[]>([]);
// 定义校验规则
const dataRules = ref({
	publisher: [{ required: true, message: '发行方不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '会员卡名称不能为空', trigger: 'blur' }],
	publishNum: [{ required: true, message: '发行量不能为空', trigger: 'blur' }],
	cardPre: [{ required: true, message: '号段前缀不能为空', trigger: 'blur' }],
	firstCardId: [{ required: true, message: '起始卡号不能为空', trigger: 'blur' }],
	rightDescription: [{ required: true, message: '会员权益描述不能为空', trigger: 'blur' }],
	applyCode: [{ required: true, message: '关联申请单不能为空', trigger: 'blur' }],
	cover: [{ required: true, message: '会员卡封面不能为空', trigger: 'blur' }],
	publishTime: [{ required: true, message: '发行时间不能为空', trigger: 'blur' }],
});

const show = (row: any, type?: string) => {
	isAdd.value = true;
	getApplyCodeData('');
	backDetails.value = false;
	if (row) {
		getCardDetail(row);
		isAdd.value = false;
	}
	if (type) {
		backDetails.value = true;
	}
};
const getApplyCodeData = (str: string) => {
	applyList({ name: str }).then((res: any) => {
		applyCodeList.value = res.data;
	});
};
// 返回
const resetForm = () => {
	if (backDetails.value) {
		emit('toDetails', form.id);
	} else {
		emit('changeType');
	}
	dataFormRef.value.resetFields();
};
// 提交
const onSubmit = async (type: boolean) => {
	console.log('审批意见', type);
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		const { code, data, msg } = form.id ? await cardUpdate(form) : await cardAdd(form);
		if (code === 0) {
			console.log('aaa', data);
			if (backDetails.value) {
				emit('toDetails', form.id);
			} else {
				emit('changeType');
				emit('refresh');
			}
			dataFormRef.value.resetFields();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const getCardDetail = async (id: string) => {
	try {
		loading.value = true;
		const { code, data, msg } = await cardDetail({ id: id });
		if (code === 0) {
			Object.assign(form, data);
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
	if (backDetails.value) {
		emit('toDetails', form.id);
	} else {
		emit('changeType');
	}
	dataFormRef.value.resetFields();
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
