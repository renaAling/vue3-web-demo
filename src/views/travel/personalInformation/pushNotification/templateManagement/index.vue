<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="模板名称" prop="name">
						<el-input placeholder="请输入问题名称" maxlength="30" v-model="state.queryForm.name" clearable />
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
					<el-form-item label="状态" prop="type">
						<el-select v-model="state.queryForm.type" placeholder="请选择状态" default-first-option clearable>
							<el-option v-for="(value, key) in typelist" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
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
				<el-table-column type="index" label="序号" width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="模板ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="模板名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="模板内容" show-overflow-tooltip></el-table-column>
				<el-table-column label="推送途径" prop="merchantName" width="200">
					<template #default="{ row }"> </template>
				</el-table-column>
				<el-table-column prop="触发时机" label="内容解答" show-overflow-tooltip></el-table-column>
				<el-table-column label="状态">
					<template #default="{ row }">
						<el-switch v-model="row.status" :before-change="() => beforeChangeStatus(row)" :active-value="1" :inactive-value="2" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="primary" @click="handleSee(row)">查看</el-button>
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
import { getMemberGroupPage } from '/@/api/member/memberGroup';
import { useMessageBox } from '/@/hooks/message';
import { Session } from '/@/utils/storage';

// 引入组件
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const timeData = ref<string[]>([]);
const typelist = ref<any[]>();

const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
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
	pageList: getMemberGroupPage,
	descs: ['create_time'],
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const queryRef = ref();
const showSearch = ref(true);
const getList = () => {
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		getDataList(false);
		Session.remove('state');
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeData.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
const beforeChangeStatus = async (row: any) => {
	const { id, status } = row;
	return new Promise((resolve, reject) => {
		try {
			useMessageBox()
				.confirm(`是否${status === 1 ? '禁用' : '启用'}该模板`, `${status === 1 ? '禁用' : '启用'}`)
				.then(async () => {
					// let params = { id: id, status: status === 1 ? 2 : 1 };
					// try {
					// 	const { code, msg } = await pageGroupaUpdate(params);
					// 	if (code === 0) {
					// 		useMessage().success(`${status === 1 ? '禁用' : '启用'}成功`);
					// 		getDataList;
					// 		return resolve(true);
					// 	} else {
					// 		useMessage().error(msg);
					// 	}
					// } catch (err: any) {
					// 	useMessage().error(err.msg);
					// }
				})
				.catch(() => {
					resolve(false);
				});
		} catch (err) {
			reject(false);
		}
	});
};

const handleSee = (row: any) => {
	Session.set('state', JSON.stringify(state));
	formDialogRef.value.openDialog(row);
};
</script>
