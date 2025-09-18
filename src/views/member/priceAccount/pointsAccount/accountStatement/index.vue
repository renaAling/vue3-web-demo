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
						<el-form-item label="流水号" prop="scoreSerialNumber">
							<el-input v-model="state.queryForm.scoreSerialNumber" placeholder="请输入流水号" />
						</el-form-item>
						<el-form-item label="用户ID" prop="unionId" maxlength="5">
							<el-input placeholder="请输入用户ID" clearable style="width: 180px" v-model="state.queryForm.unionId" />
						</el-form-item>
						<el-form-item label="联系电话" prop="mobile">
							<el-input placeholder="请输入联系电话" clearable style="width: 180px" v-model="state.queryForm.mobile" maxlength="11" />
						</el-form-item>
						<el-form-item label="类型" prop="type" placeholder="请选择类型">
							<el-select v-model="state.queryForm.type" clearable style="width: 180px">
								<el-option label="充值" :value="1">充值</el-option>
								<el-option label="扣减" :value="2">扣减</el-option>
								<el-option label="冻结" :value="3">冻结</el-option>
								<el-option label="清零" :value="4">清零</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="渠道" prop="channelCode" placeholder="请选择渠道">
							<el-select v-model="state.queryForm.channelCode" clearable style="width: 180px">
								<el-option :label="item.name" :value="item.id" v-for="item in channelListData" :key="item.code">{{ item.name }}</el-option>
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
					<el-table-column label="流水号" prop="scoreSerialNumber" />
					<el-table-column label="用户ID" prop="unionId" />
					<el-table-column label="用户昵称" prop="userName" />
					<el-table-column label="联系电话" prop="mobile" />
					<el-table-column label="变动积分" prop="changeScore" />
					<el-table-column label="变动前积分" prop="lastScore" />
					<el-table-column label="变动后积分" prop="currentScore" />
					<el-table-column label="类型" prop="type">
						<template #default="{ row }">
							<span v-if="row.type == 1">支出</span>
							<sapn v-if="row.type == 2">退款</sapn>
							<span v-if="row.type == 3">充值</span>
						</template>
					</el-table-column>
					<el-table-column label="使用渠道" prop="channelName">
					</el-table-column>
					<el-table-column label="事件" prop="eventName" />
					<el-table-column label="使用日期" prop="handleTime" />
					<el-table-column label="备注" prop="remark" show-overflow-tooltip />
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="type = 'list'"></listDetail>
	</div>
	<!-- <formDialog ref="formDialogRef" @refresh="getDataList" @addToDetail="toDetail"></formDialog> -->
</template>

<script lang="ts" setup name="manage-list">
import { getFlowPage } from '/@/api/member/priceAccount/pointsAccount';
import { channelList } from '/@/api/points/manage';

// import { getBackendUsersForMember, getChannelConfigList } from '/@/api/member/backendUsers/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage } from '/@/hooks/message';
// import listDetail from './details.vue';

// const formDialog = defineAsyncComponent(() => import('./form.vue'));
// const formDialogRef = ref();
const listDetailRef = ref();
const searchTime = ref<string[]>([]);
const channelListData = ref<any[]>([]); // 渠道类型
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getFlowPage,
	queryForm: {},
	dataList: [],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
let type = ref('list');
watch(
	() => searchTime.value,
	(val) => {
		if (val?.length > 0) {
			state.queryForm.handleStartTime = val[0];
			state.queryForm.handleEndTime = val[1];
		} else {
			state.queryForm.handleStartTime = '';
			state.queryForm.handleEndTime = '';
		}
	}
);
onMounted(() => {
	getChannelList(); // 渠道下拉
});
//  table hook

const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.handleStartTime = '';
	state.queryForm.handleEndTime = '';
	getDataList();
};

const toDetail = (unionId: string) => {
	listDetailRef.value.show(unionId);
	type.value = 'detail';
};

// 获取渠道下拉列表
const getChannelList = async () => {
	try {
		const { code, data } = await channelList();
		if (code === 0) {
			channelListData.value = data;
		}
	} catch (err: any) {
		console.log(err);
	}
};
</script>
<style lang="scss" scoped></style>
