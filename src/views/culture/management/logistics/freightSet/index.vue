<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="模板名称" prop="keywords">
						<el-input
							v-model="state.queryForm.keywords"
							placeholder="请输入模板名称"
							class="selWidth"
							clearable
							@keyup.enter.native="getDataList"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" type="primary">查询</el-button>
						<el-button @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="formDialogRef?.openDialog()" class="ml10" icon="folder-add" type="primary"> 新增 </el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="merchantId"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="ID" prop="id" />
				<el-table-column label="模板名称" prop="name"></el-table-column>
				<el-table-column label="计费方式" prop="type">
					<template #default="{ row }: { row: { type: number } }">
						<span>{{ statusMap[row.type as keyof typeof statusMap] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="包邮方式" prop="appoint">
					<template #default="{ row }">
						<span>{{ typeMap[row.appoint]}}</span>
					</template>
				</el-table-column>
				<el-table-column label="排序" prop="sort"></el-table-column>
				<el-table-column label="创建时间" prop="createTime"></el-table-column>
				<el-table-column label="操作" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="formDialogRef?.openDialog(row.id)">编辑</el-button>
						<el-button type="primary" link @click="bindDel(row)" >删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 编辑  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { shippingTemplatesList } from '/@/api/culture/logistics';
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
import type { ComponentPublicInstance } from 'vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { shippingDetete } from '/@/api/culture/merchant/logistics';

type FormDialogInstance = ComponentPublicInstance<{ openDialog: (code?: string) => void }>;

const formDialogRef = ref<FormDialogInstance | null>(null);
const statusMap: Record<number, string> = {
		0: '无',
		1: '按件数',
		2: '按重量',
		3: '按体积',
	  };
const typeMap: Record<number, string> = {
		0: '全国包邮',
        1: '部分包邮',
        2: '自定义',
	  }; 
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: shippingTemplatesList,
	queryForm: {},
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const bindDel = async (row: any) => { 
	try {
				await useMessageBox().confirm(`是否确定删除运费模板`, '删除运费模板');
			} catch {
				return;
			}
			try {
				const { code, msg } = await shippingDetete({id: row.id});
				if (code === 0) {
					useMessage().success('删除成功');
					getDataList();
				} else {
					useMessage().error(msg);
				}
			} catch (err: any) {
				useMessage().error(err.msg);
			}
};
const handleReset = () => {
	state.queryForm = {};
	getDataList();
};
</script>
