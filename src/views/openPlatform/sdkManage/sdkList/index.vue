<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="SDK名称" prop="sdkName" show-overflow-tooltip />
				<el-table-column label="SDK版本" prop="sdkVersion" width="200" show-overflow-tooltip />
				<el-table-column label="文件大小" prop="sdkFileSize" width="200" show-overflow-tooltip />

				<el-table-column label="操作" width="340">
					<template #default="{ row, $index }">
						<el-button class="ml-1" text type="primary" @click="handleCommand('edit', row, $index)">编辑</el-button>

						<el-button class="ml-1" text type="primary" @click="handleCommand('editMarkdown', row, $index)">说明文档</el-button>
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
import { getSdkList, updateSdkStatus } from '/@/api/openPlatform/sdkInfo';
import { ElNotification } from 'element-plus';

const router = useRouter();
// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getSdkList,
	dataList: [],
});
/**
 * 处理列表项的操作
 */
const handleCommand = (command: Table.Command, row: any, index: number) => {
	switch (command) {
		// 说明文档
		case 'editMarkdown':
			router.push({
				path: `/openPlatform/components/markdownEdit`,
				query: {
					id: row.id,
					type: 'sdk',
				},
			});
			break;
		case 'edit':
			router.push({
				path: `/openPlatform/sdkManage/sdkList/form`,
				query: {
					id: row.id,
				},
			});
			break;
	}
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
