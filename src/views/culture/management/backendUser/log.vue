<template>
	<el-dialog :close-on-click-modal="false" title="日志" draggable v-model="visible" width="1200">
		<el-row class="ml10 mt-4">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
				<el-form-item :label="$t('syslog.logType')" prop="type">
					<el-select :placeholder="$t('syslog.inputLogTypeTip')" clearable v-model="state.queryForm.type">
						<el-option label="登录" :value="1" />
						<el-option label="权限变更" :value="2" />
						<el-option label="操作其他" :value="3" />
						<el-option label="删除" :value="4" />
						<el-option label="修改密码" :value="5" />
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('syslog.createTime')" prop="createTime">
					<el-date-picker
						:end-placeholder="$t('syslog.inputEndPlaceholderTip')"
						:start-placeholder="$t('syslog.inputStartPlaceholderTip')"
						range-separator="To"
						type="datetimerange"
						v-model="state.queryForm.createTime"
						value-format="YYYY-MM-DD HH:mm:ss"
					/>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }}</el-button>
					<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
				</el-form-item>
			</el-form>
		</el-row>
		<el-table
			:data="state.dataList"
			@sort-change="sortChangeHandle"
			v-loading="state.loading"
			border
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
		>
			<el-table-column :label="$t('syslog.index')" type="index" width="60" />
			<el-table-column :label="$t('syslog.title')" prop="title" show-overflow-tooltip></el-table-column>
			<el-table-column :label="$t('syslog.logType')" prop="type">
        <template #default="scope">
          <span>{{ statusMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
			<el-table-column :label="$t('syslog.remoteAddr')" prop="remoteAddr" show-overflow-tooltip></el-table-column>
			<el-table-column :label="$t('syslog.method')" prop="method" show-overflow-tooltip></el-table-column>
			<el-table-column :label="$t('syslog.time')" prop="time" show-overflow-tooltip>
				<template #default="scope">
					<span v-if="scope.row.time">{{ scope.row.time }}/ms</span>
				</template>
			</el-table-column>
			<el-table-column :label="$t('syslog.createTime')" prop="createTime" show-overflow-tooltip sortable="custom" width="200"></el-table-column>
		</el-table>
		<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"></pagination>
	</el-dialog>
</template>
<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { logPageList } from '/@/api/admin/log';

// 日志类型：1.登录，2.权限变更，3.操作其他，4.删除，5.修改密码
const statusMap: Record<number, string> = {
	1: '登录',
	2: '权限变更',
	3: '操作其他',
	4: '删除',
	5: '修改密码',
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: '',
		createTime: '',
    mobile: '',
	},
	selectObjs: [],
	pageList: logPageList,
	descs: ['create_time'],
});

const queryRef = ref();
const visible = ref(false);

const resetQuery = () => {
	queryRef.value?.resetFields();
	getDataList();
};

const openDialog = (mobile: string) => {
	visible.value = true;
  state.queryForm.mobile = mobile;
	getDataList();
};

const { getDataList, currentChangeHandle, sortChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

defineExpose({
	openDialog,
});
</script>