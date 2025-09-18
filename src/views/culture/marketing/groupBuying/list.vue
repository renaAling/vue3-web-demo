<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="justify-between">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="拼团ID">
						<el-input v-model.trim="state.queryForm.code" placeholder="请输入拼团ID" clearable></el-input>
					</el-form-item>
					<el-form-item label="商品名称">
						<el-input v-model.trim="state.queryForm.productName" placeholder="请输入商品名称" clearable></el-input>
					</el-form-item>
					<el-form-item label="开团时间">
						<el-date-picker v-model="timeVal" format="YYYY-MM-DD" value-format="YYYY-MM-DD" unlink-panels type="daterange" @change="onchangeTime" />
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.status" placeholder="请选择状态" clearable>
							<el-option label="拼团中" :value="1"></el-option>
							<el-option label="已完成" :value="2"></el-option>
							<el-option label="拼团失败" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="stateForm.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" label="序号" min-width="50" />
				<el-table-column prop="code" :show-overflow-tooltip="true" label="拼团ID" />
				<el-table-column prop="name" label="开团团长" />
				<el-table-column prop="startTime" label="开团时间">
					<template #default="scope">
						<span>{{ dayjs(scope.row.startTime).format('YYYY-MM-DD') }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="productName" label="商品名称" />
				<el-table-column prop="groupBuyCount" label="拼团人数" />
				<el-table-column prop="partCount" label="参与人数" />
				<el-table-column prop="endTime" label="结束时间">
					<template #default="scope">
						<span>{{ dayjs(scope.row.endTime).format('YYYY-MM-DD') }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态">
					<template #default="scope">
						<span>{{ statusMap[scope.row.status] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="scope">
						<div class="flex justify-center items-center">
							<el-button text type="primary" @click="handleCheck(scope.row.code)">查看详情</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" title="查看详情">
			<el-table :data="groupBuyTable" row-key="groupBuyCode" border :cell-style="tableStyle?.cellStyle" :header-cell-style="tableStyle?.headerCellStyle">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="payTime" label="时间" />
				<el-table-column prop="orderNo" label="订单编号">
					<template #default="scope">
						<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="realName" label="用户名" />
				<el-table-column prop="mobile" label="手机号" />
				<el-table-column prop="payPrice" label="金额" />
				<el-table-column prop="status" label="订单状态">
          <template #default="scope">
						<span>{{ orderStatusMap[scope.row.status] }}</span>
					</template>
        </el-table-column>
			</el-table>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts" setup name="groupBuyingList">
import dayjs from 'dayjs';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { groupBuyListApi, groupBuyTableApi } from '/@/api/culture/groupBuying';

const router = useRouter();
// 拼团状态1：待开始，2：进行中，3：已结束
const statusMap: Record<number, string> = {
	1: '拼团中',
	2: '已完成',
	3: '拼团失败',
};

// 0-待支付，1-待发货/待备货，2-部分发货/备货中，3-待核销，4-待收货，5-已收货，6-已完成，9-已取消，10-已退款
const orderStatusMap: Record<number, string> = {
	0: '待支付',
	1: '待发货',
	2: '备货中',
	3: '待核销',
	4: '待收货',
	5: '已收货',
	6: '已完成',
	9: '已取消',
	10: '已退款',
};

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: groupBuyListApi,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const stateForm = reactive({
	loading: false,
});

const dialogVisible = ref(false);
const groupBuyTable = ref([]);
const handleCheck = (code: string) => {
	dialogVisible.value = true;
	groupBuyTableApi({ code }).then((res) => {
    groupBuyTable.value = res.data;
	});
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
	state.queryForm.code = '';
	state.queryForm.productName = '';
	state.queryForm.status = '';
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
</script>

<style scoped lang="scss"></style>
