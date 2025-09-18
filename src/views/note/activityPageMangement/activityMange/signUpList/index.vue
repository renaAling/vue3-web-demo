<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer mb-4">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-row>
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="昵称">
						<el-input placeholder="请输入昵称" maxlength="30" v-model="state.queryForm.nickName" clearable />
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="请输入手机号" maxlength="30" v-model="state.queryForm.phone" clearable />
					</el-form-item>
					<el-form-item label="报名时间">
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
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-5">
				<el-button type="primary" @click="handleExport">导出</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="avatar" label="头像">
					<template #default="{ row }">
						<el-avatar :size="40" :src="row.avatar" />
					</template>
				</el-table-column>
				<el-table-column prop="nickName" label="昵称" />
				<el-table-column prop="phone" label="手机号" />
				<el-table-column prop="createTime" label="报名时间" />
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { activityEnrollPageApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';

const stores = travelCommunalData();
const route = useRoute();
const router = useRouter();
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
    activityCode: route.query.code as string,
  },
	pageList: activityEnrollPageApi,
});

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle, downBlobFile } = useTable(state);

onMounted(async () => {
});
// 导出
const handleExport = () => {
	downBlobFile('/note/activity/enroll/export', { ...state.queryForm }, '报名统计导出.xlsx');
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	daterangeTime.value = [];
	state.queryForm = {};
	state.queryForm.activityCode = route.query.code as string;
	getDataList();
};
</script>
