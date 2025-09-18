<template>
	<div class="layout">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row shadow="hover" v-show="showSearch" class="ml10">
					<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
						<el-row>
							<el-form-item label="用户名" prop="userName">
								<el-input placeholder="请输入用户名" maxlength="50" style="width: 220px" v-model="state.queryForm.userName" clearable />
							</el-form-item>
							<el-form-item label="平台ID" prop="platformId">
								<el-input placeholder="请输入平台ID" maxlength="50" style="width: 220px" v-model="state.queryForm.platformId" clearable />
							</el-form-item>
							<el-form-item label="手机号" prop="mobile">
								<el-input placeholder="请输入手机号" maxlength="11" style="width: 220px" v-model="state.queryForm.mobile" clearable />
							</el-form-item>
							<el-form-item label="轨道生活通小程序OpenID" prop="trackLifeOpenId">
								<el-input placeholder="请输入轨道生活通小程序OpenID" style="width: 260px" v-model="state.queryForm.trackLifeOpenId" clearable />
							</el-form-item>
							<el-form-item label="成都地铁乘车码小程序OpenID" prop="chengduMetroOpenId">
								<el-input
									placeholder="请输入成都地铁乘车码小程序OpenID"
									style="width: 260px"
									v-model="state.queryForm.chengduMetroOpenId"
									clearable
								/>
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
					<el-table-column prop="userName" label="用户名" show-overflow-tooltip>
						<template #default="{ row }">
							{{ row.userName || '-' }}
						</template>
					</el-table-column>
					<el-table-column prop="platformId" label="平台ID" show-overflow-tooltip></el-table-column>
					<el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
					<el-table-column prop="registerTime" label="注册时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="trackLifeOpenId" label="轨道生活通小程序OpenID" show-overflow-tooltip>
						<template #default="{ row }">
							{{ row.trackLifeOpenId || '-' }}
						</template>
					</el-table-column>
					<el-table-column prop="chengduMetroOpenId" label="成都地铁乘车码小程序OpenID" show-overflow-tooltip>
						<template #default="{ row }">
							{{ row.chengduMetroOpenId || '-' }}
						</template>
					</el-table-column>
					<el-table-column prop="bindStatus" label="授权状态" show-overflow-tooltip>
						<template #default="{ row }">
							<el-tag v-if="row.bindStatus == 1">已授权</el-tag>
							<el-tag v-if="row.bindStatus == 2">未授权</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="授权时间" show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" width="100">
						<template #default="scope">
							<el-button text type="primary" @click="toDetail(scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { Session } from '/@/utils/storage';
// import { useMessage } from '/@/hooks/message';
import { getCdMetroUserBindUserPageApi } from '/@/api/travel/travelData';
const router = useRouter();

onMounted(() => {
	if (Session.get('state')) {
		const data = JSON.parse(Session.get('state'));
		state.queryForm = data.queryForm;
		state.pagination = data.pagination;
		Session.remove('state');
	}
});

const toDetail = (row: any) => {
	Session.set('state', JSON.stringify(state));
	router.push({
		path: '/travel/travelData/travelDataManagement/details',
		query: { row: JSON.stringify(row) },
	});
};
const queryRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getCdMetroUserBindUserPageApi, // H
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>

<style>
.layout {
	height: 100%;
	overflow: auto;
	box-sizing: border-box;
}
</style>
