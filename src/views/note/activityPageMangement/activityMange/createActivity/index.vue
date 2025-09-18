<template>
	<div>
		<div class="layout-padding">
			<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
				<div @click="router.go(-1)" class="flex items-center cursor-pointer mb-4">
					<el-icon class="mr-[4px]">
						<ArrowLeftBold />
					</el-icon>
					返回
				</div>
				<el-form :model="formData" ref="ruleFormRef" :rules="rules" label-width="150px" v-loading="loading">
					<el-form-item label="活动名称:" prop="name">
						<el-input v-model="formData.name" placeholder="请输入" maxlength="50" />
					</el-form-item>
					<el-form-item label="活动概述:" prop="description">
						<el-input v-model="formData.description" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="活动时间:" prop="timeVal">
						<el-date-picker
							class="!w-full"
							v-model="formData.timeVal"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							unlink-panels
							type="daterange"
							@change="onchangeTime"
						/>
					</el-form-item>
					<el-form-item label="活动地点:" prop="address">
						<el-input v-model="formData.address" placeholder="请输入" maxlength="100" />
					</el-form-item>
					<el-form-item label="活动人数:" prop="num">
						<div style="display: flex">
							<el-input-number v-model="formData.num" :disabled="checkbox" controls-position="right" :min="0" :max="99999" :precision="0" />
							<el-checkbox class="!ml-4" :checked="checkbox" label="不限" @change="handleChangeNum" />
						</div>
					</el-form-item>
					<el-form-item label="报名须知:" prop="registration">
						<el-input type="textarea" v-model="formData.registration" placeholder="请输入" maxlength="300" show-word-limit />
					</el-form-item>
					<el-form-item label="活动海报:" prop="poster">
						<div class="upload-item flex items-center">
							<UploadImg
								class="mr-[10px]"
								v-for="(item, index) in formData.poster"
								:key="index"
								v-model:imageUrl="formData.poster[index]"
								:fileType="['image/jpeg', 'image/jpg', 'image/png']"
							/>
							<el-button v-if="formData.poster.length < 5" @click="handleCreateUploadComponent" type="primary"> 添加上传海报 </el-button>
						</div>
					</el-form-item>
					<el-form-item label="活动详情:" prop="details">
						<editor v-model:get-html="formData.details" height="500" width="100%" />
					</el-form-item>
					<el-form-item label="报名后是否需要跳转" prop="isJump">
						<el-radio-group v-model="formData.isJump">
							<el-radio :value="true">是</el-radio>
							<el-radio :value="false">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="跳转类型:" prop="jumpType">
						<el-select v-model="formData.jumpType" placeholder="请选择跳转类型" clearable>
							<el-option v-for="value in jumpTypeList" :key="value.value" :label="value.label" :value="value.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="跳转目标:" prop="jumpUrl">
						<el-input v-model="formData.jumpUrl" placeholder="请输入"></el-input>
					</el-form-item>
				</el-form>
				<div class="footer">
					<el-button @click="resetForm">取消</el-button>
					<el-button type="primary" @click="handleSubmit">保存</el-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { goBackFn } from '../../hooks/index';
import { activityUpdateApi, activityAddApi, activityDetailApi } from '/@/api/note/noteInfo';
import { useMessage } from '/@/hooks/message';
import UploadImg from '/@/components/Upload/Image.vue';

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);
const checkbox = ref(false);
const formData = ref<any>({
	name: '',
	description: '',
	startTime: '',
	endTime: '',
	address: '',
	num: 1,
	registration: '',
	poster: [],
	details: '',
	isJump: true,
	jumpType: null,
	jumpUrl: '',
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
	description: [{ required: true, message: '请输入活动概述', trigger: 'blur' }],
	timeVal: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
	address: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
	num: [{ required: true, message: '请输入活动人数', trigger: 'blur' }],
	registration: [{ required: true, message: '请输入报名须知', trigger: 'blur' }],
	poster: [{ required: true, message: '请选择活动海报', trigger: 'change' }],
	details: [{ required: true, message: '请输入活动详情', trigger: 'blur' }],
	isJump: [{ required: true, message: '请选择', trigger: 'change' }],
});

const jumpTypeList = [
	{
		label: '不跳转',
		value: 1,
	},
	{
		label: '跳转h5',
		value: 2,
	},
	{
		label: '跳转微信小程序内部页面',
		value: 3,
	},
	{
		label: '跳转其他微信小程序',
		value: 4,
	},
];

const activityDetail = async () => {
	const code = route.query.code as string;
	const res = await activityDetailApi(code);
	if (res?.ok) {
		formData.value = { ...res.data, poster: res.data?.poster.split(','), timeVal: [res.data?.startTime, res.data?.endTime] };
	} else {
		useMessage().error(res?.msg);
	}
};

const onchangeTime = (e: any) => {
	formData.value.timeVal = e;
	formData.value.startTime = e ? `${e[0]} 00:00:00` : '';
	formData.value.endTime = e ? `${e[1]} 23:59:59` : '';
};

const handleCreateUploadComponent = () => {
	const MAX_IMAGES = 5;
	if (formData.value.poster.some((img: any) => !img)) {
		useMessage().error('请先上传已有的海报');
		return;
	}
	if (formData.value.poster.length >= MAX_IMAGES) {
		useMessage().error(`最多上传${MAX_IMAGES}张海报`);
		return;
	}
	formData.value.poster.push('');
};

const handleChangeNum = (checked: boolean) => {
	if (checked) {
		checkbox.value = true;
		formData.value.num = 0;
	} else {
		checkbox.value = false;
		formData.value.num = 1;
	}
};

const resetForm = () => {
	goBackFn(ruleFormRef.value, '/note/activityPageMangement/activityMange/index');
};
const handleSubmit = async () => {
	const valid = await ruleFormRef.value?.validate().catch(() => {});
	const params = { ...formData.value, poster: formData.value.poster.join(',') };
	if (!valid) return false;
	try {
		loading.value = true;
		const res = formData.value.code ? await activityUpdateApi(params) : await activityAddApi(params);
		if (res?.ok) {
			useMessage().success('提交成功');
			router.go(-1);
		} else {
			useMessage().error(res?.msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	if (route.query.code) {
		activityDetail();
	}
});
</script>
<style lang="scss" scoped>
.footer {
	margin-top: 24px;
	width: 100%;
	text-align: center;
}
</style>
