<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="关键字" prop="keywords">
						<el-input
							v-model="state.queryForm.keywords"
							placeholder="请输入关键字"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary">查询</el-button>
						<el-button @click="handleReset">重置</el-button>
						<el-button @click="handleAdd" type="primary">新增</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				v-loading="state.loading"
				:data="state.dataList"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column label="物流公司名称" min-width="150" prop="name" />
				<el-table-column min-width="200" label="编码" prop="code" />
				<el-table-column min-width="100" label="排序" prop="sort" sortable />
				<el-table-column label="是否显示" min-width="100">
					<template #default="scope">
						<el-switch
							v-model="scope.row.isShow"
							:active-value="true"
							:inactive-value="false"
							active-text="开启"
							inactive-text="关闭"
							@change="handleStatusChange(scope.row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="address" fixed="right" width="170" label="操作">
					<template #default="scope">
						<el-button type="primary" link @click="bindEdit(scope.row)">编辑</el-button>
						<el-button type="primary" link @click="bindDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 新增 -->
		<el-dialog title="新增物流公司" v-model="dialogVisibleAdd" width="600px" :show-close="false" ref="dialogVisibleRef">
			<el-form :model="formData" :rules="rules" ref="formDataRef" label-width="120px">
				<el-form-item label="物流公司名称" prop="name">
					<el-input v-model="formData.name" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="编码" prop="code">
					<el-input v-model="formData.code" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input-number v-model="formData.sort" :min="1" :max="10" />
				</el-form-item>
				<el-form-item label="是否显示" prop="isShow">
					<el-switch v-model="formData.isShow" inline-prompt active-text="是" inactive-text="否" :active-value="true" :inactive-value="false" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="handleClose(formDataRef)">取消</el-button>
				<el-button type="primary" @click="submitAdd(formDataRef)">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	expressAllApi,
	expressList,
	expressUpdate,
	expressAddApi,
	expressUpdateShowApi,
	expressInfoApi,
	expressDelApi,
} from '/@/api/culture/logistics';
import type { FormInstance, FormRules } from 'element-plus';

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: expressList,
	queryForm: {},
	dataList: [],
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const expressAllList = ref<any>([]);
const dialogVisibleRef = ref<any>();
const formData = ref<any>({});
const formDataRef = ref<any>();
const dialogVisibleAdd = ref(false);
const rules = reactive<FormRules<any>>({
	sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
	name: [{ required: true, message: '请输入物流公司名称', trigger: 'blur' }],
	code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
});
const handleAdd = () => {
	dialogVisibleAdd.value = true;
};
const handleReset = () => {
	state.queryForm.keywords = '';
	getDataList();
};

onMounted(() => {
	getExpressList();
});
const getExpressList = () => {
	expressAllApi({ type: 'normal' }).then((res) => {
		expressAllList.value = res.data;
		localStorage.setItem('expressAllList', JSON.stringify(res));
	});
};

const handleStatusChange = async (row: any) => {
	console.log('row', row);
	const params = { id: row.id, isShow: row.isShow };
	try {
		const { code, msg } = await expressUpdateShowApi(params);
		if (code === 0) {
			useMessage().success('修改成功');
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 编辑
const bindEdit = async (item: any) => {
	try {
		const { code, data, msg } = await expressInfoApi({ id: item.id });
		console.log('data', data);
		if (code === 0) {
			Object.assign(formData.value, data);
			dialogVisibleAdd.value = true;
			console.log('formData.value', formData.value);
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
const bindDel = async (item: any) => {
	try {
		await useMessageBox().confirm(`是否确定删除物流公司`, '删除物流公司');
	} catch {
		return;
	}

	try {
		const { code, msg } = await expressDelApi({ id: item.id });
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
const submitAdd = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			try {
				const { code, msg } = formData.value.id ? await expressUpdate(formData.value) : await expressAddApi(formData.value);
				if (code === 0) {
					handleClose(formDataRef.value);
					getExpressList();
					useMessage().success('操作成功');
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
//  关闭模态框
const handleClose = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	dialogVisibleAdd.value = false;
};
</script>

<style scoped lang="scss"></style>
