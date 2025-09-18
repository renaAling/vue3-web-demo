<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="账单时间" prop="roleName">
						<el-date-picker
							v-model="state.queryForm.billTimeStart"
							value-format="YYYY-MM"
							style="width: 180px"
							type="month"
							placeholder="开始时间"
							:disabled-date="disabledStartDate"
						/>
						<span class="mx-2">-</span>
						<el-date-picker
							v-model="state.queryForm.billTimeEnd"
							value-format="YYYY-MM"
							style="width: 180px"
							type="month"
							placeholder="结束时间"
							:disabled-date="disabledEndDate"
						/>
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
				<el-table-column prop="billName" label="账单名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="billDate" label="账单日期" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="生成时间" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleDesc" label="操作" show-overflow-tooltip>
					<template #default="scope">
						<el-button text type="primary" @click="downExcel(scope.row.billDate)"> 下载 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="billIndex">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList, downloadBill } from '/@/api/pay/report';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus';
import { useMessage } from '/@/hooks/message';
const { t } = useI18n();
const queryRef = ref();
const showSearch = ref(true);
const router = useRouter();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: pageList,
});

// 根据开始日期动态计算结束日期的禁用日期
const disabledEndDate = computed(() => {
	return (time: any) => {
		const currentMonth = new Date();
		currentMonth.setMonth(currentMonth.getMonth() - 1);
		if (!state.queryForm.billTimeStart) return time.getTime() > currentMonth.getTime(); // 不能选择当月
		const startDateValue = new Date(state.queryForm.billTimeStart);
		const endDateLimit = new Date(startDateValue);
		endDateLimit.setMonth(endDateLimit.getMonth() + 2); // 两个月后的日期作为限制
		// 禁用开始日期之前的日期和90天后的日期
		return time.getTime() < startDateValue.getTime() || time.getTime() > endDateLimit.getTime() || time.getTime() > currentMonth.getTime();
	};
});

// 根据结束日期动态计算开始日期的禁用日期
const disabledStartDate = computed(() => {
	return (time: any) => {
		const currentMonth = new Date();
		currentMonth.setMonth(currentMonth.getMonth() - 1);
		if (!state.queryForm.billTimeEnd) return time.getTime() > currentMonth.getTime(); // 不能选择当月
		const eddDateValue = new Date(state.queryForm.billTimeEnd);
		const startDateLimit = new Date(eddDateValue);

		startDateLimit.setMonth(startDateLimit.getMonth() - 2); // 两个月前的日期作为限制
		// 禁用开始日期之前的日期和90天后的日期
		return time.getTime() > eddDateValue.getTime() || time.getTime() < startDateLimit.getTime() || time.getTime() > currentMonth.getTime();
	};
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle, downBlobFile } = useTable(state);

// 下载
const downExcel = (billDate: string) => {
	downloadBill({ billiMonth: billDate })
		.then((res) => {
			ElMessageBox.confirm('报表下载中,请前往下载中心查看。', '提示', {
				center: true,
				showClose: false,
				showCancelButton: false,
				confirmButtonText: '确定',
				type: 'warning',
				closeOnClickModal: false,
				closeOnPressEscape: false,
			}).then(() => {
				router.push('/downloadCenter');
			});
		})
		.catch((err) => {
			return useMessage().error(err.msg);
		});
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm.billTimeStart = '';
	state.queryForm.billTimeEnd = '';
	getDataList();
};
</script>
