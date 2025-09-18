<template>
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="选择时间" prop="userId">
							<el-date-picker
								v-model="searchTime"
								type="daterange"
								range-separator="-"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								value-format="YYYY-MM-DD"
								style="width: 270px"
								:disabled-date="disabledDate"
							/>
						</el-form-item>
						<el-form-item label="流水号" prop="transactionId">
							<el-input v-model="state.queryForm.transactionId" placeholder="请输入流水号" />
						</el-form-item>
						<el-form-item label="用户ID" prop="unionId" maxlength="5">
							<el-input placeholder="请输入用户ID" clearable style="width: 180px" v-model="state.queryForm.unionId" />
						</el-form-item>
						<el-form-item label="联系电话" prop="mobile">
							<el-input placeholder="请输入联系电话" clearable style="width: 180px" v-model="state.queryForm.mobile" maxlength="11" />
						</el-form-item>
						<el-form-item label="类型" prop="transactionType" placeholder="请选择类型">
							<el-select v-model="state.queryForm.transactionType" clearable style="width: 180px">
								<el-option label="支出" :value="1">支出</el-option>
								<el-option label="退款" :value="2">退款</el-option>
								<el-option label="充值" :value="3">充值</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="渠道" prop="channel" placeholder="请选择渠道">
							<el-select v-model="state.queryForm.channel" clearable style="width: 180px">
								<el-option label="轨道甄选" :value="1">轨道甄选</el-option>
								<el-option label="地铁文创" :value="2">地铁文创</el-option>
								<el-option label="网订店取" :value="3">网订店取</el-option>
								<el-option label="到店支付" :value="4">到店支付</el-option>
								<el-option label="后台" :value="5">后台</el-option>
								<el-option label="用户端" :value="6">用户端</el-option>
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
					<el-table-column type="index" width="60" align="center" label="序号" />
					<el-table-column label="流水号" prop="transactionId" />
					<el-table-column label="用户ID" prop="unionId" />
					<el-table-column label="用户昵称" prop="userName" />
					<el-table-column label="联系电话" prop="mobile" />
					<el-table-column label="变动积分" prop="amountChange" />
					<el-table-column label="变动前积分" prop="amountBefore" />
					<el-table-column label="变动后积分" prop="amountCurrent" />
					<el-table-column label="类型" prop="transactionType">
						<template #default="{ row }">
							<span v-if="row.userState == 1">支出</span>
							<sapn v-if="row.userState == 2">退款</sapn>
							<span v-if="row.userState == 3">充值</span>
						</template>
					</el-table-column>
					<el-table-column label="使用渠道" prop="channel">
						<template #default="{ row }">
							<span v-if="row.channel == 1">轨道甄选</span>
							<sapn v-if="row.channel == 2">地铁文创</sapn>
							<span v-if="row.channel == 3">网订店取</span>
							<span v-if="row.channel == 4">到店支付</span>
							<span v-if="row.channel == 5">后台</span>
							<span v-if="row.channel == 6">用户端</span>
						</template>
					</el-table-column>
					<el-table-column label="事件" prop="event" />
					<el-table-column label="使用日期" prop="usageDate" />
					<el-table-column label="备注" prop="remark" show-overflow-tooltip />
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="type = 'list'"></listDetail>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { getMemberUserCreditLogPage } from '/@/api/member/priceAccount/creditAccount';
import { BasicTableProps, useTable } from '/@/hooks/table';

const listDetailRef = ref();
const searchTime = ref<string[]>([]);
const channelList = ref<any[]>([]); // 渠道类型
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getMemberUserCreditLogPage,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
let type = ref('list');
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.startTime = val[0] + ' 00:00:00';
			state.queryForm.endTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.startTime = '';
			state.queryForm.endTime = '';
		}
	}
);
onMounted(() => {
	getChannelList(); // 渠道下拉
});
//  table hook
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.startTime = '';
	state.queryForm.endTime = '';
	getDataList();
};
const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};
// 获取渠道下拉列表
const getChannelList = async () => {
	// try {
	// 	const { code, data, msg } = await getChannelConfigList();
	// 	if (code === 0) {
	// 		getChannelList.value = data;
	// 	} else {
	// 		useMessage().error(msg);
	// 	}
	// } catch (err: any) {
	// 	useMessage().error(err.msg);
	// }
};
</script>
<style lang="scss" scoped></style>
