<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="下单时间" prop="orderTime">
						<el-date-picker
							v-model="orderTime"
							@change="changeOrderTime"
							type="datetimerange"
							range-separator="-"
							start-placeholder="请选择开始时间"
							end-placeholder="请选择结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							style="width: 380px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary"> 查询 </el-button>
						<el-button @click="resetQuery" icon="Refresh">重置</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="handleDownload" icon="download" type="primary"> 流水下载 </el-button>
				</div>
			</el-row>
			<el-table
				border
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="用户标识" prop="secretUserId" show-overflow-tooltip />
				<el-table-column label="兑换订单号" prop="orderCode" width="200" show-overflow-tooltip />
				<el-table-column label="消耗积分数" prop="points" width="120" show-overflow-tooltip />
				<el-table-column label="兑换代金券金额" prop="voucherAmount" show-overflow-tooltip width="140" />
				<el-table-column label="兑换手机号" prop="phoneNumber" show-overflow-tooltip width="120" />
				<el-table-column label="代金券下发UID" prop="uid" show-overflow-tooltip />
				<el-table-column label="兑换时间" prop="createTime" />
				<el-table-column label="操作" width="160">
					<template #default="{ row }">
						<el-button type="primary" link @click="handelViewUserPhoneNumber(row.userId)">查看用户手机号</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog title="用户信息" v-model="visibleDialog" :width="300" append-to-body> 用户手机号：{{ userPhoneNumber }} </el-dialog>
	</div>
</template>

<script lang="ts" name="systemDatasourceConf" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessageBox } from '/@/hooks/message';
import { getCMCCData, viewUserPhoneNumber } from '/@/api/operationConfig/chinaMobile';
import { downFileAddTask } from '/@/utils/other';
import { ElMessageBox } from 'element-plus';
const router = useRouter();

// 搜索变量
const queryRef = ref();
const orderTime = ref([]);
const visibleDialog = ref(false);
const userPhoneNumber = ref(null);

watch(
	() => orderTime.value,
	(val) => {
		if (val) {
			state.queryForm.createTimeStart = val[0];
			state.queryForm.createTimeEnd = val[1];
		} else {
			state.queryForm.createTimeStart = '';
			state.queryForm.createTimeEnd = '';
		}
	}
);

const changeOrderTime = (val: any) => {
	if (!val) {
		state.queryForm.createTimeStart = '';
		state.queryForm.createTimeEnd = '';
	}
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: getCMCCData,
	dataList: [],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handelViewUserPhoneNumber = (userId: string) => {
	if (userId) {
		viewUserPhoneNumber({
			userId,
		})
			.then((res) => {
				if (res.code == 0) {
					visibleDialog.value = true;
					userPhoneNumber.value = res.data.mobile;
				}
			})
			.catch((err) => {
				console.log('err', err);
			});
	}
};

// 下载订单
const handleDownload = async () => {
	const { createTimeStart, createTimeEnd } = state.queryForm;
	const query = {
		createTimeStart,
		createTimeEnd,
	};
	const { code } = await downFileAddTask('/open/cmcc/exportAll', query);
	if (code === 0) {
		try {
			await useMessageBox().confirm('下载任务已提交，请前往下载中心', '温馨提示');
		} catch {
			return;
		}
		router.push('/downloadCenter');
	}
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	orderTime.value = [];
	state.queryForm.createTimeStart = '';
	state.queryForm.createTimeEnd = '';
	getDataList();
};
</script>

<style>
.el-dialog__body {
	padding: 20px 0 !important;
}
</style>
