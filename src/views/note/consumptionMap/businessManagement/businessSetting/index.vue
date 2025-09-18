<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb-4 p-4 bg-[#f9f9f9]">
				<span>统一设置半径</span>
				<el-input-number class="!w-[120px] mx-4" v-model="radius" :disabled="inputDisabled" :min="100" :max="5000" controls-position="right">
					<template #suffix>
						<span>米</span>
					</template>
				</el-input-number>
				<el-button type="primary" v-if="inputDisabled" @click="inputDisabled = false">编辑</el-button>
				<el-button type="primary" v-else @click="handleAll" :loading="btnLoading">应用到全部</el-button>
			</div>
			<el-row shadow="hover">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="站点名称">
						<el-input placeholder="请输入站点名称" maxlength="30" v-model="state.queryForm.subwayName" clearable />
					</el-form-item>
					<el-form-item label="所属线路">
						<el-input placeholder="请输入所属线路" maxlength="30" v-model="state.queryForm.lineCode" clearable />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-4">
				<el-button type="primary" @click="formDialogRef.openDialog(selectObjs)" :disabled="multiple">批量设置</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="subwayId"
				@selection-change="handleSelectionChange"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="40" />
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="name" label="站点名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="linesName" label="所属线路" show-overflow-tooltip></el-table-column>
				<el-table-column prop="radius" label="当前半径">
					<template #default="{ row }"> {{ row.radius }}米 </template>
				</el-table-column>
				<el-table-column prop="isSingleOperate" label="设置方式">
					<template #default="{ row }">
						{{ row.isSingleOperate ? '单独设置' : '统一设置' }}
					</template>
				</el-table-column>
				<el-table-column prop="updateBy" label="操作人" />
				<el-table-column prop="updateTime" label="最近修改时间" />
				<el-table-column label="操作" width="100">
					<template #default="{ row }">
						<el-button text type="primary" @click="formDialogRef.openDialog(row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getBusinessAreaPageApi, BusinessAreaOperationApi, getAreaRadiusApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';

// 引入组件
const formDialog = defineAsyncComponent(() => import('./dialog.vue'));
const formDialogRef = ref();
const stores = travelCommunalData();
const queryRef = ref();
const radius = ref<Number | null>(null);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getBusinessAreaPageApi,
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
	await getAreaRadius();
});

const getAreaRadius = async () => {
	const res = await getAreaRadiusApi();
	if (res?.ok) {
		radius.value = res.data;
	}
}
// 应用到全部
const inputDisabled = ref(true);
const btnLoading = ref(false);
const handleAll = async () => {
	try {
		await useMessageBox().confirm(`是否统一设置半径为${radius.value || 0}米？点击确认，所有数据的当前半径显示设置的数据`, '提示');
	} catch {
		inputDisabled.value = true;
		getAreaRadius();
		return;
	}
	try {
		btnLoading.value = true;
		const response = await BusinessAreaOperationApi({ radius: radius.value });
		if (response?.ok) {
			useMessage().success(response.msg || '操作成功');
			getDataList();
		} else {
			useMessage().error(response.msg);
		}
	} catch (error: any) {
		useMessage().error(error.msg || '操作失败');
	} finally {
		getAreaRadius();
		btnLoading.value = false;
		inputDisabled.value = true;
	}
};
// 多选事件
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);
const handleSelectionChange = (objs: { subwayId: string }[]) => {
	selectObjs.value = objs.map(({ subwayId }) => subwayId);
	multiple.value = !objs.length;
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
</script>
<style lang="scss" scoped></style>
