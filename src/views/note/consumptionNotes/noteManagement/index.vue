<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="商圈">
						<el-input placeholder="请输入" maxlength="30" v-model="state.queryForm.subwayName" clearable />
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="请输入" maxlength="30" v-model="state.queryForm.phone" clearable />
					</el-form-item>
					<el-form-item label="发布时间">
						<el-date-picker
							v-model="daterangeTime"
							@change="changeTime"
							type="daterange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.isShow" placeholder="请选择" clearable>
							<el-option label="启用" :value="true" />
							<el-option label="禁用" :value="false" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
      <el-row class="mb-4">
				<el-button type="primary" @click="handleSetOp" :disabled="multiple">批量操作</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="code"
				border
				:cell-style="tableStyle.cellStyle"
        	@selection-change="handleSelectionChange"
				:header-cell-style="tableStyle.headerCellStyle"
			>
      	<el-table-column type="selection" width="40" />
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
				<el-table-column prop="subwayName" label="商圈" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickName" label="达人" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="发布时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isShow" label="状态">
					<template #default="{ row }">
						<el-switch
							v-model="row.isShow"
							:active-value="true"
							:inactive-value="false"
							@change="handleStatusChange(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button text type="primary" @click="handelLook(row)">查看</el-button>
						<el-button text type="primary" @click="handelComments(row)">用户评论</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
        <setOpStatusDialog ref="setOpStatusDialogRef" @refresh="getDataList"></setOpStatusDialog>
		</div>
	</div>

</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getExpertNotesPageApi, expertNotesStatusApi } from '/@/api/note/noteInfo';
import { useMessage } from '/@/hooks/message';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';
import setOpStatusDialog from './setOpStatusDialog.vue';
const stores = travelCommunalData();
const router = useRouter();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getExpertNotesPageApi,
});

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

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
const handleStatusChange = async (row: any) => {
	const params = { ids: [row.id], isShow: row.isShow };
	try {
		const { code, msg } = await expertNotesStatusApi(params);
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
// 查看
const handelLook = (row: any) => {
	router.push({
		path: '/note/consumptionNotes/noteManagement/lookNotes',
		query: { code: row.code },
	});
};
// 达人粉丝
const handelComments = (row: any) => {
	router.push({
		path: '/note/consumptionNotes/noteManagement/noteComment',
		query: { code: row.code },
	});
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	daterangeTime.value = [];
	state.queryForm = {};
	getDataList();
};
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};
// openAll
const setOpStatusDialogRef = ref();
// 批量操作按钮
setOpStatusDialogRef.value?.openAll(selectObjs.value);
const handleSetOp=()=>{
  console.log(selectObjs.value);
  setOpStatusDialogRef.value.openDialog(selectObjs.value)
}
</script>
