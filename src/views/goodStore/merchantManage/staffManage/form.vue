<template>
	<div>
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="60%" :close-on-click-modal="false" :show-close="false">
			<el-form @submit.prevent :model="model" ref="formRef" label-width="100px" :rules="formRules">
				<el-card>
					<el-form-item label="姓名" prop="staffName">
						<el-input v-model="model.staffName" type="text" placeholder="请输入姓名" maxlength="50" show-word-limit clearable />
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input
							v-model="model.mobile"
							type="text"
							placeholder="请输入手机号"
							maxlength="11"
							@input="model.mobile = model.mobile?.replace(/^(0+)|[^\d]+/g, '')"
							show-word-limit
							clearable
							:disabled="scopeId"
						/>
					</el-form-item>
					<el-form-item label="商家" prop="merchantCode">
						<el-select
							v-model="model.merchantCode"
							filterable
							placeholder="请选择商家"
							value-key="merchantCode"
							clearable
							@change="merchantCodeChange"
						>
							<el-option v-for="item in merchantList" :key="item.merchantCode" :label="item.merchantName" :value="item" :disabled="item.disabled">
								<span>{{ item.merchantName }}</span>
								<span style="color: #8492a6; font-size: 14px">（ID:{{ item.merchantCode }}）</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="管理范围" prop="scope">
						<el-radio-group v-model="model.scope">
							<el-radio :label="1" :disabled="isDisabledScope">总部</el-radio>
							<el-radio :label="2" :disabled="isDisabledScope">门店</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="!isDisabledScope && model.scope === 2">
						<div class="scope-list">
							<div class="add-btn" @click="openMerchantDialog">
								<el-icon>
									<Plus />
								</el-icon>
								<div>选择门店</div>
							</div>
							<div class="list" v-for="(item, index) in storeList" :key="item.storeCode">
								<span>{{ item.storeName }}</span>
								<el-icon @click="handleDelete(index)">
									<Close />
								</el-icon>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="选择岗位" prop="roleId">
						<el-select v-model="model.roleId" placeholder="请选择选择岗位" clearable>
							<el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
						</el-select>
					</el-form-item>
				</el-card>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)" :loading="loading">取消</el-button>
				<el-button type="primary" size="default" @click="onSubmit(formRef)" :loading="loading">提交</el-button>
			</template>

			<el-dialog title="选择门店" v-model="storeListVisible" :close-on-click-modal="false" width="40%">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="门店名称" prop="storeName" style="width: 260px">
						<el-input placeholder="请输入门店名称" v-model="state.queryForm.storeName" clearable maxlength="50" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
				<el-table
					border
					:data="state.dataList"
					v-loading="state.loading"
					row-key="storeCode"
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="40" align="center" />
					<el-table-column label="门店名称" prop="storeName" />
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />

				<template #footer>
					<div class="dialog-footer">
						<el-button @click="storeListVisible = false">取消</el-button>
						<el-button type="primary" @click="handleSaveSelection">保存 </el-button>
					</div>
				</template>
			</el-dialog>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Merchant } from './types';
import { fetchMerchantList, fetchRoleList, getStoreList, saveOrUpdateStaffInfo, staffDetail } from '/@/api/goodStore/staff';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const storeListVisible = ref(false);
const myDialog = ref(null);
const dialogTitle = ref('新增员工信息');
const formRef = ref();
const loading = ref(false);
const isDisabledScope = ref(false);

// 商家列表
const merchantList = ref([]) as any;
// 岗位列表
const roleList = ref([]) as any;
// 从门店弹窗里面选择出来的去重后的数据列表
const storeList = ref([]) as any;
const queryRef = ref();

const scopeId = ref<string | null>('');
const model = ref<Merchant>({
	staffCode: '',
	staffName: '',
	mobile: '',
	merchantCode: null,
	scope: 1,
	roleId: '',
	storeCodes: [],
});
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getStoreList,
	queryForm: {},
	dataList: [],
	createdIsNeed: false,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

//   表单校验规则
const formRules = reactive<FormRules>({
	staffName: [{ required: true, message: '请输入姓名' }],
	mobile: [{ required: true, message: '请输入手机号' }],
	merchantCode: [{ required: true, message: '请选择商家' }],
	scope: [{ required: true, message: '请选择管理范围' }],
	roleId: [{ required: true, message: '请选择岗位' }],
});

// 获取商家列表
const getMerchantList = async () => {
	try {
		let res = await fetchMerchantList();
		if (res.code === 0) {
			merchantList.value = res.data;
		}
	} catch (err) {
		console.log('err', err);
	}
};

// 获取岗位列表
const getRoleList = async () => {
	try {
		let res = await fetchRoleList();
		if (res.code === 0) {
			roleList.value = res.data;
		}
	} catch (err) {
		console.log('err', err);
	}
};

const openDialog = async (id: string | null) => {
	await getMerchantList();
	await getRoleList();
	scopeId.value = id;
	if (id) {
		dialogTitle.value = '编辑员工信息';
		try {
			const { code, data } = await staffDetail(id);
			if (code === 0) {
				model.value.staffCode = data.staffCode;
				model.value.staffName = data.staffName;
				model.value.mobile = data.mobile;
				model.value.merchantCode = {
					merchantCode: data.merchantCode,
					merchantName: data.merchantName,
					type: data.type,
				};
				model.value.scope = data.scope;
				model.value.roleId = data.roleId;
				storeList.value = data.storeInfos;

				const arr = merchantList.value.filter((item: any) => item.merchantCode === data.merchantCode);
				console.log('arr', arr);
				if (arr.length === 0) {
					merchantList.value.push({
						merchantName: data.merchantName,
						merchantCode: data.merchantCode,
						type: data.type,
						disabled: true,
					});
				}

				console.log('model.value', model.value);
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		dialogTitle.value = '新增员工信息';
	}
	visible.value = true;
};

const closeMyDialog = () => {
	visible.value = false;
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			let params = {
				...model.value,
				staffCode: model.value.staffCode ? model.value.staffCode : null,
				storeCodes: model.value.scope === 2 ? storeList.value.map((item: any) => item.storeCode) : [],
				merchantCode: model.value.merchantCode ? model.value.merchantCode.merchantCode : null,
			};
			loading.value = true;
			try {
				const { code, msg } = await saveOrUpdateStaffInfo(params);
				loading.value = false;
				if (code === 0) {
					useMessage().success(`${scopeId.value ? '修改成功' : '新建成功'}`);
					resetForm(formEl);
					emit('refresh');
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				loading.value = false;
				useMessage().error(err.msg);
			}
		} else {
			return false;
		}
	});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	Object.keys(model.value).forEach((key) => ((model as any).value[key] = ''));
	closeMyDialog();
};

// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	try {
		await useMessageBox().confirm(`该操作会关闭弹窗且将丢失编辑内容，是否确认取消`, '取消');
		resetForm(formEl);
	} catch {}
};
let selectionList: any = [];

const openMerchantDialog = async () => {
	state.queryForm.merchantCode = model.value.merchantCode.merchantCode;
	storeListVisible.value = true;
	selectionList = [];
	storeList.value = [];
	await getDataList();
};
// 删除选中的门店项
const handleDelete = (index: number) => {
	storeList.value.splice(index, 1);
};

// 多选事件
const handleSelectionChange = (selection: any) => {
	if (selection.length > 0) {
		selectionList = selectionList.concat(selection);
	}
};
const merchantCodeChange = (e: any) => {
	// 获取商户类型是否是单店，是则不展示管理范围表单项
	if (e.type === 1) {
		isDisabledScope.value = true;
		model.value.scope = 2;
	} else {
		isDisabledScope.value = false;
		model.value.scope = 1;
	}
	storeList.value = [];
};
// 对重复勾选过的门店通过storeCode参数去重
const handleSaveSelection = () => {
	storeList.value = deduplicateByProperty(selectionList, 'storeCode');
	storeListVisible.value = false;
};

// 去重函数
function deduplicateByProperty(array: any, property: string) {
	const seen = new Map();
	return array.filter((item: any) => {
		if (!seen.has(item[property])) {
			seen.set(item[property], true);
			return true;
		}
		return false;
	});
}

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.scope-list {
	display: flex;
	flex-direction: column;
	width: 314px;
	flex-wrap: nowrap;

	border: 2px solid #efefef;
	padding: 10px;

	.add-btn {
		display: flex;
		align-items: center;
		color: #165dff;
		cursor: pointer;
	}

	.list {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.el-icon {
			cursor: pointer;
		}

		&:hover {
			color: #165dff;
		}
	}
}
</style>
