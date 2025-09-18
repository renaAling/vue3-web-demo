<template>
	<div>
		<el-dialog :title="dialogTitle" v-model="visible" draggable :close-on-click-modal="false" :show-close="false">
			<el-card>
				<el-form @submit.prevent :model="model" v-loading="loading" ref="formRef" label-width="100px" :rules="formRules">
					<div class="title">关联门店</div>
					<el-form-item label="选择商家" prop="merchantCode">
						<el-select v-model="model.merchantCode" placeholder="请选择商家" clearable filterable @change="merchantCodeChange">
							<el-option
								v-for="(item, index) in allMerchantList"
								:key="index"
								:label="item.merchantName"
								:value="item.merchantCode"
								:disabled="item.disabled"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择门店" v-if="model.merchantCode" prop="storeCode">
						<el-select v-model="model.storeCode" placeholder="请选择门店" clearable filterable>
							<el-option v-for="(item, index) in currentStoreList" :key="index" :label="item.storeName" :value="item.storeCode"> </el-option>
						</el-select>
					</el-form-item>
					<div class="title">设备信息</div>
					<el-form-item label="设备品牌">
						<el-input placeholder="请输入设备品牌" v-model="model.brand" clearable></el-input>
					</el-form-item>
					<el-form-item label="设备名称">
						<el-input placeholder="请输入设备名称" v-model="model.name" clearable maxlength="50" />
					</el-form-item>
					<el-form-item label="设备SN码" prop="sn">
						<el-input placeholder="请输入设备SN码" v-model="model.sn" clearable></el-input>
					</el-form-item>
					<el-form-item label="设备秘钥" prop="printerKey">
						<el-input placeholder="请输入设备秘钥" v-model="model.printerKey" clearable></el-input>
					</el-form-item>
					<div class="title">打印设置</div>
					<el-form-item label="打印类型" prop="type">
						<el-radio-group v-model="model.type">
							<el-radio :label="1">小票</el-radio>
							<el-radio :label="2">标签</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="打印份数" prop="num">
						<el-input placeholder="请输入打印份数" type="number" v-model.number="model.num" :disabled="model.type === 2" />
					</el-form-item>
					<el-form-item label="备注">
						<el-input placeholder="请输入备注" v-model="model.remark" type="textarea" clearable maxlength="200" />
					</el-form-item>
				</el-form>
			</el-card>
			<template #footer>
				<el-button type="info" size="default" @click="cancel">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage, useMessageBox } from '/@/hooks/message';
import {
	getMerchantList,
	getStoreListByMerchantCode,
	saveOrUpdateDevice,
	getDeviceDetail,
	getBrandList,
	getDeviceInfo,
	getRestDeviceInfo,
} from '/@/api/goodStore/devices';
import { modelTypes } from './types';
import { fetchMerchantList } from '/@/api/goodStore/staff';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const dialogTitle = ref('新增设备');

const formRef = ref();
const scopeId = ref<string | null>('');
const loading = ref(false);
const initialModel = {
	merchantCode: '',
	storeCode: '',
	brand: '',
	sn: '',
	name: '',
	type: 1,
	num: 1,
	remark: '',
	printerKey: '',
};
const model = ref<modelTypes>({
	...initialModel,
});

interface Merchant {
	merchantName: string;
	merchantCode: string;
	disabled?: boolean;
}
interface Store {
	storeName: string;
	storeCode: string;
}
const allMerchantList = ref<Merchant[]>([]);
const currentStoreList = ref<Store[]>([]);

//   表单校验规则
const formRules = reactive<FormRules>({
	merchantCode: [{ required: true, message: '请选择商家', trigger: ['change', 'blur'] }],
	storeCode: [{ required: true, message: '请选择门店', trigger: ['change', 'blur'] }],
	sn: [{ required: true, message: '请输入设备SN码', trigger: ['change', 'blur'] }],
	printerKey: [{ required: true, message: '请输入设备秘钥', trigger: ['change', 'blur'] }],
	type: [{ required: true, message: '请选择打印类型', trigger: ['change', 'blur'] }],
	num: [{ required: true, message: '请输入打印份数', trigger: ['change', 'blur'] }],
});

// 处理商家选择时才能查询对应门店的逻辑
const merchantCodeChange = (val: string) => {
	model.value.storeCode = '';
	if (val) {
		getStoreListByMerchantCode({
			current: 1,
			size: 99,
			merchantCode: val,
		}).then((res) => {
			if (res.code === 0) {
				currentStoreList.value = res.data.records;
			}
		});
	}
};

// 处理打印份数输入时的数据
watch(
	() => model.value.num,
	(val) => {
		if (val !== null && (val < 1 || val > 9)) {
			model.value.num = null; // 清空无效输入
		} else if (val !== null && val.toString().length > 1) {
			model.value.num = parseInt(val.toString().slice(-1)); // 取最后一位
		}
	}
);

watch(
	() => model.value.type,
	(val) => {
		if (val && val === 2) {
			model.value.num = 1;
		}
	}
);

// 获取全量商家列表
const merchantList = async () => {
	try {
		let res = await getMerchantList();
		if (res.code === 0) {
			allMerchantList.value = res.data;
		}
	} catch (err) {
		console.log('err', err);
	}
};

// 弹窗打开时触发的函数
const openDialog = async (id: string | null) => {
	console.log('id', id);
	await merchantList();
	if (id) {
		scopeId.value = id;
		dialogTitle.value = '编辑设备';
		try {
			const { code, data } = await getDeviceDetail(id);
			if (code === 0) {
				model.value = { ...data };
				// 根据详情接口获取到的商家code处理下架之后的商家回显异常的问题
				fetchMerchantList().then((res) => {
					if (res.code === 0) {
						let disabeledItem = res.data.find((item: any) => item.merchantCode === model.value.merchantCode);
						if (disabeledItem) {
							allMerchantList.value.push({
								merchantName: disabeledItem.merchantName,
								merchantCode: disabeledItem.merchantCode,
								disabled: true,
							});
						}
						// 根据商家code获取对应商家门店列表
						getStoreListByMerchantCode({
							current: 1,
							size: 99,
							merchantCode: model.value.merchantCode,
						}).then((res) => {
							if (res.code === 0) {
								currentStoreList.value = res.data.records;
							}
						});
					}
				});
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = '新增设备';
	}
	visible.value = true;
};

// 提交表单
const onSubmit = async () => {
	const valid = await formRef.value.validate().catch(() => {});
	if (!valid) return false;
	saveOrUpdateDevice(model.value)
		.then((res) => {
			if (res.code === 0) {
				useMessage().success(model.value.printerCode ? '编辑成功' : '新增成功');
				visible.value = false;
				emit('refresh');
				resetForm();
			} else {
				useMessage().error(res.msg);
			}
		})
		.catch((err) => {
			console.log('err', err);
		});
};

// 重置
const resetForm = () => {
	formRef.value.resetFields();
	model.value = { ...initialModel };
	visible.value = false;
};
// 取消
const cancel = async () => {
	if (scopeId.value) return resetForm();
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm();
	console.log('model.value', model.value);
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.title {
	font-weight: 500;
	font-size: 16px;
}
</style>
