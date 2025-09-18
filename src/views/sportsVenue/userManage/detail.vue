<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" style="overflow: auto">
			<div @click="router.go(-1)" class="flex items-center cursor-pointer mb-2">
				<el-icon class="mr-[4px]">
					<ArrowLeftBold />
				</el-icon>
				返回
			</div>
			<el-descriptions title="用户详情">
				<el-descriptions-item label="员工姓名">{{ userInfo?.nickName }}</el-descriptions-item>
				<el-descriptions-item label="员工号">{{ userInfo?.userJobNum }}</el-descriptions-item>
				<el-descriptions-item label="手机号">{{ userInfo?.mobile }}</el-descriptions-item>
				<el-descriptions-item label="创建时间">{{ userInfo?.createTime }}</el-descriptions-item>
				<el-descriptions-item label="总预定次数">{{ userInfo?.orderNum }}</el-descriptions-item>
				<el-descriptions-item label="状态">
					<span v-if="userInfo?.isBlack">已加入黑名单</span>
					<span v-else>正常</span>
					<span v-if="userInfo?.isBlack" class="text-[#4785ea] hover:text-[#a3c2f4] cursor-pointer ml-3" @click="handleRemoveBlack(userInfo)"
						>移出黑名单</span
					>
					<span v-else class="text-[#4785ea] hover:text-[#a3c2f4] cursor-pointer ml-3" @click="handleAddBlack(userInfo)">加入黑名单</span>
				</el-descriptions-item>
			</el-descriptions>
			<div>
				<div class="text-[16px] font-bold text-[#303133] mb-4">预定记录</div>
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
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
						<el-form-item>
							<el-button @click="getDataList" icon="search" type="primary">查询</el-button>
							<el-button @click="resetQuery" icon="Refresh">重置</el-button>
						</el-form-item>
					</el-form>
				</el-row>
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					row-key="userId"
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
							<el-button link type="primary" @click="viewDetails(row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
			<OrderDetailDialog v-model="dialogVisible" :row="currentRow" />
		</div>
	</div>
</template>
<script lang="ts" setup name="userManage">
import { ElMessage, ElMessageBox } from 'element-plus';
import { BasicTableProps, useTable } from '/@/hooks/table';
import {
	appEmployeeUpdateApi,
	appEmployeeInfoApi,
	orderPageApi,
	orderDetailApi,
	confirmAttendanceApi,
	cancelOrderApi,
} from '/@/api/sportsVenue/index';

const OrderDetailDialog = defineAsyncComponent(() => import('../components/orderDetailDialog.vue'));

const route = useRoute();
const router = useRouter();

// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: orderPageApi,
	queryForm: {
		userId: route.query.userId,
	},
	dataList: [],
});

const userInfo = ref({
	nickName: '-',
	userJobNum: '-',
	mobile: '-',
	createTime: '-',
	orderNum: '-',
	isBlack: null,
});
const getEmployeeInfo = async () => {
	const res = await appEmployeeInfoApi(route.query.userId as string);
	userInfo.value = res?.data;
};

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleAddBlack = async (row: any) => {
	ElMessageBox.prompt('加入之后，该用户不可预订运动场馆，请谨慎操作', '加入黑名单', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		inputPattern: /^.+$/,
		inputPlaceholder: '请输入加入黑名单原因，20字以内',
		inputErrorMessage: '请输入',
	}).then(async ({ value }) => {
		const params = {
			userId: row.userId,
			isBlack: !row.isBlack,
			blackReason: value,
		};
		const res = await appEmployeeUpdateApi(params);
		if (res?.ok) {
			getEmployeeInfo();
		} else {
			ElMessage.error(res?.msg || '操作失败');
		}
	});
};

const handleRemoveBlack = async (row: any) => {
	ElMessageBox.confirm('确认移出黑名单吗？移出后该用户可正常使用运动场馆', '移出黑名单', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		const params = {
			userId: row.userId,
			isBlack: !row.isBlack,
		};
		const res = await appEmployeeUpdateApi(params);
		if (res?.ok) {
			getEmployeeInfo();
		} else {
			ElMessage.error(res?.msg || '操作失败');
		}
	});
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

const dialogVisible = ref(false);
const currentRow = ref();
const viewDetails = async (row: any) => {
	dialogVisible.value = true;
	const { data } = await orderDetailApi(row.orderCode);
	currentRow.value = { ...data };
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.queryForm = {};
	state.queryForm.userId = route.query.userId;
	getDataList();
};

onMounted(() => {
	getEmployeeInfo();
});
</script>

<style scoped lang="scss"></style>
