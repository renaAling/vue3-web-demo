<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="发票类型">
						<el-select v-model="state.queryForm.invoiceType" placeholder="请选择发票类型" clearable>
							<el-option label="普票" :value="1"></el-option>
							<el-option label="专票" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择日期">
						<el-date-picker v-model="timeVal" format="YYYY-MM-DD" value-format="YYYY-MM-DD" unlink-panels type="daterange" @change="onchangeTime" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" min-width="50" />
				<el-table-column prop="invoiceType" label="发票类型">
					<template #default="scope">
						<span>{{ scope.row.invoiceType === 1 ? '普票' : '专票' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="headerInfo" show-overflow-tooltip label="抬头信息" />
				<el-table-column prop="headerType" label="抬头类型">
					<template #default="scope">
						<span>{{ scope.row.headerType === 1 ? '个人' : '单位' }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="taxNumber" show-overflow-tooltip label="税号">
          <template #default="scope">
						<span>{{ scope.row.headerType === 1 ? '-' : scope.row.taxNumber }}</span>
					</template>
        </el-table-column>
				<el-table-column prop="amount" label="金额" />
				<el-table-column prop="mobile" label="联系电话" width="120" />
				<el-table-column prop="relatedOrderId" label="关联订单号" width="210">
					<template #default="scope">
						<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.relatedOrderId)">{{ scope.row.relatedOrderId }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="applyTime" label="申请时间" />
				<el-table-column prop="billingStatus" label="开票状态">
					<template #default="scope">
						<span>{{ statusMap[scope.row.billingStatus as number] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150" fixed="right">
					<template #default="scope">
						<div class="flex justify-center items-center">
							<el-button v-if="scope.row.billingStatus === 1" text type="primary" @click="(visibleUpload = true), (checkRow = scope.row)">上传发票</el-button>
							<el-button v-else text type="primary" @click="handleCheck(scope.row.id)">查看</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 详情 -->
		<Invoicing ref="invoicing" />
		<el-dialog title="上传发票" v-model="visibleUpload" :close-on-click-modal="false" draggable>
			<upload-file @change="refresh" :fileType="['pdf']" />
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="invoice">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
import { invoiceInfoListApi, uploadInvoiceInfoApi } from '/@/api/culture/finance';

const router = useRouter();
const Invoicing = defineAsyncComponent(() => import('./components/Invoicing.vue'));
const invoicing = ref();
const visibleUpload = ref(false);

// 开票状态:1.待开票 2.已开票 3.已作废
const statusMap: Record<number, string> = {
	1: '待开票',
	2: '已开票',
	3: '已作废',
};

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: invoiceInfoListApi,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const handleCheck = (id: string) => {
	invoicing.value.dialogVisible = true;
	invoicing.value.getDetail(id);
};

const checkRow = ref();
const refresh = (url: string) => {
  if(url) {
    uploadInvoiceInfoApi({
      id: checkRow.value.id,
      invoiceUrl: url,
    }).then((res: any) => {
      if (res.ok) {
        visibleUpload.value = false;
        useMessage().success('上传成功');
        getDataList();
      } else {
        useMessage().error(res.msg);
      }
    });
  }
};
const handleGoDetail = (orderNo: string) => {
	router.push({
		path: '/culture/orderManage/orderList/orderDetail',
		query: {
			orderNo,
		},
	});
};

const timeVal = ref();
const onchangeTime = (val: any) => {
	if (val) {
		timeVal.value = val;
		state.queryForm.startTime = `${val[0]} 00:00:00`;
		state.queryForm.endTime = `${val[1]} 23:59:59`;
	}
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	timeVal.value = [];
	state.queryForm.invoiceType = '';
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
</script>

<style scoped lang="scss"></style>
