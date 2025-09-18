<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10 mb20">
				<el-button type="primary" @click="handleEdit()"> 新增 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" show-overflow-tooltip width="60"></el-table-column>
				<el-table-column prop="name" label="数字化系统名称" show-overflow-tooltip></el-table-column>
				<el-table-column label="状态" min-width="60">
					<template #default="{ row }">
						<span v-if="!row.status">已断开</span>
						<span v-if="row.status">已对接</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="60" fixed="right">
					<template #default="{ row }">
						<el-switch v-model="row.status" :before-change="() => beforeChangeStatus(row)" :active-value="true" :inactive-value="false"></el-switch>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" :title="title" width="30%" :close-on-click-modal="false">
			<el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="数字化系统名称" prop="name">
					<el-input v-model="form.name" maxlength="12" show-word-limit />
				</el-form-item>
				<el-form-item label="是否允许对接" prop="status">
					<el-switch v-model="form.status" :active-value="true" :inactive-value="false" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
// import { useMessage, useMessageBox } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import { getPlatformDigitalSystemPage, getPlatformDigitalSystemUpdate, getPlatformDigitalSystemAdd } from '/@/api/platformEntry/digitalManagement';

const ruleFormRef = ref<FormInstance>();
const dialogVisible = ref(false);
const title = ref('');
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getPlatformDigitalSystemPage, // H
	descs: [],
});
const form = ref<any>({
	id: '',
	name: '',
	status: true,
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入数字化系统名称', trigger: ['blur', 'change'] }],
});
const handleEdit = (row?: any) => {
	Object.assign(form.value, {
		id: '',
		name: '',
		status: true,
	});
	if (row?.id) {
		title.value = '编辑';
		form.value.id = Number(row.id);
	} else {
		title.value = '新增';
	}
	dialogVisible.value = true;
};

const beforeChangeStatus = async (row: any) => {
	const msg = row.status ? '是否确认断开对接?' : '是否确认打开对接?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		const params = {
			id: Number(row.id),
			status: !row.status,
		};
		let res = await getPlatformDigitalSystemUpdate(params);
		if (res.code != 0) {
			return useMessage().error(res.msg);
		}
		getDataList();
		useMessage().success('操作成功');
		// return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!!!!!!!!!', form.value);
			try {
				let res = await getPlatformDigitalSystemAdd(form.value);
				if (res.code === 0) {
					useMessage().success('新增成功');
					dialogVisible.value = false;
					getDataList();
				} else {
					useMessage().error(res.msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogVisible.value = false;
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style scoped></style>
