<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" draggable width="40%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-form-item label="请输入名称" prop="name">
					<el-input v-model="model.name" placeholder="请输入名称" maxlength="200" clearable />
				</el-form-item>
				<el-form-item label="图片" prop="imageUrl">
					<upload-img v-model:image-url="model.imageUrl" />
				</el-form-item>
				<el-form-item label="可见对象" prop="identityCodes">
					<el-checkbox-group v-model="model.identityCodes">
						<el-checkbox :label="item.code" v-for="(item, index) in userRoleList" :key="index">{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="跳转类型" prop="jumpType">
					<el-select v-model="model.jumpType" style="width: 100%" @change="handleChangeJumpType">
						<el-option v-for="(item, index) in jumpTypes" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="跳转目标" prop="jumpUrl" v-if="model.jumpType != '1'">
					<el-input
						v-if="model.jumpType != '5' && model.jumpType != '6'"
						v-model="model.jumpUrl"
						placeholder="请输入链接"
						maxlength="200"
						clearable
					/>
					<el-select
						v-else-if="model.jumpType == '5'"
						v-model="model.jumpNewUrl"
						filterable
						style="width: 600px"
						placeholder="请输入关键字查询搜索"
						clearable
					>
						<el-option v-for="item in productList" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
					<el-select
						v-else-if="model.jumpType == '6'"
						v-model="model.jumpNewUrl"
						filterable
						style="width: 600px"
						placeholder="请输入关键字查询搜索"
						clearable
					>
						<el-option v-for="item in storeList" :key="item.id" :label="item.label" :value="item.id" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="business-config">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { FirstPageTypes, Product, Store } from './types';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { configAdd, configDetail, configUpdate, getStoreNameInfo, getProductList } from '/@/api/operationConfig/firstPage';
import { jumpTypeMap } from './constant';

const emit = defineEmits(['refresh']);
import { userVisiableRole } from '/@/stores/userVisiableRole';
import pinia from '/@/stores';
const userRoleList = ref<any[]>([]);

const dialogTitle = ref('新建配置');
const visible = ref(false);
const myDialog = ref(null);
const formRef = ref();
const scopeId = ref<string | null>('');
const locationType = ref('');
const loading = ref(false);
const storeList = ref<Store[]>([]);
const productList = ref<Product[]>([]);

const jumpTypes = [
	{
		label: '不跳转',
		value: 1,
	},
	{
		label: '跳转H5',
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
	{ label: '文创商城', value: 5 },
	{ label: '好店系统', value: 6 },
	{ label: '跳转微信公众号', value: 7 },
];
const model = ref<FirstPageTypes>({
	name: '',
	imageUrl: '',
	identityCodes: [],
	jumpType: '',
	jumpAddType: '',
	jumpUrl: '',
	jumpNewUrl: '',
});
const formRules = reactive<FormRules>({
	name: [{ required: true, message: '名称不能为空' }],
	imageUrl: [{ required: true, message: '图片不能为空' }],
	jumpType: [{ required: true, message: '请选择跳转类型' }],
	identityCodes: [{ required: true, message: '请选择可见对象' }],
});
const openDialog = async (preTitle: string, activeName: string, id: string | null) => {
	scopeId.value = id;
	locationType.value = activeName;
	// 获取用户可见角色列表
	const roleList = userVisiableRole().userRoleList;
	if (roleList.length > 0) {
		userRoleList.value = roleList;
	} else {
		await userVisiableRole(pinia).setUserRoleInfos();
		const roleList = userVisiableRole().userRoleList;
		if (roleList.length > 0) {
			userRoleList.value = roleList;
		}
	}
	if (id) {
		dialogTitle.value = preTitle + '编辑配置';
		try {
			const { code, data } = await configDetail({ id });
			if (code === 0) {
				model.value = data;
				model.value.jumpType = jumpTypeMap[data.jumpAddType] || data.jumpType;
				model.value.identityCodes = data.visibleIdentity.map((item: any) => item.identityCode);
				if (model.value.jumpAddType == '5') {
					getProductList().then((res) => {
						if (res.code == 0) {
							const spuCode = getQueryParameter('spuCode', model.value.jumpUrl);
							productList.value = res.data.map((item: any) => {
								return {
									label: item.spuName,
									value: item.spuCode,
								};
							});
							res.data.forEach((item: any) => {
								if (item.spuCode === spuCode) {
									model.value.jumpNewUrl = item.spuCode;
								}
							});
						}
					});
				} else if (model.value.jumpAddType == '6') {
					getStoreNameInfo().then((res) => {
						if (res.code == 0) {
							const id = getQueryParameter('id', model.value.jumpUrl);
							storeList.value = res.data.map((item: any) => {
								return {
									label: item.storeName,
									value: item.storeCode,
									id: item.id,
								};
							});
							res.data.forEach((item: any) => {
								if (item.id === id) {
									model.value.jumpNewUrl = item.id;
								}
							});
						}
					});
				}
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = preTitle + '新建配置';
	}
	visible.value = true;
};

function getQueryParameter(paramName: any, url: string) {
	const index = url?.indexOf('?') + 1;
	const queryString = url?.slice(index);
	const params = new URLSearchParams(queryString);
	return params.get(paramName);
}

const handleChangeJumpType = (val: any) => {
	if (val == 5) {
		getProductList()
			.then((res) => {
				if (res.code == 0) {
					productList.value = res.data?.map((item: any) => {
						return {
							label: item.spuName,
							value: item.spuCode,
						};
					});
				}
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	} else if (val == 6) {
		getStoreNameInfo()
			.then((res) => {
				if (res.code == 0) {
					storeList.value = res.data?.map((item: any) => {
						return {
							label: item.storeName,
							value: item.storeCode,
							id: item.id,
						};
					});
				}
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	}
	model.value.jumpUrl = '';
	model.value.jumpNewUrl = '';
};

const closeMyDialog = () => {
	visible.value = false;
};
const onSubmit = (formEl: FormInstance | undefined) => {
	loading.value = true;
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			try {
				await useMessageBox().confirm(`是否${scopeId.value ? '修改' : '新建'}配置`, `${scopeId.value ? '修改' : '新建'}配置`);
			} catch {
				return false;
			}
			try {
				const request = scopeId.value ? configUpdate : configAdd;
				const { jumpType, jumpNewUrl, jumpUrl } = model.value;
				const params = {
					...model.value,
					locationType: locationType.value,
					jumpType: jumpType == '5' || jumpType == '6' ? '3' : jumpType,
					jumpAddType: jumpType,
					jumpUrl:
						jumpType == '5'
							? `/pages_main/pages/product/detail?spuCode=${jumpNewUrl}`
							: jumpType == '6'
							? `/pages_metro_mall/pages/detail/index?id=${jumpNewUrl}`
							: jumpUrl,
				};
				const { code, msg } = await request(params);
				loading.value = false;
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改' : '新建'}成功`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
				loading.value = false;
			}
		} else {
			loading.value = false;
			return false;
		}
	});
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	model.value = {
		name: '',
		imageUrl: '',
		identityCodes: [],
		jumpType: '',
		jumpUrl: '',
		jumpNewUrl: '',
	};
	closeMyDialog();
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	if (scopeId.value) return resetForm(formEl);
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
	} catch {
		return false;
	}
	resetForm(formEl);
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
