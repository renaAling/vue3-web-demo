<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="等级名称">
						<el-input v-model="state.queryForm.levelName" placeholder="请输入" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8">
					<el-button type="primary" icon="Plus" class="mr10" @click="handleAdd">新增</el-button>
				</div>
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
				<el-table-column label="序号" type="index" width="60" />
				<el-table-column prop="level" label="等级" />
				<el-table-column prop="levelName" label="等级名称" />
				<el-table-column prop="brokerageFirstRatio" label="一级分销返佣比例" />
				<el-table-column prop="brokerageSecondRatio" label="二级分销返佣比例" />
				<el-table-column prop="standardMoney" label="升级条件" />
				<el-table-column prop="status" label="状态">
					<template #default="{ row }">
						<el-switch v-model="row.status" inline-prompt active-text="是" inactive-text="否" :before-change="() => beforeChange(row)" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template #default="{ row }">
						<el-button type="text" @click="handleEdit(row)">编辑</el-button>
						<el-button type="text" @click="handleSetting(row)">返佣设置</el-button>
						<el-button type="text" @click="handleDel(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			<fxddList ref="fxddListRef" />
			<fxyList ref="fxyListRef" />
		</div>
		<FormDialog v-model="formDialogVisible" :row="currentRow" :type="type" @ok="getDataList" />
		<SettingDialog v-model="settingDialogVisible" :row="currentRow" @ok="getDataList" />
	</div>
</template>

<script setup lang="ts" name="distributor-list">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import fxddList from './fxddList.vue';
import fxyList from './fxyList.vue';
import { distributionLevelConfigPage, distributionLevelConfigUpdateStatus, levelConfigDetail, distributionLevelConfigDel } from '/@/api/member/distributionManage';

const FormDialog = defineAsyncComponent(() => import('./component/levelAddForm.vue'));
const SettingDialog = defineAsyncComponent(() => import('./component/settingForm.vue'));

const type = ref<'add' | 'edit'>('add');
const formDialogVisible = ref(false);
const settingDialogVisible = ref(false);

const handleAdd = () => {
	formDialogVisible.value = true;
	currentRow.value = {};
	type.value = 'add';
};

const handleEdit = async(row: any) => {
  await levelConfigDetailApi(row.levelCode);
	formDialogVisible.value = true;
	type.value = 'edit';
};

const handleSetting = async(row: any) => {
  await levelConfigDetailApi(row.levelCode);
	settingDialogVisible.value = true;
};

const handleDel = async (row: any) => {
	try {
		await useMessageBox().confirm('确定删除该等级吗？');
		let res = await distributionLevelConfigDel(row.levelCode);
		if (!res.ok) {
			return useMessage().error(res.msg);
		}
		getDataList();
		return true;
	} catch (err: any) {
    return false;
  }
}

const beforeChange = async (row: any) => {
	try {
		const data = {
			levelCode: row.levelCode,
			status: !row.status,
		};
		let res = await distributionLevelConfigUpdateStatus(data);
		if (!res.ok) {
			return useMessage().error(res.msg);
		}
		getDataList();
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const queryRef = ref();
const fxddListRef = ref();
const fxyListRef = ref();
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.levelName = '';
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: distributionLevelConfigPage,
	descs: [],
});

const currentRow = ref();
const levelConfigDetailApi = async (levelCode: any) => {
	let res = await levelConfigDetail(levelCode);
	if (res.ok) {
    currentRow.value = res.data;
	} else {
		return useMessage().error(res.msg);
  }
}

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
</script>
<style scoped lang="scss"></style>
