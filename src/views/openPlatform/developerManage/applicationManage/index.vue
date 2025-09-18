<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="应用ID" prop="appId">
						<el-input placeholder="请输入应用ID" v-model="state.queryForm.appId" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="应用名称" prop="appName">
						<el-input placeholder="请输入应用名称" v-model="state.queryForm.appName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="所属开发者" prop="userName" v-if="!route.query.userId">
						<el-input placeholder="请输入所属开发者手机号" v-model="state.queryForm.userName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary"> 查询 </el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="ID" prop="appId" show-overflow-tooltip />
				<el-table-column label="应用名称" prop="appName" show-overflow-tooltip />
				<el-table-column label="所属开发者" prop="name" show-overflow-tooltip v-if="!route.query.userId" />
				<el-table-column label="开发者手机号" prop="phone" show-overflow-tooltip v-if="!route.query.userId" />
				<el-table-column label="授权接口" prop="interfaceCounts" show-overflow-tooltip width="200" />
				<el-table-column label="操作" width="200">
					<template #default="{ row }">
						<el-button class="ml-1" text type="primary" @click="handleDetail(row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getApplicationList } from '/@/api/openPlatform/application';

const router = useRouter();
const route = useRoute();
console.log('route', route);
// 搜索变量
const queryRef = ref();
const mainId = ref('');

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		userId: route.query.userId,
	},
	pageList: getApplicationList,
	dataList: [],
});
/**
 * 处理列表项的操作
 */
const handleDetail = (row: any) => {
	router.push({
		path: '/openPlatform/developerManage/applicationManage/form',
		query: {
			id: row.id,
		},
	});
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
