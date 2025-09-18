<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb-5">
				<el-button type="primary" @click="handlerOpenEdit">添加店铺类型 </el-button>
			</div>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column prop="id" label="ID" min-width="60" />
				<el-table-column prop="name" label="店铺类型名称" min-width="180" :show-overflow-tooltip="true" />
				<el-table-column prop="info" label="店铺类型要求" min-width="150" show-overflow-tooltip />
				<el-table-column label="添加时间" min-width="120">
					<template #default="{ row }">
						<span>{{ row.createTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" @click="handlerOpenEdit(row)">编辑</el-button>
						<el-button link type="primary" @click="onDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="30%">
			<el-form :model="form" :rules="rules" ref="ruleFormRef">
				<el-form-item label="店铺类型" label-width="110" prop="name">
					<el-input v-model="form.name" clearable show-word-limit placeholder="请输入店铺类型" />
				</el-form-item>
				<el-form-item label="店铺类型要求" label-width="110" prop="info">
					<el-input v-model="form.info" type="textarea" placeholder="请输入店铺类型要求" :autosize="{ minRows: 3, maxRows: 5 }" />
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetForm(ruleFormRef)">取消</el-button>
					<el-button type="primary" @click="submitForm(ruleFormRef)"> 提交 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { merchantTypeListApi, merchantTypeAddApi, merchantTypeUpdateApi, merchantTypeDeleteApi } from '/@/api/culture/merchant/typeList';
import { ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useMessage } from '/@/hooks/message';

const dialogFormVisible = ref(false);
const dialogTitle = ref('');
const ruleFormRef = ref<any>(null);
const form = ref({
	id: '',
	name: '',
	info: '',
});
const rules = reactive<FormRules<any>>({
	name: [{ required: true, message: '请输入店铺类型', trigger: 'blur' }],
	info: [{ required: true, message: '请输入店铺类型要求', trigger: 'blur' }],
});
// 删除
const onDelete = async (row: any) => {
	try {
		await ElMessageBox.confirm('确定删除当前店铺类型吗？', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
		});
	} catch {
		return;
	}
	try {
		const { code, msg } = await merchantTypeDeleteApi(Number(row.id));
		if (code === 0) {
			useMessage().success('删除成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 编辑-新增
const handlerOpenEdit = (row: any) => {
	Object.assign(form.value, {
		id: '',
		name: '',
		info: '',
	});
	dialogTitle.value = '店铺类型';
	if (row?.id) {
		Object.assign(form.value, row);
	}
	dialogFormVisible.value = true;
};
// 弹窗提交
const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log('submit!', form.value);
			try {
				const { code, msg } = form.value.id ? await merchantTypeUpdateApi(form.value) : await merchantTypeAddApi(form.value);
				if (code === 0) {
					useMessage().success('操作成功');
					dialogFormVisible.value = false;
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (error: any) {
				useMessage().error(error.msg);
			}
		} else {
			console.log('error submit!', fields);
		}
	});
};
// 弹窗取消
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogFormVisible.value = false;
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: merchantTypeListApi,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
