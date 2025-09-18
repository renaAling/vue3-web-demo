<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="运营商名称" prop="name">
						<el-input placeholder="请输入供应商名称查询" v-model="state.queryForm.name" clearable />
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" default-first-option clearable>
							<el-option v-for="(item, index) in StatusList" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="formDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary">新建</el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="ID" prop="code" />
				<el-table-column label="运营商名称" prop="name" show-overflow-tooltip />
				<el-table-column label="状态" prop="status" width="80">
					<template #default="{ row }">
						<span>{{ row.status === 1 ? '启用中' : '停用中' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="在售媒体数" prop="spuNum" show-overflow-tooltip width="100" />
				<el-table-column label="订单数" prop="orderNum" width="100">
					<template #default="{ row }">
						<span>{{ row.orderNum || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="售后数" prop="afterSaleNum" show-overflow-tooltip width="100">
					<template #default="{ row }">
						<span>{{ row.afterSaleNum || '——' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="340">
					<template #default="{ row }">
						<el-button type="primary" link icon="edit" @click="handleCommand('edit', row)">编辑</el-button>
						<el-button type="primary" link icon="delete" @click="handleCommand('delete', row)">删除</el-button>
						<el-button type="primary" link icon="unlock" @click="handleCommand('unlock', row)" v-if="row.status == 2">启用</el-button>
						<el-button type="primary" link icon="lock" @click="handleCommand('lock', row)" v-if="row.status == 1">停用</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="supplierManage" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getServiceProvidersList, serviceProvidersStatusUpdate, getRelatedById, serviceProvidersDelete } from '/@/api/ad/serviceProvider';
import { StatusList } from './enums';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 字典

// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getServiceProvidersList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const handleCommand = async (command: Table.Command, row: any) => {
	switch (command) {
		case 'unlock': // 启用
			try {
				await useMessageBox().confirm('请确认是否启用运营商', '启用');
			} catch {
				return;
			}

			try {
				const { id } = row;
				await serviceProvidersStatusUpdate({ id, status: 1 });
				useMessage().success('已启用');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'lock': // 停用
			try {
				const { data } = await getRelatedById(row.id);
				const { upSpuNum, afterSaleNum } = data;
				if (upSpuNum > 0) {
					await useMessageBox().confirm(
						`当前供应商有${upSpuNum}个媒体正在上架，有${afterSaleNum}个订单尚未完成，是否批量下架并停用运营商`,
						'停用运营商',
						'下架并停用'
					);
				} else {
					await useMessageBox().confirm(`是否确定停用运营商`, '停用运营商');
				}
			} catch {
				return;
			}

			try {
				const { id } = row;
				await serviceProvidersStatusUpdate({ id, status: 2 });
				useMessage().success('已停用');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'delete':
			try {
				const { data } = await getRelatedById(row.id);
				const { upSpuNum, afterSaleNum } = data;
				if (upSpuNum > 0) {
					await useMessageBox().confirm(
						`当前供应商有${upSpuNum}个商品正在上架，有${afterSaleNum}个订单尚未完成，是否批量下架并删除运营商`,
						'删除运营商',
						'下架并删除'
					);
				} else {
					await useMessageBox().confirm(`是否确定删除运营商`, '删除运营商');
				}
			} catch {
				return;
			}

			try {
				await serviceProvidersDelete(row.id);
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
		case 'edit': // 编辑
			formDialogRef.value.openDialog(row.id);
			break;
	}
};
</script>
