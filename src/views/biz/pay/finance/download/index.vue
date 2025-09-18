<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="账单时间" prop="date">
						<el-date-picker
							v-model="state.queryForm.date"
							type="month"
							placeholder="请选择"
							:disabled-date="disabledDate"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item label="账单渠道" prop="payType">
						<el-select placeholder="请选择账单渠道" style="width: 180px" clearable v-model="state.queryForm.payType">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in typeList" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="index" label="序号" width="80" />
				<el-table-column prop="name" label="账单名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleDesc" label="操作" show-overflow-tooltip>
					<template #default="scope">
						<el-button text type="primary" @click="downExcel(scope.row.fileUrl)"> 下载 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="billIndex">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getReconciliationPage } from '/@/api/pay/finance';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus';
import { useMessage } from '/@/hooks/message';
import { typeList } from '/@/hooks/enums';

const { t } = useI18n();
const queryRef = ref();
const showSearch = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getReconciliationPage,
});

const disabledDate = (time: Date) => {
	return time.getTime() > Date.now();
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle, downBlobFile } = useTable(state);

// 下载
const downExcel = (url: string) => {
	const link = document.createElement('a');
	link.href = url;
	link.download = ''; // 如果需要指定下载文件名，可以在这里设置
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.billTimeStart = '';
	state.queryForm.billTimeEnd = '';
	getDataList();
};
</script>
