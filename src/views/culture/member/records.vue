<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="用户名">
						<el-input placeholder="请输入用户名" v-model="state.queryForm.username" clearable />
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="请输入手机号" v-model="state.queryForm.mobile" clearable />
					</el-form-item>
					<el-form-item label="会员类型">
						<el-select v-model="state.queryForm.cardId" placeholder="请选择会员类型" clearable>
							<el-option :label="a.name" :value="a.id" v-for="(a, i) of memberList" :key="i"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="state.queryForm.isValid" placeholder="请选择状态" clearable>
							<el-option label="有效" :value="true"></el-option>
							<el-option label="已过期" :value="false"></el-option>
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
				v-loading="state.loading"
				row-key="id"
				border
				:cell-style="tableStyle?.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column label="序号" type="index" width="60" align="center" />
				<el-table-column label="订单号" prop="orderNo" show-overflow-tooltip>
					<template #default="scope">
						<span class="text-blue-400 cursor-pointer" @click="handleGoDetail(scope.row.orderNo)">{{ scope.row.orderNo }}</span>
					</template>
				</el-table-column>
				<el-table-column label="用户名" prop="username" />
				<el-table-column label="手机号" prop="mobile" />
				<el-table-column label="会员类型" prop="cardName" />
				<el-table-column label="支付金额" prop="payPrice" />
				<el-table-column label="购买时间" prop="payTime" />
				<el-table-column label="到期时间" prop="cardExpirationTime" />
				<el-table-column label="状态" prop="isValid">
					<template #default="scope">
						{{ scope.row.isValid ? '有效' : '已过期' }}
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" setup name="memberCards">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getOrderPageApi, memberListApi } from '/@/api/culture/member';

const router = useRouter();
// 搜索变量
const queryRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getOrderPageApi,
	queryForm: {},
	dataList: [],
});

const memberList = ref();
const getMemberList = async () => {
	const res = await memberListApi({});
	memberList.value = res.data || [];
};

const handleGoDetail = (orderNo: string) => {
	router.push({
		path: '/culture/orderManage/orderList/orderDetail',
		query: {
			orderNo,
		},
	});
};

onMounted(() => {
	getMemberList();
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	getDataList();
};
</script>
