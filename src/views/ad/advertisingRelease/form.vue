<template>
	<div class="layout-padding" v-loading="loading">
		<el-scrollbar class="!h-[calc(100%-60px)]">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer mb-2">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				label-position="top"
				label-width="120px"
				:disabled="(formData.auditStatus > 1 && isAudit) || (formData.auditStatus > 0 && !isAudit)"
			>
				<el-card>
					<template #header>
						<div class="card-header">申请信息</div>
					</template>
					<el-row :gutter="40">
						<el-col :span="8">
							<el-form-item label="投放广告位" prop="spaceCode">
								<el-select v-model="formData.spaceCode" placeholder="请选择">
									<el-option :label="item.name" :value="item.code" v-for="(item, index) in advertisingList" :key="index" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="投放时间" prop="daterangeTime">
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
						<el-col :span="8">
							<el-form-item label="素材设置" prop="fileOriginal" @click.prevent="handleOpenMaterial">
								<el-select v-model="formData.fileOriginal" placeholder="请选择" clearable>
									<el-option :label="item.original" :value="item.fileName" v-for="(item, index) in selectMaterial" :key="index" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="8">
							<el-form-item label="可见用户标签" prop="signCodes">
								<el-select v-model="formData.signCodes" placeholder="请选择" multiple clearable>
                  <el-option label="全部" value="ALL_USERS" />
									<el-option :label="item.name" :value="item.code" v-for="(item, index) in memberSignList" :key="index" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="16">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" v-model="formData.remark" placeholder="说明广告投放的来源、用途等等投放背景" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="40">
						<el-col :span="24">
							<el-form-item label="链接设置" prop="linkUrl">
								<!-- 2：网页链接，3：内部小程序地址，4：外部小程序地址 -->
								<el-radio-group v-model="formData.linkType">
									<div class="w-full flex">
										<el-radio :value="2">网页地址</el-radio>
										<el-input v-model="formData.linkUrl" v-if="formData.linkType === 2" placeholder="请输入" />
									</div>
									<div class="w-full flex">
										<el-radio :value="3">内部小程序地址</el-radio>
										<el-input v-model="formData.linkUrl" v-if="formData.linkType === 3" placeholder="请输入" />
									</div>
									<div class="w-full flex">
										<div class="flex items-center">
											<el-radio :value="4">外部小程序地址</el-radio>
										</div>
										<div class="flex items-center" v-if="formData.linkType === 4">
											<el-input class="mx-[10px]" v-model="formData.linkUrl" placeholder="请输入外部小程序地址" />
											<div>外部小程序ID</div>
											<el-input v-model="formData.appId" placeholder="请输入外部小程序ID" />
										</div>
									</div>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
				<el-card class="mt-[20px]" v-if="formData.auditStatus > 0">
					<template #header>
						<div class="card-header">审批信息</div>
					</template>
					<el-row :gutter="40">
						<el-col :span="8">
							<el-form-item label="审核意见" prop="auditAdvice">
								<el-input type="textarea" v-model="formData.auditAdvice" placeholder="说明对本次广告投放的审核意见、备注等" />
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="审核结果" prop="auditStatus">
								{{ formData.auditStatus === 1 ? '待审核' : formData.auditStatus === 2 ? '审核通过' : formData.auditStatus === 3 ? '审核拒绝' : '-' }}
							</el-form-item>
						</el-col>
					</el-row>
				</el-card>
			</el-form>
		</el-scrollbar>
		<div class="footer-audit" v-if="formData.auditStatus === 0 && !isAudit">
			<el-button @click="handleCancel">取消</el-button>
			<el-button type="primary" @click="handleSave">提交</el-button>
		</div>
		<div class="footer-audit" v-if="formData.auditStatus < 2 && isAudit">
			<el-button @click="handleRefuse">拒绝</el-button>
			<el-button type="primary" @click="handlePass">通过</el-button>
			<el-button type="primary" @click="handleSave">保存</el-button>
		</div>
		<MaterialDialog ref="materialDialogRef" @change="handleChooseMaterial" />
	</div>
</template>
<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { type Ref } from 'vue';
import { useMessage } from '/@/hooks/message';
import { adPublishApply, adPublishUpdate, advertSpaceList, adPublishDetail } from '/@/api/ad/advertise';
import { getMemberSignList } from '/@/api/member/memberLabel/label';
const MaterialDialog = defineAsyncComponent(() => import('/@/components/Resources/dialog.vue'));

const route = useRoute();
const router = useRouter();
const materialDialogRef = ref();
const formData = ref({
	code: '',
	spaceCode: '',
	fileId: '',
	fileOriginal: '',
	fileUrl: '',
	startTime: '',
	endTime: '',
	remark: '',
	daterangeTime: [],
	linkType: 2,
	linkUrl: '',
	appId: '',
	signCodes: ['ALL_USERS'],
	auditStatus: 0,
	auditAdvice: '',
});
const formRules = reactive({
	spaceCode: [{ required: true, message: '请选择投放广告位', trigger: 'change' }],
	daterangeTime: [{ required: true, message: '请选择投放时间', trigger: 'change' }],
	fileOriginal: [{ required: true, message: '请选择素材', trigger: 'change' }],
	signCodes: [{ required: true, message: '请选择可见用户标签', trigger: 'change' }],
	linkUrl: [{ required: true, message: '请输入链接', trigger: 'blur' }],
});
const changeTime = (val: any) => {
	if (formData.value.daterangeTime) {
		formData.value.startTime = `${val[0]} 00:00:00`;
		formData.value.endTime = `${val[1]} 23:59:59`;
	}
};
const getDataDetail = async () => {
	const res = await adPublishDetail(route.query.code as string);
	formData.value = {
		...res.data,
		daterangeTime: [res.data.startTime, res.data.endTime],
	};
};
const advertisingList = ref();
const getAdvertisingList = async () => {
	const res = await advertSpaceList({ type: 1 });
	advertisingList.value = res.data;
};
const memberSignList = ref();
const getMemberSignListApi = async () => {
	const res = await getMemberSignList();
	memberSignList.value = res.data;
};
const handleOpenMaterial = () => {
	materialDialogRef.value.openDialog();
};
const selectMaterial = ref();
const handleChooseMaterial = (arr: any) => {
	selectMaterial.value = arr;
	formData.value.fileId = arr[0].id;
	formData.value.fileOriginal = arr[0].original;
	formData.value.fileUrl = arr[0].fileName;
};

const formRef = ref<FormInstance>();
const loading = ref(false);
const handleAudit = async (
	formRef: Ref<FormInstance | undefined>,
	formData: Ref<Record<string, any>>,
	auditStatus: 1 | 2 | 3,
	submitApi: (data: any) => Promise<{ ok: boolean; msg?: string }>
) => {
	try {
		const valid = await formRef.value?.validate();
		if (!valid) return;
		loading.value = true;
		const params = {
			...formData.value,
			auditStatus,
		};
		const res = await submitApi(params);
		if (res?.ok) {
			loading.value = false;
			useMessage().success('操作成功');
			handleCancel();
			return true;
		} else {
			useMessage().error(res?.msg || '操作失败');
			return false;
		}
	} catch (err: any) {
		return false;
	} finally {
		loading.value = false;
	}
};

const handlePass = () => {
	const api = route.query.code ? adPublishUpdate : adPublishApply;
	handleAudit(formRef, formData, 2, api).then((success) => {
		if (success) handleCancel();
	});
};
const handleRefuse = () => {
	const api = route.query.code ? adPublishUpdate : adPublishApply;
	handleAudit(formRef, formData, 3, api);
};
const handleSave = () => {
	const api = route.query.code ? adPublishUpdate : adPublishApply;
	handleAudit(formRef, formData, 1, api).then((success) => {
		if (success) handleCancel();
	});
};
const handleCancel = () => {
	if (isAudit.value) {
		router.push({ path: '/ad/advertisingRelease/review' });
	} else {
  	router.push({ path: '/ad/advertisingRelease/application' });
  }
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

const isAudit = ref(false); // 审核表单显隐
onMounted(() => {
	getAdvertisingList();
	getMemberSignListApi();

	const previousPath = router.options.history.state.back as any;
	if (previousPath && previousPath.includes('/application')) {
		isAudit.value = false;
	}
	if (previousPath && previousPath.includes('/review')) {
		isAudit.value = true;
	}
});
</script>
<style lang="scss" scoped>
.el-form .el-form-item:last-of-type {
	margin-bottom: 18px !important;
}
</style>
