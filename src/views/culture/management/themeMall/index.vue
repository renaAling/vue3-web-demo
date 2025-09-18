<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('themeMall.name')" prop="name">
						<el-input :placeholder="$t('themeMall.inputTip')" style="max-width: 180px" v-model="state.queryForm.name" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleAdd" class="ml10" icon="folder-add" type="primary" v-auth="'sys_post_add'">
						{{ $t('common.addBtn') }}
					</el-button>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column :label="t('themeMall.index')" type="index" width="60" />
				<el-table-column :label="t('themeMall.name')" prop="name" show-overflow-tooltip />
				<el-table-column :label="t('themeMall.remark')" prop="remark" show-overflow-tooltip />
				<el-table-column :label="t('themeMall.status')" prop="status">
					<template #default="scope">
						<el-switch
							v-model="scope.row.status"
							inline-prompt
							active-text="是"
							inactive-text="否"
							:active-value="1"
							:inactive-value="0"
							:before-change="() => beforeChangeStatus(scope.row)"
						/>
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="200">
					<template #default="scope">
						<el-button icon="edit-pen" @click="formDialogRef.openDialog(scope.row.id)" text type="primary" v-auth="'sys_post_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="systemPost" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { themeMallPage, themeMallUpdate } from '/@/api/culture/management';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();

// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: themeMallPage,
});

const handleAdd = () => {
	try {
		useMessageBox().alert('请联系系统管理员申请新建主题商城', '新建主题商城说明', '知道了');
	} catch {
		return false;
	}
};

const beforeChangeStatus = async (row: any) => {
	const status = row.status === 1 ? 0 : 1;
	try {
		const res = await themeMallUpdate({ id: row.id, status });
		res?.ok && useMessage().success(`${status === 1 ? '启用' : '禁用'}成功`);
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
</script>
