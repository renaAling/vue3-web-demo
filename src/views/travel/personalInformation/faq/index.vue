<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="问题名称">
						<el-input placeholder="请输入问题名称" maxlength="30" v-model="state.queryForm.question" clearable />
					</el-form-item>
					<el-form-item label="时间" prop="time">
						<el-date-picker
							v-model="timeData"
							type="daterange"
							range-separator="-"
							:disabled-date="disabledDate"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button icon="plus" type="primary" @click="formDialogRef.openDialog('add')"> 新增 </el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column prop="question" label="问题名称" show-overflow-tooltip />
				<el-table-column prop="sequence" label="排序编号" width="200">
					<template #default="{ row }">
						<el-input
							type="number"
							:min="0"
							style="width: 100px"
							v-if="row.showSort"
							v-model="row.sequence"
							placeholder="请输入序号"
							maxlength="5"
							clearable
							@blur="
								row.showSort = false;
								getDataList();
								updateSequence(row);
							"
						/>
						<span v-if="!row.showSort">{{ row.sequence }}</span>
						<el-button type="primary" link @click="updateSequence(row)" v-if="row.showSort">确定</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="answer" label="内容解答" show-overflow-tooltip>
					<template #default="{ row }">
						<div v-if="row.answer" v-html="row.answer"></div>
						<div v-else>-</div>
					</template>
				</el-table-column>
				<el-table-column prop="updateTime" label="时间"></el-table-column>
				<el-table-column prop="updateBy" label="操作人">
					<template #default="{ row }">
						{{ row.updateBy || '-' }}
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态">
					<template #default="{ row }">
						<el-switch v-model="row.status" :active-value="true" :inactive-value="false" :before-change="() => updateStatus(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleEdit('see', row)">查看</el-button>
						<el-button text type="primary" @click="row.showSort = true" v-if="!row.showSort">排序</el-button>
						<el-button text type="primary" @click="handleEdit('edit', row)">编辑</el-button>
						<el-button text type="danger" @click="handelDel(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getList"></formDialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { commonQuestionsPage, commonQuestionsUpdate, delCommonQuestions } from '/@/api/travel/personalInformation';
import { useMessage } from '/@/hooks/message';
import { ElMessageBox } from 'element-plus';
import { Session } from '/@/utils/storage';

// 引入组件
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const timeData = ref<string[]>([]);

const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};
const getList = () => {
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		getDataList(false);
		Session.remove('state');
	}
};
watch(
	() => timeData.value,
	(val) => {
		if (val.length > 0) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: commonQuestionsPage,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const updateStatus = async (row: any) => {
	row.status = !row.status;
	try {
		const { msg, ok } = await commonQuestionsUpdate({ id: row.id, status: row.status });
		if (ok) {
			useMessage().success('更新成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
};

const handleDelApi = async (id: string) => {
	try {
		const { msg, ok } = await delCommonQuestions(id);
		if (ok) {
			getDataList();
			useMessage().success('删除成功');
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg);
	}
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
const queryRef = ref();

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeData.value = [];
	state.queryForm = {};
	getDataList();
};
const updateSequence = async (row: any) => {
	try {
		const { msg, code } = await commonQuestionsUpdate({
			id: row.id,
			sequence: row.sequence,
		});
		if (code === 0) {
			useMessage().success('更新排序成功');
			row.showSort = false;
			getDataList();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const handleEdit = (type: string, row: any) => {
	Session.set('state', JSON.stringify(state));
	formDialogRef.value.openDialog(type, row);
};
</script>
