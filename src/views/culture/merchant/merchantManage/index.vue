<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb-[10px]">
				<el-button type="primary" :disabled="canBatchFreeze" @click="handlBatchFreeze">批量冻结</el-button>
				<el-button type="primary" :disabled="canBatchThawing" @click="handlBatchThawing">批量解冻</el-button>
			</div>
			<el-table
				border
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column label="序号" type="index" width="60" />
				<el-table-column label="运营机构" prop="name">
					<template #default="{ row }">
						<span>{{ row.name || '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="联系人" prop="contactName">
					<template #default="{ row }">
						<span>{{ row.contactName || '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="联系电话" prop="contactPhone">
					<template #default="{ row }">
						<span>{{ row.contactPhone || '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="已开通收款渠道数" prop="payCount">
					<template #default="{ row }">
						<span>{{ row.payCount || '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="入驻时间" prop="entryTime">
					<template #default="{ row }">
						<span>{{ row.entryTime || '-' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="资质审核状态" prop="reviewStatus">
					<template #default="{ row }">
            <el-tag v-if="row.reviewStatus === 1">通过</el-tag>
            <el-tag v-else-if="row.reviewStatus === 2">未通过</el-tag>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" width="180">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleCheck(row)">查看</el-button>
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="primary" link @click="handleChangeLog(row)">变更日志</el-button>
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
import { getBusinessPage, batchUpdateReviewStatus } from '/@/api/culture/merchant/merchantManage';

const router = useRouter();

interface User {
	id: number;
	date: string;
	name: string;
	address: string;
}

const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const formDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getBusinessPage,
	queryForm: {},
	dataList: [],
});

const canBatchFreeze = computed(() => {
	return multipleRow.value?.some((item: any) => item.reviewStatus === 2) || multipleSelection.value.length === 0;
})

const canBatchThawing = computed(() => {
	return multipleRow.value?.some((item: any) => item.reviewStatus === 1) || multipleSelection.value.length === 0;
})

// 审核状态：1.通过 2.未通过
const handlBatchFreeze = () => {
  batchUpdateReviewStatus({ ids: multipleSelection.value, reviewStatus: 2 }).then(() => {
    getDataList();
  })
};
const handlBatchThawing = () => {
  batchUpdateReviewStatus({ ids: multipleSelection.value, reviewStatus: 1 }).then(() => {
    getDataList();
  })
};

const multipleSelection = ref([]);
const multipleRow = ref([]);
const handleSelectionChange = (val: User[]) => {
  multipleRow.value = val as any;
	multipleSelection.value = val.map((item) => item.id) as any;
};

const handleChangeLog = (row: any) => {
  router.push({ path: '/culture/merchant/merchantManage/changeLog', query: { businessCode: row.code } });
};

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleEdit = (row: any) => {
	formDialogRef.value.openDialog(row.code, false);
};
const handleCheck = (row: any) => {
	formDialogRef.value.openDialog(row.code, true);
}
</script>
<style lang="scss" scoped>
:deep(.el-table--border th.el-table__cell .el-checkbox) {
  display: none !important;
}
</style>
