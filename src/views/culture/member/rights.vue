<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="权益名称">
						<el-input placeholder="请输入权益名称" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.status" placeholder="请选择状态" clearable>
							<el-option label="开启" :value="true"></el-option>
							<el-option label="关闭" :value="false"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb8">
				<el-button type="primary" icon="Plus" @click="handleAdd">新增</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" align="center" />
				<el-table-column label="权益名称" prop="name" />
				<el-table-column label="权益图标" prop="image">
					<template #default="scope">
						<el-image :src="scope.row.image" class="w-[50px] h-[50px]" />
					</template>
				</el-table-column>
				<el-table-column label="权益简介" prop="description" show-overflow-tooltip />
				<el-table-column label="适用会员类型" prop="cardName" />
				<el-table-column label="使用规则" prop="useRule" />
				<el-table-column label="状态" prop="status">
					<template #default="scope">
						<el-switch
							v-model="scope.row.status"
							inline-prompt
							:active-value="true"
							:inactive-value="false"
							active-text="开"
							inactive-text="关"
							@change="handleStatusChange(scope.row)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="更新时间" prop="updateTime" />
				<el-table-column label="操作">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="primary" link @click="handleDel(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<FormDialog v-model="formDialogVisible" :row="currentRow" :type="type" @ok="getDataList" />
	</div>
</template>

<script lang="ts" setup name="memberCards">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { benefitPageApi, switchBenefitApi, deleteBenefitApi, getBenefitInfoApi } from '/@/api/culture/member';

const FormDialog = defineAsyncComponent(() => import('./components/rightsForm.vue'));

const type = ref<'add' | 'edit'>('add');
const formDialogVisible = ref(false);
const currentRow = ref();
const handleAdd = () => {
	formDialogVisible.value = true;
	currentRow.value = {};
	type.value = 'add';
};

const handleEdit = async (row: any) => {
	const res = await getBenefitInfoApi(row.id);
	currentRow.value = { ...res.data };
	formDialogVisible.value = true;
	type.value = 'edit';
};

const handleStatusChange = async (row: any) => {
	const params = { id: row.id, status: row.status };
	try {
		const { code, msg } = await switchBenefitApi(params);
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

// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: benefitPageApi,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};

const handleDel = async (row: any) => {
	try {
		await useMessageBox().confirm('此操作将永久删除');
		let res = await deleteBenefitApi(row.id);
		if (!res.ok) {
			return useMessage().error(res.msg);
		}
		getDataList();
		return true;
	} catch (err: any) {
		return false;
	}
};
</script>
