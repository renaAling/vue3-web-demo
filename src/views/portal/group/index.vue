<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="组名称" prop="name">
						<el-input placeholder="请输入分组名称查询" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleCommand('add', {})" class="ml10" icon="folder-add" type="primary">新建</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				class="my-table"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				ref="tableRef"
			>
				<el-table-column label="序号" type="index" width="100" />
				<el-table-column label="分组名称" prop="name" />
				<el-table-column label="系统入口" prop="sysEntranceName">
					<template #default="{ row }">
						{{ row.sysEntranceName ? row.sysEntranceName.join('，') : '--' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="240">
					<template #default="{ row }">
						<el-button type="primary" link icon="sort">拖拽排序</el-button>
						<el-button type="primary" link icon="delete" @click="handleCommand('delete', row)">删除</el-button>
						<el-button type="primary" link icon="edit" @click="handleCommand('edit', row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 配置配置  -->
		<config-dialog @refresh="getDataList()" ref="configDialogRef" />
	</div>
</template>

<script lang="ts" name="portal-group-index" setup>
import Sortable from 'sortablejs';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { delGroup, groupList, updateSequence } from '/@/api/portal';

// 引入组件
const ConfigDialog = defineAsyncComponent(() => import('./config.vue'));

// 定义变量内容
const queryRef = ref();
const configDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: groupList,
	isPage: false,
	queryForm: { name: '' },
	dataList: [],
	descs: ['create_time'],
});
//  table hook
const { getDataList, tableStyle } = useTable(state);
const initDrag = () => {
	const el = document.querySelector('.my-table tbody');
	if (el) {
		Sortable.create(el as HTMLElement, {
			async onEnd({ newIndex, oldIndex }) {
				// TODO
				let arr = state.dataList;
				console.log('arr前', arr);
				if (!Array.isArray(arr)) {
					return;
				}
				// 确保 oldIndex 和 newIndex 是有效的数字
				const validOldIndex = oldIndex !== undefined ? oldIndex : 0;
				const validNewIndex = newIndex !== undefined ? newIndex : 0;
				// 获取移动的 item
				const dragItem = arr.splice(validOldIndex, 1)[0];
				// 插入新位置
				arr.splice(validNewIndex, 0, dragItem);
				const params = arr.map((dragItem) => {
					return {
						id: dragItem.id,
						sequence: dragItem.sequence,
					};
				});
				const { code } = await updateSequence(params);
				if (code === 0) {
					useMessage().success('排序成功');
					getDataList();
				}
			},
		});
	}
};
const handleCommand = async (command: Table.Command, row: any) => {
	const { id } = row;
	switch (command) {
		case 'delete': // 删除
			try {
				useMessageBox()
					.confirm(`是否删除该分组`)
					.then(async () => {
						try {
							const { code, msg } = await delGroup({ id });
							if (code === 0) {
								useMessage().success(`删除成功`);
								getDataList();
							} else {
								useMessage().error(msg);
							}
						} catch (err: any) {
							useMessage().error(err.msg);
						}
					})
					.catch(() => {});
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'add': // 新增
			configDialogRef.value.openDialog();
			break;
		case 'edit': // 编辑
			configDialogRef.value.openDialog(id);
			break;
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
onMounted(() => {
	initDrag();
});
</script>
<style lang="scss" scoped>
.img-center {
	display: block;
	width: 100px;
	height: 100px;
	// margin: 0 auto;
}
</style>
