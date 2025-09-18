<template>
	<div>
		<el-form :model="formData" ref="ruleFormRef" label-width="120px">
			<el-form-item label="商户LOGO:">
				<UploadImg v-model:image-url="formData.logoUrl" />
			</el-form-item>
			<el-form-item label="商家信息">
				<editor v-model:get-html="formData.information" height="500" width="100%" />
			</el-form-item>
			<el-form-item label="关联商家:">
				<el-select v-model="formData.linkStoreCode" filterable placeholder="请选择关联站点" @change="handleChange">
					<el-option v-for="item in areaStoreList" :key="item.storeCode" :label="item.storeName" :value="item.storeCode" />
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ElForm } from 'element-plus';
import type { FormInstance } from 'element-plus';
import UploadImg from '/@/components/Upload/Image.vue';
import { getAreaStoreListApi } from '/@/api/note/noteInfo';

const ruleFormRef = ref<FormInstance>();
const formData = ref<any>({
	logoUrl: null,
	information: null,
	linkMerchantCode: null,
	linkStoreCode: null,
	linkStoreId: null,
  original: null,
});
const handleChange = (val: any) => {
	const linkMerchant = areaStoreList.value.find((station: any) => station.storeCode === val);
	formData.value.linkStoreCode = linkMerchant.storeCode;
	formData.value.linkMerchantCode = linkMerchant.merchantCode;
	formData.value.original = linkMerchant.original;
};
const openDialog = async (row?: any) => {
	await getAreaStoreList();
  formData.value = { ...row };
};
const props = defineProps<{
	active: number;
	visible: boolean;
}>();

const areaStoreList = ref();
const getAreaStoreList = async () => {
	const { data } = await getAreaStoreListApi();
	areaStoreList.value = data;
};

const returnForm = () => {
	return formData.value;
};

watch(
	() => props.active,
	(newVal) => {
		if (newVal === 2 && props.visible) {
			// openDialog(); // 自动初始化
		}
	},
	{ immediate: true }
);
// 暴露变量
defineExpose({
	openDialog,
  returnForm,
});
</script>

<style scoped lang="scss"></style>
