<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="返佣流水" name="first">
					<el-row shadow="hover">
						<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
							<el-form-item label="日期选择" prop="paymentTime">
								<el-date-picker
									v-model="paymentTime"
									@change="changeTime"
									type="daterange"
									range-separator="-"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									value-format="YYYY-MM-DD"
								/>
							</el-form-item>
							<el-form-item label="分销员姓名">
								<el-input v-model="state.queryForm.name" placeholder="请输入" clearable />
							</el-form-item>
							<el-form-item label="分销等级">
								<el-select v-model="state.queryForm.distributionLevelCode" placeholder="请选择" clearable>
									<el-option v-for="item in statusList" :key="item.levelCode" :label="item.levelName" :value="item.levelCode" />
								</el-select>
							</el-form-item>
							<el-form-item label="发放状态">
								<el-select v-model="state.queryForm.sendStatus" placeholder="请选择" clearable>
									<el-option label="未发放" :value="false" />
									<el-option label="已发放" :value="true" />
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
								<el-button icon="Refresh" @click="resetQuery">重置</el-button>
								<el-button type="primary" icon="Download" @click="exportExcelAll">
									{{ $t('common.exportBtn') }}
								</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						border
						row-key="id"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column label="序号" type="index" width="60" />
						<el-table-column prop="updateTime" label="时间" width="250" />
						<el-table-column prop="orderNo" label="订单编号">
							<template #default="scope">
								<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="分销员姓名" />
						<el-table-column prop="levelName" label="分销等级" />
						<el-table-column prop="totalPrice" label="订单金额" />
						<el-table-column prop="price" label="返佣金额" />
						<el-table-column prop="sendStatus" label="发放状态">
							<template #default="scope">
								<span v-if="scope.row.sendStatus">已发放</span>
								<span v-else>未发放</span>
							</template>
						</el-table-column>
					</el-table>
					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
				<el-tab-pane label="返佣月账单" name="second">
					<el-row shadow="hover">
						<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
							<el-form-item label="日期选择">
								<el-date-picker v-model="state.queryForm.billMonth" clearable type="month" value-format="YYYY-MM-01" />
							</el-form-item>
							<el-form-item label="分销员姓名">
								<el-input v-model="state.queryForm.distributionName" placeholder="请输入" clearable />
							</el-form-item>
							<el-form-item label="分销等级">
								<el-select v-model="state.queryForm.distributionLevelCode" placeholder="请选择" clearable>
									<el-option v-for="item in statusList" :key="item.levelCode" :label="item.levelName" :value="item.levelCode" />
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button icon="search" type="primary" @click="getDataList">查询</el-button>
								<el-button icon="Refresh" @click="resetQuery">重置</el-button>
								<el-button type="primary" icon="Download" @click="exportExcel">
									{{ $t('common.exportBtn') }}
								</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-table
						:data="state.dataList"
						v-loading="state.loading"
						border
						row-key="id"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column label="序号" type="index" width="60" />
						<el-table-column prop="billMonth" label="时间" width="250" />
						<el-table-column prop="distributionName" label="分销员姓名" />
						<el-table-column prop="levelName" label="分销等级" />
						<el-table-column prop="spreadCount" label="推广用户数量" />
						<el-table-column prop="spreadOrderNum" label="推广订单数" />
						<el-table-column prop="orderNum" label="有效订单数" />
						<el-table-column prop="brokerageTotalAmount" label="返佣总额" />
						<el-table-column prop="firstBrokerageAmount" label="一级返佣占比">
							<template #default="scope">
								<span>
									{{ scope.row.brokerageTotalAmount === 0 ? '0%' : ((scope.row.firstBrokerageAmount / scope.row.brokerageTotalAmount) * 100).toFixed(2) + '%' }}
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="secondBrokerageAmount" label="二级返佣占比">
							<template #default="scope">
								<span>
									{{ scope.row.brokerageTotalAmount === 0 ? '0%' : ((scope.row.secondBrokerageAmount / scope.row.brokerageTotalAmount) * 100).toFixed(2) + '%' }}
								</span>
							</template>
						</el-table-column>
					</el-table>
					<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { promotionOrder, distributionMonthBill, distributionLevelConfigList } from '/@/api/member/distributionManage';

const router = useRouter();
const activeName = ref('first');
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: promotionOrder,
	descs: [],
});
const paymentTime = ref([] as any);
const queryRef = ref();

const handleClick = (tab: TabsPaneContext) => {
	if (tab.props.name === 'first') {
		state.queryForm = {};
		state.pageList = promotionOrder;
	} else {
		state.queryForm = {};
		state.pageList = distributionMonthBill;
	}
	getDataList();
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	paymentTime.value = [];
  state.queryForm = {};
	getDataList();
};

const changeTime = (val: any) => {
	state.queryForm.startTime = `${val[0]} 00:00:00`;
	state.queryForm.endTime = `${val[1]} 23:59:59`;
};

const statusList = ref();
const distributionLevelConfigListApi = async () => {
	const res = await distributionLevelConfigList();
	statusList.value = res.data;
};

const handleGoDetail = (orderNo: string) => {
	router.push({
		path: '/culture/orderManage/orderList/orderDetail',
		query: {
			orderNo,
		},
	});
};

const exportExcelAll = () => {
	downBlobFile('/tracomps-admin/api/admin/platform/retail/store/promotion/order/getAll/export', state.queryForm, '返佣流水.xlsx');
}

const exportExcel = () => {
	downBlobFile('/tracomps-admin/api/admin/distributionMonthBill/export', state.queryForm, '返佣月账单.xlsx');
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle, downBlobFile } = useTable(state);

onMounted(() => {
	distributionLevelConfigListApi();
});
</script>
