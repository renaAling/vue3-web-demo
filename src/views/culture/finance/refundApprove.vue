<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="订单号">
						<el-input v-model.trim="state.queryForm.orderNo" placeholder="请输入订单号" clearable></el-input>
					</el-form-item>
					<el-form-item label="当前状态">
						<el-select v-model="state.queryForm.refundStatus" placeholder="请选择当前状态" clearable>
							<el-option label="全部" :value="8"></el-option>
							<el-option label="商家拒绝" :value="1"></el-option>
							<el-option label="已退款" :value="3"></el-option>
							<el-option label="财务待审核" :value="7"></el-option>
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
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="orderNo" show-overflow-tooltip label="订单号">
					<template #default="scope">
						<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</span>
          </template>
        </el-table-column>
				<el-table-column v-if="tenantId != '1922177185280557058'" prop="refundPrice" label="退款金额" />
				<el-table-column v-if="tenantId == '1922177185280557058'" prop="refundScorePrice" label="退款积分" />
				<el-table-column prop="createTime" label="申请时间" />
				<el-table-column prop="refundReasonWap" show-overflow-tooltip label="退款原因" />
				<el-table-column prop="refundStatus" label="当前状态">
					<template #default="scope">
						<span>{{ statusMap[scope.row.refundStatus] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="scope">
						<div class="flex justify-center items-center">
							<el-button text type="primary" @click="handleCheck(scope.row.refundOrderNo)">查看</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 详情 -->
		<DetailsForm ref="orderDetailRef" />
	</div>
</template>
<script lang="ts" setup name="couponIndex">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { refundListApi } from '/@/api/culture/order';
import { Session } from '/@/utils/storage';

const tenantId = ref(Session.getTenant());
const router = useRouter();
const DetailsForm = defineAsyncComponent(() => import('./components/orderDetail.vue'));
const orderDetailRef = ref();

// 日志类型：1.登录，2.权限变更，3.操作其他，4.删除，5.修改密码
const statusMap: Record<number, string> = {
	1: '商家拒绝',
	2: '退款中',
	3: '已退款',
	7: '财务待审核',
};

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: refundListApi,
	queryForm: {
		refundStatus: 8,
	},
	dataList: [],
});
const timeVal = ref();
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleGoDetail = (orderNo: string) => {
	router.push({
		path: '/culture/orderManage/orderList/orderDetail',
		query: {
			orderNo,
		},
	});
}
const handleCheck = (refundOrderNo: string) => {
	orderDetailRef.value.openDetail(refundOrderNo);
};
const onchangeTime = (val: any) => {
	if (val) {
		timeVal.value = val;
		state.queryForm.dateLimit = val.join(',');
	} else state.queryForm.dateLimit = '';
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	state.queryForm.refundStatus = 8;
	timeVal.value = [];
	getDataList();
};
</script>

<style scoped lang="scss"></style>
