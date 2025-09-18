<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-row>
						<el-form-item label="所属分组" prop="groupName">
							<el-select
								v-model="state.queryForm.groupName"
								filterable
								remote
								clearable
								reserve-keyword
								placeholder="请选择所属分组"
								:remote-method="remoteMethod"
								:loading="loading"
								style="width: 240px"
							>
								<el-option v-for="item in groupCodesOptions" :key="item.name" :label="item.name" :value="item.name" />
							</el-select>
							<!-- <el-input placeholder="请输入所属分组" style="width: 220px" v-model="state.queryForm.groupName" clearable /> -->
						</el-form-item>
						<el-form-item label="用户ID" prop="unionId">
							<el-input placeholder="请输入用户ID" maxlength="50" style="width: 220px" v-model="state.queryForm.unionId" clearable />
						</el-form-item>
						<el-form-item label="联系电话" prop="mobile">
							<el-input placeholder="请输入联系电话" maxlength="11" style="width: 220px" v-model="state.queryForm.mobile" clearable />
						</el-form-item>
						<el-form-item label="状态" prop="userState">
							<el-select v-model="state.queryForm.userState" style="width: 220px" placeholder="选择状态" clearable>
								<el-option v-for="item in queryForm.stateArr" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button icon="search" type="primary" @click="getDataList"> 查询 </el-button>
							<el-button icon="Refresh" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-row>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" width="60" align="center" label="序号" />
				<el-table-column prop="unionId" label="用户ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="nickName" label="用户昵称" show-overflow-tooltip>
					<template #default="{ row }">
						<span>{{ row.nickName ? row.nickName : '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="mobile" label="联系电话" show-overflow-tooltip></el-table-column>
				<el-table-column prop="groupNames" label="所属分组" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userState" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.userState == 1">正常</el-tag>
						<el-tag v-if="scope.row.userState == 2">冻结</el-tag>
						<!-- <el-tag v-if="scope.row.userState == 3">注销</el-tag> -->
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<formDialog ref="formDialogRef" @refresh="getDataList"></formDialog>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { useMessage } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getmemberUserPage, getMemberGroupList } from '/@/api/member/memberGroup/manageMember';
const formDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const groupCodesOptions = ref<any>([]);
const loading = ref(false);
// 组织可选列表
const queryForm = reactive({
	stateArr: [
		{
			value: 1,
			label: '正常',
		},
		{
			value: 2,
			label: '冻结',
		},
	],
	typeList: [] as any,
});
onMounted(async () => {
	remoteMethod('');
});
const handleEdit = (row: any) => {
	formDialogRef.value.openDialog(row);
};
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		unionId: '',
		mobile: '',
		userState: '',
		level: '',
	},
	pageList: getmemberUserPage,
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const remoteMethod = async (str?: string) => {
	try {
		const { code, data, msg } = await getMemberGroupList(str);
		if (code === 0) {
			console.log('getMemberCategoryGetList', data);
			groupCodesOptions.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
