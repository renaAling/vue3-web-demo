<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10 mb10">
				<el-button type="primary" @click="addMember">新增权益</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id" border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column prop="count" label="购买门槛（件）" show-overflow-tooltip></el-table-column>
				<el-table-column prop="discount" label="权益"></el-table-column>
				<el-table-column prop="createBy" label="创建人"></el-table-column>
				<el-table-column prop="createTime" label="创建时间"></el-table-column>
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="text" @click="edit(row)">编辑</el-button>
						<el-button type="text" @click="del(row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<el-dialog v-model="dialogVisible" :title="title" width="40%" draggable @closed="resetForm">
				<el-form ref="promoterForm" :model="rightsForm" :rules="rules" v-loading="loading" label-width="80px">
					<el-form-item prop="count" label="购买门槛">
						<div class="flex items-center w-full">
							<el-input-number style="width: 100%;" v-model.trim="rightsForm.count" :min="1" :precision="0" :step="1" :max="10000" placeholder="请输入购买门槛" clearable></el-input-number>
						<div class="ml-2">件</div>
						</div>
					</el-form-item>
					<el-form-item prop="discount" label="权益">
						<div class="flex items-center w-full">
							<el-input-number style="width: 100%;" v-model.trim="rightsForm.discount" :min="0" :precision="2" :step="0.01" :max="10" type="number" placeholder="请输入权益" clearable></el-input-number>
							<div class="ml-2">折</div>
					</div>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="resetForm">取消</el-button>
						<el-button type="primary" @click="handleSuccess"> 确定 </el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup lang="ts" name="distributor-member">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { discountPage, discountAdd, discountDetail, discountUpdate, discountDel } from '/@/api/member/distributor'
const rightsForm = ref({
	discount: 0,
	count: 0,
	id: '',
	isDel: true
});
const title = ref('新增权益');
const promoterForm = ref();
const loading = ref(false);
const rules = ref({
	discount: [
		{ required: true, message: '权益不能为空', trigger: 'blur' },
	],
	count: [
		{ required: true, message: '购买门槛不能为空', trigger: 'blur' },
	],
});
const addMember = () => {
	title.value = '新增权益';
	rightsForm.value = {discount: 0,count: 0,id: '',isDel: true}
	dialogVisible.value = true;
};
const showSearch = ref(true);
const dialogVisible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: discountPage, // H
	descs: [],
});

// 按钮
const edit = (row: any) => {
	discountDetail({id:row.id}).then(res => {
		title.value = '编辑权益';
		Object.assign(rightsForm.value, res.data)
		dialogVisible.value = true;
	})
};
const del = async (id: string) => {
	try {
		await useMessageBox().confirm('确认要删除该权益?删除之后之前订单不受影响');
	} catch {
		return;
	}

	try {
		await discountDel({id:id});
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleSuccess = async () => {
	const valid = await promoterForm.value.validate().catch(() => {});
	if (!valid) return false;
	try {
		loading.value = true;
		rightsForm.value.id ? await discountUpdate(rightsForm.value) : await discountAdd(rightsForm.value)
		useMessage().success('操作成功');
		promoterForm.value.resetFields();
		rightsForm.value.id = '';
		dialogVisible.value = false;
		getDataList()
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
const resetForm = () => {
	promoterForm.value.resetFields();
	dialogVisible.value = false;
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
