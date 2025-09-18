<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id" border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="产品" prop="num" />
				<el-table-column label="说明" prop="name" show-overflow-tooltip />
				<el-table-column label="门店数" prop="contactName" show-overflow-tooltip />
				<el-table-column label="操作" width="340">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCommand('edit', row)">下发</el-button>
						<!-- <el-button type="primary" link @click="handleCommand('delete', row)">删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="gs-business" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import router from '/@/router';
import { supplierList, supplierDel, statusUpdate, getRelatedById } from '/@/api/culture/supplier';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: supplierList,
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
		case 'edit': // 编辑
			formDialogRef.value.openDialog(row.id);
			break;
		case 'delete':
			try {
				const { data } = await getRelatedById(row.id);
				const { upSpuNum, afterSaleNum } = data;
				if (upSpuNum > 0) {
					await useMessageBox().confirm(
						`当前供应商有${upSpuNum}个商品正在上架，有${afterSaleNum}个订单尚未完成，是否批量下架并删除供应商`,
						'删除供应商',
						'下架并删除'
					);
				} else {
					await useMessageBox().confirm(`是否确定删除供应商`, '删除供应商');
				}
			} catch {
				return;
			}
			try {
				await supplierDel(row.id);
				useMessage().success('删除成功');
				getDataList();
			} catch (err: any) {
				useMessage().error(err.msg);
			}
			break;
	}
};
const handelUserList = (id: string) => {
	router.push({
		path: '/culture/cultureProducts/supplierManage/userList',
		query: { id },
	});
};
</script>
