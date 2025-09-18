<template>
	<div class="layout-padding" style="overflow: auto">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" label-width="120px">
			<el-card>
				<template #header>
					<div class="card-header">申请信息</div>
				</template>
				<el-row :gutter="40">
					<el-col :span="12">
						<el-form-item label="推送计划名称" prop="name">
							<el-input v-model="formData.name" placeholder="请输入推送计划名称" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="投放广告位" prop="spaceCode">
							<el-select v-model="formData.spaceCode" placeholder="请选择">
								<el-option :label="item.name" :value="item.code" v-for="(item, index) in advertisingList" :key="index" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="模型ID" prop="modelCode">
							<el-select v-model="formData.modelCode" placeholder="请选择">
								<el-option :label="item.name" :value="item.code" v-for="(item, index) in pushModelList" :key="index" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="推送时间" prop="daterangeTime">
							<el-date-picker
								v-model="formData.daterangeTime"
								:clearable="false"
								@change="changeTime"
								type="daterange"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="YYYY-MM-DD"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="推送开关" prop="pushSwitch">
							<el-radio-group v-model="formData.pushSwitch">
								<el-radio :value="1">开</el-radio>
								<el-radio :value="0">关</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-card>
			<div class="footer-audit">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleSave">保存</el-button>
			</div>
		</el-form>
	</div>
</template>
<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { advertSpaceList, advertPushModelList, adPushPlanDetail, adPushPlanAdd, adPushPlanUpdate } from '/@/api/ad/advertise';

const route = useRoute();
const router = useRouter();
const formData = ref({
	name: '',
	spaceCode: '',
	modelCode: '',
	startTime: '',
	endTime: '',
	daterangeTime: [],
	pushSwitch: 1,
});
const formRules = reactive({
	name: [{ required: true, message: '请输入推送计划名称', trigger: 'blur' }],
	spaceCode: [{ required: true, message: '请选择', trigger: 'change' }],
	modelCode: [{ required: true, message: '请选择', trigger: 'change' }],
	daterangeTime: [{ required: true, message: '请选择', trigger: 'change' }],
	pushSwitch: [{ required: true, message: '请选择', trigger: 'change' }],
});
const changeTime = (val: any) => {
	if (formData.value.daterangeTime) {
		formData.value.startTime = `${val[0]} 00:00:00`;
		formData.value.endTime = `${val[1]} 23:59:59`;
	}
};
const advertisingList = ref();
const getAdvertisingList = async () => {
	const res = await advertSpaceList({ type: 2 });
	advertisingList.value = res.data;
};
const pushModelList = ref();
const getPushModelList = async () => {
	const res = await advertPushModelList();
	pushModelList.value = res.data;
};
const getDataDetail = async () => {
	const res = await adPushPlanDetail(route.query.code as string);
	formData.value = {
    ...res.data,
		daterangeTime: [res.data.startTime, res.data.endTime],
  };
};
const handleCancel = () => {
	router.push({ path: '/ad/advertisingPush/targetedPushPlan' });
};
const formRef = ref<FormInstance>();
const loading = ref(false);
const handleSave = () => {
	formRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			loading.value = true;
			const res = route.query.code ? await adPushPlanUpdate(formData.value) : await adPushPlanAdd(formData.value);
			if (res?.ok) {
				loading.value = false;
				useMessage().success('操作成功');
				handleCancel();
			} else {
				loading.value = false;
				useMessage().error(res?.msg || '操作失败');
			}
		} catch (err: any) {
			const errorMsg = err?.msg || '操作失败';
			useMessage().error(errorMsg);
		} finally {
			loading.value = false;
		}
	});
};

watch(
	() => route.query.code,
	(newUid) => {
		if (newUid) {
			try {
				loading.value = true;
				getDataDetail();
			} catch (err) {
				loading.value = false;
			} finally {
				loading.value = false;
			}
		}
	},
	{ immediate: true }
);

onMounted(() => {
	getAdvertisingList();
	getPushModelList();
});
</script>
<style lang="scss" scoped>
.el-form .el-form-item:last-of-type {
	margin-bottom: 18px !important;
}
</style>
