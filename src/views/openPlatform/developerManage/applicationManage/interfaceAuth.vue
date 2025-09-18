<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="接口名称" prop="interfaceName">
						<el-input placeholder="请输入接口名称" v-model="state.queryForm.interfaceName" clearable style="width: 230px" />
					</el-form-item>
					<el-form-item label="请求方式" prop="requestMethod">
						<el-select v-model="state.queryForm.requestMethod" placeholder="请选择接口状态" style="width: 230px" clearable>
							<el-option v-for="(item, index) in requestMethodsList" :key="index" :label="item.label" :value="item.value"></el-option>
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
				<el-table-column label="接口名称" prop="interfaceName" show-overflow-tooltip />
				<el-table-column label="路径" prop="uri" show-overflow-tooltip />
				<el-table-column label="请求方式" prop="requestMethod" width="100" show-overflow-tooltip />
				<el-table-column label="接口版本" prop="version" show-overflow-tooltip width="100" />
				<el-table-column label="操作" width="150">
					<template #default="{ row, $index }">
						<span v-if="row.authorizeStatus == 1">已授权白名单</span>
						<span v-if="row.authorizeStatus == 2">黑名单</span>
						<el-button v-if="row.authorizeStatus == 9" class="ml-1" text type="primary" @click="handleAddAuth(row)"> 添加授权 </el-button>
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
import { getInterfaceAuthList, addInterfaceAuth } from '/@/api/openPlatform/application';
import { useMessage } from '/@/hooks/message';

const route = useRoute();
// 搜索变量
const queryRef = ref();

// 请求方式枚举列表
const requestMethodsList = [
	{ label: 'POST', value: 'POST' },
	{ label: 'GET', value: 'GET' },
];

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		appId: route?.query.appId,
	},
	pageList: getInterfaceAuthList,
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

interface InterfaceRow {
	interfaceId: string;
}
const handleAddAuth = (row: InterfaceRow) => {
	ElMessageBox.confirm('是否确认授权该接口？', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			addInterfaceAuth({
				interfaceId: row.interfaceId,
				appId: route.query.appId,
			})
				.then((res) => {
					if (res.code === 0) {
						useMessage().success('授权成功');
						getDataList();
					} else {
						useMessage().error('授权失败，请稍后再试');
					}
				})
				.catch((err) => {
					console.log('err', err);
					useMessage().error('授权失败，请稍后再试');
				});
		})
		.catch((err) => {
			console.log('err', err);
		});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
