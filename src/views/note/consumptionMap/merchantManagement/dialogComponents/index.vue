<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="60%" :before-close="resetForm" destroy-on-close>
			<el-steps class="my-4" :active="active" align-center>
				<el-step title="商户信息" />
				<el-step title="关联站点" />
				<el-step title="商户配置" />
			</el-steps>
			<div v-show="active === 0">
				<ShopInfo ref="shopInfoRef" :active="active" :visible="visible"></ShopInfo>
			</div>
			<div v-show="active === 1">
				<Sites ref="sitesRef" :active="active" :visible="visible"></Sites>
			</div>
			<div v-show="active === 2">
				<Configuration ref="configurationRef" :active="active" :visible="visible"></Configuration>
			</div>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="resetForm">取消</el-button>
					<el-button type="primary" @click="handleUp" v-if="active !== 0">上一步</el-button>
					<el-button type="primary" @click="handleNext" v-if="active !== 2">下一步</el-button>
					<el-button type="primary" @click="submitForm" v-if="active === 2">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="addOrEdit-group">
import { ElForm } from 'element-plus';
import { storeAddApi, storeUpdateApi, storeDetailApi } from '/@/api/note/noteInfo';
import { useMessage } from '/@/hooks/message';

// 引入组件
const ShopInfo = defineAsyncComponent(() => import('./shopInfo/index.vue'));
const Sites = defineAsyncComponent(() => import('./sites/index.vue'));
const Configuration = defineAsyncComponent(() => import('./configuration/index.vue'));
// ref
const shopInfoRef = ref();
const sitesRef = ref();
const configurationRef = ref();
// 数据
const active = ref<number>(0);
const visible = ref(false);
const myDialog = ref<InstanceType<typeof ElForm> | null>(null);
const dialogTitle = ref('商户信息维护');
// const formData = reactive({
// 	name: '账单',
// });
// 使用 provide 提供共享值
// provide('formDataBus', formData);
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const openDialog = (row?: any) => {
	active.value = 0;
	if (row?.ipoCode) {
		dialogTitle.value = '编辑';
		getStoreDetail(row);
	} else {
		dialogTitle.value = '新增';
	}
	visible.value = true;
};

const formData = ref();
const getStoreDetail = async (row: any) => {
	const res = await storeDetailApi(row.ipoCode);
	if (res?.ok) {
		formData.value = res.data;
		shopInfoRef.value.openDialog(res.data);
		// sitesRef.value.openDialog(res.data);
		// configurationRef.value.openDialog(res.data);
	}
};

watch(
	() => active.value,
	(newVal) => {
		if (newVal) {
			if (newVal === 0) {
				shopInfoRef.value.openDialog(formData.value);
			}
			if (newVal === 1) {
				sitesRef.value.openDialog(formData.value);
			}
			if (newVal === 2) {
				configurationRef.value.openDialog(formData.value);
			}
		}
	},
	{ immediate: true }
);

// 上一步
const handleUp = () => {
	active.value -= 1;
};
// 下一步
const handleNext = async () => {
	const formRefs = [shopInfoRef, sitesRef, configurationRef];
	const currentRef = formRefs[active.value];
	if (currentRef?.value?.submitForm) {
		const result = await currentRef.value.submitForm();
		if (result) {
			active.value += 1;
		}
	}
};
const submitForm = async () => {
	let pageA = shopInfoRef.value.returnForm();
	let pageB = sitesRef.value.returnForm();
	let pageC = configurationRef.value.returnForm();
	const params = {
		...pageA,
		...pageB,
		...pageC,
	};
	try {
		const res = params.ipoCode ? await storeUpdateApi(params) : await storeAddApi(params);
		if (res?.ok) {
			useMessage().success(res?.msg || '操作成功');
			emit('refresh');
			visible.value = false;
		} else {
			useMessage().error(res?.msg);
		}
	} catch (error) {
		console.log(error);
	}
};
const resetForm = () => {
	visible.value = false;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
:deep(.el-step__icon-inner) {
	font-size: 20px !important;
}
</style>
