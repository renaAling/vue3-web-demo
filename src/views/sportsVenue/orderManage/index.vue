<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item label="guid">
						<el-input placeholder="请输入" v-model="state.queryForm.guid" clearable />
					</el-form-item>
					<el-form-item label="员工姓名">
						<el-input placeholder="请输入" v-model="state.queryForm.employeeName" clearable />
					</el-form-item>
					<el-form-item label="员工号">
						<el-input placeholder="请输入" v-model="state.queryForm.userJobNum" clearable />
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="请输入" v-model="state.queryForm.employeeMobile" clearable />
					</el-form-item>
					<el-form-item label="场馆名称">
						<el-input placeholder="请输入" v-model="state.queryForm.stadiumName" clearable />
					</el-form-item>
					<el-form-item label="场地类型">
						<el-input placeholder="请输入" v-model="state.queryForm.stadiumConfigName" clearable />
					</el-form-item>
					<el-form-item label="订单状态">
						<el-select v-model="state.queryForm.status" placeholder="请选择" clearable>
							<el-option label="待开始" :value="5"></el-option>
							<el-option label="已完成" :value="6"></el-option>
							<el-option label="已取消" :value="7"></el-option>
							<el-option label="不可用" :value="10"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否到场">
						<el-select v-model="state.queryForm.isAttendance" placeholder="请选择" clearable>
							<el-option label="是" :value="true"></el-option>
							<el-option label="否" :value="false"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="下单时间">
						<el-date-picker
							v-model="daterangeTime"
							:clearable="false"
							@change="changeTime"
							type="daterange"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row class="mb-4">
				<el-button @click="handleExport" type="primary">导出</el-button>
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
				<el-table-column prop="orderCode" label="订单编号" width="100" show-overflow-tooltip />
				<el-table-column prop="employeeName" label="员工姓名" width="100" />
				<el-table-column prop="guid" label="GUID" show-overflow-tooltip />
				<el-table-column prop="userJobNum" label="员工号" />
				<el-table-column prop="employeeMobile" label="手机号" />
				<el-table-column prop="createTime" label="下单时间" width="100" />
				<el-table-column prop="stadiumName" label="场馆名称" width="100" />
				<el-table-column prop="stadiumConfigName" label="场地类型" width="100" />
				<el-table-column prop="stadiumConfigSubName" label="场地名称" width="100" />
				<el-table-column prop="stadiumDate" label="预定日期" width="100" />
				<el-table-column prop="stadiumDate" label="预定日期段" width="100">
					<template #default="{ row }"> {{ row.startTime }} - {{ row.endTime }} </template>
				</el-table-column>
				<el-table-column prop="status" label="订单状态" width="120">
					<!-- 5-待开始，6-已完成，7-已取消 -->
					<template #default="{ row }">
						<el-tag v-if="row.status === 5">待开始</el-tag>
						<el-tag v-else-if="row.status === 6">已完成</el-tag>
						<el-tag v-else-if="row.status === 7">已取消</el-tag>
						<el-tag v-else-if="row.status === 10">不可用</el-tag>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column prop="isAttendance" label="是否到场" width="100">
					<template #default="{ row }">
						{{ row.isAttendance ? '已到场' : '-' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" width="220">
					<template #default="{ row }">
						<el-button link type="primary" v-if="row.status < 7 && !row.isAttendance" @click="handleArrive(row)">确认到场</el-button>
						<el-button link type="primary" v-if="row.status < 6 && !row.isAttendance" @click="handleCancel(row)">取消订单</el-button>
						<el-button link type="primary" @click="handleCheck(row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<OrderDetailDialog v-model="dialogVisible" :row="currentRow" @ok="getDataList" />
	</div>
</template>
<script lang="ts" setup name="orderManage">
import { ElMessageBox } from 'element-plus';
import { downBlobFile } from '/@/utils/other';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { orderPageApi, confirmAttendanceApi, cancelOrderApi, orderDetailApi } from '/@/api/sportsVenue/index';
import { list } from '/@/api/admin/role';

const OrderDetailDialog = defineAsyncComponent(() => import('../components/orderDetailDialog.vue'));

// 搜索变量
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: orderPageApi,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const daterangeTime = ref();
const changeTime = (val: any) => {
	state.queryForm.createStartTime = `${val[0]} 00:00:00`;
	state.queryForm.createEndTime = `${val[1]} 23:59:59`;
};

const handleExport = async () => {
	const params = { ...state.queryForm };
	downBlobFile('/stadium/order/export', params, '订单列表.xlsx');
};

const dialogVisible = ref(false);

const roleList = ref();
const getRoleList = async () => {
	const res = await list();
	roleList.value = res?.data;
};

const handleArrive = async (row: any) => {
	ElMessageBox.confirm('确认该用户已到场吗？', '确认到场', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const res = await confirmAttendanceApi(row.orderCode);
		if (res?.ok) {
			getDataList();
		}
	});
};

const handleCancel = async (row: any) => {
	ElMessageBox.confirm('确认取消订单吗？', '取消订单', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const res = await cancelOrderApi(row.orderCode);
		if (res?.ok) {
			getDataList();
		}
	});
};

const currentRow = ref();
const handleCheck = async (row: any) => {
	const { data } = await orderDetailApi(row.orderCode);
	currentRow.value = { ...data };
	dialogVisible.value = true;
};
// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {};
	daterangeTime.value = [];
	getDataList();
};

onMounted(() => {
	getRoleList();
});
</script>

<style scoped lang="scss"></style>
