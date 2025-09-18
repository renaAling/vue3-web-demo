<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="联名卡机构" prop="orgName">
						<el-input placeholder="请输入机构名称" v-model="state.queryForm.orgName" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="联名卡名称" prop="carName">
						<el-input placeholder="请输入联名卡名称" v-model="state.queryForm.carName" clearable style="width: 230px" maxlength="50" />
					</el-form-item>
					<el-form-item label="合作时间" prop="searchTime">
						<el-date-picker
							v-model="searchTime"
							type="daterange"
							range-separator="-"
							style="width: 400px"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							clearable
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleAddGoverment" icon="plus" type="primary"> 新增机构 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="80" />
				<el-table-column label="机构名称" prop="orgName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="联名卡名称" prop="carName" show-overflow-tooltip> </el-table-column>
				<el-table-column label="合作时间" prop="cooperationDate"></el-table-column>
				<el-table-column label="操作" width="200" align="left">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" link icon="delete" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<el-dialog :title="dialogTitle" ref="myDialog" v-model="visible" width="548px" :close-on-click-modal="false" @close="closeDialog(ruleFormRef)">
			<el-form :model="formData" ref="ruleFormRef" :rules="formDataRules" label-position="right" label-width="auto">
				<el-card>
					<el-form-item label="机构名称" prop="orgName">
						<el-input v-model="formData.orgName" placeholder="请输入机构名称" maxlength="20" show-word-limit></el-input>
					</el-form-item>
					<el-form-item label="联名卡名称" prop="carName">
						<el-input v-model="formData.carName" placeholder="请输入联名卡名称" maxlength="20" show-word-limit></el-input>
					</el-form-item>
					<el-form-item label="合作时间" prop="cooperationStartDate">
						<el-date-picker
							v-model="createTime"
							type="daterange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							clearable
						/>
					</el-form-item>
				</el-card>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="handleCancel(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="handleSave(ruleFormRef)">保存</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="outletList" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { cardOrgList, editCardOrg, addCardOrg, delCardOrg } from '/@/api/goodStore/xianwang';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
import router from '/@/router';
import { useMessage, useMessageBox } from '/@/hooks/message';

interface FormData {
	id?: number;
	orgName: string;
	carName: string;
	cooperationStartDate: string;
	cooperationEndDate: string;
}
// 搜索变量
const queryRef = ref();
const createTime = ref<string[]>([]);
const searchTime = ref<string[]>([]);
const ruleFormRef = ref<FormInstance>();
const formData = reactive<FormData>({
	orgName: '',
	carName: '',
	cooperationStartDate: '',
	cooperationEndDate: '',
});
const dialogTitle = ref('新增机构');
const visible = ref<Boolean>(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: cardOrgList,
	queryForm: {},
	dataList: [],
});

watch(
	() => createTime.value,
	(val) => {
		console.log('val', val);
		if (val) {
			formData.cooperationStartDate = val[0];
			formData.cooperationEndDate = val[1];
		} else {
			formData.cooperationStartDate = '';
			formData.cooperationEndDate = '';
		}
	}
);
watch(
	() => searchTime.value,
	(val) => {
		console.log('val', val);
		if (val) {
			state.queryForm.cooperationStartDate = val[0];
			state.queryForm.cooperationEndDate = val[1];
		} else {
			state.queryForm.cooperationStartDate = '';
			state.queryForm.cooperationEndDate = '';
		}
	}
);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const formDataRules = reactive<FormRules<FormData>>({
	orgName: [{ required: true, message: '请输入机构名称', trigger: ['blur', 'change'] }],
	carName: [{ required: true, message: '请输入联名卡名称', trigger: ['blur', 'change'] }],
	cooperationStartDate: [{ required: true, message: '请选择合作时间', trigger: 'change' }],
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.cooperationStartDate = '';
	state.queryForm.cooperationEndDate = '';
	getDataList();
};
const resetForm = () => {
	ruleFormRef.value?.resetFields();
	formData.orgName = '';
	formData.carName = '';
	formData.cooperationStartDate = '';
	formData.cooperationEndDate = '';
	createTime.value = [];
};
const closeDialog = (formEl: FormInstance | undefined): void => {
	if (!formEl) return;
	// resetQuery();
	visible.value = false;
	resetForm();
};

// 新增机构
const handleAddGoverment = (): void => {
	dialogTitle.value = '新增机构';
	visible.value = true;
};
const handleEdit = (row: any): void => {
	dialogTitle.value = '编辑机构';
	const { id, orgName, carName, cooperationStartDate, cooperationEndDate } = row;
	formData.id = id;
	formData.orgName = orgName;
	formData.carName = carName;
	formData.cooperationStartDate = cooperationStartDate;
	formData.cooperationEndDate = cooperationEndDate;
	createTime.value = [cooperationStartDate, cooperationEndDate];
	visible.value = true;
};
const handleDelete = async (row: any): Promise<void> => {
	useMessageBox()
		.confirm('是否删除该联名卡机构', '删除')
		.then(async () => {
			try {
				const { code, msg } = await delCardOrg(row.id);
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		})
		.catch(() => {});
};
const handleSave = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			const request = formData.id ? editCardOrg : addCardOrg;
			try {
				const { code, msg } = await request(formData);
				if (code === 0) {
					useMessage().success('操作成功');
					getDataList();
					closeDialog(formEl);
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};

const handleCancel = (formEl: FormInstance | undefined) => {
	closeDialog(formEl);
};
</script>
