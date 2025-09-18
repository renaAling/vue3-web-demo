<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="开发者名称" prop="name">
						<el-input placeholder="请输入开发者名称" v-model="state.queryForm.name" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input placeholder="请输入手机号" v-model="state.queryForm.phone" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="账号状态" prop="status">
						<el-select v-model="state.queryForm.status" placeholder="请选择账号状态" style="width: 230px">
							<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
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
				<el-table-column label="开发者名称" prop="name" width="200" show-overflow-tooltip />
				<el-table-column label="手机号" prop="phone" width="200" show-overflow-tooltip />
				<el-table-column label="账号状态" prop="status" width="140" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.status === 1">启用</span>
						<span v-else-if="row.status === 2">未启用</span>
					</template>
				</el-table-column>
				<el-table-column label="应用数量" prop="appCounts" show-overflow-tooltip width="140" />
				<el-table-column label="已授权接口" prop="interfaceCounts" show-overflow-tooltip width="140" />
				<el-table-column label="操作">
					<template #default="{ row, $index }">
						<el-button class="ml-1" text type="primary" @click="handleCommand('manage', row, $index)">应用管理</el-button>
						<el-button class="ml-1" text type="primary" v-if="row.status === 1" @click="handleCommand('disable', row, $index)">停用</el-button>
						<el-button class="ml-1" text type="primary" v-if="row.status === 2" @click="handleCommand('enable', row, $index)">启用</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('monitor', row, $index)">运维监控</el-button>
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
import { getDeveloperList, updateDeveloperStatus } from '/@/api/openPlatform/developer';
import { ElNotification } from 'element-plus';

// 搜索变量
const queryRef = ref();

// 启用/未启用状态枚举列表
const statusList = [
	{ label: '启用', value: 1 },
	{ label: '未启用', value: 2 },
];

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getDeveloperList,
	dataList: [],
});
/**
 * 处理列表项的操作
 */
const handleCommand = (command: Table.Command, row: any, index: number) => {
	switch (command) {
		case 'manage':
			router.push({
				path: `/openPlatform/developerManage/applicationManage/index`,
				query: {
					userId: row.userId,
				},
			});
			break;
		case 'enable':
			ElMessageBox.confirm(`是否启用开发者账号？`, '启用', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					updateDeveloperStatus({
						id: row.id,
						status: row.status === 1 ? 2 : 1,
					}).then((res) => {
						if (res.msg) {
							ElNotification({
								type: 'error',
								message: res.msg,
							});
						}
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'disable':
			ElMessageBox.confirm(`是否停用开发者账号？`, '停用', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					updateDeveloperStatus({
						id: row.id,
						status: row.status === 1 ? 2 : 1,
					}).then((res) => {
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		case 'monitor':
			router.push({
				path: `/openPlatform/devOpsMonitor/resourcesMonitor/index`,
				query: {
					userId: row.userId,
				},
			});
			break;
	}
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const router = useRouter();
const handleAdd = () => {
	router.push('/openPlatform/interfaceManage/interfaceList/form');
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
