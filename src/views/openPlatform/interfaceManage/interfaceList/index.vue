<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="接口名称" prop="interfaceName">
						<el-input placeholder="请输入接口名称" v-model="state.queryForm.interfaceName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="请求方式" prop="requestMethod">
						<el-select v-model="state.queryForm.requestMethod" placeholder="请选择请求方式" style="width: 230px" clearable>
							<el-option v-for="(item, index) in requestMethodsList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="接口状态" prop="status">
						<el-select v-model="state.queryForm.status" placeholder="请选择接口状态" style="width: 230px" clearable>
							<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary"> 查询 </el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleAdd" type="primary"> 新建接口 </el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="接口名称" prop="interfaceName" width="200" show-overflow-tooltip />
				<el-table-column label="路径" prop="uri" width="200" show-overflow-tooltip />
				<el-table-column label="请求方式" prop="requestMethod" width="200" show-overflow-tooltip />
				<el-table-column label="接口状态" prop="status" show-overflow-tooltip>
					<template #default="{ row }">
						<span v-if="row.status === 1">上线</span>
						<span v-else-if="row.status === 2">下线</span>
					</template>
				</el-table-column>
				<el-table-column label="接口版本" prop="version" show-overflow-tooltip />
				<el-table-column label="操作" width="440">
					<template #default="{ row, $index }">
						<el-button class="ml-1" text type="primary" @click="handleCommand('release', row, $index)" v-if="row.status == 2">发布</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('offLine', row, $index)" v-if="row.status == 1">下线</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('edit', row, $index)">编辑</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('editMarkdown', row, $index)">编辑文档</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('blackList', row, $index)">接口黑名单</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('whiteList', row, $index)">接口白名单</el-button>
						<el-button class="ml-1" text type="primary" @click="handleCommand('delete', row, $index)">删除</el-button>
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
import { getInterfaceList, deleteInterface, updateInterface } from '/@/api/openPlatform/interface';
import { useMessage } from '/@/hooks/message';

// 搜索变量
const queryRef = ref();

// 接口状态枚举列表
const statusList = [
	{ label: '上线', value: 1 },
	{ label: '下线', value: 2 },
];

// 请求方式枚举列表
const requestMethodsList = [
	{ label: 'POST', value: 'POST' },
	{ label: 'GET', value: 'GET' },
];

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getInterfaceList,
	dataList: [],
});
/**
 * 处理列表项的操作
 */
const handleCommand = (command: Table.Command, row: any, index: number) => {
	switch (command) {
		// 操作-发布
		case 'release':
			ElMessageBox.confirm(`请确认是否将 ${row.interfaceName} 接口发布`, '发布确认', {
				confirmButtonText: '发布',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					updateInterface({
						id: row.id,
						status: row.status === 1 ? 2 : 1,
					}).then((res) => {
						if (res.code === 0) {
							useMessage().success('发布成功');
							getDataList();
						}
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		// 操作-下线
		case 'offLine':
			ElMessageBox.confirm(`请确认是否将 ${row.interfaceName} 接口下线`, '下线确认', {
				confirmButtonText: '下线',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					updateInterface({
						id: row.id,
						status: row.status === 1 ? 2 : 1,
					}).then((res) => {
						if (res.code === 0) {
							useMessage().success('下线成功');
							getDataList();
						}
					});
				})
				.catch((err) => {
					console.log('err', err);
				});
			break;
		// 操作-编辑文档
		case 'editMarkdown':
			router.push({
				path: `/openPlatform/components/markdownEdit`,
				query: {
					id: row.id,
				},
			});
			break;
		// 操作-编辑
		case 'edit':
			router.push({
				path: `/openPlatform/interfaceManage/interfaceList/form`,
				query: {
					id: row.id,
					type: 'edit',
				},
			});
			break;
		// 操作-接口黑名单
		case 'blackList':
			router.push({
				path: '/openPlatform/interfaceManage/interfaceList/blackList',
				query: {
					interfaceId: row.interfaceId,
				},
			});
			break;
		// 操作-接口白名单
		case 'whiteList':
			router.push({
				path: '/openPlatform/interfaceManage/interfaceList/whiteList',
				query: {
					interfaceId: row.interfaceId,
				},
			});
			break;
		// 操作-删除
		case 'delete':
			ElMessageBox.confirm(`请确认是否将 ${row.interfaceName} 接口删除，删除动作无法恢复，请谨慎操作。`, '删除接口', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'info',
			})
				.then(() => {
					deleteInterface(row.id).then((res) => {
						getDataList();
					});
				})
				.catch((err) => {
					console.log('err', err);
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
