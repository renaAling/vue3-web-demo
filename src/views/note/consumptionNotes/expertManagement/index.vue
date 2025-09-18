<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="昵称">
						<el-input placeholder="请输入" maxlength="30" v-model="state.queryForm.nickName" clearable />
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="请输入" maxlength="30" v-model="state.queryForm.phone" clearable />
					</el-form-item>
					<el-form-item label="粉丝数">
						<el-select v-model="followerCount" placeholder="请选择" clearable @change="handleFollowerCountChange">
							<el-option label="1千以下" :value="1" />
							<el-option label="1千 - 1万" :value="2" />
							<el-option label="1万 - 5万" :value="3" />
							<el-option label="5万 - 10万" :value="4" />
							<el-option label="10万以上" :value="5" />
						</el-select>
						<!-- <div class="flex items-center">
              <el-input placeholder="请输入最小粉丝数量" maxlength="30" v-model="state.queryForm.minFollowerCount" clearable />
              <span class="mx-2">—</span>
              <el-input placeholder="请输入最大粉丝数量" maxlength="30" v-model="state.queryForm.maxFollowerCount" clearable />
            </div> -->
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.status" placeholder="请选择" clearable>
							<el-option label="签约" :value="1" />
							<el-option label="解约" :value="2" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-4">
				<el-button type="primary" @click="handleAdd">新增</el-button>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="userId"
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
				<el-table-column prop="registerTime" label="注册时间" show-overflow-tooltip />
				<el-table-column prop="followerCount" label="粉丝数" />
				<el-table-column prop="noteCount" label="笔记数" />
				<el-table-column prop="signingTime" label="签约时间" show-overflow-tooltip />
				<el-table-column prop="status" label="状态">
					<template #default="{ row }">
						<span v-if="row.status == 1">签约</span>
						<span v-else-if="row.status == 2">解约</span>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="220">
					<template #default="{ row }">
						<el-button text type="primary" @click="handelFans(row)">达人粉丝</el-button>
						<el-button v-if="row.status == 1" text type="primary" @click="handelContract(row)">解约</el-button>
						<el-button v-if="row.status == 2" text type="primary" @click="handelSign(row)">签约</el-button>
						<el-button text type="primary" @click="handelLogs(row)">日志</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<AddDialog ref="addDialogRef" @refresh="getDataList"></AddDialog>
		<ContractDialog ref="contractDialogRef" @refresh="getDataList"></ContractDialog>
		<LogDialog ref="logDialogRef"></LogDialog>
	</div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getExpertPageApi, expertUpdateStatusApi } from '/@/api/note/noteInfo';
import { travelCommunalData } from '/@/stores/note';
import { Session } from '/@/utils/storage';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 引入组件
const AddDialog = defineAsyncComponent(() => import('./commentDialog/handleAdd.vue'));
const ContractDialog = defineAsyncComponent(() => import('./commentDialog/handleContract.vue'));
const LogDialog = defineAsyncComponent(() => import('./commentDialog/handleLog.vue'));
const addDialogRef = ref();
const contractDialogRef = ref();
const logDialogRef = ref();
const stores = travelCommunalData();
const router = useRouter();
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getExpertPageApi,
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

const followerCount = ref(null);
const handleFollowerCountChange = (val: any) => {
	switch (val) {
		case 1:
			state.queryForm.minFollowerCount = 0;
			state.queryForm.maxFollowerCount = 1000;
			break;
		case 2:
			state.queryForm.minFollowerCount = 1000;
			state.queryForm.maxFollowerCount = 10000;
			break;
		case 3:
			state.queryForm.minFollowerCount = 10000;
			state.queryForm.maxFollowerCount = 50000;
			break;
		case 4:
			state.queryForm.minFollowerCount = 50000;
			state.queryForm.maxFollowerCount = 100000;
			break;
		case 5:
			state.queryForm.maxFollowerCount = 100000;
	}
};

// 新增
const handleAdd = () => {
	addDialogRef.value.openDialog();
};
// 解约
const handelContract = (row: any) => {
	contractDialogRef.value.openDialog(row);
};
// 签约
const handelSign = async (row: any) => {
	try {
		await useMessageBox().confirm('是否要重新签约该达人？', '重新签约确认');
	} catch {
		return;
	}

	try {
		const res = await expertUpdateStatusApi({
			userId: row.userId,
			status: 1,
		});
		if (res?.ok) {
			getDataList();
			useMessage().success('签约成功');
		}
	} catch (err: any) {
		useMessage().error(err.msg || '');
	}
};
// 日志
const handelLogs = (row: any) => {
	logDialogRef.value.openDialog(row);
};
// 达人粉丝
const handelFans = (row: any) => {
	router.push({
		path: '/note/consumptionNotes/expertManagement/fans',
		query: { userId: row.userId },
	});
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	followerCount.value = null;
	getDataList();
};
</script>
