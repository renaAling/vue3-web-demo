<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10 mb20">
				<el-button type="primary" @click="handleEdit()"> 新增标签 </el-button>
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
				<el-table-column prop="name" label="站点主题标签名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="content" label="站点主题内容" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" min-width="60" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
						<el-button link type="danger" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" :title="title" width="30%" :close-on-click-modal="false">
			<el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto">
				<el-form-item label="站点主题标签名称" prop="name">
					<el-input v-model="form.name" maxlength="12" show-word-limit />
				</el-form-item>
				<el-form-item label="站点主题内容" prop="content">
					<el-input v-model="form.content" maxlength="20" :rows="3" type="textarea" show-word-limit />
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
import { useMessageBox, useMessage } from '/@/hooks/message';
// import { useMessage, useMessageBox } from '/@/hooks/message';
import type { FormInstance, FormRules } from 'element-plus';
import {
	getPlatformLabelPage,
	getPlatformLabelAdd,
	getPlatformLabelUpdate,
	getPlatformLabelDel,
	getPlatformLabelDetail,
} from '/@/api/platformEntry/locationInformationLabel';

const ruleFormRef = ref<FormInstance>();
const dialogVisible = ref(false);
const title = ref('');
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getPlatformLabelPage, // H
	descs: [],
});
const form = ref<any>({
	id: '',
	name: '',
	content: '',
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入站点主题标签名称', trigger: 'blur' }],
	content: [{ required: true, message: '请输入站点主题内容', trigger: 'blur' }],
});
const handleEdit = async (row?: any) => {
	Object.assign(form.value, {
		id: '',
		name: '',
		content: '',
	});
	if (row?.id) {
		title.value = '编辑标签';
		try {
			let res = await getPlatformLabelDetail(Number(row.id));
			if (res.code === 0) {
				Object.assign(form.value, res.data);
				dialogVisible.value = true;
			}
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		title.value = '新增标签';
		dialogVisible.value = true;
	}
};

const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(`是否确认删除主题标签${row.name}？`, '删除提示', '确定');
	} catch {
		return;
	}
	try {
		let res = await getPlatformLabelDel(Number(row.id));
		if (res.code === 0) {
			useMessage().success('删除成功');
			getDataList();
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', form.value);
			let res = null;
			try {
				if (form.value.id) {
					res = await getPlatformLabelUpdate(form.value);
				} else {
					res = await getPlatformLabelAdd({
						name: form.value.name,
						content: form.value.content,
					});
				}
				if (res?.code === 0) {
					useMessage().success(`${form.value.id ? '修改' : '新增'}成功`);
					dialogVisible.value = false;
					getDataList();
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
	Object.assign(form.value, {
		id: '',
		name: '',
		content: '',
	});
	dialogVisible.value = false;
};
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style scoped></style>
