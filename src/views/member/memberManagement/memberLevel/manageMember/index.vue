<template>
	<div class="layout-padding" style="width: 100%">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-row>
						<el-form-item label="会员等级" prop="level">
							<el-select v-model="state.queryForm.level" style="width: 220px" placeholder="选择会员等级" clearable>
								<el-option v-for="item in levelList" :key="item.level" :label="item.levelName" :value="item.level" />
							</el-select>
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
					<template #default="scope">
						<span>{{ scope.row.nickName ? scope.row.nickName : '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="mobile" label="联系电话" show-overflow-tooltip></el-table-column>
				<el-table-column prop="levelName" label="会员等级" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userState" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.userState == 1">正常</el-tag>
						<el-tag v-if="scope.row.userState == 2">冻结</el-tag>
						<!-- <el-tag v-if="scope.row.userState == 3">注销</el-tag> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getmemberUserPage, getLevelList } from '/@/api/member/memberLevel/manageMember';
import { useMessageBox, useMessage } from '/@/hooks/message';
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
		// {
		// 	value: 3,
		// 	label: '注销',
		// },
	],
	typeList: [] as any,
});
const levelList = ref<any[]>([]);
onMounted(async () => {
	getLevelListData();
});

const getLevelListData = async () => {
	try {
		const { code, data, msg } = await getLevelList();
		if (code === 0) {
			levelList.value = data;
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
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

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
