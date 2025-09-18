<template>
	<el-dialog
		:model-value="modelValue"
		:title="type === 'add' ? '新增用户分组' : '编辑用户分组'"
		destroy-on-close
		align-center
		class="common-dialog"
		@close="closeDialog"
	>
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
			<el-form-item label="分组名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入分组名称" />
			</el-form-item>
			<el-form-item label="分组说明" prop="description">
				<el-input type="textarea" v-model="formData.description" placeholder="请输入分组说明" />
			</el-form-item>
			<!-- <el-form-item label="分组维度" prop="groupType">
				<el-radio-group v-model="formData.groupType">
					<el-radio :value="1">消费频次</el-radio>
					<el-radio :value="2">消费均价</el-radio>
					<el-radio :value="3">年龄范围</el-radio>
					<el-radio :value="4">用户手机号所在地</el-radio>
				</el-radio-group>
			</el-form-item> -->
			<el-form-item label="消费频次" prop="consumptionFrequency">
				<el-input-number v-model="formData.consumptionFrequency" placeholder="请输入自然数" :min="0" :max="9999" controls-position="right">
					<template #suffix>次/月</template>
				</el-input-number>
			</el-form-item>
			<el-form-item label="消费均价" prop="averageConsumptionMin">
				<div class="flex w-full">
					<el-input-number v-model="formData.averageConsumptionMin" placeholder="请输入自然数" :min="0" controls-position="right">
						<template #suffix>元</template>
					</el-input-number>
					<span class="mx-[10px]">至</span>
					<el-input-number v-model="formData.averageConsumptionMax" placeholder="请输入自然数" :min="0" controls-position="right">
						<template #suffix>元</template>
					</el-input-number>
				</div>
			</el-form-item>
			<el-form-item label="年龄范围" prop="ageMin">
				<div class="flex w-full">
					<el-input-number v-model="formData.ageMin" placeholder="请输入自然数" :min="0" :max="200" controls-position="right">
						<template #suffix>岁</template>
					</el-input-number>
					<span class="mx-[10px]">至</span>
					<el-input-number v-model="formData.ageMax" placeholder="请输入自然数" :min="0" :max="200" controls-position="right">
						<template #suffix>岁</template>
					</el-input-number>
				</div>
			</el-form-item>
			<el-form-item label="用户手机号所在地" prop="userGroupAddressList">
				<div class="flex w-full mb-[10px]" v-for="(item, i) of formData.userGroupAddressList" :key="i">
					<el-cascader
						v-model="formData.userGroupAddressList[i].selectedPath"
						:props="{
							value: 'regionId',
							label: 'regionName',
							children: 'child',
							emitPath: true,
						}"
						:options="cityList"
						placeholder="请选择省市区"
						ref="cascader"
						@change="handleCascaderChange(i)"
					/>
					<!-- v-if="formData.userGroupAddressList.length > 1" -->
					<el-button type="text" class="ml-[10px]" @click="handleDelArea(i)">删除</el-button>
				</div>
				<el-button type="text" @click="handleAddArea">新增地域</el-button>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeDialog">取消</el-button>
				<el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { addUserGroup, editUserGroup } from '/@/api/culture/userManage';
import { cityListTree } from '/@/api/culture/merchant/logistics';

const props = defineProps<{
	modelValue: boolean;
	row?: any;
	type: string;
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const formData = ref({
	name: '',
	description: '',
	consumptionFrequency: null,
	averageConsumptionMin: null,
	averageConsumptionMax: null,
	ageMin: null,
	ageMax: null,
	// userGroupAddressList: [
	//   {
	//     selectedPath: [], // 用于 el-cascader 绑定的路径数组（如 ["1", "11", "111"]）
	//     province: "",     // 提交给后端的省 ID
	//     city: "",         // 提交给后端的市 ID
	//     district: "",     // 提交给后端的区 ID
	//   },
	// ],
	userGroupAddressList: [] as any,
});

const formRules = reactive({
	name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
	description: [{ required: true, message: '请输入分组说明', trigger: 'blur' }],
});

const emits = defineEmits<{
	(event: 'update:modelValue', val: boolean): void;
	(event: 'ok', params?: any): void;
}>();

const handleAddArea = () => {
	formData.value.userGroupAddressList.push({
		selectedPath: [],
		province: '',
		city: '',
		district: '',
	});
};
const handleDelArea = (i: number) => {
	formData.value.userGroupAddressList.splice(i, 1);
};

const handleCascaderChange = (index: number) => {
	const selectedPath = formData.value.userGroupAddressList[index].selectedPath;
	if (selectedPath.length === 3) {
		// 更新省市区 ID
		formData.value.userGroupAddressList[index] = {
			...formData.value.userGroupAddressList[index],
			province: selectedPath[0],
			city: selectedPath[1],
			district: selectedPath[2],
		};
	}
};
// 提交数据前的转换（移除 selectedPath，只保留省市区）
const getAddressData = () => {
	return formData.value.userGroupAddressList.map((item: any) => ({
		province: item.province,
		city: item.city,
		district: item.district,
	}));
};

const handleSubmit = () => {
	formRef?.value?.validate(async (valid: any) => {
		if (!valid) return;
		try {
			const params = { ...formData.value, userGroupAddressList: getAddressData() };
			loading.value = true;
			const res = props.type === 'edit' ? await editUserGroup(params) : await addUserGroup(params);
			if (res?.ok) {
				loading.value = false;
				useMessage().success('操作成功');
				closeDialog();
				emits('ok', formData);
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

const closeDialog = () => {
	emits('update:modelValue', false);
};

const cityList = ref();
const getCityList = async () => {
	const res = await cityListTree();
	if (res?.ok) {
		cityList.value = res.data;
	} else {
		cityList.value = [];
		useMessage().error(res?.msg || '获取城市列表失败');
	}
};

watch(
	() => props.modelValue,
	async (newUid) => {
		if (!newUid) return;

		loading.value = true;
		try {
			// 初始化表单数据
			formData.value = {
				...props.row,
				userGroupAddressList: [],
			};

			// 获取城市列表
			await getCityList();

			// 安全转换地址数据为数字类型
			if (props.row?.userGroupAddressList?.length) {
				formData.value.userGroupAddressList = props.row.userGroupAddressList
					.filter((item: any) => item.province && item.city && item.district)
					.map((item: any) => {
						// 确保每个ID都是数字类型
						const province = Number(item.province);
						const city = Number(item.city);
						const district = Number(item.district);

						// 验证转换是否有效
						if (isNaN(province)) throw new Error('无效的省份ID格式');
						if (isNaN(city)) throw new Error('无效的城市ID格式');
						if (isNaN(district)) throw new Error('无效的区县ID格式');

						return {
							selectedPath: [province, city, district],
							province,
							city,
							district,
						};
					});
			}
			console.log('处理后的表单数据:', formData.value);
		} catch (error) {
			console.error('初始化表单数据出错:', error);
		} finally {
			loading.value = false;
		}
	},
	{
		immediate: true,
		deep: true,
	}
);
</script>
