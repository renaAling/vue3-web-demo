<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="formDialogRef.openDialog()" formDialogRef icon="folder-add" type="primary">
						{{ $t('common.addBtn') }}
					</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="序号" fixed type="index" width="60" />
				<el-table-column label="平台名称" prop="name" show-overflow-tooltip />
				<el-table-column label="已对接支付渠道" prop="payTypes" show-overflow-tooltip />
				<el-table-column label="状态" prop="status" show-overflow-tooltip>
					<template #default="scope">
						<div :class="scope.row.status ? 'text-[#67c23a]' : 'text-[#f56c6c]'">{{ scope.row.status ? '开启' : '关闭' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip />
				<el-table-column label="操作人" prop="updateBy" show-overflow-tooltip />
				<el-table-column label="操作" fixed="right" width="150">
					<template #default="scope">
						<el-switch
							v-model="scope.row.status"
							style="--el-switch-on-color: #67c23a; --el-switch-off-color: #f56c6c"
							:before-change="() => beforeChange(scope.row)"
						/>
					</template>
				</el-table-column>
			</el-table>
			<!-- <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" /> -->
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList(false)" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="systemPayChannel" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList, updateStatus } from '/@/api/pay/abutment';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./abutForm.vue'));
const { t } = useI18n();
// 定义变量内容
const formDialogRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	isPage: false,
	pageList: pageList,
	pagination: {},
});

//  table hook
const { getDataList, tableStyle } = useTable(state);

const beforeChange = async (row: any) => {
	const msg = row.status ? '确定要关闭该账户吗?' : '确定要开启该账户吗?';
	try {
		await useMessageBox().confirm(msg);
	} catch {
		return;
	}
	try {
		const data = {
			code: row.code,
			status: !row.status,
		};
		let res = await updateStatus(data);
		if (res.code != 0) {
			return useMessage().error(res.msg);
		}
		getDataList();
		return true;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
