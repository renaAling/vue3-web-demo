<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="手机号" prop="phone">
						<el-input placeholder="请输入开发者手机号" v-model="state.queryForm.phone" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="应用名称" prop="appName">
						<el-input placeholder="请输入应用名称" v-model="state.queryForm.appName" clearable style="width: 230px" />
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
				<el-table-column label="账号名称" prop="name" width="120" show-overflow-tooltip />
				<el-table-column label="开发者手机号" prop="phone" width="120" show-overflow-tooltip />
				<el-table-column label="授权应用ID" prop="appId" show-overflow-tooltip />
				<el-table-column label="授权应用名称" prop="appName" show-overflow-tooltip />
				<el-table-column label="授权时间" prop="changeTime" show-overflow-tooltip width="200" />
				<el-table-column label="操作" width="140">
					<template #default="{ row, $index }">
						<el-button class="ml-1" text type="primary" @click="handleCancelRevoke(row)">取消授权</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ElMessageBox } from 'element-plus';
import { getWhiteList } from '/@/api/openPlatform/interface';
import { updateInterfaceStatus } from '/@/api/openPlatform/application';

const router = useRouter();
// 搜索变量
const queryRef = ref();

/**
 * 处理列表项的操作
 */
const handleCancelRevoke = (row: any) => {
	ElMessageBox.confirm(`请确认是否将此接口取消授权`, '取消授权', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(() => {
		updateInterfaceStatus({
			id: row.id,
			status: row.status === 1 ? 2 : 1,
			remark: row.remark,
		}).then((res) => {
			getDataList();
		});
	});
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		interfaceId: router.currentRoute.value.query.interfaceId,
		status: 1,
	},
	pageList: getWhiteList,
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
