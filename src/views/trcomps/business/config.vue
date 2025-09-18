<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-tabs v-model="activeName" class="demo-tabs">
					<el-tab-pane label="基本信息" name="Base">
						<el-form-item label="LOGO" prop="rectangleLogo">
							<upload-img v-model:image-url="model.rectangleLogo" />
						</el-form-item>
						<el-form-item label="供应商渠道" prop="channelId">
							<el-select v-model="model.channelId" placeholder="请选择供应商渠道" clearable>
								<el-option v-for="item in channelTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="渠道商家" prop="channelMerchantId">
							<el-select
								v-model="model.channelMerchantId"
								filterable
								remote
								reserve-keyword
								placeholder="请选择渠道商家"
								:remote-method="(val: any) => getChannelMerchantsList(val)"
								:loading="loading"
							>
								<el-option v-for="item in channelMerchantList" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item label="商家类型" prop="merchantType">
							<el-select v-model="model.merchantType" placeholder="请选择商家类型" clearable>
								<el-option v-for="item in merchantClassify" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="商家名称" prop="name">
							<el-input
								v-model="model.name"
								type="text"
								placeholder="请输入商家名称"
								maxlength="50"
								show-word-limit
								clearable
								@keyup.enter="handleKeyUp(true)"
							/>
						</el-form-item>

						<el-form-item label="管理员账号" prop="phone">
							<el-input
								v-model="model.phone"
								type="text"
								maxlength="11"
								show-word-limit
								placeholder="请输入管理员账号信息"
								clearable
								@keyup.enter="handleKeyUp(true)"
							/>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商家信息" name="Desc">
						<el-form-item label="商家信息" prop="description">
							<editor v-model:get-html="model.remark" height="500" width="600" />
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
				<div class="mt-5 flex justify-center">
					<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
					<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts" name="tc-business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Business } from './types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import router from '/@/router';
import { merchantDetailApi, merchantAddApi, merchantUpdateApi, channelMerchantListApi, getChannel } from '/@/api/trcomps/merchant';
import { LocationQueryValue, useRoute } from 'vue-router';
import { Session } from '/@/utils/storage';
import { storeToRefs } from 'pinia';
import { useTrcomps } from '/@/stores/trcomps';

let route = useRoute(); // 生成组件唯一id
const emit = defineEmits(['refresh']);
const formRef = ref();
const activeName = ref('Base');
// 渠道列表
const channelTypeList: any = ref([]);
const merchantTypeList: any = ref([]);
const merchantClassify = ref([
	{ name: '单店', id: 1 },
	{ name: '连锁', id: 2 },
]);

const getChannelData = () => {
	getChannel().then((res) => {
		merchantTypeList.value = res.data;
		channelTypeList.value = merchantTypeList.value.map((item: any) => {
			return { value: Number(item.channelId), label: item.channelName, elTagType: '' };
		});
		//  查找子列表
		channelMerchantList.value = merchantTypeList.value.find((item: any) => {
			return item.channelId == model.value.channelId;
		});
		channelMerchantList.value = channelMerchantList.value?.channelMerchantInfos.map((item: any) => {
			return { value: Number(item.id), label: item.name, elTagType: '' };
		});
		console.log(channelMerchantList.value, 'channelMerchantList.value');
	});
};
getChannelData();

const loading = ref(false);
const channelMerchantList = ref<
	Array<{
		[key: string]: string | number | undefined;
	}>
>([]);

const model = ref<Business>({
	rectangleLogo: '',
	name: '',
	categoryId: '',
	channelId: '',
	channelMerchantId: '',
	phone: '',
	handlingFee: 0,
	remark: '',
	merchantType: '',
});

// 商家分类，渠道供应商列表
const stores = useTrcomps();
const { channelList } = storeToRefs(stores);
// 初始化数据
const initData = async () => {
	if (channelList.value && channelList.value.length < 1) {
		await stores.setChannelListy();
		channelList.value = stores.channelList;
	}
};
initData();
//   表单校验规则
const formRules = reactive<FormRules>({
	name: [{ required: true, message: '商家名称不能为空' }],
	categoryId: [{ required: true, message: '商家类型不能为空' }],
	channelId: [{ required: true, message: '供应商渠道不能为空' }],
	channelMerchantId: [{ required: true, message: '渠道商家不能为空' }],
	merchantType: [{ required: true, message: '商家类型不能为空' }],
});

let storageKeyword: string | undefined; // 记录上一次搜索的关键字
// 获取渠道商家列表
const getChannelMerchantsList = async (keyword: string | undefined) => {
	channelMerchantList.value = merchantTypeList.value.find((item: any) => {
		return item.channelId == model.value.channelId;
	});
	channelMerchantList.value = channelMerchantList.value?.channelMerchantInfos.map((item: any) => {
		return { value: Number(item.id), label: item.name, elTagType: '' };
	});
	// if (storageKeyword === keyword || !model.value.channelId) return
	// storageKeyword = keyword;
	// loading.value = true;
	// try {
	// 	const params = {
	// 		keyword,
	// 		channelId: model.value.channelId
	// 	}
	// 	const { data, code, msg } = await channelMerchantListApi(params);
	// 	loading.value = false;
	// 	if (code === 0) {
	// 		channelMerchantList.value = data;
	// 	} else {
	// 		useMessage().error(msg);
	// 	}
	// } catch (err: any) {
	// 	useMessage().error(err.msg);
	// }
};

const getBack = () => {
	router.push('/trcomps/business/index');
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否配置商家`, '商家配置');
			} catch {
				return false;
			}
			try {
				const { code, msg } = model.value.id ? await merchantUpdateApi(model.value) : await merchantAddApi(model.value);
				if (code === 0) {
					useMessage().success(`配置成功`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};
// 输入框回车事件
const handleKeyUp = (enterable: Boolean) => {
	if (!enterable) return;
	onSubmit(formRef.value);
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	Object.keys(model.value).forEach((key) => (model.value[key] = ''));
	getBack();
};
const hasValues = (obj: Business) => {
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && obj[key] !== '') {
			return true;
		}
	}
	return false;
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	const { id } = route.query;
	const isEmptyForm = !hasValues(model.value);
	if (isEmptyForm || id) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		resetForm(formEl);
	} catch {
		return false;
	}
};
const getConfigDetail = (id: LocationQueryValue[] | any) => {
	merchantDetailApi(id).then((res) => {
		model.value = res.data;
		getChannelData();
		setTimeout(() => {
			formRef.value.clearValidate();
		}, 10);
	});
};
onMounted(() => {
	const { id } = route.query;
	const merchantId = id || Session.get('merchantId');
	merchantId && getConfigDetail(merchantId);
});
</script>

<style scoped lang="scss"></style>
