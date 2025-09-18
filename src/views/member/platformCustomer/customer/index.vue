<template>
	<div v-show="type === 'list'">
		<div class="layout-padding" style="width: 100%">
			<div class="layout-padding-auto layout-padding-view">
				<el-row>
					<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
						<el-form-item label="消费场景" prop="consumeScene">
							<el-select v-model="state.queryForm.consumeScene" clearable style="width: 180px" placeholder="请选择消费场景">
								<el-option v-for="(item, index) in systemList" :key="index" :label="item.label" :value="item.value"></el-option>
							</el-select> </el-form-item
						><el-form-item label="用户ID" prop="unionId">
							<el-input placeholder="请输入用户ID" clearable style="width: 180px" v-model="state.queryForm.unionId" />
						</el-form-item>
						<el-form-item label="联系电话" prop="mobile">
							<el-input placeholder="请输入联系电话" clearable style="width: 180px" v-model="state.queryForm.mobile" />
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
					<el-table-column label="用户ID" prop="unionId" />
					<el-table-column label="联系电话" prop="mobile" width="150px">
						<template #default="{ row }">
							<span>{{ maskedMobile(row.mobile) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="注册时间" prop="registerTime" />
					<el-table-column label="首次消费时间" prop="firstConsumeTime" />
					<el-table-column label="最近消费时间" prop="lastConsumeTime" />
					<el-table-column label="操作">
						<template #default="{ row }">
							<el-button type="primary" link @click="toDetail(row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
			</div>
		</div>
	</div>
	<div v-show="type === 'detail'">
		<listDetail ref="listDetailRef" @changeType="changeType"></listDetail>
	</div>
</template>

<script lang="ts" setup name="manage-list">
import { getConsumeUsersForMember } from '/@/api/member/platformCustomer/customer';
import { BasicTableProps, useTable } from '/@/hooks/table';
import listDetail from './details.vue';

const listDetailRef = ref();
// 搜索变量
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: getConsumeUsersForMember,
	queryForm: {},
	dataList: [],
});
const systemList = ref([
	{
		value: 1,
		label: '轨道甄选',
	},
	{
		value: 2,
		label: '地铁文创',
	},
	{
		value: 3,
		label: '网订店取',
	},
	{
		value: 4,
		label: '到店支付',
	},
]);
let type = ref('list');
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
const changeType = () => {
	type.value = 'list';
	getDataList();
};
// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};
const maskedMobile = (mobile: any) => {
	console.log('mobile', mobile);
	if (mobile && mobile?.length === 11) {
		return mobile.slice(0, 3) + '****' + mobile.slice(7);
	}
	return mobile;
};
const toDetail = (row: any) => {
	listDetailRef.value.show(row);
	type.value = 'detail';
};
</script>
<style lang="scss" scoped></style>
