<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="敏感词名称">
						<el-input placeholder="请输入" maxlength="30" v-model="state.queryForm.words" clearable />
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker
							v-model="daterangeTime"
							@change="changeTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button type="primary" @click="handleCreate">新增</el-button>
				<el-button type="primary" icon="Plus" @click="excelUploadRef.show()">导入</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column prop="words" label="敏感词" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间"></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="primary" @click="handelEdit(row)">编辑</el-button>
						<el-button text type="danger" @click="handelDel(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<AddOnceDialog ref="AddOnceDialogRef" @refresh="getDataList"></AddOnceDialog>
		<!-- 导入 -->
		<UploadExcel
			title="导入"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			:custom-temp-url="baseFileUrl + '/rls/b/敏感词模板.xlsx'"
			url="/note/sensitive/words/import"
			:fileType="['xlsx', 'xls']"
		/>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getSensitivePageApi, sensitiveWordsDelApi } from '/@/api/note/noteInfo';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';

const excelUploadRef = ref();
const baseFileUrl = computed(() => import.meta.env.VITE_DOCUMENT_FILE_URL);
const UploadExcel = defineAsyncComponent(() => import('./UploadExcel.vue'));

const daterangeTime = ref<string[]>([]);
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

// 引入组件
const AddOnceDialog = defineAsyncComponent(() => import('./addOnce.vue'));
const AddOnceDialogRef = ref();
const stores = travelCommunalData();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getSensitivePageApi,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

onMounted(async () => {
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		Session.remove('state');
	}
	if (stores.regionCodeList.length < 1) {
		await stores.getRegionCodeList();
	}
});
// 新增
const handleCreate = () => {
	AddOnceDialogRef.value.openDialog();
};
// 编辑
const handelEdit = (row: any) => {
	AddOnceDialogRef.value.openDialog(row);
};
// 删除
const handelDel = async (row: any) => {
	ElMessageBox.confirm('此操作将永久删除？', '系统提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await handleDelApi(row.id);
		})
		.catch(() => {
			return;
		});
};
const handleDelApi = async (id: string) => {
	try {
		const { code, msg } = await sensitiveWordsDelApi(id);
		if (code === 0) {
			getDataList();
			useMessage().success('删除成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	daterangeTime.value = [];
	state.queryForm = {};
	getDataList();
};
</script>
