<template>
	<el-dialog :close-on-click-modal="false" title="详情" width="800" draggable v-model="visible">
		<div class="flex" style="justify-content: space-between">
			<el-form :model="form" label-width="100px" ref="dataFormRef" v-loading="loading" style="width: 80%">
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
			<div>{{ approveMap[form.applyStatus] }}</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<!-- 已驳/通过 -->
				<el-button @click="resetForm">取消</el-button>
				<!-- 已发起 -->
				<el-button @click="onSubmit" type="danger" v-if="form.applyStatus == '1'" :disabled="loading">撤销</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { cardApplyAdd, cardApplyCancel, cardApplyDetail, cardApplyUpdate } from '/@/api/member/cards';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 定义变量内容
const emit = defineEmits(['refresh', 'changeType']);
const dataFormRef = ref<any>();
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
});
const approveMap = ref<Record<string, string>>({
	'1': '已发起',
	'2': '已撤回',
	'3': '已驳回',
	'4': '已通过',
});
// 打开弹窗
const openDialog = (row?: any) => {
	console.log('row', row);
	visible.value = true;
	nextTick(() => {
		if (row) {
			getDetailData(row.id);
		}
	});
};
const getDetailData = async (id: any) => {
	const res = await cardApplyDetail({ id });
	form.value = res.data;
};
// 关闭弹窗
const resetForm = () => {
	visible.value = false;
	// useMessageBox()
	// 	.confirm('是否确认取消?')
	// 	.then(async () => {
	// 		visible.value = false;
	// 	})
	// 	.catch(() => {});
};

// 提交
const onSubmit = async () => {
	const params = {
		id: form.value.id,
		applyStatus: 2,
	};
	useMessageBox()
		.confirm('确认撤销会员卡申请?')
		.then(async () => {
			try {
				loading.value = true;
				const { code, data, msg } = await cardApplyCancel(params);
				if (code === 0) {
					console.log('aaa', data);
					useMessage().success('撤销成功');
					visible.value = false;
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			} finally {
				loading.value = false;
			}
		})
		.catch(() => {});
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.upload_icon {
	position: absolute;
	width: 24px;
	height: 24px;
	left: 62px;
	top: 62px;
	border-radius: 100px;
	border: 2px solid #ffffff;
	background-color: #e8f3ff;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}
</style>
