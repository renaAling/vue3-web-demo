<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane :label="a.label" :name="a.name" v-for="(a, i) of tabList" :key="i">
					<el-row class="ml10">
						<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item label="用户名">
								<el-input placeholder="请输入用户名" v-model="state.queryForm.userName" clearable />
							</el-form-item>
							<el-form-item label="用户ID">
								<el-input placeholder="请输入用户ID" v-model="state.queryForm.unionId" clearable />
							</el-form-item>
							<el-form-item label="手机号">
								<el-input placeholder="请输入用户手机号" v-model="state.queryForm.mobile" clearable />
							</el-form-item>
							<el-form-item>
								<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
								<el-button @click="resetQuery" icon="Refresh">重置</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						row-key="id"
						border
						:cell-style="tableStyle?.cellStyle"
						:header-cell-style="tableStyle?.headerCellStyle"
					>
						<el-table-column label="序号" type="index" width="60" align="center" />
						<el-table-column label="用户名" prop="userName" />
						<el-table-column label="用户ID" prop="unionId" show-overflow-tooltip />
						<el-table-column label="手机号" prop="mobile" />
						<el-table-column label="注册时间" prop="registerTime" />
						<el-table-column label="最近登录时间" prop="lastLoginTime" />
						<el-table-column v-if="tenantId != '1922177185280557058'" label="消费金额(元)" prop="consumptionAmount" />
							<el-table-column v-if="tenantId == '1922177185280557058'" label="消费积分" prop="consumptionScore" />
						<el-table-column label="操作" width="100">
							<template #default="{ row }">
								<el-button type="primary" link @click="handleDetail(row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup name="userSort">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getCultureUserList } from '/@/api/culture/userManage';
import type { TabsPaneContext } from 'element-plus';
import { Session } from '/@/utils/storage';

const tenantId = ref(Session.getTenant());
const router = useRouter();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getCultureUserList,
	queryForm: {
		isStaff: false,
	},
	dataList: [],
});

const activeName = ref('first');
const tabList = ref([
	{ label: '公众用户', name: 'first' },
	{ label: '员工用户', name: 'second' },
]);

const handleClick = (tab: TabsPaneContext) => {
	if (tab.props.name === 'first') {
		state.queryForm.isStaff = false;
	} else {
		state.queryForm.isStaff = true;
	}
	getDataList();
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {};
	getDataList();
};

const handleDetail = (row: any) => {
	router.push({
		path: `/culture/userManage/userList/form`,
		query: {
			unionId: row.unionId,
			mobile: row.mobile,
		},
	});
};
</script>
