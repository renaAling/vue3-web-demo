<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="开发者名称" prop="name">
						<el-input placeholder="请输入开发者名称" v-model="state.queryForm.name" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="手机号" prop="requestMethod">
						<el-input placeholder="请输入手机号" v-model="state.queryForm.name" clearable style="width: 230px" />
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
				<el-table-column label="手机号" prop="mobile" width="200" show-overflow-tooltip />
				<el-table-column label="账号状态" prop="status" width="200" show-overflow-tooltip />
				<el-table-column label="应用数量" prop="appNums" show-overflow-tooltip />
				<el-table-column label="已授权接口" prop="accessInterface" show-overflow-tooltip />
				<el-table-column label="操作" width="340">
					<template #default="{ row, $index }">
						<el-button class="ml-1" text type="primary" @click="handleCommand('detail', row, $index)">详情</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('manage', row, $index)">应用管理</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('close', row, $index)">停用</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('open', row, $index)">启用</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('monitor', row, $index)">运维监控</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { ElMessageBox } from 'element-plus';
import { getProductsList, updateProductsStatus, deleteProduct, previewProductDetail } from '/@/api/culture/products';
import { ElNotification } from 'element-plus';

// 搜索变量
const queryRef = ref();

const previewDialogRef = ref();

// 上下架状态枚举列表
const statusList = [
	{ label: '已下架', value: 1 },
	{ label: '已上架', value: 2 },
];

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	// pageList: getProductsList,
	dataList: [
		{
			id: 1,
			name: '李莉莉',
			mobile: '13800138000',
			status: '启用',
			appNums: '12',
			accessInterface: '40',
		},
	],
});
/**
 * 处理列表项的操作
 */
const handleCommand = (command: Table.Command, row: any, index: number) => {
	switch (command) {
		case 'detail':
			router.push({
				path: `/openPlatform/developerManage/developerList/detail`,
				query: {
					id: row.id,
				},
			});
			break;
		case 'manage':
			router.push({
				path: `/openPlatform/developerManage/developerList/appManage`,
				query: {
					id: row.id,
				},
			});
			break;
		case 'open':
			ElMessageBox.confirm(`请确认是否将 ${row.spuName} 上架`, '上架确认', {
				confirmButtonText: '上架',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					updateProductsStatus({
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
		case 'close':
			ElMessageBox.confirm(`请确认是否将 ${row.spuName} 下架`, '下架确认', {
				confirmButtonText: '下架',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					updateProductsStatus({
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
				path: `/openPlatform/developerManage/developerList/monitor`,
				query: {
					id: row.id,
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
