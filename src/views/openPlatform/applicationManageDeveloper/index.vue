<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="应用ID" prop="appId">
						<el-input placeholder="请输入应用ID" v-model="state.queryForm.appId" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="应用名称" prop="appName">
						<el-input placeholder="请输入应用名称" v-model="state.queryForm.appName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="所属开发者" prop="phone" v-if="!route.query.userId">
						<el-input placeholder="请输入所属开发者手机号" v-model="state.queryForm.phone" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary"> 查询 </el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleAdd" type="primary"> 新建应用 </el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="ID" prop="appId" show-overflow-tooltip />
				<el-table-column label="应用名称" prop="appName" show-overflow-tooltip />
				<el-table-column label="授权接口" prop="interfaceCounts" show-overflow-tooltip width="200" />
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button class="ml-1" text type="primary" @click="handleCommand('detail', row)">详情</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('edit', row)">编辑</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('delete', row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 新增应用弹窗 -->
		<el-dialog v-model="dialogVisible" title="创建应用" width="410" align-center>
			<el-form ref="formRef" :model="model" :rules="formRules" label-width="auto">
				<el-form-item label="应用名称：" prop="appName" class="custom-width">
					<el-input v-model="model.appName" clearable maxlength="30" show-word-limit placeholder="请输入应用名称"></el-input>
				</el-form-item>
				<el-form-item label="应用说明：" prop="remark" class="custom-width">
					<el-input v-model="model.remark" maxlength="300" show-word-limit type="textarea" placeholder="请输入应用说明"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="info" size="default" @click="cancel(formRef)">取消</el-button>
				<el-button type="primary" size="default" v-loading="loading" @click="onSubmit(formRef)">提交</el-button>
			</template>
		</el-dialog>

		<!-- 查看公钥弹窗 -->
		<el-dialog v-model="publicKeyDialogVisible" title="查看公钥" width="410" align-center>
			<span>{{ model.publicKey }}</span>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="handleResetPublicKey">重置</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { getDeveloperApplicationList, addApplication, updateApplication, deleteApplication } from '/@/api/openPlatform/application';
import { useMessage } from '/@/hooks/message';

const router = useRouter();
const route = useRoute();
// 搜索变量
const queryRef = ref();
const dialogVisible = ref(false);
const publicKeyDialogVisible = ref(false);
const formRef = ref();
const loading = ref(false);
const mainId = ref('');

//   表单校验规则
const formRules = reactive<FormRules>({
	appName: [{ required: true, message: '请输入应用名称', trigger: ['change', 'blur'] }],
	remark: [{ required: true, message: '请输入应用说明', trigger: ['change', 'blur'] }],
});

const model = ref({
	appName: '',
	remark: '',
	id: '',
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		userId: route.query.userId,
	},
	pageList: getDeveloperApplicationList,
	dataList: [],
});

const handleAdd = () => {
	dialogVisible.value = true;
};
/**
 * 处理列表项的操作
 */
const handleCommand = (type: string, row: any) => {
	switch (type) {
		case 'detail':
			router.push({
				path: '/openPlatform/applicationManageDeveloper/detail',
				query: {
					id: row.id,
				},
			});
			break;
		case 'edit':
			dialogVisible.value = true;
			model.value.appName = row.appName;
			model.value.remark = row.remark;
			model.value.id = row.id;
			mainId.value = row.id;
			break;
		case 'delete':
			ElMessageBox.confirm(`是否删除应用${row.appName}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				deleteApplication(row.id).then((res: any) => {
					if (res.code === 0) {
						useMessage().success('删除成功');
						getDataList();
					}
				});
			});
			break;
	}
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const onSubmit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (valid) {
			loading.value = true;
			if (mainId.value) {
				updateApplication(model.value).then((res) => {
					loading.value = false;
					if (res.code === 0) {
						dialogVisible.value = false;
						useMessage().success('编辑成功');
						resetForm(formEl);
						getDataList();
					}
				});
			} else {
				addApplication(model.value).then((res) => {
					loading.value = false;
					if (res.code === 0) {
						dialogVisible.value = false;
						useMessage().success('创建成功');
						resetForm(formEl);
						getDataList();
					}
				});
			}
		} else {
			return false;
		}
	});
};

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
	formEl?.resetFields();
	Object.keys(model.value).forEach((key) => (model.value[key] = ''));
	dialogVisible.value = false;
};
// 取消
const cancel = async (formEl: FormInstance | undefined) => {
	resetForm(formEl);
	dialogVisible.value = false;
};
</script>
