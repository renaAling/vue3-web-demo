<template>
	<!-- 推送模板 -->
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="模板名称" prop="name">
							<el-input placeholder="请输入模板名称" clearable style="width: 180px" v-model="state.queryForm.name" />
						</el-form-item>
						<el-form-item label="创建时间" prop="searchTime">
							<el-date-picker
								v-model="searchTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="YYYY-MM-DD"
								style="width: 270px"
								:disabled-date="disabledDate"
							/>
						</el-form-item>
						<el-form-item label="状态" prop="status" placeholder="请选择状态">
							<el-select v-model="state.queryForm.status" clearable style="width: 180px">
								<el-option label="启用" :value="1">启用</el-option>
								<el-option label="禁用" :value="2">禁用</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
				<el-row class="mb8 flex justify-between items-center">
					<div>
						<el-button type="primary" icon="plus" @click="toAdd()"> 新增 </el-button>
					</div>
				</el-row>
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					row-key="id"
					border
					:cell-style="tableStyle?.cellStyle"
					:header-cell-style="tableStyle?.headerCellStyle"
				>
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="模板名称" prop="name" />
					<el-table-column label="模板内容" prop="content" />
					<el-table-column label="创建人" prop="createBy" />
					<el-table-column label="创建时间" prop="createTime" />
					<el-table-column label="状态" prop="status">
						<template #default="{ row }">
							<el-switch v-model="row.status" :active-value="1" :inactive-value="2" @change="handleEdit(row)" />
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toDetails(row)">查看详情</el-button>
							<el-button type="primary" link @click="formDialogRef.openDialog(row)">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
</template>

<script lang="ts" setup name="manage-list">
import { pageMemberMarketingTemplatePage, putMemberMarketingTemplateUpdateApi } from '/@/api/member/marketing/marketing';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox, useMessage } from '/@/hooks/message';

const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const searchTime = ref<string[]>([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageMemberMarketingTemplatePage,
	queryForm: {},
	dataList: [],
});
let type = ref('list');
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.createStartTime = val[0] + ' 00:00:00';
			state.queryForm.createEndTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.createStartTime = '';
			state.queryForm.createEndTime = '';
		}
	}
);
onMounted(() => {});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.createStartTime = '';
	state.queryForm.createEndTime = '';
	getDataList();
};

const toDetails = (row: any) => {
	formDialogRef.value.openDialog(row);
};
const toAdd = () => {
	formDialogRef.value.openDialog();
};

const handleEdit = async (row: any) => {
	try {
		state.loading = true;
		const { code, data, msg } = await putMemberMarketingTemplateUpdateApi(row);
		if (code === 0) {
			console.log('aaa', data);
			useMessage().success('修改成功');
			// queryRef.value.resetFields();
			state.loading = false;
			getDataList();
		} else {
			row.status = !row.status;
			useMessage().error(msg);
		}
	} catch (err: any) {
		row.status = !row.status;
		useMessage().error(err.msg);
	} finally {
		state.loading = false;
	}
};
const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};
</script>
<style lang="scss" scoped></style>
