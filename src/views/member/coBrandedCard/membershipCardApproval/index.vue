<template>
	<!-- 会员卡审核 -->
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="申请ID" prop="code">
							<el-input placeholder="请输入用户ID" clearable style="width: 180px" v-model="state.queryForm.code" />
						</el-form-item>
						<el-form-item label="申请时间" prop="searchTime">
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
						<el-form-item label="状态" prop="applyStatus" placeholder="请选择状态">
							<el-select v-model="state.queryForm.applyStatus" clearable style="width: 180px">
								<el-option v-for="(item, key) in approveMap" :label="item" :value="key">{{ item }}</el-option>
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
					<el-table-column label="申请ID" prop="code" />
					<el-table-column label="申请时间" prop="applyTime" />
					<el-table-column label="发起账户" prop="unionId" />
					<el-table-column label="状态" prop="applyStatus">
						<template #default="{ row }">
							<el-tag>{{ approveMap[String(row.applyStatus)] }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toDetails(row)" v-if="row.applyStatus != '2'">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="changeType" @refresh="getDataList"></listDetail>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { BasicTableProps, useTable } from '/@/hooks/table';
import listDetail from './details.vue';
import { cardPage } from '/@/api/member/cards';

const listDetailRef = ref();
// 搜索变量
const queryRef = ref();
const searchTime = ref<string[]>([]);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: cardPage,
	queryForm: {},
	dataList: [],
});
const approveMap = ref<Record<string, string>>({
	'1': '已发起',
	'2': '已撤回',
	'3': '已驳回',
	'4': '已通过',
});
let type = ref('list');
watch(
	() => searchTime.value,
	(val) => {
		if (val) {
			state.queryForm.applyStartTime = val[0] + ' 00:00:00';
			state.queryForm.applyEndTime = val[1] + ' 23:59:59';
		} else {
			state.queryForm.applyStartTime = '';
			state.queryForm.applyEndTime = '';
		}
	}
);
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const changeType = () => {
	type.value = 'list';
	getDataList();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	searchTime.value = [];
	state.queryForm.applyStartTime = '';
	state.queryForm.applyEndTime = '';
	getDataList();
};

const toDetails = (row: any) => {
	listDetailRef.value.show(row);
	type.value = 'detail';
};

const disabledDate = (date: any) => {
	return date.getTime() > Date.now();
};
</script>
<style lang="scss" scoped></style>
